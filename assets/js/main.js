(() => {
  // ===== SHARED CHROME: single source of truth for the header + footer. The markup is
  // injected into every view's <header class="site-header"> / <footer class="site-footer">
  // shell so there is no duplicated markup to keep in sync across pages. =====
  const HEADER_HTML = `
    <div class="nav" aria-label="Primary navigation">
      <a class="brand" href="#top" data-cursor-hover="true">LUOJINXUAN WANG</a>
      <div class="header-clock"><span>Saarbrücken, DE - </span><time class="header-clock-time">00:00:00</time></div>
      <nav class="nav-links" aria-label="Primary">
        <a href="#work" data-cursor-hover="true">Work</a>
        <a href="#about" data-cursor-hover="true">About</a>
      </nav>
    </div>`;
  const FOOTER_HTML = `
    <div class="container ft-inner">
      <div class="ft-cta">LET\u2019S <span class="outline">TALK.</span></div>
      <div class="ft-links">
        <a href="mailto:alo.rast7@icloud.com" data-cursor-hover="true" aria-label="Email alo.rast7@icloud.com (opens email client)">alo.rast7@icloud.com</a>
        <a href="https://www.linkedin.com/in/alowang/" target="_blank" rel="noopener noreferrer" data-cursor-hover="true">LinkedIn</a>
        <a href="https://github.com/Abandonalo" target="_blank" rel="noopener noreferrer" data-cursor-hover="true">GitHub</a>
      </div>
    </div>`;
  document.querySelectorAll(".site-header").forEach((el) => {
    el.innerHTML = HEADER_HTML;
  });
  document.querySelectorAll(".site-footer").forEach((el) => {
    el.innerHTML = FOOTER_HTML;
  });

  // ===== SETUP: motion/pointer checks and references to page elements. =====
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const smooth = (a, b, n) => {
    const t = clamp((n - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  const progress = document.getElementById("progress");
  const heroSequence = document.getElementById("hero");
  const heroArtboard = document.getElementById("heroArtboard");
  const introArtboard = document.getElementById("introArtboard");
  const introPanels = document.getElementById("introPanels");
  const introPanelEls = [...document.querySelectorAll("[data-intro-panel]")];
  const introSelection = document.getElementById("introSelection");
  const iaNum = introArtboard?.querySelector(".ia-num");
  const iaTextContent = document.getElementById("iaTextContent");
  const iaTypingCursor = document.getElementById("iaTypingCursor");
  const iaSelection = introArtboard?.querySelector(".ia-asel");
  const iaAc = introArtboard?.querySelector(".ia-ac");
  const iaToast = introArtboard?.querySelector(".ia-toast");
  const youCur = document.getElementById("youCur");
  const cascade = document.getElementById("cascade");
  const cards = [...document.querySelectorAll(".case-card")];
  // Cards shown in the home-page sticky stack (a subset; the Work page shows all of them).
  const homeCards = cards.filter((c) => !c.parentElement.classList.contains("home-hidden"));
  const workEyebrow = document.querySelector("#work .section-eyebrow");
  const revealEls = [...document.querySelectorAll(".reveal")];
  const heroShapes = [...document.querySelectorAll(".hero-shape")];
  const roleWord = document.getElementById("roleWord");
  const headerClocks = [...document.querySelectorAll(".header-clock-time")];

  function updateHeaderClock() {
    if (!headerClocks.length) return;
    const t = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
    headerClocks.forEach((el) => {
      el.textContent = t;
    });
  }
  updateHeaderClock();
  setInterval(updateHeaderClock, 1000);

  // ===== ROLE ROTATOR: edit the rotating job titles in this array (keep the a/an). =====
  const roles = ["a UX Designer", "a Software Engineer", "an Applied AI Developer", "a Creative Technologist"];
  let roleIndex = 0;
  if (roleWord && !reduceMotion) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleWord.classList.add("is-changing");
      setTimeout(() => {
        roleWord.textContent = roles[roleIndex];
        roleWord.classList.remove("is-changing");
      }, 300);
    }, 2400);
  }

  if (heroArtboard && heroShapes.length && !reduceMotion) {
    heroArtboard.addEventListener(
      "pointermove",
      (e) => {
        const r = heroArtboard.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        heroShapes.forEach((shape) => {
          const depth = Number(shape.dataset.shapeDepth || 20);
          shape.style.setProperty("--shape-x", `${nx * depth}px`);
          shape.style.setProperty("--shape-y", `${ny * depth}px`);
          const sr = shape.getBoundingClientRect();
          const distance = Math.hypot(e.clientX - (sr.left + sr.width / 2), e.clientY - (sr.top + sr.height / 2));
          shape.style.filter =
            distance < 180
              ? "drop-shadow(0 16px 22px rgba(22,2,14,.16)) saturate(1.2)"
              : "drop-shadow(0 10px 18px rgba(22,2,14,.08))";
        });
      },
      { passive: true },
    );
    heroArtboard.addEventListener("pointerleave", () =>
      heroShapes.forEach((shape) => {
        shape.style.setProperty("--shape-x", "0px");
        shape.style.setProperty("--shape-y", "0px");
        shape.style.filter = "drop-shadow(0 10px 18px rgba(22,2,14,.08))";
      }),
    );
    heroArtboard.addEventListener("pointerdown", (e) => {
      heroShapes.forEach((shape, i) =>
        shape.animate(
          [
            { filter: "drop-shadow(0 10px 18px rgba(22,2,14,.08))", offset: 0 },
            { filter: "drop-shadow(0 20px 28px rgba(255,42,42,.28)) saturate(1.35)", offset: 0.45 },
            { filter: "drop-shadow(0 10px 18px rgba(22,2,14,.08))", offset: 1 },
          ],
          { duration: 520 + i * 90, easing: "cubic-bezier(.16,1,.3,1)" },
        ),
      );
    });
  }

  let cursorX = -80,
    cursorY = -80,
    cursorTX = -80,
    cursorTY = -80;
  if (finePointer && youCur) {
    addEventListener(
      "pointermove",
      (e) => {
        cursorTX = e.clientX + 2;
        cursorTY = e.clientY + 2;
        youCur.classList.add("on");
      },
      { passive: true },
    );
    document.documentElement.addEventListener("pointerleave", () => youCur.classList.remove("on"));
    const moveCursor = () => {
      cursorX += (cursorTX - cursorX) * 0.34;
      cursorY += (cursorTY - cursorY) * 0.34;
      youCur.style.transform = `translate3d(${cursorX}px,${cursorY}px,0)`;
      requestAnimationFrame(moveCursor);
    };
    moveCursor();
  }

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      }),
    { threshold: 0.12 },
  );
  revealEls.forEach((el) => io.observe(el));

  // ===== HERO HEADLINE: edit the typed statement here. em:true = the red word(s). =====
  const iaSegments = [
    { text: "A filmmaker's eye, an engineer's hands. I make complex technology ", em: false },
    { text: "intuitive.", em: true },
  ];
  const iaFullText = iaSegments.map((segment) => segment.text).join("");
  let iaRenderedCharacters = -1;

  function escapeIntroText(value) {
    return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  }

  function renderIntroStatement(characterCount) {
    if (!iaTextContent) return;
    const count = Math.max(0, Math.min(iaFullText.length, Math.round(characterCount)));
    if (count === iaRenderedCharacters) return;
    iaRenderedCharacters = count;
    let remaining = count;
    let html = "";
    iaSegments.forEach((segment) => {
      if (remaining <= 0) return;
      const visible = segment.text.slice(0, remaining);
      if (visible) html += segment.em ? `<em>${escapeIntroText(visible)}</em>` : escapeIntroText(visible);
      remaining -= visible.length;
    });
    iaTextContent.innerHTML = html;
  }

  function updateHeroScroll() {
    if (!heroSequence || !heroArtboard || !introArtboard) return;
    const max = Math.max(1, heroSequence.offsetHeight - innerHeight);
    const p = clamp((scrollY - heroSequence.offsetTop) / max);

    if (reduceMotion) {
      heroArtboard.style.opacity = String(1 - p);
      introArtboard.style.opacity = String(p > 0.35 ? 1 : 0);
      introArtboard.style.transform = "translate3d(0,0,0) rotate(0deg) rotateX(0deg) scale(1)";
      introArtboard.style.borderRadius = "0px";
      introArtboard.style.boxShadow = "none";
      renderIntroStatement(iaFullText.length);
      if (iaNum) {
        iaNum.style.opacity = "1";
        iaNum.style.transform = "translateY(0)";
      }
      if (iaSelection) iaSelection.style.opacity = "1";
      if (iaAc) iaAc.style.opacity = "1";
      if (iaToast) iaToast.style.opacity = "0";
      if (iaTypingCursor) iaTypingCursor.style.opacity = "1";
      return;
    }

    const out = smooth(0.08, 0.72, p);
    const incoming = smooth(0.3, 0.82, p);
    const numberIn = smooth(0.48, 0.57, p);
    const toolsIn = smooth(0.52, 0.62, p);
    const typing = smooth(0.82, 0.96, p);
    const editingOut = smooth(0.96, 0.99, p);
    const typedCharacters = Math.floor(typing * iaFullText.length);

    heroArtboard.style.opacity = String(1 - smooth(0.48, 0.82, p));
    heroArtboard.style.transform = `translate3d(0,${-out * 10}%,${-out * 450}px) rotate(${-out * 8}deg) rotateX(${out * 39}deg) scale(${1 - out * 0.43})`;
    heroArtboard.style.borderRadius = `${out * 38}px`;
    heroArtboard.style.boxShadow = out > 0.01 ? "0 36px 90px rgba(0,0,0,.48),0 0 0 1px rgba(255,199,223,.23)" : "none";

    introArtboard.style.opacity = String(smooth(0.38, 0.62, p));
    introArtboard.style.zIndex = incoming > 0.58 ? "3" : "1";
    introArtboard.style.transform = `translate3d(0,${(1 - incoming) * 145}%,${-520 * (1 - incoming)}px) rotate(${-10 * (1 - incoming)}deg) rotateX(${45 * (1 - incoming)}deg) scale(${0.5 + incoming * 0.5})`;
    introArtboard.style.borderRadius = `${34 * (1 - incoming)}px`;
    introArtboard.style.boxShadow =
      incoming > 0.985 ? "none" : "0 30px 80px rgba(0,0,0,.34),0 0 0 1px rgba(255,255,255,.11)";

    if (iaNum) {
      iaNum.style.opacity = String(numberIn);
      iaNum.style.transform = `translateY(${(1 - numberIn) * 8}px)`;
    }
    if (iaAc) {
      iaAc.style.opacity = String(toolsIn);
      iaAc.style.transform = `translate3d(0,${(1 - toolsIn) * 10}px,0)`;
    }
    if (iaToast) {
      const toastIn = smooth(0.82, 0.87, p);
      const toastOpacity = toastIn * (1 - editingOut);
      iaToast.style.opacity = String(toastOpacity);
      iaToast.style.transform = `translate3d(0,${(1 - toastIn) * 10}px,0)`;
    }

    renderIntroStatement(typedCharacters);
    if (iaSelection) iaSelection.style.opacity = String(smooth(0.83, 0.88, p));
    if (iaTypingCursor) iaTypingCursor.style.opacity = typing > 0 && typing < 1 ? "1" : String(1 - editingOut);
  }

  function updateIntroPanels() {
    if (!introPanels || !introPanelEls.length) return;
    const max = Math.max(1, introPanels.offsetHeight - innerHeight);
    const p = clamp((scrollY - introPanels.offsetTop) / max);
    const split = 0.5;
    introPanelEls.forEach((panel, i) => {
      let opacity, offset;
      if (i === 0) {
        opacity = 1 - smooth(0.36, 0.58, p);
        offset = -smooth(0.36, 0.58, p) * 25;
      } else {
        opacity = smooth(0.42, 0.64, p);
        offset = (1 - smooth(0.42, 0.64, p)) * 30;
      }
      panel.style.opacity = String(opacity);
      panel.style.transform = `translateY(${offset}px)`;
    });
    if (introSelection) {
      const second = p >= split;
      introSelection.querySelector(".intro-asel-lbl").textContent = second ? "p / Statement 03" : "p / Statement 02";
      introSelection.style.top = second ? "43%" : "42%";
      introSelection.style.height = second ? "28%" : "23%";
    }
  }

  // ===== SCROLL EFFECTS: progress bar + case-card stacking on the home page. =====
  // Case-visuals slide slowly left -> right with scroll. Smaller range = slower pan.
  // Photo visuals pan the background image; CSS-art visuals slide via --pan-x translate.
  const IMG_PAN_START = 18,
    IMG_PAN_RANGE = 40,
    ART_PAN_RANGE = 9,
    // Fix: STRIP_PAN_RANGE was 60, panning the filmstrip ~1.5x faster in actual pixels than
    // IMG_PAN_RANGE pans the background image (translateX% is of the strip's own ~2278px
    // width vs backgroundPositionX% of the image's ~2214px cover overflow). 39 makes both
    // travel roughly the same pixel distance over the full scroll range.
    STRIP_PAN_RANGE = 39;
  function panCardVisual(card, p) {
    const v = card && card.querySelector(".case-visual");
    if (!v) return;
    p = clamp(p);
    if (v.classList.contains("visual-strip")) {
      const track = v.querySelector(".strip-track");
      if (track) track.style.setProperty("--strip-x", `${(-p * STRIP_PAN_RANGE).toFixed(2)}%`);
    } else if (v.classList.contains("visual-1"))
      v.style.backgroundPositionX = `${(IMG_PAN_START + p * IMG_PAN_RANGE).toFixed(2)}%`;
    else v.style.setProperty("--pan-x", `${((0.5 - p) * ART_PAN_RANGE).toFixed(2)}%`);
  }
  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    updateHeroScroll();
    updateIntroPanels();

    homeCards.forEach((card, i) => {
      if (innerWidth < 900 || reduceMotion) {
        card.style.transform = "none";
        card.style.filter = "none";
        card.style.opacity = "1";
        const rv = card.querySelector(".case-visual");
        if (rv) {
          rv.style.backgroundPositionX = "center";
          rv.style.setProperty("--pan-x", "0px");
          rv.querySelector(".strip-track")?.style.setProperty("--strip-x", "0%");
        }
        return;
      }
      const next = homeCards[i + 1];
      let t = 0;
      if (next) {
        const nr = next.getBoundingClientRect();
        t = clamp((innerHeight - nr.top) / (innerHeight * 0.92));
      }
      // Recede in place (no upward drift) so the next card rises to fully cover this one.
      card.style.transform = `scale(${(1 - t * 0.09).toFixed(4)})`;
      card.style.filter = t > 0.01 ? `blur(${(t * 6).toFixed(2)}px)` : "none";
      card.style.opacity = (1 - t * 0.88).toFixed(4);

      // Slowly pan the thumbnail image left -> right as the card scrolls past.
      const rect = card.getBoundingClientRect();
      const enter = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      panCardVisual(card, enter * 0.55 + t * 0.45);
    });

    // Selected-work eyebrow: pinned through cases 1-4, then rises up together with the
    // last case as it scrolls up to cover the previous one (avoids title overlap).
    if (workEyebrow) {
      const last = homeCards[homeCards.length - 1];
      if (last && innerWidth >= 900 && !reduceMotion) {
        const pin = innerHeight * 0.5 - Math.min(innerHeight * 0.425, 390);
        const off = workEyebrow.getBoundingClientRect().height + 24;
        const top5 = last.getBoundingClientRect().top;
        // Pinned until case 05 fully covers case 04 (its top reaches the pin line),
        // then rises up 1:1 as case 05 scrolls away - leaving together with it.
        const rise = clamp(pin - top5, 0, off);
        workEyebrow.style.transform = rise > 0 ? `translate3d(0,${(-rise).toFixed(1)}px,0)` : "none";
      } else {
        workEyebrow.style.transform = "none";
      }
    }

    if (cascade && !reduceMotion) {
      const r = cascade.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height * 0.45));
      cascade.querySelectorAll(".cascade-card").forEach((card, i) => {
        const spread = p * (i * 22);
        const rot = (i % 2 ? 1 : -1) * (2.2 + p * i * 0.45);
        card.style.transform = `translate3d(${spread}px,${spread * 0.72}px,${i * -10}px) rotate(${rot}deg)`;
      });
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  const siteHeader = document.querySelector(".site-header");
  let lastNavY = scrollY;
  addEventListener(
    "scroll",
    () => {
      if (!siteHeader) return;
      const y = scrollY;
      const delta = y - lastNavY;
      if (Math.abs(delta) < 6) return;
      const inHero = heroSequence
        ? y < heroSequence.offsetTop + (heroSequence.offsetHeight - innerHeight) * 0.48
        : y < innerHeight;
      siteHeader.classList.toggle("nav-hidden", delta > 0 && !inHero);
      lastNavY = y;
    },
    { passive: true },
  );

  cascade?.addEventListener("pointermove", (e) => {
    if (reduceMotion) return;
    const r = cascade.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    cascade.querySelectorAll(".cascade-card").forEach((card, i) => {
      const base = (i + 1) * 7;
      card.style.marginLeft = `${nx * base}px`;
      card.style.marginTop = `${ny * base}px`;
    });
  });
  cascade?.addEventListener("pointerleave", () =>
    cascade.querySelectorAll(".cascade-card").forEach((card) => {
      card.style.marginLeft = "0";
      card.style.marginTop = "0";
    }),
  );

  function tiltCard(card, e) {
    if (reduceMotion || innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const v = card.querySelector(".case-visual");
    if (v) v.style.translate = `calc(var(--pan-x,0px) + ${(x * 18).toFixed(1)}px) ${(y * 14).toFixed(1)}px`;
  }

  const modal = document.getElementById("caseModal");
  const csContent = document.getElementById("csContent");
  let returnFocus = null;

  const selRoot = document.getElementById("selTransition");
  let selBusy = false;
  function playSelTransition(x, y, cb) {
    if (selBusy || !selRoot || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cb();
      return;
    }
    selBusy = true;
    selRoot.style.display = "block";
    const blur = document.createElement("div");
    blur.className = "sel-blur";
    const box = document.createElement("div");
    box.className = "sel-box";
    box.innerHTML =
      '<div class="sel-label">Navigate</div><div class="sel-handle tl"></div><div class="sel-handle tr"></div><div class="sel-handle bl"></div><div class="sel-handle br"></div><div class="sel-dims"></div>';
    const flash = document.createElement("div");
    flash.className = "sel-flash";
    selRoot.append(blur, box, flash);
    const dims = box.querySelector(".sel-dims"),
      label = box.querySelector(".sel-label");
    const W = innerWidth,
      H = innerHeight,
      w0 = 50,
      h0 = 36,
      x0 = x - w0 / 2,
      y0 = y - h0 / 2;
    box.style.cssText += `left:${x0}px;top:${y0}px;width:${w0}px;height:${h0}px`;
    const back = "cubic-bezier(.34,1.56,.64,1)";
    box.animate(
      [
        { opacity: 0, transform: "scale(.4)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 180, easing: back, fill: "forwards" },
    );
    box.querySelectorAll(".sel-handle").forEach((h, i) =>
      h.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
        duration: 150,
        delay: 100 + i * 30,
        easing: back,
        fill: "forwards",
      }),
    );
    blur.animate(
      [
        { backdropFilter: "blur(0px) brightness(1)", background: "rgba(255,255,255,0)" },
        { backdropFilter: "blur(6px) brightness(1.15)", background: "rgba(255,255,255,.55)" },
      ],
      { duration: 250, delay: 80, easing: "ease-out", fill: "forwards" },
    );
    box.animate([{ boxShadow: "0 0 0px rgba(247,164,196,0)" }, { boxShadow: "0 0 30px rgba(247,164,196,.35)" }], {
      duration: 200,
      delay: 100,
      fill: "forwards",
    });
    setTimeout(() => {
      const t0 = performance.now(),
        D = 500;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / D);
        const e = p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2;
        const w = w0 + (W + 4 - w0) * e,
          h = h0 + (H + 4 - h0) * e;
        box.style.width = w + "px";
        box.style.height = h + "px";
        box.style.left = x0 + (-2 - x0) * e + "px";
        box.style.top = y0 + (-2 - y0) * e + "px";
        const txt = `${Math.round(w)} × ${Math.round(h)}`;
        dims.textContent = txt;
        label.textContent = txt;
        if (p < 1) requestAnimationFrame(step);
        else {
          flash.animate([{ opacity: 0 }, { opacity: 0.1 }], { duration: 60, fill: "forwards" });
          setTimeout(() => {
            cb();
            flash.animate([{ opacity: 0.1 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "forwards" });
            blur.animate(
              [
                { backdropFilter: "blur(6px) brightness(1.15)", background: "rgba(255,255,255,.55)" },
                { backdropFilter: "blur(0px) brightness(1)", background: "rgba(255,255,255,0)" },
              ],
              { duration: 300, fill: "forwards" },
            );
            box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "forwards" });
            setTimeout(() => {
              blur.remove();
              box.remove();
              flash.remove();
              selRoot.style.display = "none";
              selBusy = false;
            }, 330);
          }, 80);
        }
      };
      requestAnimationFrame(step);
    }, 430);
  }
  function selPointFromEvent(e, el) {
    if (e && (e.clientX || e.clientY)) return { x: e.clientX, y: e.clientY };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // ===== CASE STUDY: full editorial page injected into #csContent. Add projects to caseStudies. =====
  const caseStudies = {
    chaldene: {
      title: "Chaldene",
      lead: "A node-based visual programming environment that makes complex image-processing pipelines observable, tunable, and approachable.",
      hero: "assets/images/cs-chaldene-workflow.jpg",
      meta: {
        Role: "UX & frontend, research assistant",
        Team: "DFKI HCI group",
        Duration: "2024 to 2025",
        Company: "DFKI",
      },
      problem:
        "Researchers with limited programming experience needed to build and tune image-processing pipelines, but the tools made it hard to see what each step did or to explore parameters without rewriting code.",
      whatIDidIntro:
        "I extended Chaldene, a node-based visual programming language in JupyterLab, working directly with researchers to turn their needs into interaction concepts and shipping the features across the frontend and backend.",
      whatIDid: [
        "Batch processing to run a finished pipeline across a whole folder of images.",
        "Direct-manipulation cropping: drag a box on the image or type exact values.",
        "Per-node difference maps that show exactly what each step changed.",
        "Grid search to sweep parameter ranges and compare every result in a gallery.",
      ],
      result:
        "The pipelines became observable, tunable, and approachable. Researchers could see each step's effect, explore parameter ranges visually, and adjust workflows without touching code.",
      video: "xu5FFn5Igi4",
      shots: [
        {
          src: "assets/images/cs-chaldene-batch.jpg",
          cap: "Batch process: run a pipeline over a folder and preview every result.",
        },
        {
          src: "assets/images/cs-chaldene-crop.jpg",
          cap: "Cropping: an on-node widget with input fields, plus an interactive dialog.",
        },
        {
          src: "assets/images/cs-chaldene-diff.jpg",
          cap: "Binary dilation node with an optional difference map (green shows what changed).",
          wide: true,
        },
        {
          src: "assets/images/cs-chaldene-gridsearch.jpg",
          cap: "Grid search: define parameter ranges and preview each combination.",
          wide: true,
        },
        {
          src: "assets/images/cs-chaldene-gallery.jpg",
          cap: "Grid search gallery: compare the full matrix of outputs at a glance.",
          wide: true,
        },
      ],
    },
    goodgo: {
      title: "GoodGo Map",
      lead: "An accessible navigation concept that replaces generic walking directions with wheeling-specific route effort, facility intelligence, and community reporting.",
      heroStrip: [
        "assets/images/cs-goodgo-hero.png",
        "assets/images/cs-goodgo-drive.png",
        "assets/images/cs-goodgo-info.png",
        "assets/images/cs-goodgo-preference.png",
        "assets/images/cs-goodgo-report.png",
        "assets/images/cs-goodgo-wheel.png",
      ],
      meta: {
        Role: "UX research & product design",
        Type: "Concept project",
        Focus: "Accessibility",
        Tools: "Figma, user study",
      },
      problem:
        "Mainstream map apps assume walking. Wheelchair users are left guessing about kerbs, steps, ramps, lifts, and accessible toilets, and about how much physical effort a route really takes. The few accessibility apps that exist bury this information behind filters or cover too little to plan a real trip.",
      whatIDidIntro:
        "I designed GoodGo around how wheelchair users actually plan and move, grounding every feature in a persona, survey data, and a competitive teardown before shaping the flows and screens.",
      whatIDid: [
        "Ran a survey and built a wheelchair-user persona to anchor the needs, pain points, and motivations.",
        "Audited competitors (Rong Chang, Wheelmap) to find the gaps in accessible navigation.",
        "Mapped an information architecture and end-to-end user flow covering search, routing, facilities, and reporting.",
        "Designed wheeling-specific routing with 'wheel intensity', effort-based route options, and accessible-parking destinations.",
        "Added facility detail pages, accessible-facility filters, and a lightweight problem-reporting flow for community upkeep.",
      ],
      result:
        "GoodGo turns accessibility from an afterthought into the core of the routing experience, surfacing effort, facilities, and reliability up front so wheelchair users can plan a trip with confidence instead of guesswork.",
      shots: [
        {
          src: "assets/images/cs-goodgo-survey.png",
          cap: "Survey results: which accessibility information matters most and how wheelchair users plan trips.",
          wide: true,
        },
        {
          src: "assets/images/cs-goodgo-research.png",
          cap: "Competitive audit of Rong Chang and Wheelmap, plus the resulting information architecture.",
          wide: true,
        },
        {
          group: "split",
          left: [
            {
              src: "assets/images/cs-goodgo-persona2.png",
              cap: "Persona synthesis: mapping demographics, behaviours, goals, and pain points.",
            },
            {
              src: "assets/images/cs-goodgo-scenario.png",
              cap: "User scenario: a day in Millie's life, grounding the design in real, everyday friction.",
            },
          ],
          right: {
            src: "assets/images/cs-goodgo-userflow.png",
            cap: "End-to-end user flow, from destination search to arrival, rating, and reporting.",
          },
        },
        {
          src: "assets/images/cs-goodgo-wireframe.png",
          cap: "Low-fidelity wireframes exploring the core screens and navigation.",
          wide: true,
        },
      ],
    },
    veramolnar: {
      title: "How To: Vera Molnár",
      lead: "An interactive introduction that teaches the ideas behind Vera Molnár's generative art by letting you play with the rules that create it.",
      meta: {
        Role: "Interaction design, UX, video",
        Type: "University project",
        Duration: "2022 to 2023",
        Focus: "Learning experience",
      },
      problem:
        "Vera Molnár's work looks simple but rests on algorithmic ideas, such as rules, repetition, and controlled randomness, that are hard to grasp from wall text alone. Newcomers see the output but not the system that produces it.",
      whatIDidIntro:
        "I designed a guided learning experience that turns her concepts into something you understand by doing, and produced the teaser video that frames the story.",
      whatIDid: [
        "Mapped a user journey that introduces one generative concept at a time, from ordered grids to her famous '1% disorder'.",
        "Designed interactive learning mechanics where people adjust the rules and watch the composition respond in real time.",
        "Translated art-historical concepts into plain, playful interaction language.",
        "Produced and edited the teaser video to set the tone and invite people in.",
      ],
      result:
        "The concepts became approachable. Instead of reading about Molnár's methods, visitors could feel how small changes in rules and randomness reshape an entire composition, learning the system rather than just seeing the art.",
    },
  };
  const esc = (v) =>
    String(v == null ? "" : v).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  function buildCaseStudy(key, card) {
    const cs = caseStudies[key] || {};
    const title = esc(cs.title || card.dataset.title || "Case study");
    const lead = esc(cs.lead || card.dataset.subtitle || "");
    const heroImg = cs.heroStrip
      ? `<div class="cs-hero-media cs-hero-collage">${cs.heroStrip.map((s) => `<img src="${esc(s)}" alt="" loading="eager">`).join("")}</div>`
      : cs.hero
        ? `<div class="cs-hero-media"><img src="${esc(cs.hero)}" alt="" loading="eager"></div>`
        : "";
    let meta;
    if (cs.meta) {
      meta =
        '<aside class="cs-meta">' +
        Object.entries(cs.meta)
          .map(
            ([k, v]) =>
              `<div><span class="cs-meta-label">${esc(k)}</span><span class="cs-meta-val">${esc(v)}</span></div>`,
          )
          .join("") +
        "</aside>";
    } else {
      meta = `<aside class="cs-meta"><div><span class="cs-meta-label">Project</span><span class="cs-meta-val">${esc(card.dataset.title)}</span></div></aside>`;
    }
    const videoBlock = cs.video
      ? `<section class="cs-section cs-media"><a class="cs-video cs-video--facade" href="https://www.youtube.com/watch?v=${esc(cs.video)}" target="_blank" rel="noopener noreferrer" data-video="${esc(cs.video)}" aria-label="Play the walkthrough"><img src="https://i.ytimg.com/vi/${esc(cs.video)}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${esc(cs.video)}/hqdefault.jpg'" alt="Video thumbnail" loading="lazy"><span class="cs-play" aria-hidden="true"></span></a></section>`
      : "";
    let sections = "";
    const problem = cs.problem || card.dataset.description;
    if (problem) sections += `<section class="cs-section"><h2>Problem</h2><p>${esc(problem)}</p></section>`;
    if (cs.whatIDidIntro || cs.whatIDid || cs.shots) {
      const intro = cs.whatIDidIntro ? `<p>${esc(cs.whatIDidIntro)}</p>` : "";
      const list = cs.whatIDid ? `<ul>${cs.whatIDid.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
      const fig = (s) =>
        `<figure${s.wide ? ' class="wide"' : ""}><img src="${esc(s.src)}" alt="${esc(s.cap)}" loading="lazy"><figcaption>${esc(s.cap)}</figcaption></figure>`;
      // A "split" group renders a stacked left column beside a single tall figure on the right.
      const renderShot = (s) =>
        s.group === "split"
          ? `<div class="cs-shots-split"><div class="cs-split-main">${s.left.map(fig).join("")}</div><div class="cs-split-side">${fig(s.right)}</div></div>`
          : fig(s);
      const shots = cs.shots ? `<div class="cs-shots">${cs.shots.map(renderShot).join("")}</div>` : "";
      sections += `<section class="cs-section"><h2>What I did</h2>${intro}${list}${shots}</section>`;
    }
    if (cs.result) sections += `<section class="cs-section"><h2>Result</h2><p>${esc(cs.result)}</p></section>`;
    const order = cards.map((c) => c.dataset.project),
      titles = Object.fromEntries(cards.map((c) => [c.dataset.project, c.dataset.title]));
    const idx = order.indexOf(key),
      nextKey = order[(idx + 1) % order.length];
    const foot = `<footer class="cs-foot"><a class="cs-next" href="#" data-next="${esc(nextKey)}"><span class="cs-eyebrow">Next project</span><b>${esc(titles[nextKey] || "Next")}</b></a><a class="cs-back" href="#">Back to work</a></footer>`;
    return (
      `<section class="cs-hero">${heroImg}<div class="cs-hero-inner"><h1 class="cs-title" id="csTitle">${title}</h1>${lead ? `<p class="cs-lead">${lead}</p>` : ""}</div></section>` +
      `<div class="cs-body">${meta}<div class="cs-main">${videoBlock}${sections}</div></div>` +
      foot
    );
  }
  function openCase(card, animate = true) {
    returnFocus = card;
    const rect = card.getBoundingClientRect();
    csContent.innerHTML = buildCaseStudy(card.dataset.project, card);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
    caseHeader?.classList.remove("nav-hidden");
    lastCaseY = 0;
    requestAnimationFrame(() => modal.querySelector(".site-header .brand")?.focus?.());
    if (animate && !reduceMotion) {
      modal.animate(
        [
          {
            clipPath: `inset(${rect.top}px ${innerWidth - rect.right}px ${innerHeight - rect.bottom}px ${rect.left}px round 0px)`,
            opacity: 0.4,
          },
          { clipPath: "inset(0 0 0 0 round 0px)", opacity: 1 },
        ],
        { duration: 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
      );
    }
  }
  function closeCase() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    csContent.innerHTML = "";
    returnFocus?.focus?.();
  }
  const cardByProject = (k) => cards.find((c) => c.dataset.project === k);
  // Delegated clicks inside the case study: video play, next project, back to work.
  csContent?.addEventListener("click", (e) => {
    const facade = e.target.closest(".cs-video--facade");
    if (facade) {
      if (location.protocol === "file:") return; // open on YouTube (anchor default) when viewed as a local file
      e.preventDefault();
      const box = document.createElement("div");
      box.className = "cs-video";
      box.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' +
        facade.dataset.video +
        '?autoplay=1&rel=0" title="Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      facade.replaceWith(box);
      return;
    }
    const nxt = e.target.closest(".cs-next");
    if (nxt) {
      e.preventDefault();
      const c = cardByProject(nxt.dataset.next);
      if (c) openCase(c, false);
      return;
    }
    const back = e.target.closest(".cs-back");
    if (back) {
      e.preventDefault();
      closeCase();
      openWork(true);
      return;
    }
  });
  // Case study header: same nav as the rest of the site.
  const caseHeader = modal.querySelector(".site-header");
  caseHeader?.querySelector(".brand")?.addEventListener("click", (e) => {
    e.preventDefault();
    closeCase();
    goHome();
  });
  caseHeader?.querySelectorAll('.nav-links a[href="#work"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      closeCase();
      openWork(true);
    }),
  );
  caseHeader?.querySelectorAll('.nav-links a[href="#about"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      closeCase();
      openProfile(true);
    }),
  );
  // Header hide-on-scroll-down / show-on-scroll-up, matching the other pages.
  let lastCaseY = 0;
  modal?.addEventListener(
    "scroll",
    () => {
      if (!caseHeader) return;
      const y = modal.scrollTop,
        delta = y - lastCaseY;
      if (Math.abs(delta) >= 6) {
        caseHeader.classList.toggle("nav-hidden", delta > 0 && y > 80);
        lastCaseY = y;
      }
    },
    { passive: true },
  );

  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => tiltCard(card, e));
    card.addEventListener("pointerleave", () => {
      const v = card.querySelector(".case-visual");
      if (v) v.style.translate = "";
    });
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".fw-card__bottom")) return;
      const p = selPointFromEvent(e, card);
      playSelTransition(p.x, p.y, () => openCase(card));
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const p = selPointFromEvent(null, card);
        playSelTransition(p.x, p.y, () => openCase(card));
      }
    });
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("open")) closeCase();
  });

  const profileView = document.getElementById("profileView");
  const profileOpen = document.getElementById("profileOpen");
  const profileClose = document.getElementById("profileClose");
  const profileProgress = document.getElementById("profileProgress");
  const profileRevealEls = [...document.querySelectorAll(".profile-reveal")];
  const pageMain = document.querySelector("main");
  const pageHeader = document.querySelector(".site-header");
  let profileReturnFocus = null;

  const profileObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      }),
    { root: profileView, threshold: 0.1 },
  );
  profileRevealEls.forEach((el) => profileObserver.observe(el));

  function setPageInert(value) {
    [pageMain, pageHeader].forEach((el) => {
      if (!el) return;
      if (value) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
  }
  // ===== PROFILE PAGE: open/close logic + photo parallax + ALT labels. =====
  function openProfile(updateHistory = true) {
    if (!profileView || profileView.classList.contains("open")) return;
    if (workView?.classList.contains("open")) closeWork(false);
    profileReturnFocus = document.activeElement;
    profileView.classList.add("open");
    profileView.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-open");
    setPageInert(true);
    profileView.scrollTop = 0;
    if (typeof runParallax === "function") {
      runParallax();
      requestAnimationFrame(runParallax);
      setTimeout(runParallax, 80);
      setTimeout(runParallax, 260);
    }
    if (updateHistory && location.hash !== "#profile") history.pushState({ profile: true }, "", "#profile");
    requestAnimationFrame(() => profileClose?.focus());
  }
  function closeProfile(updateHistory = true) {
    if (!profileView || !profileView.classList.contains("open")) return;
    profileView.classList.remove("open");
    profileView.setAttribute("aria-hidden", "true");
    document.body.classList.remove("profile-open");
    setPageInert(false);
    if (updateHistory && location.hash === "#profile") {
      if (history.state?.profile) history.back();
      else history.replaceState(null, "", location.pathname + location.search);
    }
    profileReturnFocus?.focus?.();
  }
  profileOpen?.addEventListener("click", (e) => {
    e.preventDefault();
    const p = selPointFromEvent(e, profileOpen);
    playSelTransition(p.x, p.y, () => openProfile(true));
  });
  pageHeader?.querySelectorAll('.nav-links a[href="#about"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const p = selPointFromEvent(e, a);
      playSelTransition(p.x, p.y, () => openProfile(true));
    }),
  );
  profileClose?.addEventListener("click", () => closeProfile(true));
  profileView?.querySelector(".site-header .brand")?.addEventListener("click", (e) => {
    e.preventDefault();
    const p = selPointFromEvent(e, e.currentTarget);
    playSelTransition(p.x, p.y, () => goHome());
  });
  profileView?.querySelectorAll('.nav-links a[href="#work"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const p = selPointFromEvent(e, a);
      playSelTransition(p.x, p.y, () => {
        closeProfile(false);
        openWork(true);
      });
    }),
  );
  const profileHeader = profileView?.querySelector(".site-header");
  let lastProfileY = 0;
  profileView?.addEventListener(
    "scroll",
    () => {
      const max = profileView.scrollHeight - profileView.clientHeight;
      const ratio = max > 0 ? profileView.scrollTop / max : 0;
      if (profileProgress) profileProgress.style.width = `${ratio * 100}%`;
      runParallax();
      if (profileHeader) {
        const y = profileView.scrollTop;
        const delta = y - lastProfileY;
        if (Math.abs(delta) >= 6) {
          profileHeader.classList.toggle("nav-hidden", delta > 0 && y > 80);
          lastProfileY = y;
        }
      }
    },
    { passive: true },
  );
  profileView?.querySelectorAll('a[href^="#profile"]').forEach((link) =>
    link.addEventListener("click", (e) => {
      const target = profileView.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }),
  );
  profileView?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeProfile(true);
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = [
      ...profileView.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'),
    ].filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  // Hybrid about-hero: parallax image column + hover-to-reveal previews
  // ===== PHOTO COLLAGE: fade-in on load + Figma-style ALT label on hover. =====
  const parImgs = [...(profileView?.querySelectorAll(".p-img-wrap") || [])];
  const youAlt = document.getElementById("youAlt");
  const escAlt = (v) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  parImgs.forEach((w) => {
    const im = w.querySelector("img");
    if (!im) return;
    const show = () => im.classList.add("shown");
    im.complete && im.naturalWidth > 0 ? show() : im.addEventListener("load", show);
    if (youAlt && finePointer) {
      w.addEventListener("pointerenter", () => {
        youAlt.innerHTML = '<b>ALT</b> "' + escAlt(im.getAttribute("alt") || "") + '"';
        youAlt.classList.add("on");
      });
      w.addEventListener("pointerleave", () => youAlt.classList.remove("on"));
    }
  });
  const hybridSection = profileView?.querySelector(".profile-hybrid");
  function runParallax() {
    if (reduceMotion || !parImgs.length || !hybridSection) return;
    const vh = profileView.clientHeight || innerHeight;
    const rect = hybridSection.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - vh)));
    parImgs.forEach((el) => {
      const base = el.classList.contains("p-fast") ? 6 : el.classList.contains("p-med") ? 6 : 4;
      const max = el.classList.contains("p-fast") ? 26 : el.classList.contains("p-med") ? 22 : 18;
      const val = base + (max - base) * p;
      el.style.transform = `translateY(${(-val).toFixed(2)}%)`;
    });
  }
  const hoverTriggers = [...(profileView?.querySelectorAll(".hover-trigger[data-img]") || [])].filter((t) =>
    t.getAttribute("data-img"),
  );
  if (hoverTriggers.length) {
    const hoverPreview = document.createElement("div");
    hoverPreview.className = "hover-preview";
    const hpImg = document.createElement("img");
    hoverPreview.appendChild(hpImg);
    document.body.appendChild(hoverPreview);
    hoverTriggers.forEach((t) => {
      const src = t.getAttribute("data-img");
      t.addEventListener("mouseenter", () => {
        hpImg.src = src;
        hoverPreview.classList.add("show");
      });
      t.addEventListener("mousemove", (e) => {
        hoverPreview.style.left = e.clientX + "px";
        hoverPreview.style.top = e.clientY - 150 + "px";
      });
      t.addEventListener("mouseleave", () => hoverPreview.classList.remove("show"));
    });
  }

  // ===== WORK route - dark overlay with lined-up (non-cascade) case cards =====
  const workView = document.getElementById("workView");
  const workProgress = document.getElementById("workProgress");
  const workList = workView?.querySelector(".work-list");
  let workReturnFocus = null;

  if (workList) {
    document.querySelectorAll(".case-stack .fw-card-wrapper").forEach((w) => {
      workList.appendChild(w.cloneNode(true));
    });
    workList.querySelectorAll(".case-card").forEach((card) => {
      card.removeAttribute("id");
      // Drop home-page stacking styles copied by cloneNode (transform/blur/opacity + stale pan).
      card.style.transform = "";
      card.style.filter = "";
      card.style.opacity = "";
      const cv = card.querySelector(".case-visual");
      if (cv) {
        cv.style.backgroundPositionX = "";
        cv.style.translate = "";
        cv.style.removeProperty("--pan-x");
      }
      card.addEventListener("pointermove", (e) => tiltCard(card, e));
      card.addEventListener("pointerleave", () => {
        const v = card.querySelector(".case-visual");
        if (v) v.style.translate = "";
      });
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".fw-card__bottom")) return;
        const p = selPointFromEvent(e, card);
        playSelTransition(p.x, p.y, () => openCase(card));
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const p = selPointFromEvent(null, card);
          playSelTransition(p.x, p.y, () => openCase(card));
        }
      });
    });
  }

  function openWork(updateHistory = true) {
    if (!workView || workView.classList.contains("open")) return;
    if (profileView?.classList.contains("open")) closeProfile(false);
    workReturnFocus = document.activeElement;
    workView.classList.add("open");
    workView.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-open");
    setPageInert(true);
    workView.scrollTop = 0;
    if (updateHistory && location.hash !== "#work") history.pushState({ work: true }, "", "#work");
    requestAnimationFrame(() => {
      updateWorkVisuals();
      workView.querySelector(".nav-links a")?.focus();
    });
  }
  function closeWork(updateHistory = true) {
    if (!workView || !workView.classList.contains("open")) return;
    workView.classList.remove("open");
    workView.setAttribute("aria-hidden", "true");
    if (!profileView?.classList.contains("open")) {
      document.body.classList.remove("profile-open");
      setPageInert(false);
    }
    if (updateHistory && location.hash === "#work") {
      if (history.state?.work) history.back();
      else history.replaceState(null, "", location.pathname + location.search);
    }
    workReturnFocus?.focus?.();
  }

  function goHome() {
    closeWork(false);
    closeProfile(false);
    if (location.hash) history.pushState(null, "", location.pathname + location.search);
  }
  pageHeader?.querySelectorAll('.nav-links a[href="#work"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const p = selPointFromEvent(e, a);
      playSelTransition(p.x, p.y, () => openWork(true));
    }),
  );
  workView?.querySelector(".brand")?.addEventListener("click", (e) => {
    e.preventDefault();
    const p = selPointFromEvent(e, e.currentTarget);
    playSelTransition(p.x, p.y, () => goHome());
  });
  workView?.querySelectorAll('.nav-links a[href="#about"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const p = selPointFromEvent(e, a);
      playSelTransition(p.x, p.y, () => {
        closeWork(false);
        openProfile(true);
      });
    }),
  );
  let lastWorkY = 0;
  const workHeader = workView?.querySelector(".site-header");
  function updateWorkVisuals() {
    if (!workList) return;
    const vh = workView.clientHeight;
    workList.querySelectorAll(".case-card").forEach((card) => {
      if (reduceMotion) {
        const v = card.querySelector(".case-visual");
        if (v) {
          v.style.backgroundPositionX = "center";
          v.style.setProperty("--pan-x", "0px");
          v.querySelector(".strip-track")?.style.setProperty("--strip-x", "0%");
        }
        return;
      }
      const rect = card.getBoundingClientRect();
      panCardVisual(card, (vh - rect.top) / (vh + rect.height));
    });
  }
  workView?.addEventListener(
    "scroll",
    () => {
      const max = workView.scrollHeight - workView.clientHeight;
      const ratio = max > 0 ? workView.scrollTop / max : 0;
      if (workProgress) workProgress.style.width = `${ratio * 100}%`;
      updateWorkVisuals();
      if (workHeader) {
        const y = workView.scrollTop,
          delta = y - lastWorkY;
        if (Math.abs(delta) >= 6) {
          workHeader.classList.toggle("nav-hidden", delta > 0 && y > 80);
          lastWorkY = y;
        }
      }
    },
    { passive: true },
  );
  workView?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeWork(true);
    }
  });

  addEventListener("popstate", () => {
    if (location.hash === "#profile") openProfile(false);
    else if (location.hash === "#work") openWork(false);
    else {
      closeProfile(false);
      closeWork(false);
    }
  });
  if (location.hash === "#profile") openProfile(false);
  else if (location.hash === "#work") openWork(false);
})();
