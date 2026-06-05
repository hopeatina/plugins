import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const requiredFiles = [
  '.cursor-plugin/plugin.json',
  '.mcp.json',
  'rules/orgx-execution-loop.mdc',
  'hooks/hooks.json',
  'scripts/hooks/record-work-graph-event.mjs',
  'commands/orgx-start-workstream.md',
  'commands/orgx-operator-chronicle.md',
  'skills/orgx-execution-control-plane/SKILL.md',
  'skills/orgx-runtime-reporting/SKILL.md',
  'agents/orchestrator.md'
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(file)));
if (missing.length) {
  console.error('Missing required plugin files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(resolve('.cursor-plugin/plugin.json'), 'utf8'));
const mcp = JSON.parse(readFileSync(resolve('.mcp.json'), 'utf8'));
const hooks = JSON.parse(readFileSync(resolve('hooks/hooks.json'), 'utf8'));

if (!manifest.name || !manifest.version) {
  throw new Error('plugin.json must include at least name and version');
}

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
if (pkg.version !== manifest.version) {
  throw new Error('package.json version must match plugin.json version');
}
if (!manifest.description.includes('operator chronicle reporting')) {
  throw new Error('plugin description must mention operator chronicle reporting');
}

if (!mcp.mcpServers || !mcp.mcpServers.orgx || !mcp.mcpServers.orgx.url) {
  throw new Error('.mcp.json must define the orgx MCP server');
}

if (!hooks.hooks || !hooks.hooks.sessionStart) {
  throw new Error('hooks/hooks.json must include sessionStart hooks');
}

for (const [eventName, scriptName] of [
  ['sessionStart', 'session-start.mjs'],
  ['postToolUse', 'post-tool-use.mjs'],
  ['postToolUseFailure', 'post-tool-use-failure.mjs'],
  ['subagentStart', 'subagent-start.mjs'],
  ['subagentStop', 'subagent-stop.mjs']
]) {
  if (!Array.isArray(hooks.hooks[eventName]) || hooks.hooks[eventName].length === 0) {
    throw new Error(`hooks/hooks.json must include ${eventName} hooks`);
  }
  const hasOrgxCommand = hooks.hooks[eventName].some(
    (entry) =>
      entry &&
      typeof entry.command === 'string' &&
      entry.command.includes(`scripts/hooks/${scriptName}`)
  );
  if (!hasOrgxCommand) {
    throw new Error(`${eventName} must call scripts/hooks/${scriptName}`);
  }
}

const hookScript = readFileSync(resolve('scripts/hooks/record-work-graph-event.mjs'), 'utf8');
const installScript = readFileSync(resolve('scripts/install-local.mjs'), 'utf8');
if (!hookScript.includes('orgx_cursor_plugin_runtime_hook')) {
  throw new Error('record-work-graph-event.mjs must emit orgx_cursor_plugin_runtime_hook records');
}
if (!hookScript.includes('ORGX_WIZARD_HOOK_OUTBOX')) {
  throw new Error('record-work-graph-event.mjs must support ORGX_WIZARD_HOOK_OUTBOX');
}
if (hookScript.includes('transcript_path:')) {
  throw new Error('record-work-graph-event.mjs must not persist raw transcript paths');
}
if (!hookScript.includes('exitCodeForResult')) {
  throw new Error('record-work-graph-event.mjs must expose hook failure exit handling');
}
if (!installScript.includes("fileURLToPath(import.meta.url)")) {
  throw new Error('install-local.mjs must resolve plugin root with fileURLToPath');
}
if (!installScript.includes("resolve(localPluginsDir, 'orgx')")) {
  throw new Error('install-local.mjs must install under the orgx plugin name');
}

for (const file of [
  'README.md',
  'commands/orgx-operator-chronicle.md',
  'skills/orgx-runtime-reporting/SKILL.md',
  'skills/orgx-execution-control-plane/SKILL.md',
  'rules/orgx-execution-loop.mdc'
]) {
  const text = readFileSync(resolve(file), 'utf8');
  if (!text.includes('get_operator_chronicle')) {
    throw new Error(`${file} must route reporting through get_operator_chronicle`);
  }
  if (!text.includes('orgx_recommend') || !text.includes('mode: "morning_brief"')) {
    throw new Error(`${file} must document the orgx_recommend morning_brief stale-client fallback`);
  }
}

console.log('Plugin manifest, MCP config, and hooks look valid.');
