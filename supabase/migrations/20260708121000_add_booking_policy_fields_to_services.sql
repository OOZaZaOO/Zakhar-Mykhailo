alter table public.services
  add column if not exists require_specialist_approval boolean not null default false,
  add column if not exists limit_active_bookings_per_client boolean not null default false,
  add column if not exists max_active_bookings_per_client integer,
  add column if not exists minimum_notice_minutes integer,
  add column if not exists allow_client_rescheduling boolean not null default false,
  add column if not exists reschedule_requires_approval boolean not null default false,
  add column if not exists latest_reschedule_minutes integer,
  add column if not exists allow_client_cancellation boolean not null default false,
  add column if not exists latest_cancellation_minutes integer,
  add column if not exists release_slot_on_cancellation boolean not null default true;

comment on column public.services.require_specialist_approval is
  'Bookings for this service must be manually approved before becoming confirmed.';
comment on column public.services.limit_active_bookings_per_client is
  'Enables a per-client cap on active bookings for this service.';
comment on column public.services.max_active_bookings_per_client is
  'Maximum number of active bookings a client may hold for this service when the limit is enabled.';
comment on column public.services.minimum_notice_minutes is
  'Minimum lead time in minutes required before a client can book this service.';
comment on column public.services.allow_client_rescheduling is
  'Allows clients to reschedule their bookings for this service.';
comment on column public.services.reschedule_requires_approval is
  'Reschedule requests for this service require specialist approval.';
comment on column public.services.latest_reschedule_minutes is
  'Latest allowed reschedule window in minutes before the session starts.';
comment on column public.services.allow_client_cancellation is
  'Allows clients to cancel their bookings for this service.';
comment on column public.services.latest_cancellation_minutes is
  'Latest allowed cancellation window in minutes before the session starts. Null means anytime.';
comment on column public.services.release_slot_on_cancellation is
  'Releases the booking slot automatically after client cancellation.';
