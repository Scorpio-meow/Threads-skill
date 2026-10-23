# Changelog

[繁體中文](CHANGELOG.md) | **English** | [日本語](CHANGELOG_ja.md) | [한국어](CHANGELOG_ko.md)

Notable changes to this project are recorded here, following the format of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Version numbers follow `metadata.version` in `threads-api/SKILL.md`, and the Agensi listing uses the same numbers; changes before 1.0 are grouped by date.

## [1.5] - 2026-10-24

### Added

- Questions 11 and 12 in `evals/evals.json`, with 8 checks each. Question 11 is a Chrome extension (Manifest V3) preview that iframes `/embed/` directly on its own page, covering height reports, dark mode, URL deduplication and deleted posts; question 12 is embed cards in a React 18 component, covering a leftover fallback link, blank space caused by `min-height`, retries and removeChild errors, theme switching, and how to tell whether an embed loaded.
- Round 8 evals: questions 6, 11 and 12 run with the skill after section 11 was rewritten; neither setup could use the web. With the skill all 24 checks passed; without it, 10 passed (42% averaged per question). Question 6 scored 8/8 vs 3/8, the same as in round 7, so it didn't regress.
  - Check 3 of question 11 was rewritten after the first grading. It originally required the iframe itself to start with a height, and the with-skill run lost that point (7/8) because its iframe starts at 0 px with the placeholder height on the outer container. A retest the same day found that an iframe starting at 0 px reports its height normally too, and that this run switches to a failure card with a link and a retry button when the report is 0 or times out. So check 3 now checks the outcome: when the report is 0 or never comes, the code must not leave just an invisible blank space. A new grader regraded both runs from scratch: 8/8 with the skill, still 4/8 without it.
  - The without-skill runs made several confident but wrong claims: the height comes as a `MEASURE` message in a JSON string, Threads has no theme parameter, `instgrm.Embeds.process()` exists only for Instagram, re-inserting embed.js makes it scan again, oEmbed needs an app token, and any unrecognized 4xx means the post has been deleted.
  - This round's skill still said the embed page reports its height “only once”, and all three with-skill replies repeated it; in questions 6 and 11 they even told the user to hard-code the card width because of it (the code itself still applies later reports). A retest after the runs found that posts with images report 2–4 times; 1.5 corrects this (see Changed).
  - While testing, the without-skill run of question 6 mistakenly used the browser pane to load the real embed.js and two embed pages, breaking the no-web rule; its score is still 3/8.
- A ninth check for each of questions 6, 11 and 12 in `evals/evals.json`, following the round 8 graders' suggestions; the total goes from 98 to 101:
  - Question 6: handles old threads.net links, by rewriting them to threads.com or by allowing both domains in the CSP's `frame-src`.
  - Question 11: keeps applying later height reports above 0, and doesn't tell the user that the embed page reports only once.
  - Question 12: points out that a deleted or non-embeddable post also shows a “Cannot display thread” card and reports a height, so the front end counts it as loaded, and that these posts have to be cleared out with oEmbed (`code 24`).
- Round 9 evals: questions 6, 11 and 12 rerun with the 1.5 SKILL.md; neither setup could use the web, and this round browser tools weren't allowed to open pages either. With the skill all 27 checks passed; without it, 11 passed (41% averaged per question).
  - The “only once” fix took effect: the with-skill run of question 11 applies every report above 0; the grader fed 534, 574 and "600" to its handler in turn, all three were applied, and the new ninth check passed. None of the three with-skill replies says the height is reported only once anymore. The without-skill run again treated the height as a `MEASURE` message in a JSON string, and applied none of 498, 534 and 574.
  - The new checks: both setups passed question 6's (threads.net links), so it didn't separate them this round; check 9 of questions 11 and 12 passed only with the skill.
  - The without-skill runs repeated round 8's wrong claims: no theme parameter (questions 11 and 12), no API to scan again (questions 6 and 12), and the height as a `MEASURE` message in a JSON string (question 11). To find deleted posts, they instead compared against the user's own posts listed through the API (question 6, which needs an app, a token and a GitHub token that can write secrets) or fetched threads.com pages (question 11); neither used token-free oEmbed.
  - This round's skill snapshot predates three changes: the causes listed on the fallback card in section 11.3, the oEmbed CORS note in section 11.1, and the version number. The fallback card's causes were verified with question 12 in round 10 (see below); the CORS note hasn't been evaluated yet.
  - Both rounds are recorded in all four benchmark summaries and `evals/benchmark.json`.
