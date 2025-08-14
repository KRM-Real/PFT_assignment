// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar")
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mobileMenu = document.getElementById("mobile-menu")
  const mobileMenuClose = document.getElementById("mobile-menu-close")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("glass-nav")
    } else {
      navbar.classList.remove("glass-nav")
    }
  })

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full")
    document.body.style.overflow = "hidden"
  })

  mobileMenuClose.addEventListener("click", closeMobileMenu)

  function closeMobileMenu() {
    mobileMenu.classList.add("translate-x-full")
    document.body.style.overflow = ""
  }

  // Close mobile menu when clicking nav links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80 // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Fade up animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all fade-up elements
  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el)
  })

  // Gallery carousel functionality
  const carouselTrack = document.getElementById("carousel-track")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const thumbnailBtns = document.querySelectorAll(".thumbnail-btn")
  const galleryImages = document.querySelectorAll(".gallery-image")
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxClose = document.getElementById("lightbox-close")

  let currentSlide = 0
  const totalSlides = 5

  function updateCarousel() {
    const translateX = -currentSlide * 100
    carouselTrack.style.transform = `translateX(${translateX}%)`

    // Update thumbnail active state
    thumbnailBtns.forEach((btn, index) => {
      if (index === currentSlide) {
        btn.classList.add("border-copper")
      } else {
        btn.classList.remove("border-copper")
      }
    })
  }

  prevBtn.addEventListener("click", () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1
    updateCarousel()
  })

  nextBtn.addEventListener("click", () => {
    currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
    updateCarousel()
  })

  // Thumbnail navigation
  thumbnailBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentSlide = index
      updateCarousel()
    })
  })

  // Lightbox functionality
  galleryImages.forEach((img, index) => {
    img.addEventListener("click", function () {
      lightboxImage.src = this.src
      lightboxImage.alt = this.alt
      lightbox.classList.remove("hidden")
      lightbox.classList.add("flex")
      document.body.style.overflow = "hidden"
    })
  })

  lightboxClose.addEventListener("click", closeLightbox)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  function closeLightbox() {
    lightbox.classList.add("hidden")
    lightbox.classList.remove("flex")
    document.body.style.overflow = ""
  }

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "Escape") {
        closeLightbox()
      }
    }
  })

  // Initialize carousel
  updateCarousel()

  // Property search functionality
  const searchBtn = document.getElementById("search-btn")
  const searchSelects = ["location", "property-type", "bedrooms", "bathrooms", "min-price", "max-price", "sort-by"]

  searchBtn.addEventListener("click", () => {
    // Collect search criteria
    const searchCriteria = {}
    searchSelects.forEach((selectId) => {
      const select = document.getElementById(selectId)
      if (select && select.value) {
        searchCriteria[selectId] = select.value
      }
    })

    // Create message based on search criteria
    let message = "I'm interested in finding properties with the following criteria:\n\n"

    if (searchCriteria.location) {
      message += `Location: ${searchCriteria.location}\n`
    }
    if (searchCriteria["property-type"]) {
      message += `Property Type: ${searchCriteria["property-type"]}\n`
    }
    if (searchCriteria.bedrooms) {
      message += `Bedrooms: ${searchCriteria.bedrooms}\n`
    }
    if (searchCriteria.bathrooms) {
      message += `Bathrooms: ${searchCriteria.bathrooms}\n`
    }
    if (searchCriteria["min-price"]) {
      message += `Min Price: $${Number.parseInt(searchCriteria["min-price"]).toLocaleString()}\n`
    }
    if (searchCriteria["max-price"]) {
      message += `Max Price: $${Number.parseInt(searchCriteria["max-price"]).toLocaleString()}\n`
    }
    if (searchCriteria["sort-by"]) {
      message += `Sort By: ${searchCriteria["sort-by"]}\n`
    }

    message += "\nPlease send me tailored listings that match these preferences."

    // Pre-fill contact form and scroll to it
    const messageTextarea = document.getElementById("message")
    if (messageTextarea) {
      messageTextarea.value = message
    }

    // Scroll to contact section
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      const offsetTop = contactSection.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })

  // Contact form functionality
  const contactForm = document.getElementById("contact-form")
  const successToast = document.getElementById("success-toast")

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Basic form validation
    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const message = document.getElementById("message").value.trim()

    if (!name || !email) {
      alert("Please fill in all required fields.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.")
      return
    }

    // Show success toast
    successToast.classList.remove("translate-x-full")

    // Hide toast after 3 seconds
    setTimeout(() => {
      successToast.classList.add("translate-x-full")
    }, 3000)

    // Reset form
    contactForm.reset()
  })

  // Touch/swipe support for carousel on mobile
  let startX = 0
  let currentX = 0
  let isDragging = false

  if (carouselTrack) {
    carouselTrack.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      isDragging = true
    })

    carouselTrack.addEventListener("touchmove", (e) => {
      if (!isDragging) return
      e.preventDefault()
      currentX = e.touches[0].clientX
    })

    carouselTrack.addEventListener("touchend", (e) => {
      if (!isDragging) return
      isDragging = false

      const diffX = startX - currentX
      const threshold = 50

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swipe left - next slide
          currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
        } else {
          // Swipe right - previous slide
          currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1
        }
        updateCarousel()
      }
    })

    // Prevent default touch behavior on carousel
    carouselTrack.addEventListener(
      "touchmove",
      (e) => {
        if (isDragging) {
          e.preventDefault()
        }
      },
      { passive: false },
    )
  }

  // Performance optimizations
  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }

  // Service Worker registration for PWA capabilities
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }

  // Accessibility enhancements
  // Focus management for mobile menu
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  
  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements)
    const firstFocusableElement = focusableContent[0]
    const lastFocusableElement = focusableContent[focusableContent.length - 1]

    document.addEventListener('keydown', function(e) {
      let isTabPressed = e.key === 'Tab' || e.keyCode === 9

      if (!isTabPressed) {
        return
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    })
  }

  // Error handling for missing elements
  function safeAddEventListener(selector, event, handler) {
    const element = document.querySelector(selector)
    if (element) {
      element.addEventListener(event, handler)
    }
  }

  // Analytics tracking (placeholder)
  function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics integration
    console.log('Analytics Event:', eventName, properties)
  }

  // Track important user interactions
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('navigation_click', { target: link.getAttribute('href') })
    })
  })

  // Track form submissions
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      trackEvent('contact_form_submit')
    })
  }

  // Track property search
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      trackEvent('property_search')
    })
  }
})

// Enhanced error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error)
  // Could send error to analytics service
})

// Handle uncaught promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason)
})

// Utility functions for animations and interactions
class AnimationUtils {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0'
    element.style.display = 'block'
    
    const start = performance.now()
    
    function fade(currentTime) {
      const elapsed = currentTime - start
      const progress = elapsed / duration
      
      if (progress < 1) {
        element.style.opacity = progress
        requestAnimationFrame(fade)
      } else {
        element.style.opacity = '1'
      }
    }
    
    requestAnimationFrame(fade)
  }
  
  static fadeOut(element, duration = 300) {
    const start = performance.now()
    const startOpacity = parseFloat(window.getComputedStyle(element).opacity)
    
    function fade(currentTime) {
      const elapsed = currentTime - start
      const progress = elapsed / duration
      
      if (progress < 1) {
        element.style.opacity = startOpacity * (1 - progress)
        requestAnimationFrame(fade)
      } else {
        element.style.opacity = '0'
        element.style.display = 'none'
      }
    }
    
    requestAnimationFrame(fade)
  }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationUtils }
}
