# Self-Improvement Loop

Agent Team Brain improves from task traces, after-action reviews, and reviewed playbook updates.

This loop is standalone. The core system is task state plus artifacts; optional adapters should stay outside the core model.

## Basic loop

After Tier 3+ projects or any serious mistake:

1. Write `lessons.md` in the project artifact folder.
2. Add after-action reviews for the important closed tasks.
3. Identify the root cause:
   - unclear brief
   - missing artifact
   - bad handoff
   - wrong role
   - missing QA gate
   - runtime/config drift
   - tool limitation
   - other
4. Promote durable lessons into the right place:
   - operating procedure
   - template
   - role file
   - agent playbook
   - tooling enforcement
5. Add a follow-up task if the lesson needs implementation.

## v1.1 learning intelligence

For a stronger self-improving loop, add these standalone artifacts/schemas:

- `TaskAfterActionReview` — what worked, what broke, what slowed down, next-time change, category, and promotion target.
- `TraceScore` — brief clarity, execution trace, validation quality, coordination quality, rework risk, and learning value.
- `AgentLessonRollup` — recent strengths, watch items, repeated categories, and pending playbook updates per role/agent.
- `LearningSuggestion` — repeated issue or process-upgrade candidate with a reviewed lifecycle.

The goal is not blame or ranking. The goal is compounding operational knowledge.

## Suggestion review rule

Repeated issues should create suggestions, not silent edits.

```text
suggested -> accepted -> in_progress -> applied
          \-> dismissed
```

A Coordinator reviews each suggestion. Accepted suggestions become normal update tasks. Dismissed suggestions keep a reason so they do not reappear immediately.

## Public-safe practice

When publishing templates or examples, use synthetic task IDs and generic role names. Do not include private logs, customer/project data, credentials, internal URLs, screenshots, or runtime-specific dashboard details.

See also: [`learning-loop.md`](learning-loop.md).


## Dream Cycle / context hygiene

For context-heavy work, run a dream cycle before future sessions reload the project. Agent dreams preserve role-specific run summaries; project dreams preserve current state, decisions, open questions, next actions, and a context pack; team dreams feed reviewed suggestions and playbook updates. This keeps continuity in durable artifacts instead of full runtime transcripts.


## Context-pack integrity

Dream-cycle outputs are only useful if later sessions can trust them. Run `agent-team-brain doctor` to verify required context-pack sections for active projects, and keep previous context packs in context history so changes can be reviewed or rolled back.
