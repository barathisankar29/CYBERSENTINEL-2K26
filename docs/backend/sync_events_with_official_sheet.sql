-- =============================================================================
-- CyberSentinel 2K26 — sync the backend event list with the official sheet
-- (CYBERSENTINEL2K26_SYMPOSIUM_EVENT_DETAILS.pdf) and add E-Sports.
--
-- For: the Supabase project owner (backend team). Run in the Supabase
-- Dashboard -> SQL Editor. Frontend: this repo's events terminal.
--
-- Read-only snapshot of public.events taken before writing this (6 rows):
--   PP Paper Presentation  DAY_1 TEAM 3-3      <- sheet: max 4 members
--   SC Scrambled Code      DAY_1 INDIVIDUAL    <- NOT in the sheet
--   UX UI/UX               DAY_1 TEAM 2-3      <- NOT in the sheet
--   FB Find BGM            DAY_2 TEAM 2-3
--   SL Spot Light          DAY_2 INDIVIDUAL
--   TH Treasure hunt       DAY_2 TEAM 2-3      <- NOT in the sheet
-- special_events: TC Thiruvizha Corner (590), GD "Ground Dance" (590, typo)
--
-- What this script does (one transaction — all or nothing):
--   1. Updates the 3 events that are on the sheet (names / sizes / times).
--   2. Adds the 7 sheet events that are missing, plus E-Sports.
--   3. Deactivates Scrambled Code, Treasure hunt, UI/UX. NOT deleted, so
--      any existing registrations/teams that reference them stay intact.
--   4. Special events: fixes "Ground Dance" -> "Group Dance" and sets the fees
--      (Group Dance 696, Thiruvizha Corner 590).
--   5. Day pass fees: Day 1 = 200, Day 2 = 200. "Both days" is not stored —
--      public-register charges DAY_1 + DAY_2 = 400.
-- No Edge Function changes are needed: team-management reads events live.
--
-- IMPORTANT backend behaviour to know (team-management/index.ts):
--   * Team packages are grouped by max_team_size, and a team must have
--     EXACTLY max_team_size members. So a "2-3" event only accepts teams
--     of 3, and Paper Presentation (max 4) would only accept teams of 4.
--     If smaller teams must be allowed, the function needs changing — this
--     script only sets the sizes from the sheet.
--   * Only event_type = 'TEAM' events get team creation.
--
-- Two values to CONFIRM before running (both marked "CONFIRM" below):
--   a) The inactive status value. Only 'ACTIVE' exists in the data today;
--      this uses 'INACTIVE'. If the events.status check constraint uses a
--      different word, run the query just below and change it.
--   b) Weblica's team size — the sheet only says "individually or in teams
--      as specified by the organizers". Set as INDIVIDUAL for now.
--
-- Optional pre-check (read-only): allowed values / constraints on events.
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint where conrelid = 'public.events'::regclass;
-- =============================================================================

begin;

-- 1. Events already present that are on the sheet --------------------------
update public.events set
  name = 'Paper Presentation', day = 'DAY_1', event_type = 'TEAM',
  min_team_size = 2, max_team_size = 4,
  start_time = '10:30', end_time = '14:00',
  description = 'Participants showcase their research, ideas, or innovations through structured presentations, evaluated by experts.',
  status = 'ACTIVE', updated_at = now()
where code = 'PP';

update public.events set
  name = 'Find the BGM', day = 'DAY_2', event_type = 'TEAM',
  min_team_size = 2, max_team_size = 3,
  start_time = '11:30', end_time = '12:30',
  description = 'Teams identify a movie or song from a background music clip.',
  status = 'ACTIVE', updated_at = now()
where code = 'FB';

update public.events set
  name = 'Spotlight', day = 'DAY_2', event_type = 'INDIVIDUAL',
  min_team_size = 1, max_team_size = 1,
  start_time = '10:30', end_time = '15:30',
  description = 'Solo talent show: singing, dancing, acting, mimicry, storytelling and more.',
  status = 'ACTIVE', updated_at = now()
where code = 'SL';

update public.events set
  event_type = 'INDIVIDUAL', min_team_size = 1, max_team_size = 1, updated_at = now()
