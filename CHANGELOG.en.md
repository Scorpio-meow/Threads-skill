# Changelog

[繁體中文](CHANGELOG.md) | **English** | [日本語](CHANGELOG.ja.md) | [한국어](CHANGELOG.ko.md)

Notable changes to this project are recorded here, following the format of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Version numbers follow `metadata.version` in `threads-api/SKILL.md`, and the Agensi listing uses the same numbers; changes before 1.0 are grouped by date.

## Unreleased

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

## 1.3 - 2026-10-19

### Changed

- Section 8 of SKILL.md now follows Meta's 2026-08-18 changelog entry on `debug_token`: besides a Threads tester's token, `access_token` can be the app token (`TH|<APP_ID>|<APP_SECRET>`); either way it must come from the same app as `input_token`, and the error for a token from another app is now listed. The `code 190` row in section 12 now points to section 8, and the doc snapshot date is now 2026-08-18 (SKILL.md, all four READMEs, `docs/llms.txt` and the site). In `evals/benchmark.json`, the with-skill runs of question 2 in rounds 1–3 all mention skipping the `debug_token` check of the 90-day permission grant when the account isn't a Threads tester; the evals haven't been rerun since this was updated.
- `metadata.version` in `threads-api/SKILL.md` raised to 1.3.
- Installation docs:
  - The tool table in all four READMEs now gives each tool's `-a` value for `bunx skills` and adds Google Antigravity, Cline, Kiro, JetBrains Junie and Roo Code; Windsurf is now Devin Desktop, with its new paths.
  - New README sections: “Other ways to install” (GitHub CLI's `gh skill`, Codex, Copilot CLI, Gemini CLI, Kiro), “ChatGPT” and “Updating and removing”.
  - The Claude apps steps now name the Pro and Max plans, show how to make the ZIP on each system and also give the Settings > Capabilities upload location.
  - The site's tool list, the “How do I install it by hand?” and “How do I use it in the Claude apps?” answers, `docs/llms.txt` and the usage issue forms are updated to match.

## 1.2 - 2026-10-18

### Added

- Questions 7–10 (a FastAPI webhook for replies and mentions, Express OAuth login with long-lived token refresh, reviewing a buggy Python posting script, posting a thread with emoji at 8 AM the next day on the user's behalf) and the round 5 results, recorded in all four benchmark summaries and `evals/benchmark.json`.

### Changed

- Section 10 of SKILL.md gains a *(practice)* line: the same webhook event can arrive more than once, so processing should be idempotent, keyed on `values.field` plus the media ID, not on a hash of the raw body. The evals haven't been rerun since it was added.
- `metadata.version` in `threads-api/SKILL.md` raised to 1.2.

### Fixed

- The Contributing and other tabs on the GitHub repository page resolve relative links in the community files from the repository root, so they returned 404; the links now use paths that start with `/`, counted from the repository root.
- The Code of conduct tab on the GitHub repository page showed the English version: the English, Japanese and Korean versions moved to `.github/i18n/`, so the tab shows the Traditional Chinese version.

## 1.1 - 2026-10-18

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

## 1.0 - 2026-10-18

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
