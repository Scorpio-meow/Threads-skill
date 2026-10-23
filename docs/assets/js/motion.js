(() => {
  "use strict";
  const { $, $$, reducedMotion } = TAS;
  $$(".tool-list li, .mark-big span").forEach((el) => el.style.setProperty("--r", Array.prototype.indexOf.call(el.parentElement.querySelectorAll(el.tagName), el)));
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      e.target.dispatchEvent(new CustomEvent("tas:in"));
      revealIO.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  $$("[data-reveal], .bands[data-rows], .trap, .tool-list, .mark-big").forEach((el) => revealIO.observe(el));
  document.documentElement.classList.add("reveal-on");

  const video = $(".film-video");
  let userPaused = false, autoPausing = false;
  video.addEventListener("pause", () => { if (!autoPausing) userPaused = true; autoPausing = false; });
  video.addEventListener("play", () => { userPaused = false; });
  new IntersectionObserver((entries) => {
    const inView = entries[0].isIntersecting;
    if (inView && !userPaused && !reducedMotion.matches && video.paused) {
      video.play().catch(() => { });
    } else if (!inView && !video.paused) {
      autoPausing = true;
      video.pause();
    }
  }, { threshold: 0.4 }).observe(video);
})();
