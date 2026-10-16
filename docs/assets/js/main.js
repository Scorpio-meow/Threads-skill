(() => {
  "use strict";
  const saved = TAS.store.get("tas-lang");
  const browserLang = (navigator.language || "").toLowerCase().slice(0, 2);
  TAS.i18n.apply(TAS.i18n.has(saved) ? saved : TAS.i18n.has(browserLang) ? browserLang : "en");
})();
