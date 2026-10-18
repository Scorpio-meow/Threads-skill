---
name: threads-api
description: "Use for Meta's Threads API and embedding Threads posts: code that posts, reads, searches, moderates, pulls insights or handles tokens/webhooks, and posting, replying or pulling stats for the user."
license: MIT
compatibility: "Operate mode runs the bundled Python 3.8+ client (standard library only) and needs HTTPS access to graph.threads.net plus THREADS_ACCESS_TOKEN from the environment or a .env file in the working folder. Build and Embed don't need the client or a token."
metadata:
  author: Scorpio-meow
  version: "1.2"
---

# Threads API

Playbook for Meta's Threads API, distilled from the official docs (snapshot covering the changelog through **2026-08-12**). It serves three jobs:

- **Build** — write, review or debug code that calls the API.
- **Operate** — call the API on the user's own account: post, reply, delete, hide replies, read insights.
- **Embed** — show Threads posts on a website with oEmbed and embed.js, or add "share to Threads" buttons with Web Intents.

Statements are from the docs unless tagged *(practice)*, which marks engineering advice. If the API behaves differently from what's written here, or the user asks about something newer than the snapshot, check the live changelog (https://developers.facebook.com/documentation/threads/changelog), or the user's local copy of the docs if one is available. Threads ads live in the Marketing API and are out of scope.

Contents: 1 Core facts · 2 Build mode · 3 Operate mode · 4 Publishing · 5 Reading & search · 6 Replies & moderation · 7 Insights · 8 Auth & permissions · 9 Quotas · 10 Webhooks · 11 Embedding, oEmbed & Web Intents · 12 Troubleshooting · 13 Doc examples not to copy · 14 Reference client

## 1. Core facts (most bugs come from missing one of these)

- **Base URL** `https://graph.threads.net/v1.0/` (`graph.threads.com` is equivalent). Include `v1.0` on every Graph call; only the token endpoints in §8 are documented without it. `me` can stand in for `{threads-user-id}`.
- **Auth**: send `access_token` (query string for GET/DELETE, form body for POST). These are Threads user tokens from the Threads OAuth flow (§8), not Facebook or Instagram tokens. A Meta app has two ID/secret pairs; use the **Threads app ID / Threads app secret**.
- **Media goes by URL.** There is no upload endpoint: `image_url` / `video_url` must be publicly downloadable when Meta fetches them. Local files must be hosted first *(practice: S3/GCS/R2/CDN; if signed, keep the URL valid until processing finishes)*.
- **Publishing is two steps**: create a container (`POST /me/threads`), then publish it (`POST /me/threads_publish` with `creation_id`). Only text posts can skip step 2, via `auto_publish_text=true`. Containers not published within 24 h expire.
- **Container ID ≠ media ID.** Step 1 returns a container ID (used only for status checks and publishing); step 2 returns the media ID used for everything afterwards (permalink, insights, replies, delete).
- **No native scheduling.** To post later, the app runs the calls itself and should enforce the 250-posts/24 h quota itself *(practice: create the container shortly before publishing, since containers expire)*.
- **Write and read enums differ** — never compare one against the other:

| | When creating | When reading |
|---|---|---|
| post type | `media_type`: `TEXT`, `IMAGE`, `VIDEO`, `CAROUSEL` | `media_type`: `TEXT_POST`, `IMAGE`, `VIDEO`, `CAROUSEL_ALBUM`, `AUDIO`, `REPOST_FACADE` (poll and GIF posts read back as `TEXT_POST`) |
| who can reply | `reply_control`: `everyone`, `accounts_you_follow`, `mentioned_only`, `parent_post_author_only`, `followers_only` | `reply_audience`: the same values in UPPER_CASE |

  Keyword search's `media_type` filter takes `TEXT`, `IMAGE`, `VIDEO`.
- **Parameter encoding**: `poll_attachment`, `text_entities`, `text_attachment` and `gif_attachment` are JSON strings inside the form/query; `children` and `allowlisted_country_codes` are comma-separated; booleans are `true`/`false`.
- **Errors**: the docs only show the flat shape from the code exchange, `{"error_type": "OAuthException", "code": 400, "error_message": "…"}`. Live Graph calls return the standard Meta envelope `{"error": {"message", "type", "code", "fbtrace_id"}}`, where `code: 190` ("Invalid OAuth 2.0 Access Token") means a bad or expired token *(observed from the live API; not in this doc set)*. Parse both; log `fbtrace_id`, never the token.

## 2. Build mode — writing or fixing code

