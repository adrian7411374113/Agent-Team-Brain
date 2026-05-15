#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const VERSION = '0.2.0';
const ROLES = ['Coordinator', 'Architect', 'UX Reviewer', 'Scout', 'Analyst', 'Builder', 'QA Reviewer'];
const LIFECYCLE = ['queued', 'active', 'blocked', 'review', 'success', 'failure'];

const STARTER_FILES = {
  'agent-team-brain.config.json': () => JSON.stringify({
    schemaVersion: 'agent-team-brain/v0.2',
    artifactRoot: 'agent-notes',
    taskState: 'agent-team-state/tasks.json',
    qaGate: { required: true, role: 'QA Reviewer' },
    roles: ROLES,
    lifecycle: LIFECYCLE
  }, null, 2) + '\n',
  'agent-team-state/tasks.json': () => JSON.stringify({
    schemaVersion: 'agent-team-brain/tasks/v0.2',
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
  'agent-notes/sample-project/brief.md': () => `# Sample Project Brief\n\n## Goal\n\nDemonstrate a complete agentic-team task flow.\n\n## Acceptance Criteria\n\n- Task state exists in this repository.\n- Builder handoff exists.\n- QA Reviewer report exists and closes the gate.\n`,
  'agent-notes/sample-project/handoff.md': () => `# Builder Handoff\n\n## Changes\n\n- Created a starter project artifact set.\n- Kept task state local to the operating system.\n\n## Validation\n\n- Run \`agent-team-brain doctor\`.\n`,
  'agent-notes/sample-project/qa-report.md': () => `# QA Report\n\n## Result\n\nPASS\n\n## Evidence\n\n- Config, task-state, artifacts, roles, and sample task flow are present.\n- QA gate is represented by a QA Reviewer task.\n`,
  'agent-notes/sample-project/lessons.md': () => `# Lessons\n\n- Keep coordination state in plain files.\n- Promote useful patterns back into the starter after QA.\n`,
  'agents/roles.md': () => `# Agent Roles\n\n${ROLES.map((role) => `- ${role}`).join('\n')}\n\nOnly team roles are used by this starter.\n`,
  'AGENT_TEAM_BRAIN.md': () => `# Agent Team Brain Starter\n\nThis folder is an artifact-driven operating system starter for an AI agent team.\n\n## Loop\n\n1. Add or update tasks in \`agent-team-state/tasks.json\`.\n2. Assign each task to a team role.\n3. Write project artifacts under \`agent-notes/<project-slug>/\`.\n4. Move build work through QA Reviewer before closing.\n5. Run \`agent-team-brain doctor\` before release.\n`
};

function usage(exitCode = 0) {
  console.log(`agent-team-brain v${VERSION}\n\nUsage:\n  agent-team-brain init [target-dir] [--force]\n  agent-team-brain install [target-dir] [--force]\n  agent-team-brain bootstrap [target-dir] [--force]\n  agent-team-brain doctor [target-dir]\n\nCommands:\n  init/install/bootstrap  Create a starter Agent Team Brain layout.\n  doctor                  Validate config, task-state, artifacts, roles, QA gate, and sample flow.`);
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

  if (config.schemaVersion === 'agent-team-brain/v0.2') checks.pass('config schemaVersion is v0.2');
  else checks.fail('config schemaVersion must be agent-team-brain/v0.2');

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

  const roleFile = path.join(targetDir, 'agents/roles.md');
  if (fs.existsSync(roleFile)) checks.pass('roles artifact exists');
  else checks.warn('roles artifact is optional but recommended: agents/roles.md');

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
