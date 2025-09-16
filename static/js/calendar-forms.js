/**
 * Calendar Forms Integration
 * Handles form submission with calendar data
 */

// Form submission handler for calendar inputs
function handleCalendarFormSubmission() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (!form.matches('form')) return;
        
        // Find all calendar inputs in the form
        const calendarInputs = form.querySelectorAll('.calendar-input');
        
        calendarInputs.forEach(input => {
            const datetimeValue = input.getAttribute('data-datetime');
            const originalName = input.getAttribute('data-original-name') || input.name;
            
            if (datetimeValue && originalName) {
                // Create or update a hidden input with the datetime-local format
                let hiddenInput = form.querySelector(`input[name="${originalName}"][type="hidden"]`);
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = originalName;
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = datetimeValue;
                
                // Remove the calendar input from form submission
                input.removeAttribute('name');
            } else if (originalName && input.value) {
                // Fallback: if no datetime value, try to parse the display value
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

// Parse display date format (dd.mm.yyyy в hh:mm) to Date object
function parseDisplayDate(displayValue) {
    try {
        const regex = /(\d{2})\.(\d{2})\.(\d{4}) в (\d{2}):(\d{2})/;
        const match = displayValue.match(regex);
        
        if (match) {
            const [, day, month, year, hours, minutes] = match;
            return new Date(year, month - 1, day, hours, minutes);
        }
        
        // Fallback: try to parse as ISO date
        return new Date(displayValue);
    } catch (e) {
        console.error('Error parsing date:', e);
        return null;
    }
}

// Initialize calendar form handling
document.addEventListener('DOMContentLoaded', handleCalendarFormSubmission);

// Handle dynamic forms
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
