Show the OrgX operator chronicle for yesterday, the past week, and the past 30 days.

Workflow:

1. Prefer the OrgX MCP tool `get_operator_chronicle` with `period: "30d"` when it is available in Cursor's MCP tool list.
2. If Cursor has not refreshed the tool list and `get_operator_chronicle` is not callable, use `orgx_recommend` with `mode: "morning_brief"` as the stale-client fallback.
3. Lead with `reportingNarrative.briefMarkdown`.
4. Then call out decision chronology, artifact ledger, PR velocity, goals, initiatives, data gaps, and the first recommended action.
5. Be explicit when goals are provisional signals from `decision_requests` rather than accepted OrgX goals.
6. Do not treat Cursor hook outbox records as live reporting proof. Hooks are a reconciliation backstop only.
