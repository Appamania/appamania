#!/usr/bin/env sh
# Writes .env.local for the local Supabase stack (`supabase start` must be running).
# Local keys are the CLI's shared defaults, not secrets. Used by README setup and CI.
set -e
eval "$(supabase status -o env 2>/dev/null)"
cat > .env.local <<ENV
NEXT_PUBLIC_SUPABASE_URL=$API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
LEAD_SALT=local-dev-salt
ADMIN_EMAIL=admin@appamania.test
ENV
echo "wrote .env.local for $API_URL"
