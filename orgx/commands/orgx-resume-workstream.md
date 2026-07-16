Resume the most relevant OrgX workstream for the current repo.

Checklist:
- Fetch bootstrap context for `source_client=cursor`.
- Use resumable workstreams and active sessions first.
- Re-state the current task, blockers, and the next concrete action.
- If proof or decisions are pending, surface them before continuing implementation.
- If an OrgX attention ID is present in the conversation, poll it before
  creating new work. Apply a resolved answer, acknowledge `resuming`, then mark
  `resumed` only after the first new tool/edit/test event.
