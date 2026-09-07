/* ============================================================
   CINEMATIC FULLSCREEN SLIDER (PROTECTION DOUBLE EXÉCUTION)
   ============================================================ */
let heroSliderInitialized = false;
let autoTimer = null;

function initCinematicHeroSlider() {
  const slider = document.getElementById('cinematicSlider');
  const heroSection = document.querySelector('.hero-cinematic');

  // Si le slider n'est pas encore injecté ou déjà initialisé, on arrête
  if (!slider || !heroSection) return;
  if (heroSliderInitialized) return;

  heroSliderInitialized = true;

  // Lancement de l'animation d'entrée
  requestAnimationFrame(() => {
    heroSection.classList.add('loaded');
  });

  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const counterCurrent = document.querySelector('#slideCounter .current');
  const counterTotal = document.querySelector('#slideCounter .total');

  let currentIndex = 0;
  const total = slides.length;

  if (counterTotal) {
    counterTotal.textContent = total < 10 ? `0${total}` : total;
  }

  function showSlide(index) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });

    if (counterCurrent) {
      counterCurrent.textContent = index + 1 < 10 ? `0${index + 1}` : index + 1;
    }

    currentIndex = index;
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % total;
    showSlide(nextIdx);
  }

  function prevSlide() {
    const prevIdx = (currentIndex - 1 + total) % total;
    showSlide(prevIdx);
  }

  // Écouteurs de clics (une seule fois grâce au verrou)
  if (nextBtn) {
    nextBtn.onclick = () => {
      nextSlide();
      restartTimer();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      prevSlide();
      restartTimer();
    };
  }

  function startTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 6000);
  }

  function restartTimer() {
    clearInterval(autoTimer);
    startTimer();
  }

  startTimer();
}

// Déclencheur direct si non inclus via include.js
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCinematicHeroSlider, 300);
});