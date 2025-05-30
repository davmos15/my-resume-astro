class RichEditor {
    constructor(textareaId) {
        this.textarea = document.getElementById(textareaId);
        this.editorId = textareaId;
        this.isPreviewMode = false;
        this.history = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.createEditor();
        this.setupEventListeners();
        this.saveState();
    }

    createEditor() {
        const wrapper = document.createElement('div');
        wrapper.className = 'rich-editor-wrapper';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'rich-editor-toolbar';
        toolbar.innerHTML = `
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-action="bold" title="Bold (Ctrl+B)"><b>B</b></button>
                <button type="button" class="toolbar-btn" data-action="italic" title="Italic (Ctrl+I)"><i>I</i></button>
                <button type="button" class="toolbar-btn" data-action="underline" title="Underline (Ctrl+U)"><u>U</u></button>
            </div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-action="h1" title="Heading 1">H1</button>
                <button type="button" class="toolbar-btn" data-action="h2" title="Heading 2">H2</button>
                <button type="button" class="toolbar-btn" data-action="h3" title="Heading 3">H3</button>
                <button type="button" class="toolbar-btn" data-action="paragraph" title="Paragraph">P</button>
            </div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-action="ul" title="Bullet List">• List</button>
                <button type="button" class="toolbar-btn" data-action="ol" title="Numbered List">1. List</button>
                <button type="button" class="toolbar-btn" data-action="link" title="Insert Link">🔗</button>
            </div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-action="undo" title="Undo (Ctrl+Z)">↶</button>
                <button type="button" class="toolbar-btn" data-action="redo" title="Redo (Ctrl+Y)">↷</button>
            </div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn toggle-btn" data-action="toggle" title="Toggle HTML/Preview">
                    <span class="html-mode">HTML</span>
                    <span class="preview-mode" style="display: none;">Preview</span>
                </button>
            </div>
        `;

        // Create editor container
        const editorContainer = document.createElement('div');
        editorContainer.className = 'rich-editor-container';

        // Create preview div
        const previewDiv = document.createElement('div');
        previewDiv.className = 'rich-editor-preview';
        previewDiv.style.display = 'none';
        previewDiv.contentEditable = true;

        // Wrap everything
        this.textarea.parentNode.insertBefore(wrapper, this.textarea);
        wrapper.appendChild(toolbar);
        wrapper.appendChild(editorContainer);
        editorContainer.appendChild(this.textarea);
        editorContainer.appendChild(previewDiv);

        this.toolbar = toolbar;
        this.previewDiv = previewDiv;
        this.wrapper = wrapper;

        // Add CSS classes
        this.textarea.classList.add('rich-editor-textarea');
    }

    setupEventListeners() {
        // Toolbar button clicks
        this.toolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn') || e.target.parentNode.classList.contains('toolbar-btn')) {
                e.preventDefault();
                const btn = e.target.classList.contains('toolbar-btn') ? e.target : e.target.parentNode;
                const action = btn.dataset.action;
                
                if (action === 'toggle') {
                    this.toggleMode();
                } else if (action === 'undo') {
                    this.undo();
                } else if (action === 'redo') {
                    this.redo();
                } else {
                    this.executeCommand(action);
                }
            }
        });

        // Keyboard shortcuts
        const handleKeyboard = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        this.executeCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.executeCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.executeCommand('underline');
                        break;
                    case 'z':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.redo();
                        } else {
                            e.preventDefault();
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                }
            }
        };

        this.textarea.addEventListener('keydown', handleKeyboard);
        this.previewDiv.addEventListener('keydown', handleKeyboard);

        // Save state on changes
        this.textarea.addEventListener('input', () => {
            this.debounceState();
            if (this.isPreviewMode) {
                this.updatePreview();
            }
        });

        this.previewDiv.addEventListener('input', () => {
            this.syncFromPreview();
            this.debounceState();
        });

        // Focus management
        this.previewDiv.addEventListener('blur', () => {
            this.syncFromPreview();
        });
    }

    executeCommand(action) {
        this.saveState();

        if (this.isPreviewMode) {
            this.executePreviewCommand(action);
        } else {
            this.executeHtmlCommand(action);
        }
    }

    executeHtmlCommand(action) {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const selectedText = this.textarea.value.substring(start, end);
        let replacement = '';

        switch(action) {
            case 'bold':
                replacement = `<strong>${selectedText || 'Bold text'}</strong>`;
                break;
            case 'italic':
                replacement = `<em>${selectedText || 'Italic text'}</em>`;
                break;
            case 'underline':
                replacement = `<u>${selectedText || 'Underlined text'}</u>`;
                break;
            case 'h1':
                replacement = `<h1>${selectedText || 'Heading 1'}</h1>`;
                break;
            case 'h2':
                replacement = `<h2>${selectedText || 'Heading 2'}</h2>`;
                break;
            case 'h3':
                replacement = `<h3>${selectedText || 'Heading 3'}</h3>`;
                break;
            case 'paragraph':
                replacement = `<p>${selectedText || 'Paragraph text'}</p>`;
                break;
            case 'ul':
                replacement = `<ul>\n  <li>${selectedText || 'List item 1'}</li>\n  <li>List item 2</li>\n</ul>`;
                break;
            case 'ol':
                replacement = `<ol>\n  <li>${selectedText || 'List item 1'}</li>\n  <li>List item 2</li>\n</ol>`;
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) {
                    replacement = `<a href="${url}">${selectedText || 'Link text'}</a>`;
                } else {
                    return;
                }
                break;
            default:
                return;
        }

        this.insertText(replacement, start, end);
    }

    executePreviewCommand(action) {
        document.execCommand('styleWithCSS', false, true);
        
        switch(action) {
            case 'bold':
                document.execCommand('bold');
                break;
            case 'italic':
                document.execCommand('italic');
                break;
            case 'underline':
                document.execCommand('underline');
                break;
            case 'h1':
                document.execCommand('formatBlock', false, 'h1');
                break;
            case 'h2':
                document.execCommand('formatBlock', false, 'h2');
                break;
            case 'h3':
                document.execCommand('formatBlock', false, 'h3');
                break;
            case 'paragraph':
                document.execCommand('formatBlock', false, 'p');
                break;
            case 'ul':
                document.execCommand('insertUnorderedList');
                break;
            case 'ol':
                document.execCommand('insertOrderedList');
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
        }
        
        this.syncFromPreview();
    }

    insertText(replacement, start, end) {
        this.textarea.value = this.textarea.value.substring(0, start) + replacement + this.textarea.value.substring(end);
        this.textarea.focus();
        this.textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }

    toggleMode() {
        this.isPreviewMode = !this.isPreviewMode;
        
        const htmlModeSpan = this.toolbar.querySelector('.html-mode');
        const previewModeSpan = this.toolbar.querySelector('.preview-mode');
        
        if (this.isPreviewMode) {
            // Switch to preview mode
            this.textarea.style.display = 'none';
            this.previewDiv.style.display = 'block';
            this.updatePreview();
            this.previewDiv.focus();
            htmlModeSpan.style.display = 'none';
            previewModeSpan.style.display = 'inline';
        } else {
            // Switch to HTML mode
            this.syncFromPreview();
            this.previewDiv.style.display = 'none';
            this.textarea.style.display = 'block';
            this.textarea.focus();
            htmlModeSpan.style.display = 'inline';
            previewModeSpan.style.display = 'none';
        }
    }

    updatePreview() {
        this.previewDiv.innerHTML = this.textarea.value;
    }

    syncFromPreview() {
        if (this.isPreviewMode) {
            this.textarea.value = this.previewDiv.innerHTML;
        }
    }

    saveState() {
        const state = this.textarea.value;
        
        // Remove states after current index (for redo functionality)
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    debounceState() {
        clearTimeout(this.stateTimeout);
        this.stateTimeout = setTimeout(() => {
            this.saveState();
        }, 500);
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.textarea.value = this.history[this.historyIndex];
            if (this.isPreviewMode) {
                this.updatePreview();
            }
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.textarea.value = this.history[this.historyIndex];
            if (this.isPreviewMode) {
                this.updatePreview();
            }
        }
    }
}

// Auto-initialize editors
document.addEventListener('DOMContentLoaded', function() {
    // Find all textareas with editor-textarea class
    const editorTextareas = document.querySelectorAll('.editor-textarea');
    editorTextareas.forEach(textarea => {
        new RichEditor(textarea.id);
    });
});