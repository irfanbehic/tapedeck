/* Tapedeck — site behaviour. Everything here degrades to a working page without it. */
(function () {
  "use strict";

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nav gets its background once the page has moved. */
  var nav = document.querySelector(".nav");
  if (nav) {
    var sync = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 12);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  /* Sections fade up as they arrive. */
  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (calm || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var delay = Number(entry.target.dataset.delay || 0);
      setTimeout(function () { entry.target.classList.add("is-in"); }, delay);
      seen.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

  targets.forEach(function (el) { seen.observe(el); });

  /* The hero waveform: bars built in code so the envelope stays symmetric. */
  var wave = document.querySelector(".wave");
  if (wave) {
    var count = window.innerWidth < 640 ? 27 : 47;
    var middle = (count - 1) / 2;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var bar = document.createElement("span");
      var fromCentre = Math.abs(i - middle) / middle;
      var envelope = 0.3 + 0.7 * Math.cos((fromCentre * Math.PI) / 2);
      bar.style.height = Math.round(envelope * 100) + "%";
      bar.style.animationDelay = (-i * 62) + "ms";
      bar.style.animationDuration = (1600 + (i % 5) * 130) + "ms";
      bar.style.opacity = String(0.35 + envelope * 0.65);
      frag.appendChild(bar);
    }

    wave.appendChild(frag);
    wave.setAttribute("aria-hidden", "true");
  }
})();
