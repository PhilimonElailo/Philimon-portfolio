/* ============================================
   Philimon's Portfolio — Interactions
   Smooth scroll, reveal animations, mobile nav, contact form
   ============================================ */

/* --- Smooth Scroll for Anchor Links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = 72; // matches --nav-height in CSS
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            // Close mobile nav if open
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
            }
        }
    });
});

/* --- Mobile Navigation Toggle --- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked (handled above via anchor click)
    // Close on outside click
    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('open');
        }
    });
}

/* --- Scroll-triggered Reveal Animations (Intersection Observer) --- */
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

/* --- Timeline dot animation on scroll --- */
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const dot = entry.target.querySelector('.timeline-dot');
            if (dot) {
                dot.classList.add('active');
            }
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });

timelineItems.forEach(item => timelineObserver.observe(item));

/* --- Contact Form Handler --- */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '✓ Sent!';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);

        this.reset();
    });
}

/* --- Navbar blur enhancement on scroll --- */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (navbar) {
        if (scrollY > 20) {
            navbar.style.background = 'rgba(10, 10, 10, 0.92)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.85)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
        }
    }
    lastScrollY = scrollY;
}, { passive: true });

/* --- Active nav link highlighting on scroll --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

function updateActiveLink() {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--text)';
            link.style.background = 'rgba(255, 255, 255, 0.04)';
        }
    });
}

// Throttled scroll listener for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveLink();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Initial call
updateActiveLink();

/* --- Back to Top Button --- */
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    // Show button once scrolled past the hero section
    const heroSection = document.getElementById('home');
    const heroOffset = heroSection ? heroSection.offsetHeight : window.innerHeight;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > heroOffset * 0.7) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // Smooth scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

console.log('🚀 Philimon\'s Portfolio — Redesign loaded');
