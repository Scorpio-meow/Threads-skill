(() => {
  "use strict";
  const { $, $$ } = TAS;
  const t = (key) => TAS.i18n.t(key);

  function commandText(id) { const el = document.getElementById(id); return el.textContent.replace(/^\$\s*/, "").trim(); }
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.copy;
      const text = commandText(id);
      const done = document.getElementById(btn.dataset.done);
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch {}
      if (!ok) {
        const range = document.createRange();
        range.selectNodeContents(document.getElementById(id));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      }
      if (done) {
        done.textContent = t(ok ? "cta.done" : "cta.sel");
        done.classList.add("is-on");
        clearTimeout(done._t); done._t = setTimeout(() => done.classList.remove("is-on"), 2600);
      }
    });
  });

  function bindSeg(seg, onChange) {
    const btns = $$('[role="radio"]', seg);
    const select = (b, focus) => {
      btns.forEach((x) => { const on = x === b; x.setAttribute("aria-checked", on); x.tabIndex = on ? 0 : -1; });
      seg.style.setProperty("--k", btns.indexOf(b));
      if (focus) b.focus();
      onChange(b);
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select(btns[(i + d + btns.length) % btns.length], true);
      });
    });
  }

  const demo = $(".demo");
  bindSeg($(".seg", demo), (b) => {
    const v = b.dataset.variant;
    $$("[data-stack] > [data-variant]", demo).forEach((el) => {
      const on = el.dataset.variant === v;
      el.toggleAttribute("inert", !on);
      if (on) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
    });
  });

  const dlg = $(".dialog");
  let scope = "global", runner = "bunx";
  function renderScope() {
    $("#dlg-cmd").innerHTML = `<span class="tk">${runner} skills add</span> <span class="tk">Scorpio-meow/Threads-skill</span> <span class="tk">--skill threads-api${scope === "global" ? " -g" : ""}</span>`;
    $("#dlg-hint").innerHTML = t(scope === "global" ? "dlg.hintG" : "dlg.hintP");
    $("#dlg-runner").textContent = t(runner === "bunx" ? "dlg.npx" : "dlg.bunx");
  }
  bindSeg($(".seg", dlg), (b) => { scope = b.dataset.scope; renderScope(); });
  $("#dlg-runner").addEventListener("click", () => { runner = runner === "bunx" ? "npx" : "bunx"; renderScope(); });
  document.addEventListener("tas:lang", renderScope);

  const tabs = $$('.rules-tabs [role="tab"]');
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  function selectTab(tab, focus) {
    tabs.forEach((x, i) => {
      const on = x === tab;
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
      if (on) { const ul = $(".bands", panels[i]); if (ul) { ul.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => ul.classList.add("is-in"))); } }
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const n = tabs.length;
      const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      selectTab(tabs[(map[e.key] + n) % n], true);
    });
  });
  panels.forEach((p, i) => { if (i > 0) p.hidden = true; });
})();
