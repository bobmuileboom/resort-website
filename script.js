/**
 * La Truite d'Argent - Enhanced Responsive Navigation Script
 * Updated to handle submenu underlines in mobile view
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- Core DOM elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const topSection = document.querySelector('.top-section');
    const emailProtectionBtn = document.getElementById('email-protection');
    
    // --- Email Protection ---
    if (emailProtectionBtn) {
        emailProtectionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Split the email into parts to avoid bots
            const user = 'info';
            const domain = 'la-truite.com';
            // Construct and open the mailto link
            window.location.href = 'mailto:' + user + '@' + domain;
        });
    }
    
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
            topSection.classList.add('sticky');
        } else {
            topSection.style.padding = '20px';
            topSection.style.background = 'linear-gradient(to bottom, rgba(78, 67, 58, 0.9) 0%, rgba(78, 67, 58, 0.65) 60%, rgba(78, 67, 58, 0.2) 100%)';
            topSection.classList.remove('sticky');
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
                
                // FIXED: Show all underlines immediately when menu opens
                setTimeout(() => {
                    document.querySelectorAll('.submenu-underline').forEach(underline => {
                        underline.style.display = 'block';
                        underline.style.opacity = '1';
                    });
                }, 100); // Small delay to ensure menu is open
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = ''; // Allow scrolling
                
                // Close any open dropdowns when closing the menu AND hide underlines
                closeAllDropdowns(true);
            }
        });
    }
    
    // --- 3. FIXED Mobile dropdown handling ---
    
    // Function to close all dropdowns
    function closeAllDropdowns(hideUnderlines = false) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu.classList.contains('show')) {
                // Start closing animation
                menu.style.height = menu.scrollHeight + 'px';
                menu.offsetHeight; // Force repaint
                menu.style.height = '0';
                menu.style.opacity = '0';
                // Do NOT set display:none after animation; keep display:block for layout stability
                setTimeout(() => {
                    menu.classList.remove('show');
                    // menu.style.display = 'none'; // <-- REMOVE THIS LINE
                    // Don't reset height to prevent jump - leave it at 0
                    menu.style.opacity = '';
                }, 300);
            }
        });
        
        // Reset active state for dropdown links
        document.querySelectorAll('.has-dropdown').forEach(link => {
            link.classList.remove('active');
            const indicator = link.querySelector('.dropdown-indicator');
            if (indicator) {
                indicator.classList.remove('rotate');
            }
        });
        
        // Only hide underlines if explicitly requested (when closing entire menu)
        if (hideUnderlines) {
            document.querySelectorAll('.submenu-underline').forEach(underline => {
                underline.style.display = 'none';
                underline.style.opacity = '0';
            });
        }
    }
    
    // Set up dropdown handlers with event delegation
    function setupMobileDropdowns() {
        addDropdownIndicators();
        document.addEventListener('click', function(e) {
            const dropdownLink = e.target.closest('.has-dropdown');
            if (dropdownLink && isMobile()) {
                e.preventDefault();
                e.stopPropagation();
                // Support for optional .submenu-underline between link and menu
                let next = dropdownLink.nextElementSibling;
                let dropdown = null;
                if (next && next.classList.contains('submenu-underline')) {
                    dropdown = next.nextElementSibling;
                } else if (next && next.classList.contains('dropdown-menu')) {
                    dropdown = next;
                }
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    const isOpen = dropdown.classList.contains('show');
                    const indicator = dropdownLink.querySelector('.dropdown-indicator');
                    if (isOpen) {
                        // Close this dropdown with stable animation
                        dropdown.style.height = dropdown.scrollHeight + 'px';
                        dropdown.offsetHeight; // Force repaint
                        dropdown.style.height = '0';
                        dropdown.style.opacity = '0';
                        setTimeout(() => {
                            dropdown.classList.remove('show');
                            dropdown.style.opacity = '';
                        }, 300);
                        // Update visual state
                        dropdownLink.classList.remove('active');
                        if (indicator) indicator.classList.remove('rotate');
                    } else {
                        // Close all dropdowns first (but keep underlines visible)
                        closeAllDropdowns(false);
                        setTimeout(() => {
                            // Open this dropdown with stable animation
                            dropdown.style.display = 'block';
                            dropdown.classList.add('show');
                            dropdown.style.height = '0';
                            dropdown.style.opacity = '0';
                            dropdown.style.visibility = 'visible';
                            dropdown.offsetHeight;
                            dropdown.style.height = dropdown.scrollHeight + 'px';
                            dropdown.style.opacity = '1';
                            dropdownLink.classList.add('active');
                            if (indicator) indicator.classList.add('rotate');
                        }, 50);
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
            
            // Close any open dropdowns AND hide underlines when menu closes
            closeAllDropdowns(true);
        }
    });
    
    // --- 5. FIXED Handle window resize ---
    const handleResize = debounce(function() {
        if (!isMobile()) {
            // Reset styles for desktop
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = '';
                menu.style.height = '';
                menu.style.opacity = '';
                menu.classList.remove('show');
            });
            
            // Hide all underlines in desktop view
            document.querySelectorAll('.submenu-underline').forEach(underline => {
                underline.style.display = 'none';
                underline.style.opacity = '';
            });
            
            // Reset active states
            document.querySelectorAll('.has-dropdown').forEach(link => {
                link.classList.remove('active');
            });
            
            document.body.style.overflow = '';
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
                const underline = link.nextElementSibling;
                const dropdown = underline ? underline.nextElementSibling : null;
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    const rect = link.getBoundingClientRect();
                    dropdown.style.top = rect.bottom + 'px';
                    dropdown.style.left = rect.left + 'px';
                }
            });
        }
    }
    
    // Initialize the mobile dropdown functionality
    setupMobileDropdowns();
    
    // Initial positioning for desktop dropdowns
    positionDropdownsForDesktop();
});