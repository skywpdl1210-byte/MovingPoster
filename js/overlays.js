(function () {
  "use strict";

  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.45 + 0.1,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18 - 0.05,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
    };
  }

  function initParticles(count) {
    particles = Array.from({ length: count }, createParticle);
  }

  function drawParticle(particle) {
    const flicker =
      0.55 + Math.sin(particle.twinkle) * 0.45;
    const alpha = particle.alpha * flicker;

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 3
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function updateParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.twinkle += particle.twinkleSpeed;

    if (particle.x < -10) particle.x = width + 10;
    if (particle.x > width + 10) particle.x = -10;
    if (particle.y < -10) particle.y = height + 10;
    if (particle.y > height + 10) particle.y = -10;
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
      updateParticle(particle);
      drawParticle(particle);
    }

    animationId = requestAnimationFrame(frame);
  }

  function start() {
    resize();
    const density = Math.min(90, Math.floor((width * height) / 18000));
    initParticles(density);
    frame();
  }

  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  window.addEventListener("resize", () => {
    stop();
    start();
  });

  start();
})();
