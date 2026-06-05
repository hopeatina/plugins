---
name: orgx-runtime-reporting
description: Use when Cursor should report progress, artifacts, blockers, or completion state back to OrgX during a live task.
---

# OrgX Runtime Reporting

Use this skill when Cursor should keep OrgX updated during execution.

## Reporting contract

There are two reporting paths:

- **Active path:** call OrgX MCP tools during the work when you know the
  initiative, task, decision, blocker, or artifact context.
- **Chronicle readout:** for operator reporting, call
  `get_operator_chronicle` first when Cursor exposes it. Its
  `reportingNarrative.briefMarkdown` is the canonical concise answer for
  yesterday, week, 30-day decision chronology, artifacts, PR velocity, goals,
  initiatives, gaps, and top priorities.
- **Stale-client fallback:** if the hosted OrgX MCP server advertises
  `get_operator_chronicle` but Cursor has not refreshed its callable tool list,
  immediately call `orgx_recommend` with `mode: "morning_brief"` and present
  the returned `reportingNarrative.briefMarkdown`. Do not ask the user to
  reconnect before giving the report.
- **Passive backstop:** Cursor lifecycle hooks record compact session events for
  later Work Graph reconciliation.

Do not treat hook presence as a substitute for intentional OrgX writes. Hooks
answer whether OrgX was used; MCP calls make the work durable in OrgX while the
session is still fresh.

## Workflow

1. Resolve available IDs from args, env, or the current OrgX context:
- `ORGX_INITIATIVE_ID`
- `ORGX_WORKSTREAM_ID`
- `ORGX_TASK_ID`
- `ORGX_RUN_ID`
- `ORGX_CORRELATION_ID`

2. For reporting questions, retrieve the operator chronicle:
- Use `get_operator_chronicle` with `period: "30d"` for broad clarity when it
  is callable in Cursor.
- Use `period: "day"` or `period: "week"` when the user asks for yesterday or
  this week.
- If `get_operator_chronicle` is not callable in the current Cursor session,
  use `orgx_recommend` with `mode: "morning_brief"` and treat the response as a
  stale-client fallback.
- Lead with `reportingNarrative.briefMarkdown`, then drill into decisions,
  artifacts, PR velocity, goals, initiatives, data gaps, and first action.
- If goals are provisional signals from `decision_requests`, say so; do not
  present them as accepted goals.

3. Emit activity at meaningful milestones:
- `intent`
- `execution`
- `handoff`
- `blocked`
- `completed`

4. Register proof of work:
- When you produce a file, diff, document, screenshot, or report, register it as
  an artifact with a concrete summary.

5. Handle blockers structurally:
- If judgment is required, request a decision with explicit options.
- If context is missing, report the exact missing dependency.

6. Close execution cleanly:
- When the task is complete and verified, emit completion activity and update
  entity state if the task ID is available.

7. If no OrgX IDs are available:
- Continue the work, but make the final response easy for the hook reconciler to
  classify: name decisions, artifacts, blockers, next actions, and verification.
- Do not claim OrgX was updated unless an MCP tool or API call actually
  succeeded.

8. Preserve Work Graph continuity:
- When a Work Graph report is generated, include its `work_graph_fingerprint`
  and `signup_hydration.hydration_key` in summaries or artifacts that are safe
  to store.
- Treat the fingerprint as the durable claim key that lets OrgX hydrate
  pre-signup audit value into a user's future workspace.
- Never derive the fingerprint from secrets or raw transcripts that would need
  to leave the local machine.

## Quality bar

- Never post empty status updates.
- Messages must be evidence-based and specific.
- Include OrgX IDs whenever available.
- Use `source_client=cursor`.
- Preserve secrets: never emit tokens, cookies, API keys, or storage state into
  activity, retro, hook summaries, or final reports.
