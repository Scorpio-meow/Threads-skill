## What changed

<!-- What you changed and why. If there's a related issue, write Closes #number. -->

## Scope

- [ ] Skill content (`threads-api/SKILL.md`, `threads-api/scripts/`)
- [ ] Evals (`evals/`)
- [ ] Project site (`docs/`)
- [ ] Docs (README, CHANGELOG, `.github/` and so on)

## Source

<!-- When you change the skill's content, link the official docs or changelog; for live test results, include the request and response with the token removed. -->

## Checklist

<!-- Delete items that don't apply, or explain why. -->

- [ ] Content from the official docs keeps the original meaning; engineering advice is marked *(practice)* and live test results *(observed)*
- [ ] Skill content changed: reran the with-skill vs without-skill comparison against `evals/evals.json` and updated `evals/BENCHMARK*.md` and `evals/benchmark.json`
- [ ] `check()` changed: updated `docs/assets/js/client.js` to match, and both give the same results for the same specs
- [ ] All four language versions are updated, or I noted above which parts need help with translation
- [ ] Recorded the change under “Unreleased” in all four `CHANGELOG*.md` files
- [ ] Added or moved documents: updated `docs/llms.txt`
- [ ] No tokens, app secrets or other personal data are included
