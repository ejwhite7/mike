# Streaming effect audit, 2026-09-29

This follows [the assistant update-depth investigation](2026-09-29-assistant-update-depth.md)
and [PR #556](https://github.com/open-legal-products/mike/pull/556). The audit branch
starts at that fix, so the failures below are additional to the scroll-button
effect already fixed there. All reproduction data is synthetic; no provider,
customer account or production database is used.

## Confirmed failures

### Reasoning disclosures schedule state on every text chunk

The web and Word `ReasoningBlock` implementations both measured overflow and set
several state values in an effect depending on `text`. The effect also mirrored
`isStreaming` into open/closed state. Most of those values stayed unchanged.

In the real Next development renderer, eight saved exchanges followed by 150
reasoning deltas at a requested 1ms interval, with Chromium CPU throttled 4x,
reproduced **Maximum update depth exceeded** even with #556 applied. These are
requested timer intervals, not a claim that a busy browser processed each chunk
in 1ms. A temporary diagnostic trace showed repeated `ReasoningBlock` passive
updates accumulating through depths 47–50; a subsequent stream update crossed
the limit at 51. The checked-in Playwright case reproduces the warning without
patching React. It failed before this fix and passed afterwards.

`useReasoningDisclosure` now owns the behavior for both targets. It derives the
default disclosure state from stream status, preserving explicit user choices.
A ResizeObserver watches the unclipped content; measurement is coalesced into
one animation frame, and the last published overflow value is compared before
calling a setter. Closing or unmounting cancels pending work. There is no effect
depending on the streamed text and no initial mount solely to measure hidden
historical reasoning.

The warning was reproduced in the web renderer. The Word copy shared the faulty
effect, but Word batches stream publication differently; that alone does not
establish an identical warning in its renderer. Both now exercise the shared
hook and have browser stress coverage.

### Stream chunks starve transcript positioning and visibility

The web assistant and tabular-chat history positioning effects depended on the
entire `messages` array. They hid loaded history until deferred positioning
completed: two animation frames in the assistant, a 100ms timer in tabular chat.
Each streamed chunk ran cleanup and restarted that work. Sustained traffic could
therefore leave a resumed conversation behind a skeleton or at opacity zero.
This is a liveness failure, not another maximum-depth exception.

Regressions reproduced both cases on the parent branch:

- Web: load a resumed transcript, then interleave 120 chunk updates with one
  animation frame each. The transcript remained at opacity zero.
- Tabular: reopen a chat with an active server turn and deliver 50 chunks every
  20ms. After a full second the loaded history was still invisible, although
  streamed content existed in the DOM.

The positioning effects now depend on chat/loading state, whether messages
exist, and the user-message count. Chunk updates leave the positioning callback
alive. The regression assertions run before `[DONE]`; waiting for completion
would mask the bug. Existing same-length chat-switch and geometry tests remain
part of validation.

## Scope of exploration

An AST-assisted inventory found 375 effects across 405 web/shared/add-in source
files. This is an inventory, not a claim that every interaction was exhaustively
verified. Manual follow-up prioritized state-setting effects with streaming
inputs, parent callback cycles, external-store snapshots and layout observers.

| Area | Assessment |
| --- | --- |
| Reasoning disclosure, web and Word | Shared per-chunk state effect removed; web warning reproduced |
| Web and tabular transcript reveal | Deferred-work starvation reproduced and fixed |
| Word scroll controls and live positioning | Scroll setter already guards its ref; live positioning uses a layout effect keyed by user-message identity |
| Composer model selection and sidebar activity | Actual callers memoize configured model/chat-ID arrays; existing behavior tests exercised, no additional loop established |
| Remount-persistent state and Word quick-action store | Snapshots return cached values rather than allocating on every read; no new loop established |
| Document-table parent callbacks and selection | Memoized derived selection and stable parent callbacks inspected; no new loop established |
| Tabular document side panel and breadcrumb measurement | Broad dependencies/measurement setters inspected; no demonstrated feedback loop, left unchanged |
| Smoothed text reveal | Scheduler can remain active while caught up; not established as the source of these passive-update failures and left unchanged |

## Prevention and limits

The browser regressions use paced ReadableStreams, long transcripts, constrained
CPU and live disclosure/viewport changes. The web reasoning case reaches sixteen
exchanges; the Word case sends sixteen exchanges in Chromium and WebKit. Console
errors and uncaught exceptions fail the checks. Unit regressions exercise 300
chunk updates, coalesced resize notifications, user choice, reopening, Strict
Mode cleanup and transcript visibility during an unfinished stream.

The Word workflow now runs the focused stress test against a development bundle
as well as its existing production suite. #556 supplies the corresponding Next
development job. Mark those checks required in branch protection: a workflow
definition cannot itself enforce repository settings. The review guidance lives
in [frontend-testing.md](../frontend-testing.md#review-effects-for-update-loops-and-starvation).

React's specific passive-depth diagnostic is development-only. Its absence in
production or Sentry does not prove that the effect pattern was harmless. The
positioning-starvation behavior is ordinary application logic and is not gated
by React's development mode. This audit does not establish that a particular
customer saw that separate symptom, or why their development warning was absent
from Sentry; it does not change error-reporting policy.
