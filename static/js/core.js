// ===== PHANTOM CORE JAVASCRIPT =====

// Global namespace for Phantom functions
window.PhantomJS = window.PhantomJS || {};

// Core initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initNavbar();
    initAnimations();
    initForms();
    initModals();
    initTooltips();
    initLoadingStates();
    initSmoothScroll();
    
    // Animate page load
    animatePageLoad();
    
    console.log('🎯 Phantom site initialized');
}

// Page load animation
function animatePageLoad() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transform = 'translateY(20px)';
    body.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
        body.style.opacity = '1';
        body.style.transform = 'translateY(0)';
    }, 100);
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Format date for Russian locale
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };
    
    return new Intl.DateTimeFormat('ru-RU', defaultOptions).format(new Date(date));
}

// Animate counter numbers
function animateCounter(element, start, end, duration = 2000) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * easeOutCubic));
        
        element.textContent = current.toLocaleString('ru-RU');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Export core functions to global namespace
PhantomJS.debounce = debounce;
PhantomJS.throttle = throttle;
PhantomJS.formatDate = formatDate;
PhantomJS.animateCounter = animateCounter;

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Could send error reports to server here
});

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode active');
    
    // Add dev tools
    window.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D for debug info
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            console.log('🎯 Debug Info:', {
                currentUser: window.currentUsername || 'guest',
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                scrollPosition: window.pageYOffset,
                activeModals: document.querySelectorAll('.modal.show').length
            });
        }
    });
}

