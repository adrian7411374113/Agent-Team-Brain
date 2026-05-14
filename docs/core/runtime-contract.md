# Runtime Contract

Agent Team Brain is a file-first operating model. It defines how agents coordinate; it does not require a specific memory backend or dashboard.

## Required capabilities

1. **Task board**
   - create/update tasks
   - assign owner
   - express dependencies
   - represent lifecycle: queued/active/success/failure

2. **Agent runtime**
   - route work to named roles
   - let workers report status and results
   - support isolated work sessions when useful

3. **Shared artifact folder**
   - store briefs, architecture notes, handoffs, QA reports, and lessons in plain files
   - preserve artifacts after chat/session compaction

4. **QA gate**
   - a distinct reviewer verifies behavior against acceptance criteria
   - user-facing or UI work gets browser/API/static evidence as appropriate

5. **Coordinator**
   - owns scope, sequencing, final close, and durable lesson promotion

## Optional capabilities

- search/indexing backend
- dashboard visualization
- auto-dispatcher
- artifact browser
- browser automation
- scheduled maintenance

Optional capabilities improve the system, but must not be required for the core loop.

## Design rule

If the team cannot run from tasks + agents + shared markdown files, the design is too coupled.
