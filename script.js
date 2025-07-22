// Portfolio Variables
let currentSlide = 0;
let slides;
let totalSlides;
let currentSection = 'hero'; // 'hero', 'about', 'works', 'contact'

// --- Combined DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slides after DOM is ready
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    console.log('DOM loaded - Total slides:', totalSlides); // Debug log
    
    // Reset currentSlide to ensure proper initial state
    currentSlide = 0;
    
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

    // --- Tag Filter Functionality ---
    const filterButtons = document.querySelectorAll('.filter-tag');
    const portfolioItems = document.querySelectorAll('.portfolio-grid-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const category = this.closest('.filter-tags').getAttribute('data-category');
            
            // Update active button
            this.closest('.filter-tags').querySelectorAll('.filter-tag').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter items
            portfolioItems.forEach(item => {
                // Only filter items in the same section
                if (item.closest('.slide').querySelector(`.filter-tags[data-category="${category}"]`)) {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        const tags = item.getAttribute('data-tags');
                        if (tags && tags.includes(filter)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                }
            });
        });
    });


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

    // --- Mobile Carousel Indicators ---
    function initMobileCarouselIndicators() {
        if (window.innerWidth <= 480) {
            // Show scroll indicators on mobile
            document.querySelectorAll('.portfolio-scroll-indicators').forEach(indicator => {
                indicator.style.display = 'flex';
            });

            // Add scroll event listeners to portfolio grids
            document.querySelectorAll('.portfolio-grid').forEach((grid, gridIndex) => {
                const indicators = grid.parentNode.querySelector('.portfolio-scroll-indicators');
                if (!indicators) return;

                const dots = indicators.querySelectorAll('.scroll-indicator-dot');
                const items = grid.querySelectorAll('.portfolio-grid-item:not(.hidden)');
                
                // Update indicators based on scroll position
                grid.addEventListener('scroll', () => {
                    const scrollLeft = grid.scrollLeft;
                    const itemWidth = grid.querySelector('.portfolio-grid-item').offsetWidth + 16; // item width + gap
                    const currentIndex = Math.round(scrollLeft / itemWidth);
                    
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                });
            });
        } else {
            // Hide scroll indicators on desktop
            document.querySelectorAll('.portfolio-scroll-indicators').forEach(indicator => {
                indicator.style.display = 'none';
            });
        }
    }

    // Initialize carousel indicators
    initMobileCarouselIndicators();

    // Reinitialize on window resize
    window.addEventListener('resize', initMobileCarouselIndicators);

    // --- Mobile Touch Optimization for Portfolio Grids ---
    function optimizeMobileTouch() {
        if (window.innerWidth <= 480) {
            document.querySelectorAll('.portfolio-grid').forEach(grid => {
                // Prevent vertical scrolling on horizontal carousel
                grid.addEventListener('touchmove', (e) => {
                    // Only prevent if scrolling horizontally
                    const touch = e.touches[0];
                    if (grid.scrollWidth > grid.clientWidth) {
                        e.preventDefault();
                    }
                }, { passive: false });

                // Add momentum scrolling for better iOS experience
                grid.style.webkitOverflowScrolling = 'touch';
            });
        }
    }

    // Initialize touch optimization
    optimizeMobileTouch();
    window.addEventListener('resize', optimizeMobileTouch);

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
        console.log('navigateToSection called with:', sectionName, 'window.innerWidth:', window.innerWidth); // Debug log
        
        if (sectionName === 'works') {
            // On mobile, go directly to LP section (first portfolio slide)
            if (window.innerWidth <= 768) {
                currentSlide = 1; // LP（ランディングページ）slide - first portfolio section
            } else {
                currentSlide = 0; // Start from hero on desktop, can scroll to see portfolio
            }
            console.log('Navigating to works, currentSlide set to:', currentSlide); // Debug log
            updateSlidePosition();
        } else {
            currentSlide = 0; // Hero slide
            updateSlidePosition();
        }
    }

    // Check if we came from another page with a hash
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        console.log('Page loaded with hash:', hash); // Debug log
        // Wait for images to load and transitions to complete
        setTimeout(() => {
            console.log('Executing hash navigation after 300ms delay'); // Debug log
            navigateToSection(hash);
            // Ensure the view is updated
            if (window.scrollTo) {
                window.scrollTo(0, 0);
            }
        }, 300);
    } else {
        console.log('Page loaded without hash'); // Debug log
    }

    // Add click event listeners to internal navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            const sectionName = href.replace('#', '');
            console.log('Click event - sectionName:', sectionName, 'href:', href); // Debug log
            
            // Force reset currentSlide before navigation for mobile
            if (window.innerWidth <= 768 && sectionName === 'works') {
                console.log('Mobile works click - forcing currentSlide reset'); // Debug log
                currentSlide = 0; // Reset to ensure clean state
            }
            
            navigateToSection(sectionName);
            // Update URL hash without triggering scroll
            history.pushState(null, null, href);
        });
    });
});

// --- Page Visibility Handler ---
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page became visible - resetting slide state'); // Debug log
        // Reset to ensure clean state when page becomes visible
        if (window.innerWidth <= 768 && window.location.hash === '#works') {
            currentSlide = 0;
            setTimeout(() => {
                navigateToSection('works');
            }, 100);
        }
    }
});

// --- Scrolling and Navigation ---
let isScrolling = false;

function updateSlidePosition() {
    const scrollContent = document.querySelector('.scroll-content');
    if (!scrollContent) return;
    
    // Get all slides to verify count
    const allSlides = document.querySelectorAll('.slide');
    console.log('Total slides found:', allSlides.length, 'currentSlide:', currentSlide); // Debug log
    
    // Force a reflow to ensure proper rendering on mobile
    scrollContent.style.transition = 'none';
    void scrollContent.offsetHeight; // Trigger reflow
    
    const translateY = -(currentSlide * 100);
    console.log('updateSlidePosition - currentSlide:', currentSlide, 'translateY:', translateY, 'vh'); // Debug log
    
    // Log which slide should be visible
    if (allSlides[currentSlide]) {
        const slideInfo = allSlides[currentSlide].querySelector('.portfolio-section-title');
        console.log('Current slide should show:', slideInfo ? slideInfo.textContent : 'Hero slide');
    }
    
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

// Dropdown Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            navigateToWorksCategory(category);
            
            // Hide dropdown on mobile after selection
            if (window.innerWidth <= 768) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
            }
        });
    });
    
    // Mobile touch support for dropdown
    if (window.innerWidth <= 768) {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const isVisible = dropdownMenu.style.visibility === 'visible';
            
            if (isVisible) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
            } else {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
            }
        });
    }
});

function navigateToWorksCategory(category) {
    // Navigate to works section first
    if (category === 'website') {
        currentSlide = 1; // Webサイト slide
    } else if (category === 'webapp') {
        currentSlide = 2; // Webアプリ slide  
    }
    
    updateSlidePosition();
    currentSection = 'works';
    
    // Update active filter after navigation
    setTimeout(() => {
        const targetSlide = slides[currentSlide];
        if (targetSlide) {
            const filterTags = targetSlide.querySelectorAll('.filter-tag');
            filterTags.forEach(tag => {
                tag.classList.remove('active');
                if (tag.getAttribute('data-filter') === 'all') {
                    tag.classList.add('active');
                }
            });
            
            // Show all items by default
            const portfolioItems = targetSlide.querySelectorAll('.portfolio-grid-item');
            portfolioItems.forEach(item => {
                item.style.display = 'block';
            });
        }
    }, 300);
}
