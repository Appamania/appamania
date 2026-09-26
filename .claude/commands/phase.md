---
description: Plan and build one PRD phase
argument-hint: <phase id, e.g. P1, P2, P2b, P5b, P3, P4, P5, P6>
---
Build phase $ARGUMENTS of the Appamania platform.

1. Open docs/PRD.md §51 and find phase $ARGUMENTS. Open the phase prompt for $ARGUMENTS in
   docs/claude-code-kit.md §7 and follow it exactly.
2. Read only the PRD sections that prompt lists. Summarize the acceptance criteria you will meet.
3. Produce a numbered plan: files to create/change, migrations, tests, and which acceptance
   criteria each step satisfies. Flag anything the PRD leaves ambiguous and ask before building.
4. After approval, build in small commits. Tests with code.
5. Finish with /verify and report: done criteria met, open TODOs, anything deferred and why.
