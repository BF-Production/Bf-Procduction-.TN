// Universal Mobile Menu Controller using Event Delegation
function setupMobileMenuDelegation() {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#mobileToggle');
    const navLink = e.target.closest('.nav-links a');
    const navLinks = document.getElementById('navLinks');
    const toggle = document.getElementById('mobileToggle');

    // 1. Clicked the hamburger button
    if (toggleBtn) {
      e.preventDefault();
      toggleBtn.classList.toggle('active');
      if (navLinks) {
        navLinks.classList.toggle('open');
      }
      return;
    }

    // 2. Clicked any link inside the mobile menu
    if (navLink && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (toggle) toggle.classList.remove('active');
      return;
    }

    // 3. Clicked outside the open drawer (close on backdrop click)
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navLinks.contains(e.target) && !e.target.closest('#mobileToggle')) {
        navLinks.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const navLinks = document.getElementById('navLinks');
      const toggle = document.getElementById('mobileToggle');
      if (navLinks) navLinks.classList.remove('open');
      if (toggle) toggle.classList.remove('active');
    }
  });
}

// Robust Component Loader
async function loadComponents() {
  const elements = Array.from(document.querySelectorAll('[data-include]'));
  
  // Load each component sequentially
  for (const el of elements) {
    const file = el.getAttribute('data-include');
    try {
      const response = await fetch(file);
      if (response.ok) {
        const html = await response.text();
        el.insertAdjacentHTML('afterend', html);
        el.remove();
      } else {
        console.error(`Failed to load: ${file} (${response.status})`);
      }
    } catch (err) {
      console.error(`Fetch error on ${file}:`, err);
    }
  }

  // Initialize interactive features once DOM is fully rendered
  if (typeof initFilter === 'function') initFilter();
  if (typeof initContact === 'function') initContact();
  // Inside loadComponents() in js/include.js:
if (typeof initServicesScrollReveal === 'function') initServicesScrollReveal();
if (typeof initServicesSpotlight === 'function') initServicesSpotlight();
// Inside loadComponents() in js/include.js:
if (typeof initPortfolioSpotlightReveal === 'function') initPortfolioSpotlightReveal();
// Inside loadComponents() in js/include.js:
if (typeof initPartnersReveal === 'function') {
  initPartnersReveal();
}
}

// Start listeners immediately
setupMobileMenuDelegation();
document.addEventListener('DOMContentLoaded', loadComponents);
