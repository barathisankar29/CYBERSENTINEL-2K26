
# Cyber Sentinel — Registration + Checking + Main Attendance

This package is built for the uploaded `supabase_schema_final.sql`.

## Included
- registration/index.html — real multipart registration client
- checking/index.html — email + phone checking client
- admin/main-attendance.html — Admin scans the same QR for main/day attendance
- coordinator/event-attendance.html — coordinator scans the same QR for a selected event
- supabase/add_main_attendance.sql — adds main_attendance and secure Admin RPC
- supabase/functions/public-register — creates participant, registration and UNDER_REVIEW payment, uploads screenshot
- supabase/functions/check-registration — secure lookup and returns QR only when VERIFIED/CONFIRMED
- supabase/functions/record-main-attendance — authenticated Admin main attendance endpoint

## IMPORTANT
1. Run `supabase/add_main_attendance.sql` after your existing schema.
2. Run the repository root migration `supabase_fix_attendance_scan.sql` after the attendance table exists. It adds authenticated inspection RPCs used before marking attendance.
2. Deploy the three Edge Functions.
3. Configure function secrets:
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   QR_VERIFY_BASE_URL
4. Put the public anon/publishable key in js/config.js.
5. Do NOT put service_role in browser files.
6. Replace the placeholder official payment QR in registration/index.html.
7. Replace YOUR-DOMAIN in QR_VERIFY_BASE_URL with the public QR verification URL.
8. Run `supabase_custom_coordinators.sql` after the migrations. Coordinators are stored in `profiles`, log in with the admin-created email/password, and do not create Supabase Auth users. The existing attendance RPCs still enforce Admin/assigned coordinator scope.
9. Run `supabase_team_packages.sql` to add package-to-event mappings for multi-event teams.
10. Run `supabase_atomic_team_creation.sql` to create teams, selected-event links, and team members in one transaction.
11. From the `register2` directory, deploy `supabase/functions/team-management` with `supabase functions deploy team-management`. It excludes solo events, groups team events by required member count, validates every member's payment and selected day, and saves only the events checked by the team leader. Redeploy this function after code changes; the hosted function is what enforces team event selection and member eligibility.
11. Run `supabase_remove_team_passwords.sql` if the previous password migration was already applied.
12. Deploy `supabase/functions/send-email` and set `RESEND_API_KEY` and `MAIL_FROM` to enable real email delivery.
13. Run the repository root `supabase_selected_event_registrations.sql` after the coordinator and special-event migrations. It adds explicit event choices, coordinator-only access rules, and selected-event attendance/payment authorization.

## Email OTP
The checking page intentionally uses email + phone without an OTP dependency so it can work immediately with the existing participant-no-auth architecture.
A truly free, production SMS OTP is not guaranteed. If you want OTP later, use Supabase Auth email OTP/magic link or connect an email/SMS provider. Adding OTP should be done without exposing participant rows publicly.

## Registration visibility
Participants select at least one event for each chosen day in the registration form. Those choices are stored in `selected_event_registrations`; after payment verification, `confirm_registration()` creates `event_registrations` only for those selected events. Coordinators see and manage only participants who selected their assigned event. Existing registrations are not automatically assigned event choices; admins should review how to handle registrations created before this migration.

## Attendance
- Main Admin attendance: main_attendance(registration_id, day)
- Event Coordinator attendance: attendance(registration_id, event_id)
- Same QR token is used for both.
- Duplicate attendance is prevented by unique constraints.

## SECURITY NOTE ABOUT THE UPLOADED FINAL SQL
The uploaded file's hardening version of `confirm_registration()` checks coordinator authorization through existing `event_registrations`. That can fail on the FIRST payment verification because event_registrations are created during confirmation. Before production, change that authorization to check the registration's selected_day against events assigned to the coordinator, then create event_registrations.
