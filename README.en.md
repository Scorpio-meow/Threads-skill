# Threads API Skill

[繁體中文](README.md) | **English** | [日本語](README.ja.md) | [한국어](README.ko.md)

A skill that teaches AI assistants the Meta Threads API: it helps you write, review, and debug integration code, can also use your token to post, reply, and pull insights directly, and helps you embed Threads posts on your website.

- Built in the [Agent Skills](https://agentskills.io) format (one folder plus a `SKILL.md`), so it installs in Claude Code, the Claude apps, OpenAI Codex, Gemini CLI, GitHub Copilot, Cursor, Windsurf, and OpenCode.
- Distilled from Meta's official documentation, covering the changelog through 2026-08-12. The embedding section also draws on the live embed.js code and tests run in October 2026.
- The skill itself is written in English; the assistant replies in whatever language you use. The examples below use Claude.
- Not an official Meta project.
- Project site: <https://scorpio-meow.github.io/Threads-skill/>, where you can try “Check before you send” in your browser.

## Quick start

Install with a single [`skills`](https://github.com/vercel-labs/skills) command. It detects the AI tools on your machine and puts the skill in the right folders:

```bash
bunx skills add Scorpio-meow/Threads-skill --skill threads-api -g
```

- `-g` installs to your user directory (available in every project); drop `-g` to install into the current project only.
- To install for specific tools only, add `-a`, e.g. `-a claude-code -a codex`.
- No Bun? Swap `bunx` for `npx`.

Once installed, the skill kicks in automatically when you ask anything about the Threads API, for example:

> My keyword_search only returns my own posts. What am I doing wrong?

Manual installation for each tool is covered in the next section.

## Installation

### Skill folders by tool

Manual installation means copying the `threads-api` folder into the skill folder your tool reads, so that `SKILL.md` ends up at `<skill folder>/threads-api/SKILL.md`. The user folder applies to every project on this machine; the project folder lives under the project root and can be committed so your team shares it.

| Tool | User folder | Project folder | Invoke manually |
|---|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` | `/threads-api` |
| OpenAI Codex (CLI, IDE extension) | `~/.agents/skills/` | `.agents/skills/` | `/skills` or `$threads-api` |
| Gemini CLI | `~/.gemini/skills/` or `~/.agents/skills/` | `.gemini/skills/` or `.agents/skills/` | `/skills list` to check it loaded |
| GitHub Copilot (VS Code, Copilot CLI) | `~/.copilot/skills/` or `~/.agents/skills/` | `.github/skills/` or `.agents/skills/` | `/threads-api` |
| Cursor | `~/.cursor/skills/` or `~/.agents/skills/` | `.cursor/skills/` or `.agents/skills/` | Type `/` in Agent chat and pick it |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` | `@threads-api` |
| OpenCode | `~/.config/opencode/skills/` | `.opencode/skills/` or `.agents/skills/` | — |

On Windows, `~` is your user folder (`%USERPROFILE%`). Every tool uses the skill automatically when the conversation calls for it; the "Invoke manually" column just shows how to request it explicitly. If you use Codex, Gemini CLI, Copilot, and Cursor together, a single copy in `~/.agents/skills/` is shared by all of them.

The example below copies to `~/.agents/skills/`. For other tools, set `TARGET` to the path from the table above.

macOS/Linux:

```bash
git clone https://github.com/Scorpio-meow/Threads-skill.git
TARGET=~/.agents/skills
mkdir -p "$TARGET"
cp -r Threads-skill/threads-api "$TARGET/"
```

Windows PowerShell:

```powershell
git clone https://github.com/Scorpio-meow/Threads-skill.git
$TARGET = "$HOME\.agents\skills"
New-Item -ItemType Directory -Force $TARGET | Out-Null
Copy-Item -Recurse -Force Threads-skill\threads-api "$TARGET\"
```

To update later, run `git pull` in the `Threads-skill` folder and copy again; if you installed with the `skills` command, run `bunx skills update`. If your tool doesn't pick up the new skill, restart it.

### Claude apps (web/desktop)

1. Turn on code execution: on Free, Pro, and Max plans, enable "Code execution and file creation" under **Settings > Capabilities**; on Team and Enterprise plans, an organization owner must enable "Code execution and file creation" and "Skills" in the organization settings.
2. Zip the `threads-api` folder **on its own**, so the top level of the ZIP is the `threads-api/` folder. GitHub's "Download ZIP" gives you the whole repo (with `Threads-skill-main/` at the top level), which can't be uploaded as is.
3. Go to **Customize > Skills**, click **+** → **Create skill** → **Upload a skill**, and upload the ZIP.

If the UI has changed, follow the [official guide](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

### Official docs for each tool

If paths or UIs have changed, defer to the official docs: [Claude Code](https://code.claude.com/docs/en/skills)・[OpenAI Codex](https://learn.chatgpt.com/docs/build-skills)・[Gemini CLI](https://geminicli.com/docs/cli/skills/)・[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)・[VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)・[Cursor](https://cursor.com/docs/skills)・[Windsurf](https://docs.devin.ai/desktop/cascade/skills)・[OpenCode](https://opencode.ai/docs/skills)

## Features

### Build mode: write code, debug issues

- "Write me a TypeScript job that pulls my Threads post insights every day, with automatic token refresh."
- "Write a Python script that hides replies containing spam keywords under my posts every 10 minutes."

Claude follows your project's existing language and conventions (Node.js/TypeScript, Python, C#, Go, and so on; Python when there's no project) and builds the documented rules straight into the code:

- Tokens and the App secret are read from environment variables or a secrets manager, never hardcoded and never logged.
- Publishing follows the full flow: create a container → wait for processing to finish (handling errors, expiry, and timeouts) → publish → fetch the post URL.
- Character counts, link counts, and feature conflicts are checked locally before anything is sent, so no API quota is wasted.
- Pagination uses cursors; 4xx errors aren't retried blindly, and rate limits trigger a backoff.

### Operate mode: act on your account directly

- "Post this to Threads: 'Weekend only! 10% off our new coffee beans', with a poll asking whether people prefer light or dark roast."
- "What are the views and likes on my last 5 posts?"
- "Hide the replies under my latest post that mention 'add me on LINE'."

Claude works through these steps:

1. **Find a token**: it checks the `THREADS_ACCESS_TOKEN` environment variable first, then a `.env` in the project folder; if neither exists, it asks you to set one up (see [Configuration](#configuration)).
2. **Confirm the account**: it calls `GET /me` and tells you which account it's about to act on.
3. **Check the content**: character count, link count, and feature conflicts (for example, a ghost post can't include a poll). It also flags things that could keep the post from doing its job, such as a 24-hour ghost post published on Tuesday that won't last until the weekend it's promoting.
4. **Wait for your go-ahead**: before posting, replying, reposting, deleting, or hiding replies, it lists the account, the full text, media URLs, and every parameter, and waits for your explicit approval. Read-only queries don't need confirmation.
5. **Run and report**: it runs the request with the skill's built-in Python client and reports the post ID and URL; if something fails, it explains why and how to fix it instead of retrying blindly.

Operate mode needs Python 3.8 or later on your machine. By default, the code execution environment in the Claude apps can only reach package registries, not the Threads API, so when you use Operate mode in the app, Claude prepares the commands and parameters for you to run on your own machine.

### Embedding: put Threads posts on your website

- "I insert the Threads embed code with innerHTML, but every post only shows a 'View on Threads' link box. How do I fix it?"
- "Build me a wall of 60 featured posts, and check every week which ones have been deleted."

Claude will:

- Get the embed code from oEmbed (no token needed since March 2026), or build the embed markup from a validated post URL, instead of injecting stored HTML with innerHTML.
- Load embed.js once per page and call `window.instgrm.Embeds.process()` after adding posts; it also reminds you that your CSP must allow `https://www.threads.com` for scripts and iframes.
- Paginate, or load posts one after another, when a page has many of them, so Threads doesn't rate-limit you; judge success by what actually rendered, swap failed posts for a fallback card that links to the original, and pause for a while after repeated failures.
- Use oEmbed for periodic checks on whether posts still exist, removing a post only on `code 24` (Media Not Found) and treating every other error as temporary.

How embed.js loads embeds isn't documented. This part comes from reading the live embed.js code in October 2026 and from experience with a post gallery running in production, so Meta may change it.

### What difference does the skill make

Claude already knows the basics of the Threads API, but plenty of rules are buried in documentation details or recent changelog entries. In testing, Claude without the skill made each of the following mistakes; none of them showed up with the skill installed:

- It wasn't sure whether a ghost post could include a poll, and even offered to "just send it and see." The docs state that the only attachment a ghost post supports is a text spoiler, so no polls.
- It said `profile_lookup` only works for accounts with 1,000+ followers, or didn't mention the threshold at all. That threshold dropped to 100 in November 2025.
- It tried to hide a nested reply directly and only moved on to the parent reply after that failed. The API can only hide top-level replies, and hiding one hides the entire thread beneath it.
- It paginated using only `paging.next`. The docs state that post list responses don't include that field, so by the docs' own account this only ever fetches the first page.
- When refreshing a token, it didn't check the documented conditions: the token must be at least 24 hours old and not yet expired.
- It assumed embed.js scans the page only once when it loads, so it wrapped every post in its own iframe page. In fact, calling `window.instgrm.Embeds.process()` after adding posts makes embed.js scan the page again.
- It thought checking for deleted posts required a Meta app and token, so it scraped threads.com pages instead. oEmbed has needed no token since March 2026 and returns a clear `code 24` when a post is gone.

The skill also points out mistakes in the official examples that shouldn't be copied as is (such as sending a GET request with `curl -F`), and where the docs are unclear or contradict themselves, it says so plainly instead of guessing.

## Configuration

### Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `THREADS_ACCESS_TOKEN` | Threads user token used by Operate mode and the reference client; can also go in a `.env` in the project folder | None; required for Operate mode |
| `THREADS_APP_ID`, `THREADS_APP_SECRET` | Threads App ID and secret read by the OAuth and token exchange code that Build mode generates (not the Facebook pair) | None |
| `THREADS_API_BASE` | API base URL the reference client calls | `https://graph.threads.net/v1.0` |

Set the token (pick one):

- macOS/Linux: run `export THREADS_ACCESS_TOKEN="<your token>"` before starting your AI tool
- Windows PowerShell: run `$env:THREADS_ACCESS_TOKEN="<your token>"` before starting your AI tool
- Add the line `THREADS_ACCESS_TOKEN=<your token>` to a `.env` in the project folder, and add `.env` to `.gitignore`

The skill instructs Claude to pass the token to commands only through environment variables, never writing it into the conversation, code, or commits.

### Getting a token and permissions

If you don't have a token yet, just ask Claude "How do I get a Threads API access token?" It will walk you through creating a Meta App (choose the "Access the Threads API" use case), adding your account as a Threads tester, running the OAuth flow, and exchanging the result for a long-lived token valid for about 60 days. During testing, you can also generate one with the Graph API Explorer.

The token needs the matching permissions:

| Action | Permission |
|---|---|
| All calls | `threads_basic` |
| Publishing | `threads_content_publish` |
| Replying, hiding replies, reply approvals | `threads_manage_replies` (posting replies also needs `threads_content_publish`) |
| Reading replies | `threads_read_replies` |
| Insights | `threads_manage_insights` |
| Deleting posts | `threads_delete` |
| Keyword and topic tag search | `threads_keyword_search` |
| Mentions | `threads_manage_mentions` |
| Location search and tagging | `threads_location_tagging` |
| Public profile lookup | `threads_profile_discovery` |
| Cross-posting to Instagram Stories | `threads_share_to_instagram` |

Until App Review is approved, permissions only work on your own account and your testers' accounts, and some features return limited results (for example, keyword search only finds your own posts).

## Documentation

The skill itself is [`threads-api/SKILL.md`](threads-api/SKILL.md), organized into 14 sections:

| Section | Contents |
|---|---|
| 1 | Core concepts: API base URL, two-step publishing, container ID vs. media ID, different enum values for writes and reads |
| 2–3 | Build mode and Operate mode workflows |
| 4 | Publishing: flows for each post type, parameter tables, feature compatibility, character and media limits, container status |
| 5 | Reading and search: profiles, posts, mentions, public profiles, keyword and topic tag search, locations, pagination |
| 6 | Replies and moderation: reading, hiding, reply approvals |
| 7 | Insights: per-post and account-level metrics |
| 8 | Permissions, App Review, OAuth, token refresh |
| 9 | Quotas and rate limits |
| 10 | Webhooks |
| 11 | Embedding posts: oEmbed, how embed.js loads embeds, pacing and failure handling for many embeds; Web Intents |
| 12 | Troubleshooting: causes and fixes for common errors |
| 13 | Mistakes in the official examples that shouldn't be copied |
| 14 | Reference client `threads_client.py` |

Apart from the engineering advice marked *(practice)* and the live test results marked *(observed)*, everything comes from the official documentation.

The change history is in [CHANGELOG.en.md](CHANGELOG.en.md).

### Reference client

The `threads_client.py` in section 14 uses only the Python standard library (3.8 or later), so there's nothing to install. In Operate mode, Claude uses it to call the API; in Build mode, Claude uses its logic as a reference and ports it to your project's language. To use it yourself, save that code as `threads_client.py` (on Windows, replace `python3` with `python`):

```bash
python3 threads_client.py get me fields=id,username   # Confirm the account
python3 threads_client.py check spec.json             # Check content locally only, no API calls
python3 threads_client.py publish spec.json           # Check → create container → wait for processing → publish → print URL
python3 threads_client.py delete <media-id>           # Delete a post; cannot be undone
```

`spec.json` holds the container parameters. For example, a post with a poll:

```json
{"media_type": "TEXT", "text": "Light or dark roast?", "poll_attachment": {"option_a": "Light", "option_b": "Dark"}}
```

## Test results

We compared "with skill" and "without skill" using the same model: each task ran once under each setup, and a grader that took no part in answering checked every result against a predefined checklist, item by item. The skill was revised between rounds based on the grader's feedback, for four rounds in total; round 4 ran only the new task 6, after the skill gained the embedding section. The tasks and checklists are in [`evals/evals.json`](evals/evals.json).

Each cell shows the number of checklist items passed, formatted as "with skill vs without skill":

| Task | Round 1 | Round 2 | Round 3 | Round 4 |
|---|---|---|---|---|
| 1. Python carousel post (two images + one video) | 8/8 vs 8/8 | — | — | — |
| 2. TypeScript daily insights job with token refresh | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 | — |
| 3. Publishing a ghost post with a poll on the user's behalf | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 | — |
| 4. Diagnosing unexpected search, location, and profile lookup results | — | 6/6 vs 5/6 | 6/6 vs 5/6 | — |
| 5. Auto-hiding replies that contain keywords | — | 7/7 vs 6/7 | 7/7 vs 6/7 | — |
| 6. A 60-post Threads wall plus a weekly check for deleted posts | — | — | — | 8/8 vs 2/8 |
| **Average pass rate** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** | **100% vs 25%** |

- The average pass rate is the mean of the per-task pass rates. Task 1 scored full marks on both sides and didn't separate them, so rounds 2 onward use tasks 2–5; task 3 gained one checklist item starting in round 2.
- Each task ran only once per setup, so the sample is tiny and the numbers only indicate direction. For example, the without-skill version of task 2 lost points on pagination and token refresh in the first two rounds, then scored full marks in round 3.
- Nearly every point lost without the skill came from not knowing the rules in the docs, not from being unable to write the code; the examples in "What difference does the skill make" all come from these tests.

For each round's eval setup, time and token usage, and the reason behind every lost point, see the [benchmark summary](evals/BENCHMARK.en.md); item-by-item verdicts and the grader's evidence are in [evals/benchmark.json](evals/benchmark.json).

## Known limitations

- The built-in client has only been tested against a mock API; it hasn't actually posted to a real account yet.
- Tests have only been run on Claude. Other tools should work through the same flow, but this hasn't been verified.
- The Claude apps can't reach the Threads API by default, so Operate mode has to run on your own machine. Operate mode also requires a tool that can run terminal commands.
- The official docs contradict themselves or are unclear in a few places, such as whether location search uses `q` or `query`, whether the API errors out or silently ignores unsupported features on a ghost post, and whether webhooks require App Review. The skill says so plainly when these come up instead of guessing.
- embed.js's loading behavior (at most 3 embeds at a time, `instgrm.Embeds.process()`, `data-theme`, and so on) isn't documented; it was observed in October 2026, and Meta may change it at any time.
- The documentation snapshot is from 2026-08-12; for later changes, defer to the [official changelog](https://developers.facebook.com/documentation/threads/changelog).
- Threads ads (part of the Marketing API) are not covered.

## Contributing

Reports of wrong rules, new pitfalls and improvements to the site are all welcome.

- Workflow, repository layout and what to update together: [Contributing guide](.github/CONTRIBUTING.en.md)
- [Code of Conduct](.github/CODE_OF_CONDUCT.en.md)
- Report security issues privately as described in the [Security Policy](.github/SECURITY.en.md), not in a public issue.
- Accessibility of the project site: [Accessibility Statement](.github/ACCESSIBILITY.en.md)

## License

[MIT](LICENSE)
