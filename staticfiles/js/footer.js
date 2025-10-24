// Footer animations and particles - ТОЛЬКО для футера
document.addEventListener('DOMContentLoaded', function() {
    initFooterAnimations();
});

function initFooterAnimations() {
    // Проверяем, что футер существует
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    
    createFooterParticles(footer);
    initGitHubLinkAnimation(footer);
    initFooterEntranceAnimation(footer);
}

// Create floating particles in footer - ТОЛЬКО внутри футера
function createFooterParticles(footer) {
    if (!footer) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'footer-particles';
    footer.appendChild(particlesContainer);
    
    // Create 5 particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';
        
        // Random animation duration (4-8 seconds)
        const duration = 4 + Math.random() * 4;
        particle.style.animationDuration = duration + 's';
        
        // Random delay
        particle.style.animationDelay = -(Math.random() * duration) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Enhanced GitHub link animation - ТОЛЬКО для ссылок внутри футера
function initGitHubLinkAnimation(footer) {
    if (!footer) return;
    
    const githubLink = footer.querySelector('.github-link');
    if (!githubLink) return;
    
    // Add ripple effect on click
    githubLink.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: footerRipple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
    
    // Add hover visual feedback
    githubLink.addEventListener('mouseenter', function() {
        this.style.setProperty('--hover-scale', '1.02');
    });
    
    githubLink.addEventListener('mouseleave', function() {
        this.style.setProperty('--hover-scale', '1');
    });
}

// Add CSS for footer-specific animations - ТОЛЬКО для футера
const footerCSS = `
@keyframes footerRipple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes footerFadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject footer-specific CSS
if (!document.querySelector('#footer-styles')) {
    const style = document.createElement('style');
    style.id = 'footer-styles';
    style.textContent = footerCSS;
    document.head.appendChild(style);
}

// Intersection Observer for footer entrance animation - ТОЛЬКО для футера
function initFooterEntranceAnimation(footer) {
    if (!footer) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'footerFadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(30px)';
    observer.observe(footer);
}