- Question 13 in `evals/evals.json`, with 8 checks; the total goes from 101 to 109. A blog sidebar embeds 12 posts, 3 of which are shown only to logged-in users, so readers who aren't logged in see only Meta's error page; neither the author's weekly oEmbed check nor the success test “the iframe appears, its URL is on threads.com, and it's taller than 120px” caught them. The checks cover: recognizing posts shown only to logged-in users, oEmbed still returning 200, why the old test passed, switching to numeric height reports, a placeholder height, a fallback card that explains the login and third-party cookies while the page keeps trying to load the post, a way to find these posts ahead of time, and neither promising that logged-out readers can see them nor removing the posts.
- Round 10 evals: verifying what was added on 2026-10-24 (posts shown only to logged-in users, counting only numeric reports, and the fallback card's causes), running the new question 13 and rerunning question 12 to confirm it didn't regress, under the same conditions as round 9. With the skill all 17 checks passed; without it, 9 passed (54% averaged per question).
  - Question 13 scored 8/8 with the skill: the fallback card for posts shown only to logged-in users states both that a Threads login is needed and that third-party cookies must be allowed, only numeric reports count as success, and a same-origin request without cookies from a threads.com page finds these posts ahead of time.
  - Question 13 scored 6/8 without the skill: it worked out on its own that a login and third-party cookies were the cause, so the gap on this question is smaller than on the other embed questions. It lost points because its listener accepts only objects in the `MEASURE` format, so the 498 the grader fed it wasn't applied and all 12 posts would end up on the fallback card; and instead of embedding the posts shown only to logged-in users, it showed the card right away, and the card mentioned only the login. It also said oEmbed needs a token.
  - Question 12 scored 9/9 with the skill: the fallback card no longer lists “deleted post” as a cause, and lists rate limiting, blockers, network problems and posts shown only to logged-in users instead; 3/9 without it, with the same wrong claims as in rounds 8 and 9.
  - The results are recorded in all four benchmark summaries and `evals/benchmark.json`.

### Changed

- Section 11 of SKILL.md rewritten from the experience of two real projects and tests run on 2026-10-23. The projects are [Threadfolio](https://github.com/Scorpio-meow/Threadfolio) (formerly Threads-Featured-Posts), a wall of featured posts, and [Threadkeep](https://github.com/Scorpio-meow/Threadkeep) (formerly Threads-embedded-code), a Chrome extension that stores embed codes; the tests loaded real embeds on a local test page, read that day's live embed.js source and called oEmbed.
  - Section 11.1: posts are matched and deduplicated by shortcode; notes that the permalink oEmbed returns is `/t/<shortcode>?utm_source=th_embed…`; embed code copied from the share menu's “Get embed code” is the same markup as oEmbed's output and falls under the same usage limits *(practice)*; oEmbed responses, errors included, carry `Access-Control-Allow-Origin: *`, so a web page or extension page can call it directly and read the error body.
  - Section 11.2:
    - The blockquote needs a unique `id` (`ig-tp-<shortcode>`). embed.js uses it to remove the fallback link, and without an id the link stays under the post; it previously said the class and permalink were enough.
    - embed.js changes the blockquote's class to `text-post-media-registered` and processes each blockquote only once; it also scans again 5 seconds after the DOM is ready.
    - The height is reported as a bare number, and again whenever the content gets taller (2–4 times for posts with images); resizing the iframe from outside doesn't bring another report.
    - On a report of 0, embed.js leaves a 0 px iframe and, when there's an id, removes the fallback link too, so the post silently disappears. The cause is still unclear; neither a starting height of 0 nor the same post placed twice reproduces it.
    - A deleted post, or one that doesn't exist, shows a “Cannot display thread” card and reports about 190 px, so a replaced blockquote doesn't mean the post exists. Rechecked on 2026-10-24 with 8 posts removed from Threadfolio: oEmbed returned `code 24` for all of them, and `/embed` returned 200 with this card.
    - Posts shown only to logged-in users (for example, ones marked sensitive): visitors who aren't logged in to Threads, or whose browser blocks third-party cookies, get an HTTP 500 error page (Meta's “Sorry, something went wrong”, still on threads.com) and no height report; logged-in visitors who allow third-party cookies can see them. oEmbed still returns embed HTML for these posts, so §11.1 now notes this, §11.3 adds a way to tell them apart with `/embed`, the fallback card's causes include them, and §12 gets one more row. Threadkeep found this on 2026-10-23, and it was confirmed on 2026-10-24 with 3 posts Threadfolio had flagged; round 10 evaluated it with the new question 13 (see Added). §11.3 also says the fallback card must state both that a Threads login is needed and that third-party cookies must be allowed (a logged-in Safari visitor still can't see the post).
    - embed.js resizes any iframe on the page that sends a report, including ones you create yourself; the theme is fixed when the iframe is created.
    - When iframing `/embed/` directly, add `?theme=` yourself; a listener that only accepts object-shaped messages will think no report arrives.
    - A CSS `min-height` on the iframe overrides the height embed.js sets; the fallback card in the official embed code has a hard-coded white background.
  - Section 11.3:
    - Success now means a first report above 0 within about 12 seconds, no longer whether the blockquote was removed; the iframe's `load` event can't be used as a signal. Only numeric reports count, because extensions that inject scripts into Threads frames can post their own messages from the same origin; added on 2026-10-24 after Threadfolio's fix, and the with-skill runs of questions 12 and 13 in round 10 both count only numeric reports.
    - To retry, remove the iframe and put the class back on the blockquote; it previously said to remove the class on failure.
    - Overriding `console.error`, listening for `window` error events and a service worker can't see the embeds' loads either; background tabs don't run `requestAnimationFrame`.
    - The backoff numbers it quoted from the post wall didn't match that project's code, so they're now a general suggestion.
    - The causes listed on the fallback card drop “deleted post” and now list rate limiting, a content or tracking blocker, and a CSP or network problem, because a deleted post shows “Cannot display thread” and counts as loaded. This was found while grading question 12 in round 9, and hasn't been evaluated since the change.
  - Section 12 (Troubleshooting): the “Embed stays a plain "View on Threads" link” row no longer lists “post not embeddable”, and three rows are added: “Embed shows "Cannot display thread"”, “Post renders but a "View on Threads" link stays under it” and “Embed leaves an empty gap or disappears”.
