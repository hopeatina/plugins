# `@useorgx/cursor-plugin`

OrgX plugin for Cursor.

This repo contains the plugin artifact needed for Cursor Marketplace submission and local Cursor installs. It bundles the OrgX MCP server with Cursor-native rules, commands, hooks, skills, and specialist agents.

## What this plugin includes

- `.cursor-plugin/plugin.json` manifest
- `.mcp.json` pointing at the hosted OrgX MCP server
- Cursor rules for the OrgX execution loop
- Commands for starting and resuming workstreams, checking proof, and reviewing decisions
- A truthful MCP attention loop for asking, polling, applying, and acknowledging
  owner input without inventing native hook support
- Operator chronicle reporting for yesterday, week, 30-day decisions, artifacts,
  PR velocity, goals, initiatives, data gaps, and top priorities
- Quiet hooks for session, tool, and subagent lifecycle events
- Passive Work Graph hook outbox for audit-first reconciliation
- Specialist agents for engineering, product, design, operations, marketing, sales, and orchestration

## Local testing

1. Run `npm run verify`
2. Run `npm run install:local`
3. Restart Cursor or run `Developer: Reload Window`
4. Confirm the plugin loads from `~/.cursor/plugins/local/orgx`

## Hook behavior

Cursor lifecycle hooks call `scripts/hooks/record-work-graph-event.mjs`. The
script writes compact, redacted JSONL events to
`~/.config/useorgx/wizard/hooks/events.jsonl` by default, or to
`ORGX_WIZARD_HOOK_OUTBOX` when set.

These hook records are a passive backstop for later Work Graph reconciliation.
They should answer whether meaningful work happened without durable OrgX
writeback. They do not store raw prompts, raw transcripts, API keys, tokens, or
storage state.

For live reporting, use MCP before hooks: `get_operator_chronicle` is the
preferred tool when Cursor exposes it. If Cursor has a stale MCP tool list, use
`orgx_recommend` with `mode: "morning_brief"` and present
`reportingNarrative.briefMarkdown`.

## Attention and continuation

Use `/orgx-request-attention` when Cursor needs a real owner answer. The command
uses `orgx_request_attention`, persists the returned ID in the conversation,
then uses `orgx_poll_attention` and `orgx_ack_attention` when work continues.

Cursor lifecycle hooks in this bundle can observe session, tool, and subagent
events, but they do not expose a supported handle for deferring and replying to
a native question in place. The plugin therefore declares continuation strategy
`poll`, and only reports `resumed` after a new Cursor tool/edit/test event. This
is intentionally different from the Codex app-server and Claude AskUserQuestion
bridges, which can preserve a native request handle.

## Marketplace

Cursor plugin docs:

- `https://cursor.com/docs/plugins`
- `https://cursor.com/docs/reference/plugins`
- `https://cursor.com/marketplace/publish`

The current repo is the product artifact that was previously missing. `orgx-mcp` is only the remote MCP server; Cursor Marketplace expects a plugin bundle repo like this one.
