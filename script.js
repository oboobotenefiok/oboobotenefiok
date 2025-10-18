// script.js - Gallery auto-scroll functionality (works in both themes)
function autoScrollGalleries() {
  const galleries = document.querySelectorAll('.project-gallery');
  
  galleries.forEach(gallery => {
    let scrollAmount = 0;
    const scrollSpeed = 1;
    const scrollDelay = 2000;
    let scrollInterval;
    
    function scrollGallery() {
      if (scrollAmount >= gallery.scrollWidth - gallery.clientWidth) {
        scrollAmount = 0;
        gallery.scrollTo({ left: 0, behavior: 'instant' });
      } else {
        scrollAmount += scrollSpeed;
        gallery.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }
    
    // Start auto-scroll only if gallery has multiple images
    if (gallery.scrollWidth > gallery.clientWidth) {
      scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
      
      // Pause on hover
      gallery.addEventListener('mouseenter', () => {
        clearInterval(scrollInterval);
      });
      
      // Resume when mouse leaves
      gallery.addEventListener('mouseleave', () => {
        scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
      });
    }
  });
}

// Simple Typewriter Effect
function initSimpleTypewriter() {
  const bioElement = document.querySelector('.bio');
  if (!bioElement) return;
  
  const texts = [
    "Building innovative digital solutions",
    "A lot is going on in here",
    "Front end Developer",
    "Quantitative Analyst",
    "You either build or sit back watching",
    "Health Technician",
  ];
  
  let currentIndex = 0;
  let currentText = '';
  let isDeleting = false;
  let typeSpeed = 100;
  
  function type() {
    const fullText = texts[currentIndex];
    
    if (isDeleting) {
      currentText = fullText.substring(0, currentText.length - 1);
    } else {
      currentText = fullText.substring(0, currentText.length + 1);
    }
    
    bioElement.textContent = currentText;
    
    if (!isDeleting && currentText === fullText) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && currentText === '') {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % texts.length;
      typeSpeed = 500;
    } else if (isDeleting) {
      typeSpeed = 50;
    } else {
      typeSpeed = 100;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  // Start the effect immediately with shorter delay
  setTimeout(type, 300);
}

// Wait for theme to be initialized before starting animations
function waitForThemeInitialization() {
  return new Promise((resolve) => {
    if (document.documentElement.hasAttribute('data-theme')) {
      resolve();
    } else {
      document.addEventListener('themeInitialized', resolve);
      // Fallback timeout
      setTimeout(resolve, 100);
    }
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  // Wait for theme to be fully initialized
  await waitForThemeInitialization();
  
  // Force animations to start immediately
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  // Trigger reflow to ensure CSS applies
  document.body.clientHeight;
  
  // Start all animations
  autoScrollGalleries();
  initSimpleTypewriter();
  
  // Ensure starfield is visible
  const starfield = document.getElementById('starfield');
  if (starfield) {
    starfield.style.display = 'block';
  }
});

// Immediate animation start as fallback for fast loading
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    autoScrollGalleries();
    initSimpleTypewriter();
  }, 100);
}