'use strict';

const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
  }));
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .09 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));
}

const astronaut = document.querySelector('.astronaut');
const heroArt = document.querySelector('.hero-art');
if (astronaut && heroArt && !reduceMotion.matches && window.matchMedia('(pointer:fine)').matches) {
  heroArt.addEventListener('pointermove', e => {
    const rect = heroArt.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    astronaut.style.transform = `translate(${x * 11}px, ${y * 11}px) rotate(${-14 + x * 4}deg)`;
  });
  heroArt.addEventListener('pointerleave', () => astronaut.style.transform = 'rotate(-14deg)');
}

// Canvas stars: low-cost static starfield, subtle movement only when enabled.
const canvas = document.getElementById('stars');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let stars = [], width = 0, height = 0, frame = 0, running = false;
  function resizeStars() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(170, Math.floor(width * height / 7200));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: .35 + Math.random() * 1.05,
      a: .16 + Math.random() * .56,
      phase: Math.random() * 6.28
    }));
    drawStars();
  }
  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const alpha = reduceMotion.matches ? s.a : s.a * (.85 + .15 * Math.sin(frame * .012 + s.phase));
      ctx.fillStyle = `rgba(195,216,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function animateStars() {
    if (!running) return;
    frame++;
    drawStars();
    requestAnimationFrame(animateStars);
  }
  function updateAnimation() {
    running = !reduceMotion.matches && !document.hidden;
    if (running) requestAnimationFrame(animateStars);
    else drawStars();
  }
  window.addEventListener('resize', resizeStars, { passive: true });
  document.addEventListener('visibilitychange', updateAnimation);
  reduceMotion.addEventListener('change', updateAnimation);
  resizeStars();
  updateAnimation();
}
