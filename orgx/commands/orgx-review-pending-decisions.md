Review OrgX attention requests and decisions that still need a human response.

Checklist:
- List pending attention and decisions in priority order without repeating the
  same underlying request in two sections.
- Give enough context to approve or reject safely.
- Do not auto-approve anything without explicit user confirmation.
- If a decision blocks execution, say exactly what remains blocked.
- When the conversation contains an attention ID, use `orgx_poll_attention` to
  show the durable answer and continuation state.
- After applying an answer, acknowledge `resuming` and only acknowledge
  `resumed` after Cursor produces new execution evidence.
