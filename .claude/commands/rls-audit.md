---
description: Audit database access control and billing idempotency
---
Use the rls-auditor subagent on supabase/migrations and supabase/functions.
Report every table, its RLS state, policies for admin and client, and any gap versus PRD §31,
§30.3 and §35. Write missing pgTAP tests for every gap before fixing it.
