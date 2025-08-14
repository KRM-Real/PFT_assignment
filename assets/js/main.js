// Main JavaScript Entry Point - Modern ES6+ Modular Architecture
// Optimized for performance and maintainability

// Import modules
import { NavigationController } from './modules/navigation.js';
import { CarouselController } from './modules/carousel.js';
import { FormController } from './modules/forms.js';
import { AnimationController } from './modules/animations.js';
import { PerformanceController } from './modules/performance.js';
import { AccessibilityController } from './modules/accessibility.js';

// Application State Management
class App {
    constructor() {
        this.state = {
            currentSlide: 0,
            isMenuOpen: false,
            isLightboxOpen: false,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        this.controllers = new Map();
        this.observers = new Map();
    }

    // Initialize application
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize performance optimizations first
            this.controllers.set('performance', new PerformanceController());
            await this.controllers.get('performance').init();

            // Initialize core controllers
            await this.initializeControllers();

            // Setup global event listeners
            this.setupGlobalEventListeners();

            // Initialize intersection observers
            this.setupObservers();

            console.log('✅ Marci Metzger Homes app initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
        }
    }

    // Initialize all controllers
    async initializeControllers() {
        const controllerConfigs = [
            { name: 'navigation', Controller: NavigationController },
            { name: 'carousel', Controller: CarouselController },
            { name: 'forms', Controller: FormController },
            { name: 'animations', Controller: AnimationController },
            { name: 'accessibility', Controller: AccessibilityController }
        ];

        // Initialize controllers in parallel for better performance
        const initPromises = controllerConfigs.map(async ({ name, Controller }) => {
            try {
                const controller = new Controller(this.state);
                await controller.init();
                this.controllers.set(name, controller);
                return { name, success: true };
            } catch (error) {
                console.error(`Failed to initialize ${name} controller:`, error);
                return { name, success: false, error };
            }
        });

        const results = await Promise.allSettled(initPromises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
        
        console.log(`Initialized ${successful.length}/${controllerConfigs.length} controllers`);
    }

    // Setup global event listeners
    setupGlobalEventListeners() {
        // Optimized scroll handler with RAF
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.controllers.get('navigation')?.handleScroll();
                    this.controllers.get('animations')?.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Throttled resize handler
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.controllers.get('carousel')?.handleResize();
                this.controllers.get('animations')?.handleResize();
            }, 150);
        };

        // Keyboard navigation
        const handleKeyDown = (e) => {
            this.controllers.get('accessibility')?.handleKeyDown(e);
            this.controllers.get('carousel')?.handleKeyDown(e);
        };

        // Add event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('orientationchange', handleResize);
        document.addEventListener('keydown', handleKeyDown);

        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.controllers.get('carousel')?.pause();
            } else {
                this.controllers.get('carousel')?.resume();
            }
        });

        // Handle reduced motion preference changes
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addListener((e) => {
            this.state.prefersReducedMotion = e.matches;
            this.controllers.get('animations')?.updateMotionPreference(e.matches);
        });
    }

    // Setup intersection observers for performance
    setupObservers() {
        // Image lazy loading observer
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.controllers.get('performance')?.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '50px' }
        );

        // Animation trigger observer
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.controllers.get('animations')?.triggerAnimation(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Store observers
        this.observers.set('images', imageObserver);
        this.observers.set('animations', animationObserver);

        // Observe elements
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        document.querySelectorAll('[data-animate]').forEach(el => animationObserver.observe(el));
    }

    // Utility methods for controllers to access
    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    }

    getController(name) {
        return this.controllers.get(name);
    }

    // Event emitter for cross-controller communication
    emit(event, data) {
        const customEvent = new CustomEvent(`app:${event}`, { detail: data });
        document.dispatchEvent(customEvent);
    }

    // Listen to events from controllers
    on(event, callback) {
        document.addEventListener(`app:${event}`, callback);
    }
}

// Initialize application
const app = new App();
app.init();

// Make app available globally for debugging
if (process?.env?.NODE_ENV === 'development') {
    window.app = app;
}

export default app;
