# Security Policy

[繁體中文](/.github/SECURITY.md) | **English** | [日本語](/.github/SECURITY.ja.md) | [한국어](/.github/SECURITY.ko.md)

## Supported versions

This project has no version numbers. Only the latest state of the `main` branch is maintained, and fixes are merged straight into `main`. If you installed with the `skills` command, run `bunx skills update` to get fixes; if you installed manually, copy the `threads-api` folder again.

## In scope

- Instructions in the skill that could make an AI assistant leak an access token or app secret, for example into the chat, code, logs or commits.
- Workflows in the skill that could make an AI assistant post, reply, delete posts or hide replies without the user's explicit consent, including when steered by external content such as posts or replies (prompt injection).
- Vulnerabilities in the reference client `threads_client.py` in section 14, such as printing the token in error messages or logs.
- Insecure patterns the skill teaches, such as putting the app secret in front-end code or inserting unvalidated embed HTML straight into a page.
- Vulnerabilities in the project site (`docs/`), such as XSS.

## Out of scope

- Vulnerabilities in Meta or the Threads API itself: report them to [Meta Bug Bounty](https://bugbounty.meta.com/).
- Vulnerabilities in the AI tools themselves (Claude Code, Codex and so on): report them to that tool's developer.
- Your own token or app secret has leaked: this isn't a vulnerability in this project. Revoke the token's authorization and generate a new one right away; if the app secret leaked, reset it in Meta's app dashboard.

## How to report

Please don't open a public issue, PR or Discussion.

1. Go to the repository's **Security** tab and click **Report a vulnerability**, or open the [private reporting form](https://github.com/Scorpio-meow/Threads-skill/security/advisories/new) directly. Only you and the maintainer can see the report.
2. Include the affected file and passage (for example, which section of SKILL.md), steps to reproduce (the AI tool, the model and your prompt) and the possible impact. A suggested fix is optional.
3. Don't include real tokens, app secrets or anyone else's data; use fake values when you need an example.

## What happens next

This project is maintained by one person, who will reply as soon as possible and post progress updates in the report itself. Once the issue is confirmed, it will be fixed on `main`, a security advisory will be published, and the fix will be recorded in [CHANGELOG.en.md](/CHANGELOG.en.md). With your consent, you'll be credited in the advisory.
