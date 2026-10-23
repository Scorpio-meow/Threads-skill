# Threads API Skill

[繁體中文](README.md) | **English** | [日本語](README_ja.md) | [한국어](README_ko.md)

A skill that teaches AI assistants the Meta Threads API: it helps you write, review, and debug integration code, can also use your token to post, reply, and pull insights directly, and helps you embed Threads posts on your website.

- Built in the [Agent Skills](https://agentskills.io) format (one folder plus a `SKILL.md`), so it installs in more than a dozen tools, including Claude Code, the Claude apps, ChatGPT, OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Devin Desktop (formerly Windsurf) and OpenCode.
- Distilled from Meta's official documentation (synced 2026-10-23, covering the changelog through 2026-08-18). The embedding section also draws on the live embed.js code and tests run in October 2026, and on experience from two real projects.
- The skill itself is written in English; the assistant replies in whatever language you use. The examples below use Claude.
- Not an official Meta project.
- Project site: <https://scorpio-meow.github.io/Threads-skill/>, where you can try “Check before you send” in your browser.

## Quick start

Install with a single [`skills`](https://github.com/vercel-labs/skills) command. It detects the AI tools on your machine and puts the skill in the right folders:

```bash
bunx skills add Scorpio-meow/Threads-skill --skill threads-api -g
```

- `-g` installs to your user directory (available in every project); drop `-g` to install into the current project only.
- To install for specific tools only, add `-a`, e.g. `-a claude-code -a codex`; the value for each tool is in the [table in the next section](#skill-folders-by-tool).
- No [Bun](https://bun.sh)? Swap `bunx` for `npx`.

Once installed, the skill kicks in automatically when you ask anything about the Threads API, for example:

> My keyword_search only returns my own posts. What am I doing wrong?

Manual installation and the other ways to install are covered in the next section.

## Installation

### Skill folders by tool

Manual installation means copying the `threads-api` folder into the skill folder your tool reads, so that `SKILL.md` ends up at `<skill folder>/threads-api/SKILL.md`. The user folder applies to every project on this machine; the project folder lives under the project root and can be committed so your team shares it.

| Tool | `-a` value | User folder | Project folder | Invoke manually |
|---|---|---|---|---|
| Claude Code | `claude-code` | `~/.claude/skills/` | `.claude/skills/` | `/threads-api` |
| OpenAI Codex (CLI, IDE extension, ChatGPT desktop app) | `codex` | `~/.agents/skills/` | `.agents/skills/` | `/skills` or `$threads-api` |
| GitHub Copilot (VS Code, Copilot CLI, JetBrains) | `github-copilot` | `~/.copilot/skills/` | `.github/skills/` | `/threads-api` |
| Cursor | `cursor` | `~/.cursor/skills/` | `.cursor/skills/` | Type `/` in Agent chat and pick it |
| Gemini CLI | `gemini-cli` | `~/.gemini/skills/` | `.gemini/skills/` | `/skills list` to check it loaded |
| Google Antigravity | `antigravity` | `~/.gemini/config/skills/` | `.agents/skills/` | — |
| Devin Desktop (formerly Windsurf) | `devin` | `~/.config/devin/skills/` | `.devin/skills/` | `@threads-api` |
| OpenCode | `opencode` | `~/.config/opencode/skills/` | `.opencode/skills/` | — |
| Cline | `cline` | `~/.cline/skills/` | `.cline/skills/` | `/threads-api` |
| Kiro | `kiro-cli` | `~/.kiro/skills/` | `.kiro/skills/` | Type `/` and pick it |
| JetBrains Junie | `junie` | `~/.junie/skills/` | `.junie/skills/` | `/threads-api` or `$threads-api` |
| Roo Code | `roo` | `~/.roo/skills/` | `.roo/skills/` | — |

On Windows, `~` is your user folder (`%USERPROFILE%`). Every tool uses the skill automatically when the conversation calls for it; the "Invoke manually" column just shows how to request it explicitly.

- Codex, Copilot, Cursor, Gemini CLI, OpenCode, Devin Desktop, Junie and Roo Code also read `~/.agents/skills/`, so if you use several of them, one copy there serves them all. Claude Code reads only `~/.claude/skills/`.
- `bunx skills` keeps one copy in the shared `.agents/skills/` folder (`~/.agents/skills/` with `-g`) and links it for the other tools. If a tool doesn't see the skill afterwards, install it by hand into the folder from the table.
- Tools not in the table (Amp, Goose, Kilo Code, Trae, Qwen Code and more) can use `bunx skills` too; see the [skills README](https://github.com/vercel-labs/skills) for their `-a` values.
- Devin Desktop still reads the Windsurf-era `~/.codeium/windsurf/skills/` and `.windsurf/skills/`.

The example below copies to `~/.agents/skills/`. For other tools, set `TARGET` to the path from the table above.

macOS/Linux:

```bash
git clone --depth 1 https://github.com/Scorpio-meow/Threads-skill.git
TARGET=~/.agents/skills
mkdir -p "$TARGET"
cp -r Threads-skill/threads-api "$TARGET/"
```

Windows PowerShell:

```powershell
git clone --depth 1 https://github.com/Scorpio-meow/Threads-skill.git
$TARGET = "$HOME\.agents\skills"
New-Item -ItemType Directory -Force $TARGET | Out-Null
Copy-Item -Recurse -Force Threads-skill\threads-api "$TARGET\"
```

If your tool doesn't pick up the new skill, restart it.

### Other ways to install

Some tools have their own install commands:

- **GitHub CLI** (2.90 or later; `gh skill` is in public preview). `--agent` takes the same values as `-a` in the table.

  ```bash
  gh skill install Scorpio-meow/Threads-skill threads-api --agent claude-code --scope user
  ```

- **OpenAI Codex**: in Codex, enter

  ```text
  $skill-installer install https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api
  ```

  The installer puts it in `~/.codex/skills/threads-api` (`$CODEX_HOME/skills/` if you set `CODEX_HOME`), not in `~/.agents/skills/` from the table. Codex reads both, but its docs list only `~/.agents/skills/` as the personal folder, and its source code marks `~/.codex/skills/` as deprecated and kept for backward compatibility; to use `~/.agents/skills/`, install with `bunx skills` or copy by hand instead. Don't keep a copy in both: Codex doesn't merge skills with the same name, so both show up in the skill selectors.

  Codex runs commands in a sandbox with network access off by default, so it asks before operate mode reaches the Threads API. To always allow it, add this to `~/.codex/config.toml`:

  ```toml
  [sandbox_workspace_write]
  network_access = true
  ```

- **GitHub Copilot CLI**: after cloning, run `copilot skill add Threads-skill/threads-api`; if you add it mid-session, load it with `/skills reload`. Adding a folder registers its location rather than copying it, so keep the cloned folder. Put it in a repository's `.github/skills/` and commit it, and the Copilot cloud agent uses it too.
- **Gemini CLI**: installs for your user by default; add `--scope workspace` to install into the current project only.

  ```bash
  gemini skills install https://github.com/Scorpio-meow/Threads-skill.git --path threads-api
  ```

- **Kiro**: in the Kiro panel, open **Agent Steering & Skills** → **+** → **Import a skill** → **GitHub**, and paste a URL that points to the skill's subfolder: `https://github.com/Scorpio-meow/Threads-skill/tree/main/threads-api`. Kiro's docs don't say whether importing brings along subfolders, so after importing, check that the skill folder contains `scripts/threads_client.py`; if it doesn't, copy the whole `threads-api` folder by hand instead.
- **Devin Desktop**: manage skills from **⋯** → **Skills** at the top right of the Cascade panel.
- **Cline**: new skills are on by default; toggle them in the **Skills** tab at the bottom of the Cline panel.

### Claude apps (web/desktop)

1. Turn on code execution: on Pro and Max plans, enable "Code execution and file creation" under **Settings > Capabilities**; on Team and Enterprise plans, an organization owner must enable "Code execution and file creation" and "Skills" in the organization settings.
2. Zip the `threads-api` folder **on its own**, so the top level of the ZIP is the `threads-api/` folder. GitHub's "Download ZIP" gives you the whole repo (with `Threads-skill-main/` at the top level), which can't be uploaded as is.
   - macOS/Linux: in the `Threads-skill` folder, run `zip -r ../threads-api.zip threads-api -x '*.DS_Store'`.
   - Windows: in File Explorer, right-click the `threads-api` folder → **Compress to ZIP file** (on Windows 10, **Send to → Compressed (zipped) folder**).
3. Go to **Customize > Skills**, click **+** → **Create skill** → **Upload a skill**, and upload the ZIP. If your UI shows **Settings > Capabilities** instead, click **Upload skill** in its Skills section.

Uploaded skills are private to your account; to share one with your whole organization, an owner has to provision it. The apps' code environment can't reach the Threads API by default, so run operate mode on your own machine. If the UI has changed, follow the [official guide](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

### ChatGPT

According to the [official help article](https://help.openai.com/en/articles/20001066-skills-in-chatgpt), skills in ChatGPT are available to eligible Business, Enterprise, Healthcare and Edu users, and your workspace settings decide whether you can upload one.

1. Zip the `threads-api` folder as described in the previous section.
2. In the sidebar, open **Plugins** → the **Skills** tab → **Create** → **Upload from your computer**, and upload the ZIP.
3. Type `@` in a chat to pick `threads-api`, or let ChatGPT decide when to use it.

Skills don't sync between ChatGPT and Codex yet, so install it in Codex separately.

### Agensi

The skill is also listed for free on [Agensi](https://agensi.io/skills/threads-api). On the skill page, click "Copy prompt to install" and paste the copied prompt into your AI assistant; it connects to Agensi and installs the skill. Assistants already connected to the Agensi connector load the latest version from Agensi each time they use it.

Agensi doesn't store the skill on your computer, and its license doesn't allow saving any part of it, so the `scripts/threads_client.py` that Operate mode runs isn't on your machine. In that case the skill tells the AI assistant to fetch the file from Agensi and pass it to Python on standard input (stdin) instead of saving it. If you rely on Operate mode, install with one of the methods above instead.

Updates to this repository reach Agensi only after Agensi approves them, so this repository always has the latest content.

### Updating and removing

| Installed with | Update | Remove |
|---|---|---|
| `bunx skills` | `bunx skills update threads-api` | `bunx skills remove threads-api` |
| `gh skill` | `gh skill update` | Delete the `threads-api` folder |
| Codex (`$skill-installer`) | Delete the `~/.codex/skills/threads-api` folder, then install again (the installer stops if the folder already exists) | Delete the `~/.codex/skills/threads-api` folder |
| Copilot CLI (`copilot skill add`) | Run `git pull` in the `Threads-skill` folder; in a running session, also run `/skills reload` | `copilot skill remove` with the path of the `threads-api` folder (this only unregisters it; the files stay) |
| Gemini CLI | Uninstall, then install again | `gemini skills uninstall threads-api` |
| Kiro | Delete `threads-api` from the skills folder, then import again | Delete `threads-api` from the skills folder |
| Manual copy | Run `git pull` in the `Threads-skill` folder, then copy again | Delete the `threads-api` folder |
| Claude apps, ChatGPT | Delete the old one, then upload the new ZIP | Delete it on the Skills page |
| Agensi | Nothing to do: it loads the latest version from Agensi each time | Nothing is stored on your computer, so there's nothing to remove |

Kiro's docs don't cover updating or removing; imported skills are copied into the skills folder (`~/.kiro/skills/` or `.kiro/skills/`), so the table deletes that folder.

### Official docs for each tool

If paths or UIs have changed, defer to the official docs: [Claude Code](https://code.claude.com/docs/en/skills)・[Claude apps](https://support.claude.com/en/articles/12512180-using-skills-in-claude)・[ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)・[OpenAI Codex](https://learn.chatgpt.com/docs/build-skills)・[GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)・[VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)・[Cursor](https://cursor.com/docs/skills)・[Gemini CLI](https://geminicli.com/docs/cli/skills/)・[Google Antigravity](https://antigravity.google/docs/skills)・[Devin Desktop](https://docs.devin.ai/desktop/cascade/skills)・[OpenCode](https://opencode.ai/docs/skills)・[Cline](https://docs.cline.bot/customization/skills)・[Kiro](https://kiro.dev/docs/skills/)・[JetBrains Junie](https://junie.jetbrains.com/docs/agent-skills.html)・[Roo Code](https://roocodeinc.github.io/Roo-Code/features/skills/)・[skills](https://github.com/vercel-labs/skills)・[gh skill](https://cli.github.com/manual/gh_skill_install)

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

- Get the embed code from oEmbed (no token needed since March 2026), or build the embed markup from a validated post URL (including the `id` that embed.js needs to remove the fallback link), instead of injecting stored HTML with innerHTML; match and deduplicate posts by their shortcode, not the raw URL.
- Load embed.js once per page and call `window.instgrm.Embeds.process()` after adding posts; it also reminds you that your CSP must allow `https://www.threads.com` for scripts and iframes.
- Where embed.js can't load (a strict CSP, Chrome extension pages), iframe `/embed/` directly, size the iframe from the height the embed page reports as a bare number, and add `?theme=dark` for the dark theme.
- Paginate, or load posts one after another, when a page has many of them, so Threads doesn't rate-limit you; count an embed as loaded when its first height report is above 0, swap failed posts for a fallback card that links to the original, and pause for a while after repeated failures.
- Use oEmbed for periodic checks on whether posts still exist, removing a post only on `code 24` (Media Not Found) and treating every other error as temporary. A deleted post shows a "Cannot display thread" card on the page, which looks like a successful load, so only oEmbed can find it. Posts Threads shows only to logged-in users are the opposite case: oEmbed still returns their embed code, but visitors who aren't logged in to Threads or who block third-party cookies can't see them, and the skill explains how to tell them apart.

How embed.js loads embeds and how the embed page reports its height aren't documented. This part comes from reading the live embed.js code in October 2026, from loading real embeds on a test page, and from experience with two real projects (a post gallery and a Chrome extension), so Meta may change it.

### What difference does the skill make

Claude already knows the basics of the Threads API, but plenty of rules are buried in documentation details or recent changelog entries. In testing, Claude without the skill made each of the following mistakes; none of them showed up with the skill installed:

- It wasn't sure whether a ghost post could include a poll, and even offered to "just send it and see." The docs state that the only attachment a ghost post supports is a text spoiler, so no polls.
- It said `profile_lookup` only works for accounts with 1,000+ followers, or didn't mention the threshold at all. That threshold dropped to 100 in November 2025.
- It tried to hide a nested reply directly and only moved on to the parent reply after that failed. The API can only hide top-level replies, and hiding one hides the entire thread beneath it.
- It paginated using only `paging.next`. The docs state that post list responses don't include that field, so by the docs' own account this only ever fetches the first page.
- When refreshing a token, it didn't check the documented conditions: the token must be at least 24 hours old and not yet expired.
- It assumed embed.js scans the page only once when it loads, so it wrapped every post in its own iframe page. In fact, calling `window.instgrm.Embeds.process()` after adding posts makes embed.js scan the page again.
- It thought checking for deleted posts required a Meta app and token, so it scraped threads.com pages instead. oEmbed has needed no token since March 2026 and returns a clear `code 24` when a post is gone.
- It said `/embed/` sends its height as a `MEASURE` message in a JSON string, so the listener it wrote never received a single real report. The embed page sends a bare number, and posts with images send a few more after the images load.
- It said Threads embeds have no dark theme parameter, so the only option was a CSS filter. In fact, adding `?theme=dark` to the `/embed/` URL, or setting `data-theme="dark"` on the blockquote, is all it takes.
- It didn't notice that the embed code's blockquote was missing its `id`, and blamed the "View on Threads" link left under the post on embed.js running more than once. embed.js relies on that `id` to remove the fallback link.

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

Until App Review is approved, permissions only work on the app's tester accounts (add your own account as a tester too), and some features return limited results (for example, keyword search only finds your own posts).

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
| 11 | Embedding posts: oEmbed, how embed.js loads embeds, the embed page's height reports, embedding `/embed/` directly, pacing and failure handling for many embeds; Web Intents |
| 12 | Troubleshooting: causes and fixes for common errors |
| 13 | Mistakes in the official examples that shouldn't be copied |
| 14 | How to run the reference client [`scripts/threads_client.py`](threads-api/scripts/threads_client.py), with spec examples |

Apart from the engineering advice marked *(practice)* and the live test results marked *(observed)*, everything comes from the official documentation.

The change history is in [CHANGELOG_en.md](CHANGELOG_en.md).

### Reference client

The reference client is [`threads-api/scripts/threads_client.py`](threads-api/scripts/threads_client.py). It uses only the Python standard library (3.8 or later), so there's nothing to install, and section 14 of SKILL.md explains how to run it. In Operate mode, Claude runs it to call the API; in Build mode, Claude reads its logic and ports it to your project's language. To use it yourself, run the file directly; it reads the token from `THREADS_ACCESS_TOKEN` or from a `.env` in the current folder. The examples below run from the repository root; if you installed the skill, use the path in your skills folder instead (on Windows, replace `python3` with `python`):

```bash
python3 threads-api/scripts/threads_client.py get me fields=id,username   # Confirm the account
python3 threads-api/scripts/threads_client.py check spec.json             # Check content locally only, no API calls
python3 threads-api/scripts/threads_client.py publish spec.json           # Check → create container → wait for processing → publish → print URL
python3 threads-api/scripts/threads_client.py delete <media-id>           # Delete a post; cannot be undone
```

`spec.json` holds the container parameters. For example, a post with a poll:

```json
{"media_type": "TEXT", "text": "Light or dark roast?", "poll_attachment": {"option_a": "Light", "option_b": "Dark"}}
```

## Test results

We compared "with skill" and "without skill" using the same model: each task ran once under each setup, and a grader that took no part in answering checked every result against a predefined checklist, item by item. The skill was revised between rounds based on the grader's feedback, for ten rounds in total; round 4 ran only the new task 6, after the skill gained the embedding section, round 5 ran only the new tasks 7–10, and round 6 reran tasks 2, 4, 7 and 8 to check the webhook deduplication and `debug_token` changes, and round 7 reran all 10 tasks after the reference client moved to `scripts/threads_client.py`. Round 8 ran task 6 and the new tasks 11 and 12 after the embedding section was rewritten, round 9 reran those three tasks with version 1.5, and round 10 checked posts shown only to logged-in users, running the new task 13 and rerunning task 12. The tasks and checklists are in [`evals/evals.json`](evals/evals.json).

Each cell shows the number of checklist items passed, formatted as "with skill vs without skill":

| Task | Round 1 | Round 2 | Round 3 | Round 4 | Round 5 | Round 6 | Round 7 | Round 8 | Round 9 | Round 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1. Python carousel post (two images + one video) | 8/8 vs 8/8 | — | — | — | — | — | 8/8 vs 8/8 | — | — | — |
| 2. TypeScript daily insights job with token refresh | 9/9 vs 7/9 | 9/9 vs 7/9 | 9/9 vs 9/9 | — | — | 9/9 vs 8/9 | 9/9 vs 7/9 | — | — | — |
| 3. Publishing a ghost post with a poll on the user's behalf | 6/6 vs 3/6 | 7/7 vs 4/7 | 7/7 vs 5/7 | — | — | — | 7/7 vs 6/7 | — | — | — |
| 4. Diagnosing unexpected search, location, and profile lookup results | — | 6/6 vs 5/6 | 6/6 vs 5/6 | — | — | 6/6 vs 5/6 | 7/7 vs 5/7 | — | — | — |
| 5. Auto-hiding replies that contain keywords | — | 7/7 vs 6/7 | 7/7 vs 6/7 | — | — | — | 7/7 vs 6/7 | — | — | — |
| 6. A 60-post Threads wall plus a weekly check for deleted posts | — | — | — | 8/8 vs 2/8 | — | — | 8/8 vs 3/8 | 8/8 vs 3/8 | 9/9 vs 4/9 | — |
| 7. FastAPI webhook for replies and mentions | — | — | — | — | 8/8 vs 8/8 | 8/8 vs 6/8 | 8/8 vs 6/8 | — | — | — |
| 8. Express OAuth login with long-lived token refresh | — | — | — | — | 8/8 vs 7/8 | 8/8 vs 7/8 | 8/8 vs 7/8 | — | — | — |
| 9. Reviewing a buggy Python posting script | — | — | — | — | 8/8 vs 6/8 | — | 8/8 vs 6/8 | — | — | — |
| 10. Posting a thread with emoji at 8 AM the next day on the user's behalf | — | — | — | — | 7/7 vs 6/7 | — | 7/7 vs 5/7 | — | — | — |
| 11. Chrome extension preview that embeds `/embed/` directly | — | — | — | — | — | — | — | 8/8 vs 4/8 | 9/9 vs 4/9 | — |
| 12. Embed cards in a React component | — | — | — | — | — | — | — | 8/8 vs 3/8 | 9/9 vs 3/9 | 9/9 vs 3/9 |
| 13. Posts shown only to logged-in users | — | — | — | — | — | — | — | — | — | 8/8 vs 6/8 |
| **Average pass rate** | **100% vs 76%** | **100% vs 76%** | **100% vs 85%** | **100% vs 25%** | **100% vs 87%** | **100% vs 84%** | **100% vs 77%** | **100% vs 42%** | **100% vs 41%** | **100% vs 54%** |

- The average pass rate is the mean of the per-task pass rates. Task 1 scored full marks on both sides and didn't separate them, so rounds 2 onward use tasks 2–5; task 3 gained one checklist item starting in round 2. Task 4 gained a seventh checklist item in round 7, tasks 6, 11 and 12 each gained a ninth in round 9, and task 13 has 8 checklist items.
- Each task ran only once per setup, so the sample is tiny and the numbers only indicate direction. For example, the without-skill version of task 2 lost points on pagination and token refresh in the first two rounds, then scored full marks in round 3.
- Nearly every point lost without the skill came from not knowing the rules in the docs, not from being unable to write the code; the examples in "What difference does the skill make" all come from these tests. In round 5 the without-skill setup could search the web for the official docs, and did, so the gap narrowed to 100% vs 87%. In round 6 neither setup could use the web; with the skill, all 31 checklist items passed. Round 7, again without web access, reran all 10 tasks: with the skill all 77 checklist items passed, without it the average was 77%, and no task regressed after the reference client moved out of SKILL.md. The three tasks in rounds 8 and 9 all cover embed behavior the official docs don't describe: without the skill only about 40% passed on average, and both rounds produced the same confidently stated wrong claims; with the skill everything passed in both rounds, and round 9 also confirmed that the fix made after round 8 (the height is reported more than once) has taken effect. In task 13 of round 10, the without-skill version worked out on its own that a login and third-party cookies were needed, so the gap was smaller (8/8 with the skill, 6/8 without).

For each round's eval setup, time and token usage, and the reason behind every lost point, see the [benchmark summary](evals/BENCHMARK_en.md); item-by-item verdicts and the grader's evidence are in [evals/benchmark.json](evals/benchmark.json).

## Known limitations

- The built-in client has only been tested against a mock API; it hasn't actually posted to a real account yet.
- Tests have only been run on Claude. Other tools should work through the same flow, but this hasn't been verified.
- The Claude apps can't reach the Threads API by default, so Operate mode has to run on your own machine. Operate mode also requires a tool that can run terminal commands.
- The official docs contradict themselves or are unclear in a few places, such as whether location search uses `q` or `query`, whether the API errors out or silently ignores unsupported features on a ghost post, and whether webhooks require App Review. The skill says so plainly when these come up instead of guessing.
- embed.js's loading behavior (at most 3 embeds at a time, `instgrm.Embeds.process()`, `data-theme`, the embed page's height reports, and so on) isn't documented; it was observed in October 2026, and Meta may change it at any time. The embed page occasionally reports a height of 0, and the cause hasn't been found yet.
- The official docs were re-synced on 2026-10-23, and the changelog's newest entry is 2026-08-18; for later changes, defer to the [official changelog](https://developers.facebook.com/documentation/threads/changelog).
- Threads ads (part of the Marketing API) are not covered.

## Contributing

Reports of wrong rules, new pitfalls and improvements to the site are all welcome.

- Workflow, repository layout and what to update together: [Contributing guide](.github/CONTRIBUTING_en.md)
- [Code of Conduct](.github/i18n/CODE_OF_CONDUCT_en.md)
- Report security issues privately as described in the [Security Policy](.github/SECURITY_en.md), not in a public issue.
- Accessibility of the project site: [Accessibility Statement](.github/ACCESSIBILITY_en.md)

## License

[MIT](LICENSE)
