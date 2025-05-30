// Resume modal functionality
function initResumeModal() {
    const modal = document.getElementById('resume-modal');
    if (!modal) {
        console.warn('Resume modal element not found');
        return;
    }
    
    const modalClose = document.querySelector('.resume-modal .modal-close');
    const modalIcon = document.querySelector('.resume-modal .modal-icon');
    const modalTitle = document.querySelector('.resume-modal .modal-title');
    const modalBody = document.querySelector('.resume-modal .modal-body');
    
    if (!modalClose || !modalIcon || !modalTitle || !modalBody) {
        console.warn('Resume modal elements not fully loaded');
        return;
    }
    
    // Store original content
    const cardContents = {};
    document.querySelectorAll('.dashboard-card').forEach(card => {
        const cardId = card.getAttribute('data-card');
        const content = card.querySelector('.card-content').innerHTML;
        const icon = card.querySelector('.card-icon').textContent;
        const title = card.querySelector('.card-title').textContent;
        cardContents[cardId] = { content, icon, title };
    });
    
    // Open modal function
    window.openResumeModal = function(cardId) {
        const data = cardContents[cardId];
        if (!data) return;
        
        modalIcon.textContent = data.icon;
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Re-initialize sub-section toggles in modal
        initModalToggles();
    };
    
    // Close modal function
    function closeResumeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Initialize toggles within modal
    function initModalToggles() {
        // Job toggles
        const jobHeaders = modalBody.querySelectorAll('.job-header');
        jobHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                if (e.target.classList.contains('job-toggle')) return;
                const jobIndex = this.getAttribute('data-job');
                toggleModalJob(jobIndex);
            });
        });
        
        const jobToggles = modalBody.querySelectorAll('.job-toggle');
        jobToggles.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const jobIndex = this.closest('.job-header').getAttribute('data-job');
                toggleModalJob(jobIndex);
            });
        });
        
        // Skill toggles
        const skillHeaders = modalBody.querySelectorAll('.clickable-skill-header');
        skillHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                if (e.target.classList.contains('skill-toggle')) return;
                const skillId = this.getAttribute('data-skill');
                toggleModalSkill(skillId);
            });
        });
        
        const skillToggles = modalBody.querySelectorAll('.skill-toggle');
        skillToggles.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const skillId = this.getAttribute('data-skill');
                toggleModalSkill(skillId);
            });
        });
    }
    
    // Toggle functions for modal content
    function toggleModalJob(jobIndex) {
        const jobContent = modalBody.querySelector(`#job-${jobIndex}`);
        const jobToggle = modalBody.querySelector(`[data-job="${jobIndex}"] .job-toggle`);
        
        if (jobContent && jobToggle) {
            if (jobContent.classList.contains('expanded')) {
                jobContent.classList.remove('expanded');
                jobToggle.textContent = '+';
            } else {
                jobContent.classList.add('expanded');
                jobToggle.textContent = '−';
            }
        }
    }
    
    function toggleModalSkill(skillId) {
        const content = modalBody.querySelector(`#skill-${skillId}`);
        const toggle = modalBody.querySelector(`[data-skill="${skillId}"].skill-toggle`);
        
        if (content && toggle) {
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                toggle.textContent = '+';
            } else {
                content.classList.add('expanded');
                toggle.textContent = '−';
            }
        }
    }
    
    // Event listeners
    modalClose.addEventListener('click', closeResumeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeResumeModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeResumeModal();
        }
    });
    
    console.log('Resume modal initialized successfully');
}

// Make function globally available
window.initResumeModal = initResumeModal;

// Initialize when DOM is ready or on demand
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.querySelector('#resume-dashboard')) {
            initResumeModal();
        }
    });
} else {
    if (document.querySelector('#resume-dashboard')) {
        initResumeModal();
    }
}