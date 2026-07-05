insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'specialist-avatars',
  'specialist-avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table storage.buckets is
  'Supabase Storage bucket registry. The specialist-avatars bucket stores public specialist profile photos.';

create policy "Public can read specialist avatar files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'specialist-avatars');
comment on policy "Public can read specialist avatar files" on storage.objects is
  'Allows public profile pages and authenticated headers to render specialist avatar images.';

create policy "Specialists can upload own avatar files"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'specialist-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
comment on policy "Specialists can upload own avatar files" on storage.objects is
  'Allows authenticated specialists to upload avatar files only inside their own user-id folder.';

create policy "Specialists can update own avatar files"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'specialist-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'specialist-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
comment on policy "Specialists can update own avatar files" on storage.objects is
  'Allows specialists to replace avatar files only inside their own user-id folder.';

create policy "Specialists can delete own avatar files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'specialist-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
comment on policy "Specialists can delete own avatar files" on storage.objects is
  'Allows specialists to remove avatar files only from their own user-id folder.';
