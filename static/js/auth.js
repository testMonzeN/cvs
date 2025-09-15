// ===== AUTHENTICATION FORMS =====

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Initialize authentication forms
document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initRegistrationForm();
    initPasswordStrengthChecker();
    initPasswordMatchChecker();
});

// Login form functionality
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm && loginBtn) {
        loginForm.addEventListener('submit', function(e) {
            // Show loading state
            const originalHTML = loginBtn.innerHTML;
            loginBtn.disabled = true;
            loginBtn.innerHTML = `
                <span class="loading-spinner"></span>
                Вход...
            `;
            
            // Add timeout to prevent infinite loading
            setTimeout(() => {
                if (loginBtn.disabled) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = originalHTML;
                }
            }, 10000); // 10 seconds timeout
        });
    }
}

// Registration form functionality
function initRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    const registerBtn = document.getElementById('registerBtn');
    
    if (registrationForm && registerBtn) {
        registrationForm.addEventListener('submit', function(e) {
            // Show loading state
            const originalHTML = registerBtn.innerHTML;
            registerBtn.disabled = true;
            registerBtn.innerHTML = `
                <span class="loading-spinner"></span>
                Регистрация...
            `;
            
            // Add timeout to prevent infinite loading
            setTimeout(() => {
                if (registerBtn.disabled) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = originalHTML;
                }
            }, 10000); // 10 seconds timeout
        });
    }
}

// Password strength checker
function initPasswordStrengthChecker() {
    const passwordInput = document.getElementById('id_password1');
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthDiv) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const result = PhantomJS.checkPasswordStrength(password);
            
            strengthDiv.innerHTML = `
                <div style="color: ${result.color};">
                    Сложность: ${result.label}
                </div>
                ${result.feedback.length ? `<div style="font-size: 0.8rem; color: var(--text-muted);">Добавьте: ${result.feedback.join(', ')}</div>` : ''}
            `;
        });
    }
}

// Password match checker
function initPasswordMatchChecker() {
    const password1Input = document.getElementById('id_password1');
    const password2Input = document.getElementById('id_password2');
    const matchDiv = document.getElementById('passwordMatch');
    
    if (password1Input && password2Input && matchDiv) {
        password2Input.addEventListener('input', function() {
            const password1 = password1Input.value;
            const password2 = this.value;
            
            if (password2.length === 0) {
                matchDiv.innerHTML = '';
                return;
            }
            
            if (password1 === password2) {
                matchDiv.innerHTML = '<div style="color: var(--accent-success);"><i class="fas fa-check"></i> Пароли совпадают</div>';
            } else {
                matchDiv.innerHTML = '<div style="color: var(--accent-danger);"><i class="fas fa-times"></i> Пароли не совпадают</div>';
            }
        });
    }
}

// Two-factor authentication setup
function initTwoFactorAuth() {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const otpInput = document.getElementById('otpInput');
    const verifyBtn = document.getElementById('verifyBtn');
    
    if (qrCodeContainer && otpInput && verifyBtn) {
        // Auto-focus on OTP input
        otpInput.focus();
        
        // Format OTP input (6 digits)
        otpInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 6) {
                value = value.substr(0, 6);
            }
            this.value = value;
            
            // Enable verify button when 6 digits entered
            verifyBtn.disabled = value.length !== 6;
        });
        
        // Auto-submit when 6 digits entered
        otpInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                setTimeout(() => {
                    if (this.value.length === 6) {
                        verifyBtn.click();
                    }
                }, 500);
            }
        });
    }
}

// Account security functions
function enableTwoFactor() {
    PhantomJS.showNotification('Настройка двухфакторной аутентификации...', 'info');
    // Redirect to 2FA setup page
    window.location.href = '/cabinet/authentication/';
}

function disableTwoFactor() {
    if (confirm('Вы уверены, что хотите отключить двухфакторную аутентификацию? Это снизит безопасность вашего аккаунта.')) {
        // Make AJAX request to disable 2FA
        fetch('/cabinet/disable-2fa/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                PhantomJS.showNotification('Двухфакторная аутентификация отключена', 'success');
                location.reload();
            } else {
                PhantomJS.showNotification('Ошибка при отключении 2FA', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            PhantomJS.showNotification('Произошла ошибка', 'error');
        });
    }
}

// Account deletion
function deleteAccount() {
    const confirmText = 'УДАЛИТЬ';
    const userInput = prompt(`Для подтверждения удаления аккаунта введите "${confirmText}" (без кавычек):`);
    
    if (userInput === confirmText) {
        if (confirm('Это действие необратимо. Все ваши данные будут удалены. Продолжить?')) {
            // Make AJAX request to delete account
            fetch('/cabinet/delete-account/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    PhantomJS.showNotification('Аккаунт удален', 'success');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    PhantomJS.showNotification('Ошибка при удалении аккаунта', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                PhantomJS.showNotification('Произошла ошибка', 'error');
            });
        }
    } else if (userInput !== null) {
        PhantomJS.showNotification('Неверный текст подтверждения', 'error');
    }
}

// Export auth functions to global namespace
window.enableTwoFactor = enableTwoFactor;
window.disableTwoFactor = disableTwoFactor;
window.deleteAccount = deleteAccount;

// Initialize 2FA if on auth page
if (window.location.pathname.includes('/authentication/')) {
    document.addEventListener('DOMContentLoaded', initTwoFactorAuth);
}

