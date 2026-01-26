// ===== THEME TOGGLE FUNCTIONALITY =====

// Инициализация темы при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    createThemeToggleButton();
});

// Инициализация темы из localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Добавляем плавный переход после загрузки страницы
    setTimeout(() => {
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 100);
    
    console.log(`🎨 Тема установлена: ${savedTheme}`);
}

// Создание кнопки переключения темы
function createThemeToggleButton() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    // Создаем кнопку
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Переключить тему');
    themeToggle.setAttribute('title', 'Переключить тему');
    
    // Устанавливаем иконку в зависимости от текущей темы
    updateThemeIcon(themeToggle);
    
    // Добавляем обработчик клика
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
    
    // Вставляем кнопку после nav-brand, но перед mobile-menu-toggle
    const navBrand = navContainer.querySelector('.nav-brand');
    const mobileToggle = navContainer.querySelector('.mobile-menu-toggle');
    
    if (navBrand) {
        if (mobileToggle) {
            navBrand.insertAdjacentElement('afterend', themeToggle);
        } else {
            navBrand.insertAdjacentElement('afterend', themeToggle);
        }
    }
}

// Переключение темы
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Анимация перехода
    animateThemeTransition(newTheme);
    
    // Применяем новую тему
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Обновляем иконку
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        updateThemeIcon(themeToggle);
    }
    
    console.log(`🎨 Тема изменена на: ${newTheme}`);
    
    // Показываем уведомление
    showThemeNotification(newTheme);
}

// Обновление иконки в зависимости от темы
function updateThemeIcon(button) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (currentTheme === 'dark') {
        button.innerHTML = '<i class="fas fa-sun"></i>';
        button.setAttribute('title', 'Переключить на светлую тему');
        button.setAttribute('aria-label', 'Переключить на светлую тему');
    } else {
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.setAttribute('title', 'Переключить на темную тему');
        button.setAttribute('aria-label', 'Переключить на темную тему');
    }
}

// Анимация перехода между темами
function animateThemeTransition(newTheme) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${newTheme === 'light' ? '#ffffff' : '#1a1a1a'};
        opacity: 0;
        pointer-events: none;
        z-index: 99999;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // Плавное появление оверлея
    requestAnimationFrame(() => {
        overlay.style.opacity = '0.3';
    });
    
    // Убираем оверлей
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }, 200);
}

// Показать уведомление о смене темы
function showThemeNotification(theme) {
    const themeName = theme === 'dark' ? 'Темная тема' : 'Светлая тема';
    const icon = theme === 'dark' ? '🌙' : '☀️';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `${icon} ${themeName}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-medium);
        border: 2px solid var(--accent-primary);
        box-shadow: var(--shadow-heavy);
        z-index: 10000;
        font-weight: 600;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(notification);
    
    // Показываем с анимацией
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Скрываем через 2 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Экспорт функций в глобальное пространство имен
window.PhantomJS = window.PhantomJS || {};
window.PhantomJS.toggleTheme = toggleTheme;
window.PhantomJS.getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';

