// ===== АНИМАЦИИ И ЭФФЕКТЫ =====

function initAnimations() {
    // Intersection Observer для анимаций прокрутки
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Специальная обработка для счетчиков
                if (entry.target.hasAttribute('data-counter')) {
                    const target = parseInt(entry.target.getAttribute('data-counter'));
                    PhantomJS.animateCounter(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами для анимации
    const animateElements = document.querySelectorAll('.feature-card, .card, .content-box, [data-counter]');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Улучшенное взаимодействие с карточками функций
function enhanceFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Эффекты переходов страниц
function initPageTransitions() {
    // Добавление класса перехода страницы при загрузке
    document.body.classList.add('page-enter');
    
    setTimeout(() => {
        document.body.classList.add('page-enter-active');
        document.body.classList.remove('page-enter');
    }, 50);
    
    // Обработка выходов со страницы для внутренних ссылок
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.target === '_blank') return;
            
            e.preventDefault();
            const href = this.href;
            
            document.body.classList.add('page-exit');
            document.body.classList.add('page-exit-active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}

// Поэтапные анимации для списков
function staggerAnimation(elements, animationClass = 'fade-in', delay = 100) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, index * delay);
    });
}

// Эффект параллакса при прокрутке
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * (element.dataset.parallax || 0.5);
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16));
}

// Анимация печатного текста
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Анимация появления при прокрутке
function revealOnScroll() {
    const reveals = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.reveal || 'fade-in';
                entry.target.classList.add(animationType);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

// Анимация преобразования кнопки
function morphButton(button, newText, newIcon = null) {
    const originalText = button.textContent;
    const originalIcon = button.querySelector('i')?.className;
    
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.textContent = newText;
        if (newIcon && button.querySelector('i')) {
            button.querySelector('i').className = newIcon;
        }
        
        button.style.transform = 'scale(1)';
        button.style.opacity = '1';
    }, 150);
    
    return () => {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.7';
        
        setTimeout(() => {
            button.textContent = originalText;
            if (originalIcon && button.querySelector('i')) {
                button.querySelector('i').className = originalIcon;
            }
            
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, 150);
    };
}

// Эффект пульсации
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Добавление эффекта пульсации к кнопкам
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .btn-icon');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Добавление CSS для эффекта пульсации
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .btn, .btn-icon {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Экспорт функций анимации
PhantomJS.staggerAnimation = staggerAnimation;
PhantomJS.typeWriter = typeWriter;
PhantomJS.morphButton = morphButton;
PhantomJS.createRipple = createRipple;

// Инициализация анимаций при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    revealOnScroll();
    initRippleEffect();
    enhanceFeatureCards();
});
