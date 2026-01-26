// ===== CORE JAVASCRIPT PHANTOM =====

// Глобальное пространство имен для функций Phantom
window.PhantomJS = window.PhantomJS || {};

// Инициализация ядра
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Основная функция инициализации
function initializeApp() {
    initNavbar();
    initAnimations();
    initForms();
    initModals();
    initTooltips();
    initLoadingStates();
    initSmoothScroll();
    
    // Анимация загрузки страницы
    animatePageLoad();
    
    console.log('🎯 Сайт Phantom инициализирован');
}

// Анимация загрузки страницы
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

// Вспомогательные функции
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

// Форматирование даты для русской локали
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };
    
    return new Intl.DateTimeFormat('ru-RU', defaultOptions).format(new Date(date));
}

// Анимация счетчика чисел
function animateCounter(element, start, end, duration = 2000) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Функция плавности
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * easeOutCubic));
        
        element.textContent = current.toLocaleString('ru-RU');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Экспорт основных функций в глобальное пространство имен
PhantomJS.debounce = debounce;
PhantomJS.throttle = throttle;
PhantomJS.formatDate = formatDate;
PhantomJS.animateCounter = animateCounter;

// Глобальный обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('Глобальная ошибка:', e.error);
});

// Помощники для разработки
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Режим разработки активен');
    
    // Добавить инструменты разработчика
    window.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D для информации отладки
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            console.log('🎯 Информация отладки:', {
                currentUser: window.currentUsername || 'гость',
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
