// ===== ФУНКЦИОНАЛЬНОСТЬ ДВУХФАКТОРНОЙ АУТЕНТИФИКАЦИИ =====

document.addEventListener('DOMContentLoaded', function() {
    // Запускать только на страницах 2FA
    if (!document.querySelector('.auth-2fa-container') && !document.querySelector('#twoFAForm')) return;
    
    initOtpInput();
});

// Автоформатирование ввода OTP
function initOtpInput() {
    const otpInput = document.getElementById('otp_code');
    if (otpInput) {
        otpInput.addEventListener('input', function() {
            // Разрешить только цифры
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Автоотправка при вводе 6 цифр
            if (this.value.length === 6) {
                // Добавить небольшую задержку для лучшего UX
                setTimeout(() => {
                    const form = document.getElementById('twoFAForm');
                    if (form) {
                        form.submit();
                    }
                }, 500);
            }
        });
    }
}

// Функциональность копирования в буфер обмена
function copyToClipboard(selector) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    element.select();
    element.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        
        // Показать обратную связь
        const btn = document.querySelector('.copy-btn');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        }
        
        // Показать уведомление если доступно
        if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
            PhantomJS.showNotification('Секретный ключ скопирован в буфер обмена', 'success');
        }
        
    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
        
        // Показать уведомление об ошибке если доступно
        if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
            PhantomJS.showNotification('Не удалось скопировать текст', 'error');
        }
    }
}

// Генерация резервных кодов
function generateBackupCodes() {
    // Обычно это делает AJAX-запрос для генерации новых резервных кодов
    if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
        PhantomJS.showNotification('Функция генерации резервных кодов будет реализована в следующем обновлении.', 'info');
    } else {
        alert('Функция генерации резервных кодов будет реализована в следующем обновлении.');
    }
}

// Экспорт функций в глобальную область для встроенного использования
window.copyToClipboard = copyToClipboard;
window.generateBackupCodes = generateBackupCodes;