1. **Match the project.** Look for `package.json`/`tsconfig.json` (Node/TS: built-in `fetch` on Node 18+, or the project's HTTP client), `pyproject.toml`/`requirements.txt` (Python: the project's `requests`/`httpx`/`aiohttp`), `*.csproj` (C#: `HttpClient`), `go.mod`, and follow the existing style (sync vs async, config, logging). With no project and no stated stack, use Python with `requests`.
2. **Put the rules in the code, not in comments:**
   - Config from the environment or a secret store (`THREADS_ACCESS_TOKEN`; `THREADS_APP_ID`/`THREADS_APP_SECRET` for OAuth). The app secret stays server-side.
   - One request helper that adds the token, encodes params per §1, raises a typed error carrying `code`/`type`/`message`/`fbtrace_id`, and never logs the token.
   - Publish = create → poll status until `FINISHED` (handle `ERROR` with its `error_message`, `EXPIRED`, and a timeout) → publish → fetch `?fields=permalink` (§4.5). Keep that last lookup to `permalink`: fields such as `reply_audience` need extra permissions (`threads_read_replies`), and a failed lookup after a successful publish makes a good post look like a failure.
   - Validate inputs locally (§4.3–4.4) before spending quota; check `threads_publishing_limit` before batch or scheduled posting.
   - Paginate with `paging.cursors.after`, and `limit` ≤ 100 where the endpoint takes it (§5).
   - Don't blindly retry 4xx errors; back off on rate-limit errors.
3. **Port the logic of the reference client (§14)** rather than improvising the flow.
4. **Deliver** runnable files plus a line or two on configuring and running them. Size the work to the request: when the user asks for a function or module, give them that with the helpers it needs and a short usage example. Check it against a quick mock if that helps, but don't ship a large test suite, CLI or extra tooling nobody asked for; mention worthwhile extras in a sentence instead. Raise a gotcha only where the code handles it or the user's request runs into it.
5. **Reviewing or debugging**: check §1 and §12–13 first. Usual culprits: write/read enum mix-ups, no publish step, publishing before `FINISHED`, non-public media URLs, the Facebook app ID/secret instead of the Threads pair, a missing permission or tester role, JSON params sent unencoded, `curl -F` on a GET.

Official extras: sample app https://github.com/fbsamples/threads_api, Postman collection https://www.postman.com/meta/threads/overview (may lag the docs).

## 3. Operate mode — acting on the user's account

Publishing, replying, reposting, deleting and hiding replies change a real, public account; deletes are permanent and limited to 100/day. Work through these steps in order:

1. **Find the token.** Check `THREADS_ACCESS_TOKEN` in the environment, then a `.env` in the working/project folder. If neither exists, say so and ask the user to set it (or paste it, if they prefer). If they say it's already set but your shell can't see it, it most likely lives on their own machine: run the client there if you can reach that machine, otherwise hand over the command (step 7). Never echo the token, write it into chat, scripts or commits — pass it through the environment of the command that needs it. No token yet → walk them through §8.2–8.3.
2. **Verify** with `GET /me?fields=id,username` before anything else, and tell the user which account you're about to act on. `code 190` → expired or invalid (§8.4).
3. **Validate** the request against §4.3–4.4 (length, link count, feature compatibility, poll limits, media types). If it can't be done as asked, explain the conflict and offer the closest valid alternatives; never silently drop or change a requested feature. Then check the request against what the user is trying to achieve, and mention anything that would undercut it: timing (when the post goes up, and when a ghost post or poll will be gone, relative to what it promotes), links that look like placeholders or test hosts, a poll whose question isn't in the text (polls have no question field), or a link the user expects to show as a preview card on a media post.
4. **Confirm before anything public or destructive.** Show exactly what will be sent, in the reply itself rather than only in a file: account, final text verbatim, media URLs, every parameter (e.g. `is_ghost_post=true`, `poll_attachment={…}`) and the counted length. Then wait for an explicit yes. "Just post it" approves exactly the content the user gave; it doesn't cover anything you had to change or choose for them. Read-only calls (profile, posts, insights, quotas) need no confirmation.
5. **Execute** with the reference client (§14): save it to a scratch file and run it where the token is available (the user's machine if the token lives there). Run `check spec.json` before `publish spec.json`.
6. **Report** the media ID and permalink, or the exact error, what it means and the fix (§12). Never retry a failed publish blindly. The client logs each container ID to stderr; check it with `get <container-id> fields=status,error_message`. `PUBLISHED` means it already went out; `FINISHED` means publish that same container (`post me/threads_publish creation_id=<container-id>`) instead of creating a new one.
7. If the API host can't be reached from your shell (proxy or DNS errors), say so and hand over the ready-to-run spec, command and token setup (PowerShell: `$env:THREADS_ACCESS_TOKEN="..."`; bash: `export THREADS_ACCESS_TOKEN=...`) instead of trying other routes.

## 4. Publishing

### 4.1 Flows

- **Text / image / video**: `POST /me/threads` with `media_type` + `text` / `image_url` / `video_url` + options → wait for `FINISHED` (§4.5) → `POST /me/threads_publish` with `creation_id=<container id>` → `{"id": "<media id>"}`.
- **Text in one call**: add `auto_publish_text=true` (TEXT only). The docs don't show what this call returns, so when you need the permalink afterwards, use the two-step flow or read the newest item of `/me/threads`.
- **Carousel** (2–20 images/videos, mixing allowed; counts as one post): create each item with `media_type=IMAGE|VIDEO`, `is_carousel_item=true`, its URL and optional `alt_text` → *(practice)* wait until every item is `FINISHED`, videos especially → create the parent with `media_type=CAROUSEL`, `children=<id1>,<id2>,…` plus the post-level fields (`text`, `reply_control`, `topic_tag`, spoilers, …) → publish the parent.
- **Reply**: a normal container plus `reply_to_id=<media id>` → publish. Needs `threads_content_publish` + `threads_manage_replies`, and either owning the root post or holding `threads_keyword_search` / `threads_manage_mentions` (which lets you answer public posts found via search or mentions). 1,000 replies/24 h. *(practice: for long text, chain replies under your own post.)*
- **Quote**: a normal container plus `quote_post_id=<media id>`.
- **Repost**: `POST /{media-id}/repost` (no container) → `{"id": "<repost id>"}`; reposts read back as `REPOST_FACADE` with `reposted_post`.
- **Delete**: `DELETE /{media-id}` → `{"success": true, "deleted_id": "…"}`. Own posts only, needs `threads_delete`, 100 deletes/24 h, permanent.
- If the user enabled fediverse sharing, eligible API posts are shared to the fediverse too.

### 4.2 Container parameters (`POST /{user}/threads`)

| Param | Works with | Notes |
|---|---|---|
| `media_type` | all | `TEXT`, `IMAGE`, `VIDEO`, `CAROUSEL`; always send it, carousel items included |
| `text` | all | Required for TEXT; 500-char limit (§4.4) |
| `image_url` / `video_url` | IMAGE / VIDEO | Public URL |
| `is_carousel_item` | carousel items | `true` |
| `children` | CAROUSEL | Comma-separated item container IDs, 2–20 |
| `reply_to_id` | any | Media ID being answered |
| `quote_post_id` | any | Media ID being quoted |
| `reply_control` | any | `everyone`, `accounts_you_follow`, `mentioned_only`, `parent_post_author_only`, `followers_only` |
| `enable_reply_approvals` | not ghost posts | Replies wait for approval (§6) |
| `topic_tag` | any | 1–50 chars, no `.` or `&`; one topic per post; preferred over an in-text `#tag` |
| `link_attachment` | TEXT only | URL shown as a preview card. Without it, the first URL in a text-only post becomes the card |
| `poll_attachment` | TEXT only | `{"option_a":"…","option_b":"…","option_c":"…","option_d":"…"}`: a and b required, c and d optional, each 1–25 chars. There's no poll-duration parameter; read `expiration_timestamp` |
| `gif_attachment` | TEXT only | `{"gif_id":"<GIPHY id>","provider":"GIPHY"}`. GIPHY only (Tenor support ended 2026-03-31) |
| `text_attachment` | TEXT only | `{"plaintext": "≤10,000 chars", "link_attachment_url": "…", "text_with_styling_info": [{"offset":0,"length":7,"styling_info":["bold","italic"]}]}`; styles `bold`, `italic`, `highlight`, `underline`, `strikethrough`, ranges must not overlap. Not with a poll; no `link_attachment_url` if the post has `link_attachment` |
| `text_entities` | text spoilers | `[{"entity_type":"SPOILER","offset":0,"length":5}]`, ≤10 entities *(practice: the docs don't define the offset unit; test with emoji or CJK text)* |
| `is_spoiler_media` | IMAGE, VIDEO, CAROUSEL | On a carousel, set it on the parent; it covers every item |
| `alt_text` | IMAGE, VIDEO (incl. carousel items) | ≤1,000 chars; not for TEXT |
| `is_ghost_post` | TEXT only | Auto-archives after 24 h. Can't be a reply, and reply approvals can't be enabled. Beyond that the docs only say text spoilers are the one supported feature, so expect polls, GIFs, link/text attachments and quotes not to work, and don't count on location, geo-gating, topic tags or cross-sharing either. The docs don't say whether the API rejects these with an error or silently drops them, nor whether a URL typed into the text gets a preview card; say that rather than promising either outcome |
| `allowlisted_country_codes` | any | ISO 3166-1 alpha-2, comma-separated (`US,CA`); only when `GET /me?fields=is_eligible_for_geo_gating` is true. The author always sees the post |
| `location_id` | any | From `GET /location_search` (§5); needs `threads_location_tagging` |
| `crossreshare_to_ig` / `crossreshare_to_ig_dark_mode` | any | Also shares to the linked Instagram account as a Story; needs `threads_share_to_instagram`. The docs' text puts `crossreshare_to_ig_status` (`SUCCESS`/`FAILED`) on the publish response, their example on the container response, so check both. The Threads post goes out either way |
| `auto_publish_text` | TEXT only | Publish without step 2 |

### 4.3 Compatibility traps

- TEXT-only features (link card, poll, GIF, text attachment, ghost post, auto-publish) can't be combined with image, video or carousel posts. A URL typed into the text of a media post stays plain text: it still counts toward the link limit but gets no preview card.
- Ghost posts: TEXT only, never a reply, no reply approvals; per the docs, text spoilers are the only supported feature. If the user wants a poll, link card, GIF, text attachment or quote on a disappearing post, explain that the docs don't support it (they don't say whether the API errors out or silently drops it) and offer the alternatives (ghost post without it, or a regular post with it).
- Polls: TEXT only and never together with a text attachment.
- Links: at most 5 unique URLs per post, counting URLs in `text` plus `link_attachment` / `text_attachment.link_attachment_url` when different. More fails at container creation with `THREADS_API__LINK_LIMIT_EXCEEDED`.
- In-text tags (legacy): the first valid `#tag` wins; it ends at whitespace, `.`, `&`, `@`, `!`, `?`, `,`, `;` or `:`; `#1` (digits only) isn't a tag.
- Media spoilers need IMAGE, VIDEO or CAROUSEL; text spoilers go in `text_entities`.

### 4.4 Limits and media specs

- Text 500 chars, with emojis counted as their UTF-8 byte length (most emoji 4, ☕️ 6). Text attachment 10,000; alt text 1,000; topic tag 50; poll option 25.
- Carousel 2–20 items. 250 published posts per profile per 24 h (a carousel counts once).
- **Images**: JPEG or PNG, ≤ 8 MB, aspect ratio ≤ 10:1, width 320–1440 px (scaled into range), sRGB (others converted).
- **Videos**: MOV or MP4 with no edit lists and the moov atom at the front; H.264 or HEVC, progressive, closed GOP, 4:2:0; 23–60 fps; ≤ 1920 px wide; aspect 0.01:1–10:1 (9:16 recommended); ≤ 100 Mbps VBR; AAC ≤ 48 kHz, mono or stereo, 128 kbps; > 0 and ≤ 300 s; ≤ 1 GB.
  *(practice)* Conform a file with `ffmpeg -i in.mov -vf "scale='min(1920,iw)':-2" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -ar 48000 -ac 2 -b:a 128k -movflags +faststart -use_editlist 0 out.mp4` (without `-use_editlist 0`, ffmpeg writes edit lists).

### 4.5 Container status

`GET /{container-id}?fields=status,error_message` → `IN_PROGRESS`, `FINISHED`, `ERROR`, `EXPIRED` (not published within 24 h) or `PUBLISHED`.
`error_message` values: `FAILED_DOWNLOADING_VIDEO`, `FAILED_PROCESSING_AUDIO`, `FAILED_PROCESSING_VIDEO`, `INVALID_ASPEC_RATIO` (sic; match it exactly), `INVALID_BIT_RATE`, `INVALID_DURATION`, `INVALID_FRAME_RATE`, `INVALID_AUDIO_CHANNELS`, `INVALID_AUDIO_CHANNEL_LAYOUT`, `UNKNOWN`.
The docs put average processing at about 30 s and recommend polling about once a minute for at most 5 minutes *(practice: text and images are usually ready within seconds, so check early and back off; give videos the whole window)*. If `threads_publish` returns no media ID, check the status instead of creating another container.

## 5. Reading and search

- **Profile**: `GET /me?fields=id,username,name,threads_profile_picture_url,threads_biography,is_verified` (also `is_eligible_for_geo_gating`, `recently_searched_keywords`). Only the token's own user.
- **Own posts**: `GET /me/threads?fields=…&since=…&until=…&limit=…` returns top-level posts only (replies: §6). Fields: `id, media_product_type, media_type, media_url, permalink, owner, username, text, timestamp, shortcode, thumbnail_url, children, is_quote_post, quoted_post, reposted_post, alt_text, link_attachment_url, gif_url, poll_attachment, topic_tag, is_spoiler_media, text_entities, text_attachment, has_replies, reply_audience, is_verified, profile_picture_url, location_id`. Nested objects need sub-field syntax: `poll_attachment{option_a,option_b,option_c,option_d,option_a_votes_percentage,option_b_votes_percentage,option_c_votes_percentage,option_d_votes_percentage,total_votes,expiration_timestamp}`, `location{id,name,address,city,country,latitude,longitude,postal_code}`. `permalink` is omitted for copyright-flagged media; `owner` appears only on your own top-level posts.
- **One post**: `GET /{media-id}?fields=…`. Until `threads_basic` has advanced access, only posts by Threads testers are readable.
- **Ghost posts**: `GET /me/ghost_posts` (`ghost_post_status` `ACTIVE`/`ARCHIVED`, `ghost_post_expiration_timestamp`).
- **Mentions**: `GET /me/mentions?fields=…` needs `threads_manage_mentions`; posts by private accounts are excluded.
- **Public profiles** (`threads_profile_discovery`): `GET /profile_lookup?username=<exact, no @>` → `username, name, profile_picture_url, biography, follower_count, likes_count, quotes_count, reposts_count, views_count, is_verified` (`follower_count` is the current total; the likes, quotes, reposts and views counts cover the past 7 days); `GET /profile_posts?username=…&fields=…` takes the own-posts fields minus `owner`. Only public profiles with ≥ 100 followers. Each endpoint's page lists 1,000 requests per rolling 24 h without saying whether the two share one quota *(practice: budget as if they do)*. With standard access only some official Meta accounts can be reached, including @meta, @threads, @instagram and @facebook.
- **Keyword / topic search** (`threads_keyword_search`): `GET /keyword_search?q=…` with optional `search_type=TOP|RECENT`, `search_mode=KEYWORD|TAG` (TAG = topic-tag search), `media_type=TEXT|IMAGE|VIDEO`, `author_username=<exact, no @>`, `since`, `until`, `limit`, `fields` (no `owner`). 2,200 queries per user per 24 h across all apps; queries with no results don't count; sensitive keywords return `[]`. The docs' search examples show `media_type: "TEXT"` in results where other endpoints return `TEXT_POST`, so accept both. Recent queries: `GET /me?fields=recently_searched_keywords`.
- **Locations** (`threads_location_tagging`): `GET /location_search?q=…` or `?latitude=…&longitude=…` (both together; can combine with the query), `fields=id,name,address,city,country,latitude,longitude,postal_code`; not paginated; 500 searches/24 h. One location: `GET /{location-id}?fields=…`.
- **Paging and filters**: `/threads`, `/replies`, `/mentions`, `/ghost_posts` and `/profile_posts` take `since`/`until` (Unix timestamp or a strtotime-style date; ≥ `1688540400`; `until` ≤ now), `limit` (default 25, max 100) and `before`/`after` cursors (never both). `/{media-id}/replies`, `/conversation` and `/pending_replies` take only `reverse` and `before`/`after` (plus `approval_status` on pending replies). `keyword_search` takes `since`/`until`/`limit` but documents no cursors. List responses carry `paging.cursors.before/after`, and the docs say they include no `next`/`previous` URLs, so build the next request yourself with `after=<cursor>` and stop when there's no `after` or `data` comes back empty *(practice: if a `paging.next` URL does show up, following it is fine, but code that depends on it stops after the first page)*.

## 6. Replies and moderation

- **Read** (`threads_read_replies`): `GET /{media-id}/replies` (direct replies only; recurse where `has_replies` is true) or `GET /{media-id}/conversation` (all depths, flattened; call it on root posts). `reverse` defaults to `true` (newest first). Extra fields: `root_post`, `replied_to`, `is_reply`, `is_reply_owned_by_me`, `hide_status` (`NOT_HUSHED`, `UNHUSHED`, `HIDDEN`, `COVERED`, `BLOCKED`, `RESTRICTED`), `reply_audience`; `username`/`permalink` only for public users and yourself; `is_verified`/`profile_picture_url` only on direct replies. The user's own replies: `GET /me/replies`.
- **Hide/unhide** (`threads_manage_replies`): `POST /{reply-id}/manage_reply` with `hide=true|false`. It works on top-level replies only, and hiding one hides its whole branch. A nested reply can't be hidden on its own: the only lever is hiding its top-level ancestor, which takes the ancestor and its other replies with it, so surface that trade-off rather than calling `manage_reply` on the nested ID. Only replies on the user's own posts can be moderated.
- **Near-real-time moderation**: the `replies` webhook (§10) avoids polling; polling `/{media-id}/replies` also works within the app-level rate limit (§9).
- **Who can reply**: `reply_control` at creation (§4.2).
- **Reply approvals**: create with `enable_reply_approvals=true`; list with `GET /{media-id}/pending_replies` (`approval_status=pending|ignored`, case-sensitive, default both; field `reply_approval_status`); decide with `POST /{reply-id}/manage_pending_reply` and `approve=true|false` (ignored replies can still be approved later).

## 7. Insights (`threads_manage_insights`)

**Per post**: `GET /{media-id}/insights?metric=views,likes,replies,reposts,quotes,shares` → `data[]` of `{name, period: "lifetime", values: [{value}], title, description, id}`. Values are lifetime totals *(practice: for daily numbers, store a snapshot each day and take differences)*. On a root post `replies` counts all replies, on a reply only direct ones; metrics of nested replies aren't included. Reposts (`REPOST_FACADE`) return an empty list. `views` and `shares` are labelled "in development".

**Per account**: `GET /me/threads_insights?metric=…&since=<unix>&until=<unix>`

| Metric | Response shape | Notes |
|---|---|---|
| `views` | time series `values: [{value, end_time}]` | profile views |
| `likes`, `replies`, `reposts`, `quotes` | `total_value: {value}` | `replies` counts top-level replies |
| `clicks` | `link_total_values: [{value, link_url}]` | clicks on shared links |
| `followers_count` | `total_value: {value}` | no `since`/`until` |
| `follower_demographics` | "Total Value" per the docs, but the per-breakdown structure isn't shown; log the raw JSON first and parse defensively | needs `breakdown=country`, `city`, `age` or `gender` (exactly one per call); ≥ 100 followers; no `since`/`until` |

Here `since`/`until` must be Unix timestamps ≥ `1712991600` (2024-04-13); the default range is yesterday → today; data before 2024-06-01 isn't guaranteed. *(practice, not a documented rule: since those two metrics don't support `since`/`until` and demographics takes one `breakdown` per call, the simplest setup is one call for `followers_count` and one per breakdown, separate from the date-ranged metrics.)*

## 8. Auth, permissions, app review

### 8.1 Permissions

| Permission | Needed for |
|---|---|
| `threads_basic` | every endpoint (always required) |
| `threads_content_publish` | creating/publishing posts and replies; the post and reply fields of `threads_publishing_limit` |
| `threads_manage_replies` | POST reply endpoints (publishing replies, `manage_reply`, `manage_pending_reply`) |
| `threads_read_replies` | GET replies, conversation, pending replies; reading the `reply_audience` field; reply webhooks |
| `threads_manage_insights` | insights |
| `threads_delete` | deleting posts; delete webhooks |
| `threads_keyword_search` | keyword/topic search (and replying to posts found that way) |
| `threads_manage_mentions` | mentions endpoint and webhooks (and replying to mentions) |
| `threads_location_tagging` | `location_search`, `location_id` |
| `threads_profile_discovery` | `profile_lookup`, `profile_posts` |
| `threads_share_to_instagram` | `crossreshare_to_ig*` |

### 8.2 Before App Review

- Create the app with the **Access the Threads API** use case; add permissions under Use cases → Customize. Settings holds the Threads app ID/secret, valid OAuth redirect URIs, and the deauthorize and data-deletion callback URLs.
- Test with **Threads Testers**: App roles → Roles → Add People → Threads Tester; the person accepts under Threads → Settings → Account → Website permissions. Testers can grant every permission; test tokens can come from the Graph API Explorer or the OAuth flow.
- Until a permission is approved (App Review, app published): publishing works only for your own and tester accounts; `GET /{media-id}` only reads testers' posts; keyword search only finds the user's own posts; location search only answers the query "Menlo Park"; mentions only come from testers; profile discovery only reaches some official Meta accounts (including @meta, @threads, @instagram, @facebook).

### 8.3 OAuth flow

1. Send the user to `https://threads.com/oauth/authorize?client_id=<THREADS_APP_ID>&redirect_uri=<registered URI>&scope=threads_basic,threads_content_publish,…&response_type=code&state=<csrf>` (on Android open it in a browser or webview, not the app).
2. The callback receives `?code=…#_`; strip the trailing `#_`. Codes last 1 h and work once. A denial returns `error=access_denied&error_reason=user_denied`.
3. Exchange it server-side: `POST https://graph.threads.net/oauth/access_token` (the docs show `graph.threads.com`; both work) with `client_id`, `client_secret`, `code`, `grant_type=authorization_code`, `redirect_uri` (identical to step 1, and the dashboard may have added a trailing slash) → `{access_token, token_type: "bearer", user_id}`, valid 1 h.
4. Long-lived: `GET https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=…&access_token=<short-lived>` → `{access_token, token_type, expires_in}` (about 60 days). The short-lived token must still be valid; server-side only.

### 8.4 Keeping tokens alive

- Refresh: `GET https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=<long-lived>` → a new 60-day token. Allowed once the token is ≥ 24 h old, and only while it's unexpired; an expired token can't be refreshed, so the user must authorize again.
- *(practice)* Refresh on a schedule well before expiry (e.g. when < 10 days remain, or weekly), store the new token and its expiry (from `expires_in`) atomically, and alert a human when a refresh fails.
- Permission grants last 90 days. Refreshing a long-lived token extends the grant for public profiles; for private profiles the grant can't be extended (their tokens still refresh), so those users must authorize again every 90 days. Read `data_access_expires_at` from `debug_token` and prompt re-authorization before it passes.
- Inspect a token: `GET /v1.0/debug_token?access_token=<a Threads tester's token for the same app>&input_token=<token>` → `data{type, application, is_valid, issued_at, expires_at, data_access_expires_at, scopes[], user_id}`. `scopes` lists what the user granted, not whether App Review approved those permissions; check approval in the App Dashboard.
- App token (server-side, for app-level calls): `GET https://graph.threads.net/oauth/access_token?client_id=…&client_secret=…&grant_type=client_credentials` → `"TH|<APP_ID>|…"`, or pass `TH|<APP_ID>|<APP_SECRET>` directly as `access_token`.

## 9. Quotas and rate limits

Per profile, rolling 24 h: **250 posts** (enforced at `threads_publish`), **1,000 replies**, **100 deletes**, **500 location searches**; keyword search 2,200 queries; `profile_lookup` and `profile_posts` 1,000 requests each per their pages (whether shared isn't stated). oEmbed: 1,000 requests/hour (loading embeds on a page has no documented limit; see §11.3).

`GET /me/threads_publishing_limit?fields=quota_usage,config,reply_quota_usage,reply_config,delete_quota_usage,delete_config,location_search_quota_usage,location_search_config` → `data[0]` holds each `*_usage` plus a `{quota_total, quota_duration: 86400}` config. Permissions depend on the fields: post fields need `threads_basic` + `threads_content_publish`; reply fields add `threads_manage_replies`; delete fields need `threads_basic` + `threads_delete`; location-search fields need `threads_basic` + `threads_location_tagging`.

App-level, per app–user pair, rolling 24 h: calls ≤ 4800 × impressions (impressions count as at least 10); CPU time ≤ 720000 × impressions; total time ≤ 2880000 × impressions.

## 10. Webhooks

- Setup: Use cases → Customize → Settings → add **Get real-time notifications with Threads Webhooks**; set the callback URL and verify token; subscribe to fields.
- Fields: `replies` (topic `moderate`; `threads_read_replies`), `delete` (`moderate`; `threads_delete`), `mentions` (`interaction`; `threads_manage_mentions`, plus `threads_read_replies` for `has_replies`/`is_reply`/`replied_to`/`root_post`), `publish` (`interaction`; also fires for the user's replies).
- Delivery requires the app in Live mode (Advanced Access for tech providers), a verified business, and the user's granted permissions; replies and mentions only fire on media owned by non-private accounts; delete and publish fire for public accounts or private ones that authorized the app. The docs conflict on App Review: the webhooks page says Advanced Access is needed to get notifications for all fields, the app-setup page says App Review isn't required — if a Live app gets no events, check Advanced Access next.
- Payload (flat, not the `entry[].changes[]` shape of other Meta webhooks): `{"app_id","topic","target_id","time","subscription_id","has_uid_field","values":{"value":{…media fields…},"field":"replies|mentions|delete|publish"}}`. `target_id` is the media ID for `replies` and `delete`, but the mentioned user's ID for `mentions`. Delete payloads carry `deleted_at`.
- *(general Meta webhooks behavior, outside this doc set)* Answer the GET verification by echoing `hub.challenge` when `hub.verify_token` matches; verify each POST's `X-Hub-Signature-256` (HMAC-SHA256 of the raw body with the app secret); return 200 quickly and process asynchronously.
- *(practice)* The same event can arrive more than once: make processing idempotent, keyed on `values.field` plus the media ID (`values.value.id`; for `replies` and `delete` that's also `target_id`), not on a hash of the raw body, since a redelivery isn't guaranteed to be byte-identical.

## 11. Embedding posts, oEmbed and Web Intents

### 11.1 Getting the embed HTML

- **oEmbed**: `GET https://graph.threads.net/v1.0/oembed?url=<URL-encoded post URL>&maxwidth=<320–658>` → `{type: "rich", version: "1.0", html, provider_name, provider_url, width}`. Works for text, image, video and carousel posts, but not for posts from private, inactive or age-restricted accounts or geo-gated posts. 1,000 requests/hour. There's no `maxheight`: the embed is responsive, so its height follows the width and the content. Documented URL forms: `https://www.threads.com/@{username}/post/{shortcode}` and `https://www.threads.com/t/{shortcode}` *(observed 2026-10: `threads.net` hosts, trailing slashes and query strings are accepted too)*.
- **Token**: none since 2026-03-03, per the changelog *(observed 2026-10: token-less calls succeed)*. The App Access Tokens page still says oEmbed needs an app token; if a token-less call is ever refused, call it server-side with one (§8.4), never from browser code.
- **Errors** *(observed 2026-10)*:
  - Missing or non-embeddable post → HTTP 400, `code 24`, `error_subcode 4279056` ("Media Not Found", `is_transient: false`).
  - Not a Threads post URL → 400, `code 100`, subcode `2207047`.
  - `maxwidth` outside 320–658 → HTTP **500**, `code 100` ("Param maxwidth must be…"). It's a validation error, so don't retry it.
- **By hand**: on threads.com, open the post's share menu and choose **Get embed code**. The link text is in the viewer's UI language; oEmbed's is English.
- **Terms**: the HTML, content and metadata may only be used to show the post. The docs rule out consuming, manipulating, extracting or persisting them for anything else, analytics included. *(practice: keep the permalink as your record and fetch the HTML when you render or build the page; don't derive search indexes, stats or datasets from it. Scraping threads.com pages instead is outside the API, and Meta's terms restrict automated collection.)*

### 11.2 How the embed renders

Everything in this subsection was observed in embed.js in 2026-10. It's undocumented and may change.

- **Markup**: the HTML is `<blockquote class="text-post-media" data-text-post-permalink="<permalink>" data-text-post-version="0" id="ig-tp-<shortcode>">` around a plain "View on Threads" link, then `<script async src="https://www.threads.com/embed.js">`.
- **Lifecycle**:
  - embed.js turns each `blockquote.text-post-media` into an iframe of `<permalink minus query>/embed/<query>`, inserted before the blockquote at height 0.
  - It loads **at most 3 at a time**. A slot frees when an iframe reports its height or after 10 s.
  - The height arrives as a bare number via `postMessage` from `https://www.threads.com`. embed.js then sizes the iframe and removes the blockquote.
  - An embed that never reports keeps a 0-px iframe, and the blockquote's link stays visible as the fallback.
- **Dynamic pages**: `window.instgrm.Embeds.process()` re-scans the page for new blockquotes. A `<script>` inserted through `innerHTML` never runs, so in SPAs or after adding posts dynamically, load embed.js once and call `window.instgrm?.Embeds?.process()` after each insert. embed.js only needs `<blockquote class="text-post-media" data-text-post-permalink="<permalink>">` with a fallback link inside. *(practice: when the HTML is stored or comes from elsewhere, build that markup with DOM methods from a validated threads.com URL instead of injecting stored HTML through `innerHTML`, which is an XSS risk.)*
- **Theme**: `data-theme="dark"` or `"auto"` on the blockquote adds `?theme=…` to the iframe URL and makes its background transparent.
- **Raw iframe**: don't iframe the permalink itself, because post pages send `X-Frame-Options: DENY`. Where scripts can't load (a strict CSP, Chrome extension pages), iframe `<permalink>/embed/` directly and set its height from that `postMessage`. Check `event.origin`, and match `event.source` to the iframe's `contentWindow`.
- **Site policies**: allow `https://www.threads.com` in `script-src` and `frame-src`. The iframe's host follows the permalink, so old `threads.net` links produce `www.threads.net` iframes: either rewrite them to `www.threads.com` or allow both hosts. The embed page sends `Cross-Origin-Resource-Policy: same-origin`, so a page with `Cross-Origin-Embedder-Policy: require-corp` can't show it.

### 11.3 Pages with many embeds

These are *(practice)* items from a production gallery of hundreds of posts.

- **The problem**: even with embed.js's 3-at-a-time cap, loading dozens of embeds in a row gets rate-limited (HTTP 429), and the remaining posts stay as plain links. Meta documents no limit for these loads; the oEmbed quota covers API calls only.
- **Pacing**:
  - Show about 10 per page, or only process cards near the viewport.
  - Render the blockquotes without the `text-post-media` class (mark them, e.g. `data-embed-pending`).
  - Add the class to one blockquote at a time and call `instgrm.Embeds.process()`.
  - Wait until that embed finishes or times out, then a few seconds more before the next (that gallery uses ≥ 3.6 s).
  - Remove the class from an embed that failed, or the next `process()` call picks it up again.
- **Detecting failure**: the page can't see a cross-origin iframe's HTTP status, and fetch/XHR wrappers never see these loads, so judge by outcome.
  - Success means the blockquote was removed and the iframe is taller than ~120 px within ~12 s.
  - After a few failures in a row, assume a rate limit: pause (that gallery uses 60 s × 1.5ⁿ, capped at 5 min), then resume more slowly.
  - Hidden tabs throttle timers and layout, so don't mark an embed failed while `document.hidden`; re-check once the tab is visible.
- **Fallback card**: for a failed embed, link to the post (allow only threads.com/threads.net URLs) and list the likely causes: deleted post; private, inactive or age-restricted account; geo-gating; rate limiting; a content or tracking blocker.
- **Is a saved post still there?** Ask oEmbed (≤ 1,000/hour) rather than loading threads.com pages. `code 24` means it can no longer be embedded; treat other errors as transient and retry later.

### 11.4 Web Intents

- **Web Intents** (no app or token): `https://www.threads.com/intent/post?text=…&url=…&tag=…&reply_control=everyone|accounts_you_follow|mentioned_only|followers_only&reply_post_shortcode=…&quote_post_shortcode=…` and `https://www.threads.com/intent/follow?username=…`; percent-encode values. The right tool for "share to Threads" buttons, where visitors post from their own accounts.

## 12. Troubleshooting

| Symptom | Cause → fix |
|---|---|
| `code 190` / "Invalid OAuth 2.0 Access Token" | Expired, malformed or non-Threads token → refresh or re-authorize; inspect with `debug_token` |
| "Matching code was not found or was already used" | Code reused, older than 1 h, or `#_` left on → restart authorization |
| Code exchange rejects `redirect_uri` | Not identical to the authorize step and dashboard entry (watch trailing slashes) |
| OAuth fails although the app ID looks right | Facebook app ID/secret used instead of the Threads pair |
| Permission errors or unexpectedly empty results | Scope not requested/granted, account not a Threads Tester, or permission not approved yet (§8.2) |
| Container `ERROR` + `FAILED_DOWNLOADING_VIDEO`, or an image never processes | Media URL not publicly downloadable (auth, expired signature, blocked host) |
| `INVALID_*` video errors | File outside the spec → transcode (§4.4) |
| `EXPIRED` | Container older than 24 h → create a new one |
| Publish returns no media ID | Still processing → poll the status; don't create a duplicate |
| `THREADS_API__LINK_LIMIT_EXCEEDED` | More than 5 unique links |
| `THREADS_API__FEATURE_NOT_AVAILABLE` | The account lacks the feature (e.g. geo-gating) |
| `THREADS_API__GEO_GATING_INVALID_COUNTRY_CODES` | Unsupported country code → ISO 3166-1 alpha-2 |
| Keyword search finds only own posts / location search only "Menlo Park" | Permission not approved yet |
| `profile_lookup` fails | Private account, < 100 followers, inexact username, or standard access only |
| A post's insights are empty | It's a repost (`REPOST_FACADE`) |
| `follower_demographics` errors | Missing or multiple `breakdown`, `since`/`until` sent, or < 100 followers |
| Quota errors | Check `threads_publishing_limit`; spread posts out |
| No webhooks arrive | App not Live / no Advanced Access, business unverified, permission missing, or private account |
| Embed stays a plain "View on Threads" link | Post not embeddable (oEmbed `code 24`); embed.js never ran (inserted via `innerHTML` → call `instgrm.Embeds.process()`); blocked by CSP, COEP or a content blocker; rate-limited after many embeds (§11.2–11.3) |
| "Refused to display … X-Frame-Options 'deny'" | Iframing the post page → use embed.js or `<permalink>/embed/` |
| oEmbed HTTP 500, `code 100`, "Param maxwidth…" | `maxwidth` outside 320–658 |

## 13. Doc examples not to copy verbatim

Several official examples are broken; write correct requests instead:
- `curl -X GET -F …` (keyword search, insights) sends a multipart body. For GET use `curl -G --data-urlencode 'q=…' …`.
- Missing `?` before `access_token` (Polls and Location retrieval examples); unbalanced quotes inside `-d` values (Ghost Posts, GIF, Links examples); `access_tokens=` (should be `access_token`) in the app-credential shortcut; `acceess_denied` (the real value is `access_denied`).
- The carousel-item example omits `media_type`, which the parameter table requires.
- Some examples omit `/v1.0` (mentions, pagination); include it.
- JSON params appear unescaped inside shell quotes; JSON-encode them (`json.dumps`, `JSON.stringify`) and URL-encode the form.
- oEmbed: the example has a stray backslash and an un-encoded post URL; use `curl -G --data-urlencode "url=<post URL>" https://graph.threads.net/v1.0/oembed`.
- Location search: the guide uses `q`, the reference lists `query`. Send `q`; if results ignore the query, try `query`.

## 14. Reference client (Python 3.8+, standard library only)

Run it directly in operate mode and port its logic in build mode. Save as `threads_client.py`:

```python
#!/usr/bin/env python3
"""Minimal Threads API client: Python 3.8+, standard library only.

Token: THREADS_ACCESS_TOKEN env var, or a .env file in the current folder.
  python3 threads_client.py get me fields=id,username
  python3 threads_client.py get me/threads fields=id,text,permalink,timestamp limit=5
  python3 threads_client.py check spec.json     # local validation only, no API call
  python3 threads_client.py publish spec.json   # validate, create, wait, publish, print permalink
  python3 threads_client.py post <media-id>/repost
  python3 threads_client.py post <reply-id>/manage_reply hide=true
  python3 threads_client.py delete <media-id>
spec.json holds container params; for a carousel put the item params in "children"
(a list of dicts) and the client creates the item containers first.
publish logs every container ID to stderr. If it stops midway, inspect the container with
`get <container-id> fields=status,error_message` before retrying: PUBLISHED means it already
went out; FINISHED means `post me/threads_publish creation_id=<container-id>`.
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = os.environ.get("THREADS_API_BASE", "https://graph.threads.net/v1.0")
TEXT_ONLY = ("link_attachment", "poll_attachment", "gif_attachment",
             "text_attachment", "is_ghost_post", "auto_publish_text")
GHOST_BLOCKED = ("poll_attachment", "gif_attachment", "link_attachment", "text_attachment",
                 "quote_post_id", "reply_to_id", "enable_reply_approvals")
GHOST_DOUBTFUL = ("topic_tag", "location_id", "allowlisted_country_codes",
                  "crossreshare_to_ig", "crossreshare_to_ig_dark_mode")
EMOJI_RANGES = ((0xA9, 0xA9), (0xAE, 0xAE), (0x200D, 0x200D), (0x203C, 0x203C), (0x2049, 0x2049),
                (0x20E3, 0x20E3), (0x2122, 0x2122), (0x2139, 0x2139), (0x2190, 0x21FF),
                (0x2300, 0x23FF), (0x24C2, 0x24C2), (0x25AA, 0x25FE), (0x2600, 0x27BF),
                (0x2934, 0x2935), (0x2B00, 0x2BFF), (0x3030, 0x3030), (0x303D, 0x303D),
                (0x3297, 0x3297), (0x3299, 0x3299), (0xFE0F, 0xFE0F), (0x1F000, 0x1FAFF),
                (0xE0020, 0xE007F))
VS16 = chr(0xFE0F)  # emoji presentation selector
URL = re.compile("(?:https?://|www[.])[-A-Za-z0-9._~:/?#@!$&'()*+,;=%]+", re.I)
QUOTES = "'" + '"'


class ThreadsError(Exception):
    def __init__(self, status, body):
        err = body.get("error", body) if isinstance(body, dict) else {}
        err = err if isinstance(err, dict) else {"message": str(err)}
        self.status, self.code = status, err.get("code")
        self.type = err.get("type") or err.get("error_type")
        self.message = err.get("message") or err.get("error_message") or str(body)
        self.fbtrace_id = err.get("fbtrace_id")
        super().__init__(f"HTTP {status} code={self.code} {self.type}: "
                         f"{self.message} (fbtrace_id={self.fbtrace_id})")


def token():
    tok = os.environ.get("THREADS_ACCESS_TOKEN")
    if not tok and os.path.exists(".env"):
        with open(".env", encoding="utf-8") as f:
            for line in f:
                key, _, val = line.strip().partition("=")
                if (key.split() or [""])[-1] == "THREADS_ACCESS_TOKEN":
                    tok = val.strip().strip(QUOTES)
    if not tok:
        raise SystemExit("THREADS_ACCESS_TOKEN not found (env var or .env)")
    return tok


def encode(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, dict) or (isinstance(v, list) and v and isinstance(v[0], dict)):
        return json.dumps(v, ensure_ascii=False)  # poll, text_entities, text/gif attachment
    if isinstance(v, (list, tuple)):
        return ",".join(map(str, v))              # children, allowlisted_country_codes
    return str(v)


def call(method, path, params=None):
    q = {k: encode(v) for k, v in (params or {}).items() if v is not None}
    q["access_token"] = token()
    data = urllib.parse.urlencode(q)
    url = f"{BASE}/{path.lstrip('/')}"
    req = (urllib.request.Request(f"{url}?{data}", method=method)
           if method in ("GET", "DELETE") else
           urllib.request.Request(url, data=data.encode(), method=method))
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        try:
            body = json.loads(raw)
        except ValueError:
            body = {"message": raw[:300]}
        raise ThreadsError(e.code, body) from None


def is_emoji(c):
    return any(lo <= ord(c) <= hi for lo, hi in EMOJI_RANGES)


def text_len(s):
    """Docs: 500-char limit, emojis count as their UTF-8 bytes. Conservative estimate:
    emoji-range characters, and anything followed by U+FE0F, count in full."""
    return sum(len(c.encode("utf-8")) if is_emoji(c) or s[i + 1:i + 2] == VS16 else 1
               for i, c in enumerate(s))


def links(spec):
    found = {u.rstrip(".,!?;:)}" + QUOTES) for u in URL.findall(spec.get("text") or "")}
    for extra in (spec.get("link_attachment"),
                  (spec.get("text_attachment") or {}).get("link_attachment_url")):
        if extra:
            found.add(extra)
    return found


def check(spec, child=False):
    """Return (errors, warnings) for a container spec. Errors block publishing."""
    p, w, mt, text = [], [], spec.get("media_type"), spec.get("text") or ""
    allowed = ("IMAGE", "VIDEO") if child else ("TEXT", "IMAGE", "VIDEO", "CAROUSEL")
    if mt not in allowed:
        p.append(f"media_type must be one of {', '.join(allowed)}")
    if mt == "TEXT" and not text:
        p.append("TEXT posts need text")
    if text_len(text) > 500:
        p.append(f"text counts ~{text_len(text)} (limit 500; emojis count as UTF-8 bytes)")
    if len(links(spec)) > 5:
        p.append("more than 5 unique links (THREADS_API__LINK_LIMIT_EXCEEDED)")
    if mt != "TEXT":
        p += [f"{k} only works on TEXT posts" for k in TEXT_ONLY if spec.get(k)]
    else:
        p += [f"{k} is not for TEXT posts" for k in ("alt_text", "is_spoiler_media") if spec.get(k)]
    for kind, key in (("IMAGE", "image_url"), ("VIDEO", "video_url")):
        if mt == kind and not spec.get(key):
            p.append(f"{kind} needs {key}")
    if len(spec.get("alt_text") or "") > 1000:
        p.append("alt_text is limited to 1,000 chars")
    tag = spec.get("topic_tag")
    if tag is not None and (not 1 <= len(tag) <= 50 or "." in tag or "&" in tag):
        p.append("topic_tag must be 1-50 chars without '.' or '&'")
    if len(spec.get("text_entities") or []) > 10:
        p.append("at most 10 text spoiler entities")
    poll = spec.get("poll_attachment")
    if poll:
        if not (poll.get("option_a") and poll.get("option_b")):
            p.append("poll needs option_a and option_b")
        p += [f"poll {k} must be 1-25 chars" for k in ("option_a", "option_b", "option_c", "option_d")
              if k in poll and not 1 <= len(str(poll[k])) <= 25]
        if spec.get("text_attachment"):
            p.append("a poll can't be combined with text_attachment")
    att = spec.get("text_attachment")
    if att:
        if len(att.get("plaintext") or "") > 10000:
            p.append("text_attachment.plaintext is limited to 10,000 chars")
        if att.get("link_attachment_url") and spec.get("link_attachment"):
            p.append("no text_attachment.link_attachment_url when the post has link_attachment")
    if spec.get("is_ghost_post"):
        bad = [k for k in GHOST_BLOCKED if spec.get(k)]
        if bad:
            p.append("ghost posts only support text spoilers, not " + ", ".join(bad))
        doubtful = [k for k in GHOST_DOUBTFUL if spec.get(k)]
        if doubtful:
            w.append("docs say ghost posts support only text spoilers; the API may reject or ignore "
                     + ", ".join(doubtful))
    if mt == "CAROUSEL":
        kids = spec.get("children") or []
        if not 2 <= len(kids) <= 20:
            p.append("a carousel needs 2-20 children")
        for i, kid in enumerate(kids):
            kid_errors, kid_warnings = check(kid, child=True)
            p += [f"child {i}: {msg}" for msg in kid_errors]
            w += [f"child {i}: {msg}" for msg in kid_warnings]
    return p, w


def wait_ready(container_id, timeout=300):
    """Poll until FINISHED. Docs: ~30 s on average, poll ~once a minute for up to 5 min.
    Starts with short intervals (text/images are usually quick) and backs off to 60 s."""
    start, delay = time.time(), 3
    while True:
        st = call("GET", container_id, {"fields": "status,error_message"})
        status = st.get("status")
        if status == "FINISHED":
            return
        if status in ("ERROR", "EXPIRED", "PUBLISHED"):
            raise RuntimeError(f"container {container_id} is {status} "
                               f"{st.get('error_message') or ''}".strip())
        if time.time() - start > timeout:
            raise TimeoutError(f"container {container_id} still {status} after {timeout}s")
        time.sleep(delay)
        delay = min(delay * 2, 60)


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def publish(spec, user="me"):
    errors, warnings = check(spec)
    for msg in warnings:
        log(f"warning: {msg}")
    if errors:
        raise ValueError("; ".join(errors))
    spec = dict(spec)
    if spec["media_type"] == "CAROUSEL":
        ids = []
        for kid in spec["children"]:
            ids.append(call("POST", f"{user}/threads", dict(kid, is_carousel_item=True))["id"])
            log(f"created item container {ids[-1]}")
        for cid in ids:
            wait_ready(cid)
        spec["children"] = ids
    container = call("POST", f"{user}/threads", spec)
    log(f"created container {container['id']}")
    if spec.get("auto_publish_text"):
        return container  # already live; the docs don't document this response
    wait_ready(container["id"])
    media = call("POST", f"{user}/threads_publish", {"creation_id": container["id"]})
    log(f"published media {media['id']}")
    result = {k: v for k, v in container.items() if k != "id"}  # e.g. crossreshare_to_ig_status
    result.update(media)
    try:
        result.update(call("GET", media["id"], {"fields": "permalink"}))
    except ThreadsError as err:  # the post is live; don't turn a lookup failure into an error
        result["permalink_error"] = str(err)
    return result


def main(argv):
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) < 2 or argv[0] not in ("get", "post", "delete", "check", "publish"):
        raise SystemExit(__doc__)
    cmd, target = argv[0], argv[1]
    if cmd in ("check", "publish"):
        with open(target, encoding="utf-8") as f:
            spec = json.load(f)
        if cmd == "check":
            errors, warnings = check(spec)
            out = {"errors": errors, "warnings": warnings,
                   "text_length": text_len(spec.get("text") or ""), "links": sorted(links(spec))}
        else:
            out = publish(spec)
    else:
        out = call(cmd.upper(), target, dict(a.split("=", 1) for a in argv[2:]))
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main(sys.argv[1:])
    except (ThreadsError, RuntimeError, TimeoutError, ValueError, urllib.error.URLError) as e:
        raise SystemExit(f"ERROR: {e}")
```

Spec examples for `check` / `publish`:

- Poll: `{"media_type": "TEXT", "text": "Light or dark roast?", "poll_attachment": {"option_a": "Light", "option_b": "Dark"}}`
- Carousel: `{"media_type": "CAROUSEL", "text": "…", "topic_tag": "Photography", "reply_control": "accounts_you_follow", "children": [{"media_type": "IMAGE", "image_url": "https://…/1.jpg", "alt_text": "…"}, {"media_type": "VIDEO", "video_url": "https://…/clip.mp4"}]}`
- Reply: `{"media_type": "TEXT", "text": "Thanks!", "reply_to_id": "<media id>"}`
