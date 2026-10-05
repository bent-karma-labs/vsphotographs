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
