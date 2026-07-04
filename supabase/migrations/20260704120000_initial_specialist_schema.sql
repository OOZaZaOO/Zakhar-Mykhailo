create extension if not exists pgcrypto with schema extensions;
create extension if not exists btree_gist with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Reusable trigger function that keeps updated_at current on mutable application tables.';

create table public.specialist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  display_name text not null,
  profession text not null,
  bio text not null default '',
  avatar_url text,
  timezone text not null default 'UTC',
  languages text[] not null default '{}',
  contact_links jsonb not null default '{}'::jsonb,
  working_rules text not null default '',
  visibility text not null default 'private',
  is_accepting_bookings boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint specialist_profiles_user_id_key unique (user_id),
  constraint specialist_profiles_slug_key unique (slug),
  constraint specialist_profiles_slug_format_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint specialist_profiles_display_name_check
    check (length(trim(display_name)) > 0),
  constraint specialist_profiles_profession_check
    check (length(trim(profession)) > 0),
  constraint specialist_profiles_timezone_check
    check (length(trim(timezone)) > 0),
  constraint specialist_profiles_contact_links_object_check
    check (jsonb_typeof(contact_links) = 'object'),
  constraint specialist_profiles_visibility_check
    check (visibility in ('public', 'private', 'hidden'))
);

comment on table public.specialist_profiles is
  'Specialist-owned profile data used for public profile pages and specialist settings.';
comment on column public.specialist_profiles.user_id is
  'Supabase auth user that owns this specialist profile. Auth users primarily represent specialists in the MVP.';
comment on column public.specialist_profiles.slug is
  'Stable public profile slug. Must be lowercase URL-safe text.';
comment on column public.specialist_profiles.visibility is
  'Controls public profile visibility without deleting specialist data.';
comment on column public.specialist_profiles.is_accepting_bookings is
  'Allows a public specialist profile to temporarily stop accepting bookings.';

create table public.services (
  id uuid primary key default gen_random_uuid(),
  specialist_profile_id uuid not null references public.specialist_profiles (id) on delete cascade,
  title text not null,
  description text not null default '',
  duration_minutes integer not null,
  price_amount integer not null default 0,
  currency text not null default 'USD',
  format text not null default 'online',
  location_details text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint services_title_check
    check (length(trim(title)) > 0),
  constraint services_duration_minutes_check
    check (duration_minutes > 0 and duration_minutes <= 1440),
  constraint services_price_amount_check
    check (price_amount >= 0),
  constraint services_currency_check
    check (currency ~ '^[A-Z]{3}$'),
  constraint services_format_check
    check (format in ('online', 'offline', 'async'))
);

comment on table public.services is
  'Bookable offers created and ordered by a specialist.';
comment on column public.services.price_amount is
  'Service price stored in minor currency units, such as cents.';
comment on column public.services.sort_order is
  'Specialist-controlled display order for public profile service cards.';
comment on column public.services.is_active is
  'Only active services are publicly readable and later bookable.';

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  specialist_profile_id uuid not null references public.specialist_profiles (id) on delete cascade,
  day_of_week smallint not null,
  start_time time not null,
  end_time time not null,
  timezone text not null default 'UTC',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint availability_blocks_day_of_week_check
    check (day_of_week between 0 and 6),
  constraint availability_blocks_time_range_check
    check (start_time < end_time),
  constraint availability_blocks_timezone_check
    check (length(trim(timezone)) > 0),
  constraint availability_blocks_unique_weekly_slot
    unique (specialist_profile_id, day_of_week, start_time, end_time)
);

comment on table public.availability_blocks is
  'Recurring weekly availability windows for a specialist. Day 0 is Sunday and day 6 is Saturday.';
comment on column public.availability_blocks.day_of_week is
  'Recurring weekday using PostgreSQL-compatible convention: 0 Sunday through 6 Saturday.';
comment on column public.availability_blocks.timezone is
  'Timezone used to interpret the local start and end times for this block.';

