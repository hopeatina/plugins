Route a real human interruption through the active OrgX initiative without losing
the workstream context.

Workflow:

1. Use `orgx_request_attention` with `source_client: "cursor"`, a stable
   `idempotency_key`, the active initiative/workstream/run identifiers, and the
   narrowest accurate `attention_kind`.
2. Use `continuation.strategy: "poll"`. Cursor's current plugin hooks do not
   expose a supported defer-and-reply handle for a native question, so do not
   claim the current Cursor turn will resume automatically.
3. Present the returned attention ID once, explain exactly what is paused, and
   stop taking dependent actions.
4. When the conversation continues, call `orgx_poll_attention` with that ID.
5. If unresolved, say that the owner response is still pending. Do not create a
   duplicate request.
6. If resolved, call `orgx_ack_attention` with `state: "resuming"`, apply the
   answer to the preserved workstream context, and take the next concrete step.
7. Call `orgx_ack_attention` with `state: "resumed"` only after a real Cursor
   tool, edit, test, or progress event proves work moved again. Use
   `resume_failed` with the recovery action when it did not.

Do not use attention for model turn limits, automatic retry boundaries, or
ordinary progress updates. Never put credentials or secret answers in OrgX.
