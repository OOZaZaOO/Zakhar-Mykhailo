alter table public.services
add column if not exists max_sessions_per_week integer;

alter table public.services
drop constraint if exists services_max_sessions_per_week_check;

alter table public.services
add constraint services_max_sessions_per_week_check
check (max_sessions_per_week is null or max_sessions_per_week >= 1);

comment on column public.services.max_sessions_per_week is
'Maximum number of package sessions a client may schedule in one week. Packages use a fixed 4-week duration.';
