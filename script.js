// Modern Portfolio Template JavaScript
// Handles navigation, smooth scrolling, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initSmoothScrolling();
    initAnimations();
    initThemeDetection();
    initProjectModals();
    initInteractiveTitle();

    console.log('Portfolio template loaded successfully');
});

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
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const offsetTop = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
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

// Project Modal System
function initProjectModals() {
    const projectThumbnails = document.querySelectorAll('.project-thumbnail');
    const modals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.project-modal-close');

    // Open modal when thumbnail is clicked
    projectThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const modal = document.getElementById(projectId + '-modal');

            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling

                // Focus management for accessibility
                modal.focus();

                // Add keyboard navigation
                handleModalKeyboard(modal);
            }
        });

        // Add keyboard support for thumbnails
        thumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Make thumbnails focusable
        thumbnail.setAttribute('tabindex', '0');
    });

    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.project-modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.project-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    // Return focus to the thumbnail that opened the modal
    const projectId = modal.id.replace('-modal', '');
    const thumbnail = document.querySelector(`[data-project="${projectId}"]`);
    if (thumbnail) {
        thumbnail.focus();
    }
}

function handleModalKeyboard(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstFocusable.focus();

    // Trap focus within modal
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Interactive Title System
function initInteractiveTitle() {
    const titleElement = document.getElementById('interactive-title');
    if (!titleElement) return;

    const defaultText = 'Yuri Korolev';
    let currentText = defaultText;
    let isTyping = false;
    let typingTimer;
    let keyboardFocused = false;

    // Set initial state
    titleElement.textContent = defaultText;

    // Reset to default text after inactivity
    function resetToDefault() {
        if (currentText !== defaultText) {
            titleElement.textContent = defaultText;
            currentText = defaultText;
        }
        keyboardFocused = false;
    }

    // Update text display with proper wrapping
    function updateDisplay() {
        titleElement.textContent = currentText;
    }

    // Handle keyboard input
    document.addEventListener('keydown', function(e) {
        // Prevent spacebar from scrolling when keyboard is focused
        if (e.key === ' ' && keyboardFocused) {
            e.preventDefault();
        }

        // Ignore navigation and system keys (but allow spacebar for typing)
        if (e.ctrlKey || e.altKey || e.metaKey ||
            ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
            return;
        }

        clearTimeout(typingTimer);
        isTyping = true;
        keyboardFocused = true;

        if (e.key === 'Backspace') {
            // Remove last character
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                updateDisplay();
            }
        } else if (e.key === 'Enter') {
            // Add line break
            currentText += '\n';
            updateDisplay();
        } else if (e.key === ' ') {
            // Add space
            currentText += ' ';
            updateDisplay();
        } else if (e.key.length === 1) {
            // Add typed character
            if (currentText.length < 200) { // Increased limit for wrapping text
                currentText += e.key;
                updateDisplay();
            }
        }

        // Reset to default after 5 seconds of inactivity
        typingTimer = setTimeout(() => {
            isTyping = false;
            setTimeout(resetToDefault, 1000);
        }, 5000);
    });

    // Handle click to activate keyboard focus
    document.addEventListener('click', function(e) {
        keyboardFocused = true;
        setTimeout(() => {
            if (!isTyping) {
                keyboardFocused = false;
            }
        }, 3000);
    });

    // Add typing indicator effect
    let blinkInterval;
    let showCursor = false;

    function startBlinking() {
        clearInterval(blinkInterval);
        blinkInterval = setInterval(() => {
            if (isTyping || keyboardFocused) {
                showCursor = !showCursor;
                if (showCursor) {
                    titleElement.textContent = currentText + '|';
                } else {
                    titleElement.textContent = currentText;
                }
            } else {
                titleElement.textContent = currentText;
                showCursor = false;
            }
        }, 500);
    }

    startBlinking();

    // Prevent spacebar scrolling when interacting with the title area
    document.addEventListener('keydown', function(e) {
        if (e.key === ' ' && (isTyping || keyboardFocused)) {
            e.preventDefault();
        }
    });
}

// Export functions for potential use by other scripts
window.portfolioUtils = {
    showNotification,
    debounce,
    updateActiveNavigation,
    closeModal
};