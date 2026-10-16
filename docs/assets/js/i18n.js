(() => {
  "use strict";
  const { $, $$, store } = TAS;
  const DOC_LANG = { zh: "zh-Hant-TW", en: "en", ja: "ja", ko: "ko" };
  const BENCH_FILE = { zh: "BENCHMARK.md", en: "BENCHMARK.en.md", ja: "BENCHMARK.ja.md", ko: "BENCHMARK.ko.md" };
  const FONT_FAMILY = { ja: "Noto+Sans+JP", ko: "Noto+Sans+KR" };

  const i18nEls = $$("[data-i18n]");
  const zhHtml = i18nEls.map((el) => el.innerHTML);
  const ariaEls = $$("[data-i18n-aria]");
  const ariaZh = ariaEls.map((el) => el.getAttribute("aria-label"));
  const phEls = $$("[data-i18n-ph]");
  const phZh = phEls.map((el) => el.getAttribute("placeholder"));
  const langBtn = $("#lang-btn"), langList = $("#lang-list"), langCur = $("#lang-cur");
  const langOpts = $$("[data-lang]", langList);
  const hasPopover = "popover" in HTMLElement.prototype;
  let current = "zh";

  function loadFont(l) {
    if (!(l in FONT_FAMILY) || $(`link[data-font="${l}"]`)) return;
    const zhFont = $('link[data-font="zh"]');
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = zhFont.href.replace("Noto+Sans+TC", FONT_FAMILY[l]);
    link.dataset.font = l;
    zhFont.after(link);
  }

  function labelTables() {
    $$(".stack-table").forEach((table) => {
      const heads = $$("thead th", table).map((th) => th.textContent.trim());
      $$("tbody tr, tfoot tr", table).forEach((tr) => {
        Array.from(tr.children).forEach((cell, i) => { if (cell.tagName === "TD") cell.dataset.label = heads[i] || ""; });
      });
    });
  }

  function apply(next) {
    current = next;
    loadFont(next);
    document.documentElement.lang = DOC_LANG[next];
    const copy = next === "zh" ? null : TAS.lang[next].copy;
    i18nEls.forEach((el, i) => {
      const html = copy ? copy[el.dataset.i18n] : zhHtml[i];
      if (html != null && el.innerHTML !== html) el.innerHTML = html;
    });
    ariaEls.forEach((el, i) => { const v = copy ? copy[el.dataset.i18nAria] : ariaZh[i]; if (v) el.setAttribute("aria-label", v); });
    phEls.forEach((el, i) => { const v = copy ? copy[el.dataset.i18nPh] : phZh[i]; if (v != null) el.setAttribute("placeholder", v); });
    langOpts.forEach((b) => {
      if (b.dataset.lang !== next) { b.removeAttribute("aria-current"); return; }
      b.setAttribute("aria-current", "true");
      langCur.textContent = b.textContent;
      langCur.lang = b.lang;
    });
    $$("a[data-bench]").forEach((a) => { a.href = new URL(BENCH_FILE[next], a.href).href; });
    labelTables();
    document.dispatchEvent(new CustomEvent("tas:lang", { detail: next }));
  }

  if (hasPopover && !CSS.supports("anchor-name", "--lang")) {
    const place = () => {
      const r = langBtn.getBoundingClientRect();
      langList.style.top = `${r.bottom + scrollY + 4}px`;
      langList.style.right = `${document.documentElement.clientWidth - r.right}px`;
    };
    langList.addEventListener("toggle", (e) => { if (e.newState === "open") place(); });
    addEventListener("resize", () => { if (langList.matches(":popover-open")) place(); });
  }
  if (!hasPopover) {
    langList.removeAttribute("popover");
    langBtn.removeAttribute("popovertarget");
    langBtn.setAttribute("aria-controls", "lang-list");
    const setOpen = (open) => { langList.hidden = !open; langBtn.setAttribute("aria-expanded", open); };
    setOpen(false);
    langBtn.addEventListener("click", () => setOpen(langList.hidden));
    document.addEventListener("click", (e) => { if (!e.target.closest(".lang")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !langList.hidden) { setOpen(false); langBtn.focus(); } });
  }
  langOpts.forEach((b) => b.addEventListener("click", () => {
    store.set("tas-lang", b.dataset.lang);
    apply(b.dataset.lang);
    if (hasPopover) langList.hidePopover(); else { langList.hidden = true; langBtn.setAttribute("aria-expanded", "false"); }
    langBtn.focus();
  }));

  TAS.i18n = {
    apply,
    has: (l) => Object.hasOwn(DOC_LANG, l),
    t: (key) => TAS.lang[current].copy[key],
    get lang() { return current; },
  };
})();
