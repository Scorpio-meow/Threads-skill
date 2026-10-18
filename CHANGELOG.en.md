# Changelog

[繁體中文](CHANGELOG.md) | **English** | [日本語](CHANGELOG.ja.md) | [한국어](CHANGELOG.ko.md)

Notable changes to this project are recorded here, following the format of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Version numbers follow `metadata.version` in `threads-api/SKILL.md`, and the Agensi listing uses the same numbers; changes before 1.0 are grouped by date.

## Unreleased

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
