/**
 * Пользовательский компонент календаря для Phantom
 * Предоставляет функциональность выбора даты и времени с русской локализацией
 */

class PhantomCalendar {
    constructor(input, options = {}) {
        this.input = input;
        this.options = {
            locale: 'ru',
            format: 'YYYY-MM-DD HH:mm',
            showTime: true,
            minDate: null,
            maxDate: null,
            ...options
        };
        
        this.currentDate = new Date();
        this.selectedDate = this.parseInputValue() || new Date();
        this.isOpen = false;
        
        this.monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        
        this.weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        
        this.init();
    }
    
    init() {
        this.createCalendarStructure();
        this.bindEvents();
        this.updateInputValue();
    }
    
    parseInputValue() {
        const value = this.input.value;
        if (!value) return null;
        
        // Обработка формата datetime-local и нашего пользовательского формата
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }
    
    createCalendarStructure() {
        // Обернуть ввод в контейнер
        const wrapper = document.createElement('div');
        wrapper.className = 'calendar-container';
        this.input.parentNode.insertBefore(wrapper, this.input);
        
        // Создать обертку ввода
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'calendar-input-wrapper';
        
        // Стилизовать ввод
        this.input.className += ' calendar-input';
        this.input.setAttribute('data-original-name', this.input.name);
        this.input.type = 'text';
        this.input.readOnly = true;
        
        // Создать кнопку переключения календаря
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'calendar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-calendar-alt"></i>';
        
        // Создать всплывающее окно календаря
        this.popup = document.createElement('div');
        this.popup.className = 'calendar-popup';
        
        // Собрать структуру
        inputWrapper.appendChild(this.input);
        inputWrapper.appendChild(toggleBtn);
        wrapper.appendChild(inputWrapper);
        wrapper.appendChild(this.popup);
        
        this.wrapper = wrapper;
        this.toggleBtn = toggleBtn;
        
        this.renderCalendar();
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.popup.innerHTML = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav-btn" data-action="prev-month">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="calendar-month-year">
                    ${this.monthNames[month]} ${year}
                </div>
                <button type="button" class="calendar-nav-btn" data-action="next-month">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="calendar-weekdays">
                ${this.weekDays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
            </div>
            
            <div class="calendar-days">
                ${this.renderDays()}
            </div>
            
            ${this.options.showTime ? this.renderTimePicker() : ''}
            
            <div class="calendar-actions">
                <button type="button" class="calendar-btn" data-action="today">Сегодня</button>
                <button type="button" class="calendar-btn" data-action="clear">Очистить</button>
                <button type="button" class="calendar-btn primary" data-action="confirm">Выбрать</button>
            </div>
        `;
    }
    
    renderDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        
        // Первый день месяца и количество дней
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Настройка для начала с понедельника (0 = Воскресенье, 1 = Понедельник и т.д.)
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;
        
        // Дни предыдущего месяца
        const prevMonth = new Date(year, month - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        let daysHTML = '';
        
        // Замыкающие дни предыдущего месяца
        for (let i = startDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            daysHTML += `<div class="calendar-day other-month" data-date="${year}-${month}-${day}">${day}</div>`;
        }
        
        // Дни текущего месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isSameDay(date, today);
            const isSelected = this.isSameDay(date, this.selectedDate);
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            
            daysHTML += `<div class="${classes}" data-date="${year}-${month + 1}-${day}">${day}</div>`;
        }
        
        // Ведущие дни следующего месяца
        const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (startDay + daysInMonth);
        
        for (let day = 1; day <= remainingCells; day++) {
            daysHTML += `<div class="calendar-day other-month" data-date="${year}-${month + 2}-${day}">${day}</div>`;
        }
        
        return daysHTML;
    }
    
    renderTimePicker() {
        const hours = this.selectedDate.getHours().toString().padStart(2, '0');
        const minutes = this.selectedDate.getMinutes().toString().padStart(2, '0');
        
        return `
            <div class="calendar-time">
                <div class="time-inputs">
                    <input type="number" class="time-input" id="hours" min="0" max="23" value="${hours}">
                    <span class="time-separator">:</span>
                    <input type="number" class="time-input" id="minutes" min="0" max="59" value="${minutes}">
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Переключение календаря
        this.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Закрытие при клике вне
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });
        
        // События всплывающего окна календаря
        this.popup.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const dayElement = e.target.closest('.calendar-day');
            
