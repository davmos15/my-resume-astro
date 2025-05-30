// Theme Switcher System
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);
        
        // Initialize floating navigation
        this.initFloatingNav();
        
        // Initialize page transitions
        this.initPageTransitions();
        
        // Set up theme menu event listeners
        this.setupThemeMenu();
    }

    setupThemeMenu() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initThemeListeners());
        } else {
            this.initThemeListeners();
        }
    }

    initThemeListeners() {
        // Handle mobile theme toggle click
        const themeToggle = document.querySelector('.theme-toggle');
        const themeDropdown = document.querySelector('.theme-dropdown-menu');
        
        if (themeToggle && themeDropdown) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Only handle click on mobile
                if (window.innerWidth <= 768) {
                    themeDropdown.classList.toggle('show');
                    
                    // Close dropdown when clicking outside
                    const closeDropdown = (event) => {
                        if (!themeToggle.contains(event.target) && !themeDropdown.contains(event.target)) {
                            themeDropdown.classList.remove('show');
                            document.removeEventListener('click', closeDropdown);
                        }
                    };
                    
                    if (themeDropdown.classList.contains('show')) {
                        setTimeout(() => {
                            document.addEventListener('click', closeDropdown);
                        }, 0);
                    }
                }
            });
        }
        
        // Add click listeners to all theme options
        const themeOptions = document.querySelectorAll('.theme-option');
        
        
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = option.getAttribute('data-theme');
                this.changeTheme(theme);
                
                // Update active state
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Close mobile dropdown after selection
                if (window.innerWidth <= 768 && themeDropdown) {
                    themeDropdown.classList.remove('show');
                }
            });
        });

        // Set current theme as active
        const currentOption = document.querySelector(`.theme-option[data-theme="${this.currentTheme}"]`);
        if (currentOption) {
            currentOption.classList.add('active');
        }

        // Add click listeners to accordion headers
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const accordionItem = header.parentElement;
                
                // Check if this item is currently active
                const isActive = accordionItem.classList.contains('active');
                
                // Close all sections first
                const allItems = document.querySelectorAll('.accordion-item');
                allItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // If the clicked item wasn't active, open it
                if (!isActive) {
                    accordionItem.classList.add('active');
                }
            });
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Apply theme-specific body classes and styles
        document.body.className = document.body.className.replace(/theme-\S+/g, '');
        document.body.classList.add(`theme-${theme}`);
        
        // Update CSS variables to ensure text is readable
        this.updateTextColors(theme);
        
        // Update logo for AFL themes
        this.updateLogo(theme);
    }

    updateTextColors(theme) {
        // For themes with gradient backgrounds, ensure proper color application
        if (theme === 'gradient') {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            document.body.style.backgroundAttachment = 'fixed';
        } else if (theme === 'glass') {
            document.body.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)';
            document.body.style.backgroundAttachment = 'fixed';
        } else {
            document.body.style.background = '';
            document.body.style.backgroundAttachment = '';
        }
    }

    updateLogo(theme) {
        const logo = document.getElementById('logo');
        if (!logo) {
            console.error('Logo element not found');
            return;
        }


        // Store original logo path if not already stored
        if (!this.originalLogoSrc) {
            this.originalLogoSrc = logo.src;
        }

        // Check if it's an AFL theme
        if (theme.startsWith('afl-')) {
            // Try to initialize AFL Logo System if not already done
            if (!this.aflLogoSystem && typeof window.AFLLogoSystem !== 'undefined') {
                this.aflLogoSystem = new window.AFLLogoSystem();
            }

            if (this.aflLogoSystem) {
                // Use text-based logo system
                const success = this.aflLogoSystem.updateLogoElement(logo, theme);
                if (success) {
                    logo.style.display = 'none';
                }
            } else {
                console.error('AFL Logo System not available');
                // Fallback: just hide the logo and show team name
                logo.style.display = 'none';
                const teamName = theme.replace('afl-', '').replace(/-/g, ' ').toUpperCase();
                const textLogo = document.createElement('div');
                textLogo.className = 'afl-text-logo';
                textLogo.textContent = teamName.substring(0, 3);
                textLogo.style.cssText = 'width: 45px; height: 45px; background: white; color: var(--nav-bg); display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 8px; font-size: 16px;';
                logo.parentNode.insertBefore(textLogo, logo.nextSibling);
            }
        } else {
            // Revert to original logo
            logo.style.display = '';
            logo.src = this.originalLogoSrc;
            logo.alt = 'Logo';
            
            // Remove any text logos
            const textLogos = document.querySelectorAll('.afl-text-logo, .afl-logo-container');
            textLogos.forEach(el => el.remove());
            
            if (this.aflLogoSystem) {
                this.aflLogoSystem.removeTextLogo(logo);
            }
        }
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('theme', theme);
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    initFloatingNav() {
        const nav = document.querySelector('.topnav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });
    }

    initPageTransitions() {
        // Only init if not on admin pages
        if (window.location.pathname.startsWith('/admin')) return;

        // Handle all navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href || link.href.includes('#') || link.target === '_blank') return;
            if (link.href.includes('admin') || link.href.includes('logout')) return;

            // Check if it's an internal link
            const url = new URL(link.href);
            if (url.origin !== window.location.origin) return;

            e.preventDefault();
            this.transitionToPage(link.href);
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.href, false);
        });
    }

    async transitionToPage(url) {
        const main = document.querySelector('main');
        if (!main) return;

        // Add fade out class
        main.classList.add('page-transition-out');

        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 300));

        // Load new page
        await this.loadPage(url, true);
    }

    async loadPage(url, pushState = true) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update the main content
            const newMain = doc.querySelector('main');
            const currentMain = document.querySelector('main');
            
            if (newMain && currentMain) {
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.classList.remove('page-transition-out');
                currentMain.classList.add('page-transition-in');

                // Update title
                document.title = doc.title;

                // Update URL if needed
                if (pushState) {
                    window.history.pushState({}, '', url);
                }

                // Re-initialize any scripts that need to run on new content
                this.reinitializeScripts();

                // Remove transition class after animation
                setTimeout(() => {
                    currentMain.classList.remove('page-transition-in');
                }, 300);
            }
        } catch (error) {
            // Fallback to regular navigation
            window.location.href = url;
        }
    }

    reinitializeScripts() {
        // Re-run any initialization that needs to happen on new content
        if (window.initializeRichEditors) {
            window.initializeRichEditors();
        }
        
        // Initialize resume features (file cabinet or collapsibles)
        if (window.initializeResumeFeatures) {
            window.initializeResumeFeatures();
        }
        
        // Handle navigation to sections with hash
        if (window.location.hash && window.scrollToSection) {
            const sectionId = window.location.hash.slice(1);
            setTimeout(() => window.scrollToSection(sectionId), 300);
        }
        
        // Ensure dashboard functionality is properly reinitialized
        setTimeout(() => {
            if (window.initDashboard && document.querySelector('#resume-dashboard')) {
                window.initDashboard();
            }
        }, 200);
    }
}

// Initialize theme switcher
const themeSwitcher = new ThemeSwitcher();

// Add smooth transitions CSS
if (!document.querySelector('#theme-transitions')) {
    const style = document.createElement('style');
    style.id = 'theme-transitions';
    style.innerHTML = `
        /* Smooth theme transitions */
        * {
            transition: background-color var(--theme-transition),
                        color var(--theme-transition),
                        border-color var(--theme-transition),
                        box-shadow var(--theme-transition);
        }

        /* Floating nav styles */
        .topnav.nav-scrolled {
            box-shadow: 0 4px 12px var(--nav-shadow);
        }

        /* Page transitions */
        .page-transition-out {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }

        .page-transition-in {
            animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }


        /* Theme menu hover effects */
        .theme-option {
            transition: all 0.2s ease;
        }

        .theme-option:hover {
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(style);
}