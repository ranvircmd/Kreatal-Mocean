/**
 * Kreatal Mocean LLP - Corporate Website
 * Main JavaScript File
 * 
 * Features:
 * - Preloader
 * - Navbar functionality
 * - Hero Image Slider
 * - Smooth scroll
 * - Counter animation
 * - Formspree form handling
 * - AOS initialization
 * - Back to top button
 * - Toast notifications
 */

'use strict';

// ============================================
// DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPreloader();
    initNavbar();
    initHeroSlider();
    initSmoothScroll();
    initCounterAnimation();
    initAOS();
    initBackToTop();
    initForms();
    initCurrentYear();
    initToastClose();
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    // Hide preloader after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 500);
    });
    
    // Prevent body scroll while loading
    document.body.classList.add('no-scroll');
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Scroll effect
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    handleNavbarScroll();
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking on links
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    // Active link on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
            
            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                    });
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// ============================================
// HERO IMAGE SLIDER
// ============================================
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds
    
    // Show specific slide
    function showSlide(index) {
        // Handle wrapping
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        // Update slides
        slides.forEach(function(slide, i) {
            slide.classList.remove('active');
            if (i === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach(function(dot, i) {
            dot.classList.remove('active');
            if (i === currentSlide) {
                dot.classList.add('active');
            }
        });
    }
    
    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Start auto-sliding
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }
    
    // Stop auto-sliding
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Reset auto-sliding (used after manual navigation)
    function resetSlideShow() {
        stopSlideShow();
        startSlideShow();
    }
    
    // Event Listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetSlideShow();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetSlideShow();
        });
    }
    
    // Dot navigation
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetSlideShow();
        });
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
    
    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            resetSlideShow();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only if hero section is in view
        const heroSection = document.getElementById('home');
        if (!heroSection) return;
        
        const rect = heroSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetSlideShow();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetSlideShow();
            }
        }
    });
    
    // Initialize
    showSlide(0);
    startSlideShow();
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (counters.length === 0) return;
    
    const animateCounter = function(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = function() {
            current += step;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

// ============================================
// AOS INITIALIZATION
// ============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                toggleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// FORMSPREE FORM HANDLING
// ============================================
function initForms() {
    const forms = document.querySelectorAll('form[action*="formspree.io"]');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', handleFormSubmit);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Get form data
    const formData = new FormData(form);
    
    // Basic validation
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success
            form.reset();
            showToast('Thank you! Your submission has been received successfully.', 'success');
        } else {
            // Error from server
            const data = await response.json();
            if (data.errors) {
                const errorMessage = data.errors.map(error => error.message).join(', ');
                showToast('Error: ' + errorMessage, 'error');
            } else {
                showToast('Oops! Something went wrong. Please try again.', 'error');
            }
        }
    } catch (error) {
        // Network error
        showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-flex';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(function(input) {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--error-color)';
            
            // Reset border after 3 seconds
            setTimeout(function() {
                input.style.borderColor = '';
            }, 3000);
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = 'var(--error-color)';
                showToast('Please enter a valid email address.', 'error');
            }
        }
        
        // Phone validation (Indian format)
        if (input.type === 'tel' && input.value) {
            const cleanPhone = input.value.replace(/[\s\-\+]/g, '');
            const phoneRegex = /^(91)?[6-9]\d{9}$/;
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                input.style.borderColor = 'var(--error-color)';
                showToast('Please enter a valid phone number.', 'error');
            }
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Update message
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    // Update icon and class based on type
    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    
    if (toastIcon) {
        toastIcon.className = 'fas toast-icon';
        if (type === 'success') {
            toastIcon.classList.add('fa-check-circle');
        } else {
            toastIcon.classList.add('fa-exclamation-circle');
        }
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(function() {
        hideToast();
    }, 5000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

function initToastClose() {
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', hideToast);
    }
}

// ============================================
// CURRENT YEAR
// ============================================
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
        
        // Also close toast
        hideToast();
    }
});

// ============================================
// RIPPLE EFFECT FOR BUTTONS
// ============================================
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    btn.appendChild(ripple);
    
    setTimeout(function() {
        ripple.remove();
    }, 600);
});

// Add ripple animation styles
(function() {
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log(
    '%c🌊 Kreatal Mocean LLP %c\nCreating Creative Ocean\n\n' +
    'Website developed with ❤️\n' +
    'Contact: kreatalmocean@gmail.com',
    'color: #0b3d91; font-size: 24px; font-weight: bold;',
    'color: #ff9800; font-size: 14px;'
);