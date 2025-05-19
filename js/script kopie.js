/**
 * La Truite d'Argent - Complete Responsive Navigation Script (Updated)
 * Fixed for dropdown toggle on mobile - opens on first tap, closes on second tap
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- Core DOM elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const topSection = document.querySelector('.top-section');
    const dropdownLinks = document.querySelectorAll('.has-dropdown');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const chatWidget = document.getElementById('chat-widget');
    
    // --- Utility functions ---
    
    // Check if we're in mobile view
    const isMobile = () => window.innerWidth <= 768;
    
    // --- 1. Header scroll effect ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            topSection.style.padding = '12px 20px';
            topSection.style.background = 'linear-gradient(to bottom, rgba(78, 67, 58, 0.95) 0%, rgba(78, 67, 58, 0.8) 60%, rgba(78, 67, 58, 0.4) 100%)';
        } else {
            topSection.style.padding = '20px';
            topSection.style.background = 'linear-gradient(to bottom, rgba(78, 67, 58, 0.9) 0%, rgba(78, 67, 58, 0.65) 60%, rgba(78, 67, 58, 0.2) 100%)';
        }
    });
    
    // --- 2. Mobile menu toggle (hamburger button) ---
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active class
            mainNav.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
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
    
    // --- 3. Mobile dropdown handling (Improved with toggle behavior) ---
    
    // Function to close all dropdowns
    function closeAllDropdowns() {
        dropdownMenus.forEach(menu => {
            menu.style.display = 'none'; // Explicitly set to none
            menu.classList.remove('show');
        });
        
        // Reset active state on dropdown links
        dropdownLinks.forEach(link => {
            link.classList.remove('active');
        });
    }
    
    // IMPROVED: Set up dropdown handlers with proper toggle behavior
    function setupMobileDropdowns() {
        // Get fresh references
        const currentDropdownLinks = document.querySelectorAll('.has-dropdown');
        
        currentDropdownLinks.forEach(link => {
            // Remove existing listeners by replacing with clone
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add new, more reliable listeners with toggle behavior
            newLink.addEventListener('click', function(e) {
                if (isMobile()) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get the dropdown menu
                    const dropdown = this.nextElementSibling;
                    
                    if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                        // Check if this dropdown is already open
                        const isOpen = dropdown.classList.contains('show');
                        
                        // Close all dropdowns first
                        closeAllDropdowns();
                        
                        // Toggle behavior: if it wasn't open, open it - otherwise leave it closed
                        if (!isOpen) {
                            dropdown.style.display = 'block';
                            dropdown.classList.add('show');
                            this.classList.add('active');
                            console.log('Dropdown opened on tap');
                        } else {
                            console.log('Dropdown closed on tap');
                            // No need to do anything else - closeAllDropdowns() already closed it
                        }
                    }
                }
            });
        });
    }
    
    // Initial setup
    setupMobileDropdowns();
    
    // --- 4. Close menu when clicking outside ---
    document.addEventListener('click', function(e) {
        // Skip if click is on or inside dropdown links/menus
        if (e.target.classList && e.target.classList.contains('has-dropdown')) {
            return;
        }
        
        if (e.target.closest('.dropdown-menu')) {
            return;
        }
        
        // If mobile menu is open and click is outside
        if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            // Close any open dropdowns
            closeAllDropdowns();
        } else if (!e.target.classList || !e.target.classList.contains('has-dropdown')) {
            // If clicking anywhere except dropdown links, close all dropdowns
            closeAllDropdowns();
        }
    });
    
    // --- 5. Handle window resize ---
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // When switching to desktop view
            if (!isMobile()) {
                // Reset any inline styles on dropdowns
                dropdownMenus.forEach(menu => {
                    menu.style.display = '';
                    menu.classList.remove('show');
                });
                
                // Reset body overflow (in case menu was open)
                document.body.style.overflow = '';
                
                // Reset main nav
                mainNav.classList.remove('active');
                
                // Reset hamburger icon
                if (menuToggle) {
                    const spans = menuToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
                
                // Position dropdowns correctly for desktop
                positionDropdownsForDesktop();
            } else {
                // Re-setup mobile dropdowns when going to mobile
                setupMobileDropdowns();
            }
        }, 250);
    });
    
    // --- 6. Position dropdowns on desktop ---
    function positionDropdownsForDesktop() {
        if (!isMobile()) {
            const currentDropdownLinks = document.querySelectorAll('.has-dropdown');
            currentDropdownLinks.forEach(link => {
                const dropdown = link.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    const rect = link.getBoundingClientRect();
                    dropdown.style.top = rect.bottom + 'px';
                    dropdown.style.left = rect.left + 'px';
                }
            });
        }
    }
    
    // Initial positioning for desktop dropdowns
    positionDropdownsForDesktop();
    
    // --- Remaining functions (chat widget, smooth scrolling, etc.) remain unchanged ---
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip dropdown links - they've been handled separately
        if (anchor.classList.contains('has-dropdown')) {
            return;
        }
        
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only proceed for valid anchors
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        document.body.style.overflow = '';
                        
                        // Reset hamburger
                        if (menuToggle) {
                            const spans = menuToggle.querySelectorAll('span');
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
        });
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
    
    // Lazy loading for images
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
});