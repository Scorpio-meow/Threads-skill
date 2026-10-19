# Benchmark Summary

[繁體中文](BENCHMARK.md) | **English** | [日本語](BENCHMARK.ja.md) | [한국어](BENCHMARK.ko.md)

A summary of seven rounds of "with skill vs without skill" evals for the threads-api skill. The tasks and checklists are in [`evals.json`](evals.json); item-by-item verdicts for every run, along with the grader's evidence, are in [`benchmark.json`](benchmark.json).

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
| Round 4 | 2026-10-14 07:23 | 6 |
| Round 5 | 2026-10-18 12:47 | 7, 8, 9, 10 |
| Round 6 | 2026-10-18 16:34 | 2, 4, 7, 8 |
| Round 7 | 2026-10-19 12:22 | 1–10 |

The skill was revised between rounds based on the grader's feedback. Task 1 scored full marks on both sides and didn't separate them, so rounds 2 onward use tasks 2–5; task 3 gained one checklist item starting in round 2. Round 4 added task 6 after the skill gained section 11 (embedding posts), and ran only that task. Round 5 added tasks 7–10 (webhooks, OAuth login, code review, posting a thread on the user's behalf) and ran only those four. In this round the without-skill setup could search the web for the official docs, and it did look up the webhooks and OAuth pages, so the gap between the two setups is smaller than in earlier rounds. Round 6 reran tasks 2, 4, 7 and 8 with version 1.3 of the skill to check two changes that hadn't been evaluated yet: the webhook deduplication rule in section 10, and section 8's note that `debug_token` can use the app token instead. Neither setup could use the web this round, and the without-skill setup relied on the model alone, so tasks 7 and 8 shouldn't be compared directly with round 5. The without-skill run of task 2 and both runs of task 8 were stopped partway and rerun from scratch with the same instructions at 2026-10-19 11:26 (UTC). Round 7 reran all 10 tasks with version 1.4 of the skill to confirm that moving the Python reference client out of section 14 into `scripts/threads_client.py` caused no regression; the skill was installed as the whole `threads-api` folder (including `scripts/`), and neither setup could use the web. Task 4 has 7 checklist items from this round on; the new item 7 is that `debug_token` can use the app token. Pagination follows the standard used since round 6: code that only pages while the response has `paging.next` fails, and this round applies it to tasks 5 and 9 too (in rounds 2 and 3, task 5 passed such code with a caveat). The skill snapshot for this round was taken about a minute before section 14 gained a note on running the client from standard input when the skill's files aren't on disk, so that note isn't covered.

## Checklist items passed

Formatted as "with skill vs without skill":

| Task | Round 1 | Round 2 | Round 3 | Round 4 | Round 5 | Round 6 | Round 7 |
|---|---|---|---|---|---|---|---|
| 1. Python carousel post (two images + one video) | 8/8 vs 8/8 | — | — | — | — | — | 8/8 vs 8/8 |
| 2. TypeScript daily insights job with token refresh | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 | — | — | 9/9 vs 8/9 | 9/9 vs 7/9 |
| 3. Publishing a ghost post with a poll on the user's behalf | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 | — | — | — | 7/7 vs 6/7 |
| 4. Diagnosing unexpected search, location, and profile lookup results | — | 6/6 vs 5/6 | 6/6 vs 5/6 | — | — | 6/6 vs 5/6 | 7/7 vs 5/7 |
| 5. Auto-hiding replies that contain keywords | — | 7/7 vs 6/7 | 7/7 vs 6/7 | — | — | — | 7/7 vs 6/7 |
| 6. A 60-post Threads wall plus a weekly check for deleted posts | — | — | — | 8/8 vs 2/8 | — | — | 8/8 vs 3/8 |
| 7. FastAPI webhook for replies and mentions | — | — | — | — | 8/8 vs 8/8 | 8/8 vs 6/8 | 8/8 vs 6/8 |
| 8. Express OAuth login with long-lived token refresh | — | — | — | — | 8/8 vs 7/8 | 8/8 vs 7/8 | 8/8 vs 7/8 |
| 9. Reviewing a buggy Python posting script | — | — | — | — | 8/8 vs 6/8 | — | 8/8 vs 6/8 |
| 10. Posting a thread with emoji at 8 AM the next day on the user's behalf | — | — | — | — | 7/7 vs 6/7 | — | 7/7 vs 5/7 |
| **Average pass rate** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** | **100% vs 25%** | **100% vs 87%** | **100% vs 84%** | **100% vs 77%** |

The average pass rate is the mean of the per-task pass rates. Task 4 has 7 checklist items from round 7 on; earlier rounds used 6.

## Average time and token usage

| Round | With skill | Without skill |
|---|---|---|
| Round 1 | 930 s, 205K tokens | 840 s, 177K tokens |
| Round 2 | 599 s, 164K tokens | 776 s, 165K tokens |
| Round 3 | 706 s, 178K tokens | 963 s, 189K tokens |
| Round 4 | 964 s, 193K tokens | 1,367 s, 184K tokens |
| Round 5 | 226 s, 121K tokens | 282 s, 104K tokens |
| Round 6 | 1,117 s, 211K tokens | 1,000 s, 170K tokens |
| Round 7 | 554 s, 149K tokens | 654 s, 135K tokens |

In round 1, the with-skill runs were slower and used more tokens, because the skill itself adds about 11K tokens to read in; in rounds 2 and 3 they were actually faster, which the grader attributed to less trial and error. Time varied widely between tasks (in round 3, without-skill runs ranged from 298 to 1,613 seconds), so treat these averages as rough guides only. Round 4 ran a single task, and the with-skill run was again faster. Round 5 took far less time and fewer tokens than earlier rounds, so don't compare it directly with them; the with-skill runs used about 17K more tokens but finished 57 seconds faster on average. In round 6 the with-skill runs were 117 seconds slower and used about 40K more tokens on average; they were faster on tasks 4 and 7, and most of the slowdown came from task 2 (1,553 seconds with the skill, 811 without). In round 7 all 20 runs ran at the same time; the with-skill runs were 100 seconds faster and used about 14K more tokens on average, and were faster on 8 of the 10 tasks. The slowest run was the without-skill run of task 6 (1,186 seconds).

## Points lost

### Without skill

| Task | Rounds | Reason |
|---|---|---|
| 2 | Rounds 1, 2, 6, 7 | Paginated by following `paging.next` only, without reading `paging.cursors.after` (in round 6, it read the cursor only when `paging.next` was present); the docs state that post list responses have no `next`, so by the docs' own account this only fetches the first page. |
| 2 | Rounds 1, 2 | Token refresh didn't check the documented rules: it never confirmed that the imported token was at least 24 hours old and not yet expired. |
| 2 | Round 7 | Requested per-post insights from `/{media-id}/threads_insights`; the correct endpoint is `/{media-id}/insights` (`threads_insights` is the account-level endpoint). Its own mock server used the same path, so its tests didn't catch it; when the grader tested against the documented paths, every post's numbers came back empty. |
| 3 | Rounds 1–3 | Didn't state clearly that a ghost post can't include a poll, only that it "might not work," and even offered to send both features together to see what happens. The docs state that the only attachment a ghost post supports is a text spoiler. |
| 3 | Rounds 1–3, 7 | The response didn't list the actual parameters to be sent (`media_type`, `poll_attachment`, `is_ghost_post`); they appeared only in the script, so the user couldn't see them before confirming. |
| 3 | Rounds 1, 2 | Called `GET /me`, but only to validate the token, without first telling the user which account it would post to and waiting for confirmation; in round 2 the publish script never called `GET /me` before publishing at all. |
| 4 | Rounds 2, 3, 6, 7 | Gave the old 1,000-follower threshold for `profile_lookup`, or didn't mention it at all; it has been 100 since November 2025. |
| 4 | Round 7 | Suggested `debug_token` to check the scopes but never said that `access_token` can be the app token, so no Threads tester is needed, or that it must come from the same app as `input_token`; the attached script calls it with the user's own token, which fails unless that account is a tester. This is checklist item 7, added in round 7. |
| 5 | Rounds 2, 3 | Called `manage_reply` on the nested reply itself first and only moved on to the parent reply after that failed; the docs state that nested replies can't be hidden on their own. |
| 5 | Round 7 | Paginated only while the response had `paging.next`, so with responses in the documented shape it read only the first page; in the grader's test, keyword replies on the second page were never hidden. Rounds 2 and 3 would have passed this with a caveat; this round uses the standard in place since round 6. |
| 6 | Rounds 4, 7 | Believed embed.js only scans the page once when it loads, so it wrapped every post in its own iframe page; loading embed.js once and calling `window.instgrm.Embeds.process()` after inserting posts is enough. |
| 6 | Rounds 4, 7 | Blamed "the first few load, then the rest stall" on timing rather than on rate limiting from loading too many embeds at once. |
| 6 | Rounds 4, 7 | Counted the iframe's load event as success, so rate-limited or broken embeds never switched to the fallback card, and nothing paused after repeated failures. |
| 6 | Round 4 | Thought an accurate deleted-post check needs a Meta app and token, so it scraped threads.com pages instead; oEmbed has needed no token since March 2026 and returns `code 24` for posts that are gone. |
| 6 | Round 7 | Switched the weekly check to oEmbed but said it wasn't sure whether a token is needed, and even suggested preparing a 60-day user token. It also had the removal rule backwards: it removed posts on `code 100` (an invalid-parameter error) and only flagged `code 24`, the error that actually means the post is gone, so in the grader's test a deleted post was never removed. |
| 7 | Rounds 6, 7 | Treated `target_id` as the brand account's user ID in every case; for `replies` events `target_id` is actually the media ID, so when the grader sent reply events in the documented shape, round 6's code marked them all ignored and dropped them; round 7's code kept them but logged a warning for every reply event telling the user to check the token's account. |
| 7 | Rounds 6, 7 | When explaining why no events arrive, didn't mention that a verified business is required. |
| 8 | Rounds 5, 6, 7 | Never mentioned that permission grants last only 90 days or that private accounts must re-authorize every 90 days, and didn't suggest tracking `data_access_expires_at`; the response even implied that regular refreshes keep users logged in indefinitely. |
| 9 | Rounds 5, 7 | Changed `reply_control` to lowercase but didn't explain that the uppercase form is only what `reply_audience` returns when reading. |
| 9 | Round 5 | Error handling didn't surface `fbtrace_id`; on top of that, every request put the token in the URL's query parameters, and the `raise_for_status()` called for non-JSON responses produces an exception message containing the full URL, which could leak the token into exceptions and logs. |
| 9 | Round 7 | The fixed version still paginated only while the response had `paging.next`, so with responses in the documented shape it read only the first page, leaving the problem it had itself pointed out unfixed; its mock server returned `paging.next`, so its tests didn't catch it. |
| 10 | Rounds 5, 7 | The response only summarized the two parts, with the full text in a separate file, and didn't list the parameters to be sent; instead of asking for explicit confirmation, it went straight to telling the user how to start the posting run. |
| 10 | Round 7 | Never checked whether `THREADS_ACCESS_TOKEN` was set in the current environment, the response never said the token wasn't available here, and it ended by offering to run a preflight check that needs the token. |

The grader's conclusion: nearly all of these lost points came from not knowing the rules in the docs, not from being unable to write the code. The without-skill version of task 2 scored full marks in round 3, which shows that with only one run per task, a single lucky or unlucky run can swing the average considerably. Round 5's lost points aren't all about knowledge of the docs: in task 10 the response didn't show the full content in the reply and wait for the user's confirmation before posting, and part of task 9's loss was error handling that could leak the token. All five of round 6's without-skill lost points are about the docs again: pagination, the follower threshold, what `target_id` means, business verification and the 90-day grant; pagination, the follower threshold and the 90-day grant had already cost points in earlier rounds. Of round 7's 18 without-skill lost points, 15 were about the docs; apart from the per-post insights endpoint and the app-token option for `debug_token`, all of them (pagination, the follower threshold, task 6's embed and oEmbed behavior, `target_id`, business verification, the 90-day grant and the uppercase `reply_audience` format) had already cost points in earlier rounds. The other 3 were about how to act for the user: not listing the content to be sent in the response and asking for confirmation (tasks 3 and 10), and not checking for the token or telling the user it wasn't available here (task 10).

### With skill

The with-skill runs lost no checklist items in any round.

### Issues the grader flagged without deducting points

- **Round 1**: After publishing, the with-skill version also requested the `reply_audience` field when fetching the post URL; that field requires the `threads_read_replies` permission, and without it a successful post can look like a failure. The skill now fetches only `permalink` after publishing.
- **Round 2**: From the with-skill responses, the grader traced three imprecise statements back to the skill itself: recommending cursor pagination for `keyword_search` (the docs list no cursor parameters), describing the 90-day authorization for private accounts as contradictory in the docs (the docs consistently state it can't be extended), and presenting "call follower-related metrics separately" as a documented requirement (it's really just a conservative practice).
- **Round 3**: The grader pointed out a few overstated claims, also traced back to the skill's wording: saying the docs explicitly forbid link previews on ghost posts (the docs only say text spoilers are the sole supported attachment), saying the API "will always reject" the request (the docs don't say how the API responds), and treating the separate 1,000-call limits for `profile_lookup` and `profile_posts` as a shared quota (the docs don't say whether they're shared). The current SKILL.md now states plainly that the docs are unclear on all three points.
- **Round 4**: The grader suggested two more angles to check: injecting stored embed HTML with innerHTML is an XSS risk, and old threads.net links produce iframes on the threads.net domain. The skill now builds the embed markup from a validated URL with DOM methods, and says to rewrite threads.net links to threads.com or allow both domains in the CSP. The grader also noted that checklist item 8 (don't put the post page itself in an iframe) is passed by almost any answer that uses embed.js, so it barely separates the two setups.
- **Round 5**: Checklist items 1–5 and 7 of task 10 (how emoji are counted, splitting the text verbatim, chaining with `reply_to_id`, the API having no scheduling, checking the token, confirming the account) were passed by both setups, so they barely separate them; the item that made the difference was item 6: showing the full content in the reply and asking the user to confirm. In task 7, both setups write the raw event synchronously in the request and only defer the Graph API lookup to the background. The without-skill version of task 9 put the token in the URL, so `raise_for_status()` could expose it in exception messages; this was already counted as a lost point (see the table above).
- **Round 6**: The `debug_token` change took effect in tasks 2 and 8: the with-skill runs now call it with the app token, so the 90-day permission grant check is no longer limited to Threads tester accounts, and the limitation seen in task 2 in rounds 1–3 is gone. The with-skill reply to task 4, however, still calls it with the user's own token, says the token owner must be a Threads tester, and never mentions the app token; no checklist item covers this. Both setups passed most checklist items in all four tasks; the only items that separated them were item 8 of task 2, item 4 of task 4, items 4 and 6 of task 7, and item 7 of task 8. The grader suggested adding checks for tracking the 90-day grant (task 2), the app-token option for `debug_token` (task 4), reply events in the documented shape actually reaching the database (task 7), and parsing the flat error format of a failed code exchange (task 8). The without-skill version of task 8 only parses the `{"error": {...}}` format, so both of the user's errors would show up in the logs as a generic error; the with-skill version of task 7 suggests trying the app's main secret if signature checks keep failing, which could lead the user to the Facebook secret.
- **Round 7**: The with-skill runs passed all 77 checklist items, and no task scored lower than in earlier rounds. With the reference client now in `scripts/threads_client.py`, all 10 with-skill runs opened that file after reading SKILL.md and before writing any code. In build mode, tasks 1 and 9 ported `call()`, `check()`, `wait_ready()` and `publish()` (task 1 also checks `threads_publishing_limit` first); the other tasks ported `call()`'s error handling and reasonably skipped the publishing flow. When acting for the user, task 3 followed section 3: it ran the client by its full path from the working folder, ran `check` on the original request and on both alternatives, and used the full path in the commands it handed over. Task 10 instead copied the client into the working folder and imported it from its own `post_thread.py`, which posts the thread in order and waits until 8 AM (the client has no command for threads), and handed over the unmodified copy along with that script. No run retyped the client's code or saved it to a temporary file. The grader also flagged a few issues no checklist item covers: the with-skill reply to task 7 again suggests trying the app's other secret if signature checks keep failing (as in round 6); the with-skill script for task 10 prints the account but doesn't stop for the user's confirmation before waiting for 8 AM, and doesn't check the publishing quota; and the commands the with-skill run of task 3 hands over cover only option A, with the token setup only implied. The grader suggested adding checks for local validation before posting (emoji counting and the 5-link limit) to task 1, which both setups have now passed in full in two rounds; the 90-day grant to task 2; looking up the post when a payload has no `root_post` to task 7; parsing the flat error format of a failed code exchange to task 8; writing the rule against relying on `paging.next` into task 9's checklist; and tightening a few items in tasks 3 and 10 that both setups pass.

## Limitations

- Each task ran only once per setup, so variance can't be estimated and the numbers only indicate direction.
- Evals were run only on Claude; other tools that support Agent Skills weren't tested.
- In rounds 1–4, all API calls hit a mock server set up by the grader; round 5 had no mock server: the answering runs checked their own code with local mocks or FastAPI's TestClient, and the grader judged by reading the code. Rounds 6 and 7 had no mock server either: the grader reran the answering runs' own tests, then tested the code's behavior with mocks of its own. No round posted anything to a real Threads account.
- embed.js behavior and oEmbed error codes that the docs don't cover were confirmed on 2026-10-14 by reading the live embed.js and calling oEmbed, then given to the grader as reference; Meta may change them.
- The raw eval reports (including the full responses and code from every run) aren't included in the repo; only the grading data is kept here.
