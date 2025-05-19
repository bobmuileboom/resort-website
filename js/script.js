/**
 * La Truite d'Argent - Enhanced Responsive Navigation Script (Fixed)
 * Improved with visual feedback and performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- Core DOM elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const topSection = document.querySelector('.top-section');
    const chatWidget = document.getElementById('chat-widget');
    
    // --- Utility functions ---
    
    // Debounce function to limit how often a function can be called
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Check if we're in mobile view
    const isMobile = () => window.innerWidth <= 768;
    
    // Add visual indicators to dropdown menus
    function addDropdownIndicators() {
        document.querySelectorAll('.has-dropdown').forEach(link => {
            // Only add indicators if they don't already exist
            if (!link.querySelector('.dropdown-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'dropdown-indicator';
                indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
                link.appendChild(indicator);
            }
        });
    }
    
    // --- 1. Header scroll effect (with debounce for performance) ---
    const handleScroll = debounce(function() {
        if (window.scrollY > 100) {
            topSection.style.padding = '12px 20px';
            topSection.style.background = 'linear-gradient(to bottom, rgba(78, 67, 58, 0.95) 0%, rgba(78, 67, 58, 0.8) 60%, rgba(78, 67, 58, 0.4) 100%)';
        } else {
            topSection.style.padding = '20px';
            topSection.style.background = 'linear-gradient(to bottom, rgba(78, 67, 58, 0.9) 0%, rgba(78, 67, 58, 0.65) 60%, rgba(78, 67, 58, 0.2) 100%)';
        }
    }, 15); // Small debounce for smooth scrolling effect
    
    window.addEventListener('scroll', handleScroll);
    
    // --- 2. Mobile menu toggle (hamburger button) ---
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get a fresh reference to mainNav
            const mainNavElement = document.getElementById('main-nav');
            
            // Toggle active class
            mainNavElement.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (mainNavElement.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = ''; // Allow scrolling
                
                // Close any open dropdowns when closing the menu
                closeAllDropdowns();
            }
        });
    }
    
    // --- 3. Mobile dropdown handling (Improved with event delegation) ---
    
    // Function to close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            // Start height transition for smooth closing animation
            if (menu.classList.contains('show')) {
                // Set explicit height before transitioning to 0
                menu.style.height = menu.scrollHeight + 'px';
                // Force repaint
                menu.offsetHeight;
                // Transition to 0
                menu.style.height = '0';
                menu.style.opacity = '0';
                
                // After animation completes, remove show class
                setTimeout(() => {
                    menu.classList.remove('show');
                    menu.style.display = 'none';
                    // Reset height so it can animate properly next time
                    menu.style.height = '';
                }, 300);
            }
        });
        
        // Reset active state and rotate indicators back
        document.querySelectorAll('.has-dropdown').forEach(link => {
            link.classList.remove('active');
            const indicator = link.querySelector('.dropdown-indicator');
            if (indicator) {
                indicator.classList.remove('rotate');
            }
        });
    }
    
    // Set up dropdown handlers with event delegation
    function setupMobileDropdowns() {
        // Ensure we have indicators first
        addDropdownIndicators();
        
        // Add a single event listener using delegation
        document.addEventListener('click', function(e) {
            // Find if click was on or inside a dropdown link
            const dropdownLink = e.target.closest('.has-dropdown');
            
            if (dropdownLink && isMobile()) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = dropdownLink.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    const isOpen = dropdown.classList.contains('show');
                    const indicator = dropdownLink.querySelector('.dropdown-indicator');
                    
                    // Toggle behavior 
                    if (isOpen) {
                        // Close this dropdown
                        dropdown.style.height = dropdown.scrollHeight + 'px';
                        dropdown.offsetHeight; // Force repaint
                        dropdown.style.height = '0';
                        dropdown.style.opacity = '0';
                        
                        setTimeout(() => {
                            dropdown.classList.remove('show');
                            dropdown.style.display = 'none';
                            dropdown.style.height = '';
                        }, 300);
                        
                        // Update visual state
                        dropdownLink.classList.remove('active');
                        if (indicator) {
                            indicator.classList.remove('rotate');
                        }
                    } else {
                        // Close all dropdowns first
                        closeAllDropdowns();
                        
                        // Open this dropdown with animation
                        dropdown.style.display = 'block';
                        dropdown.classList.add('show');
                        
                        // Set initial height to 0 for animation
                        dropdown.style.height = '0';
                        dropdown.style.opacity = '0';
                        
                        // Force repaint
                        dropdown.offsetHeight;
                        
                        // Animate to full height
                        dropdown.style.height = dropdown.scrollHeight + 'px';
                        dropdown.style.opacity = '1';
                        
                        // Update visual state
                        dropdownLink.classList.add('active');
                        if (indicator) {
                            indicator.classList.add('rotate');
                        }
                    }
                }
            }
        });
    }
    
    // --- 4. Close menu when clicking outside ---
    document.addEventListener('click', function(e) {
        // If mobile menu is open and click is outside
        const menuToggleElement = document.getElementById('menu-toggle');
        const mainNavElement = document.getElementById('main-nav');
        
        if (mainNavElement && mainNavElement.classList.contains('active') && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('#menu-toggle')) {
            
            mainNavElement.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset hamburger icon
            if (menuToggleElement) {
                const spans = menuToggleElement.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            
            // Close any open dropdowns
            closeAllDropdowns();
        }
    });
    
    // --- 5. Handle window resize (with debounce for performance) ---
    const handleResize = debounce(function() {
        // When switching to desktop view
        if (!isMobile()) {
            // Reset any inline styles on dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = '';
                menu.style.height = '';
                menu.style.opacity = '';
                menu.classList.remove('show');
            });
            
            // Reset body overflow (in case menu was open)
            document.body.style.overflow = '';
            
            // Reset main nav
            const mainNavElement = document.getElementById('main-nav');
            if (mainNavElement) {
                mainNavElement.classList.remove('active');
            }
            
            // Reset hamburger icon
            const menuToggleElement = document.getElementById('menu-toggle');
            if (menuToggleElement) {
                const spans = menuToggleElement.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
            
            // Position dropdowns correctly for desktop
            positionDropdownsForDesktop();
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // --- 6. Position dropdowns on desktop ---
    function positionDropdownsForDesktop() {
        if (!isMobile()) {
            document.querySelectorAll('.has-dropdown').forEach(link => {
                const dropdown = link.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    const rect = link.getBoundingClientRect();
                    dropdown.style.top = rect.bottom + 'px';
                    dropdown.style.left = rect.left + 'px';
                }
            });
        }
    }
    
    // --- Rest of the code (chat widget, smooth scrolling, etc.) ---
    
    // Chat widget functionality
    if (chatWidget) {
        chatWidget.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                const chatText = this.querySelector('.chat-text');
                if (chatText) chatText.textContent = 'Contact...';
                
                // Email link
                window.location.href = 'mailto:info@latruitedargent.com?subject=Website Inquiry';
                
                // Reset after delay
                setTimeout(() => {
                    this.classList.remove('active');
                    if (chatText) chatText.textContent = 'Mail ons';
                }, 3000);
            }
        });
    }
    
    // Smooth scrolling for anchor links (using event delegation)
    document.addEventListener('click', function(e) {
        // Find if click was on an anchor link
        const anchor = e.target.closest('a[href^="#"]');
        
        if (anchor && !anchor.classList.contains('has-dropdown')) {
            const targetId = anchor.getAttribute('href');
            
            // Only proceed for valid anchors
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const mainNavElement = document.getElementById('main-nav');
                    if (mainNavElement && mainNavElement.classList.contains('active')) {
                        mainNavElement.classList.remove('active');
                        document.body.style.overflow = '';
                        
                        // Reset hamburger
                        const menuToggleElement = document.getElementById('menu-toggle');
                        if (menuToggleElement) {
                            const spans = menuToggleElement.querySelectorAll('span');
                            spans.forEach(span => {
                                span.style.transform = 'none';
                                span.style.opacity = '1';
                            });
                        }
                    }
                    
                    // Scroll smoothly
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
    
    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (!emailInput.value || !isValidEmail(emailInput.value)) {
                emailInput.style.borderColor = '#c73e3e';
                
                // Show error message
                let errorMsg = this.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#c73e3e';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '5px';
                    this.appendChild(errorMsg);
                }
                errorMsg.textContent = 'Please enter a valid email address';
            } else {
                // Reset styling
                emailInput.style.borderColor = '#8a9681';
                const errorMsg = this.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                
                // Show success message
                const successMsg = document.createElement('p');
                successMsg.className = 'success-message';
                successMsg.style.color = '#4CAF50';
                successMsg.style.fontSize = '14px';
                successMsg.style.marginTop = '10px';
                successMsg.textContent = 'Thank you for subscribing!';
                this.appendChild(successMsg);
                
                // Reset form
                this.reset();
                
                // Remove success message after delay
                setTimeout(() => {
                    const successMsg = this.querySelector('.success-message');
                    if (successMsg) successMsg.remove();
                }, 3000);
            }
        });
    }
    
    // Validate email format
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Lazy loading for images with IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Initialize the mobile dropdown functionality
    setupMobileDropdowns();
    
    // Initial positioning for desktop dropdowns
    positionDropdownsForDesktop();
});