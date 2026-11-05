---
description: Run the full quality gate and fix failures
---
Run, in order, and fix every failure before moving on:
1. npm run lint && npm run typecheck
2. npm run check:tokens
3. npm test
4. supabase db reset && supabase test db
5. npm run build
6. npm run e2e (if the phase touched UI or flows)
Then list: any RLS table without policies (query in PRD §22), any `TODO(` markers added in this
branch, and bundle size of the landing route vs the 120KB budget. Report results as a checklist.
Do not claim success for a step you did not run.
