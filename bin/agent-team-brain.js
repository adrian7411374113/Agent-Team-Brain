#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const VERSION = '0.3.1';
const ROLES = ['Coordinator', 'Architect', 'UX Reviewer', 'Scout / Assistant Coder', 'Analyst', 'Builder', 'QA Reviewer'];
const LIFECYCLE = ['queued', 'active', 'blocked', 'review', 'success', 'failure'];

function roleSlug(role) {
  return role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const STARTER_FILES = {
  'agent-team-brain.config.json': () => JSON.stringify({
    schemaVersion: 'agent-team-brain/v0.3',
    artifactRoot: 'agent-notes',
    taskState: 'agent-team-state/tasks.json',
    qaGate: { required: true, role: 'QA Reviewer' },
    roles: ROLES,
    lifecycle: LIFECYCLE,
    learning: {
      afterActionTemplate: 'templates/learning-loop/after-action-review.md',
      suggestions: 'agent-team-state/learning-suggestions.json',
      playbookRoot: 'agents/playbooks'
    },
    runtime: {
      roleProfileRoot: 'agents/roles',
      roleWorkspaceRoot: 'agents/workspaces',
      sharedWorkspaceRoot: 'agent-notes',
      runtimeBindings: 'agents/runtime-bindings.example.json'
    }
  }, null, 2) + '\n',
  'agent-team-state/tasks.json': () => JSON.stringify({
    schemaVersion: 'agent-team-brain/tasks/v0.3',
    tasks: [
      {
        id: 'sample-brief',
        title: 'Write the starter project brief',
        status: 'success',
        role: 'Coordinator',
        artifacts: ['agent-notes/sample-project/brief.md'],
        history: [
          { status: 'queued', note: 'Project captured.' },
          { status: 'active', note: 'Coordinator drafted the brief.' },
          { status: 'success', note: 'Brief ready for planning.' }
        ]
      },
      {
        id: 'sample-build',
        title: 'Build the starter project change',
        status: 'success',
        role: 'Builder',
        blockedBy: ['sample-brief'],
        artifacts: ['agent-notes/sample-project/handoff.md'],
        history: [
          { status: 'queued', note: 'Waiting for brief.' },
          { status: 'active', note: 'Builder implemented the change.' },
          { status: 'review', note: 'Ready for QA review.' },
          { status: 'success', note: 'Builder handoff complete.' }
        ]
      },
      {
        id: 'sample-qa',
        title: 'Review the starter project change',
        status: 'success',
        role: 'QA Reviewer',
        blockedBy: ['sample-build'],
        artifacts: ['agent-notes/sample-project/qa-report.md'],
        history: [
          { status: 'queued', note: 'Waiting for builder handoff.' },
          { status: 'active', note: 'QA Reviewer checked acceptance criteria.' },
          { status: 'success', note: 'QA gate passed.' }
        ]
      }
    ]
  }, null, 2) + '\n',
  'agent-team-state/learning-suggestions.json': () => JSON.stringify({
    schemaVersion: 'agent-team-brain/learning-suggestions/v0.3',
    suggestions: []
  }, null, 2) + '\n',
  'agents/playbooks/coordinator.md': () => `# Coordinator Playbook

## Mission

Own scope, sequencing, final close, and durable lesson promotion.

## Before starting

- Confirm task state and artifacts exist.
- Pick the lightest process tier that protects quality.

## Handoff expectations

- Every accepted process upgrade becomes a normal update task.

## Recent promoted lessons

- Keep adapters separate from the standalone operating model.
`,
  'agents/runtime-bindings.example.json': () => JSON.stringify({
    schemaVersion: 'agent-team-brain/runtime-bindings/v0.3',
    note: 'Optional: map persistent role profiles to your runtime sessions, workers, or tools. Keep provider-specific details out of the core files.',
    bindings: ROLES.map((role) => ({ role, profile: `agents/roles/${roleSlug(role)}.md`, workspace: `agents/workspaces/${roleSlug(role)}` }))
  }, null, 2) + '\n',
  'agents/workspaces/README.md': () => `# Agent Workspaces

These folders are durable, role-local scratch spaces. They are optional but recommended when a role is run repeatedly.

Use them for:

- current focus
- local scratch notes
- lessons in progress before promotion
- runtime-specific handoff reminders

Do not store secrets. Shared project artifacts belong in \`agent-notes/<project-slug>/\`.
`,
  'agents/roles/coordinator.md': () => `# Coordinator Profile

## Mission

Own scope, sequencing, synthesis, closeout, and durable lesson promotion.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/coordinator/current-focus.md': () => `# Current Focus — Coordinator

- No active focus yet.
`,
  'agents/workspaces/coordinator/scratch.md': () => `# Scratch — Coordinator

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'agents/roles/architect.md': () => `# Architect Profile

## Mission

Design data/control flow, interfaces, failure modes, migration, and rollback.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/architect/current-focus.md': () => `# Current Focus — Architect

- No active focus yet.
`,
  'agents/workspaces/architect/scratch.md': () => `# Scratch — Architect

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'agents/roles/ux-reviewer.md': () => `# UX Reviewer Profile

## Mission

Review layout, information hierarchy, accessibility, mobile usability, and interaction polish.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/ux-reviewer/current-focus.md': () => `# Current Focus — UX Reviewer

- No active focus yet.
`,
  'agents/workspaces/ux-reviewer/scratch.md': () => `# Scratch — UX Reviewer

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'agents/roles/scout-assistant-coder.md': () => `# Scout / Assistant Coder Profile

## Mission

Research unknowns, probe APIs, build prototypes, write small isolated code, and validate implementation assumptions before the main build.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/scout-assistant-coder/current-focus.md': () => `# Current Focus — Scout / Assistant Coder

- No active focus yet.
`,
  'agents/workspaces/scout-assistant-coder/scratch.md': () => `# Scratch — Scout / Assistant Coder

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'agents/roles/analyst.md': () => `# Analyst Profile

## Mission

Handle domain analysis, data interpretation, and briefing-quality synthesis.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/analyst/current-focus.md': () => `# Current Focus — Analyst

- No active focus yet.
`,
  'agents/workspaces/analyst/scratch.md': () => `# Scratch — Analyst

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'agents/roles/builder.md': () => `# Builder Profile

## Mission

Implement and integrate the main change while keeping the handoff clear for review.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/builder/current-focus.md': () => `# Current Focus — Builder

- No active focus yet.
`,
  'agents/workspaces/builder/scratch.md': () => `# Scratch — Builder

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'agents/roles/qa-reviewer.md': () => `# QA Reviewer Profile

## Mission

Verify acceptance criteria, regression risk, behavior, and release confidence.

## Responsibilities

- Read shared task state before acting.
- Write durable outputs to the shared project artifact folder.
- Keep role-local scratch notes in this role workspace.
- Promote durable lessons only through reviewed suggestions or retros.

## Runtime binding

This profile can be loaded by any compatible agent runtime. The profile is persistent; individual runs are task-scoped.
`,
  'agents/workspaces/qa-reviewer/current-focus.md': () => `# Current Focus — QA Reviewer

- No active focus yet.
`,
  'agents/workspaces/qa-reviewer/scratch.md': () => `# Scratch — QA Reviewer

Temporary notes for this persistent role. Promote durable lessons to playbooks through the learning loop.
`,
  'templates/learning-loop/after-action-review.md': () => `# After-Action Review

## Source task

- Task ID:
- Role:
- Project/artifacts:

## What worked

-

## What broke or nearly broke

-

## What slowed us down

-

## Next-time change

-

## Category

workflow, handoff, qa, tooling, ux, architecture, coordination, memory, other

## Promotion target

none, project lessons, template, procedure, tools note, skill, agent playbook
`,
  'templates/learning-loop/trace-score.md': () => `# Trace Score

Trace scores are coaching signals, not rankings.

## Source task

- Task ID:
- Role:
- Confidence: low / medium / high
- Overall: 0–100

## Dimensions

| Dimension | Score 0–5 | Driver |
|---|---:|---|
| Brief clarity |  |  |
| Execution trace |  |  |
| Validation quality |  |  |
| Coordination quality |  |  |
| Rework risk |  |  |
| Learning value |  |  |

## Drivers

-
`,
  'templates/learning-loop/process-upgrade-suggestion.md': () => `# Process Upgrade Suggestion

## Suggestion

- ID:
- Fingerprint:
- Category:
- Target:
- Confidence:
- State: suggested

## Evidence task IDs

-

## Coordinator decision

- [ ] Accept → create update task
- [ ] Dismiss
`,
  'templates/learning-loop/agent-playbook.md': () => `# Agent Playbook

## Role


## Mission


## Before starting

-

## Good patterns

-

## Common failure modes

-

## Handoff expectations

-

## QA / validation expectations

-

## Recent promoted lessons

-
`,
  'templates/learning-loop/learning-retro.md': () => `# Team Learning Retro

## Project


## Summary


## Trace scoring themes

-

## Agent lesson rollups

-

## Repeated issues

-

## Accepted process upgrades

-

## Playbook/template/procedure updates

-
`,
  'agent-notes/sample-project/brief.md': () => `# Sample Project Brief\n\n## Goal\n\nDemonstrate a complete agentic-team task flow.\n\n## Acceptance Criteria\n\n- Task state exists in this repository.\n- Builder handoff exists.\n- QA Reviewer report exists and closes the gate.\n`,
  'agent-notes/sample-project/handoff.md': () => `# Builder Handoff\n\n## Changes\n\n- Created a starter project artifact set.\n- Kept task state local to the operating system.\n\n## Validation\n\n- Run \`agent-team-brain doctor\`.\n`,
  'agent-notes/sample-project/qa-report.md': () => `# QA Report\n\n## Result\n\nPASS\n\n## Evidence\n\n- Config, task-state, artifacts, roles, and sample task flow are present.\n- QA gate is represented by a QA Reviewer task.\n`,
  'agent-notes/sample-project/lessons.md': () => `# Lessons\n\n- Keep coordination state in plain files.\n- Promote useful patterns back into the starter after QA.\n`,
  'agents/roles.md': () => `# Agent Roles\n\n${ROLES.map((role) => `- ${role}`).join('\n')}\n\nOnly team roles are used by this starter.\n`,
  'AGENT_TEAM_BRAIN.md': () => `# Agent Team Brain Starter\n\nThis folder is an artifact-driven operating system starter for an AI agent team.\n\n## Loop\n\n1. Add or update tasks in \`agent-team-state/tasks.json\`.\n2. Assign each task to a persistent team role profile.\n3. Use \`agents/workspaces/<role-slug>/\` for role-local scratch notes.\n4. Write project artifacts under \`agent-notes/<project-slug>/\`.\n5. Move build work through QA Reviewer before closing.\n6. Run \`agent-team-brain doctor\` before release.\n`
};

function usage(exitCode = 0) {
  console.log(`agent-team-brain v${VERSION}\n\nUsage:\n  agent-team-brain init [target-dir] [--force]\n  agent-team-brain install [target-dir] [--force]\n  agent-team-brain bootstrap [target-dir] [--force]\n  agent-team-brain doctor [target-dir]\n\nCommands:\n  init/install/bootstrap  Create a starter Agent Team Brain layout.\n  doctor                  Validate config, task-state, artifacts, persistent roles, QA gate, learning loop, and sample flow.`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = new Set(rest.filter((arg) => arg.startsWith('--')));
  const target = rest.find((arg) => !arg.startsWith('--')) || '.';
  return { command, targetDir: path.resolve(process.cwd(), target), force: flags.has('--force') };
}

function writeStarter(targetDir, force) {
  fs.mkdirSync(targetDir, { recursive: true });
  const written = [];
  const skipped = [];
  for (const [relative, makeContent] of Object.entries(STARTER_FILES)) {
    const filePath = path.join(targetDir, relative);
    if (fs.existsSync(filePath) && !force) {
      skipped.push(relative);
      continue;
    }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, makeContent(), 'utf8');
    written.push(relative);
  }
  console.log(`Agent Team Brain starter ready at ${targetDir}`);
  for (const file of written) console.log(`pass wrote ${file}`);
  for (const file of skipped) console.log(`warn kept existing ${file}`);
}

function readJson(filePath, checks) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    checks.fail(`${path.basename(filePath)} is missing or invalid JSON: ${error.message}`);
    return null;
  }
}

