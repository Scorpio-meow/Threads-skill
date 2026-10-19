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
