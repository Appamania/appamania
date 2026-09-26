---
description: Review changed UI against the design system and web interface guidelines
argument-hint: [file or glob; default = UI files changed on this branch]
---
Use the design-reviewer subagent on $ARGUMENTS (or `git diff --name-only main -- app components`).
Also fetch https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
and apply those rules. Output findings as `file:line — rule — fix`, grouped by severity
(blocker, should-fix, nit). Then fix blockers and should-fix items.
