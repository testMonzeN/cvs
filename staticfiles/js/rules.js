// ===== RULES PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Only run on rules page
    if (!document.querySelector('.rules-container')) return;
    
    initRulesSearch();
    initRulesNavigation();
    initBackToTop();
    initIntersectionObserver();
});

// Search functionality
function initRulesSearch() {
    const searchInput = document.getElementById('rulesSearch');
    const navLinks = document.querySelectorAll('.rules-nav-link');
    const sections = document.querySelectorAll('.rule-section');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        navLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const listItem = link.parentElement;
            
            if (text.includes(searchTerm)) {
                listItem.style.display = 'block';
                link.innerHTML = highlightSearchTerm(link.textContent, searchTerm);
            } else {
                listItem.style.display = 'none';
            }
        });
        
        // Also search in section content
        sections.forEach(section => {
            const content = section.textContent.toLowerCase();
            if (content.includes(searchTerm) || searchTerm === '') {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
}

// Navigation functionality
function initRulesNavigation() {
    const navLinks = document.querySelectorAll('.rules-nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

// Intersection Observer for active navigation
function initIntersectionObserver() {
    const navLinks = document.querySelectorAll('.rules-nav-link');
    const sections = document.querySelectorAll('.rule-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`a[href="#${id}"]`);
                
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Utility functions
function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function printRules() {
    window.print();
}

function exportRules() {
    const downloadUrl = document.querySelector('[data-download-url]').getAttribute('data-download-url');
        
    fetch(downloadUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rules.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            alert('Ошибка при загрузке файла: ' + error.message);
        });
}

// Export functions to global scope for inline usage
window.scrollToTop = scrollToTop;
window.printRules = printRules;
window.exportRules = exportRules;
