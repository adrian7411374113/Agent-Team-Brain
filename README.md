# Agent Team Brain

Agent Team Brain is a file-first operating system for small AI agent teams: generic roles, shared project artifacts, QA gates, task-state discipline, and a self-improvement loop.

It is designed for agentic teams. Public materials use generic role names and avoid private bot, mascot, or character identities.

## Core idea

Every meaningful project moves through a visible loop:

1. define the work item
2. classify size/risk
3. assign the right agent role
4. record blockers and dependencies
5. write shared artifacts
6. build
7. QA
8. close
9. promote lessons

The operating system carries its own task-state model. External visualization can mirror that state, but the core design should not assume one.

## Minimal runtime contract

An agent team needs:

- agents assigned to generic roles
- a shared task-state file or queue
- shared markdown artifacts
- a QA/review gate
- a coordinator agent that closes the loop

## Generic roles

- Coordinator
- Architect
- UX Reviewer
- Scout
- Analyst
- Builder
- QA Reviewer

See [`docs/core/roles.md`](docs/core/roles.md).

## Project artifacts

Use the templates in [`templates/team-project/`](templates/team-project/) for medium or larger projects.

```text
agent-notes/<project-slug>/
  brief.md
  architecture.md
  ux-review.md
  research.md
  implementation-plan.md
  handoff.md
  qa-report.md
  lessons.md
```

Use only the files that apply. Avoid process noise for tiny work.

## Status

Public v0.1 draft.
