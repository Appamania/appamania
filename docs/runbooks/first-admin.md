# Create the first admin (per environment)

There is no sign-up and no UI for creating admins (PRD v4 §12, E3.1). Do this once per environment.

1. Supabase dashboard → Authentication → Users → **Invite user** → your email.
   The `handle_new_user` trigger creates a `client` profile.
2. Supabase dashboard → SQL editor (replace the email):

   ```sql
   update public.profiles set role = 'admin', full_name = 'Sumit Pal'
   where id = (select id from auth.users where email = 'you@appamania.in');
   ```

3. Open the invite email. You land on `/portal/login/mfa`: scan the QR code with an authenticator app and
   enter the code. Admin pages and admin data (`is_admin()` checks `aal2`) need this code on every new session.
4. Later sign-ins: `/portal/login` → email link or Google → TOTP code.

**Hosted project settings to match `supabase/config.toml`:** Authentication → Sign In / Providers →
"Allow new users to sign up" **off**; Email provider on; Google provider on with the OAuth client;
MFA TOTP enroll + verify on; Redirect URLs include `https://appamania.in/auth/callback`;
SMTP → Resend (`smtp.resend.com`, 465, user `resend`). Paste `supabase/templates/*.html` into the
Invite and Magic Link templates.

**Lost authenticator:** dashboard → Authentication → Users → your user → delete the MFA factor, then sign in
again and re-enrol.
