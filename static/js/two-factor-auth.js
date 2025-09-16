// ===== TWO-FACTOR AUTHENTICATION FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Only run on 2FA pages
    if (!document.querySelector('.auth-2fa-container') && !document.querySelector('#twoFAForm')) return;
    
    initOtpInput();
});

// Auto-format OTP input
function initOtpInput() {
    const otpInput = document.getElementById('otp_code');
    if (otpInput) {
        otpInput.addEventListener('input', function() {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-submit when 6 digits are entered
            if (this.value.length === 6) {
                // Add small delay for better UX
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

// Copy to clipboard functionality
function copyToClipboard(selector) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    element.select();
    element.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Show feedback
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
        
        // Show notification if available
        if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
            PhantomJS.showNotification('Секретный ключ скопирован в буфер обмена', 'success');
        }
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Show error notification if available
        if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
            PhantomJS.showNotification('Не удалось скопировать текст', 'error');
        }
    }
}

// Generate backup codes
function generateBackupCodes() {
    // This would typically make an AJAX request to generate new backup codes
    if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
        PhantomJS.showNotification('Функция генерации резервных кодов будет реализована в следующем обновлении.', 'info');
    } else {
        alert('Функция генерации резервных кодов будет реализована в следующем обновлении.');
    }
}

// Export functions to global scope for inline usage
window.copyToClipboard = copyToClipboard;
window.generateBackupCodes = generateBackupCodes;
