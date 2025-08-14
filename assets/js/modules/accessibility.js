// Accessibility Controller - WCAG compliance and enhanced UX
export class AccessibilityController {
    constructor(appState) {
        this.state = appState;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.announcements = [];
    }

    async init() {
        this.setupScreenReaderSupport();
        this.enhanceKeyboardNavigation();
        this.setupFocusManagement();
        this.addSkipLinks();
        this.enhanceFormAccessibility();
        this.setupReducedMotionSupport();
        this.addLiveRegions();
    }

    setupScreenReaderSupport() {
        // Add screen reader only styles
        this.addScreenReaderStyles();
        
        // Enhance existing elements with better labels
        this.enhanceAriaLabels();
        
        // Add landmark roles
        this.addLandmarkRoles();
    }

    addScreenReaderStyles() {
        const style = document.createElement('style');
        style.id = 'accessibility-styles';
        style.textContent = `
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            .sr-only:focus {
                position: static !important;
                width: auto !important;
                height: auto !important;
                padding: 0.5rem !important;
                margin: 0 !important;
                overflow: visible !important;
                clip: auto !important;
                white-space: normal !important;
                background-color: var(--white) !important;
                color: var(--ink) !important;
                border: 2px solid var(--copper) !important;
                z-index: 10000 !important;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .btn {
                    border-width: 2px !important;
                }
                
                .nav-link::after {
                    height: 3px !important;
                }
            }
            
            /* Focus indicators */
            *:focus {
                outline: 2px solid var(--copper) !important;
                outline-offset: 2px !important;
            }
            
            /* Ensure interactive elements are large enough */
            .btn,
            .nav-link,
            .carousel-btn,
            .thumb {
                min-height: 44px;
                min-width: 44px;
            }
        `;
        document.head.appendChild(style);
    }

    enhanceAriaLabels() {
        // Enhance navigation
        const nav = document.querySelector('.navbar');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Enhance carousel
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-label', 'Property photo gallery');
            carousel.setAttribute('aria-live', 'polite');
        }

        // Enhance form sections
        document.querySelectorAll('form').forEach(form => {
            if (!form.getAttribute('aria-label')) {
                const heading = form.previousElementSibling?.querySelector('h2, h3');
                if (heading) {
                    form.setAttribute('aria-labelledby', heading.id || this.generateId(heading));
                }
            }
        });

