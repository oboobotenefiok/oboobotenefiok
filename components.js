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
    if (starfield && theme === 'dark') {
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
      
      if (currentTheme === 'dark') {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      }
      
      stars.forEach(star => {
        if (currentTheme === 'light') {
          ctx.fillStyle = `rgba(0, 0, 0, ${star.opacity})`;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        star.y += star.speed;
        
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
      
      requestAnimationFrame(animateStars);
    }
    
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