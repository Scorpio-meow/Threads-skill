# Benchmark Summary

[繁體中文](BENCHMARK.md) | **English** | [日本語](BENCHMARK.ja.md) | [한국어](BENCHMARK.ko.md)

A summary of three rounds of "with skill vs without skill" evals for the threads-api skill. The tasks and checklists are in [`evals.json`](evals.json); item-by-item verdicts for every run, along with the grader's evidence, are in [`benchmark.json`](benchmark.json).

## Eval setup

| Item | Details |
|---|---|
| Answering model | `claude-opus-5-5` (same model for both the with-skill and without-skill setups) |
| Grading and analysis model | `claude-opus-5-5`; the grader took no part in answering |
| Runs per task per setup | 1 |
| Grading method | Each predefined checklist item is marked pass or fail, with evidence (quoted response text, code line numbers, results observed against the mock server) |

| Round | Time (UTC) | Tasks |
|---|---|---|
| Round 1 | 2026-10-13 07:07 | 1, 2, 3 |
| Round 2 | 2026-10-13 08:14 | 2, 3, 4, 5 |
| Round 3 | 2026-10-14 02:13 | 2, 3, 4, 5 |

The skill was revised between rounds based on the grader's feedback. Task 1 scored full marks on both sides and didn't separate them, so rounds 2 onward use tasks 2–5; task 3 gained one checklist item starting in round 2.

## Checklist items passed

Formatted as "with skill vs without skill":

| Task | Round 1 | Round 2 | Round 3 |
|---|---|---|---|
| 1. Python carousel post (two images + one video) | 8/8 vs 8/8 | — | — |
| 2. TypeScript daily insights job with token refresh | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 |
| 3. Publishing a ghost post with a poll on the user's behalf | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 |
| 4. Diagnosing unexpected search, location, and profile lookup results | — | 6/6 vs 5/6 | 6/6 vs 5/6 |
| 5. Auto-hiding replies that contain keywords | — | 7/7 vs 6/7 | 7/7 vs 6/7 |
| **Average pass rate** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** |

The average pass rate is the mean of the per-task pass rates.

## Average time and token usage

| Round | With skill | Without skill |
|---|---|---|
| Round 1 | 930 s, 205K tokens | 840 s, 177K tokens |
| Round 2 | 599 s, 164K tokens | 776 s, 165K tokens |
| Round 3 | 706 s, 178K tokens | 963 s, 189K tokens |

In round 1, the with-skill runs were slower and used more tokens, because the skill itself adds about 11K tokens to read in; in rounds 2 and 3 they were actually faster, which the grader attributed to less trial and error. Time varied widely between tasks (in round 3, without-skill runs ranged from 298 to 1,613 seconds), so treat these averages as rough guides only.

## Points lost

### Without skill

| Task | Rounds | Reason |
|---|---|---|
| 2 | Rounds 1, 2 | Paginated by following `paging.next` only, without reading `paging.cursors.after`; the docs state that post list responses have no `next`, so by the docs' own account this only fetches the first page. |
| 2 | Rounds 1, 2 | Token refresh didn't check the documented rules: it never confirmed that the imported token was at least 24 hours old and not yet expired. |
| 3 | All three rounds | Didn't state clearly that a ghost post can't include a poll, only that it "might not work," and even offered to send both features together to see what happens. The docs state that the only attachment a ghost post supports is a text spoiler. |
| 3 | All three rounds | The response didn't list the actual parameters to be sent (`media_type`, `poll_attachment`, `is_ghost_post`); they appeared only in the script, so the user couldn't see them before confirming. |
| 3 | Rounds 1, 2 | Called `GET /me`, but only to validate the token, without first telling the user which account it would post to and waiting for confirmation; in round 2 the publish script never called `GET /me` before publishing at all. |
| 4 | Rounds 2, 3 | Gave the old 1,000-follower threshold for `profile_lookup`, or didn't mention it at all; it has been 100 since November 2025. |
| 5 | Rounds 2, 3 | Called `manage_reply` on the nested reply itself first and only moved on to the parent reply after that failed; the docs state that nested replies can't be hidden on their own. |

The grader's conclusion: nearly all of these lost points came from not knowing the rules in the docs, not from being unable to write the code. The without-skill version of task 2 scored full marks in round 3, which shows that with only one run per task, a single lucky or unlucky run can swing the average considerably.

### With skill

The with-skill runs lost no checklist items in any round.

### Issues the grader flagged without deducting points

- **Round 1**: After publishing, the with-skill version also requested the `reply_audience` field when fetching the post URL; that field requires the `threads_read_replies` permission, and without it a successful post can look like a failure. The skill now fetches only `permalink` after publishing.
- **Round 2**: From the with-skill responses, the grader traced three imprecise statements back to the skill itself: recommending cursor pagination for `keyword_search` (the docs list no cursor parameters), describing the 90-day authorization for private accounts as contradictory in the docs (the docs consistently state it can't be extended), and presenting "call follower-related metrics separately" as a documented requirement (it's really just a conservative practice).
- **Round 3**: The grader pointed out a few overstated claims, also traced back to the skill's wording: saying the docs explicitly forbid link previews on ghost posts (the docs only say text spoilers are the sole supported attachment), saying the API "will always reject" the request (the docs don't say how the API responds), and treating the separate 1,000-call limits for `profile_lookup` and `profile_posts` as a shared quota (the docs don't say whether they're shared). The current SKILL.md now states plainly that the docs are unclear on all three points.

## Limitations

- Each task ran only once per setup, so variance can't be estimated and the numbers only indicate direction.
- Evals were run only on Claude; other tools that support Agent Skills weren't tested.
- All API calls in the tests hit a mock server set up by the grader; nothing was posted to a real Threads account.
- The raw eval reports (including the full responses and code from every run) aren't included in the repo; only the grading data is kept here.
