/* ============================================================
   1. AMBIENT RED LIGHT FOLLOWER
   ============================================================ */
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  if (glow) {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }
});

/* ============================================================
   2. LIVE FIRE EMBERS CANVAS (HERO PARTICLES)
   ============================================================ */
function initFireCanvas() {
  const canvas = document.getElementById('fireCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = 65;

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.alpha = 1;
      this.decay = Math.random() * 0.012 + 0.005;
      // Red to bright golden-red hues
      this.color = Math.random() > 0.4 ? '255, 30, 66' : '255, 125, 0';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha -= this.decay;
      if (this.alpha <= 0 || this.y < 0) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${this.color})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgb(${this.color})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // initial spread
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   3. 3D CARD MOUSE TILT ANIMATION
   ============================================================ */
function initTiltEffect() {
  const cards = document.querySelectorAll('.tilt-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 12;
      const rotateY = (x / rect.width) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });
}

// Re-run setup when components load into DOM
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initFireCanvas();
    initTiltEffect();
  }, 300);
});
/* ============================================================
   SERVICES CARD MOUSE-DRIVEN SPOTLIGHT
   ============================================================ */
function initServicesSpotlight() {
  const cards = document.querySelectorAll('.glow-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Attach to startup with other effects
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initServicesSpotlight, 350);
});
/* ============================================================
   SERVICES: SCROLL REVEAL (ONE-BY-ONE IGNITION)
   ============================================================ */
function initServicesScrollReveal() {
  const cards = document.querySelectorAll('.services .service-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Ignite card and stop observing it
        entry.target.classList.add('ignited');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Triggers when 15% of the card is visible
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

// Call on load & after include.js loads the HTML component
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initServicesScrollReveal, 400);
});
/* ============================================================
   ALBUM LIGHTBOX CONTROLLER
   ============================================================ */
function openLightbox(frame) {
  const lightbox = document.getElementById('albumLightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  
  if (!lightbox || !img) return;

  const targetImg = frame.querySelector('img');
  const targetTag = frame.querySelector('.frame-tag span');

  img.src = targetImg.src;
  caption.textContent = targetTag ? targetTag.textContent : '';
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scroll while viewing
}

function closeLightbox() {
  const lightbox = document.getElementById('albumLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
/* ============================================================
   VIDEO REEL LIGHTBOX CONTROLLER
   ============================================================ */
function openVideoLightbox(frame) {
  const lightbox = document.getElementById('albumLightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const caption = document.getElementById('lightboxCaption');
  
  if (!lightbox || !lightboxVideo) return;

  const sourceEl = frame.querySelector('video source');
  const targetTag = frame.querySelector('.frame-tag span');

  if (sourceEl) {
    lightboxVideo.src = sourceEl.src;
    lightboxVideo.currentTime = 0;
    lightboxVideo.play();
  }

  caption.textContent = targetTag ? targetTag.textContent : '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoLightbox() {
  const lightbox = document.getElementById('albumLightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');
  
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src'); // Stop buffering
    lightboxVideo.load();
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoLightbox();
});

/* ============================================================
   PORTFOLIO SPOTLIGHT: SCROLL IGNITION OBSERVER
   ============================================================ */
function initPortfolioSpotlightReveal() {
  const spotlight = document.querySelector('.portfolio-spotlight');
  if (!spotlight) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ignited');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2, // Triggers when 20% is in view
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(spotlight);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initPortfolioSpotlightReveal, 400);
});
/* ============================================================
   PARTNERS SECTION: SCROLL TRIGGER, COUNTERS & PHOTO REVEAL
   ============================================================ */
function animateCounters() {
  const counters = document.querySelectorAll('.partners .counter');
  const speed = 1200; // Animation duration in ms

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      // Smooth easeOutQuad easing
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeOut * target);

      counter.innerText = currentVal;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    }

    requestAnimationFrame(updateCount);
  });
}