- SKILL.md updated from the official docs as re-synced on 2026-10-23. The changelog's newest entry is still 2026-08-18, and no endpoints, parameters, fields or limits were added or removed:
  - The note on the docs at the top now reads “synced 2026-10-23; the changelog's newest entry is 2026-08-18”.
  - Section 8.2: before approval, publishing works only on behalf of the app's Threads Testers. The new docs no longer mention “your own account”, so it reminds you to add your own account as a tester too.
  - Section 8.4: the app token response is now given as `{"access_token": "TH|<APP_ID>|<APP_SECRET>", "token_type": "bearer"}`, with a note that it contains the app secret and must stay out of logs, client code and app binaries.
  - Sections 8.1, 4.1 and 4.2: reposts and cross-sharing to Instagram Stories also need `threads_content_publish`; a Story cross-shared this way follows the user's Instagram privacy and audience settings.
  - Section 4.2: the docs describe `text_entities` offsets as “positive whole numbers” while the examples start at 0, so it says to count from 0.
  - Section 8.3: the docs' examples all use `graph.threads.com` now.
  - Section 13: the quotes in the Ghost Posts example are fixed, so it's off the list; added three mistakes in the Share to Instagram Stories example (`media_type=text` in lowercase, a `|` between parameters, and a missing line-continuation `\`). The other items are still unfixed in the new docs.
- `metadata.version` in `threads-api/SKILL.md` raised to 1.5.
- The “Embedding”, “What difference does the skill make”, “Test results” and “Known limitations” sections of all four READMEs, the site (eval numbers, doc-sync date, the pre-App-Review permission wording and the FAQ; the benchmark table's question column now has a minimum width so it isn't squeezed to one or two characters per line with the extra columns) and `docs/llms.txt` are updated to match.
- The Security Policy `SECURITY*.md` now follows a common format: it adds an email reporting channel, commits to a first reply within 14 days and public disclosure no later than 90 days after the report, and requests a CVE when applicable. The translations are renamed to `SECURITY_en.md`, `SECURITY_ja.md` and `SECURITY_ko.md`, and links inside the files use full URLs.
- Translations of the README, changelog, benchmark summary and the community files in `.github/` also use `_xx` names, for example `README_en.md`, `CHANGELOG_ja.md`, `evals/BENCHMARK_ko.md` and `.github/i18n/CODE_OF_CONDUCT_en.md`; the project site and all links are updated.

