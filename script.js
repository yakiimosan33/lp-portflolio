// Portfolio Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let currentSection = 'hero'; // 'hero', 'about', 'works', 'contact'

// --- Combined DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', function() {
    // --- Loading Screen Logic ---
    const loadingScreen = document.getElementById('loading');
    let loadingFinished = false;

    function hideLoadingScreen() {
        if (!loadingFinished) {
            loadingFinished = true;
            if (loadingScreen) {
                loadingScreen.classList.add('loaded');
            }
        }
    }

    // Use imagesLoaded to wait for all portfolio images
    imagesLoaded(document.querySelector('.scroll-content'), { background: true }, function() {
        console.log('All images have loaded.');
        hideLoadingScreen();
    });

    // Failsafe: Hide loading screen after 3 seconds anyway
    setTimeout(hideLoadingScreen, 3000);


    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-dot-outline');

    if (cursor && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
            cursor.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
    }


    // --- Initialize Tilt Effects ---
    if (typeof $ !== 'undefined' && $.fn && $.fn.tilt) {
        $('.portfolio-item').tilt({
            maxTilt: 15,
            perspective: 1400,
            easing: "cubic-bezier(.03,.98,.52,.99)",
            speed: 1200,
            glare: true,
            maxGlare: 0.3,
            scale: 1.02
        });
    }

    // --- Image Loading Animation ---
    const portfolioImages = document.querySelectorAll('.portfolio-item img');
    portfolioImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() { this.style.opacity = '1'; });
        }
        img.addEventListener('error', function() { console.error('Image failed to load:', this.src); });
    });

    // --- Initialize Slide Position ---
    updateSlidePosition();

    // --- Hover effects for interactive elements ---
    document.querySelectorAll('a, button, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(0, 87, 255, 0.2)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'rgba(0, 87, 255, 0)'; // Reset to border only
        });
    });

    // --- Email Obfuscation ---
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
        const user = 'yakiimosan33';
        const domain = 'gmail.com';
        emailLink.href = `mailto:${user}@${domain}`;
        emailLink.textContent = `${user}@${domain}`;
    }

    // --- Navigation Menu Functionality ---
    // Function to navigate to a specific section
    function navigateToSection(sectionName) {
        if (sectionName === 'works') {
            currentSlide = 1; // Go to first portfolio grid slide
            updateSlidePosition();
        } else {
            currentSlide = 0; // Hero slide
            updateSlidePosition();
        }
    }

    // Check if we came from another page with a hash
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        // Wait for images to load and transitions to complete
        setTimeout(() => {
            navigateToSection(hash);
            // Ensure the view is updated
            if (window.scrollTo) {
                window.scrollTo(0, 0);
            }
        }, 300);
    }

    // Add click event listeners to internal navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            const sectionName = href.replace('#', '');
            navigateToSection(sectionName);
            // Update URL hash without triggering scroll
            history.pushState(null, null, href);
        });
    });
});

// --- Scrolling and Navigation ---
let isScrolling = false;

function updateSlidePosition() {
    const scrollContent = document.querySelector('.scroll-content');
    if (!scrollContent) return;
    
    // Force a reflow to ensure proper rendering on mobile
    scrollContent.style.transition = 'none';
    void scrollContent.offsetHeight; // Trigger reflow
    
    const translateY = -(currentSlide * 100);
    scrollContent.style.transform = `translateY(${translateY}vh)`;
    
    // Re-enable transitions after a brief delay
    setTimeout(() => {
        scrollContent.style.transition = '';
    }, 50);

    const scrollbarHandle = document.querySelector('.scrollbar__handle');
    if (!scrollbarHandle) return;
    const progress = totalSlides > 1 ? currentSlide / (totalSlides - 1) : 0;
    scrollbarHandle.style.height = `${progress * 100}%`;

    // Change color at the end
    if (currentSlide === totalSlides - 1) {
        scrollbarHandle.classList.add('scrollbar__handle--end');
    } else {
        scrollbarHandle.classList.remove('scrollbar__handle--end');
    }
}

function navigate(direction) {
    if (isScrolling) return;
    isScrolling = true;

    const oldSlide = currentSlide;
    if (direction === 'next' && currentSlide < totalSlides - 1) {
        currentSlide++;
    } else if (direction === 'prev' && currentSlide > 0) {
        currentSlide--;
    }

    if (oldSlide !== currentSlide) {
        updateSlidePosition();
    }

    setTimeout(() => { isScrolling = false; }, 1000); // Cooldown period
}

// Event Listeners for Navigation
document.addEventListener('wheel', (e) => navigate(e.deltaY > 0 ? 'next' : 'prev'));
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate('next');
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate('prev');
});

let touchStartY = 0;
document.addEventListener('touchstart', (e) => { touchStartY = e.changedTouches[0].screenY; });
document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    const swipeThreshold = 50;
    if (touchStartY - touchEndY > swipeThreshold) {
        navigate('next');
    } else if (touchEndY - touchStartY > swipeThreshold) {
        navigate('prev');
    }
});
