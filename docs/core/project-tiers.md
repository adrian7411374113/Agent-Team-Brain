# Project Tiers

Use the lightest process that protects quality.

## Tier 0 — Tiny

Use for one-line answers, copy edits, tiny fixes.

Requirements:
- inline work is okay
- no formal artifact required
- validate if code or user-facing behavior changes

## Tier 1 — Small

Use for contained fixes or simple probes.

Requirements:
- work item in task state
- one assigned agent role
- minimal validation note
- QA if user-facing behavior changes

## Tier 2 — Medium

Use for multi-file features, integrations, or meaningful workflow changes.

Requirements:
- task chain with assigned agent roles and dependencies
- shared artifacts
- one Builder owns integration
- QA Reviewer verifies before final close

## Tier 3 — Large

Use for multi-agent, high-uncertainty, or cross-system work.

Requirements:
- brief with acceptance criteria
- architecture/UX/research gates as needed
- written handoffs
- QA report
- lessons file

## Tier 4 — Critical

Use for auth, secrets, money, runtime, destructive, or external actions.

Requirements:
- Tier 3 process
- explicit risk notes
- rollback plan
- approval gates
- extra QA/review
