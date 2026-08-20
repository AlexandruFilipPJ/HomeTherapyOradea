// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

// Close mobile menu on click
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav) {
            mainNav.classList.remove('active');
        }
    });
});

// Simple Contact Form submission intercept (mock behavior since no WP/PHP backend)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (formStatus) {
            formStatus.textContent = "Mesajul a fost trimis cu succes! Voi reveni în cel mai scurt timp.";
            setTimeout(() => {
                formStatus.textContent = "";
            }, 5000);
        }
        contactForm.reset();
    });
}

// Accordion toggles with smooth scrollHeight transitions
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all active items
        document.querySelectorAll('.accordion-item').forEach(el => {
            const c = el.querySelector('.accordion-content');
            if (c && el.classList.contains('active')) {
                // Set height back to scrollHeight before animating to 0
                c.style.maxHeight = c.scrollHeight + "px";
                // Force a reflow
                c.offsetHeight; 
                el.classList.remove('active');
                c.style.maxHeight = "0px";
            }
        });

        // Toggle current item
        if (!isActive && content) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
            
            // Allow container to expand freely after animation completes to avoid content clipping
            content.addEventListener('transitionend', function handler() {
                if (item.classList.contains('active')) {
                    content.style.maxHeight = "none";
                }
                content.removeEventListener('transitionend', handler);
            });
        }
    });
});

// --- UX / UI Interactive Features ---

// 1. Scroll-Reveal Observer (fade/slide up sections)
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// 2. Active Navigation Highlight Observer (highlighting current section in header)
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

if (sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active-scroll');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-scroll');
                    }
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "-25% 0px -55% 0px" // Trigger when section occupies the central viewing area
    });

    sections.forEach(sec => navObserver.observe(sec));
}

// 3. Floating Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Scroll smoothly to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 4. Image Lightbox / Zoom Photo Overlay
document.addEventListener("DOMContentLoaded", () => {
    // Create and inject Lightbox HTML markup dynamically
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-modal";
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Închide">&times;</button>
        <img class="lightbox-content" src="" alt="Imagine mărită">
        <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector(".lightbox-content");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    // Click listener to zoom images (targets carousel images or any img with class .zoomable)
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (target.tagName === "IMG" && (target.closest(".carousel-container") || target.classList.contains("zoomable"))) {
            lightboxImg.src = target.src;
            lightboxImg.alt = target.alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = target.alt || "Imagine";
            }
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background body scroll
        }
    });

    // Close functionality
    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
    };

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
});