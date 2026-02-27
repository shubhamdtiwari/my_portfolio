/* ======================================================
   1. CUSTOM CURSOR
   ====================================================== */
const cursor = document.getElementById("cursor");
const trail = document.getElementById("cursorTrail");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX - 5 + "px";
  cursor.style.top = e.clientY - 5 + "px";
  trail.style.left = e.clientX - 16 + "px";
  trail.style.top = e.clientY - 16 + "px";
});

document.addEventListener(
  "mousedown",
  () => (cursor.style.transform = "scale(1.8)")
);
document.addEventListener(
  "mouseup",
  () => (cursor.style.transform = "scale(1)")
);

/* ======================================================
      2. ANIMATED PARTICLE BACKGROUND (Canvas)
      ====================================================== */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Build particle pool
const PARTICLE_COUNT = 80;
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.5 + 0.1,
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw dots
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,245,200,${p.alpha})`;
    ctx.fill();

    // Move
    p.x += p.dx;
    p.y += p.dy;

    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(
        particles[i].x - particles[j].x,
        particles[i].y - particles[j].y
      );
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,200,${0.06 * (1 - d / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ======================================================
      3. TYPEWRITER EFFECT
      ====================================================== */
const roles = [
  "Full Stack Developer",
  "React Specialist",
  "Node.js Engineer",
  "Problem Solver",
];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById("typedText");

function type() {
  const current = roles[roleIndex];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
    }
  }

  setTimeout(type, deleting ? 50 : 90);
}
type();

/* ======================================================
      4. STICKY NAVBAR + SCROLL SPY
      ====================================================== */
const navbar = document.getElementById("navbar");
const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  const y = window.scrollY;

  // Sticky glass effect
  navbar.classList.toggle("scrolled", y > 60);

  // Show/hide scroll-to-top button
  scrollBtn.classList.toggle("show", y > 400);

  // Active nav link highlight
  document.querySelectorAll("section").forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (y >= top && y < top + sec.offsetHeight) {
      document
        .querySelectorAll(".nav-links a")
        .forEach((a) => a.classList.remove("active"));
      const activeLink = document.querySelector(
        `.nav-links a[href="#${sec.id}"]`
      );
      if (activeLink) activeLink.classList.add("active");
    }
  });
});

// Scroll to top on button click
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ======================================================
      5. HAMBURGER MENU (Mobile)
      ====================================================== */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");
});

// Close mobile nav when a link is clicked
document.querySelectorAll(".mob-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
  });
});

/* ======================================================
      6. SCROLL REVEAL (IntersectionObserver)
      ====================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay for grouped items
        setTimeout(() => {
          entry.target.classList.add("visible");

          // Animate skill progress bars when they enter view
          entry.target.querySelectorAll(".skill-fill").forEach((fill) => {
            fill.style.width = fill.dataset.width + "%";
          });
        }, i * 80);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

/* ======================================================
      7. CONTACT FORM — SUBMIT FEEDBACK
      ====================================================== */
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = this.querySelector(".submit-btn");
  const originalHTML = btn.innerHTML;

  // Show success state
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = "linear-gradient(135deg, #00c9a7, #009e82)";
  btn.disabled = true;

  // Reset after 3 seconds
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = "";
    btn.disabled = false;
    this.reset();
  }, 3000);
});
