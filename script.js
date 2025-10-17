// Force dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Auto-scroll galleries
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
  scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
  gallery.addEventListener('mouseenter', () => {
   clearInterval(scrollInterval);
  });
  gallery.addEventListener('mouseleave', () => {
   scrollInterval = setInterval(scrollGallery, scrollDelay / 60);
  });
 });
}
document.addEventListener('DOMContentLoaded', autoScrollGalleries);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
 anchor.addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector(this.getAttribute('href')).scrollIntoView({
   behavior: 'smooth'
  });
 });
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
 const carousel = document.querySelector('.carousel-inner');
 const items = document.querySelectorAll('.carousel-item');
 const prevButton = document.querySelector('.carousel-prev');
 const nextButton = document.querySelector('.carousel-next');
 let currentIndex = 0;
 
 function showSlide(index) {
  if (index >= items.length) {
   currentIndex = 0;
  } else if (index < 0) {
   currentIndex = items.length - 1;
  } else {
   currentIndex = index;
  }
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
 }
 
 prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
 nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
 
 // Auto-slide
 setInterval(() => showSlide(currentIndex + 1), 5000);
});

// Starfield background
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let stars = [];
for (let i = 0; i < 200; i++) {
 stars.push({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 1,
  speed: Math.random() * 0.3 + 0.1
 });
}

function animate() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = 'black';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 
 ctx.fillStyle = 'white';
 stars.forEach(star => {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fill();
  
  star.y += star.speed;
  if (star.y > canvas.height) {
   star.y = 0;
   star.x = Math.random() * canvas.width;
  }
 });
 
 requestAnimationFrame(animate);
}
animate();

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
 menu.style.display = (menu.style.display === "block") ? "none" : "block";
});

// Optional: click outside to close
document.addEventListener('click', (e) => {
 if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
  menu.style.display = "none";
 }
});