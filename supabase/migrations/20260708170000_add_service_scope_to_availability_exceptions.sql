alter table public.availability_exceptions
add column if not exists service_id uuid references public.services (id) on delete set null;

comment on column public.availability_exceptions.service_id is
'Null means the availability range applies to all services. Otherwise it is limited to one active service.';

create index if not exists availability_exceptions_service_id_idx
on public.availability_exceptions (service_id);
