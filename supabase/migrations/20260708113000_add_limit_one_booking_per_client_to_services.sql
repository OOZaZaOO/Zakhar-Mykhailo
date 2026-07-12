alter table public.services
  add column if not exists limit_one_booking_per_client boolean not null default false;

comment on column public.services.limit_one_booking_per_client is
  'For one-time services only. Limits a client to one active booking for this service at a time. Enforcement is implemented later.';
