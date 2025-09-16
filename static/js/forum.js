// ===== FORUM FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Only run on forum pages
    if (!document.querySelector('.forum-header') && !document.querySelector('.topic-detail-header')) return;
    
    initForumFilters();
    initQuickReply();
    initPostActions();
    initPreviewFeature();
    initForumSearch();
    initForumForms();
});

// Forum topic filters
function initForumFilters() {
    const filterContainer = document.querySelector('[data-filter-container="forum"]');
    if (!filterContainer) return;
    
    const filterButtons = filterContainer.querySelectorAll('.filter-tab');
    const topicCards = document.querySelectorAll('[data-filter-item]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter topics with animation
            filterTopics(topicCards, filter);
        });
    });
}

// Filter topics with enhanced animations
function filterTopics(topics, filter) {
    topics.forEach((topic, index) => {
        const topicType = topic.getAttribute('data-filter-item');
        
        if (filter === 'all' || topicType === filter) {
            showTopic(topic, index);
        } else {
            hideTopic(topic);
        }
    });
    
    // Update results count
    updateFilterResults(topics, filter);
}

// Show topic with staggered animation
function showTopic(topic, index) {
    topic.style.display = 'flex';  // ← Исправлено: используем flex вместо block
    topic.style.opacity = '0';
    topic.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        topic.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        topic.style.opacity = '1';
        topic.style.transform = 'translateY(0)';
    }, 50 + (index * 50));
}

// Hide topic with animation
function hideTopic(topic) {
    topic.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    topic.style.opacity = '0';
    topic.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        topic.style.display = 'none';
    }, 200);
}

// Update filter results count
function updateFilterResults(topics, filter) {
    const visibleCount = Array.from(topics).filter(topic => {
        const topicType = topic.getAttribute('data-filter-item');
        return filter === 'all' || topicType === filter;
    }).length;
    
    // Show/hide empty state if needed
    const emptyState = document.querySelector('.empty-state');
    const topicsContainer = document.querySelector('.topics-container');
    
    if (visibleCount === 0 && !emptyState) {
        const emptyMessage = createEmptyFilterMessage(filter);
        topicsContainer.appendChild(emptyMessage);
    } else if (visibleCount > 0 && emptyState) {
        emptyState.remove();
    }
}

// Create empty filter message
function createEmptyFilterMessage(filter) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state fade-in';
    emptyDiv.innerHTML = `
        <div class="empty-icon">
            <i class="fas fa-search"></i>
        </div>
        <h3>Темы не найдены</h3>
        <p>Нет тем в категории "${filter}". Попробуйте выбрать другую категорию.</p>
    `;
    return emptyDiv;
}

// Quick reply functionality
function initQuickReply() {
    const quickReplyForm = document.querySelector('.quick-reply-form');
    if (!quickReplyForm) return;
    
    const textarea = quickReplyForm.querySelector('textarea[name="text"]');
    const submitButton = quickReplyForm.querySelector('button[type="submit"]');
    
    if (textarea) {
        // Auto-expand textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(120, this.scrollHeight) + 'px';
            
            // Enable/disable submit button based on content
            if (submitButton) {
                submitButton.disabled = this.value.trim().length < 10;
            }
        });
        
        // Character counter
        addCharacterCounter(textarea);
    }
    
    // Handle form submission
    quickReplyForm.addEventListener('submit', function(e) {
        const text = textarea.value.trim();
        if (text.length < 10) {
            e.preventDefault();
            showNotification('Ответ должен содержать минимум 10 символов', 'warning');
            return;
        }
        
        // Add loading state
        if (submitButton) {
            addLoadingState(submitButton);
        }
    });
}

// Add character counter to textarea
function addCharacterCounter(textarea) {
    const counterDiv = document.createElement('div');
    counterDiv.className = 'character-counter';
    counterDiv.style.cssText = `
        font-size: 0.85rem;
        color: var(--text-muted);
        text-align: right;
        margin-top: 0.5rem;
    `;
    
    textarea.parentNode.appendChild(counterDiv);
    
    function updateCounter() {
        const length = textarea.value.length;
        const minLength = 10;
        const remaining = Math.max(0, minLength - length);
        
        if (remaining > 0) {
            counterDiv.textContent = `Осталось символов: ${remaining}`;
            counterDiv.style.color = 'var(--accent-warning)';
        } else {
            counterDiv.textContent = `Символов: ${length}`;
            counterDiv.style.color = 'var(--text-muted)';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

// Post actions (edit, delete, reply)
function initPostActions() {
    // Confirm delete actions
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href*="delete"]') || e.target.closest('a[href*="delete"]')) {
            const link = e.target.matches('a') ? e.target : e.target.closest('a');
            const isComment = link.href.includes('comment/delete');
            const message = isComment ? 
                'Вы уверены, что хотите удалить этот комментарий?' : 
                'Вы уверены, что хотите удалить эту тему?';
            
            if (!confirm(message)) {
                e.preventDefault();
            }
        }
    });
    
    // Quote functionality (if implemented)
    document.addEventListener('click', function(e) {
        if (e.target.matches('.quote-btn') || e.target.closest('.quote-btn')) {
            e.preventDefault();
            const postCard = e.target.closest('.post-card');
            const postText = postCard.querySelector('.post-text').textContent.trim();
            const authorName = postCard.querySelector('.author-name').textContent.trim();
            
            insertQuote(postText, authorName);
        }
    });
}

