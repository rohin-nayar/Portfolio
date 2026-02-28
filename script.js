/* ============================================================
   Portfolio Script — Rohin Nayar
   - Particle canvas (hero)
   - Typewriter effect
   - Navbar scroll behaviour + mobile menu
   - Intersection Observer animations
   - Counter animation
   - GitHub API repo loader
   ============================================================ */

'use strict';

/* ── Navbar ─────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Footer year ─────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Particle Canvas ─────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles;
  const COUNT       = 90;
  const MAX_DIST    = 130;
  const PARTICLE_R  = 1.5;
  const SPEED       = 0.3;

  const CYAN   = '0,212,255';
  const WHITE  = '255,255,255';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 0.5 + 0.1) * SPEED;
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r:  Math.random() * PARTICLE_R + 0.4,
      col: Math.random() > 0.7 ? CYAN : WHITE,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.25;
          ctx.strokeStyle = `rgba(${CYAN},${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw points
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},0.7)`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();

/* ── Typewriter ──────────────────────────────────────────── */
(function initTypewriter() {
  const el    = document.getElementById('typed-role');
  const roles = [
    'Quantitative Trading Analyst',
    'Aerospace Engineer',
    'Machine Learning Researcher',
    'High-Performance Systems Engineer',
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const PAUSE_END = 1600;
  const PAUSE_START = 400;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, 65 + Math.random() * 30);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  setTimeout(tick, 600);
})();

/* ── Intersection Observer — general animations ───────────── */
const observerOpts = { threshold: 0.15 };
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, observerOpts);

document.querySelectorAll('[data-animate], .timeline-item, .project-card, .edu-card')
  .forEach(el => observer.observe(el));

/* ── Counter Animation ───────────────────────────────────── */
(function initCounters() {
  const cards = document.querySelectorAll('.stat-card');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card   = e.target;
      const target = parseInt(card.dataset.target, 10);
      const span   = card.querySelector('.count');
      const suffix = card.dataset.suffix || '';

      let current  = 0;
      const step   = Math.max(1, Math.ceil(target / 60));
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        span.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 22);

      counterObserver.unobserve(card);
    });
  }, { threshold: 0.4 });

  cards.forEach(c => counterObserver.observe(c));
})();

/* ── GitHub API ──────────────────────────────────────────── */
(function initGitHub() {
  const container = document.getElementById('github-repos');
  const username  = 'rohin-nayar';
  const url       = `https://api.github.com/users/${username}/repos?sort=updated&per_page=9`;

  const langColors = {
    Python:     '#3572A5',
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    'C++':      '#f34b7d',
    C:          '#555555',
    MATLAB:     '#e16737',
    Jupyter:    '#DA5B0B',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Shell:      '#89e051',
    Rust:       '#dea584',
    Go:         '#00ADD8',
  };

  function repoCard(repo) {
    const a    = document.createElement('a');
    a.href     = repo.html_url;
    a.target   = '_blank';
    a.rel      = 'noopener noreferrer';
    a.className = 'repo-card';

    const lang  = repo.language || '';
    const color = langColors[lang] || '#8892a4';
    const desc  = repo.description
      ? (repo.description.length > 80 ? repo.description.slice(0, 77) + '…' : repo.description)
      : 'No description provided.';

    a.innerHTML = `
      <div class="repo-name">${repo.name}</div>
      <div class="repo-desc">${desc}</div>
      <div class="repo-meta">
        ${lang ? `<span class="repo-lang">
          <span class="lang-dot" style="background:${color}"></span>${lang}
        </span>` : ''}
        <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
      </div>`;
    return a;
  }

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`GitHub API ${r.status}`);
      return r.json();
    })
    .then(repos => {
      container.innerHTML = '';
      if (!repos.length) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:.875rem">No public repositories found.</p>';
        return;
      }
      repos.forEach(repo => container.appendChild(repoCard(repo)));
    })
    .catch(() => {
      container.innerHTML = `
        <p style="color:var(--text-muted);font-size:.875rem;grid-column:1/-1">
          Couldn't load repositories right now —
          <a href="https://github.com/${username}" target="_blank" style="color:var(--cyan)">visit GitHub directly</a>.
        </p>`;
    });
})();
