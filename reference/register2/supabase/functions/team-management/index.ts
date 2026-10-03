import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

type Registration = { id: string; registration_code: string; selected_day: string; status: string; selected_event_ids: string[]; participant: { name: string; email: string } };
type EventRow = { id: string; code: string; name: string; day: string; event_type: string; min_team_size: number; max_team_size: number };

const withSelectedEvents = async (db: any, registration: Omit<Registration, "selected_event_ids">): Promise<Registration> => {
  const { data, error } = await db.from("selected_event_registrations").select("event_id").eq("registration_id", registration.id);
  if (error) throw error;
  return { ...registration, selected_event_ids: (data || []).map((row: any) => row.event_id) };
};

const findRegistration = async (db: any, identity: string): Promise<Registration | null> => {
  if (identity.includes("@")) {
    const { data } = await db.from("participants").select("name,email,registrations(id,registration_code,selected_day,status)").ilike("email", identity.toLowerCase()).maybeSingle();
    const row = data?.registrations?.[0];
    return row ? withSelectedEvents(db, { ...row, participant: { name: data.name, email: data.email } }) : null;
  }
  const { data } = await db.from("registrations").select("id,registration_code,selected_day,status,participants!inner(name,email)").eq("registration_code", identity.toUpperCase()).maybeSingle();
  return data ? withSelectedEvents(db, { ...data, participant: data.participants }) : null;
};

const verifiedRegistration = async (db: any, identity: string) => {
  const registration = await findRegistration(db, identity);
  if (!registration) throw new Error("user not found");
  const { data: payment } = await db.from("payments").select("status").eq("registration_id", registration.id).maybeSingle();
  if (registration.status !== "CONFIRMED" || payment?.status !== "VERIFIED") throw new Error(`${registration.participant.name} not yet verified`);
  return registration;
};

