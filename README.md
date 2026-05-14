# Agent Team Brain

Agent Team Brain is a file-first operating system for running a small team of AI agents with clear roles, shared project artifacts, QA gates, and a self-improvement loop.

It is intentionally runtime-agnostic:

- no hard dependency on any memory/indexing backend
- no hard dependency on a specific dashboard
- no private bot or character names
- no private paths, credentials, or deployment assumptions

## Core idea

Every meaningful project moves through a visible loop:

1. capture the task
2. classify size/risk
3. assign the right role
4. connect dependencies
5. write shared artifacts
6. build
7. QA
8. close
9. promote lessons

## Required runtime contract

You need only:

- a task board or issue tracker
- agents or humans assigned to generic roles
- shared markdown files
- a QA/review gate
- a coordinator who closes the loop

Optional tooling can add dashboards, auto-dispatch, artifact browsers, browser automation, or search/indexing.

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
