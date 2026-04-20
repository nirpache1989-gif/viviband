/* ============================================================
   CORES DO SAMBA — interactions
   - Custom cursor + brush trail (cursor effect)
   - Kinetic letter typography (jitter on hover, breathing)
   - Scroll reveal
   - Audio-reactive waveform (synthetic, no real audio)
   - Vinyl spinner / play
   - Tweaks panel (variation, palette, font, grain)
   - Page-curtain transition for form submit
   ============================================================ */

(() => {

  /* ============ Tweak defaults (rewritten by host on save) ============ */
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroVariant": 1,
    "palette": "neon",
    "displayFont": "bricolage",
    "grain": 7
  }/*EDITMODE-END*/;

  let state = { ...TWEAK_DEFAULTS };

  /* ============ Custom cursor ============ */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function loopCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loopCursor);
  }
  loopCursor();

  // Hot zones
  document.addEventListener('mouseover', e => {
    const t = e.target;
    if (t.closest('a, button, .show, .track, .tile, .hero__cta, .player__play, .saint-card, input, textarea, select')) {
      ring.classList.add('hot');
    }
  });
  document.addEventListener('mouseout', e => {
    const t = e.target;
    if (t.closest('a, button, .show, .track, .tile, .hero__cta, .player__play, .saint-card, input, textarea, select')) {
      ring.classList.remove('hot');
    }
  });

  // Hide custom cursor on touch
  if (matchMedia('(hover: none)').matches) {
    document.body.style.cursor = 'auto';
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  /* ============ Brush trail canvas ============ */
  const canvas = document.getElementById('brush-trail');
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  const trail = [];
  const palettes = {
    neon:     ['#ff1f6b', '#00f5d4', '#9d4edd', '#ffb627'],
    vinyl:    ['#C1272D', '#0A6E5C', '#F2A900', '#1A1A1A'],
    tropical: ['#E63946', '#FFB627', '#06A77D', '#F4A261'],
    dusk:     ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec'],
  };

  let lastEmit = 0;
  window.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - lastEmit < 16) return;
    lastEmit = now;
    const cols = palettes[state.palette];
    trail.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      life: 1,
      r: 2 + Math.random() * 5,
      c: cols[Math.floor(Math.random() * cols.length)],
    });
    if (trail.length > 80) trail.shift();
  });

  function loopTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) { trail.splice(i, 1); continue; }
      ctx.globalAlpha = p.life * 0.7;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(loopTrail);
  }
  loopTrail();

  /* ============ Kinetic letter typography ============ */
  // Build per-letter spans and add accent classes
  document.querySelectorAll('.hero-v1 [data-word]').forEach(span => {
    const word = span.dataset.word;
    const italic = span.hasAttribute('data-italic');
    const accents = ['', 'letter--accent', 'letter--cyan', 'letter--amber', 'letter--jade', 'letter--violet'];
    const html = [...word].map((ch, i) => {
      // weighted: most plain, sometimes accent
      let cls = '';
      const r = Math.random();
      if (r > 0.55) cls = accents[Math.floor(Math.random() * accents.length)];
      return `<span class="letter ${cls}" data-i="${i}">${ch}</span>`;
    }).join('');
    span.innerHTML = html;
  });

  // Letter idle "samba" sway + hover jitter
  const letters = [...document.querySelectorAll('.hero-v1 .letter')];
  let t = 0;
  function swayLoop() {
    t += 0.018;
    letters.forEach((L, i) => {
      const phase = i * 0.35;
      const r = Math.sin(t + phase) * 1.8;
      const y = Math.sin(t * 1.3 + phase) * 1.2;
      L.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    });
    requestAnimationFrame(swayLoop);
  }
  swayLoop();

  // Hover scatter
  letters.forEach(L => {
    L.addEventListener('mouseenter', () => {
      L.style.transition = 'transform 220ms cubic-bezier(.65,0,.35,1), color 200ms';
      const dx = (Math.random() - 0.5) * 30;
      const dy = (Math.random() - 0.5) * 30;
      const r = (Math.random() - 0.5) * 40;
      L.style.transform = `translate(${dx}px, ${dy}px) rotate(${r}deg) scale(1.15)`;
      setTimeout(() => { L.style.transition = 'none'; }, 240);
    });
  });

  /* ============ Scroll reveal ============ */
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.opacity = '0';
        e.target.style.transform = 'translateY(20px)';
        e.target.style.transition = 'opacity 600ms ease, transform 600ms cubic-bezier(.65,0,.35,1)';
        requestAnimationFrame(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ============ Audio-reactive waveform (synthetic) ============ */
  const wave = document.getElementById('waveform');
  let isPlaying = false;
  let phase = 0;
  let bars = [];
  if (wave) {
    const BARS = 48;
    for (let i = 0; i < BARS; i++) {
      const b = document.createElement('div');
      b.className = 'player__bar';
      wave.appendChild(b);
    }
    bars = [...wave.children];
    function loopWave() {
      if (isPlaying) phase += 0.18;
      bars.forEach((b, i) => {
        const baseL = isPlaying
          ? 8 + Math.abs(Math.sin(phase + i * 0.4)) * 38 + Math.abs(Math.sin(phase * 2.3 + i * 0.13)) * 14
          : 6 + Math.sin(i * 0.5) * 3;
        b.style.height = baseL + 'px';
        b.classList.toggle('active', isPlaying && baseL > 28);
      });
      requestAnimationFrame(loopWave);
    }
    loopWave();
  }

  /* ============ Player controls ============ */
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const vinyl = document.getElementById('vinyl');
  const npTitle = document.getElementById('np-title');
  const npYear = document.getElementById('np-year');

  function setIcon(playing) {
    if (!playIcon) return;
    if (playing) {
      playIcon.innerHTML = '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';
    } else {
      playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
  }
  if (playBtn) playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (vinyl) vinyl.classList.toggle('playing', isPlaying);
    setIcon(isPlaying);
  });

  document.querySelectorAll('.track').forEach(tr => {
    tr.addEventListener('click', () => {
      document.querySelectorAll('.track').forEach(x => x.classList.remove('is-playing'));
      tr.classList.add('is-playing');
      if (npTitle) npTitle.textContent = tr.dataset.title;
      if (npYear) npYear.textContent = tr.dataset.year;
      isPlaying = true;
      if (vinyl) vinyl.classList.add('playing');
      setIcon(true);
    });
  });

  /* ============ Clock (hero) ============ */
  function tickClock() {
    const el = document.querySelector('[data-clock]');
    if (!el) return;
    const now = new Date();
    // BRT = UTC-3
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const brt = new Date(utcMs - 3 * 60 * 60 * 1000);
    const hh = String(brt.getHours()).padStart(2, '0');
    const mm = String(brt.getMinutes()).padStart(2, '0');
    el.textContent = `${hh}:${mm} BRT`;
  }
  tickClock(); setInterval(tickClock, 30000);

  /* ============ Page curtain transition ============ */
  window.fxCurtain = () => {
    const c = document.querySelector('.fx-curtain');
    c.style.transition = 'transform 600ms cubic-bezier(.65,0,.35,1)';
    c.style.transformOrigin = 'bottom';
    c.style.transform = 'scaleY(1)';
    setTimeout(() => {
      c.style.transformOrigin = 'top';
      c.style.transform = 'scaleY(0)';
      // reset form
      document.querySelectorAll('.field input, .field textarea').forEach(el => el.value = '');
    }, 700);
  };

  /* ============ HERO VARIATION SWITCH (no-op, kept for compat) ============ */
  function showHero(_n) { /* only one hero now */ }

  /* ============ PALETTE SWITCH ============ */
  const PALETTE_VARS = {
    neon: {
      '--bg-deep': '#140414', '--bg-mid': '#1f0a22', '--bg-elev': '#2a0e2e',
      '--ink': '#f6ecd9',
      '--c-magenta': '#ff1f6b', '--c-cyan': '#00f5d4',
      '--c-violet': '#9d4edd', '--c-vermillion': '#e63946',
      '--c-amber': '#ffb627', '--c-jade': '#06a77d',
    },
    vinyl: {
      '--bg-deep': '#1a1410', '--bg-mid': '#241c17', '--bg-elev': '#2e251f',
      '--ink': '#f5e6d3',
      '--c-magenta': '#C1272D', '--c-cyan': '#0A6E5C',
      '--c-violet': '#5b3a52', '--c-vermillion': '#C1272D',
      '--c-amber': '#F2A900', '--c-jade': '#0A6E5C',
    },
    tropical: {
      '--bg-deep': '#0F2419', '--bg-mid': '#143025', '--bg-elev': '#1a3d2f',
      '--ink': '#f5e6d3',
      '--c-magenta': '#E63946', '--c-cyan': '#06A77D',
      '--c-violet': '#264653', '--c-vermillion': '#E63946',
      '--c-amber': '#FFB627', '--c-jade': '#06A77D',
    },
    dusk: {
      '--bg-deep': '#1a0a1f', '--bg-mid': '#231029', '--bg-elev': '#2e1735',
      '--ink': '#fff4e6',
      '--c-magenta': '#ff006e', '--c-cyan': '#3a86ff',
      '--c-violet': '#8338ec', '--c-vermillion': '#fb5607',
      '--c-amber': '#ffbe0b', '--c-jade': '#06d6a0',
    },
  };

  function applyPalette(name) {
    const p = PALETTE_VARS[name]; if (!p) return;
    Object.entries(p).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    state.palette = name;
    document.querySelectorAll('#tw-palette button').forEach(b => {
      b.classList.toggle('on', b.dataset.pal === name);
    });
    saveTweaks();
  }

  /* ============ FONT SWITCH ============ */
  const FONTS = {
    bricolage: { url: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=swap', family: "'Bricolage Grotesque', system-ui, sans-serif" },
    bebas:     { url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap', family: "'Bebas Neue', sans-serif" },
    anton:     { url: 'https://fonts.googleapis.com/css2?family=Anton&display=swap', family: "'Anton', sans-serif" },
    archivo:   { url: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap', family: "'Archivo Black', sans-serif" },
  };
  function applyFont(name) {
    const f = FONTS[name]; if (!f) return;
    let link = document.getElementById('font-link-extra');
    if (!link) {
      link = document.createElement('link');
      link.id = 'font-link-extra'; link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = f.url;
    document.documentElement.style.setProperty('--font-display', f.family);
    state.displayFont = name;
    saveTweaks();
  }

  /* ============ GRAIN ============ */
  function applyGrain(v) {
    document.documentElement.style.setProperty('--grain-opacity', String(v / 100));
    state.grain = v;
    saveTweaks();
  }

  /* ============ TWEAKS WIRING ============ */
  const tweaksPanel = document.getElementById('tweaks');

  document.querySelectorAll('#tw-variants button').forEach(b => {
    b.addEventListener('click', () => showHero(Number(b.dataset.v)));
  });
  document.querySelectorAll('#tw-palette button').forEach(b => {
    b.addEventListener('click', () => applyPalette(b.dataset.pal));
  });
  const fontSel = document.getElementById('tw-font');
  if (fontSel) fontSel.addEventListener('change', e => applyFont(e.target.value));
  const grainEl = document.getElementById('tw-grain');
  if (grainEl) grainEl.addEventListener('input', e => applyGrain(Number(e.target.value)));

  function saveTweaks() {
    window.parent && window.parent.postMessage({ type: '__edit_mode_set_keys', edits: {
      heroVariant: state.heroVariant,
      palette: state.palette,
      displayFont: state.displayFont,
      grain: state.grain,
    }}, '*');
  }

  /* ============ Edit mode protocol ============ */
  window.addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.type === '__activate_edit_mode')   tweaksPanel.classList.add('show');
    if (e.data.type === '__deactivate_edit_mode') tweaksPanel.classList.remove('show');
  });
  // Announce after listener registered
  window.parent && window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  /* ============ Init from defaults ============ */
  showHero(state.heroVariant);
  applyPalette(state.palette);
  applyFont(state.displayFont);
  applyGrain(state.grain);
  if (fontSel) fontSel.value = state.displayFont;
  if (grainEl) grainEl.value = state.grain;

})();
