// Modern Portfolio Template JavaScript
// Handles navigation, smooth scrolling, and interactive features

// Site Configuration - Update these values to change across all pages
const SITE_CONFIG = {
    email: 'yuri@yurikorolev.com',
    linkedin: 'https://linkedin.com/in/yuriikorolev',
    github: 'https://github.com/Snoe0'
};

// Populate contact links from config
function populateContactLinks() {
    // Email links
    document.querySelectorAll('a[data-contact="email"]').forEach(link => {
        link.href = `mailto:${SITE_CONFIG.email}`;
    });

    // LinkedIn links
    document.querySelectorAll('a[data-contact="linkedin"]').forEach(link => {
        link.href = SITE_CONFIG.linkedin;
    });

    // GitHub links
    document.querySelectorAll('a[data-contact="github"]').forEach(link => {
        link.href = SITE_CONFIG.github;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    populateContactLinks();
    initNavigation();
    initSmoothScrolling();
    initAnimations();
    initThemeDetection();
    initScrollProgress();
    initScrollReveal();

    console.log('Portfolio template loaded successfully');
});

// Scroll Progress Indicator
function initScrollProgress() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// Scroll Reveal Animations
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.section, .project-thumbnail, .skill-category, .timeline-item, .feature-item, .challenge-item').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    const revealElements = document.querySelectorAll('.section, .project-thumbnail, .skill-category, .timeline-item, .feature-item, .challenge-item');

    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    const staggerContainers = document.querySelectorAll('.skills-grid, .projects-grid, .features-grid, .image-gallery');
    staggerContainers.forEach(el => {
        el.classList.add('reveal-stagger');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        revealObserver.observe(el);
    });
}

// Navigation Management
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);

            // Animate hamburger icon
            navToggle.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        // Close mobile menu when clicking on links
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.style.transform = 'rotate(0deg)';
            }
        });

        // Close mobile menu on outside click
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Active navigation highlighting
    updateActiveNavigation();
}

// Update active navigation based on current page
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');

        if (linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            if (prefersReducedMotion) {
                window.scrollTo(0, targetPosition);
            } else {
                smoothScrollTo(targetPosition, 600);
            }

            // Update URL without jumping
            history.pushState(null, '', targetId);
        });
    });
}

// Custom smooth scroll with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Ease-out cubic for smooth deceleration
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (elapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Animation and Scroll Effects
function initAnimations() {
    // Fade in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-thumbnail, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Skill category hover effects
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
}

// Theme Detection and Accessibility
function initThemeDetection() {
    // Detect user's preferred color scheme
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Note: Currently using light theme, but this prepares for future dark mode
        function handleThemeChange(e) {
            if (e.matches) {
                document.body.classList.add('dark-mode-preferred');
            } else {
                document.body.classList.remove('dark-mode-preferred');
            }
        }

        mediaQuery.addListener(handleThemeChange);
        handleThemeChange(mediaQuery);
    }

    // Reduce motion for accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');

        // Disable smooth scrolling
        const style = document.createElement('style');
        style.textContent = '* { scroll-behavior: auto !important; }';
        document.head.appendChild(style);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form Handling (if contact forms are added)
function initFormHandling() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');

                    // Remove error class on input
                    field.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                }
            });

            if (isValid) {
                // Here you would typically send the form data
                console.log('Form submitted successfully');
                showNotification('Message sent successfully!', 'success');
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#000' : type === 'error' ? '#dc2626' : '#666'};
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Log performance metrics in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.group('Performance Metrics');
                console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
                console.log(`Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
                console.log(`Total Page Load: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
                console.groupEnd();
            }, 0);
        });
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Export functions for potential use by other scripts
window.portfolioUtils = {
    showNotification,
    debounce,
    updateActiveNavigation
};