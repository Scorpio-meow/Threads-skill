(() => {
  "use strict";
  const { $ } = TAS;
  const { textLen, links, check } = TAS.client;
  const lang = () => TAS.i18n.lang;
  const words = () => TAS.lang[lang()];
  const pyJson = (o) => "{" + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + "}";
  const enc = (v) => (typeof v === "boolean" ? String(v) : (v && typeof v === "object" && !Array.isArray(v)) ? pyJson(v) : Array.isArray(v) ? v.join(",") : String(v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ck = {
    text: $("#ck-text"), a: $("#ck-opt-a"), b: $("#ck-opt-b"), type: $("#ck-type"), poll: $("#ck-poll"), ghost: $("#ck-ghost"),
    link: $("#ck-link"), attach: $("#ck-attach"), reply: $("#ck-reply"), spoiler: $("#ck-spoiler"), tag: $("#ck-tag"), items: $("#ck-items"),
  };
  TAS.lang.zh.sample = { text: ck.text.defaultValue, a: ck.a.defaultValue, b: ck.b.defaultValue, ...TAS.lang.zh.sample };
  function swapSample() {
    const samples = Object.values(TAS.lang).map((l) => l.sample);
    for (const k of ["text", "a", "b"]) {
      if (samples.some((s) => s[k] === ck[k].value)) ck[k].value = words().sample[k];
    }
  }
  function buildSpec() {
    const t = ck.type.value;
    const spec = { media_type: t };
    if (ck.text.value) spec.text = ck.text.value;
    if (t === "IMAGE") { spec.image_url = "https://example.com/beans.jpg"; }
    if (t === "VIDEO") { spec.video_url = "https://example.com/pour-over.mp4"; }
    if (t === "CAROUSEL") {
      const n = Math.max(0, Math.min(25, parseInt(ck.items.value, 10) || 0));
      spec.children = Array.from({ length: n }, (_, i) => ({ media_type: "IMAGE", image_url: `https://example.com/beans-${i + 1}.jpg` }));
    }
    if (ck.poll.checked) spec.poll_attachment = { option_a: ck.a.value, option_b: ck.b.value };
    if (ck.ghost.checked) spec.is_ghost_post = true;
    if (ck.link.checked) spec.link_attachment = "https://example.com/sale";
    if (ck.attach.checked) spec.text_attachment = { plaintext: words().sample.note };
    if (ck.reply.checked) spec.reply_to_id = "<media-id>";
    if (ck.spoiler.checked) spec.is_spoiler_media = true;
    if (ck.tag.value !== "") spec.topic_tag = ck.tag.value;
    return spec;
  }
  function paramsText(spec) {
    const lines = [];
    if (spec.media_type === "CAROUSEL") lines.push(words().status.carousel((spec.children || []).length));
    for (const [k, v] of Object.entries(spec)) {
      if (k === "children") { lines.push(`children=${v.map((_, i) => `<item-${i + 1}-id>`).join(",")}`); continue; }
      lines.push(`${k}=${enc(v)}`);
    }
    return lines.join("\n");
  }
  const outEl = $("#ck-out");
  let lastOut = "";
  function render() {
    const t = ck.type.value;
    $("#ck-poll-fields").hidden = !ck.poll.checked;
    $("#ck-items-row").classList.toggle("is-off", t !== "CAROUSEL");
    ck.items.disabled = t !== "CAROUSEL";
    const spec = buildSpec();
    const [errors, warnings] = check(spec);
    const tl = textLen(spec.text || "");
    const nl = links(spec).size;
    $("#ck-len").textContent = tl;
    $("#ck-links").textContent = nl;
    $("#ck-len-m").classList.toggle("over", tl > 500);
    $("#ck-link-m").classList.toggle("over", nl > 5);
    $("#ck-len-bar").style.setProperty("--p", Math.min(1, tl / 500));
    $("#ck-link-bar").style.setProperty("--p", Math.min(1, nl / 5));
    const ui = words().status, msg = words().check;
    let status, cls;
    if (errors.length) { cls = "is-bad"; status = ui.bad(errors.length, warnings.length); }
    else if (warnings.length) { cls = "is-warn"; status = ui.warn(warnings.length); }
    else { cls = "is-ok"; status = ui.ok; }
    const item = (e, kind) => {
      const pre = e.child !== undefined ? ui.child(e.child + 1) : "";
      const human = msg ? `<span>${esc(pre + msg[e.id](e.a))}</span>` : "";
      const label = kind === "bad" ? ui.errLabel : ui.warnLabel;
      return `<li class="${kind}"><span class="vh">${esc(label)}</span>${human}<code>${esc(e.msg)}</code></li>`;
    };
    const out = `<p class="ck-status ${cls}"><span class="dot" aria-hidden="true"></span><span>${esc(status)}</span></p>` +
      (errors.length || warnings.length ? `<ul class="ck-list">${errors.map((e) => item(e, "bad")).join("")}${warnings.map((e) => item(e, "warn")).join("")}</ul>` : "");
    if (out !== lastOut) { outEl.innerHTML = out; lastOut = out; }
    $("#ck-params").textContent = paramsText(spec);
  }
  ["input", "change"].forEach((ev) => $(".ck").addEventListener(ev, (e) => { if (e.target.closest(".ck-side, .ck-main")) render(); }));
  const moreBtn = $("#ck-more");
  const syncMore = () => { moreBtn.textContent = TAS.i18n.t($("#ck-side").classList.contains("show-more") ? "ck.less" : "ck.more"); };
  moreBtn.addEventListener("click", () => {
    moreBtn.setAttribute("aria-expanded", $("#ck-side").classList.toggle("show-more"));
    syncMore();
  });
  const live = outEl.getAttribute("aria-live");
  const quietRender = () => {
    outEl.removeAttribute("aria-live");
    render();
    requestAnimationFrame(() => outEl.setAttribute("aria-live", live));
  };
  document.addEventListener("tas:lang", () => { swapSample(); syncMore(); quietRender(); });
})();