            if (action) {
                this.handleAction(action, e);
            } else if (dayElement && !dayElement.classList.contains('other-month')) {
                this.selectDay(dayElement);
            }
        });
        
        // События ввода времени
        this.popup.addEventListener('input', (e) => {
            if (e.target.classList.contains('time-input')) {
                this.updateTime();
            }
        });
        
        // Навигация с клавиатуры
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    handleAction(action, e) {
        e.preventDefault();
        
        switch (action) {
            case 'prev-month':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
                break;
                
            case 'next-month':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
                break;
                
            case 'today':
                const today = new Date();
                this.selectedDate = today;
                this.currentDate = new Date(today);
                this.renderCalendar();
                break;
                
            case 'clear':
                this.selectedDate = new Date();
                this.updateInputValue('');
                this.close();
                break;
                
            case 'confirm':
                this.updateInputValue();
                this.close();
                break;
        }
    }
    
    selectDay(dayElement) {
        const dateStr = dayElement.dataset.date;
        const [year, month, day] = dateStr.split('-').map(Number);
        
        // Обновить выбранную дату, но сохранить текущее время
        this.selectedDate.setFullYear(year);
        this.selectedDate.setMonth(month - 1);
        this.selectedDate.setDate(day);
        
        this.renderCalendar();
    }
    
    updateTime() {
        const hoursInput = this.popup.querySelector('#hours');
        const minutesInput = this.popup.querySelector('#minutes');
        
        if (hoursInput && minutesInput) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            
            this.selectedDate.setHours(hours);
            this.selectedDate.setMinutes(minutes);
        }
    }
    
    updateInputValue(value = null) {
        if (value === null) {
            // Формат для отображения (удобный для пользователя)
            const formatted = this.formatDate(this.selectedDate);
            this.input.value = formatted;
            
            // Создать ISO строку для отправки формы (YYYY-MM-DDTHH:mm)
            const isoString = this.selectedDate.toISOString().slice(0, 16);
            
            // Установить атрибуты данных и обновить скрытый ввод, если существует
            this.input.setAttribute('data-datetime', isoString);
            this.input.setAttribute('value', isoString);
            
            // Обновить любой связанный скрытый ввод
            const originalName = this.input.getAttribute('data-original-name');
            if (originalName) {
                let hiddenInput = document.querySelector(`input[name="${originalName}"][type="hidden"]`);
                if (!hiddenInput) {
                    // Создать скрытый ввод, если его не существует
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = originalName;
                    this.input.parentNode.appendChild(hiddenInput);
                }
                hiddenInput.value = isoString;
            }
        } else {
            this.input.value = value;
            this.input.removeAttribute('data-datetime');
            this.input.removeAttribute('value');
        }
        
        // Вызвать событие изменения
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
    }
        
    formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        if (this.options.showTime) {
            return `${day}.${month}.${year} в ${hours}:${minutes}`;
        } else {
            return `${day}.${month}.${year}`;
        }
    }
    
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        // Создать фон для мобильных
        if (window.innerWidth <= 768) {
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'calendar-backdrop';
            this.backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(this.backdrop);
            
            // Предотвратить прокрутку body
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                this.backdrop.style.opacity = '1';
            }, 10);
        }
        
        this.popup.classList.add('show');
        this.isOpen = true;
        
        // Фокус на первом фокусируемом элементе
        const firstInput = this.popup.querySelector('input, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    close() {
        this.popup.classList.remove('show');
        this.isOpen = false;
        
        // Удалить фон и восстановить прокрутку body
        if (this.backdrop) {
            this.backdrop.style.opacity = '0';
            setTimeout(() => {
                if (this.backdrop && this.backdrop.parentNode) {
                    this.backdrop.parentNode.removeChild(this.backdrop);
                }
                this.backdrop = null;
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

// Автоинициализация календарей
function initCalendars() {
    // Найти все вводы datetime и преобразовать их в пользовательские календари
    const dateTimeInputs = document.querySelectorAll('input[type="datetime-local"], input[data-calendar]');
    
    dateTimeInputs.forEach(input => {
        // Пропустить, если уже инициализирован
        if (input.closest('.calendar-container')) return;
        
        const options = {
            showTime: input.type === 'datetime-local' || input.dataset.showTime === 'true'
        };
        
        new PhantomCalendar(input, options);
    });
}

// Инициализация при готовности DOM
document.addEventListener('DOMContentLoaded', initCalendars);

// Переинициализация при динамическом добавлении нового содержимого
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const dateInputs = node.querySelectorAll ? 
                    node.querySelectorAll('input[type="datetime-local"], input[data-calendar]') : [];
                
                dateInputs.forEach(input => {
                    if (!input.closest('.calendar-container')) {
                        const options = {
                            showTime: input.type === 'datetime-local' || input.dataset.showTime === 'true'
                        };
                        new PhantomCalendar(input, options);
                    }
                });
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Экспорт для ручной инициализации
window.PhantomCalendar = PhantomCalendar;
