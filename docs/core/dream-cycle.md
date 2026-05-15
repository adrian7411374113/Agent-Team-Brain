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

The project dream is the main defense against context bloat. Future sessions should read the project dream before reading older artifacts.

## Team dream

A team dream looks across projects or repeated issues:

- repeated coordination failures
- weak handoffs
- missing QA evidence
- unclear ownership
- stale role playbooks
- template improvements

Team dreams feed the learning loop by producing reviewed suggestions, not silent rule changes.

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
