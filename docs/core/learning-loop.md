# Learning Loop

The Agent Team Brain learning loop is a standalone, artifact-first process for helping an AI agent team improve over time.

It does **not** require a dashboard, Kanban board, Mission Control, or any specific runtime UI. A UI may adapt these files later, but the core loop is plain task state plus markdown/JSON artifacts.

## Core loop

1. **Task trace** — record the work item, owner role, lifecycle, blockers, outputs, QA evidence, and artifacts.
2. **After-action review** — capture what worked, what broke or slowed the team down, and what should change next time.
3. **Trace scoring** — derive a lightweight quality signal from the task trace so weak handoffs, missing validation, or coordination gaps are visible.
4. **Agent lesson rollup** — summarize each role/agent's recent strengths, repeated issues, and pending playbook updates.
5. **Process-upgrade suggestion** — when evidence repeats, create a reviewed suggestion instead of silently changing rules.
6. **Playbook evolution** — accepted suggestions become normal update tasks against templates, procedures, role files, or agent playbooks.
7. **Team retro** — larger projects produce `lessons.md` and promote only durable lessons.

## Design rules

- Keep the loop operational: every insight is captured, dismissed, or turned into a concrete update task.
- Do not auto-write procedures, role files, skills, or public documentation without review.
- Store evidence as task IDs and artifact paths, not raw private transcripts or logs.
- Use generic role names in portable artifacts: Coordinator, Architect, UX Reviewer, Scout / Assistant Coder, Analyst, Builder, QA Reviewer.
- Keep adapters separate. A web dashboard, Kanban board, chat bot, or database can mirror this model, but none is required.

## Portable artifact set

Recommended files for a standalone installation:

```text
agent-team-state/tasks.json
agent-team-state/learning-suggestions.json
agents/playbooks/<role-slug>.md
agent-notes/<project-slug>/
  brief.md
  handoff.md
  qa-report.md
  lessons.md
  learning-retro.md
```

Recommended reusable templates:

```text
templates/learning-loop/after-action-review.md
templates/learning-loop/trace-score.md
templates/learning-loop/process-upgrade-suggestion.md
templates/learning-loop/agent-playbook.md
templates/learning-loop/learning-retro.md
```

## Trace scoring dimensions

Trace scores are heuristic, not a leaderboard. Use them to find weak evidence and improve the process.

Suggested dimensions:

- **Brief clarity** — goal, acceptance criteria, blockers, dependencies, and owner are clear.
- **Execution trace** — handoff explains what changed, where, assumptions, and risks.
- **Validation quality** — tests, checks, browser/API/static evidence, screenshots, or direct inspection are present when relevant.
- **Coordination quality** — dependencies and ownership were handled cleanly.
- **Rework risk** — inverse signal for failures, QA rejects, repeated issue fingerprints, or missing evidence.
- **Learning value** — after-action review includes a concrete next-time change or durable promotion target.

## Suggestion lifecycle

Process-upgrade suggestions should be reviewed before changing team rules.

```text
suggested -> accepted -> in_progress -> applied
          \-> dismissed
```

- `suggested`: repeated evidence exists.
- `accepted`: Coordinator agrees an update task should be created.
- `in_progress`: a normal update task is active.
- `applied`: the playbook/template/procedure update landed.
- `dismissed`: reviewed and intentionally not promoted.

## Public/private boundary

Portable public artifacts may include schemas, generic templates, generic role names, and examples with synthetic task IDs.

Do not include:

- private task content
- personal names or customer/project data
- credentials, URLs, cookies, tokens, or logs
- screenshots containing private information
- runtime-specific internals from a private dashboard or bot
