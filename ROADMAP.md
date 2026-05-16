# Roadmap

## v0.1 — public standalone draft

- generic roles only
- file-first runtime contract
- self-contained task-state model
- project tiers
- shared artifact templates
- QA and lessons loop

## v0.2 — installer and doctor

- package metadata with `agent-team-brain` bin
- bootstrap commands: `init`, `install`, and `bootstrap`
- starter task-state file and sample project artifacts
- doctor checks for config, task-state, artifacts, roles, QA gate, and sample task flow
- public-facing documentation for local startup and validation

## v0.3 — standalone learning loop

- after-action review template and schema
- trace scoring schema
- agent lesson rollup schema
- learning suggestion schema/lifecycle
- playbook starter template
- team learning retro template and schema
- agent playbook schema
- learning suggestions state file
- doctor checks for standalone learning-loop artifacts
- explicit adapter boundary: no dashboard, private runtime, or product-specific dependency in the core model

## v0.3.1 — persistent role profiles and workspaces

- persistent role profile files under `agents/roles/`
- role-local workspaces under `agents/workspaces/<role-slug>/`
- optional runtime binding example for mapping profiles to external runtimes
- doctor checks for role profiles and role-local workspaces
- public docs clarifying persistent role identity vs task-scoped runtime sessions

## v0.4 — dream cycle and context hygiene

- agent dream, project dream, team dream, and context pack templates
- schemas for `AgentDream`, `ProjectDream`, and `TeamDream`
- bootstrap-generated sample dream artifacts and context pack
- doctor checks for dream-cycle templates and sample context summaries
- context reload contract for future task-scoped runtime sessions
- token-bloat prevention through durable summarized state

## v0.4.1 — dream integrity hardening

- stricter context-pack template
- doctor integrity checks for active project context packs
- context-pack schema
- reviewer validation guidance to reduce coordinator single-point-of-failure risk
- context history / rollback / diff notes

## v0.5 — task-state ergonomics

- task add/update helpers
- stricter schema documentation
- example role prompts kept generic
- reusable validation fixtures
- optional adapter examples kept outside the core runtime

## v1.0 — stable agent-team package

- published package flow
- starter templates
- validation checklist
- adapter examples kept separate from the core model
