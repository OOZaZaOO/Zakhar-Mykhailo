alter table public.services
  add column service_type text not null default 'one_time',
  add column sessions_count integer,
  add column sessions_per_week integer,
  add column package_validity_weeks integer,
  add column is_monthly_subscription boolean not null default false,
  add column allow_reschedule boolean not null default true,
  add column cancellation_policy text not null default '',
  add column package_notes text not null default '';

comment on column public.services.service_type is
  'Defines whether the offer is one one-time session or a fixed session package.';
comment on column public.services.sessions_count is
  'For package services, the number of sessions included. For monthly packages, this means sessions per month.';
comment on column public.services.sessions_per_week is
  'Expected package pacing. For monthly packages, this controls distribution within a 4-week month.';
comment on column public.services.package_validity_weeks is
  'For one-off packages, the number of weeks the package is valid. Monthly subscription packages are fixed at 4 weeks.';
comment on column public.services.is_monthly_subscription is
  'Marks a specialist-created monthly client package. This is not the platform SaaS subscription.';
comment on column public.services.allow_reschedule is
  'Whether clients may reschedule sessions in this service package. Booking enforcement comes later.';
comment on column public.services.cancellation_policy is
  'Specialist-facing policy text shown for package services.';
comment on column public.services.package_notes is
  'Additional notes for package services.';

alter table public.services
  add constraint services_service_type_check
    check (service_type in ('one_time', 'package')),
  add constraint services_monthly_subscription_package_check
    check (service_type = 'package' or is_monthly_subscription = false),
  add constraint services_package_fields_required_check
    check (
      service_type <> 'package'
      or (
        sessions_count is not null
        and sessions_per_week is not null
        and package_validity_weeks is not null
      )
    ),
  add constraint services_one_time_package_fields_empty_check
    check (
      service_type = 'package'
      or (
        sessions_count is null
        and sessions_per_week is null
        and package_validity_weeks is null
      )
    ),
  add constraint services_package_positive_numbers_check
    check (
      service_type <> 'package'
      or (
        sessions_count >= 1
        and sessions_per_week >= 1
        and package_validity_weeks >= 1
        and sessions_per_week <= sessions_count
      )
    ),
  add constraint services_monthly_subscription_validity_check
    check (is_monthly_subscription = false or package_validity_weeks = 4),
  add constraint services_monthly_subscription_capacity_check
    check (
      is_monthly_subscription = false
      or sessions_count <= sessions_per_week * 4
    );

create index idx_services_type_active_order
  on public.services (specialist_profile_id, service_type, is_active, sort_order);

comment on index public.idx_services_type_active_order is
  'Supports specialist and public service lists filtered by type and active state while preserving display order.';
