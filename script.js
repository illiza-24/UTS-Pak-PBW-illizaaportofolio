// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1900);
});

// ===== PARTICLE TRAIL CURSOR =====
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Particle pool
const particles = [];
const SHAPES    = ['✦', '✶', '★', '•', '◆', '+'];
const COLORS    = ['#FF6B6B', '#FFB347', '#FFE66D', '#4ECDC4', '#FF8E8E', '#FFC97A'];

class Particle {
  constructor(x, y) {
    this.x    = x;
    this.y    = y;
    this.vx   = (Math.random() - 0.5) * 3;
    this.vy   = (Math.random() - 0.5) * 3 - 1.5;
    this.alpha = 1;
    this.decay = 0.03 + Math.random() * 0.04;
    this.size  = 8 + Math.random() * 12;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.rot   = Math.random() * Math.PI * 2;
    this.rotV  = (Math.random() - 0.5) * 0.15;
    this.scale = 1;
    this.scaleD = 0.015 + Math.random() * 0.01;
  }
  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.vy   += 0.06; // gravity
    this.alpha -= this.decay;
    this.rot  += this.rotV;
    this.scale -= this.scaleD;
  }
  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.scale(this.scale, this.scale);
    ctx.fillStyle   = this.color;
    ctx.font        = `${this.size}px Arial`;
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.shape, 0, 0);
    ctx.restore();
  }
}

let lastX = 0, lastY = 0, mouseMoving = false, moveTimer;

document.addEventListener('mousemove', e => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const dist = Math.sqrt(dx*dx + dy*dy);

  lastX = e.clientX;
  lastY = e.clientY;
  mouseMoving = true;

  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => mouseMoving = false, 80);

  const count = Math.min(3, Math.floor(dist / 10) + 1);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(e.clientX, e.clientY));
  }

  if (particles.length > 200) particles.splice(0, particles.length - 200);
});

document.addEventListener('click', e => {
  for (let i = 0; i < 12; i++) {
    const p = new Particle(e.clientX, e.clientY);
    p.vx  *= 2.5;
    p.vy  *= 2.5;
    p.size = 12 + Math.random() * 16;
    p.decay = 0.02;
    particles.push(p);
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);
    if (particles[i].alpha <= 0 || particles[i].scale <= 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SCROLL PROGRESS + HEADER + BACK TO TOP =====
window.addEventListener('scroll', () => {
  const st  = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('scroll-progress').style.width = (max > 0 ? (st/max)*100 : 0) + '%';
  document.getElementById('header').classList.toggle('scrolled', st > 20);
  document.getElementById('back-top').classList.toggle('visible', st > 400);
}, { passive: true });

// ===== PAGE NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => triggerReveal(target), 160);
  }
  const link = document.querySelector(`nav a[data-page="${id}"]`);
  if (link) link.classList.add('active');
  if (id === 'contact') setTimeout(loadMessages, 300);
}

// ===== REVEAL ON ENTER =====
function triggerReveal(container) {
  container.querySelectorAll('.reveal-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    setTimeout(() => {
      el.style.transition = 'opacity .48s ease, transform .48s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.classList.add('visible');
    }, 55 + i * 65);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => triggerReveal(document.getElementById('home')), 2100);
});

// ===== MAGNETIC BUTTONS =====
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.magnetic').forEach(btn => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const d  = Math.sqrt(dx*dx + dy*dy);
    const range = 72;
    if (d < range) {
      const pull = (1 - d/range) * 0.38;
      btn.style.transform = `translate(${dx*pull}px, ${dy*pull}px)`;
    } else {
      btn.style.transform = '';
    }
  });
});

// ===== 3D TILT CARDS =====
document.addEventListener('mousemove', e => {
  document.querySelectorAll('#projects .proj-card, #family .fam-card').forEach(card => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) / (r.width  / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 1.2) {
      card.style.transform = `perspective(800px) rotateY(${dx*5}deg) rotateX(${-dy*5}deg) translateY(-9px)`;
    } else {
      card.style.transform = '';
    }
  });
});

// ===== GALLERY LIGHTBOX =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('galleryGrid')?.addEventListener('click', e => {
    const item = e.target.closest('.gal-item');
    if (!item) return;
    const src = item.querySelector('img')?.src;
    if (!src) return;
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== GALLERY FILTER =====
function filterGallery(cat, btn) {
  document.querySelectorAll('.fpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gal-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? 'block' : 'none';
  });
}

// ===== CONTACT FORM =====
async function sendMessage() {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();
  const status  = document.getElementById('formStatus');
  const btn     = document.querySelector('.form-card .btn-primary');

  if (!name || !email || !message) {
    setStatus(status, 'Please fill in Name, Email, and Message.', 'error'); return;
  }
  btn.disabled = true; btn.textContent = 'Sending...';
  setStatus(status, '', '');
  const fd = new FormData();
  fd.append('name', name); fd.append('email', email);
  fd.append('message', message);
  try {
    const res  = await fetch('/Portofolio/contact.php', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      setStatus(status, '✓ Message sent! Thank you 🧡', 'success');
      ['cName','cEmail','cMessage'].forEach(id => document.getElementById(id).value = '');
      loadMessages();
    } else {
      setStatus(status, data.error || 'Something went wrong.', 'error');
    }
  } catch { setStatus(status, 'Could not reach server. Try again.', 'error'); }
  btn.disabled = false; btn.textContent = 'Send Message ✉';
}

function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'form-status' + (type ? ' ' + type : '');
}

// ===== LOAD MESSAGES =====
async function loadMessages() {
  const list = document.getElementById('messagesList');
  if (!list) return;
  list.innerHTML = '<div class="msg-loading mono">Loading...</div>';
  try {
    const res  = await fetch('/Portofolio/get_messages.php?nocache=' + Date.now());
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) {
      list.innerHTML = '<div class="msg-empty mono">No messages yet — be the first! 👋</div>'; return;
    }
    list.innerHTML = data.map(m => `
      <div class="msg-item">
        <div class="msg-avatar">${esc(m.name[0].toUpperCase())}</div>
        <div class="msg-body">
          <div class="msg-meta">
            <span class="msg-name">${esc(m.name)}</span>
            <span class="msg-time">${ago(m.created_at)}</span>
          </div>
          <div class="msg-text">${esc(m.message)}</div>
        </div>
      </div>`).join('');
  } catch { list.innerHTML = '<div class="msg-empty mono">Could not load messages.</div>'; }
}

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)    return s + 's ago';
  if (s < 3600)  return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}

// ===== INIT =====
showPage('home');
