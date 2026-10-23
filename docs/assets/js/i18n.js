(() => {
  "use strict";
  const { $, $$, store } = TAS;
  const DOC_LANG = { zh: "zh-Hant-TW", en: "en", ja: "ja", ko: "ko" };
  const i18nEls = $$("[data-i18n]");
  const zhHtml = i18nEls.map((el) => el.innerHTML);
  const ariaEls = $$("[data-i18n-aria]");
  const ariaZh = ariaEls.map((el) => el.getAttribute("aria-label"));
  const phEls = $$("[data-i18n-ph]");
  const phZh = phEls.map((el) => el.getAttribute("placeholder"));
  const langBtn = $("#lang-btn"), langList = $("#lang-list"), langCur = $("#lang-cur");
  const langOpts = $$("[data-lang]", langList);
  const langMenu = TAS.menu(langBtn, langList);
  let current = "zh";
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
    $$("a[data-md]").forEach((a) => { a.href = new URL(`${a.dataset.md}${next === "zh" ? "" : `_${next}`}.md`, a.href).href; });
    labelTables();
    document.dispatchEvent(new CustomEvent("tas:lang", { detail: next }));
  }
  langOpts.forEach((b) => b.addEventListener("click", () => {
    store.set("tas-lang", b.dataset.lang);
    apply(b.dataset.lang);
    langMenu.close();
  }));
  TAS.i18n = {
    apply,
    has: (l) => Object.hasOwn(DOC_LANG, l),
    t: (key) => TAS.lang[current].copy[key],
    get lang() { return current; },
  };
})();