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
    
    // Start auto-scroll
    scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
    
    // Pause on hover
    gallery.addEventListener('mouseenter', () => {
      clearInterval(scrollInterval);
    });
    
    // Resume when mouse leaves
    gallery.addEventListener('mouseleave', () => {
      scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
    });
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  autoScrollGalleries();
});
// Simple Typewriter Effect - Add to script.js
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
  
  // Start the effect after a brief delay
  setTimeout(type, 1000);
}

// Call it when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  autoScrollGalleries();
  initSimpleTypewriter(); // Add this line
});