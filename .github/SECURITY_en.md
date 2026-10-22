# Security Policy

[繁體中文](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY.md) | **English** | [日本語](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_ja.md) | [한국어](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/.github/SECURITY_ko.md)

## Supported versions

This project has no version numbers. Only the latest state of the `main` branch is maintained, and fixes are merged straight into `main`. If you installed with the `skills` command, run `bunx skills update` to get fixes; if you installed manually, copy the `threads-api` folder again.

## Reporting a vulnerability

**Do not disclose vulnerability details in public issues, pull requests, or discussions.**

Report privately through one of these channels:

1. **GitHub private reporting (preferred)**: go to the repository's **Security** tab and click **Report a vulnerability**, or open the [private reporting form](https://github.com/Scorpio-meow/Threads-skill/security/advisories/new) directly. Only you and the maintainer can see the report.
2. **Email**: if you can't use GitHub, write to [yao921024@gmail.com](mailto:yao921024@gmail.com) with a subject starting with `[Security] Threads-skill`. Email is not end-to-end encrypted, so start with a short summary and send the details after you get a reply.

Please include as much of the following as you can:

- The affected file and passage, for example which section of SKILL.md
- Steps to reproduce: the AI tool, the model and your prompt
- The possible impact
- A suggested fix (optional)

Use fake values when you need an example; don't include real tokens, app secrets or anyone else's data.

## Response process and timelines

This project is maintained by one person and has no bug bounty, but it commits to these timelines:

| Stage | Timeline |
|---|---|
| Acknowledge and first reply | Within 14 days of the report |
| Public disclosure | When the fix is released, and no later than 90 days after the report |

1. **Acknowledge**: confirm receipt and share an initial assessment; later progress is posted in the same report.
2. **Assess**: confirm whether it is a vulnerability, its impact, and its severity, and ask you for details if needed; if it is not a vulnerability, explain why.
3. **Fix**: discuss the fix with you in a private GitHub security advisory, where you can also submit a fix on a private fork.
4. **Release**: merge the fix into `main`, publish the security advisory, request a CVE ID through GitHub when applicable, and record the fix in [CHANGELOG_en.md](https://github.com/Scorpio-meow/Threads-skill/blob/HEAD/CHANGELOG_en.md).
5. **Credit**: credit you in the advisory if you wish.

Please do not disclose details until the fix is released. If a fix cannot be ready within 90 days, the maintainer will explain why before the deadline and agree on a new disclosure date with you.

## Scope

### In scope

- Instructions in the skill that could make an AI assistant leak an access token or app secret, for example into the chat, code, logs or commits.
- Workflows in the skill that could make an AI assistant post, reply, delete posts or hide replies without the user's explicit consent, including when steered by external content such as posts or replies (prompt injection).
- Vulnerabilities in the reference client `threads-api/scripts/threads_client.py`, such as printing the token in error messages or logs.
- Insecure patterns the skill teaches, such as putting the app secret in front-end code or inserting unvalidated embed HTML straight into a page.
- Vulnerabilities in the project site (`docs/`), such as XSS.

### Out of scope

- Vulnerabilities in Meta or the Threads API itself: report them to [Meta Bug Bounty](https://bugbounty.meta.com/).
- Vulnerabilities in the AI tools themselves (Claude Code, Codex and so on): report them to that tool's developer.
- Your own token or app secret has leaked: this isn't a vulnerability in this project. Revoke the token's authorization and generate a new one right away; if the app secret leaked, reset it in Meta's app dashboard.