## [1.4] - 2026-10-19

### Added

- Round 6 evals: questions 2, 4, 7 and 8 rerun with version 1.3 of the skill to check two changes from 1.2 and 1.3 that hadn't been evaluated; neither setup could use the web this round. With the skill all 31 checks passed; without it, 26 passed (84% averaged per question), and no with-skill score is lower than in earlier rounds. Recorded in all four benchmark summaries and `evals/benchmark.json`; the "Test results" section of all four READMEs, the site's eval numbers and `docs/llms.txt` are updated to match.
  - The webhook deduplication rule in section 10 (1.2): the with-skill run of question 7 now uses `(field, media_id)` as the unique key.
  - `debug_token` accepting the app token, in section 8 (1.3): the with-skill runs of questions 2 and 8 now call it with the app token, so the 90-day permission grant check is no longer limited to Threads tester accounts; the with-skill reply to question 4 still says the token owner must be a Threads tester, which no checklist item covers.
- A seventh check for question 4 in `evals/evals.json`: suggests `debug_token` to inspect the token's `scopes` and says its `access_token` can be the app token (no Threads tester needed) and must come from the same app as `input_token`. Earlier rounds scored question 4 on the original six checks.
- Round 7 evals: all 10 questions rerun with version 1.4 of the skill to confirm that moving the reference client to `scripts/threads_client.py` caused no regression; the skill was installed as the whole `threads-api` folder, and neither setup could use the web. With the skill all 77 checks passed; without it, 59 passed (77% averaged per question), and no with-skill score is lower than in earlier rounds. Recorded in all four benchmark summaries and `evals/benchmark.json`; the "Test results" section of all four READMEs, the site's eval numbers and `docs/llms.txt` are updated to match.
  - Reference client: all 10 with-skill runs read `scripts/threads_client.py` before writing any code, and in Build mode questions 1 and 9 ported its logic as section 2 says. In Operate mode, question 3 ran the client by its full path from the working folder and used the full path in the commands it handed over, as section 3 says; question 10 instead copied the client into the working folder, imported it from its own thread script and handed over the unmodified copy. No run saved the client's code to a scratch file.
  - The app-token line in section 8.2: the with-skill run of question 4 now calls `debug_token` with the app token and passes the new seventh check; the without-skill run doesn't mention it.
  - This round's skill snapshot predates the section 14 note on running the client from standard input, so that note hasn't been evaluated yet. Pagination is judged by the standard used since round 6, now applied to questions 5 and 9 as well.
- Checks for eight questions in `evals/evals.json` revised along the round 7 graders' suggestions, tightening or adding checks where both setups passed and the checks couldn't tell them apart; the total goes from 77 to 82. Earlier rounds were scored on the previous checks; the evals haven't been rerun since, so round 7's scores can't be compared directly with the revised checks.
  - Question 1 gains a ninth check: before calling the API, the code validates the text length (emojis counted by their UTF-8 bytes), at most 5 links and 2–20 carousel items locally. There's no publishing-quota check, because SKILL.md only asks for `threads_publishing_limit` before batch or scheduled posting, and this question posts once.
  - Question 2 gains a tenth check: reads `data_access_expires_at` with `debug_token`, alerts before the 90-day permission grant runs out, and says private profiles must re-authorize every 90 days.
  - Question 3: check 4 now explicitly accepts handing over commands for the user's own shell when the user says the token is already set; check 6 requires the account check on every publish path handed over; check 7 now requires pointing out that a 24-hour post published now (e.g. on a Monday) is gone before the weekend, or that `example.com` is a placeholder.
  - Question 7: check 1 notes that a framework's 422 for missing `hub.*` parameters counts as "otherwise 403"; a ninth check: when the payload has no `root_post`/`replied_to`, the code finds which post the event belongs to with `GET /{media-id}`.
  - Question 8 gains a ninth check: when the code exchange fails, the code parses the flat error shape the docs show, `{error_type, code, error_message}`, and logs the message.
  - Check 8 of question 2, check 5 of question 5 and check 6 of question 9 now say the next page must be requested with `paging.cursors.after`, and a loop that pages only through `paging.next` fails (rounds 6 and 7 already graded this way, but the rule was only in the grading notes).
  - Question 10: check 7 now requires showing which account the thread goes to and stopping for the user's OK before waiting or scheduling; an eighth check: before posting, the code checks the publishing quota with `GET /me/threads_publishing_limit` and posts nothing once it's used up. The API has no scheduling, and SKILL.md asks the code to check the quota itself before scheduled posting.

