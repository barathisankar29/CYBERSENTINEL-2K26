import React, { useEffect, useRef, useState } from 'react';
import type { ModuleId } from '@/types/eventsTerminal';
import {
  createTeam,
  getLastRegistration,
  verifyTeamMember,
  type TeamCreateResponse,
  type TeamDay,
  type TeamPackage,
  type TeamVerifyResponse
} from '@/services/registration';
import { sound } from '../sound';
import { eventSizeRange } from '../teamEventSize';
import { Award, CheckCircle, Shield, Users } from 'lucide-react';
import { RegistrationRulesModal } from '@/components/registration/RegistrationRulesModal';

interface TeamCreationScreenProps {
  /** Registration ID to verify as leader (from My Registrations) */
  selectedRegId?: string | null;
  /** Event name to pre-tick (when arriving from that event's page) */
  selectedEventName?: string | null;
  onSelectModule?: (mod: ModuleId) => void;
}

const DAY_LABELS: Record<TeamDay, string> = { DAY_1: 'DAY 1', DAY_2: 'DAY 2' };

type Leader = { identity: string; data: TeamVerifyResponse };

type DayEvent = TeamPackage['events'][number] & { packageId: string };

/** Every team event on the day, each remembering which backend package it belongs to. */
function dayEventsOf(packages: TeamPackage[]): DayEvent[] {
  return packages.flatMap((pkg) => pkg.events.map((ev) => ({ ...ev, packageId: pkg.id })));
}

/**
 * What the ticked events allow. team-management groups events into packages
 * by team size and creates a team for ONE package, so every ticked event
 * must come from the same package, and the team size must suit all of them.
 */
function selectionInfo(packages: TeamPackage[], ids: string[]) {
  const events = dayEventsOf(packages).filter((ev) => ids.includes(ev.id));
  const packageIds = [...new Set(events.map((ev) => ev.packageId))];
  const ranges = events.map(eventSizeRange);
  const min = events.length ? Math.max(...ranges.map(([lo]) => lo)) : 0;
  const max = events.length ? Math.min(...ranges.map(([, hi]) => hi)) : 0;
  const valid = events.length > 0 && packageIds.length === 1 && min <= max;
  return { events, packageId: valid ? packageIds[0] : '', min, max, valid };
}

/** "2 members" or "2-3 members". */
function sizeLabel(min: number, max: number): string {
  return min === max ? `${min} member${min === 1 ? '' : 's'}` : `${min}-${max} members`;
}
type CreatedTeam = TeamCreateResponse['team'] & { members: { name: string; code: string; role: 'LEADER' | 'MEMBER' }[] };

/**
 * Team creation from the events-terminal design, driven by the backend
 * team's `team-management` Edge Function (create mode only — Join Team is
 * intentionally not part of this frontend). The backend enforces every
 * rule: leader and each member must have VERIFIED payment + CONFIRMED
 * registration, be registered for the chosen day, match the package size
 * exactly, and not already be in a team for the same event. Members are
 * therefore identified by their registered email or Registration ID.
 */
