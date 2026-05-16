# Dream Cycle and Context Hygiene

The Dream Cycle is an offline consolidation pass that keeps long-running agent teams from accumulating context bloat.

It is not autonomous training. It is a structured way to turn noisy execution history into compact, reviewable artifacts that future role sessions can load instead of full transcripts.

## Problem

Large projects create too much context:

- long chat/session histories
- repeated handoffs
- stale assumptions
- scattered decisions
- hidden blockers
- role-specific lessons trapped in one run

The fix is not to keep every token alive. The fix is to preserve the useful state in durable files.

## Core loop

1. **Agent dream** — each role summarizes its own completed run.
2. **Project dream** — the coordinator consolidates role dreams into project state.
3. **Team dream** — repeated patterns become suggestions, retro inputs, or playbook updates.
4. **Context reload** — future runtime sessions load only the compact current state and relevant artifacts.

## Recommended artifacts

```text
agent-notes/<project-slug>/
  dreams/
    coordinator-dream.md
    architect-dream.md
    scout-assistant-coder-dream.md
    builder-dream.md
    qa-reviewer-dream.md
  project-state.md
  decision-log.md
  open-questions.md
  next-actions.md
  context-pack.md
```

## Agent dream

A role-local dream should answer:

- What happened?
- What changed?
- What matters next?
- What assumptions were made?
- What risks remain?
- What should this role remember next time?
- Which durable artifacts were updated?

Agent dreams can be drafted from runtime transcripts, command logs, or handoffs, but the final artifact should be compact and safe to share inside the project workspace.

## Project dream

A project dream turns many role dreams into one current-state packet:

- current project state
- decisions made
- open questions
- next actions
- active risks
- artifact index
- recommended context for the next run

The project dream is the main defense against context bloat. Future sessions should read the project dream before reading older artifacts. The coordinator does not get unchecked authority: context packs should be validated by a reviewer or peer role before later sessions rely on them.

## Team dream

A team dream looks across projects or repeated issues:

- repeated coordination failures
- weak handoffs
- missing QA evidence
- unclear ownership
- stale role playbooks
- template improvements

Team dreams feed the learning loop by producing reviewed suggestions, not silent rule changes.



## Compaction trigger policy

The default automatic trigger is **3 compactions per project/session**. Compaction is treated as a runtime signal that the working context has become large enough to risk recall drift.

Recommended behavior:

1. **First compaction** — record it only.
2. **Second compaction** — mark the project/session as `dream_recommended`.
3. **Third compaction** — automatically run the Dream Cycle in the background.
4. **Successful dream** — write/validate a new context pack, store the previous context pack in context history, then reset the compaction counter for that project/session.
5. **Failed validation or conflict** — mark `dream_failed` and escalate to a coordinator/reviewer.

The trigger should be scoped to the project or session that compacted, not the entire agent team. Use a cooldown, usually 2–4 hours, so repeated compactions during the same work burst do not cause dream loops.

Dream execution should happen as background maintenance, not by creating normal visible task cards. Visible work should appear only for exceptions, conflicts, or reviewer-required cases.

## Context pack integrity

A context pack is valid only if it is present, non-empty, and contains these sections:

- Purpose
- Metadata
- Load first
- Current state
- Decisions
- Open questions
- Next actions
- Relevant artifacts
- Do not reload unless needed
- Rollback / diff notes

`agent-team-brain doctor` checks the starter context pack and every active project context pack it can infer from task artifacts. Missing or empty required sections are blocking failures.

## Versioning, diff, and rollback

Context packs should be replaceable, not silently overwritten. Before replacing a context pack, copy the old file to a history folder such as:

```text
agent-notes/<project-slug>/context-history/YYYY-MM-DDTHHMMSSZ-context-pack.md
```

Each new context pack should record:

- context pack version
- generated timestamp
- previous context pack path
- source dreams
- validator/reviewer
- summary of changes
- rollback instruction

This gives the team a lightweight diff/rollback trail without requiring a specific database or UI.

## Coordinator validation

The coordinator can draft the project dream, but larger or risky projects should have a second role validate the context pack. Good validators are QA Reviewer for release-sensitive work, Architect for system design, or Scout / Assistant Coder when the uncertainty is technical discovery.

## Context reload contract

A new task-scoped runtime session should load this minimum packet:

1. persistent role profile
2. role playbook
3. assigned task record
4. latest `context-pack.md` or `project-state.md`
5. directly relevant project artifacts
6. role-local `current-focus.md` if present

It should avoid loading full transcripts or every historical artifact unless the task explicitly needs them.

## Safety and privacy

Dream artifacts should not contain secrets, raw private transcripts, credentials, tokens, or unnecessary personal data. Store references to evidence paths and task IDs instead of copying raw logs.

## When to run a dream cycle

Run a dream cycle:

- after a large task completes
- before handing off between roles
- before resuming a project after a long pause
- when a runtime session is near its context limit
- after QA failure or repeated rework
- before team retros and playbook updates
