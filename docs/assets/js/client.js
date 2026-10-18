TAS.client = (() => {
  "use strict";
  const TEXT_ONLY = ["link_attachment", "poll_attachment", "gif_attachment", "text_attachment", "is_ghost_post", "auto_publish_text"];
  const GHOST_BLOCKED = ["poll_attachment", "gif_attachment", "link_attachment", "text_attachment", "quote_post_id", "reply_to_id", "enable_reply_approvals"];
  const GHOST_DOUBTFUL = ["topic_tag", "location_id", "allowlisted_country_codes", "crossreshare_to_ig", "crossreshare_to_ig_dark_mode"];
  const EMOJI_RANGES = [[0xA9, 0xA9], [0xAE, 0xAE], [0x200D, 0x200D], [0x203C, 0x203C], [0x2049, 0x2049],
  [0x20E3, 0x20E3], [0x2122, 0x2122], [0x2139, 0x2139], [0x2190, 0x21FF],
  [0x2300, 0x23FF], [0x24C2, 0x24C2], [0x25AA, 0x25FE], [0x2600, 0x27BF],
  [0x2934, 0x2935], [0x2B00, 0x2BFF], [0x3030, 0x3030], [0x303D, 0x303D],
  [0x3297, 0x3297], [0x3299, 0x3299], [0xFE0F, 0xFE0F], [0x1F000, 0x1FAFF],
  [0xE0020, 0xE007F]];
  const VS16 = 0xFE0F;
  const URL_RE = /(?:https?:\/\/|www[.])[-A-Za-z0-9._~:\/?#@!$&'()*+,;=%]+/gi;
  const TRAIL = ".,!?;:)}'\"";
  const cps = (s) => Array.from(s, (c) => c.codePointAt(0));
  const cpLen = (s) => Array.from(String(s)).length;
  const isEmoji = (cp) => EMOJI_RANGES.some(([lo, hi]) => lo <= cp && cp <= hi);
  const utf8 = (cp) => (cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4);
  const truthy = (v) => !(v === undefined || v === null || v === false || v === "" || v === 0 ||
    (Array.isArray(v) && v.length === 0) || (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0));
  function textLen(s) {
    const a = cps(s); let n = 0;
    for (let i = 0; i < a.length; i++) n += (isEmoji(a[i]) || a[i + 1] === VS16) ? utf8(a[i]) : 1;
    return n;
  }
  function rstrip(s, chars) { let e = s.length; while (e > 0 && chars.includes(s[e - 1])) e--; return s.slice(0, e); }
  function links(spec) {
    const found = new Set();
    for (const m of (spec.text || "").matchAll(URL_RE)) found.add(rstrip(m[0], TRAIL));
    for (const extra of [spec.link_attachment, (spec.text_attachment || {}).link_attachment_url]) if (extra) found.add(extra);
    return found;
  }
  function check(spec, child = false) {
    const p = [], w = [];
    const mt = spec.media_type, text = spec.text || "";
    const allowed = child ? ["IMAGE", "VIDEO"] : ["TEXT", "IMAGE", "VIDEO", "CAROUSEL"];
    const add = (arr, id, msg, a = {}) => arr.push({ id, msg, a });
    if (!allowed.includes(mt)) add(p, "media_type", `media_type must be one of ${allowed.join(", ")}`, { allowed });
    if (mt === "TEXT" && !text) add(p, "text_required", "TEXT posts need text");
    const tl = textLen(text);
    if (tl > 500) add(p, "text_len", `text counts ~${tl} (limit 500; emojis count as UTF-8 bytes)`, { n: tl });
    if (links(spec).size > 5) add(p, "links", "more than 5 unique links (THREADS_API__LINK_LIMIT_EXCEEDED)");
    if (mt !== "TEXT") { for (const k of TEXT_ONLY) if (truthy(spec[k])) add(p, "text_only", `${k} only works on TEXT posts`, { k }); }
    else { for (const k of ["alt_text", "is_spoiler_media"]) if (truthy(spec[k])) add(p, "not_text", `${k} is not for TEXT posts`, { k }); }
    for (const [kind, key] of [["IMAGE", "image_url"], ["VIDEO", "video_url"]]) if (mt === kind && !truthy(spec[key])) add(p, "needs_url", `${kind} needs ${key}`, { kind, key });
    if (cpLen(spec.alt_text || "") > 1000) add(p, "alt_text", "alt_text is limited to 1,000 chars");
    const tag = spec.topic_tag;
    if (tag !== undefined && tag !== null && (!(cpLen(tag) >= 1 && cpLen(tag) <= 50) || tag.includes(".") || tag.includes("&"))) add(p, "topic_tag", "topic_tag must be 1-50 chars without '.' or '&'");
    if ((spec.text_entities || []).length > 10) add(p, "entities", "at most 10 text spoiler entities");
    const poll = spec.poll_attachment;
    if (truthy(poll)) {
      if (!(poll.option_a && poll.option_b)) add(p, "poll_ab", "poll needs option_a and option_b");
      for (const k of ["option_a", "option_b", "option_c", "option_d"]) {
        if (k in poll && !(cpLen(poll[k]) >= 1 && cpLen(poll[k]) <= 25)) add(p, "poll_len", `poll ${k} must be 1-25 chars`, { k });
      }
      if (truthy(spec.text_attachment)) add(p, "poll_attach", "a poll can't be combined with text_attachment");
    }
    const att = spec.text_attachment;
    if (truthy(att)) {
      if (cpLen(att.plaintext || "") > 10000) add(p, "attach_len", "text_attachment.plaintext is limited to 10,000 chars");
      if (att.link_attachment_url && spec.link_attachment) add(p, "attach_link", "no text_attachment.link_attachment_url when the post has link_attachment");
    }
    if (truthy(spec.is_ghost_post)) {
      const bad = GHOST_BLOCKED.filter((k) => truthy(spec[k]));
      if (bad.length) add(p, "ghost", "ghost posts only support text spoilers, not " + bad.join(", "), { list: bad });
      const doubtful = GHOST_DOUBTFUL.filter((k) => truthy(spec[k]));
      if (doubtful.length) add(w, "ghost_doubt", "docs say ghost posts support only text spoilers; the API may reject or ignore " + doubtful.join(", "), { list: doubtful });
    }
    if (mt === "CAROUSEL") {
      const kids = spec.children || [];
      if (!(kids.length >= 2 && kids.length <= 20)) add(p, "carousel", "a carousel needs 2-20 children");
      kids.forEach((kid, i) => {
        const [ke, kw] = check(kid, true);
        ke.forEach((e) => p.push({ ...e, msg: `child ${i}: ${e.msg}`, child: i }));
        kw.forEach((e) => w.push({ ...e, msg: `child ${i}: ${e.msg}`, child: i }));
      });
    }
    return [p, w];
  }
  return { textLen, links, check };
})();