function makeChecks() {
  const rows = [];
  return {
    pass: (message) => rows.push(['pass', message]),
    warn: (message) => rows.push(['warn', message]),
    fail: (message) => rows.push(['fail', message]),
    rows,
    failed: () => rows.some(([kind]) => kind === 'fail')
  };
}

function validateDoctor(targetDir) {
  const checks = makeChecks();
  const configPath = path.join(targetDir, 'agent-team-brain.config.json');
  const config = readJson(configPath, checks);
  if (!config) return printDoctor(checks);

  if (config.schemaVersion === 'agent-team-brain/v0.3') checks.pass('config schemaVersion is v0.3');
  else checks.fail('config schemaVersion must be agent-team-brain/v0.3');

  const missingRoles = ROLES.filter((role) => !config.roles?.includes(role));
  const extraRoles = (config.roles || []).filter((role) => !ROLES.includes(role));
  if (missingRoles.length === 0 && extraRoles.length === 0) checks.pass('team role set is complete');
  else checks.fail(`roles must exactly match team roles; missing: ${missingRoles.join(', ') || 'none'}; extra: ${extraRoles.join(', ') || 'none'}`);

  if (config.qaGate?.required === true && config.qaGate?.role === 'QA Reviewer') checks.pass('QA gate requires QA Reviewer');
  else checks.fail('qaGate.required must be true and qaGate.role must be QA Reviewer');

  const taskStateRel = config.taskState || 'agent-team-state/tasks.json';
  const taskStatePath = path.join(targetDir, taskStateRel);
  const taskState = readJson(taskStatePath, checks);
  if (!taskState) return printDoctor(checks);
  if (Array.isArray(taskState.tasks) && taskState.tasks.length > 0) checks.pass('task-state contains tasks');
  else checks.fail('task-state must contain at least one task');

  const tasks = taskState.tasks || [];
  const ids = new Set(tasks.map((task) => task.id));
  const invalid = tasks.filter((task) => !task.id || !task.title || !ROLES.includes(task.role) || !LIFECYCLE.includes(task.status));
  if (invalid.length === 0) checks.pass('tasks have id, title, team role, and valid lifecycle status');
  else checks.fail(`invalid task records: ${invalid.map((task) => task.id || '(missing id)').join(', ')}`);

  const brokenDeps = [];
  for (const task of tasks) for (const dep of task.blockedBy || []) if (!ids.has(dep)) brokenDeps.push(`${task.id}->${dep}`);
  if (brokenDeps.length === 0) checks.pass('task dependencies resolve inside task-state');
  else checks.fail(`task dependencies are missing: ${brokenDeps.join(', ')}`);

  const artifactRoot = config.artifactRoot || 'agent-notes';
  if (fs.existsSync(path.join(targetDir, artifactRoot))) checks.pass('artifact root exists');
  else checks.fail(`artifact root is missing: ${artifactRoot}`);

  const missingArtifacts = [];
  for (const task of tasks) for (const artifact of task.artifacts || []) if (!fs.existsSync(path.join(targetDir, artifact))) missingArtifacts.push(artifact);
  if (missingArtifacts.length === 0) checks.pass('task artifacts exist');
  else checks.fail(`referenced artifacts are missing: ${missingArtifacts.join(', ')}`);

  const hasBuilder = tasks.some((task) => task.role === 'Builder' && task.status === 'success');
  const hasQa = tasks.some((task) => task.role === 'QA Reviewer' && task.status === 'success' && (task.blockedBy || []).length > 0);
  const hasFlowHistory = tasks.some((task) => (task.history || []).some((entry) => entry.status === 'queued')) && tasks.some((task) => (task.history || []).some((entry) => entry.status === 'active'));
  if (hasBuilder && hasQa && hasFlowHistory) checks.pass('sample task flow demonstrates build followed by QA');
  else checks.fail('sample task flow must include Builder success, dependent QA Reviewer success, and lifecycle history');

  const suggestionsRel = config.learning?.suggestions || 'agent-team-state/learning-suggestions.json';
  const suggestionsPath = path.join(targetDir, suggestionsRel);
  const suggestions = readJson(suggestionsPath, checks);
  if (suggestions && Array.isArray(suggestions.suggestions)) checks.pass('learning suggestions store exists');
  else checks.fail('learning suggestions store must contain a suggestions array');

  const afterActionTemplate = path.join(targetDir, config.learning?.afterActionTemplate || 'templates/learning-loop/after-action-review.md');
  if (fs.existsSync(afterActionTemplate)) checks.pass('after-action review template exists');
  else checks.fail('after-action review template is missing');

  const traceScoreTemplate = path.join(targetDir, 'templates/learning-loop/trace-score.md');
  if (fs.existsSync(traceScoreTemplate)) checks.pass('trace score template exists');
  else checks.warn('trace score template is recommended for learning-loop v0.3');

  const retroTemplate = path.join(targetDir, 'templates/learning-loop/learning-retro.md');
  if (fs.existsSync(retroTemplate)) checks.pass('team learning retro template exists');
  else checks.warn('team learning retro template is recommended for larger projects');

  const agentPlaybookTemplate = path.join(targetDir, 'templates/learning-loop/agent-playbook.md');
  if (fs.existsSync(agentPlaybookTemplate)) checks.pass('agent playbook template exists');
  else checks.warn('agent playbook template is recommended for playbook evolution');

  const playbookRoot = path.join(targetDir, config.learning?.playbookRoot || 'agents/playbooks');
  if (fs.existsSync(playbookRoot)) checks.pass('agent playbook root exists');
  else checks.warn('agent playbook root is recommended for playbook evolution');

  const roleFile = path.join(targetDir, 'agents/roles.md');
  if (fs.existsSync(roleFile)) checks.pass('roles artifact exists');
  else checks.warn('roles artifact is optional but recommended: agents/roles.md');

  const roleProfileRoot = path.join(targetDir, config.runtime?.roleProfileRoot || 'agents/roles');
  const missingProfiles = ROLES.map(roleSlug).filter((slug) => !fs.existsSync(path.join(roleProfileRoot, `${slug}.md`)));
  if (missingProfiles.length === 0) checks.pass('persistent role profiles exist');
  else checks.warn(`persistent role profiles are recommended: ${missingProfiles.join(', ')}`);

  const workspaceRoot = path.join(targetDir, config.runtime?.roleWorkspaceRoot || 'agents/workspaces');
  const missingWorkspaces = ROLES.map(roleSlug).filter((slug) => !fs.existsSync(path.join(workspaceRoot, slug, 'scratch.md')));
  if (missingWorkspaces.length === 0) checks.pass('role-local workspaces exist');
  else checks.warn(`role-local workspaces are recommended: ${missingWorkspaces.join(', ')}`);

  const runtimeBindings = path.join(targetDir, config.runtime?.runtimeBindings || 'agents/runtime-bindings.example.json');
  if (fs.existsSync(runtimeBindings)) checks.pass('runtime bindings example exists');
  else checks.warn('runtime bindings example is recommended for mapping profiles to your agent runtime');

  return printDoctor(checks);
}

function printDoctor(checks) {
  for (const [kind, message] of checks.rows) console.log(`${kind} ${message}`);
  if (checks.failed()) {
    console.log('fail Agent Team Brain doctor found blocking issues. Run `agent-team-brain init` or fix the failed checks.');
    return 1;
  }
  console.log('pass Agent Team Brain doctor passed.');
  return 0;
}

const { command, targetDir, force } = parseArgs(process.argv.slice(2));
if (!command || command === '--help' || command === '-h') usage(0);
if (command === '--version' || command === '-v') {
  console.log(VERSION);
  process.exit(0);
}
if (['init', 'install', 'bootstrap'].includes(command)) {
  writeStarter(targetDir, force);
  process.exit(0);
}
if (command === 'doctor') process.exit(validateDoctor(targetDir));
console.error(`Unknown command: ${command}`);
usage(1);
