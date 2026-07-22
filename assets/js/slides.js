(() => {
  // ===== CASE PRESENTATION DECK: horizontal slide navigation shared by both decks. =====
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = document.querySelector(".deck-track");
  const slides = [...document.querySelectorAll(".slide")];
  const progress = document.querySelector(".deck-progress");
  const countEl = document.querySelector(".deck-count");
  const hint = document.querySelector(".deck-hint");
  const prevBtn = document.querySelector('[data-nav="prev"]');
  const nextBtn = document.querySelector('[data-nav="next"]');
  if (!track || !slides.length) return;

  const pad = (n) => String(n + 1).padStart(2, "0");
  let index = 0;


  // ===== BUILDS: PowerPoint-style click-to-reveal steps within a slide. Elements carrying
  // [data-build="n"] appear one per advance; only once they are all in does the deck move on.
  let builds = [];
  let step = 0;


const comicSlide = document.querySelector(".slide--comic-day");
const painSlide = document.querySelector(".slide--pain-overload");
const gapSlide = document.querySelector(".slide--gap");

if (gapSlide) {
  gapSlide.dataset.gapStep = "0";
}
const painSourceCount = painSlide?.querySelector("[data-source-count]");
let previousPainSourceCount = 0;

if (comicSlide) {
  const comicStoryItems = [
    comicSlide.querySelector(".comic-side-figure"),
    ...comicSlide.querySelectorAll(".comic-timeline .comic-panel"),
    comicSlide.querySelector("h2"),
  ].filter(Boolean);

  comicStoryItems.forEach((element, index) => {
    element.dataset.build = String(index + 1);
    element.setAttribute("aria-hidden", "true");
  });

  // Initial state: no timeline and no story elements visible.
  comicSlide.dataset.storyStep = "0";
}

function syncGapStory() {
  if (!gapSlide) return;

  const gapStep = slides[index] === gapSlide ? step : 0;

  gapSlide.dataset.gapStep = String(gapStep);

  gapSlide.classList.toggle("is-gap-focused", gapStep >= 1);
  gapSlide.classList.toggle("is-gap-result-shown", gapStep >= 2);
  gapSlide.classList.toggle("is-gap-caption-shown", gapStep >= 3);
  gapSlide.classList.toggle("is-gap-actions-shown", gapStep >= 4);
}

function syncComicStory() {
  if (!comicSlide) return;

  if (slides[index] === comicSlide) {
    comicSlide.dataset.storyStep = String(step);
  } else {
    comicSlide.dataset.storyStep = "0";
  }
}
function syncPainSourceCount() {
  if (!painSlide || !painSourceCount) return;

  /*
   * Build steps 1–5 are information sources.
   * Build step 6 is only the “Still no answer” stamp.
   */
  const sourceCount =
    slides[index] === painSlide
      ? Math.min(step, 5)
      : 0;

  if (sourceCount === previousPainSourceCount) return;

  painSourceCount.textContent = String(sourceCount);

  painSourceCount.classList.remove("is-counting");

  // Restart the animation whenever the number changes.
  void painSourceCount.offsetWidth;

  painSourceCount.classList.add("is-counting");
  previousPainSourceCount = sourceCount;
}

function setStep(n) {
  step = Math.max(0, Math.min(builds.length, n));

  builds.forEach((element, buildIndex) => {
    const isShown = buildIndex < step;

    element.classList.toggle("is-shown", isShown);
    element.setAttribute("aria-hidden", String(!isShown));
  });

  syncComicStory();
  syncControls();
  syncPainSourceCount();
  syncGapStory();
}


  function syncControls() {
    if (prevBtn) prevBtn.disabled = index === 0 && step === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1 && step === builds.length;
  }

  function go(n, fromUser = true, fillBuilds = false) {
    index = Math.max(0, Math.min(slides.length - 1, n));
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
      // Keep offscreen slides out of the tab order / accessibility tree.
      if (i === index) s.removeAttribute("aria-hidden");
      else s.setAttribute("aria-hidden", "true");
      s.querySelectorAll("a,button").forEach((el) => (el.tabIndex = i === index ? 0 : -1));
    });
    if (progress) progress.style.transform = `scaleX(${(index + 1) / slides.length})`;
    if (countEl) countEl.innerHTML = `<b>${pad(index)}</b> / ${pad(slides.length - 1)}`;
    if (fromUser && hint) hint.classList.add("is-hidden");
    // Arriving forwards starts the build at zero; stepping back into a slide shows it complete.
    builds = [...slides[index].querySelectorAll("[data-build]")].sort(
      (a, b) => Number(a.dataset.build) - Number(b.dataset.build),
    );
    setStep(fillBuilds ? builds.length : 0);
    history.replaceState(null, "", index === 0 ? location.pathname : `#${index + 1}`);
  }
  function next() {
    if (step < builds.length) return setStep(step + 1);
    if (index < slides.length - 1) go(index + 1);
  }
  function prev() {
    if (step > 0) return setStep(step - 1);
    if (index > 0) go(index - 1, true, true);
  }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  // Back to the case study: return to where the visitor came from when possible.
  function backToCase() {
    let sameSite = false;
    try {
      sameSite = document.referrer && new URL(document.referrer).origin === location.origin;
    } catch (e) {
      /* opaque referrer -> fall through */
    }
    if (sameSite || location.protocol === "file:") history.back();
    else location.href = "index.html#work";
  }
  document.querySelectorAll("[data-back]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      backToCase();
    }),
  );

  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        e.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        prev();
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(slides.length - 1, true, true);
        break;
      case "Escape":
        e.preventDefault();
        backToCase();
        break;
    }
  });

  // Click anywhere to advance, as in a presentation tool. Links, buttons and text
  // selections are left alone, and a swipe must not also register as a click.
  let swipeHandled = false;
  document.querySelector(".deck")?.addEventListener("click", (e) => {
    if (swipeHandled) {
      swipeHandled = false;
      return;
    }
    if (e.target.closest("a, button, [data-no-advance]")) return;
    if (String(getSelection?.() ?? "").length) return;
    next();
  });

  // Touch / pointer swipe with a velocity shortcut: a quick flick is enough.
  let downX = null,
    downY = null,
    downT = 0;
  addEventListener(
    "pointerdown",
    (e) => {
      if (e.target.closest("a, button, [data-no-advance]")) return;
      downX = e.clientX;
      downY = e.clientY;
      downT = performance.now();
    },
    { passive: true },
  );
  addEventListener(
    "pointerup",
    (e) => {
      if (downX == null) return;
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      downX = downY = null;
      if (Math.abs(dx) < Math.abs(dy) * 1.2) return; // mostly vertical -> ignore
      const velocity = Math.abs(dx) / Math.max(1, performance.now() - downT);
      if (Math.abs(dx) > 64 || velocity > 0.5) {
        swipeHandled = true;
        (dx < 0 ? next : prev)();
      }
    },
    { passive: true },
  );

  // Horizontal trackpad / shift-scroll paging (throttled so one gesture = one slide).
  let wheelLock = 0;
  addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 24) return;
      const now = performance.now();
      if (now - wheelLock < 900) return;
      wheelLock = now;
      (e.deltaX > 0 ? next : prev)();
    },
    { passive: true },
  );

  // ===== SLIDE 08 (GoodGo): the title reveal used to animate max-width, which re-laid
  // out a 4rem headline every frame. Measure the hidden half once and let CSS shift the
  // whole title by half of it, so only transform/opacity animate. =====
  const auditTitle = document.querySelector(".audit-title");
  if (auditTitle) {
    const reveal = auditTitle.querySelector(".audit-title-reveal");
    const measure = () => {
      if (!reveal) return;
      const cs = getComputedStyle(reveal);
      const w = reveal.getBoundingClientRect().width + (parseFloat(cs.marginLeft) || 0);
      auditTitle.style.setProperty("--reveal-w", `${w.toFixed(1)}px`);
    };
    requestAnimationFrame(measure);
    setTimeout(measure, 400);
    document.fonts?.ready?.then(measure);
    addEventListener("resize", measure);
  }

  // ===== HERO DECORATION 1 (Chaldene): a working node graph. Dragging the threshold node
  // re-renders the preview — the case's whole argument (change → see) in miniature. =====
  const lab = document.querySelector(".hero-lab");
  if (lab) {
    const svg = lab.querySelector(".lab-wires");
    const wires = [...lab.querySelectorAll(".wire")];
    const nodes = [...lab.querySelectorAll(".lab-node")];
    const valEl = lab.querySelector(".ln-val");
    const fillEl = lab.querySelector(".ln-slider i");
    const canvas = lab.querySelector(".ln-canvas");
    const ctx = canvas.getContext("2d");
    const N = canvas.width;

    // Smooth blob field, computed once; only the threshold changes as you drag.
    // Tight, well-separated cells: as the threshold rises they shrink and split apart,
    // which is exactly the judgement call the real tool asks a researcher to make.
    const field = new Float32Array(N * N);
    const blobs = [
      [0.28, 0.30, 0.10], [0.62, 0.24, 0.085], [0.46, 0.53, 0.105],
      [0.22, 0.68, 0.09], [0.75, 0.62, 0.095], [0.55, 0.80, 0.08],
      [0.82, 0.38, 0.07], [0.36, 0.86, 0.075], [0.12, 0.46, 0.07],
    ];
    let peak = 0;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const nx = x / N, ny = y / N;
        let v = 0;
        for (const [bx, by, br] of blobs) {
          const dx = nx - bx, dy = ny - by;
          v += Math.exp(-(dx * dx + dy * dy) / (2 * br * br));
        }
        field[y * N + x] = v;
        if (v > peak) peak = v;
      }
    }
    // Normalise rather than clip, so the whole 0–1 threshold range stays meaningful.
    for (let i = 0; i < field.length; i++) field[i] /= peak || 1;
    const frame = ctx.createImageData(N, N);
    function renderPreview(t) {
      for (let i = 0; i < N * N; i++) {
        const on = field[i] > t;
        const o = i * 4;
        frame.data[o] = on ? 22 : 255;
        frame.data[o + 1] = on ? 2 : 253;
        frame.data[o + 2] = on ? 14 : 249;
        frame.data[o + 3] = 255;
      }
      ctx.putImageData(frame, 0, 0);
    }

    function drawWires() {
      const r = lab.getBoundingClientRect();
      if (!r.width) return;
      svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const box = (el) => {
        const b = el.getBoundingClientRect();
        return { x: b.left - r.left, y: b.top - r.top, w: b.width, h: b.height };
      };
      const p = nodes.map(box);
      const link = (a, b) => {
        const x1 = a.x + a.w, y1 = a.y + a.h / 2;
        const x2 = b.x, y2 = b.y + b.h / 2;
        const d = Math.max(46, Math.abs(x2 - x1) * 0.45);
        return `M${x1},${y1} C${x1 + d},${y1} ${x2 - d},${y2} ${x2},${y2}`;
      };
      wires[0].setAttribute("d", link(p[0], p[1]));
      wires[1].setAttribute("d", link(p[1], p[2]));
    }

    // Threshold is bound to the node's horizontal position: move it, the preview follows.
    function syncThreshold() {
      const r = lab.getBoundingClientRect();
      const b = nodes[1].getBoundingClientRect();
      const fx = Math.max(0, Math.min(1, (b.left + b.width / 2 - r.left) / r.width));
      const t = 0.14 + fx * 0.62;
      if (valEl) valEl.textContent = t.toFixed(2);
      if (fillEl) fillEl.style.setProperty("--fill", `${(fx * 100).toFixed(0)}%`);
      renderPreview(t);
    }

    let drag = null;
    nodes.forEach((node) => {
      node.addEventListener("pointerdown", (e) => {
        const r = lab.getBoundingClientRect();
        const b = node.getBoundingClientRect();
        drag = { node, dx: e.clientX - (b.left + b.width / 2), dy: e.clientY - (b.top + b.height / 2), r };
        node.setPointerCapture(e.pointerId);
        node.classList.add("is-dragging");
        lab.classList.add("is-touched");
        e.preventDefault();
      });
      node.addEventListener("pointermove", (e) => {
        if (!drag || drag.node !== node) return;
        const { r } = drag;
        const x = ((e.clientX - drag.dx - r.left) / r.width) * 100;
        const y = ((e.clientY - drag.dy - r.top) / r.height) * 100;
        node.style.setProperty("--x", `${Math.max(7, Math.min(93, x)).toFixed(2)}%`);
        node.style.setProperty("--y", `${Math.max(10, Math.min(90, y)).toFixed(2)}%`);
        drawWires();
        syncThreshold();
      });
      const end = () => {
        if (!drag) return;
        drag.node.classList.remove("is-dragging");
        drag = null;
      };
      node.addEventListener("pointerup", end);
      node.addEventListener("pointercancel", end);
    });

    const relayout = () => {
      drawWires();
      syncThreshold();
    };
    addEventListener("resize", relayout);
    requestAnimationFrame(relayout);
    setTimeout(relayout, 300);
  }

  // ===== HERO DECORATION 2 (GoodGo): a route with accessibility stops. Block one and the
  // whole trip fails — the research finding that redirected the project. =====
  const routeDeco = document.querySelector(".hero-route");
  if (routeDeco) {
    const svg = routeDeco.querySelector(".rt-svg");
    const line = routeDeco.querySelector(".rt-line");
    const dot = routeDeco.querySelector(".rt-dot");
    const stops = [...routeDeco.querySelectorAll(".rt-stop")];
    // Normalised anchors, mapped to pixels on layout so the stroke never distorts.
    // Climbs bottom-left to top-right, cutting through the wordmark on the way — the line
    // reads as a journey. Only the middle dip is lowered, to keep its stop off the spec line.
    const anchors = [
      [0.06, 0.76], [0.19, 0.85], [0.33, 0.62], [0.5, 0.72],
      [0.67, 0.42], [0.82, 0.52], [0.95, 0.3],
    ];
    const stopAt = [1, 3, 5];

    function buildRoute() {
      const r = routeDeco.getBoundingClientRect();
      if (!r.width) return;
      svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const pts = anchors.map(([x, y]) => [x * r.width, y * r.height]);
      // Catmull-Rom through the anchors, converted to cubic beziers.
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6}` +
          ` ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6}` +
          ` ${p2[0]},${p2[1]}`;
      }
      line.setAttribute("d", d);
      if (dot) dot.style.setProperty("--route", `path("${d}")`);
      stops.forEach((s, i) => {
        const [x, y] = anchors[stopAt[i]];
        s.style.setProperty("--x", `${x * 100}%`);
        s.style.setProperty("--y", `${y * 100}%`);
      });
    }

    stops.forEach((s) => {
      s.addEventListener("click", (e) => {
        e.stopPropagation();
        s.setAttribute("aria-pressed", s.getAttribute("aria-pressed") === "true" ? "false" : "true");
        routeDeco.classList.toggle(
          "is-broken",
          stops.some((b) => b.getAttribute("aria-pressed") === "true"),
        );
        routeDeco.classList.add("is-touched");
      });
    });

    addEventListener("resize", buildRoute);
    requestAnimationFrame(buildRoute);
    setTimeout(buildRoute, 300);
  }

  // Looping demo clips: hand control back to the viewer when motion is unwelcome.
  if (reduceMotion) {
    document.querySelectorAll("video[autoplay]").forEach((v) => {
      v.autoplay = false;
      v.loop = false;
      v.controls = true;
      v.pause();
    });
  }

  if (reduceMotion) track.style.transition = "none";
  const fromHash = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(fromHash) ? fromHash - 1 : 0, false);
})();
