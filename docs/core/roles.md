# Team Roles

The public Agent Team Brain model uses team role names.

## Default roles

| Team role | Responsibility |
|---|---|
| Coordinator | Owns scope, sequencing, final synthesis, closeout, and lesson promotion. |
| Architect | Designs data/control flow, interfaces, failure modes, migration, and rollback. |
| UX Reviewer | Reviews layout, information hierarchy, accessibility, mobile usability, and interaction polish. |
| Scout / Assistant Coder | Researches unknowns, probes APIs, builds prototypes, writes small isolated code, and validates implementation assumptions before the main build. |
| Analyst | Handles domain analysis, data interpretation, and briefing-quality synthesis. |
| Builder | Implements and integrates the main change. One builder owns integration by default. |
| QA Reviewer | Verifies acceptance criteria, regression risk, behavior, and release confidence. |


## Persistent role profiles

Each default role can be represented by a durable profile file under `agents/roles/<role-slug>.md`. Runtime sessions are task-scoped executions of these profiles; lessons and playbook updates attach back to the persistent role.

Recommended role slugs:

- `coordinator`
- `architect`
- `ux-reviewer`
- `scout-assistant-coder`
- `analyst`
- `builder`
- `qa-reviewer`

See [`persistent-role-profiles.md`](persistent-role-profiles.md).
