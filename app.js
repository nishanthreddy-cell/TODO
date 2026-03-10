// App State
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const categoryInput = document.getElementById('category-input');
const dateInput = document.getElementById('date-input');

// Initialize app
function init() {
    // Phase 4: Load from localStorage
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
        try {
            const parsed = JSON.parse(savedTasks);
            if (Array.isArray(parsed)) {
                const seenIds = new Set();
                tasks = parsed.map((task) => {
                    const isValidId = typeof task.id === 'string' && task.id.trim().length > 0 && !seenIds.has(task.id);
                    const id = isValidId ? task.id : generateId();
                    seenIds.add(id);

                    return {
                        ...task,
                        id,
                        category: task.category || 'General'
                    };
                });
            } else {
                tasks = [];
            }
        } catch (e) {
            console.error('Failed to parse tasks from localStorage', e);
            tasks = [];
        }
    }

    // Initial Render
    renderTasks();

    // Restore saved theme (dark is the default).
    loadTheme();

    // Attach Event Listeners
    setupEventListeners();
}

// Generate unique ID
const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

// Event Listeners
function setupEventListeners() {
    // Phase 2: Add tasks
    addBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTask();
    });

    // Phase 3: Toggle & Delete
    todoList.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;

        const id = item.dataset.id;

        if (e.target.closest('.delete-btn')) {
            deleteTask(id);
        } else if (e.target.closest('.checkbox-container') || e.target.closest('.task-main')) {
            toggleTaskStatus(id);
        }
    });

    // Phase 5: Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set current filter
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Clear completed
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveAndRender();
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function applyTheme(theme) {
    const isLight = theme === 'light';
    document.body.setAttribute('data-theme', isLight ? 'light' : 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', String(isLight));
        themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        const icon = themeToggleBtn.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = isLight ? '☾' : '☀';
        }
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('todo-theme');
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('todo-theme', nextTheme);
}

function handleAddTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: generateId(),
        text: text,
        completed: false,
        category: categoryInput ? categoryInput.value : 'General',
        dueDate: dateInput ? dateInput.value : null
    };

    tasks.push(newTask);
    taskInput.value = '';
    if (dateInput) dateInput.value = '';
    taskInput.focus();

    saveAndRender();
}

function toggleTaskStatus(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function saveAndRender() {
    // Phase 4: Save to localStorage
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    renderTasks();
}

function createTaskHTML(task) {
    const dateDisplay = task.dueDate ? formatDate(task.dueDate) : '';
    const dateClass = task.dueDate ? (isOverdue(task.dueDate, task.completed) ? 'overdue' : '') : '';
    
    return `
        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="checkbox-container" aria-label="Toggle completion"></div>
            <div class="task-main">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-meta">
                    <span class="task-category">${escapeHtml(task.category || 'General')}</span>
                    ${dateDisplay ? `<span class="task-date ${dateClass}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        ${dateDisplay}
                    </span>` : ''}
                </div>
            </div>
            <button class="delete-btn" aria-label="Delete task">✕</button>
        </li>
    `;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    if (dateOnly.getTime() === today.getTime()) return 'Today';
    if (dateOnly.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function isOverdue(dateString, completed) {
    if (!dateString || completed) return false;
    const dueDate = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

// Rendering Logic
function renderTasks() {
    // 1. Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // 2. Map tasks to HTML & Update DOM
    todoList.innerHTML = filteredTasks.map(createTaskHTML).join('');

    // 4. Update empty state visibility
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // 5. Update stats
    const activeCount = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
}

// Start application
init();
