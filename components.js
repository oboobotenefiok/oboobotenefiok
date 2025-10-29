// components.js - Reusable navigation component
class NavigationComponents {
  static init() {
    this.injectNavigation();
    this.initializeTheme();
    this.attachEventListeners();
  }
  
  static createNavigation() {
    return `
      <div class="nav-controls">
        <button id="themeToggle" class="theme-toggle">🌙</button>
        <button id="hamburger" class="hamburger-btn">☰</button>
      </div>
      <div id="dropdownMenu" class="dropdown-menu">
        <ul>
        <li><a href="/">Home</a></li>
          <li><a href="/CV">Request CV (Résumé)</a></li>
          <li><a href="/clicktoearn">Click To Earn</a></li>
          <li><a href="/calculator">Fx Calculator</a></li>
             <li><a href="https://glowfitapp.netlify.app">GlowFit</a></li>
          
        </ul>
      </div>
    `;
  }
  
  static injectNavigation() {
    // Remove existing navigation if any
    const existingNav = document.querySelector('.nav-controls');
    if (existingNav) existingNav.remove();
    
    const existingMenu = document.getElementById('dropdownMenu');
    if (existingMenu) existingMenu.remove();
    
    // Create and inject navigation
    const navContainer = document.createElement('div');
    navContainer.id = 'navigation-component';
    navContainer.innerHTML = this.createNavigation();
    document.body.prepend(navContainer);
  }
  
  static initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggle(savedTheme);
    
    // Initialize starfield for both themes immediately
    this.initializeStarfield();
    
    // Dispatch event to notify other scripts
    document.dispatchEvent(new CustomEvent('themeInitialized', {
      detail: { theme: savedTheme }
    }));
  }
  
  static toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeToggle(newTheme);
    
    // Restart starfield with new theme
    this.initializeStarfield();
  }
  
  static updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
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
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let stars = [];
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
    
    function animateStars() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      // Clear canvas with appropriate background
      if (currentTheme === 'dark') {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      stars.forEach(star => {
        if (currentTheme === 'dark') {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        } else {
          // Subtle gray stars for light mode
          ctx.fillStyle = `rgba(0, 0, 0, ${star.opacity * 0.3})`;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        star.y += star.speed;
        
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animateStars);
    }
    
    // Start animation immediately
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
    const menu = document.getElementById('dropdownMenu');
    
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => NavigationComponents.init());
} else {
  NavigationComponents.init();
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationComponents;
}