// Custom JavaScript for Marci Metzger Homes

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION ===== 
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', !isOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
            mobileMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===== SMOOTH SCROLLING =====
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                smoothScroll(target);
            }
        });
    });
    
    // Hero scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            smoothScroll('#about');
        });
    }
    
    // ===== PROPERTY SEARCH FORM =====
    const searchForm = document.getElementById('searchForm');
    const contactMessage = document.getElementById('message');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(searchForm);
        const searchCriteria = [];
        
        // Build search criteria message
        if (formData.get('location')) {
            searchCriteria.push(`Location: ${formData.get('location')}`);
        }
        if (formData.get('type')) {
            searchCriteria.push(`Property Type: ${formData.get('type')}`);
        }
        if (formData.get('bedrooms')) {
            searchCriteria.push(`Bedrooms: ${formData.get('bedrooms')}`);
        }
        if (formData.get('bathrooms')) {
            searchCriteria.push(`Bathrooms: ${formData.get('bathrooms')}`);
        }
        if (formData.get('minPrice')) {
            searchCriteria.push(`Min Price: $${formData.get('minPrice')}`);
        }
        if (formData.get('maxPrice')) {
            searchCriteria.push(`Max Price: $${formData.get('maxPrice')}`);
        }
        if (formData.get('sortBy')) {
            searchCriteria.push(`Sort By: ${formData.get('sortBy')}`);
        }
        
        // Pre-fill contact form
        const message = searchCriteria.length > 0 
            ? `Hi Marci, I'm interested in properties with the following criteria:\n\n${searchCriteria.join('\n')}\n\nPlease send me some tailored listings. Thank you!`
            : `Hi Marci, I'm interested in finding a property in the Pahrump area. Please send me some listings that match my needs. Thank you!`;
        
        if (contactMessage) {
            contactMessage.value = message;
        }
        
        // Scroll to contact section
        smoothScroll('#contact');
    });
    
    // ===== GALLERY CAROUSEL =====
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const thumbnails = document.querySelectorAll('.thumb');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    
    // Update carousel position
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update thumbnail active state
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Previous slide
    prevBtn.addEventListener('click', function() {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        updateCarousel();
    });
    
    // Next slide
    nextBtn.addEventListener('click', function() {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        updateCarousel();
    });
    
    // Thumbnail navigation
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    carouselTrack.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carouselTrack.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = startX - endX;
        const deltaY = startY - endY;
        
        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe left - next slide
                currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            } else {
                // Swipe right - previous slide
                currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
            }
            updateCarousel();
        }
        
        isDragging = false;
    });
    
    // ===== LIGHTBOX =====
    let lightboxSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide img');
    
    // Open lightbox
    slides.forEach((img, index) => {
        img.addEventListener('click', function() {
            lightboxSlide = index;
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Lightbox navigation
    lightboxPrev.addEventListener('click', function() {
        lightboxSlide = lightboxSlide > 0 ? lightboxSlide - 1 : totalSlides - 1;
        lightboxImage.src = slides[lightboxSlide].src;
        lightboxImage.alt = slides[lightboxSlide].alt;
    });
    
    lightboxNext.addEventListener('click', function() {
        lightboxSlide = lightboxSlide < totalSlides - 1 ? lightboxSlide + 1 : 0;
        lightboxImage.src = slides[lightboxSlide].src;
        lightboxImage.alt = slides[lightboxSlide].alt;
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                lightboxPrev.click();
                break;
            case 'ArrowRight':
                lightboxNext.click();
                break;
        }
    });
    
    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const successToast = document.getElementById('successToast');
    
    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const field = document.getElementById(fieldId);
        
        if (errorElement && field) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.style.borderColor = '#e74c3c';
        }
    }
    
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const field = document.getElementById(fieldId);
        
        if (errorElement && field) {
            errorElement.style.display = 'none';
            field.style.borderColor = '';
        }
    }
    
    function showSuccessToast() {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 4000);
    }
    
    // Clear errors on input
    ['name', 'email', 'message'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => clearError(fieldId));
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        ['name', 'email', 'message'].forEach(clearError);
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let hasErrors = false;
        
        // Validate fields
        if (!name) {
            showError('name', 'Name is required');
            hasErrors = true;
        }
        
        if (!email) {
            showError('email', 'Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!message) {
            showError('message', 'Message is required');
            hasErrors = true;
        }
        
        // If no errors, simulate form submission
        if (!hasErrors) {
            // In a real application, this would send data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            showSuccessToast();
        }
    });
    
    // ===== SCROLL ANIMATIONS =====
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.value-prop, .service-card, .about-content, .search-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== AUTO-CAROUSEL (Optional) =====
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (!lightbox.classList.contains('active') && !isDragging) {
                currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
                updateCarousel();
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto-slide on page load
    startAutoSlide();
    
    // Pause auto-slide on user interaction
    [prevBtn, nextBtn, ...thumbnails].forEach(element => {
        element.addEventListener('click', () => {
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000); // Resume after 10 seconds
        });
    });
    
    // Pause auto-slide when carousel is hovered
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger loading
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll handler
    window.removeEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    // Focus management for mobile menu
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                mobileMenu.classList.remove('open');
                navToggle.focus();
            }
        });
    }
    
    // Apply focus trapping when mobile menu is open
    navToggle.addEventListener('click', function() {
        if (mobileMenu.classList.contains('open')) {
            trapFocus(mobileMenu);
        }
    });
    
    // Announce dynamic content changes to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Use for carousel navigation
    prevBtn.addEventListener('click', () => {
        announceToScreenReader(`Showing image ${currentSlide + 1} of ${totalSlides}`);
    });
    
    nextBtn.addEventListener('click', () => {
        announceToScreenReader(`Showing image ${currentSlide + 1} of ${totalSlides}`);
    });
    
    // ===== UTILITY FUNCTIONS =====
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable auto-carousel for users who prefer reduced motion
        stopAutoSlide();
        
        // Reduce animation durations
        document.documentElement.style.setProperty('--transition-fast', '0.1s');
        document.documentElement.style.setProperty('--transition-smooth', '0.1s');
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            updateCarousel();
        }, 100);
    });
    
    // Add styles for screen reader only content
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(srOnlyStyle);
    
    console.log('Marci Metzger Homes website initialized successfully!');
});