create table public.availability_exceptions (
  id uuid primary key default gen_random_uuid(),
  specialist_profile_id uuid not null references public.specialist_profiles (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  exception_type text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint availability_exceptions_time_range_check
    check (starts_at < ends_at),
  constraint availability_exceptions_type_check
    check (exception_type in ('available', 'unavailable')),
  constraint availability_exceptions_no_active_overlap
    exclude using gist (
      specialist_profile_id with =,
      tstzrange(starts_at, ends_at, '[)') with &&
    )
    where (is_active)
);

comment on table public.availability_exceptions is
  'One-off availability changes such as blocked time, vacations, sick days, or extra openings.';
comment on column public.availability_exceptions.exception_type is
  'available creates a one-off opening; unavailable blocks time that would otherwise be available.';
comment on constraint availability_exceptions_no_active_overlap on public.availability_exceptions is
  'Prevents overlapping active one-off availability changes for the same specialist.';

create index idx_specialist_profiles_public_slug
  on public.specialist_profiles (slug)
  where visibility = 'public';
comment on index public.idx_specialist_profiles_public_slug is
  'Speeds public profile lookup by slug while keeping private and hidden profiles out of the public path.';

create index idx_specialist_profiles_visibility
  on public.specialist_profiles (visibility);
comment on index public.idx_specialist_profiles_visibility is
  'Supports filtering specialist profiles by public, private, or hidden visibility.';

create index idx_services_specialist_profile
  on public.services (specialist_profile_id);
comment on index public.idx_services_specialist_profile is
  'Speeds specialist-owned service management and future booking joins.';

create index idx_services_public_listing
  on public.services (specialist_profile_id, is_active, sort_order);
comment on index public.idx_services_public_listing is
  'Supports public profile service lists ordered by specialist-defined sort_order.';

create index idx_availability_blocks_specialist_day
  on public.availability_blocks (specialist_profile_id, day_of_week, is_active);
comment on index public.idx_availability_blocks_specialist_day is
  'Supports weekly availability lookup for booking date selection.';

create index idx_availability_exceptions_specialist_range
  on public.availability_exceptions (specialist_profile_id, starts_at, ends_at)
  where is_active;
comment on index public.idx_availability_exceptions_specialist_range is
  'Supports date-range lookup of active one-off availability changes during scheduling.';

create trigger set_specialist_profiles_updated_at
  before update on public.specialist_profiles
  for each row execute function public.set_updated_at();

create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger set_availability_blocks_updated_at
  before update on public.availability_blocks
  for each row execute function public.set_updated_at();

create trigger set_availability_exceptions_updated_at
  before update on public.availability_exceptions
  for each row execute function public.set_updated_at();

create or replace function public.is_specialist_profile_owner(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.specialist_profiles specialist_profiles
    where specialist_profiles.id = profile_id
      and specialist_profiles.user_id = auth.uid()
  );
$$;

comment on function public.is_specialist_profile_owner(uuid) is
  'RLS helper that checks whether the current authenticated user owns a specialist profile.';

create or replace function public.is_specialist_profile_public(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.specialist_profiles specialist_profiles
    where specialist_profiles.id = profile_id
      and specialist_profiles.visibility = 'public'
  );
$$;

comment on function public.is_specialist_profile_public(uuid) is
  'RLS helper that checks whether a specialist profile is publicly visible.';

alter table public.specialist_profiles enable row level security;
alter table public.services enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.availability_exceptions enable row level security;

create policy "Public can read public specialist profiles"
  on public.specialist_profiles
  for select
  to anon, authenticated
  using (visibility = 'public');
comment on policy "Public can read public specialist profiles" on public.specialist_profiles is
  'Allows visitors and signed-in users to view only profiles explicitly marked public.';

create policy "Specialists can read own specialist profile"
  on public.specialist_profiles
  for select
  to authenticated
  using (user_id = auth.uid());
comment on policy "Specialists can read own specialist profile" on public.specialist_profiles is
  'Allows specialists to read their own profile regardless of public visibility.';

create policy "Specialists can create own specialist profile"
  on public.specialist_profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());
comment on policy "Specialists can create own specialist profile" on public.specialist_profiles is
  'Requires a new specialist profile to belong to the authenticated user creating it.';