const packagesForDay = (events: EventRow[], day: string, selectedEventIds: string[]) => {
  const groups = new Map<string, EventRow[]>();
  events.filter(event => event.day === day && event.event_type === "TEAM" && selectedEventIds.includes(event.id)).forEach(event => {
    const key = String(event.max_team_size);
    groups.set(key, [...(groups.get(key) || []), event]);
  });
  return Array.from(groups.entries()).map(([key, group]) => ({
    id: `${day}:${key}`,
    day,
    min_size: Math.max(2, ...group.map(event => event.min_team_size)),
    max_size: Math.min(3, group[0].max_team_size),
    events: group.map(event => ({ id: event.id, code: event.code, name: event.name, min_team_size: event.min_team_size, max_team_size: event.max_team_size }))
  })).filter(item => item.min_size <= item.max_size);
};

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const body = await request.json();
    const action = String(body.action || "");
    const identity = String(body.identity || "").trim();
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    if (action === "verify") {
      const registration = await verifiedRegistration(db, identity);
      const { data: events, error } = await db.from("events").select("id,code,name,day,event_type,min_team_size,max_team_size").eq("status", "ACTIVE").order("code");
      if (error) throw error;
      return json({ success: true, registration: { id: registration.id, registration_code: registration.registration_code, selected_day: registration.selected_day, participant_name: registration.participant.name }, packages: { DAY_1: packagesForDay(events || [], "DAY_1", registration.selected_event_ids), DAY_2: packagesForDay(events || [], "DAY_2", registration.selected_event_ids) } });
    }

    const registration = await verifiedRegistration(db, identity);
    const day = String(body.day || "");
    if (!["DAY_1", "DAY_2"].includes(day) || !(registration.selected_day === "BOTH" || registration.selected_day === day)) throw new Error(`${registration.participant.name} is not registered for the selected day.`);

    const { data: allEvents, error: eventError } = await db.from("events").select("id,code,name,day,event_type,min_team_size,max_team_size").eq("status", "ACTIVE").eq("day", day);
    if (eventError) throw eventError;
    const packages = packagesForDay(allEvents || [], day, registration.selected_event_ids);
    const selectedPackage = packages.find(item => item.id === body.package_id);
    if (!selectedPackage) throw new Error("Select a valid team event package.");

    if (action === "create") {
      const requestedEventIds = Array.isArray(body.selected_event_ids)
        ? body.selected_event_ids.map((value: unknown) => String(value))
        : [];
      const selectedEventIds = Array.from(new Set(requestedEventIds));
      if (!selectedEventIds.length || selectedEventIds.length !== requestedEventIds.length
        || selectedEventIds.some(eventId => !selectedPackage.events.some(event => event.id === eventId))) {
        throw new Error("Select one or more valid events from this team package.");
      }
      const selectedEvents = selectedPackage.events.filter(event => selectedEventIds.includes(event.id));
      const teamSize = Number(body.team_size);
      const minTeamSize = Math.max(2, ...selectedEvents.map(event => event.min_team_size));
      const maxTeamSize = Math.min(3, ...selectedEvents.map(event => event.max_team_size));
      if (!Number.isInteger(teamSize) || teamSize < minTeamSize || teamSize > maxTeamSize) throw new Error(`Choose a team size between ${minTeamSize} and ${maxTeamSize}.`);
      const memberIdentities = Array.isArray(body.members) ? body.members.map((value: unknown) => String(value || "").trim()).filter(Boolean) : [];
      const uniqueIdentities = Array.from(new Set([identity, ...memberIdentities]));
      if (uniqueIdentities.length !== teamSize) throw new Error(`This team requires exactly ${teamSize} verified members.`);
      const members = [];
      for (const memberIdentity of uniqueIdentities) {
        const member = await verifiedRegistration(db, memberIdentity);
        if (!(member.selected_day === "BOTH" || member.selected_day === day)) throw new Error(`${member.participant.name} is not registered for the selected day.`);
        if (!selectedEventIds.every(eventId => member.selected_event_ids.includes(eventId))) throw new Error(`${member.participant.name} has not selected every event chosen for this team.`);
        members.push(member);
      }
      const memberIds = members.map(member => member.id);
      const { data: existingMemberships, error: membershipError } = await db.from("team_members").select("team_id,registration_id,registrations(participants(name))").in("registration_id", memberIds);
      if (membershipError) throw membershipError;
      const existingTeamIds = Array.from(new Set((existingMemberships || []).map((row: any) => row.team_id)));
      const { data: existingPackages, error: existingPackagesError } = existingTeamIds.length
        ? await db.from("event_team_packages").select("team_id,event_id").in("team_id", existingTeamIds).in("event_id", selectedEventIds)
        : { data: [], error: null };
      if (existingPackagesError) throw existingPackagesError;
      const conflictingMembers = (existingMemberships || []).filter((member: any) =>
        existingPackages?.some((teamEvent: any) => teamEvent.team_id === member.team_id)
      );
      if (conflictingMembers.length) {
        const names = Array.from(new Set(conflictingMembers.map((row: any) => row.registrations?.participants?.name || "Unknown member"))).join(", ");
        throw new Error(`${names} already in team for the same event`);
      }
      const teamName = String(body.team_name || "").trim();
      if (!teamName) throw new Error("Enter a team name.");
      const teamEvents = selectedEvents;
      const teamCode = `${day}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const { data: createdTeams, error: createError } = await db.rpc("create_event_team_atomic", {
        p_event_id: teamEvents[0].id,
        p_team_code: teamCode,
        p_team_name: teamName,
        p_leader_registration_id: registration.id,
        p_max_members: teamSize,
        p_event_ids: teamEvents.map(event => event.id),
        p_registration_ids: members.map(member => member.id)
      });
      if (createError) throw createError;
      const team = Array.isArray(createdTeams) ? createdTeams[0] : createdTeams;
      if (!team?.id) throw new Error("Team creation did not return a saved team.");
      return json({ success: true, message: `Team created for ${teamEvents.map(event => event.name).join(" and ")}.`, team: { ...team, package_events: teamEvents } });
    }

    if (action === "list") {
      const { data: teams, error } = await db.from("event_team_packages").select("team_id,event_id,event_teams(id,team_code,team_name,status,max_members,leader_registration_id,team_members(count))").in("event_id", selectedPackage.events.map(event => event.id));
      if (error) throw error;
      const seen = new Set<string>();
      const results = [];
      for (const row of teams || []) {
        const team = row.event_teams as any;
        if (!team || seen.has(team.id)) continue;
        const { data: teamPackage, error: teamPackageError } = await db.from("event_team_packages").select("event_id").eq("team_id", team.id);
        if (teamPackageError) throw teamPackageError;
        const teamEventIds = (teamPackage || []).map((item: any) => item.event_id).sort();
        const selectedPackageEventIds = selectedPackage.events.map(event => event.id).sort();
        if (!teamEventIds.length || !teamEventIds.every(eventId => selectedPackageEventIds.includes(eventId))
          || !teamEventIds.every(eventId => registration.selected_event_ids.includes(eventId))) continue;
        seen.add(team.id);
        const count = team.team_members?.[0]?.count || 0;
        const { data: leader, error: leaderError } = await db.from("registrations").select("participants(name)").eq("id", team.leader_registration_id).maybeSingle();
        if (leaderError) throw leaderError;
        results.push({ team_code: team.team_code, team_name: team.team_name, leader_name: leader?.participants?.name || "Team leader", member_count: count, max_members: team.max_members, package_events: teamEventIds.map(eventId => selectedPackage.events.find(event => event.id === eventId)?.name).filter(Boolean), full: count >= team.max_members || team.status !== "OPEN" });
      }
      return json({ success: true, teams: results });
    }

    if (action === "join") {
      const teamCode = String(body.team_code || "").trim().toUpperCase();
      const { data: team, error: teamError } = await db.from("event_teams").select("id,team_code,team_name,status,max_members,team_members(count)").eq("team_code", teamCode).maybeSingle();
      if (teamError) throw teamError;
      if (!team || team.status !== "OPEN") throw new Error("Open team was not found.");
      const count = team.team_members?.[0]?.count || 0;
      if (count >= team.max_members) throw new Error("This team is already full.");
      const { data: packageRows, error: packageRowsError } = await db.from("event_team_packages").select("event_id").eq("team_id", team.id);
      if (packageRowsError) throw packageRowsError;
      const teamEventIds = (packageRows || []).map((row: any) => row.event_id).sort();
      const selectedPackageEventIds = selectedPackage.events.map(event => event.id).sort();
      if (!teamEventIds.length || !teamEventIds.every(eventId => selectedPackageEventIds.includes(eventId))) throw new Error("This team belongs to a different event package.");
      if (!teamEventIds.every(eventId => registration.selected_event_ids.includes(eventId))) throw new Error("You have not selected every event in this team package.");
      const { data: existingMemberships, error: membershipError } = await db.from("team_members").select("team_id,registrations(participants(name))").eq("registration_id", registration.id);
      if (membershipError) throw membershipError;
      const existingTeamIds = Array.from(new Set((existingMemberships || []).map((row: any) => row.team_id)));
      const { data: existingPackages, error: existingPackagesError } = existingTeamIds.length
        ? await db.from("event_team_packages").select("team_id,event_id").in("team_id", existingTeamIds).in("event_id", teamEventIds)
        : { data: [], error: null };
      if (existingPackagesError) throw existingPackagesError;
      if (existingPackages?.length) throw new Error(`${registration.participant.name} already in team for the same event`);
      const { error } = await db.from("team_members").insert({ team_id: team.id, registration_id: registration.id, member_role: "MEMBER" });
      if (error) throw error;
      return json({ success: true, message: `Joined ${team.team_name}.` });
    }
    return json({ error: "Unsupported team action." }, 400);
  } catch (error) {
    const details = error as { message?: string; details?: string; hint?: string; code?: string };
    const message = error instanceof Error
      ? error.message
      : details?.message || details?.details || details?.hint || (details?.code ? `Request failed (${details.code}).` : "Team request failed.");
    return json({ error: message }, 400);
  }
});
