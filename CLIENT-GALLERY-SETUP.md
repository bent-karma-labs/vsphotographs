# VS Photographs Private Client Gallery
The client page is https://vsphotographs.com/clients/
Security: private Supabase Storage bucket; unique code; server-side validation; one-hour signed photo URLs; noindex/nofollow; QR + native share.
1. Create a Supabase project.
2. Run supabase/gallery-schema.sql in SQL Editor.
3. Create a PRIVATE Storage bucket named client-galleries. Never put client originals in this GitHub repository.
4. Deploy the Edge Function in supabase/functions/gallery-access and set SUPABASE_SERVICE_ROLE_KEY as a Supabase secret. Do not put the service-role key in GitHub.
5. In clients/index.html replace YOUR-PROJECT and YOUR_SUPABASE_ANON_KEY. The anon key may be public; the service-role key must never be public.
6. Create each gallery with a random code such as VS-7K4P-92XM, add its photo paths, and give the client the QR code/link.
The QR link contains the gallery code intentionally: anyone the client shares it with can open that gallery. If you want stronger privacy later, add a second PIN or client login.


## 30-day gallery access window
Set each gallery's `expires_at` to exactly 30 days after delivery. The Edge Function checks this timestamp and returns an expired response after it passes, so the client can no longer request new signed photo URLs. Signed URLs already issued can remain valid for up to one hour.

Example (replace the code with the gallery's unique code; run in Supabase SQL Editor at delivery):
```sql
update public.galleries
set expires_at = now() + interval '30 days'
where code = 'VS-7K4P-92XM';
```

Expiration disables gallery access; it does **not** automatically delete objects from the private Storage bucket or backups. Delete stored files separately when you decide they should be permanently removed, accounting for any backup/recordkeeping needs.
