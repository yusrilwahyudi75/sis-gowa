import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import './components/layout.js';
import { renderDepartments } from './modules/departments.js';
import { fetchNews, renderNews } from './modules/news.js';
import { renderAnnouncements } from './modules/announcements.js';
import { fetchGallery, setupHomeUnifiedGallery, setupGalleryPage } from './modules/gallery.js';
import { fetchTeachers, renderTeachers } from './modules/teachers.js';
import { renderHeroCarousel } from './modules/hero.js';

// Render components if elements exist
renderDepartments('departments-container');
renderAnnouncements('announcements-container');

// SPMB 2027 Countdown Timer Logic (Target Date: 1 Mei 2027)
function initSPMBCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const targetDate = new Date('2027-05-01T08:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

async function init() {
    // Render hero carousel separately
    renderHeroCarousel('hero-carousel-inner');

    const [news, gallery, teachers] = await Promise.all([
        fetchNews(),
        fetchGallery(),
        fetchTeachers()
    ]);
    
    renderNews(news, 'news-container');
    renderTeachers(teachers, 'teachers-container');

    // Init Countdown Timer
    initSPMBCountdown();

    // Gallery rendering check: galeri.html vs homepage
    const isGalleryPage = document.getElementById('gallery-filter-tabs');
    if (isGalleryPage) {
        setupGalleryPage(gallery);
    } else {
        setupHomeUnifiedGallery(gallery);
    }
}

init();

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('py-2', 'shadow');
        } else {
            navbar.classList.remove('py-2', 'shadow');
        }
    }
});

// Initialize tooltips/popovers if needed
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

console.log('SIS-Gowa SPMB 2027 initialized successfully!');