### Changed

- The Python reference client in section 14 of SKILL.md (256 lines) moved unchanged to `threads-api/scripts/threads_client.py`, which cuts SKILL.md by 245 lines (version 1.3 had 579), back under the 500 lines the [Agent Skills specification](https://agentskills.io/specification) recommends. Section 14 keeps the purpose, commands and spec examples, now points to the file and also describes the output. The contents line, the `compatibility` frontmatter field, step 3 of section 2 (Build mode reads the file before porting its logic), step 5 of section 3 (Operate mode runs it by its full path from the working folder instead of saving it to a scratch file) and step 7 (when the API can't be reached, hand over the client's path or the file along with the command) are rewritten to match. The model now has to read the file separately, which changes how it loads the skill's content; round 7 reran the evals after this restructuring (see Added).
- Section 8.2 of SKILL.md (Before App Review) gains a line: to see which permissions a user granted, call `debug_token` with the app token (`TH|<APP_ID>|<APP_SECRET>`) as `access_token`; it works for any user of the same app, tester or not, and `scopes` shows what the user granted, not App Review approval. In section 12, the "Permission errors or unexpectedly empty results" row now gives the same check, and the "Keyword search finds only own posts" row points to section 8.2. This is what the with-skill reply to question 4 missed in round 6; in round 7 it uses the app token and passes the new seventh check.
- `metadata.version` in `threads-api/SKILL.md` raised to 1.4.
- The “Documentation” and “Reference client” sections of all four READMEs, the contributing guide, the security policy, the PR templates, `docs/llms.txt`, and the site's reference-client label and `check()` source links now point to `threads-api/scripts/threads_client.py`.
- Installation docs: the Kiro entry in all four READMEs now says to check that `scripts/threads_client.py` came along after importing (Kiro's docs don't say), and the Agensi section says the skill isn't stored on the user's computer and its license doesn't allow saving it, so the AI assistant has to fetch the client that Operate mode runs from Agensi separately. Going by their source code or official docs, the other methods (`bunx skills`, `gh skill`, Codex, Copilot CLI, Gemini CLI, copying by hand, and the ZIP for the Claude apps and ChatGPT) all use the whole `threads-api` folder.
- Section 14 of SKILL.md now covers skills whose files aren't on disk (some hosts serve them on request and don't allow saving them): get `scripts/threads_client.py` from wherever the skill was loaded and feed it to Python on standard input with `python3 - <args>` instead of saving it; step 5 of section 3 points there. The Agensi section of all four READMEs now says the same. Not re-evaluated since the change.
- Installation docs (all four READMEs): the Codex `$skill-installer` entry now notes that it installs into `~/.codex/skills/` (`$CODEX_HOME/skills/` if `CODEX_HOME` is set), not the `~/.agents/skills/` in the table; Codex reads both, but its source code marks the former as deprecated and kept for backward compatibility, so the entry says not to keep a copy in both. The Copilot CLI entry says adding a folder registers its location rather than copying it. The “Updating and removing” table gains rows for Codex (the installer stops if the folder already exists, so delete the old one first), Copilot CLI, Kiro (its docs don't say; delete and import again) and Agensi. Sources: the openai/codex source (`host_roots.rs` and the skill-installer's `install-skill-from-github.py` on `main` as of 2026-10-19) and the official docs for Codex, GitHub Copilot CLI and Kiro.

## [1.3] - 2026-10-19

### Changed

