(() => {
  "use strict";
  const { $, $$, reducedMotion } = TAS;
  const t = (key) => TAS.i18n.t(key);
  function commandText(id) { const el = document.getElementById(id); return el.textContent.replace(/^\$\s*/, "").trim(); }
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.copy;
      const text = commandText(id);
      const done = document.getElementById(btn.dataset.done);
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch { }
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
  new Set($$("[data-copy]").map((b) => b.dataset.done)).forEach((id) => {
    const done = document.getElementById(id);
    done.addEventListener("transitionend", () => { if (!done.classList.contains("is-on")) done.textContent = ""; });
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
  const duo = $(".duo");
  const demoSeg = $(".seg", duo);
  const showVariant = (v) => {
    duo.dataset.variant = v;
    $$("[data-stack] > [data-variant]", duo).forEach((el) => {
      const on = el.dataset.variant === v;
      el.toggleAttribute("inert", !on);
      if (on) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
    });
  };
  bindSeg(demoSeg, (b) => showVariant(b.dataset.variant));
  showVariant($('[aria-checked="true"]', demoSeg).dataset.variant);
  $$("[data-stack]", duo).forEach((s) => s.classList.add("is-ready"));
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
  dlg.addEventListener("focusin", () => { ["#dlg-cmd", "#dlg-hint"].forEach((s) => $(s).setAttribute("aria-live", "polite")); }, { once: true });
  const scrollers = $$(".code, .tbl-wrap, .ck-pay pre, .qa-body pre");
  const syncScrollers = () => scrollers.forEach((el) => {
    if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) el.tabIndex = 0; else el.removeAttribute("tabindex");
  });
  const scrollRO = new ResizeObserver(syncScrollers);
  scrollers.forEach((el) => scrollRO.observe(el));
  document.addEventListener("tas:lang", syncScrollers);
  document.addEventListener("input", syncScrollers);
  const tlBar = $(".tl-bar");
  const tlLabels = $$("span", tlBar);
  const fitLabels = () => tlLabels.forEach((s) => {
    s.classList.remove("is-clipped");
    s.classList.toggle("is-clipped", s.scrollWidth > s.clientWidth);
  });
  new ResizeObserver(fitLabels).observe(tlBar);
  document.addEventListener("tas:lang", fitLabels);

  const split = $("[data-modes]");
  const modeRange = $("#mode-range");
  const stops = $$("[data-go]", split);
  const steps = $$(".mode, .mode-fig", split);
  function setMode(k) {
    const max = Number(modeRange.max);
    steps.forEach((el) => {
      const on = el.dataset.step === String(k);
      el.classList.toggle("is-active", on);
      el.toggleAttribute("inert", !on);
    });
    stops.forEach((b) => { if (b.dataset.go === String(k)) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    split.style.setProperty("--k", k);
    modeRange.parentElement.style.setProperty("--p", k / max);
    modeRange.setAttribute("aria-valuetext", stops[k].textContent);
  }
  modeRange.addEventListener("input", () => setMode(Number(modeRange.value)));
  stops.forEach((b) => b.addEventListener("click", () => { modeRange.value = b.dataset.go; setMode(Number(b.dataset.go)); }));
  document.addEventListener("tas:lang", () => setMode(Number(modeRange.value)));
  setMode(Number(modeRange.value));

  $$(".trap .sw").forEach((sw) => {
    const trap = sw.closest(".trap");
    sw.addEventListener("click", () => {
      const on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", on);
      trap.classList.toggle("is-on", on);
    });
  });

  const dial = $("#b-round");
  const fig = $("#b-fig"), unit = $("#b-unit"), note = $("#b-note"), out = $("#b-round-out");
  const rounds = $$(".ledger li");
  const table = $(".bench table");
  table.classList.remove("stack-table");
  dial.max = String(rounds.length);
  dial.value = dial.max;
  let shown = Number(fig.textContent), raf = 0;
  function count(to) {
    cancelAnimationFrame(raf);
    if (reducedMotion.matches) { shown = to; fig.textContent = String(to); return; }
    const from = shown, t0 = performance.now(), dur = 520;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      shown = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      fig.textContent = String(shown);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function setRound(n, animate) {
    const li = rounds[n - 1];
    const target = Number($("[data-count]", li).dataset.count);
    unit.innerHTML = $(".cap > b", li).innerHTML;
    note.innerHTML = $(".cap > span", li).innerHTML;
    out.textContent = $(`thead th:nth-child(${n + 1})`, table).textContent;
    dial.parentElement.style.setProperty("--p", (n - 1) / (rounds.length - 1));
    dial.setAttribute("aria-valuetext", `${target} ${unit.textContent}`);
    $$("tr", table).forEach((tr) => Array.from(tr.children).forEach((c, i) => c.classList.toggle("is-round", i === n)));
    if (animate) count(target); else { shown = target; fig.textContent = String(target); }
  }
  dial.addEventListener("input", () => setRound(Number(dial.value), true));
  document.addEventListener("tas:lang", () => setRound(Number(dial.value), false));
  setRound(Number(dial.value), false);
  fig.closest("[data-reveal]").addEventListener("tas:in", () => { shown = 0; fig.textContent = "0"; count(Number($("[data-count]", rounds[Number(dial.value) - 1]).dataset.count)); }, { once: true });

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
