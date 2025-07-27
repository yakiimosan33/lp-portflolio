// Simple navigation variables
let currentSection = 'hero';

// --- Combined DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', function() {
    // Initialize simple navigation
    console.log('DOM loaded - Simple scroll initialized');
    
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
    imagesLoaded(document.querySelector('.portfolio-container'), { background: true }, function() {
        console.log('All images have loaded.');
        hideLoadingScreen();
    });

    // Failsafe: Hide loading screen after 3 seconds anyway
    setTimeout(hideLoadingScreen, 3000);

    // --- Tag Filter Functionality ---
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-tag');
        console.log('Found filter buttons:', filterButtons.length); // Debug log
        
        // Remove existing event listeners by cloning elements
        filterButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });
        
        // Add fresh event listeners
        document.querySelectorAll('.filter-tag').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const filter = this.getAttribute('data-filter');
                const category = this.closest('.filter-tags').getAttribute('data-category');
                const currentSection = this.closest('.portfolio-section');
                const currentGrid = currentSection.querySelector('.portfolio-grid');
                const portfolioItems = currentSection.querySelectorAll('.portfolio-grid-item');
                
                console.log('Filter clicked:', filter, 'Category:', category); // Debug log
                
                // Update active button
                this.closest('.filter-tags').querySelectorAll('.filter-tag').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filter items within current section only
                portfolioItems.forEach(item => {
                    // Remove any existing hidden state first
                    item.classList.remove('hidden');
                    
                    if (filter !== 'all') {
                        const tags = item.getAttribute('data-tags');
                        if (!tags || !tags.includes(filter)) {
                            item.classList.add('hidden');
                        }
                    }
                });
                
                // Force a small delay to ensure DOM updates before updating button
                setTimeout(() => {
                    updateShowMoreButton(currentSection);
                }, 10);
            });
        });
    }
    
    // Initialize everything after DOM and images are ready
    function initializeEverything() {
        console.log('Initializing all functions...');
        initializeFilters();
        initializeShowMoreButtons();
        
        // Force update all sections
        document.querySelectorAll('.portfolio-section').forEach(section => {
            updateShowMoreButton(section);
        });
    }
    
    // Initialize on page load with multiple fallbacks
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeEverything, 100);
        });
    } else {
        setTimeout(initializeEverything, 100);
    }


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

    // --- Initialize removed - using hybrid approach ---

    // --- Mobile carousel indicators removed in hybrid approach ---

    // --- Touch optimization removed - using normal scroll in hybrid approach ---

    // --- Hover effects for interactive elements ---
    document.querySelectorAll('a, button, .portfolio-grid-item').forEach(el => {
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

    // --- Show More Button Functionality ---
    function updateShowMoreButton(section) {
        if (!section) return;
        
        const grid = section.querySelector('.portfolio-grid');
        const showMoreBtn = section.querySelector('.show-more-btn');
        
        if (!grid || !showMoreBtn) {
            console.log('Missing grid or button in updateShowMoreButton'); // Debug log
            return;
        }
        
        const allItems = Array.from(grid.querySelectorAll('.portfolio-grid-item'));
        const visibleItems = allItems.filter(item => !item.classList.contains('hidden'));
        
        console.log('updateShowMoreButton - total items:', allItems.length, 'visible items:', visibleItems.length); // Debug log
        
        // Reset data-visible-index for all items
        allItems.forEach(item => {
            item.removeAttribute('data-visible-index');
        });
        
        // Set visible index for visible items only
        visibleItems.forEach((item, index) => {
            item.setAttribute('data-visible-index', index + 1);
            console.log(`Item ${index + 1}:`, item.querySelector('.grid-title')?.textContent || 'No title'); // Debug log
        });
        
        // Only reset expanded state when filtering if we have more than 6 items
        // If 6 or fewer items, keep expanded to show all
        if (visibleItems.length > 6) {
            grid.classList.remove('expanded');
            showMoreBtn.classList.add('visible');
            showMoreBtn.style.display = 'block';
            console.log('Show more button displayed'); // Debug log
        } else {
            // 6 items or fewer - expand grid and hide button to show all items
            grid.classList.add('expanded');
            showMoreBtn.classList.remove('visible');
            showMoreBtn.style.display = 'none';
            console.log('Show more button hidden - showing all items'); // Debug log
        }
    }
    
    function initializeShowMoreButtons() {
        console.log('Initializing show more buttons'); // Debug log
        document.querySelectorAll('.portfolio-section').forEach(section => {
            const grid = section.querySelector('.portfolio-grid');
            const showMoreBtn = section.querySelector('.show-more-btn');
            
            if (!grid || !showMoreBtn) {
                console.log('Missing grid or button in section'); // Debug log
                return;
            }
            
            // Initial setup
            updateShowMoreButton(section);
            
            // Remove existing event listener by cloning
            const newBtn = showMoreBtn.cloneNode(true);
            showMoreBtn.parentNode.replaceChild(newBtn, showMoreBtn);
            
            // Add fresh event listener
            newBtn.addEventListener('click', function() {
                console.log('Show more button clicked'); // Debug log
                grid.classList.add('expanded');
                this.style.display = 'none';
                
                // Smooth scroll to show new items
                setTimeout(() => {
                    const visibleItems = Array.from(grid.querySelectorAll('.portfolio-grid-item:not(.hidden)'));
                    const seventhItem = visibleItems[6];
                    if (seventhItem) {
                        scrollToSection(seventhItem, 120);
                        console.log('Scrolling to 7th item');
                    }
                }, 200);
            });
        });
    }
    
    // Show more buttons initialized above

    // --- Navigation Menu Functionality ---
    // Simplified navigation to sections
    function navigateToSection(sectionName) {
        console.log('navigateToSection called with:', sectionName);
        
        if (sectionName === 'works') {
            const worksSection = document.getElementById('works');
            scrollToSection(worksSection, 100);
        } else {
            // Navigate to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Scrolling to top');
        }
    }

    // Check if we came from another page with a hash
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        console.log('Page loaded with hash:', hash);
        // Wait for images to load
        setTimeout(() => {
            navigateToSection(hash);
        }, 300);
    }

    // Add click event listeners to internal navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            const sectionName = href.replace('#', '');
            console.log('Click event - sectionName:', sectionName, 'href:', href); // Debug log
            
            // Navigate to section using new hybrid approach
            navigateToSection(sectionName);
            // Update URL hash without triggering scroll
            history.pushState(null, null, href);
        });
    });
});

