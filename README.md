# Agent Team Brain

Agent Team Brain is a file-first operating system for small AI agent teams: team roles, shared project artifacts, QA gates, task-state discipline, and a self-improvement loop.

It is designed for agentic teams.

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
9. promote lessons & self-improvement

The operating system carries its own task-state model. External visualization can mirror that state, but the core design should not assume one.

## Install / bootstrap

Use the CLI from this package directory or from an installed package:

```bash
node ./bin/agent-team-brain.js init ./my-agent-team
node ./bin/agent-team-brain.js doctor ./my-agent-team
```

Equivalent bootstrap commands are available:

```bash
agent-team-brain init [target-dir]
agent-team-brain install [target-dir]
agent-team-brain bootstrap [target-dir]
```

The bootstrap creates a self-contained starter layout:

```text
agent-team-brain.config.json
agent-team-state/tasks.json
agents/roles.md
AGENT_TEAM_BRAIN.md
agent-notes/sample-project/
  brief.md
  handoff.md
  qa-report.md
  lessons.md
```

Run `agent-team-brain doctor [target-dir]` before release. The doctor prints `pass`, `warn`, and `fail` lines and exits nonzero when a blocking check fails.

## Minimal runtime contract

An agent team needs:

- agents assigned to team roles
- a shared task-state file or queue carried by this operating system
- shared markdown artifacts
- a QA/review gate
- a coordinator agent that closes the loop

## Team Roles

- Coordinator
- Architect
- UX Reviewer
- Scout / Assistant Coder
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

Public v0.2 draft with bootstrap and doctor commands.