function initPartnersReveal() {
  const partnersSection = document.getElementById('partners');
  if (!partnersSection) return;

  // 1. Observer pour la section (déclenche les compteurs)
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        partnersSection.classList.add('ignited');
        animateCounters();
        sectionObserver.unobserve(partnersSection);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  sectionObserver.observe(partnersSection);

  // 2. Observer pour les photos et éléments individuels (.reveal-up)
  const elementsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-reveal');
        elementsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const reveals = document.querySelectorAll('.partners .reveal-up');
  reveals.forEach(el => elementsObserver.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initPartnersReveal, 400);
});
/* ============================================================
   OPTIMISATION VIDÉO FLUIDE EN LIGNE (INTERSECTION OBSERVER)
   ============================================================ */
function initLazyVideos() {
  const lazyVideos = document.querySelectorAll('.lazy-video');
  if (!lazyVideos.length) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // La vidéo entre dans l'écran : lecture fluide
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Lecture automatique silencieuse sécurisée
            video.muted = true;
            video.play();
          });
        }
      } else {
        // La vidéo sort de l'écran : pause pour économiser le processeur et la bande passante
        video.pause();
      }
    });
  }, {
    threshold: 0.25 // Déclenche dès que 25% de la vidéo est visible
  });

  lazyVideos.forEach(video => videoObserver.observe(video));
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initLazyVideos, 300);
});
/* ============================================================
   ONGLETS SERVICES & GALERIES
   ============================================================ */
function initServicesTabs() {
  const tabBtns = document.querySelectorAll('.services-nav-tabs .tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.onclick = () => {
      // Retirer la sélection active
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));

      // Activer l'onglet cliqué
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initServicesTabs, 300);
});
/* ============================================================
   AUTO-CROSSFADE DES 4 CADRES PARTENAIRES
   ============================================================ */
/* ============================================================
   AUTO-CROSSFADE DES CADRES PARTENAIRES (COMPATIBLE INCLUDE.JS)
   ============================================================ */
function initPartnersAutoCrossfade() {
  const cards = document.querySelectorAll('.auto-crossfade-card');
  
  // Si le composant n'est pas encore injecté par include.js, on réessaie 150ms plus tard
  if (!cards.length) {
    setTimeout(initPartnersAutoCrossfade, 150);
    return;
  }

  cards.forEach((card, cardIndex) => {
    const images = card.querySelectorAll('.crossfade-img');
    if (images.length < 2) return;

    // S'assurer qu'au moins la première image est visible au départ
    let activeIdx = Array.from(images).findIndex(img => img.classList.contains('is-visible'));
    if (activeIdx === -1) {
      activeIdx = 0;
      images[0].classList.add('is-visible');
    }

    // Décalage pour alterner les cadres de façon désynchronisée
    const initialOffset = 1200 + (cardIndex * 800);

    setTimeout(() => {
      setInterval(() => {
        // Retirer la visibilité sur l'image courante
        images[activeIdx].classList.remove('is-visible');
        
        // Passer à la suivante (boucle infinie sur 2, 3 ou 7 photos)
        activeIdx = (activeIdx + 1) % images.length;
        
        // Afficher la nouvelle image
        images[activeIdx].classList.add('is-visible');
      }, 3800); // Vitesse de rotation : 3.8s
    }, initialOffset);
  });
}

// Lancement automatique au chargement
document.addEventListener('DOMContentLoaded', () => {
  initPartnersAutoCrossfade();
});
/* ============================================================
   AUTO HIDE & REVEAL WHATSAPP CTA ON SCROLL
   ============================================================ */
function initWhatsAppScrollToggle() {
  const cta = document.querySelector('.whatsapp-cta-container');
  if (!cta) return;

  let scrollTimeout;

  window.addEventListener('scroll', () => {
    // 1. Masquer dès que le défilement commence
    cta.classList.add('hidden-on-scroll');

    // 2. Annuler le décompte précédent
    clearTimeout(scrollTimeout);

    // 3. Réapparaître 400ms après l'arrêt complet du scroll
    scrollTimeout = setTimeout(() => {
      cta.classList.remove('hidden-on-scroll');
    }, 400);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initWhatsAppScrollToggle, 300);
});