- Section 8 of SKILL.md now follows Meta's 2026-08-18 changelog entry on `debug_token`: besides a Threads tester's token, `access_token` can be the app token (`TH|<APP_ID>|<APP_SECRET>`); either way it must come from the same app as `input_token`, and the error for a token from another app is now listed. The `code 190` row in section 12 now points to section 8, and the doc snapshot date is now 2026-08-18 (SKILL.md, all four READMEs, `docs/llms.txt` and the site). In `evals/benchmark.json`, the with-skill runs of question 2 in rounds 1–3 all mention skipping the `debug_token` check of the 90-day permission grant when the account isn't a Threads tester; the evals haven't been rerun since this was updated.
- `metadata.version` in `threads-api/SKILL.md` raised to 1.3.
- Installation docs:
  - The tool table in all four READMEs now gives each tool's `-a` value for `bunx skills` and adds Google Antigravity, Cline, Kiro, JetBrains Junie and Roo Code; Windsurf is now Devin Desktop, with its new paths.
  - New README sections: “Other ways to install” (GitHub CLI's `gh skill`, Codex, Copilot CLI, Gemini CLI, Kiro), “ChatGPT” and “Updating and removing”.
  - The Claude apps steps now name the Pro and Max plans, show how to make the ZIP on each system and also give the Settings > Capabilities upload location.
  - The site's tool list, the “How do I install it by hand?” and “How do I use it in the Claude apps?” answers, `docs/llms.txt` and the usage issue forms are updated to match.

## [1.2] - 2026-10-18

### Added

- Questions 7–10 (a FastAPI webhook for replies and mentions, Express OAuth login with long-lived token refresh, reviewing a buggy Python posting script, posting a thread with emoji at 8 AM the next day on the user's behalf) and the round 5 results, recorded in all four benchmark summaries and `evals/benchmark.json`.

### Changed

- Section 10 of SKILL.md gains a *(practice)* line: the same webhook event can arrive more than once, so processing should be idempotent, keyed on `values.field` plus the media ID, not on a hash of the raw body. The evals haven't been rerun since it was added.
- `metadata.version` in `threads-api/SKILL.md` raised to 1.2.

### Fixed

- The Contributing and other tabs on the GitHub repository page resolve relative links in the community files from the repository root, so they returned 404; the links now use paths that start with `/`, counted from the repository root.
- The Code of conduct tab on the GitHub repository page showed the English version: the English, Japanese and Korean versions moved to `.github/i18n/`, so the tab shows the Traditional Chinese version.

## [1.1] - 2026-10-18

### Added

- `license`, `compatibility` (operate mode needs Python 3.8+, access to graph.threads.net, and a token from the environment or `.env`) and `metadata.version` in the `threads-api/SKILL.md` frontmatter.
- An “Agensi” install option in all four READMEs, and a link to the Agensi page in `docs/llms.txt`.
- The changelog `CHANGELOG*.md`, in Traditional Chinese, English, Japanese and Korean.
- `docs/llms.txt`: a project index for AI assistants and crawlers, pointing to SKILL.md, the READMEs and the evaluation data.
- A link to the project site in all four READMEs.
- GitHub community files in `.github/`, each in Traditional Chinese, English, Japanese and Korean:
  - Contributing guide `CONTRIBUTING*.md`: repository layout, rules for changing the skill and the site, rerunning the evals, translations and the PR workflow.
  - Code of Conduct `CODE_OF_CONDUCT*.md`: adopts the Contributor Covenant 3.0 and adds the scope and how to report by email or through GitHub.
  - Security Policy `SECURITY*.md`: what's in scope and how to report through GitHub's private vulnerability reporting.
  - Accessibility Statement `ACCESSIBILITY*.md`: what the project site supports, its known limitations and how to report a barrier.
  - Issue forms: “Wrong, outdated or missing rule”, “Problem using the skill” and “Project site issue”, one set per language; questions and security reports are routed to Discussions and private vulnerability reporting.
  - PR template: Traditional Chinese by default, with English, Japanese and Korean versions in `PULL_REQUEST_TEMPLATE/`.
- A “Theme” button on the project site that switches between matching the system, light and dark; the choice is remembered and applied before the page is drawn.

### Changed

- The opening of `threads-api/SKILL.md` lists three jobs instead of two, adding “Embed” (embedding posts and Web Intents); the bullets no longer carry section numbers, so they also read well on store pages such as Agensi.
- All four contributing guides now say to raise `metadata.version` in SKILL.md whenever the skill's content changes, and to use the same number on Agensi.
- The “Contributing” section of all four READMEs is now a summary, with the details moved to `.github/CONTRIBUTING*.md`.
- The project site now uses system fonts instead of loading Switzer and Noto Sans from Fontshare and Google Fonts, so visitors' IP addresses are no longer shared with third parties. Font weight 500 became 600, because system fonts such as Segoe UI and Microsoft JhengHei have no 500 weight and would render it as regular.
- The language and theme menus share `TAS.menu()` (`docs/assets/js/core.js`).

### Fixed

- The license in all four READMEs and in the site FAQ changed from “not yet specified” to MIT.
- The Japanese benchmark summary said task 3 lost points in “all rounds”; it now says “all three rounds”, matching the other languages.
- Fixed places where the English, Japanese and Korean site text and READMEs didn't match the Traditional Chinese: topic tags were translated as hashtags, “observed” was rendered as “confirmed”, and the English dropped words such as “maximum”, “average”, “lets you decide”, “by the docs' account”, “advised” and “automatically”.
- Accessibility issues on the project site:
  - In “One skill, three jobs”, descriptions that aren't in focus now use the secondary text colour (at least 4.5:1 contrast) instead of fading out; the examples beside them are no longer hidden from screen readers, and focusing one with the keyboard switches to it.
  - Every check in the grading panel at the top of the page now carries “Passed” or “Failed” text; errors and warnings in “Check before you send” have text labels and different shapes, and the status line reports how many of each there are.
  - The boundaries of switches, text fields, dropdowns and toggle buttons now have at least 3:1 contrast (new colour token `--control-line`), and link underlines in body text are darker; fixed a selector bug that left some fields with browser default styles; raised the contrast of the “Expired” label in dark mode.
  - Added support for forced colours (Windows High Contrast); with reduced motion on, small animations such as expanding, sliding and pressing are turned off too.
  - Content no longer stays hidden when a script fails to load; when printing, sections not yet scrolled to no longer come out blank, and all 8 tabs in “What's inside” are expanded.
  - Code blocks and tables that need scrolling can be focused with the keyboard; once the install command generator has been used, changing an option announces the new command; the “Copied” message is removed after it fades; switching languages no longer re-announces the checker results.
  - Headings and the language button are no longer read as run-together words; in short windows the tab bar no longer sticks to the top; in Japanese at 320px wide, a heading no longer runs past the screen.
  - With JavaScript disabled, controls that can't work are hidden and replaced with explanations, and the “without the skill” reply is shown.
  - Timeline labels that don't fit their bar are now hidden instead of being cut off.
  - On narrow screens, header links that don't fit move to a second row instead of overlapping the site name.

## [1.0] - 2026-10-18

### Added

- The skill is listed for free on [Agensi](https://agensi.io/skills/threads-api) as version 1.0, with the same `threads-api/SKILL.md` as on 2026-10-14.

## 2026-10-16

### Added

- The project and showcase site `docs/`, published to GitHub Pages from `/docs` on main:
  - The top of the page excerpts real replies to question 3 in round 3, switchable between with and without the skill, and lists the grader's 7 checks.
  - “Check before you send”: a JS port of `check()` from section 14, compared with the Python version on 8 specs, with matching errors, warnings, character counts and link counts.
  - Three ways to use the skill, six common pitfalls, the figures and a per-question table for all four rounds, key numbers from each section, an install command generator and an FAQ; light and dark themes and a mobile layout.
- Site language switching: Traditional Chinese, English, Japanese and Korean.
- Site logo, favicon and social preview image.
- MIT License (`LICENSE`).

### Changed

- The site's styles and scripts moved out of `docs/index.html` into `docs/assets/css/` and `docs/assets/js/`, and the images into `docs/assets/img/`.

## 2026-10-14

### Added

- The `threads-api` skill (`threads-api/SKILL.md`), distilled from Meta's official docs and covering the changelog through 2026-08-12.
- The eval set `evals/evals.json`, the benchmark summary `evals/BENCHMARK.md` and the grading data `evals/benchmark.json`.
- Question 6 (a wall of 60 posts with a weekly check for deleted posts) and the round 4 results.
- English, Japanese and Korean versions of the README and the benchmark summary.

### Changed

- Section 11 of SKILL.md expanded from “oEmbed and Web Intents” to embedding posts: token-free oEmbed and its error codes, how embed.js loads posts, and throttling and failure handling for pages with many embeds.
- Shortened the SKILL.md description to 196 characters.
- Rewrote the README: installation for each tool, the one-line `skills add` command, configuration and permission tables, and contribution notes.

[1.5]: https://github.com/Scorpio-meow/Threads-skill/compare/v1.4...v1.5
[1.4]: https://github.com/Scorpio-meow/Threads-skill/compare/v1.3...v1.4
[1.3]: https://github.com/Scorpio-meow/Threads-skill/compare/v1.2...v1.3
[1.2]: https://github.com/Scorpio-meow/Threads-skill/compare/v1.1...v1.2
[1.1]: https://github.com/Scorpio-meow/Threads-skill/compare/v1.0...v1.1
[1.0]: https://github.com/Scorpio-meow/Threads-skill/releases/tag/v1.0
