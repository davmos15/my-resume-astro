const TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    const that = this;
    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    const elements = document.getElementsByClassName('typewrite');
    for (let i=0; i<elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-type');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
};

/*code to make the resume boxes expand*/
function initCollapsibles() {
  const coll = document.getElementsByClassName("collapsible");
  let i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCollapsibles);
} else {
  initCollapsibles();
}

/* File Cabinet functionality */
function initFileCabinet() {
  // Initialize drawer handles
  const drawerHandles = document.querySelectorAll('.drawer-handle');
  
  drawerHandles.forEach(handle => {
    handle.addEventListener('click', function() {
      const drawer = this.parentElement;
      drawer.classList.toggle('open');
      
      // Close other drawers if you want only one open at a time
      // Uncomment the following to enable this behavior:
      /*
      const otherDrawers = document.querySelectorAll('.file-drawer');
      otherDrawers.forEach(otherDrawer => {
        if (otherDrawer !== drawer) {
          otherDrawer.classList.remove('open');
        }
      });
      */
    });
  });

  // Initialize file tabs
  const fileTabs = document.querySelectorAll('.file-tab');
  
  fileTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      const drawer = this.closest('.file-drawer');
      
      // Remove active class from all tabs in this drawer
      drawer.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all file contents in this drawer
      drawer.querySelectorAll('.file-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the selected content
      const selectedContent = drawer.querySelector(`#${tabId}`);
      if (selectedContent) {
        selectedContent.classList.add('active');
      }
    });
  });

  // Auto-open first drawer on page load
  const firstDrawer = document.querySelector('.file-drawer');
  if (firstDrawer) {
    setTimeout(() => {
      firstDrawer.classList.add('open');
    }, 300);
  }
}

// Animate numbers function
function animateNumber(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let current = 0;
  const increment = target / 30;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 30);
}

// Dashboard functionality - Updated to open modal
function toggleCard(card) {
  const cardId = card.getAttribute('data-card');
  
  // Function to attempt opening the modal
  const attemptOpenModal = () => {
    if (window.openResumeModal) {
      window.openResumeModal(cardId);
      return true;
    }
    return false;
  };
  
  // Try to open modal immediately
  if (attemptOpenModal()) return;
  
  // If not available, wait for scripts to load
  console.log('Waiting for resume modal to initialize...');
  
  // Check if the modal script is in the DOM but not executed yet
  const modalScript = document.querySelector('script[src*="resume-modal"]');
  if (modalScript) {
    // If script exists, wait a bit for it to execute
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (attemptOpenModal() || attempts > 20) {
        clearInterval(checkInterval);
        if (attempts > 20) {
          console.error('Resume modal failed to initialize');
        }
      }
    }, 50);
  } else {
    // If we're on the resume page, the script should be there
    if (document.querySelector('#resume-dashboard')) {
      console.error('Resume modal script not found on resume page');
    }
  }
}

function toggleSkill(skillId) {
  const content = document.getElementById(`skill-${skillId}`);
  const toggle = document.querySelector(`[data-skill="${skillId}"] .skill-toggle`);
  
  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    toggle.textContent = '+';
  } else {
    content.classList.add('expanded');
    toggle.textContent = '−';
  }
}

function toggleJob(jobIndex) {
  const jobContent = document.getElementById(`job-${jobIndex}`);
  const jobToggle = document.querySelector(`[data-job="${jobIndex}"]`).querySelector('.job-toggle');
  
  if (jobContent.classList.contains('expanded')) {
    jobContent.classList.remove('expanded');
    jobToggle.textContent = '+';
  } else {
    jobContent.classList.add('expanded');
    jobToggle.textContent = '−';
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const cardId = section.getAttribute('data-card');
    if (window.openResumeModal) {
      window.openResumeModal(cardId);
    } else {
      console.warn('openResumeModal not available yet');
      // Try to initialize and retry
      if (typeof initResumeModal === 'function') {
        initResumeModal();
        setTimeout(() => {
          if (window.openResumeModal) {
            window.openResumeModal(cardId);
          }
        }, 100);
      }
    }
  }
}

