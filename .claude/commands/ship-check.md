---
description: Pre-merge checklist for a phase PR
---
Produce the PR description for this branch:
- Phase, PRD sections implemented, acceptance criteria with pass/fail
- Migrations added (and rollback/fix-forward plan)
- Screenshots list to capture (375/1440, light/dark) for UI routes changed
- Security notes (secrets, RLS, webhooks), performance notes (landing JS size)
- Deferred items with PRD references
Run /verify first; refuse to write "ready to merge" if any gate failed.
