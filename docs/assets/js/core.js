window.TAS = {
  $: (s, r = document) => r.querySelector(s),
  $$: (s, r = document) => Array.from(r.querySelectorAll(s)),
  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)"),
  store: {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
  },
  lang: {},
  menu(btn, list) {
    const hasPopover = "popover" in HTMLElement.prototype;
    if (hasPopover && !CSS.supports("anchor-name", "--menu")) {
      const place = () => {
        const r = btn.getBoundingClientRect();
        list.style.top = `${r.bottom + scrollY + 4}px`;
        list.style.right = `${document.documentElement.clientWidth - r.right}px`;
      };
      list.addEventListener("toggle", (e) => { if (e.newState === "open") place(); });
      addEventListener("resize", () => { if (list.matches(":popover-open")) place(); });
    }
    const setOpen = (open) => { list.hidden = !open; btn.setAttribute("aria-expanded", open); };
    if (!hasPopover) {
      list.removeAttribute("popover");
      btn.removeAttribute("popovertarget");
      btn.setAttribute("aria-controls", list.id);
      setOpen(false);
      btn.addEventListener("click", () => setOpen(list.hidden));
      document.addEventListener("click", (e) => { if (!btn.parentElement.contains(e.target)) setOpen(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !list.hidden) { setOpen(false); btn.focus(); } });
    }
    return {
      close() {
        if (hasPopover) list.hidePopover(); else setOpen(false);
        btn.focus();
      },
    };
  },
};