(() => {
  "use strict";
  const { $, reducedMotion } = TAS;
  const stage = $(".stage");
  const fine = $(".fine", stage);
  const inner = $(".fine-in", fine);
  const block = $(".fine-block", inner);
  inner.prepend(block.cloneNode(true));
  inner.append(block.cloneNode(true));
  const mag = fine.cloneNode(true);
  $(".lens-in", stage).append(mag);
  const layers = [inner, $(".fine-in", mag)];
  const STEPS = 12, PER = 3, HOLD = 2600, MOVE = 900, DELAY = 1700;
  let anims = [];
  let visible = true;
  function build() {
    anims.forEach((a) => a.cancel());
    anims = [];
    if (reducedMotion.matches) return;
    const lh = parseFloat(getComputedStyle(stage).getPropertyValue("--lh"));
    const total = STEPS * (HOLD + MOVE);
    const frames = [];
    for (let i = 0; i < STEPS; i++) {
      const y = `translateY(${-i * PER * lh}px)`;
      frames.push({ transform: y, offset: (i * (HOLD + MOVE)) / total, easing: "linear" });
      frames.push({ transform: y, offset: (i * (HOLD + MOVE) + HOLD) / total, easing: "cubic-bezier(0.76, 0, 0.24, 1)" });
    }
    frames.push({ transform: `translateY(${-STEPS * PER * lh}px)`, offset: 1 });
    anims = layers.map((el) => el.animate(frames, { duration: total, delay: DELAY, iterations: Infinity }));
    if (!visible) anims.forEach((a) => a.pause());
  }
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    anims.forEach((a) => (visible ? a.play() : a.pause()));
  }).observe(stage);
  reducedMotion.addEventListener("change", build);
  build();
})();
