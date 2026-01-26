/**
 * Интеграция форм с календарем
 * Обрабатывает отправку форм с данными календаря
 */

// Обработчик отправки формы для вводов календаря
function handleCalendarFormSubmission() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (!form.matches('form')) return;
        
        // Найти все вводы календаря в форме
        const calendarInputs = form.querySelectorAll('.calendar-input');
        
        calendarInputs.forEach(input => {
            const datetimeValue = input.getAttribute('data-datetime');
            const originalName = input.getAttribute('data-original-name') || input.name;
            
            if (datetimeValue && originalName) {
                // Создать или обновить скрытый ввод с форматом datetime-local
                let hiddenInput = form.querySelector(`input[name="${originalName}"][type="hidden"]`);
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = originalName;
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = datetimeValue;
                
                // Удалить ввод календаря из отправки формы
                input.removeAttribute('name');
            } else if (originalName && input.value) {
                // Запасной вариант: если нет значения datetime, попытаться разобрать отображаемое значение
                const displayValue = input.value;
                const parsedDate = parseDisplayDate(displayValue);
                if (parsedDate) {
                    let hiddenInput = form.querySelector(`input[name="${originalName}"][type="hidden"]`);
                    if (!hiddenInput) {
                        hiddenInput = document.createElement('input');
                        hiddenInput.type = 'hidden';
                        hiddenInput.name = originalName;
                        form.appendChild(hiddenInput);
                    }
                    hiddenInput.value = parsedDate.toISOString().slice(0, 16);
                    input.removeAttribute('name');
                }
            }
        });
    });
}

// Разбор формата отображения даты (dd.mm.yyyy в hh:mm) в объект Date
function parseDisplayDate(displayValue) {
    try {
        const regex = /(\d{2})\.(\d{2})\.(\d{4}) в (\d{2}):(\d{2})/;
        const match = displayValue.match(regex);
        
        if (match) {
            const [, day, month, year, hours, minutes] = match;
            return new Date(year, month - 1, day, hours, minutes);
        }
        
        // Запасной вариант: попытка разобрать как ISO дату
        return new Date(displayValue);
    } catch (e) {
        console.error('Ошибка разбора даты:', e);
        return null;
    }
}

// Инициализация обработки форм календаря
document.addEventListener('DOMContentLoaded', handleCalendarFormSubmission);

// Обработка динамических форм
const formObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('form')) {
                handleCalendarFormSubmission();
            }
        });
    });
});

formObserver.observe(document.body, {
    childList: true,
    subtree: true
});
