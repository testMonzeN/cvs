// ===== COMPONENT FUNCTIONALITY =====

// Modal system
function initModals() {
    // Modal triggers
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-modal]')) {
            e.preventDefault();
            const modalId = e.target.getAttribute('data-modal');
            openModal(modalId);
        }
        
        if (e.target.matches('.modal-close, .modal-backdrop')) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
            focusableElements[0].focus();
        }
    }
}

function closeModal() {
    const openModal = document.querySelector('.modal.show');
    if (openModal) {
        openModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Tooltip system
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(e) {
    const element = e.target;
    const tooltipText = element.getAttribute('data-tooltip');
    const position = element.getAttribute('data-tooltip-position') || 'top';
    
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-small);
        font-size: 0.85rem;
        white-space: nowrap;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
        border: 1px solid var(--border-color);
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left, top;
    
    switch (position) {
        case 'top':
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            top = rect.top - tooltipRect.height - 10;
            tooltip.style.transform = 'translateY(-10px)';
            break;
        case 'bottom':
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            top = rect.bottom + 10;
            tooltip.style.transform = 'translateY(10px)';
            break;
        case 'left':
            left = rect.left - tooltipRect.width - 10;
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            tooltip.style.transform = 'translateX(-10px)';
            break;
        case 'right':
            left = rect.right + 10;
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            tooltip.style.transform = 'translateX(10px)';
            break;
    }
    
    tooltip.style.left = Math.max(10, left) + 'px';
    tooltip.style.top = Math.max(10, top) + 'px';
    
    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translate(0)';
    }, 10);
    
    element._tooltip = tooltip;
}

function hideTooltip(e) {
    const element = e.target;
    if (element._tooltip) {
        element._tooltip.remove();
        delete element._tooltip;
    }
}

// Loading states
function initLoadingStates() {
    // Auto-add loading states to buttons with data-loading attribute
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-loading]')) {
            // Only add loading state for submit buttons in forms
            const form = e.target.closest('form');
            if (form && e.target.type === 'submit') {
                addLoadingState(e.target);
                
                // Remove loading state if form submission fails
                setTimeout(() => {
                    if (e.target.classList.contains('loading')) {
                        removeLoadingState(e.target);
                    }
                }, 10000); // Remove after 10 seconds as fallback
            }
        }
    });
}

function addLoadingState(button) {
    if (button.classList.contains('loading')) return;
    
    button.classList.add('loading');
    button.disabled = true;
    
    const originalText = button.textContent;
    button.setAttribute('data-original-text', originalText);
    
    // Add loading spinner
    button.innerHTML = `
        <span class="loading-spinner"></span>
        ${button.getAttribute('data-loading') || 'Загрузка...'}
    `;
}

function removeLoadingState(button) {
    if (!button.classList.contains('loading')) return;
    
    button.classList.remove('loading');
    button.disabled = false;
    
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.textContent = originalText;
        button.removeAttribute('data-original-text');
    }
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-medium);
        box-shadow: var(--shadow-medium);
        border-left: 4px solid var(--accent-${type === 'error' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'});
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Dropdown functionality
function initDropdowns() {
    document.addEventListener('click', function(e) {
        const dropdown = e.target.closest('.dropdown');
        
        if (dropdown) {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (e.target === toggle || toggle.contains(e.target)) {
                e.preventDefault();
                menu.classList.toggle('show');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.classList.remove('show');
                    }
                });
            }
        } else {
            // Close all dropdowns when clicking outside
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Tabs functionality
function initTabs() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.tab-button')) {
            e.preventDefault();
            
            const tabButton = e.target;
            const tabContainer = tabButton.closest('.tabs');
            const targetId = tabButton.getAttribute('data-tab');
            
            // Remove active class from all tabs and buttons
            tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            tabButton.classList.add('active');
            const targetContent = tabContainer.querySelector(`[data-tab-content="${targetId}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }
    });
}

// Filter functionality with enhanced animations
function initFilters() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.filter-tab')) {
            const filterButton = e.target;
            const filterContainer = filterButton.closest('.filter-tabs');
            const filter = filterButton.dataset.filter;
            
            // Remove active class from all filter buttons
            filterContainer.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            filterButton.classList.add('active');
            
            // Filter items with enhanced animations
            const itemsContainer = document.querySelector('[data-filter-container]');
            if (itemsContainer) {
                const items = itemsContainer.querySelectorAll('[data-filter-item]');
                filterItemsWithAnimation(items, filter);
            }
        }
    });
}

// Enhanced filter animation function
function filterItemsWithAnimation(items, filter) {
    items.forEach((item, index) => {
        const itemType = item.dataset.filterItem;
        
        if (filter === 'all' || itemType === filter) {
            showFilterItem(item, index);
        } else {
            hideFilterItem(item);
        }
    });
}

// Show filter item with staggered animation
function showFilterItem(item, index) {
    item.style.display = 'block';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    // Stagger animation for multiple items
    setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 50 + (index * 50)); // Delay based on item position
}

// Hide filter item with animation
function hideFilterItem(item) {
    item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        item.style.display = 'none';
    }, 200);
}

// Join competition function (specific to competitions page)
function joinCompetition(competitionId) {
    if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
        PhantomJS.showNotification('Функция записи на соревнование будет добавлена', 'info');
    } else {
        alert('Функция записи на соревнование будет добавлена');
    }
}

// Join training function (specific to training page)
function joinTraining(trainingId) {
    if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
        PhantomJS.showNotification('Функция записи на тренировку будет добавлена', 'info');
    } else {
        alert('Функция записи на тренировку будет добавлена');
    }
}

// Join seminar function (specific to seminar page)
function joinSeminar(seminarId) {
    if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
        PhantomJS.showNotification('Функция записи на семинар будет добавлена', 'info');
    } else {
        alert('Функция записи на семинар будет добавлена');
    }
}

// Export component functions to global namespace
PhantomJS.openModal = openModal;
PhantomJS.closeModal = closeModal;
PhantomJS.showNotification = showNotification;
PhantomJS.removeNotification = removeNotification;
PhantomJS.addLoadingState = addLoadingState;
PhantomJS.removeLoadingState = removeLoadingState;
PhantomJS.showTooltip = showTooltip;
PhantomJS.hideTooltip = hideTooltip;

// Export functions to global scope for inline usage
window.joinCompetition = joinCompetition;
window.joinTraining = joinTraining;
window.joinSeminar = joinSeminar;

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initTabs();
    initFilters();
});