export const TeamCreationScreen: React.FC<TeamCreationScreenProps> = ({
  selectedRegId,
  selectedEventName
}) => {
  const [identity, setIdentity] = useState(() => selectedRegId || getLastRegistration()?.code || '');
  const [leader, setLeader] = useState<Leader | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [day, setDay] = useState<TeamDay | ''>('');
  // The events this team plays, ticked one by one (sent as selected_event_ids).
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  // Leader-chosen team size, within what every ticked event allows (team-management `team_size`).
  const [teamSize, setTeamSize] = useState(0);
  const [members, setMembers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedTeam | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const autoVerified = useRef(false);

  const packages: TeamPackage[] = leader && day ? leader.data.packages[day] ?? [] : [];
  const dayEvents = dayEventsOf(packages);
  const selection = selectionInfo(packages, checkedIds);
  const selectedPackage = packages.find((item) => item.id === selection.packageId);
  const eventNames = selection.events.map((ev) => ev.name).join(' + ');
  // Why the ticked events can't form one team (they need different team sizes).
  const conflictMessage =
    selection.events.length > 0 && !selection.valid
      ? `${selection.events.map((ev) => `${ev.name} (${sizeLabel(...eventSizeRange(ev))})`).join(', ')} need different team sizes. Create a separate team for each size.`
      : null;

  const fail = (message: string) => {
    sound.playError();
    setErrorMsg(message);
  };

  // Changing the size keeps what was already typed for the remaining members.
  const chooseSize = (size: number) => {
    setTeamSize(size);
    setMembers((prev) => Array.from({ length: Math.max(size - 1, 0) }, (_, i) => prev[i] ?? ''));
  };

  // New ticks: keep the chosen size if every ticked event still allows it,
  // otherwise move to the smallest size they all allow.
  const applySelection = (list: TeamPackage[], ids: string[]) => {
    setCheckedIds(ids);
    const info = selectionInfo(list, ids);
    const size = info.valid ? (teamSize >= info.min && teamSize <= info.max ? teamSize : info.min) : 0;
    chooseSize(size);
  };

  const toggleEvent = (id: string) => {
    sound.playNavClick();
    applySelection(packages, checkedIds.includes(id) ? checkedIds.filter((x) => x !== id) : [...checkedIds, id]);
  };

  // Picking a day clears the ticks, except the event the visitor came from (if it runs that day).
  const chooseDay = (data: TeamVerifyResponse | undefined, nextDay: TeamDay | '') => {
    const list = data && nextDay ? data.packages[nextDay] ?? [] : [];
    const preset = selectedEventName
      ? dayEventsOf(list)
          .filter((ev) => ev.name.toLowerCase() === selectedEventName.toLowerCase())
          .map((ev) => ev.id)
      : [];
    setDay(nextDay);
    applySelection(list, preset);
  };

  const sizeOptions = selection.valid
    ? Array.from({ length: selection.max - selection.min + 1 }, (_, i) => selection.min + i)
    : [];

  const verifyLeader = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return fail('Enter your registered email or Registration ID.');
    setErrorMsg(null);
    setCreated(null);
    setVerifying(true);
    try {
      const data = await verifyTeamMember(trimmed);
      setLeader({ identity: trimmed, data });
      const selected = data.registration.selected_day;
      chooseDay(data, selected === 'DAY_1' || selected === 'DAY_2' ? selected : '');
      sound.playSuccess();
    } catch (error) {
      setLeader(null);
      fail(error instanceof Error ? error.message : 'Team request failed.');
    } finally {
      setVerifying(false);
    }
  };

  // Coming from My Registrations with a Registration ID: verify straight away.
  useEffect(() => {
    if (selectedRegId && !autoVerified.current) {
      autoVerified.current = true;
      void verifyLeader(selectedRegId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leader || !day) return fail('Select a day.');
    if (!checkedIds.length) return fail('Tick at least one event for this team.');
    if (!selection.valid || !selectedPackage) return fail(conflictMessage ?? 'These events cannot share one team.');
    if (!teamName.trim()) return fail('Enter a team name.');
    if (!teamSize) return fail('Choose a team size.');
    if (members.some((value) => !value.trim())) return fail(`Enter all ${teamSize - 1} other team members.`);
    // Package order, as the backend lists them.
    const selectedEventIds = selectedPackage.events.filter((ev) => checkedIds.includes(ev.id)).map((ev) => ev.id);
    const memberIds = members.map((value) => value.trim());

    setErrorMsg(null);
    setSubmitting(true);
    try {
      // Same pre-check as the backend team's client: every member verified
      // and registered for this day. The Edge Function re-checks all of it.
      const registrations = await Promise.all([leader.identity, ...memberIds].map((value) => verifyTeamMember(value)));
      const ineligible = registrations.find(
        (data) => data.registration.selected_day !== 'BOTH' && data.registration.selected_day !== day
      );
      if (ineligible) throw new Error(`${ineligible.registration.participant_name} is not registered for ${DAY_LABELS[day]}.`);

      const result = await createTeam({
        identity: leader.identity,
        members: memberIds,
        day,
        packageId: selectedPackage.id,
        teamSize,
        teamName: teamName.trim(),
        selectedEventIds
      });
      // register2 team.js: an older hosted function ignores selected_event_ids
      // and saves the whole package — tell the leader instead of hiding it.
      const savedIds = result.team?.package_events?.map((ev) => ev.id) ?? [];
      if (savedIds.length !== selectedEventIds.length || selectedEventIds.some((id) => !savedIds.includes(id))) {
        throw new Error(
          'The team may have been created, but the server saved a different event selection. Do not create it again; ask an administrator to correct this team.'
        );
      }
      sound.playSuccess();
      setCreated({
        ...result.team,
        members: registrations.map((data, index) => ({
          name: data.registration.participant_name,
          code: data.registration.registration_code,
          role: index === 0 ? 'LEADER' : 'MEMBER'
        }))
      });
    } catch (error) {
      fail(error instanceof Error ? error.message : 'Team request failed.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="w-full relative" data-purpose="create-team-screen-content">
      {/* Header Dither Bar */}
      <section className="pixel-dither-bar h-12 w-full flex items-center justify-between px-3 sm:px-4 mb-6 select-none">
        <h1 className="font-pixel text-black text-xs sm:text-lg tracking-wider font-extrabold flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="inline-block w-3 h-3 bg-black shrink-0" />
          <span className="truncate">CREATE TEAM // CYBERSENTINEL 2K26</span>
        </h1>
        <div className="flex items-center gap-2 relative z-10 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => {
              sound.playNavClick();
              setShowRulesModal(true);
            }}
            className="text-black hover:text-white px-2 sm:px-2.5 py-1 border-2 border-black bg-white/20 hover:bg-black font-arcade text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs whitespace-nowrap cursor-pointer"
            title="View Registration & Event Rulebook"
          >
            <span>[📜]</span>
            <span className="hidden sm:inline">RULES BOOK</span>
            <span className="inline sm:hidden">RULES</span>
          </button>
        </div>
        <div aria-hidden="true" className="pixel-dither-fade" />
      </section>

      <div className="space-y-4">
        {/* EVENT NAME | TEAM SIZE | ELIGIBILITY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6" data-purpose="team-metadata-row">
          <div className="bg-[#07050d] border-2 border-[#9933ff] p-3 flex flex-col justify-between shadow-[0_0_10px_rgba(153,51,255,0.2)] min-w-0">
            <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen block tracking-wider">[EVENT NAME]</span>
            <span className="font-pixel text-white text-xs sm:text-sm font-bold mt-1 break-words">
              {eventNames || 'TICK THE EVENTS'}
            </span>
            <span className="text-[9px] font-mono text-[#c084fc] mt-0.5 truncate">
              PASS: {leader?.data.registration.registration_code ?? '—'}
            </span>
          </div>

          <div className="bg-[#07050d] border border-[#2d123d] p-3 flex flex-col justify-between">
            <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen block tracking-wider">[TEAM SIZE]</span>
            <span className="font-pixel text-[#ff007f] text-xs sm:text-sm font-bold truncate mt-1">
              {selection.valid ? `${teamSize} MEMBERS` : '—'}
            </span>
            <span className="text-[9px] font-mono text-gray-400 mt-0.5">
              {selection.valid ? `LEADER + ${Math.max(teamSize - 1, 0)} MEMBERS · ALLOWED ${sizeLabel(selection.min, selection.max).toUpperCase()}` : 'LEADER + MEMBERS'}
            </span>
          </div>

          <div className="bg-[#07050d] border border-[#2d123d] p-3 flex flex-col justify-between">
            <span className="text-gray-400 text-[9px] sm:text-[10px] font-silkscreen block tracking-wider">[ELIGIBILITY]</span>
            <span className="font-pixel text-[#c084fc] text-[11px] sm:text-xs font-bold leading-tight mt-1">
              {day ? `${DAY_LABELS[day]} REGISTRATION + VERIFIED PAYMENT` : 'VERIFIED PAYMENT REQUIRED'}
            </span>
            <span className={`text-[9px] font-mono mt-0.5 flex items-center gap-1 ${leader ? 'text-[#00ff66]' : 'text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${leader ? 'bg-[#00ff66]' : 'bg-gray-600'}`} />
              LEADER: {leader ? 'PAYMENT VERIFIED' : 'NOT VERIFIED YET'}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-950/80 border border-red-500 text-red-200 text-sm font-oswald font-medium tracking-wide flex items-start gap-2" role="alert">
            <span className="text-red-400 shrink-0">► ERROR:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {created ? (
          /* ===== Team created (returned by the backend) ===== */
          <div className="space-y-4 pt-2" data-purpose="team-preview-mode">
            {/* Team Name (Left Cyan Box) & Verified Status (Right Green Box) */}
            <div className="flex items-center justify-between gap-3 font-oswald font-medium">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00ffff]/10 border border-[#00ffff] text-[#00ffff] text-sm sm:text-base font-medium tracking-wider min-w-0">
                <span className="text-xs opacity-85">TEAM:</span>
                <span className="truncate">{created.team_name}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-sm sm:text-base font-medium tracking-wider shrink-0">
                <CheckCircle className="w-4 h-4 text-[#00ff66]" />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* Backend team code + the events this team is for */}
            <div className="flex flex-wrap items-center gap-1.5 font-oswald font-medium tracking-wider text-xs sm:text-sm">
              <span className="text-slate-300 select-text">
                CODE: <span className="text-[#00ff66]">{created.team_code}</span>
              </span>
              {created.package_events.map((ev) => (
                <span key={ev.id} className="px-2 py-0.5 border border-[#7c3aed] text-[#e9d5ff]">
                  {ev.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-oswald font-medium">
              {created.members.map((member, idx) => (
                <div
                  key={member.code}
                  className={`p-3.5 sm:p-4 border-2 bg-[#0a0614] flex flex-col justify-between relative ${
                    idx === 0 ? 'border-[#ff007f] shadow-[0_0_12px_rgba(255,0,127,0.25)]' : 'border-[#3b235a]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#26173e]">
                    <span
                      className={`font-oswald font-medium text-xs sm:text-sm px-2.5 py-0.5 tracking-wider uppercase ${
                        idx === 0 ? 'bg-[#ff007f] text-white' : 'bg-[#1b1030] text-[#e9d5ff] border border-[#7c3aed]'
                      }`}
                    >
                      {idx === 0 ? '★ TEAM LEADER (MEMBER #1)' : `MEMBER #${idx + 1}`}
                    </span>
                    <span className="font-oswald font-medium text-slate-300 text-xs sm:text-sm tracking-wider">
                      ID #{idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm font-oswald font-medium tracking-wide">
                    <div className="min-w-0">
                      <span className="text-slate-400 text-xs font-medium tracking-wider block mb-0.5">1. NAME</span>
                      <span className="text-white font-medium text-sm sm:text-base truncate block">{member.name}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-400 text-xs font-medium tracking-wider block mb-0.5">2. REG. ID</span>
                      <span className="text-[#00ffff] font-medium text-sm sm:text-base truncate block select-text">
                        {member.code}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ===== Step 1: verify leader ===== */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sound.playNavClick();
                void verifyLeader(identity);
              }}
              className="bg-[#0a0614] border-2 border-[#ff007f] p-3.5 shadow-[0_0_12px_rgba(255,0,127,0.2)] font-oswald font-medium"
            >
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#26173e]">
                <span className="font-oswald font-medium text-xs sm:text-sm px-2.5 py-0.5 tracking-wider uppercase bg-[#ff007f] text-white shadow-[0_0_8px_rgba(255,0,127,0.5)]">
                  ★ TEAM LEADER (MEMBER #1)
                </span>
                {leader && (
                  <span className="text-[#00ff66] font-oswald font-medium tracking-wider text-xs sm:text-sm flex items-center gap-1">
                    <Shield className="w-3 h-3" /> VERIFIED
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="team-leader" className="sr-only">
                  Your registered email or Registration ID
                </label>
                <input
                  id="team-leader"
                  type="text"
                  value={identity}
                  onChange={(e) => {
                    setIdentity(e.target.value);
                    if (leader) setLeader(null);
                  }}
                  placeholder="Your registered email or Registration ID"
                  className="flex-1 bg-black border border-[#3b235a] focus:border-[#ff007f] text-white px-2.5 py-2 text-sm font-oswald font-medium tracking-wide focus:outline-hidden select-text"
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="px-4 py-2 bg-[#12071f] border border-[#7c3aed] hover:border-white text-[#c084fc] hover:text-white font-pixel text-[10px] tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {verifying ? 'VERIFYING...' : leader ? 'RE-VERIFY' : 'VERIFY LEADER'}
                </button>
              </div>
              {leader && (
                <p className="mt-2 text-xs sm:text-sm font-oswald font-medium tracking-wide text-slate-300">
                  <strong className="text-white">{leader.data.registration.participant_name}</strong> · {leader.data.registration.registration_code} · Registered for{' '}
                  {leader.data.registration.selected_day.replace('_', ' ')}
                </p>
              )}
            </form>

            {/* ===== Step 2: configure team ===== */}
            {leader && (
              <form onSubmit={handleCreate} className="space-y-4 pt-1 font-oswald font-medium" data-purpose="team-creation-form">
                <div className="bg-[#0a0614] border border-[#2d1b46] p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label htmlFor="team-name" className="text-slate-200 font-oswald font-medium text-sm tracking-wider flex items-center gap-1.5 mb-1">
                      <Award className="w-4 h-4 text-[#ff007f]" />
                      <span>TEAM / SQUAD NAME</span>
                    </label>
                    <input
                      id="team-name"
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. CYBER_SQUAD_01"
                      className="w-full bg-black border border-[#7c3aed] text-white px-3 py-2 text-sm font-oswald font-medium tracking-wide focus:border-[#00ffff] focus:outline-hidden select-text"
                    />
                  </div>
                  <div>
                    <label htmlFor="team-day" className="text-slate-200 font-oswald font-medium text-sm tracking-wider block mb-1">
                      DAY
                    </label>
                    <select
                      id="team-day"
                      value={day}
                      onChange={(e) => chooseDay(leader.data, e.target.value as TeamDay | '')}
                      className="w-full bg-black border border-[#7c3aed] text-white px-3 py-2 text-sm font-oswald font-medium tracking-wide focus:border-[#00ffff] focus:outline-hidden cursor-pointer"
                    >
                      <option value="">Select day</option>
                      <option value="DAY_1">Day 1</option>
                      <option value="DAY_2">Day 2</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="team-size" className="text-slate-200 font-oswald font-medium text-sm tracking-wider block mb-1">
                      TEAM SIZE
                    </label>
                    <select
                      id="team-size"
                      value={teamSize || ''}
                      onChange={(e) => chooseSize(Number(e.target.value))}
                      disabled={!selection.valid}
                      className="w-full bg-black border border-[#7c3aed] text-white px-3 py-2 text-sm font-oswald font-medium tracking-wide focus:border-[#00ffff] focus:outline-hidden cursor-pointer disabled:opacity-50"
                    >
                      {!selection.valid && <option value="">Tick events first</option>}
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size} members
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* One checkbox per event: the events this team will play. */}
                {day && (
                  <fieldset className="bg-[#0a0614] border border-[#2d1b46] p-3" data-purpose="team-event-choices">
                    <legend className="px-1 text-slate-200 font-oswald font-medium text-sm tracking-wider">
                      EVENTS THIS TEAM WILL PLAY
                    </legend>
                    {dayEvents.length === 0 ? (
                      <p className="text-xs sm:text-sm text-slate-400 tracking-wide">
                        No team events you registered for run on {DAY_LABELS[day]}.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 tracking-wide mb-2.5">
                          Tick every event this team will participate in. Each member must also be registered for each ticked event.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dayEvents.map((ev) => {
                            const isChecked = checkedIds.includes(ev.id);
                            const [min, max] = eventSizeRange(ev);
                            return (
                              <label
                                key={ev.id}
                                aria-label={ev.name}
                                className={`flex items-start gap-3 px-3 py-2.5 border cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'border-[#00ff66] bg-[#00ff66]/5'
                                    : 'border-[#3b235a] bg-black/50 hover:border-[#7c3aed]'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleEvent(ev.id)}
                                  className="mt-0.5 w-4 h-4 accent-[#00ff66] cursor-pointer shrink-0"
                                />
                                <span className="flex flex-col min-w-0">
                                  <span className="font-pixel text-xs text-white uppercase break-words">{ev.name}</span>
                                  <span className="text-[10px] font-mono text-gray-400">
                                    {ev.code} · {sizeLabel(min, max).toUpperCase()}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {conflictMessage && (
                          <p className="mt-2.5 text-xs sm:text-sm text-amber-300 tracking-wide" role="alert">
                            {conflictMessage}
                          </p>
                        )}
                      </>
                    )}
                  </fieldset>
                )}

                {members.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm font-oswald font-medium tracking-wider text-slate-300 px-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> TEAM MEMBERS ({members.length})
                      </span>
                      <span className="text-[#00ffff]">EACH MUST BE REGISTERED WITH VERIFIED PAYMENT</span>
                    </div>

                    {members.map((value, index) => (
                      <div key={index} className="border-2 p-3.5 bg-[#090514] border-[#3b235a] hover:border-[#7c3aed] transition-all">
                        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#26173e]">
                          <span className="font-oswald font-medium text-xs sm:text-sm px-2.5 py-0.5 tracking-wider uppercase bg-[#1b0d30] text-[#e9d5ff] border border-[#7c3aed]">
                            MEMBER #{index + 2}
                          </span>
                        </div>
                        <label htmlFor={`team-member-${index}`} className="text-slate-300 text-xs font-oswald font-medium tracking-wider block mb-1">
                          REGISTERED EMAIL OR REGISTRATION ID <span className="text-[#ff007f]">*</span>
                        </label>
                        <input
                          id={`team-member-${index}`}
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setMembers((prev) => prev.map((item, i) => (i === index ? e.target.value : item)))
                          }
                          placeholder="name@college.edu or registration ID"
                          className="w-full bg-black border border-[#3b235a] focus:border-[#c084fc] text-white px-2.5 py-2 text-sm font-oswald font-medium tracking-wide focus:outline-hidden select-text"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !selection.valid}
                    className="arcade-cta w-full py-3.5 px-6 font-pixel text-white text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 transition-transform cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    data-purpose="confirm-team-button"
                  >
                    <span>&gt;&gt;</span>
                    <span>{submitting ? 'CHECKING MEMBERS...' : 'CREATE TEAM'}</span>
                    <span>&lt;&lt;</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {showRulesModal && (
        <RegistrationRulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
};