// Initialize dashboard functionality
function initDashboard() {
  // Animate summary stats
  const stats = document.querySelector('.summary-stats');
  if (stats) {
    setTimeout(() => {
      animateNumber('years-exp', parseInt(stats.dataset.years) || 0);
      animateNumber('companies-count', parseInt(stats.dataset.companies) || 0);
      animateNumber('roles-count', parseInt(stats.dataset.roles) || 0);
    }, 500);
  }
  
  // Clear any existing event listeners to prevent duplicates
  const existingHandlers = document.querySelectorAll('[data-handler-attached]');
  existingHandlers.forEach(el => el.removeAttribute('data-handler-attached'));
  
  // Make entire card clickable (like project cards)
  const dashboardCards = document.querySelectorAll('.dashboard-card:not([data-handler-attached])');
  dashboardCards.forEach(card => {
    card.setAttribute('data-handler-attached', 'true');
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking inside expanded content or on sub-toggles
      if (e.target.closest('.card-content') && this.classList.contains('full-width')) return;
      if (e.target.classList.contains('job-toggle') || e.target.classList.contains('skill-toggle')) return;
      
      toggleCard(this);
    });
  });
  
  // Job item expansion
  const jobHeaders = document.querySelectorAll('.job-header:not([data-handler-attached])');
  jobHeaders.forEach(header => {
    header.setAttribute('data-handler-attached', 'true');
    header.addEventListener('click', function(e) {
      // Don't trigger if clicking on the toggle button itself
      if (e.target.classList.contains('job-toggle')) return;
      
      const jobIndex = this.getAttribute('data-job');
      toggleJob(jobIndex);
    });
  });
  
  // Job toggle buttons
  const jobToggles = document.querySelectorAll('.job-toggle:not([data-handler-attached])');
  jobToggles.forEach(btn => {
    btn.setAttribute('data-handler-attached', 'true');
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent header click
      const jobIndex = this.closest('.job-header').getAttribute('data-job');
      toggleJob(jobIndex);
    });
  });
  
  // Skill section headers clickable
  const skillHeaders = document.querySelectorAll('.clickable-skill-header:not([data-handler-attached])');
  skillHeaders.forEach(header => {
    header.setAttribute('data-handler-attached', 'true');
    header.addEventListener('click', function(e) {
      // Don't trigger if clicking on the toggle button itself
      if (e.target.classList.contains('skill-toggle')) return;
      
      const skillId = this.getAttribute('data-skill');
      toggleSkill(skillId);
    });
  });
  
  // Skill section toggle buttons
  const skillToggles = document.querySelectorAll('.skill-toggle:not([data-handler-attached])');
  skillToggles.forEach(btn => {
    btn.setAttribute('data-handler-attached', 'true');
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const skillId = this.getAttribute('data-skill');
      toggleSkill(skillId);
    });
  });
  
  // Staggered card animation
  const cards = document.querySelectorAll('.dashboard-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
  });
  
  // Handle URL hash navigation
  if (window.location.hash) {
    const sectionId = window.location.hash.slice(1);
    setTimeout(() => scrollToSection(sectionId), 600);
  }
  
  // Add event listeners for dropdown navigation links
  const resumeDropdownLinks = document.querySelectorAll('.dropdown-link[href*="#"]:not([data-handler-attached])');
  resumeDropdownLinks.forEach(link => {
    link.setAttribute('data-handler-attached', 'true');
    link.addEventListener('click', function(e) {
      if (window.location.pathname === '/resume') {
        e.preventDefault();
        const sectionId = this.getAttribute('href').split('#')[1];
        scrollToSection(sectionId);
      } else {
        // If navigating to resume page, ensure dashboard initializes
        setTimeout(() => {
          if (document.querySelector('#resume-dashboard')) {
            initDashboard();
          }
        }, 500);
      }
    });
  });
}

