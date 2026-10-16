(() => {
  "use strict";
  const { $$, reducedMotion } = TAS;

  const modes = $$(".mode");
  const figs = $$(".mode-fig");
  const setStep = (k) => {
    modes.forEach((m) => m.classList.toggle("is-active", m.dataset.step === k));
    figs.forEach((f) => f.classList.toggle("is-active", f.dataset.step === k));
  };
  const modeIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setStep(e.target.dataset.step); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  modes.forEach((m) => modeIO.observe(m));

  function countUp(el) {
    const target = Number(el.dataset.count);
    if (reducedMotion.matches || !target) return;
    const t0 = performance.now(), dur = 1100;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  }
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      const c = e.target.querySelector("[data-count]");
      if (c) countUp(c);
      revealIO.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  $$("[data-reveal], .bands[data-rows]").forEach((el) => revealIO.observe(el));
})();
