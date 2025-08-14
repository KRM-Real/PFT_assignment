// Performance Controller - Optimizations for speed and efficiency
export class PerformanceController {
    constructor() {
        this.imageCache = new Map();
        this.lazyImages = new Set();
        this.performanceMetrics = {
            loadTime: 0,
            imageLoads: 0,
            cacheHits: 0
        };
    }

    async init() {
        this.measureLoadTime();
        this.setupImageLazyLoading();
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupResourceHints();
        this.monitorPerformance();
    }

    measureLoadTime() {
        const startTime = performance.now();
        
        window.addEventListener('load', () => {
            this.performanceMetrics.loadTime = performance.now() - startTime;
            console.log(`Page loaded in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
        });
    }

    setupImageLazyLoading() {
        // Create optimized intersection observer for images
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.01
            }
        );

        // Observe all lazy images
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            // Set up data-src for lazy loading if not already set
            if (!img.hasAttribute('data-src') && img.src) {
                img.setAttribute('data-src', img.src);
                img.src = this.generatePlaceholder(img.width || 400, img.height || 300);
            }
            
            this.lazyImages.add(img);
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Check cache first
        if (this.imageCache.has(src)) {
            img.src = src;
            img.classList.add('loaded');
            this.performanceMetrics.cacheHits++;
            return;
        }

        // Create new image for preloading
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Add to cache
            this.imageCache.set(src, true);
            
            // Update img element
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            
            this.performanceMetrics.imageLoads++;
            
            // Fade in effect
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
        };

        imageLoader.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            img.classList.add('error');
        };

        // Start loading
        imageLoader.src = src;
    }

    generatePlaceholder(width, height) {
        // Generate simple colored placeholder
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Desert sand color placeholder
        ctx.fillStyle = '#E7D9CC';
        ctx.fillRect(0, 0, width, height);
        
        return canvas.toDataURL();
    }

    optimizeImages() {
        // Add loading CSS for smooth transitions
        const style = document.createElement('style');
        style.textContent = `
            img {
                transition: opacity 0.3s ease;
            }
            
            img[loading="lazy"] {
                opacity: 0;
            }
            
            img.loaded {
                opacity: 1;
            }
            
            img.error {
                opacity: 0.5;
                filter: grayscale(100%);
            }
        `;
        document.head.appendChild(style);

        // Convert images to WebP where supported
        if (this.supportsWebP()) {
            this.convertToWebP();
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    convertToWebP() {
        // This would typically be done server-side or build-time
        // For demo purposes, we'll just add the logic structure
        console.log('WebP support detected - optimized images could be served');
    }

    preloadCriticalResources() {
        // Preload hero image and other critical resources
        const criticalImages = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // Hero background
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Preload critical fonts
        this.preloadFonts();
    }

    preloadFonts() {
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700'
        ];

        fonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }

    setupResourceHints() {
        // DNS prefetch for external domains
        const domains = [
            '//fonts.googleapis.com',
            '//fonts.gstatic.com',
            '//cdnjs.cloudflare.com',
            '//images.unsplash.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        this.observeLCP();
        this.observeFID();
        this.observeCLS();
    }

    observeLCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            console.log('LCP monitoring not supported');
        }
    }

    observeFID() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            
            observer.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.log('FID monitoring not supported');
        }
    }

    observeCLS() {
        try {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            });
            
            observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            console.log('CLS monitoring not supported');
        }
    }

    // Debounce utility for performance
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle utility for performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Memory cleanup
    cleanup() {
        this.imageCache.clear();
        this.lazyImages.clear();
        
        // Remove event listeners and observers
        // This would be called on page unload
    }

    // Performance reporting
    getMetrics() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.imageCache.size,
            lazyImagesCount: this.lazyImages.size
        };
    }
}