// Expose functions globally for navigation
window.scrollToSection = scrollToSection;
window.toggleCard = toggleCard;
window.toggleJob = toggleJob;
window.toggleSkill = toggleSkill;
window.initDashboard = initDashboard;

// Initialize file cabinet on page load or when content changes
function initializeResumeFeatures() {
  // Add a small delay to ensure DOM is fully loaded
  setTimeout(() => {
    if (document.querySelector('#resume-dashboard')) {
      initDashboard();
    } else if (document.querySelector('.file-cabinet')) {
      initFileCabinet();
    } else if (document.querySelector('.collapsible')) {
      initCollapsibles();
    }
  }, 50);
}

// Update initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeResumeFeatures();
    initializePageFeatures();
  });
} else {
  initializeResumeFeatures();
  initializePageFeatures();
}

// Projects page initialization
function initProjectsPage() {
  const container = document.getElementById('projects-react-root');
  if (!container) return;
  
  // Check if React libraries are loaded
  if (!window.React || !window.ReactDOM) {
    console.log('React libraries not loaded yet, retrying...');
    setTimeout(initProjectsPage, 200);
    return;
  }
  
  // Check if projects data is available
  if (!window.projectsData) {
    console.warn('Projects data not available');
    return;
  }
  
  // Force re-initialization if container is empty
  if (container.children.length === 0) {
    container.removeAttribute('data-react-initialized');
  }
  
  // Check if already initialized
  if (container.hasAttribute('data-react-initialized')) {
    return;
  }
  
  container.setAttribute('data-react-initialized', 'true');
  
  // Use the global React components
  if (window.ProjectsApp) {
    try {
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(window.ProjectsApp));
      console.log('Projects app initialized successfully');
    } catch (error) {
      console.error('Error initializing projects app:', error);
      container.removeAttribute('data-react-initialized');
    }
  } else {
    // If ProjectsApp not available yet, try again
    console.log('ProjectsApp not available yet, retrying...');
    setTimeout(initProjectsPage, 200);
  }
}

// Initialize appropriate features based on current page
function initializePageFeatures() {
  setTimeout(() => {
    if (document.querySelector('#resume-dashboard')) {
      initDashboard();
    } else if (document.querySelector('.file-cabinet')) {
      initFileCabinet();
    } else if (document.querySelector('.collapsible')) {
      initCollapsibles();
    } else if (document.querySelector('#projects-react-root')) {
      initProjectsPage();
    }
  }, 50);
}

// Reinitialize when content changes (for SPA navigation)
window.addEventListener('themechange', () => {
  setTimeout(initializePageFeatures, 100);
});

// Watch for dynamic content being added to DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.id === 'resume-dashboard' || node.querySelector('#resume-dashboard')) {
          setTimeout(() => initDashboard(), 100);
        } else if (node.id === 'projects-react-root' || node.querySelector('#projects-react-root')) {
          setTimeout(() => initProjectsPage(), 100);
        }
      }
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Re-initialize on browser navigation
window.addEventListener('pageshow', function(event) {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    initializePageFeatures();
  }
});

// Re-initialize on popstate (browser back/forward)
window.addEventListener('popstate', initializePageFeatures);

// Special handler for projects page to ensure React loads
window.addEventListener('load', function() {
  // Extra initialization for projects page after full page load
  if (document.querySelector('#projects-react-root')) {
    setTimeout(function() {
      const container = document.getElementById('projects-react-root');
      if (container && container.children.length === 0) {
        console.log('Projects container empty after load, attempting initialization...');
        initProjectsPage();
      }
    }, 500);
  }
  
  // Ensure resume modal is available
  if (document.querySelector('#resume-dashboard') && !window.openResumeModal) {
    console.log('Resume modal not initialized, attempting initialization...');
    if (typeof initResumeModal === 'function') {
      initResumeModal();
    }
  }
});