// ===== NAVIGATION FUNCTIONALITY =====

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navbar) {
        // Navbar scroll effect
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', throttle(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for backdrop effect
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (only on desktop)
            if (window.innerWidth > 768) {
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        }, 100));
        
        // Mobile menu toggle
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('mobile-open');
                const icon = this.querySelector('i');
                
                if (navMenu.classList.contains('mobile-open')) {
                    icon.className = 'fas fa-times';
                    document.body.style.overflow = 'hidden';
                } else {
                    icon.className = 'fas fa-bars';
                    document.body.style.overflow = '';
                }
            });
            
            // Close mobile menu when clicking on links
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('mobile-open');
                    mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
                    document.body.style.overflow = '';
                });
            });
            
            // Close mobile menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('mobile-open');
                    mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
                    document.body.style.overflow = '';
                    navbar.style.transform = 'translateY(0)';
                }
            });
        }
        
        // Active link highlighting
        highlightActiveNavLink();
    }
}

function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath.includes(href) && href !== '/')) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