// Insert quote into reply textarea
function insertQuote(text, author) {
    const textarea = document.querySelector('.quick-reply-form textarea, .comment-create-form textarea');
    if (!textarea) return;
    
    const quote = `[quote="${author}"]\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n[/quote]\n\n`;
    
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    
    textarea.value = textBefore + quote + textAfter;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = cursorPos + quote.length;
    
    // Trigger input event for auto-expand
    textarea.dispatchEvent(new Event('input'));
}

// Preview feature for posts
function initPreviewFeature() {
    const previewButtons = document.querySelectorAll('[data-preview]');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const formId = this.getAttribute('data-preview');
            const form = document.getElementById(formId);
            const textarea = form.querySelector('textarea');
            const previewSection = document.querySelector('.preview-section');
            const previewContent = document.getElementById('previewContent');
            
            if (textarea.value.trim()) {
                previewContent.innerHTML = formatPostContent(textarea.value);
                previewSection.style.display = 'block';
                previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                showNotification('Введите текст для предварительного просмотра', 'info');
            }
        });
    });
}

// Format post content for preview
function formatPostContent(text) {
    // Basic formatting (can be extended)
    return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^\s*/, '<p>')
        .replace(/\s*$/, '</p>')
        .replace(/\[quote="([^"]+)"\](.*?)\[\/quote\]/g, '<blockquote><strong>$1 писал:</strong><br>$2</blockquote>');
}

// Forum search functionality
function initForumSearch() {
    const searchInput = document.querySelector('#forumSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.toLowerCase().trim();
        
        searchTimeout = setTimeout(() => {
            searchTopics(query);
        }, 300);
    });
}

// Search topics
function searchTopics(query) {
    const topicCards = document.querySelectorAll('.topic-card');
    let visibleCount = 0;
    
    topicCards.forEach(card => {
        const title = card.querySelector('.topic-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.topic-excerpt').textContent.toLowerCase();
        const author = card.querySelector('.topic-author').textContent.toLowerCase();
        
        const matches = !query || 
                       title.includes(query) || 
                       excerpt.includes(query) || 
                       author.includes(query);
        
        if (matches) {
            card.style.display = 'flex';  // ← Исправлено: используем flex вместо block
            highlightSearchTerm(card, query);
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show search results count
    updateSearchResults(visibleCount, query);
}

// Highlight search terms
function highlightSearchTerm(card, query) {
    if (!query) return;
    
    const title = card.querySelector('.topic-title a');
    const excerpt = card.querySelector('.topic-excerpt');
    
    [title, excerpt].forEach(element => {
        if (element) {
            const text = element.textContent;
            const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
            element.innerHTML = text.replace(regex, '<mark>$1</mark>');
        }
    });
}

// Escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update search results
function updateSearchResults(count, query) {
    let resultsDiv = document.querySelector('.search-results');
    
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        resultsDiv.style.cssText = `
            padding: 1rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-medium);
            margin-bottom: 1rem;
            color: var(--text-muted);
            font-size: 0.9rem;
        `;
        
        const topicsContainer = document.querySelector('.topics-container');
        topicsContainer.parentNode.insertBefore(resultsDiv, topicsContainer);
    }
    
    if (query) {
        resultsDiv.textContent = `Найдено тем: ${count} по запросу "${query}"`;
        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.style.display = 'none';
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    if (typeof PhantomJS !== 'undefined' && PhantomJS.showNotification) {
        PhantomJS.showNotification(message, type);
    } else {
        alert(message);
    }
}

function addLoadingState(button) {
    if (typeof PhantomJS !== 'undefined' && PhantomJS.addLoadingState) {
        PhantomJS.addLoadingState(button);
    } else {
        button.disabled = true;
        button.textContent = 'Загрузка...';
    }
}

// Forum forms handling
function initForumForms() {
    const forumForms = document.querySelectorAll('.topic-create-form, .topic-edit-form, .comment-create-form, .quick-reply-form');
    
    forumForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                // Prevent double submission
                if (submitBtn.disabled || submitBtn.classList.contains('loading')) {
                    e.preventDefault();
                    return;
                }
                
                // Check form validity first
                if (!form.checkValidity()) {
                    return; // Let browser handle validation
                }
                
                // Add loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                // Remove loading state after a timeout as fallback
                setTimeout(() => {
                    if (submitBtn.classList.contains('loading')) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                }, 10000); // 10 seconds fallback
            }
        });
    });
}

// Export functions for global usage
window.filterTopics = filterTopics;
window.insertQuote = insertQuote;
