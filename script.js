// Portfolio Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    // Use imagesLoaded to wait for all images, including portfolio ones
    imagesLoaded(document.querySelector('.scroll-content'), { background: true }, function() {
        console.log('All images have loaded.');
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('loaded');
        }
    });
});

// Custom Cursor
const cursor = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-dot-outline');

document.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursor.style.left = `${posX}px`;
    cursor.style.top = `${posY}px`;
    
    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;

    // Make cursor visible on first move
    if (cursor.style.opacity === '0') {
        cursor.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    }
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorOutline.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});


// Horizontal Scrolling
let isScrolling = false;

function updateSlidePosition() {
    const scrollContent = document.querySelector('.scroll-content');
    const translateX = -(currentSlide * 100);
    scrollContent.style.transform = `translateX(${translateX}vw)`;

    // Update scrollbar
    const scrollbarHandle = document.querySelector('.scrollbar__handle');
    const progress = totalSlides > 1 ? currentSlide / (totalSlides - 1) : 0;
    scrollbarHandle.style.transform = `scaleX(${progress})`;
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlidePosition();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlidePosition();
    }
}

// Wheel Event for Navigation
document.addEventListener('wheel', (e) => {
    if (isScrolling) return;

    isScrolling = true;

    if (e.deltaY > 0) {
        nextSlide();
    } else {
        prevSlide();
    }

    setTimeout(() => {
        isScrolling = false;
    }, 800); // Cooldown period to prevent rapid slide changes
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;

    isScrolling = true;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevSlide();
    }
    setTimeout(() => {
        isScrolling = false;
    }, 800);
});

// Touch Events for Mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left
            nextSlide();
        } else {
            // Swiped right
            prevSlide();
        }
    }
}

// Initialize Tilt Effects & Image Load animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tilt for portfolio items
    $('.portfolio-item').tilt({
        maxTilt: 15,
        perspective: 1400,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        speed: 1200,
        glare: true,
        maxGlare: 0.3,
        scale: 1.02
    });

    // Handle image loading animation
    const portfolioImages = document.querySelectorAll('.portfolio-item img');
    portfolioImages.forEach(img => {
        // Set initial style for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';

        // When image is loaded (from cache or network), fade it in
        if (img.complete) {
             img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
        
        // Optional: handle image errors by hiding the image or showing a placeholder
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
            // this.style.display = 'none'; // or set a placeholder
        });
    });

    // Initialize slide position
    updateSlidePosition();
});

// Hover effects for interactive elements
document.querySelectorAll('a, button, .portfolio-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(255, 79, 79, 0.3)';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'rgba(255, 79, 79, 0.5)';
    });
});