// --- Page Visibility Handler (removed for hybrid approach) ---

// --- Simple Navigation Functions ---
// Simple smooth scroll to section
function scrollToSection(targetElement, offset = 80) {
    if (targetElement) {
        const targetPosition = targetElement.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        console.log('Scrolling to position:', targetPosition);
    }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

// Dropdown Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const dropdown = document.querySelector('.dropdown');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Toggle dropdown on click
    dropdownTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });
    
    // Handle dropdown item selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            navigateToWorksCategory(category);
            
            // Close dropdown after selection
            dropdown.classList.remove('open');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Close dropdown on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
            dropdown.classList.remove('open');
        }
    });
});

function navigateToWorksCategory(category) {
    console.log('navigateToWorksCategory called with:', category); // Debug log
    let targetSection;
    
    if (category === 'website') {
        targetSection = document.getElementById('website-section');
    } else if (category === 'webapp') {
        targetSection = document.getElementById('webapp-section');
    }
    
    console.log('Target section found:', targetSection); // Debug log
    
    if (targetSection) {
        scrollToSection(targetSection, 100);
        console.log('Navigating to', category);
        
        // Update active filter after navigation
        setTimeout(() => {
            const filterTags = targetSection.querySelectorAll('.filter-tag');
            filterTags.forEach(tag => {
                tag.classList.remove('active');
                if (tag.getAttribute('data-filter') === 'all') {
                    tag.classList.add('active');
                }
            });
            
            // Reset any filters
            const portfolioItems = targetSection.querySelectorAll('.portfolio-grid-item');
            portfolioItems.forEach(item => {
                item.classList.remove('hidden');
            });
            
            // Update show more button
            updateShowMoreButton(targetSection);
        }, 300);
    }
}

// Make function available globally
window.navigateToWorksCategory = navigateToWorksCategory;
