// components.js - Main navigation and theme component
class NavigationComponents {
  static init() {
    this.injectComponents();
    this.initializeTheme();
    this.attachEventListeners();
  }
  
  static createNavigation() {
    return `
            <div class="nav-controls">
                <button id="themeToggle" class="theme-toggle">🌙</button>
                <button id="hamburger" class="hamburger-btn">☰</button>
            </div>
            <div id="menu" class="dropdown-menu">
                <ul>
                    <li><a href="/CV">Request CV(Résumé)</a></li>
                    <li><a href="/clicktoearn">Click To Earn</a></li>
                    <li><a href="/calculator">Fx Calculator</a></li>
                </ul>
            </div>
        `;
  }
  
  static injectComponents() {
  
    const existingNav = document.querySelector('.nav-controls');
    if (existingNav) existingNav.remove();
    
    const existingMenu = document.getElementById('menu');
    if (existingMenu) existingMenu.remove();
    
    // Create and inject new navigation
    const navContainer = document.createElement('div');
    navContainer.id = 'nav-components';
    navContainer.innerHTML = this.createNavigation();
    document.body.prepend(navContainer);
  }
  
  static initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggle(savedTheme);
    this.toggleStarfield(savedTheme);
  }
  
  static toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeToggle(newTheme);
    this.toggleStarfield(newTheme);
  }
  
  static updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }
  
  static toggleStarfield(theme) {
    const starfield = document.getElementById('starfield');
    if (starfield) {
      starfield.style.display = 'block'; // Always show in both modes
      this.initializeStarfield();
    }
  }
  
  static initializeStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    // Initial resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    let stars = [];
    const starCount = 150; // Slightly fewer for light mode
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.3, // Smaller stars for light mode
        speed: Math.random() * 0.3 + 0.1, // Slower speed for light mode
        opacity: Math.random() * 0.4 + 0.1 // Subtle opacity for light mode
      });
    }
    
    function animateStars() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      // Clear canvas with appropriate background
      if (currentTheme === 'dark') {
        // Dark mode: black background with white stars
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
      } else {
        // Light mode: white background with black/dark gray stars
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Subtle black stars
      }
      
      // Draw and update stars
      stars.forEach(star => {
        if (currentTheme === 'light') {
          // For light mode, use rgba for opacity
          ctx.fillStyle = `rgba(0, 0, 0, ${star.opacity})`;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move star down
        star.y += star.speed;
        
        // Reset star if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
          star.size = currentTheme === 'dark' ?
            Math.random() * 1.5 + 0.5 :
            Math.random() * 1.2 + 0.3;
          star.speed = currentTheme === 'dark' ?
            Math.random() * 0.5 + 0.1 :
            Math.random() * 0.3 + 0.1;
          star.opacity = currentTheme === 'dark' ? 1 : Math.random() * 0.4 + 0.1;
        }
      });
      
      // Continue animation
      requestAnimationFrame(animateStars);
    }
    
    // Start animation
    animateStars();
  }
  
  static attachEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    
    if (hamburger && menu) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
          menu.style.display = 'none';
        }
      });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Auto-scroll galleries (dark mode only)
    this.autoScrollGalleries();
  }
  
  static autoScrollGalleries() {
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
      
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
        gallery.addEventListener('mouseenter', () => clearInterval(scrollInterval));
        gallery.addEventListener('mouseleave', () => {
          scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
        });
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => NavigationComponents.init());
} else {
  NavigationComponents.init();
}
