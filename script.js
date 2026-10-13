/* =========================================================
   Pawan & Chanchal Wedding Website - script.js
   ========================================================= */

// ── 1. COUNTDOWN TIMER ────────────────────────────────────
(function initCountdown() {
  const weddingDate = new Date('2026-10-20T20:00:00+05:30');

  function update() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<p style="font-family:var(--font-script);font-size:2rem;color:var(--maroon)">🎉 The Big Day is Here!</p>';
      return;
    }

    const d  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s  = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');
    document.getElementById('days').textContent    = pad(d);
    document.getElementById('hours').textContent   = pad(h);
    document.getElementById('minutes').textContent = pad(m);
    document.getElementById('seconds').textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
})();


// ── 2. FLOATING PETALS CANVAS ─────────────────────────────
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  const ctx    = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PETAL_COLORS = [
    'rgba(201,168,76,0.55)',
    'rgba(248,215,218,0.6)',
    'rgba(245,230,200,0.55)',
    'rgba(192,112,122,0.4)',
    'rgba(255,255,255,0.5)',
  ];

  const NUM_PETALS = 38;

  function Petal() {
    this.reset();
  }
  Petal.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = -20 - Math.random() * 80;
    this.r    = 4 + Math.random() * 8;
    this.vx   = (Math.random() - 0.5) * 1.2;
    this.vy   = 0.6 + Math.random() * 1.4;
    this.rot  = Math.random() * Math.PI * 2;
    this.drot = (Math.random() - 0.5) * 0.04;
    this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.02 + Math.random() * 0.02;
    this.opacity = 0.5 + Math.random() * 0.5;
  };

  const petals = Array.from({ length: NUM_PETALS }, () => new Petal());
  // Spread initial positions
  petals.forEach(p => { p.y = Math.random() * H; });

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Oval petal shape
    ctx.ellipse(0, 0, p.r, p.r * 1.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    petals.forEach(p => {
      p.wobble += p.wobbleSpeed;
      p.x  += p.vx + Math.sin(p.wobble) * 0.8;
      p.y  += p.vy;
      p.rot += p.drot;
      drawPetal(p);
      if (p.y > H + 30) p.reset();
    });

    requestAnimationFrame(tick);
  }
  tick();
})();


// ── 3. SCROLL REVEAL ──────────────────────────────────────
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


// ── 4. ACTIVE NAV DOT ─────────────────────────────────────
(function initNavDots() {
  const sections = document.querySelectorAll('section[id]');
  const dots     = document.querySelectorAll('.nav-dots .dot');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();


// ── 5. SMOOTH PARALLAX ────────────────────────────────────
(function initParallax() {
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (hero) {
      hero.style.backgroundPositionY = `${scrollY * 0.4}px`;
    }
  }, { passive: true });
})();


// ── 6. CURSOR SPARKLE ─────────────────────────────────────
(function initSparkles() {
  const sparkles = [];
  const COLORS = ['#c9a84c', '#f5e6c8', '#c0707a', '#ffffff', '#8B6914'];

  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.35) return; // throttle

    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      border-radius: 50%;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 0.6s ease, transform 0.6s ease;
    `;
    document.body.appendChild(spark);

    // Animate out
    requestAnimationFrame(() => {
      spark.style.opacity = '0';
      spark.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${-20 - Math.random() * 40}px) scale(0)`;
    });

    setTimeout(() => spark.remove(), 700);
  });
})();


// ── 7. CARD TILT EFFECT ───────────────────────────────────
(function initTilt() {
  document.querySelectorAll('.person-card, .event-card, .glass-card, .host-card')
    .forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const tiltX  = dy * -6;
        const tiltY  = dx * 6;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
})();


// ── 8. PAGE ENTRANCE ANIMATION ────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 1s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
