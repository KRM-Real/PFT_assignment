// Carousel Controller - High-performance image carousel
export class CarouselController {
    constructor(appState) {
        this.state = appState;
        this.track = null;
        this.slides = [];
        this.thumbnails = [];
        this.autoSlideInterval = null;
        this.touchStart = { x: 0, y: 0 };
        this.isAutoPlaying = true;
        this.transitionDuration = 300;
    }

    async init() {
        this.bindElements();
        this.setupEventListeners();
        this.setupLightbox();
        this.startAutoSlide();
        this.preloadImages();
    }

    bindElements() {
        this.track = document.getElementById('carouselTrack');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.thumbnails = Array.from(document.querySelectorAll('.thumb'));
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        if (!this.track || !this.slides.length) {
            throw new Error('Carousel elements not found');
        }
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Thumbnail navigation
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch/swipe support
        this.setupTouchEvents();

        // Pause on hover
        const container = document.querySelector('.carousel-container');
        container?.addEventListener('mouseenter', () => this.pauseAutoSlide());
        container?.addEventListener('mouseleave', () => this.resumeAutoSlide());

        // Keyboard navigation
        this.track?.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    setupTouchEvents() {
        this.track?.addEventListener('touchstart', (e) => {
            this.touchStart.x = e.touches[0].clientX;
            this.touchStart.y = e.touches[0].clientY;
        }, { passive: true });

        this.track?.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling while swiping
        }, { passive: false });

        this.track?.addEventListener('touchend', (e) => {
            const deltaX = this.touchStart.x - e.changedTouches[0].clientX;
            const deltaY = this.touchStart.y - e.changedTouches[0].clientY;

            // Check if it's a horizontal swipe (not vertical scroll)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        }, { passive: true });
    }

    setupLightbox() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');

        // Open lightbox on image click
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            img?.addEventListener('click', () => this.openLightbox(index));
        });

        // Lightbox controls
        this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev?.addEventListener('click', () => this.lightboxPrevious());
        this.lightboxNext?.addEventListener('click', () => this.lightboxNext());

        // Close on overlay click
        this.lightbox?.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });
    }

    updateCarousel() {
        if (!this.track) return;

        const translateX = -this.state.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update thumbnail active state
        this.thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.state.currentSlide);
        });

        // Announce to screen readers
        this.announceSlideChange();
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        this.state.currentSlide = index;
        this.updateCarousel();
        this.resetAutoSlide();
    }

    previousSlide() {
        const newIndex = this.state.currentSlide > 0 
            ? this.state.currentSlide - 1 
            : this.slides.length - 1;
        this.goToSlide(newIndex);
    }

    nextSlide() {
        const newIndex = this.state.currentSlide < this.slides.length - 1 
            ? this.state.currentSlide + 1 
            : 0;
        this.goToSlide(newIndex);
    }

    startAutoSlide() {
        if (this.state.prefersReducedMotion) return;
        
        this.autoSlideInterval = setInterval(() => {
            if (this.isAutoPlaying && !this.state.isLightboxOpen) {
                this.nextSlide();
            }
        }, 5000);
    }

    pauseAutoSlide() {
        this.isAutoPlaying = false;
    }

    resumeAutoSlide() {
        this.isAutoPlaying = true;
    }

    resetAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.pauseAutoSlide();
            setTimeout(() => {
                this.resumeAutoSlide();
                this.startAutoSlide();
            }, 10000);
        }
    }

    // Lightbox methods
    openLightbox(index) {
        this.state.isLightboxOpen = true;
        this.state.currentSlide = index;
        
        const img = this.slides[index]?.querySelector('img');
        if (img && this.lightboxImage) {
            this.lightboxImage.src = img.src;
            this.lightboxImage.alt = img.alt;
        }
        
        this.lightbox?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.lightboxClose?.focus();
    }

    closeLightbox() {
        this.state.isLightboxOpen = false;
        this.lightbox?.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxPrevious() {
        const newIndex = this.state.currentSlide > 0 
            ? this.state.currentSlide - 1 
            : this.slides.length - 1;
        this.openLightbox(newIndex);
    }

    lightboxNext() {
        const newIndex = this.state.currentSlide < this.slides.length - 1 
            ? this.state.currentSlide + 1 
            : 0;
        this.openLightbox(newIndex);
    }

    handleKeyDown(e) {
        if (!this.state.isLightboxOpen) return;

        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.lightboxPrevious();
                break;
            case 'ArrowRight':
                this.lightboxNext();
                break;
        }
    }

    handleResize() {
        // Recalculate positions on resize
        this.updateCarousel();
    }

    pause() {
        this.pauseAutoSlide();
    }

    resume() {
        if (!document.hidden) {
            this.resumeAutoSlide();
        }
    }

    // Performance optimization
    preloadImages() {
        const nextIndex = (this.state.currentSlide + 1) % this.slides.length;
        const prevIndex = this.state.currentSlide === 0 
            ? this.slides.length - 1 
            : this.state.currentSlide - 1;

        [nextIndex, prevIndex].forEach(index => {
            const img = this.slides[index]?.querySelector('img');
            if (img && !img.complete) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }

    announceSlideChange() {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Showing image ${this.state.currentSlide + 1} of ${this.slides.length}`;
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }
}
