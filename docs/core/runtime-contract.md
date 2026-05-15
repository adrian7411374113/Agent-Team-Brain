# Runtime Contract

Agent Team Brain is an artifact-driven operating model for coordinating AI agent teams.

The core runtime should carry task state itself. External visualization can be an adapter, but it is not the foundation of the model.

## Required capabilities

1. **Task-state file or queue**
   - create/update work items
   - assign an agent role
   - express blockers and dependencies
   - represent lifecycle: queued/active/success/failure

2. **Agent runtime**
   - route work to named roles
   - let agents report status and results
   - support isolated work sessions when useful

3. **Shared artifact folder**
   - store briefs, architecture notes, handoffs, QA reports, and lessons in plain files
   - preserve artifacts across agent turns and context resets

4. **QA gate**
   - a distinct QA agent verifies behavior against acceptance criteria
   - user-facing or UI work gets browser/API/static evidence as appropriate

5. **Coordinator agent**
   - owns scope, sequencing, final close, and durable lesson promotion

## Design rule

If the team cannot run from task state + agents + shared markdown files, the design is too coupled.