        // Enhance buttons with icons
        document.querySelectorAll('button i, a i').forEach(icon => {
            const parent = icon.parentElement;
            if (!parent.getAttribute('aria-label') && !parent.textContent.trim()) {
                const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
                if (iconClass) {
                    const action = this.getActionFromIcon(iconClass);
                    parent.setAttribute('aria-label', action);
                }
            }
        });
    }

    addLandmarkRoles() {
        // Add main role
        const main = document.querySelector('main') || document.querySelector('.hero').parentElement;
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Add section roles
        document.querySelectorAll('section').forEach(section => {
            if (!section.getAttribute('role')) {
                const heading = section.querySelector('h1, h2, h3');
                if (heading) {
                    section.setAttribute('role', 'region');
                    section.setAttribute('aria-labelledby', heading.id || this.generateId(heading));
                }
            }
        });

        // Add complementary roles for sidebar-like content
        document.querySelectorAll('.contact-info-section, .trust-strip').forEach(aside => {
            aside.setAttribute('role', 'complementary');
        });
    }

    enhanceKeyboardNavigation() {
        // Skip to main content
        this.addSkipToMain();
        
        // Roving tabindex for carousel
        this.setupCarouselKeyboardNav();
        
        // Custom dropdown behavior
        this.enhanceSelectElements();
        
        // Modal focus trapping
        this.setupModalFocusTrapping();
    }

    addSkipToMain() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'sr-only';
        skipLink.textContent = 'Skip to main content';
        skipLink.id = 'skip-to-main';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Ensure main content has proper id
        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main && !main.id) {
            main.id = 'main';
        }
    }

    setupCarouselKeyboardNav() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide img');
        const thumbnails = carousel.querySelectorAll('.thumb');
        
        // Make carousel keyboard accessible
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.triggerCarouselAction('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.triggerCarouselAction('next');
                    break;
                case 'Home':
                    e.preventDefault();
                    this.triggerCarouselAction('first');
                    break;
                case 'End':
                    e.preventDefault();
                    this.triggerCarouselAction('last');
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.triggerCarouselAction('lightbox');
                    break;
            }
        });

        // Add instructions for screen readers
        const instructions = document.createElement('div');
        instructions.className = 'sr-only';
        instructions.textContent = 'Use arrow keys to navigate gallery. Press Enter to open lightbox.';
        carousel.appendChild(instructions);
    }

    triggerCarouselAction(action) {
        const event = new CustomEvent('carousel:action', { detail: action });
        document.dispatchEvent(event);
    }

    enhanceSelectElements() {
        document.querySelectorAll('select').forEach(select => {
            // Add proper labels if missing
            if (!select.getAttribute('aria-label') && !select.getAttribute('aria-labelledby')) {
                const label = select.previousElementSibling?.tagName === 'LABEL' 
                    ? select.previousElementSibling 
                    : document.querySelector(`label[for="${select.id}"]`);
                
                if (label && !label.id) {
                    label.id = this.generateId(label);
                    select.setAttribute('aria-labelledby', label.id);
                }
            }
        });
    }

    setupModalFocusTrapping() {
        // Focus trapping for lightbox
        document.addEventListener('lightbox:open', () => {
            this.trapFocus(document.querySelector('.lightbox'));
        });

        document.addEventListener('lightbox:close', () => {
            this.restoreFocus();
        });
    }

    setupFocusManagement() {
        this.lastFocusedElement = null;
        
        // Store last focused element before modal opens
        document.addEventListener('focusin', (e) => {
            if (!e.target.closest('.lightbox, .mobile-menu')) {
                this.lastFocusedElement = e.target;
            }
        });
    }

    trapFocus(container) {
        if (!container) return;

        const focusableContent = container.querySelectorAll(this.focusableElements);
        const firstElement = focusableContent[0];
        const lastElement = focusableContent[focusableContent.length - 1];

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
        firstElement?.focus();

        // Return cleanup function
        return () => {
            document.removeEventListener('keydown', handleTabKey);
        };
    }

    restoreFocus() {
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }

    addSkipLinks() {
        const skipLinks = [
            { href: '#about', text: 'Skip to About' },
            { href: '#services', text: 'Skip to Services' },
            { href: '#contact', text: 'Skip to Contact' }
        ];

        const skipContainer = document.createElement('div');
        skipContainer.className = 'skip-links';
        
        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.className = 'sr-only';
            skipLink.textContent = link.text;
            skipContainer.appendChild(skipLink);
        });

        document.body.insertBefore(skipContainer, document.body.firstChild);
    }

    enhanceFormAccessibility() {
        document.querySelectorAll('form').forEach(form => {
            // Add proper fieldset and legend for grouped fields
            const searchRows = form.querySelectorAll('.search-row');
            searchRows.forEach(row => {
                if (row.children.length > 1) {
                    const fieldset = document.createElement('fieldset');
                    const legend = document.createElement('legend');
                    legend.className = 'sr-only';
                    legend.textContent = 'Search criteria';
                    
                    fieldset.appendChild(legend);
                    row.parentNode.insertBefore(fieldset, row);
                    fieldset.appendChild(row);
                }
            });

            // Enhance error messaging
            this.enhanceErrorMessages(form);
        });
    }

    enhanceErrorMessages(form) {
        const errorElements = form.querySelectorAll('[id$="Error"]');
        errorElements.forEach(error => {
            error.setAttribute('role', 'alert');
            error.setAttribute('aria-live', 'polite');
        });
    }

    setupReducedMotionSupport() {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionChange = (e) => {
            document.documentElement.classList.toggle('reduce-motion', e.matches);
            
            if (e.matches) {
                // Disable problematic animations
                this.disableAnimations();
            }
        };

        motionQuery.addListener(handleMotionChange);
        handleMotionChange(motionQuery);
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .reduce-motion *,
            .reduce-motion *::before,
            .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    addLiveRegions() {
        // Add live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('live-region');
        if (!liveRegion) return;

        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }

    handleKeyDown(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '/':
                    e.preventDefault();
                    document.querySelector('#contact input[type="email"]')?.focus();
                    break;
            }
        }

        // Escape key handling
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.lightbox.active, .mobile-menu.open');
            if (activeModal) {
                const closeEvent = new CustomEvent('modal:close');
                activeModal.dispatchEvent(closeEvent);
            }
        }
    }

    // Utility methods
    generateId(element) {
        const id = 'generated-id-' + Math.random().toString(36).substr(2, 9);
        element.id = id;
        return id;
    }

    getActionFromIcon(iconClass) {
        const actions = {
            'fa-phone': 'Call',
            'fa-envelope': 'Email',
            'fa-chevron-down': 'Scroll down',
            'fa-chevron-left': 'Previous',
            'fa-chevron-right': 'Next',
            'fa-times': 'Close',
            'fa-home': 'Home',
            'fa-key': 'Key',
            'fa-handshake': 'Handshake',
            'fa-whatsapp': 'WhatsApp'
        };
        
        return actions[iconClass] || 'Action';
    }

    // Performance monitoring for accessibility
    checkAccessibility() {
        const issues = [];
        
        // Check for missing alt text
        document.querySelectorAll('img:not([alt])').forEach(img => {
            issues.push('Missing alt text on image');
        });
        
        // Check for empty links
        document.querySelectorAll('a:not([aria-label]):empty').forEach(link => {
            issues.push('Empty link without aria-label');
        });
        
        // Check for low contrast (simplified check)
        // In a real implementation, you'd use a proper contrast checking library
        
        return issues;
    }
}
