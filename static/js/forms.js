// ===== FORM ENHANCEMENTS =====

function initForms() {
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Skip auth forms as they have their own loading handling
        if (form.id === 'loginForm' || form.id === 'registrationForm') {
            return;
        }
        
        // Add loading states to form submissions for other forms
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn && submitBtn.getAttribute('data-loading')) {
                addLoadingState(submitBtn);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation
    clearFieldError(e);
    
    // Basic validation rules
    if (field.required && !value) {
        showFieldError(field, 'Это поле обязательно для заполнения');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Введите корректный email адрес');
            return false;
        }
    }
    
    if (field.type === 'password' && value.length > 0 && value.length < 6) {
        showFieldError(field, 'Пароль должен содержать минимум 6 символов');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Form auto-save functionality
function initAutoSave() {
    const forms = document.querySelectorAll('[data-autosave]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const saveKey = `autosave_${form.id || 'form'}_${input.name || input.id}`;
            
            // Load saved data
            const savedValue = localStorage.getItem(saveKey);
            if (savedValue && input.value === '') {
                input.value = savedValue;
            }
            
            // Save on input
            input.addEventListener('input', debounce(() => {
                localStorage.setItem(saveKey, input.value);
            }, 500));
        });
        
        // Clear saved data on successful submit
        form.addEventListener('submit', () => {
            inputs.forEach(input => {
                const saveKey = `autosave_${form.id || 'form'}_${input.name || input.id}`;
                localStorage.removeItem(saveKey);
            });
        });
    });
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength += 1;
    else feedback.push('минимум 8 символов');
    
    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push('строчные буквы');
    
    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push('заглавные буквы');
    
    if (/[0-9]/.test(password)) strength += 1;
    else feedback.push('цифры');
    
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    else feedback.push('специальные символы');
    
    const colors = ['var(--accent-danger)', 'var(--accent-warning)', 'var(--accent-primary)', 'var(--accent-success)', 'var(--accent-success)'];
    const labels = ['Очень слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный'];
    
    return {
        strength,
        color: colors[strength-1] || colors[0],
        label: labels[strength-1] || labels[0],
        feedback
    };
}

// Export form functions to global namespace
window.togglePassword = togglePassword;
PhantomJS.checkPasswordStrength = checkPasswordStrength;
PhantomJS.validateField = validateField;
PhantomJS.showFieldError = showFieldError;
PhantomJS.clearFieldError = clearFieldError;