where code = 'CC';

-- 2. Missing sheet events + E-Sports -----------------------------------------
-- One INSERT ... VALUES per row (not a shared VALUES list) so each literal is
-- coerced to the column's real type — works whether day / event_type / status
-- are text or enum columns, and start_time/end_time text or time. Each insert
-- is skipped if that code already exists, so re-running is safe.
--
-- E-Sports: mystery event, included in the Day 2 pass. Game, format and team
-- size are not decided yet, so it is a 1-player placeholder: listed and covered
-- by Day 2 passes, but no team creation until the format is set (see LATER).
do $$
begin
  if not exists (select 1 from public.events where code = 'UN') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('UN', 'Unsaid', 'Team guessing game: one describes with indirect hints, the other decodes.', 'DAY_1', 'TEAM', 2, 2, '10:30', '11:30', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'CC') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('CC', 'Cipher Coding', 'Solve encrypted clues, coding challenges and puzzles to unlock a secret PIN.', 'DAY_1', 'INDIVIDUAL', 1, 1, '11:30', '12:30', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'WB') then  -- CONFIRM team size
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('WB', 'Weblica', 'Recreate a given user interface accurately within the time limit.', 'DAY_1', 'INDIVIDUAL', 1, 1, '13:15', '14:15', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'XC') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('XC', 'XCoders', 'Decipher problems written in quirky languages (Rajini++, Chef) and solve them in C, C++, Python or Java.', 'DAY_1', 'INDIVIDUAL', 1, 1, '14:15', '15:15', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'CN') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('CN', 'Connections', 'Identify the hidden link between a set of images related to a movie or song.', 'DAY_2', 'TEAM', 2, 3, '10:30', '11:30', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'MS') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('MS', 'Mixed Signals', 'Teams of three (one cannot see, one cannot speak, one cannot hear) solve a task together.', 'DAY_2', 'TEAM', 3, 3, '13:15', '14:15', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'LL') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('LL', 'Lost in Lyrics', 'Identify the original song from its translated lyrics.', 'DAY_2', 'TEAM', 2, 3, '14:15', '15:15', 0, 'ACTIVE');
  end if;
  if not exists (select 1 from public.events where code = 'ES') then
    insert into public.events
      (code, name, description, day, event_type, min_team_size, max_team_size, start_time, end_time, registration_fee, status)
    values
      ('ES', 'E-Sports', 'Mystery event: game, format and team size to be announced. Included in the Day 2 pass.', 'DAY_2', 'INDIVIDUAL', 1, 1, null, null, 0, 'ACTIVE');
  end if;
end
$$;

-- 3. Events not on the official sheet: deactivate (keep rows + references) --
update public.events
set status = 'INACTIVE', updated_at = now()   -- CONFIRM the inactive status value
where code in ('SC', 'TH', 'UX');

-- 4. Special events: names + fees ------------------------------------------
update public.special_events
set name = 'Group Dance', fee = 696, updated_at = now()
where code = 'GD';

update public.special_events
set name = 'Thiruvizha Corner', fee = 590, updated_at = now()
where code = 'TC';

-- 5. Day pass fees (Both = DAY_1 + DAY_2 = 400, computed by public-register) --
-- Same upsert the backend's own fix_registration_fees.sql relies on
-- (registration_fees has a unique key on day).
insert into public.registration_fees (day, amount, updated_at)
values ('DAY_1', 200, now()), ('DAY_2', 200, now())
on conflict (day) do update
  set amount = excluded.amount, updated_at = excluded.updated_at;

commit;

-- Check the result (read-only):
--   select code, name, day, event_type, min_team_size, max_team_size, status
--   from public.events order by status, day, code;
--   select code, name, fee, status from public.special_events order by code;
--   select day, amount from public.registration_fees order by day;

-- -----------------------------------------------------------------------------
-- LATER — once the E-Sports format is decided, e.g. squads of 4:
--   update public.events
--   set event_type = 'TEAM', min_team_size = 4, max_team_size = 4,
--       start_time = '11:00', end_time = '15:30',
--       description = '<game + format>', updated_at = now()
--   where code = 'ES';
-- -----------------------------------------------------------------------------
