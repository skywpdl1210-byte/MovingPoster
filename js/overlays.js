(function () {
  "use strict";

  const config = window.PosterConfig;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const posterImage = new Image();
  posterImage.src = "assets/poster.png";

  const clusterCanvas = document.getElementById("cluster-canvas");
  const pathCanvas = document.getElementById("path-canvas");
  const walkerEl = document.getElementById("walker");
  const walkerMaskEl = document.getElementById("walker-mask");
  const walkPathEl = document.getElementById("walk-path");
  const secondaryPathEl = document.getElementById("secondary-path");
  const branchPathEl = document.getElementById("branch-path");

  let posterRect = null;
  let clusterCtx = null;
  let pathCtx = null;
  let clusterDots = [];
  let pathDots = [];
  let startTime = performance.now();
  let animationId = null;

  const pathElements = [walkPathEl, secondaryPathEl, branchPathEl];
  const pathData = [config.walkPath, config.secondaryPath, config.branchPath];

  function setPaths() {
    pathElements.forEach((el, i) => {
      if (el && pathData[i]) el.setAttribute("d", pathData[i]);
    });
  }

  function init() {
    if (!clusterCanvas || !pathCanvas) return;

    clusterCtx = clusterCanvas.getContext("2d");
    pathCtx = pathCanvas.getContext("2d");

    setPaths();
    resize();
    initClusterDots();
    initPathDots();

    if (reducedMotion) {
      drawStaticFrame();
      return;
    }

    animationId = requestAnimationFrame(animate);
  }

  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nw = posterImage.naturalWidth || config.naturalWidth;
    const nh = posterImage.naturalHeight || config.naturalHeight;

    posterRect = PosterLayout.getPosterRect(vw, vh, nw, nh);

    clusterCanvas.width = vw;
    clusterCanvas.height = vh;
    pathCanvas.width = vw;
    pathCanvas.height = vh;

    const svg = document.getElementById("path-defs");
    if (svg) {
      svg.setAttribute("viewBox", `0 0 ${nw} ${nh}`);
    }

    positionWalkerMask();
    positionWalker();
  }

  function positionWalkerMask() {
    const m = config.walkerMask;
    const topLeft = PosterLayout.posterToScreen(posterRect, m.x, m.y);
    const bottomRight = PosterLayout.posterToScreen(
      posterRect,
      m.x + m.w,
      m.y + m.h
    );

    walkerMaskEl.style.left = `${topLeft.x}px`;
    walkerMaskEl.style.top = `${topLeft.y}px`;
    walkerMaskEl.style.width = `${bottomRight.x - topLeft.x}px`;
    walkerMaskEl.style.height = `${bottomRight.y - topLeft.y}px`;
    walkerMaskEl.style.backgroundColor = m.color;
  }

  function positionWalker() {
    const scale = PosterLayout.screenScale(posterRect);
    const size = config.walker.size * scale;
    walkerEl.style.width = `${size}px`;
    walkerEl.style.height = `${size}px`;
  }

  function initClusterDots() {
    const c = config.cluster;
    clusterDots = Array.from({ length: c.dotCount }, () => createClusterDot(c));
  }

  function createClusterDot(c) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * c.radius * 0.5;
    return {
      px: c.cx + Math.cos(angle) * dist,
      py: c.cy + Math.sin(angle) * dist,
      radius: 1.2 + Math.random() * 3.2,
      alpha: 0.15 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      spread: Math.random() * c.radius * 0.4,
      life: Math.random() * 3,
    };
  }

  function initPathDots() {
    pathDots = Array.from({ length: config.pathDots.count }, (_, i) => ({
      pathIndex: i % pathElements.length,
      progress: Math.random(),
      speed: 0.65 + Math.random() * 0.7,
      alpha: Math.random() * 0.3,
      maxAlpha: 0.3 + Math.random() * 0.45,
      fading: false,
    }));
  }

  function pointOnPath(pathEl, progress) {
    const len = pathEl.getTotalLength();
    const pt = pathEl.getPointAtLength(len * progress);
    return PosterLayout.posterToScreen(posterRect, pt.x, pt.y);
  }

  function updateWalker(elapsed) {
    const w = config.walker;
    const progress = (elapsed / (w.duration * 1000)) % 1;
    const pt = walkPathEl.getPointAtLength(
      walkPathEl.getTotalLength() * progress
    );
    const screen = PosterLayout.posterToScreen(posterRect, pt.x, pt.y);
    const scale = PosterLayout.screenScale(posterRect);

    const bob =
      Math.sin(elapsed * 0.001 * w.bobSpeed * Math.PI * 2) *
      w.bobAmplitude *
      scale;

    const wobble =
      Math.sin(elapsed * 0.001 * w.wobbleSpeed * Math.PI * 2) * w.wobbleDegrees;

    const frame = Math.floor(elapsed * 0.001 / w.frameInterval) % 2;
    walkerEl.dataset.frame = String(frame);

    const size = parseFloat(walkerEl.style.width) || 60;
    walkerEl.style.transform = `translate(${screen.x - size * 0.5}px, ${screen.y - size * 0.85 + bob}px) rotate(${wobble}deg)`;
  }

  function updateClusterDots(dt) {
    const c = config.cluster;

    clusterDots.forEach((dot) => {
      dot.life += dt * c.fadeSpeed;
      dot.phase += dt * 0.00035;

      const spreadT = (Math.sin(dot.life * 1.2 + dot.phase) + 1) * 0.5;
      const targetSpread = c.radius * (0.15 + spreadT * 0.9);
      dot.spread += (targetSpread - dot.spread) * 0.0018;

      const angle = Math.atan2(dot.py - c.cy, dot.px - c.cx) + dot.phase * 0.015;
      dot.px =
        c.cx +
        Math.cos(angle) * dot.spread +
        Math.sin(dot.phase) * c.driftScale;
      dot.py =
        c.cy +
        Math.sin(angle) * dot.spread +
        Math.cos(dot.phase * 0.85) * c.driftScale;

      dot.alpha = 0.1 + (Math.sin(dot.life * 2 + dot.phase) + 1) * 0.22;

      if (dot.life > 7) {
        Object.assign(dot, createClusterDot(c), { life: 0 });
      }
    });
  }

  function updatePathDots(dt) {
    const speed = config.pathDots.speed;

    pathDots.forEach((dot) => {
      dot.progress += dt * speed * dot.speed;

      if (dot.progress >= 1) {
        dot.progress = 0;
        dot.alpha = 0;
        dot.fading = false;
      }

      if (!dot.fading) {
        dot.alpha = Math.min(dot.maxAlpha, dot.alpha + dt * 0.0007);
        if (dot.alpha >= dot.maxAlpha) dot.fading = true;
      } else if (dot.progress > 0.65) {
        dot.alpha = Math.max(0, dot.alpha - dt * 0.0004);
      }
    });
  }

  function drawCluster() {
    clusterCtx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    const scale = PosterLayout.screenScale(posterRect);

    clusterDots.forEach((dot) => {
      const screen = PosterLayout.posterToScreen(posterRect, dot.px, dot.py);
      const r = dot.radius * scale;

      clusterCtx.beginPath();
      clusterCtx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
      clusterCtx.fillStyle = `rgba(0, 0, 0, ${dot.alpha})`;
      clusterCtx.fill();
    });
  }

  function drawPathDots() {
    pathCtx.clearRect(0, 0, pathCanvas.width, pathCanvas.height);
    const scale = PosterLayout.screenScale(posterRect);
    const r = config.pathDots.radius * scale;

    pathDots.forEach((dot) => {
      if (dot.alpha <= 0.01) return;
      const pathEl = pathElements[dot.pathIndex];
      if (!pathEl) return;

      const screen = pointOnPath(pathEl, dot.progress);
      pathCtx.beginPath();
      pathCtx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
      pathCtx.fillStyle = `rgba(230, 0, 0, ${dot.alpha})`;
      pathCtx.fill();
    });
  }

  function drawStaticFrame() {
    drawCluster();
    drawPathDots();
    const pt = walkPathEl.getPointAtLength(0);
    const screen = PosterLayout.posterToScreen(posterRect, pt.x, pt.y);
    const size = parseFloat(walkerEl.style.width) || 60;
    walkerEl.style.transform = `translate(${screen.x - size * 0.5}px, ${screen.y - size * 0.85}px)`;
  }

  function animate(now) {
    const elapsed = now - startTime;
    const dt = 16;

    updateWalker(elapsed);
    updateClusterDots(dt);
    updatePathDots(dt);
    drawCluster();
    drawPathDots();

    animationId = requestAnimationFrame(animate);
  }

  function start() {
    resize();
    init();
  }

  window.addEventListener("resize", () => {
    if (animationId) cancelAnimationFrame(animationId);
    resize();
    if (reducedMotion) {
      drawStaticFrame();
    } else {
      startTime = performance.now();
      animationId = requestAnimationFrame(animate);
    }
  });

  if (posterImage.complete) {
    start();
  } else {
    posterImage.addEventListener("load", start);
    posterImage.addEventListener("error", start);
  }
})();