create policy "Specialists can update own specialist profile"
  on public.specialist_profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
comment on policy "Specialists can update own specialist profile" on public.specialist_profiles is
  'Allows specialists to update only their own profile and prevents ownership transfer.';

create policy "Specialists can delete own specialist profile"
  on public.specialist_profiles
  for delete
  to authenticated
  using (user_id = auth.uid());
comment on policy "Specialists can delete own specialist profile" on public.specialist_profiles is
  'Allows specialists to delete only their own profile; dependent MVP rows cascade by foreign key.';

create policy "Public can read active services for public specialists"
  on public.services
  for select
  to anon, authenticated
  using (
    is_active
    and public.is_specialist_profile_public(specialist_profile_id)
  );
comment on policy "Public can read active services for public specialists" on public.services is
  'Exposes only active services that belong to publicly visible specialist profiles.';

create policy "Specialists can read own services"
  on public.services
  for select
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can read own services" on public.services is
  'Allows specialists to see all of their services, including inactive services.';

create policy "Specialists can create own services"
  on public.services
  for insert
  to authenticated
  with check (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can create own services" on public.services is
  'Prevents specialists from creating services under another specialist profile.';

create policy "Specialists can update own services"
  on public.services
  for update
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id))
  with check (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can update own services" on public.services is
  'Allows specialists to update only services attached to their own profile.';

create policy "Specialists can delete own services"
  on public.services
  for delete
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can delete own services" on public.services is
  'Allows specialists to delete only their own services.';

create policy "Public can read active availability blocks for public specialists"
  on public.availability_blocks
  for select
  to anon, authenticated
  using (
    is_active
    and public.is_specialist_profile_public(specialist_profile_id)
  );
comment on policy "Public can read active availability blocks for public specialists" on public.availability_blocks is
  'Allows booking flows to read recurring availability only for public specialist profiles.';

create policy "Specialists can read own availability blocks"
  on public.availability_blocks
  for select
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can read own availability blocks" on public.availability_blocks is
  'Allows specialists to read their full weekly availability configuration.';

create policy "Specialists can create own availability blocks"
  on public.availability_blocks
  for insert
  to authenticated
  with check (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can create own availability blocks" on public.availability_blocks is
  'Prevents specialists from adding weekly availability to another specialist profile.';

create policy "Specialists can update own availability blocks"
  on public.availability_blocks
  for update
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id))
  with check (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can update own availability blocks" on public.availability_blocks is
  'Allows specialists to update only their own weekly availability.';

create policy "Specialists can delete own availability blocks"
  on public.availability_blocks
  for delete
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can delete own availability blocks" on public.availability_blocks is
  'Allows specialists to delete only their own weekly availability.';

create policy "Public can read active availability exceptions for public specialists"
  on public.availability_exceptions
  for select
  to anon, authenticated
  using (
    is_active
    and public.is_specialist_profile_public(specialist_profile_id)
  );
comment on policy "Public can read active availability exceptions for public specialists" on public.availability_exceptions is
  'Allows booking flows to account for one-off schedule changes only on public specialist profiles.';

create policy "Specialists can read own availability exceptions"
  on public.availability_exceptions
  for select
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can read own availability exceptions" on public.availability_exceptions is
  'Allows specialists to read all of their own one-off availability changes.';

create policy "Specialists can create own availability exceptions"
  on public.availability_exceptions
  for insert
  to authenticated
  with check (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can create own availability exceptions" on public.availability_exceptions is
  'Prevents specialists from adding one-off availability changes to another specialist profile.';

create policy "Specialists can update own availability exceptions"
  on public.availability_exceptions
  for update
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id))
  with check (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can update own availability exceptions" on public.availability_exceptions is
  'Allows specialists to update only their own one-off availability changes.';

create policy "Specialists can delete own availability exceptions"
  on public.availability_exceptions
  for delete
  to authenticated
  using (public.is_specialist_profile_owner(specialist_profile_id));
comment on policy "Specialists can delete own availability exceptions" on public.availability_exceptions is
  'Allows specialists to delete only their own one-off availability changes.';
