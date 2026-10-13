/* ============================================================
   PAWAN & CHANCHAL — script.js
   ============================================================ */

// ── 1. COUNTDOWN ─────────────────────────────────────────
(function () {
  const target = new Date('2026-10-20T20:00:00+05:30');
  const els = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
  };

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<p style="font-family:var(--f-heading);font-size:1.15rem;color:var(--clr-gold-lt);letter-spacing:0.16em;text-transform:uppercase">Today is the Big Day</p>';
      return;
    }
    const pad = n => String(Math.floor(n)).padStart(2, '0');
    els.d.textContent = pad(diff / 86400000);
    els.h.textContent = pad((diff % 86400000) / 3600000);
    els.m.textContent = pad((diff % 3600000) / 60000);
    els.s.textContent = pad((diff % 60000) / 1000);
  }
  tick();
  setInterval(tick, 1000);
})();


// ── 2. SCROLL REVEAL ──────────────────────────────────────
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


// ── 3. PETAL CANVAS ───────────────────────────────────────
(function () {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Petal shape using bezier curves
  function drawPetal(ctx, x, y, size, angle, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( size*0.5, -size*0.3,  size*0.8,  size*0.2,  0,       size);
    ctx.bezierCurveTo(-size*0.8,  size*0.2, -size*0.5, -size*0.3,  0,       0);
    ctx.fill();
    ctx.restore();
  }

  const COLORS = [
    '#c9952a', '#e4b95c', '#f5e4b8',
    '#a83348', '#d4657a', '#fff0e0',
  ];

  const N = window.innerWidth < 600 ? 22 : 36;

  const petals = Array.from({ length: N }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    size:  5 + Math.random() * 9,
    vx:    (Math.random() - 0.5) * 0.7,
    vy:    0.5 + Math.random() * 1.1,
    angle: Math.random() * Math.PI * 2,
    va:    (Math.random() - 0.5) * 0.025,
    wobble: Math.random() * Math.PI * 2,
    ws:    0.018 + Math.random() * 0.018,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.25 + Math.random() * 0.45,
  }));

  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.wobble += p.ws;
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.angle += p.va;
      drawPetal(ctx, p.x, p.y, p.size, p.angle, p.color, p.alpha);
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    });
    requestAnimationFrame(loop);
  }
  loop();
})();


// ── 4. SUBTLE CARD TILT (desktop only) ────────────────────
(function () {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  document.querySelectorAll('.card, .event-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(700px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ── 5. GOLD CURSOR SPARKLE (desktop only) ─────────────────
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  const SPARK_COLORS = ['#c9952a', '#e4b95c', '#f5e4b8', '#a83348', '#fff0e0'];
  let frameQueued = false;
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', e => {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(() => {
      frameQueued = false;
      if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) < 6) return;
      lastX = e.clientX; lastY = e.clientY;

      if (Math.random() > 0.45) return;

      const dot = document.createElement('div');
      const sz  = 3 + Math.random() * 5;
      Object.assign(dot.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '9999',
        left: e.clientX + 'px',
        top:  e.clientY + 'px',
        width:  sz + 'px',
        height: sz + 'px',
        borderRadius: '50%',
        background: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        transform: 'translate(-50%,-50%)',
        opacity: '0.9',
        transition: 'opacity .55s ease, transform .55s ease',
      });
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = `translate(${(Math.random()-0.5)*50}px, ${-15-Math.random()*35}px) scale(0.2)`;
      });
      setTimeout(() => dot.remove(), 600);
    });
  });
})();


// ── 6. BACKGROUND MUSIC CONTROLLER ────────────────────────
(function () {
  const audio  = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  let isPlaying = false;

  function updateUI(playing) {
    isPlaying = playing;
    if (playing) {
      toggle.classList.remove('is-paused');
      toggle.classList.add('is-playing');
      toggle.setAttribute('aria-label', 'Pause Background Music');
      toggle.setAttribute('title', 'Pause Music');
    } else {
      toggle.classList.remove('is-playing');
      toggle.classList.add('is-paused');
      toggle.setAttribute('aria-label', 'Play Background Music');
      toggle.setAttribute('title', 'Play Music');
    }
  }

  function playAudio() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateUI(true);
      }).catch(() => {
        updateUI(false);
      });
    }
  }

  function pauseAudio() {
    audio.pause();
    updateUI(false);
  }

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    if (audio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  });

  // Start smoothly on first user gesture across mobile and desktop
  function handleFirstGesture() {
    if (audio.paused && !isPlaying) {
      playAudio();
    }
    removeGestureListeners();
  }

  function removeGestureListeners() {
    window.removeEventListener('click', handleFirstGesture);
    window.removeEventListener('touchstart', handleFirstGesture);
    window.removeEventListener('scroll', handleFirstGesture);
    window.removeEventListener('keydown', handleFirstGesture);
  }

  window.addEventListener('click', handleFirstGesture, { passive: true });
  window.addEventListener('touchstart', handleFirstGesture, { passive: true });
  window.addEventListener('scroll', handleFirstGesture, { passive: true });
  window.addEventListener('keydown', handleFirstGesture, { passive: true });

  // Hook "Open Invitation" button
  const openCta = document.querySelector('.scroll-cta');
  if (openCta) {
    openCta.addEventListener('click', () => {
      if (audio.paused) playAudio();
    });
  }

  // Try immediate autoplay if browser allows
  playAudio();
})();

