// Navigation Controller - Optimized and clean
export class NavigationController {
    constructor(appState) {
        this.state = appState;
        this.navbar = null;
        this.navToggle = null;
        this.mobileMenu = null;
        this.scrollThreshold = 50;
    }

    async init() {
        this.bindElements();
        this.setupEventListeners();
        this.setupSmoothScrolling();
    }

    bindElements() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        
        if (!this.navbar) {
            throw new Error('Navigation elements not found');
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Close menu on link clicks
        document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
            link.addEventListener('click', this.closeMobileMenu.bind(this));
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && 
                !this.mobileMenu?.contains(e.target) && 
                !this.navToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isMenuOpen) {
                this.closeMobileMenu();
                this.navToggle?.focus();
            }
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = anchor.getAttribute('href');
                
                if (target && target !== '#') {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Hero scroll indicator
        const scrollIndicator = document.querySelector('[data-scroll-to]');
        scrollIndicator?.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.scrollTo;
            this.smoothScrollTo(target);
        });
    }

    handleScroll() {
        if (!this.navbar) return;

        const shouldShowBackground = window.scrollY > this.scrollThreshold;
        this.navbar.classList.toggle('scrolled', shouldShowBackground);
    }

    toggleMobileMenu() {
        const isOpen = !this.state.isMenuOpen;
        this.state.isMenuOpen = isOpen;
        
        this.mobileMenu?.classList.toggle('open', isOpen);
        this.navToggle?.setAttribute('aria-expanded', isOpen.toString());
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        // Focus management
        if (isOpen) {
            this.trapFocus();
        }
    }

    closeMobileMenu() {
        this.state.isMenuOpen = false;
        this.mobileMenu?.classList.remove('open');
        this.navToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const offsetTop = element.offsetTop - (this.navbar?.offsetHeight || 80);
        
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: this.state.prefersReducedMotion ? 'auto' : 'smooth'
        });
    }

    trapFocus() {
        const focusableElements = this.mobileMenu?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        firstElement.focus();

        // Cleanup function
        return () => document.removeEventListener('keydown', handleTabKey);
    }
}
