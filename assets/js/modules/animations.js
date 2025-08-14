// Animation Controller - Performance-optimized animations
export class AnimationController {
    constructor(appState) {
        this.state = appState;
        this.observer = null;
        this.animatedElements = new Set();
    }

    async init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.initializeAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerAnimation(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);
    }

    setupScrollAnimations() {
        // Elements to animate on scroll
        const animateElements = document.querySelectorAll(`
            .value-prop,
            .service-card,
            .about-content,
            .search-card,
            .trust-badge,
            .stat
        `);

        animateElements.forEach(el => {
            // Add data attribute for animation
            el.setAttribute('data-animate', 'fadeInUp');
            
            // Set initial state
            if (!this.state.prefersReducedMotion) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
            
            // Observe element
            this.observer.observe(el);
        });
    }

    initializeAnimations() {
        // Add CSS for animations
        this.addAnimationStyles();
        
        // Setup staggered animations for groups
        this.setupStaggeredAnimations();
    }

    triggerAnimation(element) {
        if (this.state.prefersReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        const animationType = element.getAttribute('data-animate') || 'fadeInUp';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Add animation class for more complex animations
            element.classList.add('animate-' + animationType);
        });

        // Remove animation class after completion to prevent re-triggering
        setTimeout(() => {
            element.classList.remove('animate-' + animationType);
        }, 600);
    }

    setupStaggeredAnimations() {
        // Stagger trust badges animation
        const trustBadges = document.querySelectorAll('.trust-badge');
        trustBadges.forEach((badge, index) => {
            if (!this.state.prefersReducedMotion) {
                badge.style.transitionDelay = `${index * 100}ms`;
            }
        });

        // Stagger service cards animation
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            if (!this.state.prefersReducedMotion) {
                card.style.transitionDelay = `${index * 150}ms`;
            }
        });

        // Stagger stats animation
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            if (!this.state.prefersReducedMotion) {
                stat.style.transitionDelay = `${index * 100}ms`;
            }
        });
    }

    addAnimationStyles() {
        if (document.getElementById('animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes fadeInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .animate-fadeInUp {
                animation: fadeInUp 0.6s ease forwards;
            }

            .animate-fadeInLeft {
                animation: fadeInLeft 0.6s ease forwards;
            }

            .animate-fadeInRight {
                animation: fadeInRight 0.6s ease forwards;
            }

            .animate-scaleIn {
                animation: scaleIn 0.6s ease forwards;
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }

            /* Performance optimizations */
            .animate-fadeInUp,
            .animate-fadeInLeft,
            .animate-fadeInRight,
            .animate-scaleIn {
                will-change: opacity, transform;
            }
        `;

        document.head.appendChild(style);
    }

    handleScroll() {
        // Parallax effect for hero background (performance optimized)
        if (!this.state.prefersReducedMotion) {
            this.updateParallax();
        }
    }

    updateParallax() {
        const scrolled = window.scrollY;
        const heroBackground = document.querySelector('.hero-bg img');
        
        if (heroBackground && scrolled < window.innerHeight) {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            
            requestAnimationFrame(() => {
                heroBackground.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }
    }

    handleResize() {
        // Recalculate animations on resize if needed
        if (!this.state.prefersReducedMotion) {
            this.updateParallax();
        }
    }

    updateMotionPreference(prefersReduced) {
        this.state.prefersReducedMotion = prefersReduced;
        
        if (prefersReduced) {
            // Remove all animations and transitions
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.transition = 'none';
            });
        } else {
            // Re-enable animations
            this.setupScrollAnimations();
        }
    }

    // Utility method for custom animations
    animateElement(element, animation = 'fadeInUp', delay = 0) {
        if (this.state.prefersReducedMotion) return;

        setTimeout(() => {
            element.setAttribute('data-animate', animation);
            this.triggerAnimation(element);
        }, delay);
    }

    // Counter animation for statistics
    animateCounter(element, target, duration = 2000) {
        if (this.state.prefersReducedMotion) {
            element.textContent = target;
            return;
        }

        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove animation styles
        const animationStyles = document.getElementById('animation-styles');
        if (animationStyles) {
            animationStyles.remove();
        }
    }
}
