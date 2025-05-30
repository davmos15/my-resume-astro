// Projects App - Pre-compiled version without JSX
(function() {
    'use strict';
    
    // Wait for React to be available
    function waitForReact(callback) {
        if (window.React && window.ReactDOM) {
            callback();
        } else {
            setTimeout(function() {
                waitForReact(callback);
            }, 100);
        }
    }
    
    // Initialize the projects app
    function initProjectsApp() {
        const { useState, useEffect, useRef } = React;
        
        // Project Card Component
        function ProjectCard({ project, onClick }) {
            return React.createElement('div', {
                className: 'project-card',
                onClick: () => onClick(project),
                style: {
                    opacity: 0,
                    animation: `fadeInUp 0.6s forwards`,
                    animationDelay: `${project.id * 0.1}s`
                }
            },
                React.createElement('div', { className: 'project-card-inner' },
                    React.createElement('div', { className: 'project-card-emoji' }, project.emoji),
                    React.createElement('h3', { className: 'project-card-title' }, project.title),
                    React.createElement('p', { className: 'project-card-subtitle' }, project.subtitle || 'Click to learn more'),
                    React.createElement('div', { className: 'project-card-hover-overlay' },
                        React.createElement('span', { className: 'view-project-text' }, 'View Project →')
                    )
                )
            );
        }
        
        // Modal Component
        function ProjectModal({ project, isOpen, onClose }) {
            const modalRef = useRef(null);
            
            useEffect(() => {
                const handleEscape = (e) => {
                    if (e.key === 'Escape' && isOpen) {
                        onClose();
                    }
                };
                
                const handleClickOutside = (e) => {
                    if (modalRef.current && !modalRef.current.contains(e.target)) {
                        onClose();
                    }
                };
                
                if (isOpen) {
                    document.addEventListener('keydown', handleEscape);
                    document.addEventListener('mousedown', handleClickOutside);
                    document.body.style.overflow = 'hidden';
                }
                
                return () => {
                    document.removeEventListener('keydown', handleEscape);
                    document.removeEventListener('mousedown', handleClickOutside);
                    document.body.style.overflow = '';
                };
            }, [isOpen, onClose]);
            
            if (!isOpen || !project) return null;
            
            return React.createElement('div', { className: `project-modal ${isOpen ? 'show' : ''}` },
                React.createElement('div', { className: 'project-modal-content', ref: modalRef },
                    React.createElement('button', { className: 'modal-close', onClick: onClose, 'aria-label': 'Close modal' },
                        React.createElement('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
                            React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
                            React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
                        )
                    ),
                    
                    React.createElement('div', { className: 'modal-header' },
                        React.createElement('div', { className: 'modal-header-content' },
                            React.createElement('span', { className: 'modal-emoji' }, project.emoji),
                            React.createElement('div', null,
                                React.createElement('h2', { className: 'modal-title' }, project.title),
                                React.createElement('p', { className: 'modal-subtitle' }, project.subtitle || 'Project Overview')
                            )
                        )
                    ),
                    
                    React.createElement('div', { className: 'modal-body' },
                        // Overview Section
                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', { className: 'section-title' }, 'Overview'),
                            React.createElement('div', { 
                                className: 'section-content',
                                dangerouslySetInnerHTML: { __html: project.description }
                            })
                        ),
                        
                        // Key Achievements
                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', { className: 'section-title' }, 'Key Achievements'),
                            React.createElement('ul', { className: 'achievements-list' },
                                project.achievements.map((achievement, idx) =>
                                    React.createElement('li', { key: idx, className: 'achievement-item' },
                                        React.createElement('span', { className: 'achievement-icon' }, '✓'),
                                        achievement
                                    )
                                )
                            )
                        ),
                        
                        // Timeline and Team
                        React.createElement('div', { className: 'modal-section stats-section' },
                            React.createElement('div', { className: 'stat-item' },
                                React.createElement('span', { className: 'stat-icon' }, '📅'),
                                React.createElement('div', { className: 'stat-content' },
                                    React.createElement('span', { className: 'stat-label' }, 'Timeline'),
                                    React.createElement('span', { className: 'stat-value' }, project.timeline)
                                )
                            ),
                            React.createElement('div', { className: 'stat-item' },
                                React.createElement('span', { className: 'stat-icon' }, '👥'),
                                React.createElement('div', { className: 'stat-content' },
                                    React.createElement('span', { className: 'stat-label' }, 'Team Size'),
                                    React.createElement('span', { className: 'stat-value' }, 
                                        `${project.team_size} ${project.team_size === 1 ? 'Developer' : 'Developers'}`
                                    )
                                )
                            )
                        ),
                        
                        // Technologies
                        project.technologies && React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', { className: 'section-title' }, 'Technologies Used'),
                            React.createElement('div', { className: 'tech-tags-container' },
                                project.technologies.split(',').map((tech, idx) =>
                                    React.createElement('span', { key: idx, className: 'tech-tag' }, tech.trim())
                                )
                            )
                        ),
                        
                        // Project Image
                        project.image_path && React.createElement('div', { className: 'modal-section' },
                            React.createElement('img', {
                                src: project.image_path,
                                alt: project.title,
                                className: 'project-image'
                            })
                        ),
                        
                        // Links
                        (project.github_link || project.live_link) && React.createElement('div', { className: 'modal-section links-section' },
                            project.github_link && React.createElement('a', {
                                href: project.github_link,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                className: 'project-link github-link'
                            },
                                React.createElement('svg', { className: 'link-icon', viewBox: '0 0 24 24', width: '20', height: '20' },
                                    React.createElement('path', {
                                        fill: 'currentColor',
                                        d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
                                    })
                                ),
                                'View on GitHub'
                            ),
                            
                            project.live_link && React.createElement('a', {
                                href: project.live_link,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                className: 'project-link live-link'
                            },
                                React.createElement('svg', { className: 'link-icon', viewBox: '0 0 24 24', width: '20', height: '20' },
                                    React.createElement('path', {
                                        fill: 'currentColor',
                                        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'
                                    })
                                ),
                                'View Live'
                            )
                        )
                    )
                )
            );
        }
        
        // Main Projects Component
        function ProjectsApp() {
            const [selectedProject, setSelectedProject] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            
            const handleProjectClick = (project) => {
                setSelectedProject(project);
                setIsModalOpen(true);
            };
            
            const handleCloseModal = () => {
                setIsModalOpen(false);
                setTimeout(() => setSelectedProject(null), 300);
            };
            
            return React.createElement(React.Fragment, null,
                React.createElement('div', { className: 'projects-header' },
                    React.createElement('p', { className: 'projects-subtitle' }, 'Click on any project to explore in detail')
                ),
                
                window.projectsData && window.projectsData.length > 0 ?
                    React.createElement('div', { className: 'projects-grid' },
                        window.projectsData.map(project =>
                            React.createElement(ProjectCard, {
                                key: project.id,
                                project: project,
                                onClick: handleProjectClick
                            })
                        )
                    ) :
                    React.createElement('div', { className: 'no-projects' },
                        React.createElement('span', { className: 'no-projects-icon' }, '📁'),
                        React.createElement('p', null, 'No projects have been added yet. Please check back later!')
                    ),
                
                React.createElement(ProjectModal, {
                    project: selectedProject,
                    isOpen: isModalOpen,
                    onClose: handleCloseModal
                })
            );
        }
        
        // Render the app
        const container = document.getElementById('projects-react-root');
        if (container && window.projectsData) {
            try {
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(ProjectsApp));
                console.log('Projects app rendered successfully');
            } catch (error) {
                console.error('Error rendering projects app:', error);
            }
        }
    }
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            waitForReact(initProjectsApp);
        });
    } else {
        waitForReact(initProjectsApp);
    }
    
    // Also try on window load as fallback
    window.addEventListener('load', function() {
        setTimeout(function() {
            const container = document.getElementById('projects-react-root');
            if (container && container.children.length === 0) {
                waitForReact(initProjectsApp);
            }
        }, 1000);
    });
})();