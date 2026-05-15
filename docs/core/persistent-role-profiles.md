# Persistent Role Profiles and Workspaces

Agent Team Brain separates durable team identity from task-scoped runtime execution.

## Core distinction

- **Persistent role profile**: the durable identity for a team role. It defines mission, responsibilities, operating rules, and where durable lessons are promoted.
- **Runtime session**: one task-scoped execution of a persistent role in whatever agent runtime you use.
- **Role-local workspace**: scratch and current-focus files for one persistent role.
- **Shared workspace**: task state and project artifacts that every role can read and update.

This keeps the core runtime-agnostic. A profile can be used by a local script, hosted agent, chat session, worker process, or any other compatible runtime.

## Recommended layout

```text
agents/
  roles/
    coordinator.md
    architect.md
    ux-reviewer.md
    scout-assistant-coder.md
    analyst.md
    builder.md
    qa-reviewer.md
  playbooks/
    coordinator.md
  workspaces/
    coordinator/
      current-focus.md
      scratch.md
    builder/
      current-focus.md
      scratch.md
  runtime-bindings.example.json

agent-team-state/
  tasks.json
  learning-suggestions.json

agent-notes/<project-slug>/
  brief.md
  handoff.md
  qa-report.md
  lessons.md
  learning-retro.md
```

## What belongs where

Use `agent-notes/<project-slug>/` for shared project artifacts and decisions.

Use `agents/workspaces/<role-slug>/` for temporary role-local notes:

- current focus
- scratch reasoning
- lessons in progress before review
- runtime-specific handoff reminders

Use `agents/playbooks/<role-slug>.md` for durable operating rules promoted through the learning loop.

Do not store secrets in role profiles, playbooks, or workspaces.

## Runtime bindings

`agents/runtime-bindings.example.json` is intentionally optional. It maps durable profiles to your runtime sessions, workers, or tools without making the core depend on any provider.

A runtime binding should answer:

- Which persistent role profile should this execution load?
- Which role-local workspace can it write to?
- Which shared project artifact folder should it use?
- Which model/tool tier is appropriate for this task?

## Learning loop integration

After-action reviews and retros should update persistent identities, not one-off sessions.

Examples:

- Builder lessons update the Builder playbook.
- Scout / Assistant Coder lessons update the Scout / Assistant Coder playbook.
- QA misses update the QA Reviewer playbook or QA report template.
- Coordination misses update the Coordinator playbook or project templates.
