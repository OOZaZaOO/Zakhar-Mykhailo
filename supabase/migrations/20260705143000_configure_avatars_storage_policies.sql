drop policy if exists "Anyone can read avatar images" on storage.objects;
drop policy if exists "Users can upload own avatar images" on storage.objects;
drop policy if exists "Users can update own avatar images" on storage.objects;
drop policy if exists "Users can delete own avatar images" on storage.objects;

create policy "Anyone can read avatar images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own avatar images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
