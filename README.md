# Agent Team Brain

Agent Team Brain is a standalone, artifact-driven operating system for AI agent teams: persistent role profiles, role-local workspaces, shared task state, project briefs, handoffs, QA gates, dream-cycle context hygiene, after-action reviews, team retros, trace scoring, agent playbooks, playbook updates, and a reviewed learning loop.

It is designed for agentic teams and runs from files and schemas in this package. External visualization can mirror the state, but the core model does not depend on any specific UI.

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
9. capture after-action reviews
10. score the task trace
11. roll up agent lessons
12. review process-upgrade suggestions
13. run team retros for larger efforts
14. run a dream cycle to compress context for future sessions
15. promote durable lessons into templates, procedures, or playbooks

The operating system carries its own task-state and learning-state model. External visualization can mirror that state, but the core design should not assume one.

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
agent-team-state/
  tasks.json
  learning-suggestions.json
agents/
  roles.md
  roles/
    coordinator.md
    architect.md
    ux-reviewer.md
    scout-assistant-coder.md
    analyst.md
    builder.md
    qa-reviewer.md
  playbooks/coordinator.md
  workspaces/<role-slug>/
    current-focus.md
    scratch.md
  runtime-bindings.example.json
AGENT_TEAM_BRAIN.md
agent-notes/sample-project/
  brief.md
  handoff.md
  qa-report.md
  lessons.md
  learning-retro.md
  dreams/builder-dream.md
  project-state.md
  decision-log.md
  open-questions.md
  next-actions.md
  context-pack.md
templates/dream-cycle/
  agent-dream.md
  project-dream.md
  team-dream.md
  context-pack.md
templates/learning-loop/
  after-action-review.md
  trace-score.md
  process-upgrade-suggestion.md
  agent-playbook.md
  learning-retro.md
```

Run `agent-team-brain doctor [target-dir]` before release. The doctor prints `pass`, `warn`, and `fail` lines and exits nonzero when a blocking check fails.

## Minimal runtime contract

An agent team needs:

- agents assigned to team roles
- a shared task-state file or queue carried by this operating system
- shared markdown artifacts
- a QA/review gate
- after-action review artifacts or task-local review records
- reusable agent playbooks
- a suggestion store for process/playbook improvements
- team retros for larger projects
- dream-cycle summaries for context-heavy work
- context packs for future runtime sessions
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


## Persistent team members

Agent Team Brain treats team members as **persistent role profiles**, not just one-off task runs. A runtime can spin up a task-scoped session for Builder, Scout / Assistant Coder, QA Reviewer, or any other role, but the durable identity lives in files:

- `agents/roles/<role-slug>.md` — mission and responsibilities for the persistent role.
- `agents/workspaces/<role-slug>/` — role-local scratch and current-focus notes.
- `agents/playbooks/<role-slug>.md` — durable operating rules promoted through reviews and retros.
- `agent-notes/<project-slug>/` — shared project artifacts used by the whole team.

See [`docs/core/persistent-role-profiles.md`](docs/core/persistent-role-profiles.md).


## Dream Cycle / context hygiene

Agent Team Brain v0.4 adds a Dream Cycle so large projects do not depend on ever-growing runtime context. A dream cycle is an offline consolidation pass:

- **Agent dream** — a role summarizes its task-scoped run, decisions, risks, and next context.
- **Project dream** — the coordinator consolidates role dreams into `project-state.md`, `decision-log.md`, `open-questions.md`, `next-actions.md`, and `context-pack.md`.
- **Team dream** — repeated issues become reviewed suggestions, retro inputs, or playbook/template update candidates.
- **Context reload** — future sessions load the role profile, role playbook, assigned task, latest context pack, and relevant artifacts instead of full history.

See [`docs/core/dream-cycle.md`](docs/core/dream-cycle.md).

## Learning loop

The standalone learning loop includes:

- `TaskAfterActionReview` — what worked, what broke, what slowed down, and what should change next time.
- `TraceScore` — brief clarity, execution trace, validation quality, coordination quality, rework risk, and learning value.
- `AgentLessonRollup` — strengths, watch items, repeated categories, and pending playbook updates.
- `LearningSuggestion` — reviewed process-upgrade or playbook-update candidate.
- `TeamLearningRetro` — project-level synthesis across tasks, agents, trace scores, repeated issues, and promoted lessons.
- `AgentPlaybook` — role-specific operating rules that evolve only after reviewed suggestions or retros.

See [`docs/core/learning-loop.md`](docs/core/learning-loop.md) and [`docs/core/self-improvement-loop.md`](docs/core/self-improvement-loop.md).

## First-class learning artifacts

Retros and playbooks are first-class parts of the system, not future add-ons:

- Team retros live in `templates/learning-loop/learning-retro.md` and are intended for larger projects or repeated issues.
- Agent playbooks live under `agents/playbooks/` in an installation and start from `templates/learning-loop/agent-playbook.md`.
- Schemas exist for after-action reviews, trace scores, agent lesson rollups, learning suggestions, team retros, and agent playbooks.

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
  learning-retro.md
  dreams/<role-slug>-dream.md
  project-state.md
  decision-log.md
  open-questions.md
  next-actions.md
  context-pack.md
```

Use only the files that apply. Avoid process noise for tiny work.

## Status

Public v0.4 draft with dream-cycle context hygiene, persistent role profiles, role-local workspaces, standalone learning-loop schemas, retros, agent playbooks, bootstrap templates, and doctor checks.
