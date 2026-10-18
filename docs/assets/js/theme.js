(() => {
  "use strict";
  const { $, $$, store } = TAS;
  const root = document.documentElement;
  const btn = $("#theme-btn"), list = $("#theme-list"), cur = $("#theme-cur");
  const opts = $$("[data-theme-opt]", list);
  const metas = $$('meta[name="theme-color"]');
  const metaDefaults = metas.map((m) => m.content);
  const menu = TAS.menu(btn, list);
  const saved = store.get("tas-theme");
  let choice = opts.some((b) => b.dataset.themeOpt === saved) ? saved : opts[0].dataset.themeOpt;
  function apply() {
    const forced = choice !== opts[0].dataset.themeOpt;
    if (forced) root.dataset.theme = choice; else delete root.dataset.theme;
    const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    metas.forEach((m, i) => { m.content = forced ? bg : metaDefaults[i]; });
    btn.dataset.choice = choice;
    opts.forEach((b) => {
      if (b.dataset.themeOpt !== choice) { b.removeAttribute("aria-current"); return; }
      b.setAttribute("aria-current", "true");
      cur.textContent = b.textContent;
    });
  }
  opts.forEach((b) => b.addEventListener("click", () => {
    choice = b.dataset.themeOpt;
    store.set("tas-theme", choice);
    apply();
    menu.close();
  }));
  document.addEventListener("tas:lang", apply);
  apply();
})();