    /**
 * Student Life OS - JavaScript
 * 
 * This file contains Tailwind CSS configuration and custom JavaScript functionality.
 */

// ============================================
// TAILWIND CSS CONFIGURATION
// ============================================

tailwind.config = {
    theme: {
        extend: {
            colors: {
                "primary": "#4647d3",
                "on-background": "#2c2f31",
                "outline-variant": "#abadaf",
                "on-secondary-fixed-variant": "#7511c3",
                "tertiary-container": "#fdc425",
                "on-tertiary-container": "#574000",
                "tertiary": "#745700",
                "outline": "#747779",
                "surface-bright": "#f5f7f9",
                "primary-dim": "#3939c7",
                "on-surface-variant": "#595c5e",
                "surface-variant": "#d9dde0",
                "on-primary": "#f4f1ff",
                "surface-container-highest": "#d9dde0",
                "background": "#f5f7f9",
                "tertiary-fixed": "#fdc425",
                "secondary-fixed-dim": "#dbb4ff",
                "on-tertiary": "#fff1da",
                "inverse-surface": "#0b0f10",
                "on-tertiary-fixed": "#3f2e00",
                "secondary-fixed": "#e5c6ff",
                "secondary-container": "#e5c6ff",
                "error-container": "#f74b6d",
                "surface-dim": "#d0d5d8",
                "inverse-primary": "#8083ff",
                "surface-container": "#e5e9eb",
                "inverse-on-surface": "#9a9d9f",
                "error": "#b41340",
                "error-dim": "#a70138",
                "surface-tint": "#4647d3",
                "primary-fixed": "#9396ff",
                "surface": "#f5f7f9",
                "on-error-container": "#510017",
                "on-primary-container": "#0a0081",
                "surface-container-lowest": "#ffffff",
                "on-primary-fixed": "#000000",
                "on-tertiary-fixed-variant": "#624900",
                "secondary": "#8126cf",
                "on-secondary-container": "#6900b4",
                "primary-fixed-dim": "#8387ff",
                "secondary-dim": "#740ec2",
                "surface-container-high": "#dfe3e6",
                "on-error": "#ffefef",
                "surface-container-low": "#eef1f3",
                "on-secondary-fixed": "#4f0089",
                "on-surface": "#2c2f31",
                "on-primary-fixed-variant": "#0e009d",
                "tertiary-dim": "#654c00",
                "tertiary-fixed-dim": "#edb60f",
                "on-secondary": "#fbefff",
                "primary-container": "#9396ff"
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Inter"],
                "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
        },
    },
}

// ============================================
// TASK MANAGEMENT FUNCTIONALITY
// ============================================

// Task data structure
let tasks = [];
let currentFilter = 'all';
let selectedTaskId = null;

// Get today's date in ISO format
function getTodayISO() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Get tomorrow's date in ISO format
function getTomorrowISO() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// Format date for display
function formatDateDisplay(dateStr) {
    if (!dateStr) return 'No deadline set';
    const date = new Date(dateStr);
    
    if (dateStr === getTodayISO()) {
        return 'Today';
    } else if (dateStr === getTomorrowISO()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function getProfile() {
    try {
        const stored = localStorage.getItem('profileOS');

        if (stored) {
            const parsed = JSON.parse(stored);

            return {
                name: parsed.name || '',
                avatar: parsed.avatar || 'https://ui-avatars.com/api/?name=User&background=9396ff&color=ffffff'
            };
        }
    } catch (e) {
        console.log('Corrupted profile data, resetting...');
        localStorage.removeItem('profileOS');
    }

    return {
        name: '',
        avatar: 'https://ui-avatars.com/api/?name=User&background=9396ff&color=ffffff'
    };
}

function initProfilePage() {
    const nameInput = document.getElementById('profile-name-input');
    const avatarPreview = document.getElementById('profile-avatar-preview');
    const form = document.getElementById('profile-form');

    if (!nameInput || !form) return;

    const profile = getProfile();

    // Load profile
    nameInput.value = profile.name || '';
    if (avatarPreview) avatarPreview.src = profile.avatar;

    // Save on submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedProfile = {
            name: nameInput.value.trim(),
            avatar: avatarPreview.src
        };

        saveProfile(updatedProfile);

        alert('Profile saved!');
    });
}

function applyProfileGlobally() {
    const profile = getProfile();

    const nameEl = document.getElementById('dashboard-profile-name');
    const avatarEl = document.getElementById('dashboard-profile-avatar');

   if (nameEl) {
    nameEl.textContent = profile.name && profile.name.trim() !== '' 
        ? profile.name 
        : 'Welcome!';
}

    if (avatarEl) {
        avatarEl.src = profile.avatar;
    }
}

function saveProfile(profile) {
    localStorage.setItem('profileOS', JSON.stringify(profile));
}

// Default tasks for initialization
const defaultTasks = [
    {
        id: 1,
        title: 'Welcome to Taskify! Stay organized. Stay Focused. Get things Done.',
        priority: 'easy',
        status: 'In Progress',
        deadline: getTodayISO(),
        completed: false,
        notes: 'Manage your tasks across all pages. Click on a task for details and notes. Use the wheel to pick a random task!'
    }
];

// Load tasks from localStorage or use defaults
function loadTasks() {
    const stored = localStorage.getItem('tasksOS');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        tasks = [...defaultTasks];
        saveTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasksOS', JSON.stringify(tasks));
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize task management if on tasks page
    initTaskManager();
    
    // Initialize home page task management
    initHomeTaskManager();
    
    // Initialize calendar if on calendar page
    initCalendar();
    
    // Initialize profile page
    initProfilePage();
    
    // Initialize mood tracker
    initMoodTracker();
    
    // Apply profile globally across all pages
    applyProfileGlobally();
    
    // Update dashboard stats if on home page
    updateDashboardStats();
    
    // Update Tasks Today count
    updateTasksTodayCount();
    

    
    // Initialize navigation active state
    initNavigation();
    
    // Initialize wheel
    initWheel();

    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
        spinBtn.addEventListener('click', spinWheel);
    }
    
    // Re-render wheel when tasks change
    const tasksContainer = document.getElementById('tasks-container');
    if (tasksContainer) {
        // Watch for task changes using MutationObserver
        const observer = new MutationObserver(() => {
            renderWheelSegments();
        });
        observer.observe(tasksContainer, { childList: true, subtree: true });
    }
});

// ============================================
// HOME PAGE TASK MANAGER
// ============================================

function initHomeTaskManager() {
    // Only run on home page (index.html), not on tasks.html
    const isTasksPage = document.getElementById('task-form');
    if (isTasksPage) return; // Skip home page init if we're on tasks page
    
    const tasksContainer = document.getElementById('tasks-container');
    const newTaskInput = document.getElementById('new-task-input');
    const newTaskPriority = document.getElementById('new-task-priority');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    // Load tasks from localStorage
    loadTasks();
    
    // Render home page tasks
    renderHomeTasks();
    
    // Handle add task button click
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const taskText = newTaskInput.value.trim();
            const priority = newTaskPriority ? newTaskPriority.value.toLowerCase() : 'medium';
            if (taskText) {
                addHomeTask(taskText, priority);
                newTaskInput.value = '';
            }
        });
    }
    
    // Handle Enter key on input
    if (newTaskInput) {
        newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const taskText = newTaskInput.value.trim();
                const priority = newTaskPriority ? newTaskPriority.value.toLowerCase() : 'medium';
                if (taskText) {
                    addHomeTask(taskText, priority);
                    newTaskInput.value = '';
                }
            }
        });
    }
    
    // Setup event delegation for home page tasks
    setupHomeTaskListeners();
}

// Setup event listeners for home page tasks
function setupHomeTaskListeners() {
    const tasksContainer = document.getElementById('tasks-container');
    if (!tasksContainer) return;
    
    // Handle task completion buttons
    tasksContainer.addEventListener('click', (e) => {
        const completeBtn = e.target.closest('.complete-task-btn');
        if (completeBtn) {
            const taskItem = e.target.closest('.task-item');
            if (taskItem) {
                const taskId = parseInt(taskItem.dataset.taskId);
                toggleHomeTaskComplete(taskId);
            }
        }
        
        const deleteBtn = e.target.closest('.delete-task-btn');
        if (deleteBtn) {
            const taskItem = e.target.closest('.task-item');
            if (taskItem) {
                const taskId = parseInt(taskItem.dataset.taskId);
                deleteHomeTask(taskId);
            }
        }
    });
}

// Render home page tasks from shared localStorage
function renderHomeTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    if (!tasksContainer) return;
    
    tasksContainer.innerHTML = '';
    
    // Get active (non-completed) tasks, sorted by priority
    const activeTasks = tasks
        .filter(t => !t.completed)
        .sort((a, b) => {
            const priorityOrder = { hard: 0, medium: 1, easy: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, 5); // Show max 5 tasks on home page
    
    if (activeTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="text-center py-8 text-on-surface-variant">
                <p>No active tasks. Add one above!</p>
            </div>
        `;
    } else {
        activeTasks.forEach(task => {
            const taskEl = createHomeTaskElement(task);
            tasksContainer.appendChild(taskEl);
        });
    }
    
    updateHomeTaskCount();
}

// Create home task element
function createHomeTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'group task-item flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-bright transition-all';
    div.dataset.taskId = task.id;
    
    const priorityClasses = {
        'hard': 'bg-error-container/20 text-error',
        'medium': 'bg-tertiary-container/20 text-on-tertiary-container',
        'easy': 'bg-primary-container/20 text-primary'
    };
    
    div.innerHTML = `
        <div class="flex-1">
            <h4 class="font-headline font-bold text-on-surface">${escapeHtml(task.title)}</h4>
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityClasses[task.priority] || priorityClasses.easy}">${capitalizeFirst(task.priority)}</span>
        </div>
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-2 text-on-surface-variant hover:text-primary transition-colors complete-task-btn">
                <span class="material-symbols-outlined">check_circle</span>
            </button>
            <button class="p-2 text-on-surface-variant hover:text-error transition-colors delete-task-btn">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </div>
    `;
    
    return div;
}

// Add new task to home page (syncs with task manager)
function addHomeTask(taskText, priority = 'medium') {
    const newTask = {
        id: Date.now(),
        title: taskText,
        priority: priority,
        status: 'todo',
        deadline: getTomorrowISO(),
        completed: false,
        completedAt: null,
        notes: ''
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderHomeTasks();
    updateTasksTodayCount();
    
    // Re-render wheel when task is added
    if (window.renderWheelSegments) {
        window.renderWheelSegments();
    }
}

// Toggle task completion on home page
function toggleHomeTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'todo';
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderHomeTasks();
        updateTasksTodayCount();
        updateDashboardStats();
        
        // Re-render wheel when task completion status changes
        if (window.renderWheelSegments) {
            window.renderWheelSegments();
        }
    }
}

// Delete task from home page
function deleteHomeTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderHomeTasks();
    updateTasksTodayCount();
    updateDashboardStats();
    
    // Re-render wheel when task is deleted
    if (window.renderWheelSegments) {
        window.renderWheelSegments();
    }
}

// Update remaining task count on home page
function updateHomeTaskCount() {
    const tasksContainer = document.getElementById('tasks-container');
    if (!tasksContainer) return;
    
    const remaining = tasks.filter(t => !t.completed).length;
    
    // Update "Today's Missions" remaining counter
    const countBadge = tasksContainer.parentElement?.querySelector('.bg-primary\\/10');
    if (countBadge) {
        countBadge.textContent = `${remaining} Remaining`;
    }
    
    // Update "Tasks Today" in profile section
    const tasksTodayCount = document.getElementById('tasks-today-count');
    if (tasksTodayCount) {
        tasksTodayCount.textContent = remaining.toString().padStart(2, '0');
    }
}

// Task Manager Initialization
function initTaskManager() {
    const taskForm = document.getElementById('task-form');
    const quickAddInput = document.getElementById('quick-add-input');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const tasksContainer = document.getElementById('tasks-container');
    
    // Only run on tasks page (has task-form and tasks-container)
    if (!taskForm || !tasksContainer) return;
    
    // Load tasks from localStorage
    loadTasks();
    
    // Set default filter to show all tasks
    currentFilter = 'all';
    
    // Setup event listeners
    // Handle quick add form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = quickAddInput.value.trim();
        if (taskText) {
            const priority = document.getElementById('task-priority')?.value || 'easy';
            const deadline = document.getElementById('task-deadline')?.value || null;
            
            addTask(taskText, priority, deadline);
            quickAddInput.value = '';
            
            // Reset form selections
            if (document.getElementById('task-priority')) document.getElementById('task-priority').value = 'easy';
            if (document.getElementById('task-deadline')) document.getElementById('task-deadline').value = '';
        }
    });
    
    // Handle inline quick add (Enter key)
    if (quickAddInput) {
        quickAddInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const taskText = quickAddInput.value.trim();
                if (taskText) {
                    const priority = document.getElementById('task-priority')?.value || 'easy';
                    const deadline = document.getElementById('task-deadline')?.value || null;
                    
                    addTask(taskText, priority, deadline);
                    quickAddInput.value = '';
                }
            }
        });
    }
    
    // Setup close panel button
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', closeDetailPanel);
    }
    
    // Setup sidebar filter buttons
    setupFilterButtons();
    
    // Initial render of tasks - MUST happen after all setup
    renderTasks();
    
    // Update task count
    updateTaskCount();
}

// Update home page tasks
function updateHomeTasks() {
    const homeTasksContainer = document.getElementById('tasks-container');
    if (!homeTasksContainer) return;
    
    // Get non-completed tasks for home page
    const activeTasks = tasks.filter(t => !t.completed).slice(0, 5);
    
    // Update any task count displays on home page
    const remainingCount = tasks.filter(t => !t.completed).length;
    const remainingEl = homeTasksContainer.parentElement?.querySelector('.bg-primary\\/10');
    if (remainingEl) {
        remainingEl.textContent = `${remainingCount} Remaining`;
    }
}

// Setup sidebar filter buttons
function setupFilterButtons() {
    const filterAll = document.getElementById('filter-all');
    const filterPriority = document.getElementById('filter-priority');
    const filterDueToday = document.getElementById('filter-due-today');
    
    if (filterAll) {
        filterAll.addEventListener('click', (e) => {
            e.preventDefault();
            filterTasks('all');
        });
    }
    
    if (filterPriority) {
        filterPriority.addEventListener('click', (e) => {
            e.preventDefault();
            filterTasks('priority');
        });
    }
    
    if (filterDueToday) {
        filterDueToday.addEventListener('click', (e) => {
            e.preventDefault();
            filterTasks('due-today');
        });
    }
}

// Filter tasks by type
function filterTasks(type) {
    currentFilter = type;
    
    // Update active state styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
        btn.classList.add('text-slate-600');
        btn.querySelector('span.material-symbols-outlined')?.style.removeProperty('font-variation-settings');
    });
    
    const activeBtn = document.getElementById(`filter-${type}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
        activeBtn.classList.remove('text-slate-600');
        const icon = activeBtn.querySelector('span.material-symbols-outlined');
        if (icon) {
            icon.style.fontVariationSettings = "'FILL' 1";
        }
    }
    
    renderTasks();
}

// Get filtered and sorted tasks based on current filter
function getFilteredTasks() {
    let filteredTasks = [...tasks];
    
    switch (currentFilter) {
        case 'priority':
            // Filter to non-completed tasks and sort by priority (hard first, then medium, then easy)
            filteredTasks = filteredTasks.filter(t => !t.completed);
            filteredTasks.sort((a, b) => {
                const priorityOrder = { hard: 0, medium: 1, easy: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        case 'due-today':
            // Filter to tasks due today, or closest deadline if none today
            const today = getTodayISO();
            const todayTasks = filteredTasks.filter(t => t.deadline === today && !t.completed);
            if (todayTasks.length > 0) {
                filteredTasks = todayTasks;
            } else {
                // Get tasks with deadlines, sorted by closest
                filteredTasks = filteredTasks
                    .filter(t => t.deadline && !t.completed)
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            }
            break;
        case 'all':
        default:
            // Show all tasks including completed, sorted by priority
            filteredTasks.sort((a, b) => {
                // Completed tasks go to bottom
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                const priorityOrder = { hard: 0, medium: 1, easy: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
    }
    
    return filteredTasks;
}

// Render all tasks to the page
function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    
    if (!tasksContainer) return;
    
    // Clear existing tasks
    tasksContainer.innerHTML = '';
    
    // Get filtered tasks using the new filter logic
    let filteredTasks = getFilteredTasks();
    
    // Render tasks
    filteredTasks.forEach(task => {
        const taskEl = createTaskElement(task);
        tasksContainer.appendChild(taskEl);
    });
    
    // Update task count badge
    updateTaskCount();
    
    // Also update home page tasks if it exists
    updateHomeTasks();
}

// Create a task DOM element
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-card group p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 cursor-pointer';
    div.dataset.taskId = task.id;
    
    // Apply styles based on completion status
    if (task.completed) {
        div.classList.add('bg-surface-container-lowest', 'opacity-70', 'task-completed');
        div.classList.remove('bg-white', 'hover:shadow-lg', 'hover:shadow-indigo-500/5', 'hover:border-primary/10', 'border-2', 'border-primary');
    } else {
        div.classList.add('bg-surface-container-lowest', 'hover:shadow-lg', 'hover:shadow-indigo-500/5', 'hover:border-primary/10', 'border', 'border-transparent');
        div.classList.remove('bg-white', 'task-completed');
    }
    
    // Get priority badge class
    const priorityClass = getPriorityClass(task.priority);
    
    // Get status indicator
    let statusDot, statusText, statusColor;
    switch (task.status) {
        case 'in-progress':
            statusDot = 'bg-tertiary-fixed';
            statusText = 'In Progress';
            statusColor = 'text-on-tertiary-container';
            break;
        case 'completed':
            statusDot = 'bg-primary';
            statusText = 'Completed';
            statusColor = 'text-primary';
            break;
        default:
            statusDot = 'bg-outline-variant';
            statusText = 'To Do';
            statusColor = '';
    }
    
    // Get deadline icon
    const deadlineIcon = task.completed ? 'check_circle' : 'calendar_today';
    const iconFill = task.completed ? "'FILL' 1" : '';
    
    // Get deadline display
    const deadlineDisplay = formatDateDisplay(task.deadline);
    
    div.innerHTML = `
        <div class="pt-1">
            <input class="task-checkbox w-6 h-6 rounded-md border-2 transition-all cursor-pointer ${task.completed ? 'border-primary text-primary' : 'border-outline-variant text-primary'} focus:ring-primary/20" type="checkbox" ${task.completed ? 'checked' : ''}/>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <h3 class="text-lg font-bold text-on-surface leading-tight ${task.completed ? 'line-through text-on-surface-variant' : ''}">${escapeHtml(task.title)}</h3>
                <span class="inline-flex px-3 py-1 ${priorityClass} font-bold text-xs rounded-full uppercase tracking-wider shrink-0">${capitalizeFirst(task.priority)}</span>
            </div>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-on-surface-variant font-medium">
                <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base ${task.completed ? 'text-primary' : ''}" style="font-size: 16px; ${iconFill ? 'font-variation-settings: ' + iconFill : ''}">${deadlineIcon}</span>
                    <span>${escapeHtml(deadlineDisplay)}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full ${statusDot}"></span>
                    <span class="${statusColor}">${statusText}</span>
                </div>
            </div>
        </div>
        <button class="delete-btn p-2 text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100 shrink-0">
            <span class="material-symbols-outlined" data-icon="delete" style="font-size: 18px">delete</span>
        </button>
    `;
    
    // Add click event to open detail panel - ONLY on the task content area
    const taskContent = div.querySelector('.flex-1');
    taskContent.addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskDetail(task.id);
    });
    
    // Add event listeners for checkbox
    const checkbox = div.querySelector('.task-checkbox');
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleComplete(task.id, !task.completed);
    });
    
    // Add event listeners for delete button
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    return div;
}

// Open task detail panel (drawer)
function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    selectedTaskId = taskId;
    
    const panel = document.getElementById('task-detail-panel');
    const overlay = document.getElementById('panel-overlay');
    
    if (!panel) return;
    
    // Update panel content
    document.getElementById('panel-task-title').textContent = task.title;
    const deadlineInput = document.getElementById('panel-deadline');
    deadlineInput.value = task.deadline || '';
    document.getElementById('panel-notes').value = task.notes || '';
    
    // Update priority badge
    const priorityBadge = document.getElementById('panel-priority-badge');
    priorityBadge.className = `inline-flex px-3 py-1 ${getPriorityClass(task.priority)} font-bold text-xs rounded-full uppercase tracking-wider`;
    priorityBadge.textContent = capitalizeFirst(task.priority);
    
    // Update status badge
    const statusBadge = document.getElementById('panel-status-badge');
    switch (task.status) {
        case 'in-progress':
            statusBadge.className = 'inline-flex px-3 py-1 bg-tertiary-container/10 text-on-tertiary-container font-bold text-xs rounded-full uppercase tracking-wider';
            statusBadge.textContent = 'In Progress';
            break;
        case 'completed':
            statusBadge.className = 'inline-flex px-3 py-1 bg-primary-container/20 text-primary font-bold text-xs rounded-full uppercase tracking-wider';
            statusBadge.textContent = 'Completed';
            break;
        default:
            statusBadge.className = 'inline-flex px-3 py-1 bg-surface-container text-on-surface font-bold text-xs rounded-full uppercase tracking-wider';
            statusBadge.textContent = 'To Do';
    }
    
    // Show panel (slide in from right)
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    
    // Show overlay
    if (overlay) {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
    }
    
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
}

// Close detail panel (drawer)
function closeDetailPanel() {
    const panel = document.getElementById('task-detail-panel');
    const overlay = document.getElementById('panel-overlay');
    
    if (panel) {
        // Hide panel (slide out to right)
        panel.classList.remove('translate-x-0');
        panel.classList.add('translate-x-full');
    }
    
    // Hide overlay
    if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    selectedTaskId = null;
}

// Save task notes
function saveTaskNotes() {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;
    
    const notesInput = document.getElementById('panel-notes');
    task.notes = notesInput.value;
    saveTasks();
}

// Save task deadline
function saveTaskDeadline() {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;
    
    const deadlineInput = document.getElementById('panel-deadline');
    task.deadline = deadlineInput.value;
    saveTasks();
}

// Save all task details
function saveTaskDetails() {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;
    
    // Save deadline
    const deadlineInput = document.getElementById('panel-deadline');
    task.deadline = deadlineInput.value;
    
    // Save notes
    const notesInput = document.getElementById('panel-notes');
    task.notes = notesInput.value;
    
    saveTasks();
    renderTasks();
    
    // Show brief confirmation
    const btn = document.getElementById('save-btn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
    }
}



// Add new task
function addTask(taskText, priority = 'medium', deadline = null) {
    const deadlineDate = deadline || getTomorrowISO();
    
    const newTask = {
        id: Date.now(),
        title: taskText,
        priority: priority,
        status: 'todo',
        deadline: deadlineDate,
        completed: false,
        completedAt: null,
        notes: ''
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateTasksTodayCount();
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    if (selectedTaskId === taskId) {
        closeDetailPanel();
    }
    renderTasks();
    updateTasksTodayCount();
    updateDashboardStats();
}

// Toggle task completion
function toggleComplete(taskId, isCompleted) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = isCompleted;
        task.status = isCompleted ? 'completed' : 'todo';
        task.completedAt = isCompleted ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        updateDashboardStats();
        updateTasksTodayCount();
        
        // Update detail panel if it's open for this task
        if (selectedTaskId === taskId) {
            openTaskDetail(taskId);
        }
    }
}

// Update task count display
function updateTaskCount() {
    const tasks = document.querySelectorAll('.task-card');
    const completedTasks = document.querySelectorAll('.task-card.task-completed');
    const remaining = tasks.length - completedTasks.length;
    
    const countBadge = document.querySelector('.task-count-badge');
    if (countBadge) {
        countBadge.textContent = `${remaining} Remaining`;
    }
    
    const activeTasksBadge = document.querySelector('.active-tasks-badge');
    if (activeTasksBadge) {
        activeTasksBadge.textContent = `${remaining} Active Tasks`;
    }
}

// Helper functions
function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case 'hard': return 'bg-error-container/10 text-error';
        case 'medium': return 'bg-primary-container/20 text-primary';
        case 'easy': return 'bg-secondary-container/30 text-secondary';
        default: return 'bg-surface-container text-on-surface';
    }
}

function getPriorityColor(priority) {
    switch (priority.toLowerCase()) {
        case 'hard': return '#b41340';
        case 'medium': return '#4647d3';
        case 'easy': return '#8126cf';
        default: return '#595c5e';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// DARK MODE FUNCTIONALITY
// ============================================



// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            link.classList.add('text-indigo-600', 'font-bold', 'border-b-2', 'border-indigo-600');
            link.classList.remove('text-slate-500');
        }
    });
}

// ============================================
// DECISION WHEEL FUNCTIONALITY
// ============================================

// Wheel colors — rich palette for segments
const WHEEL_COLORS = [
    '#4647d3', // Indigo
    '#8126cf', // Purple
    '#b41340', // Crimson
    '#0e7490', // Teal
    '#b45309', // Amber
    '#15803d', // Green
    '#7c3aed', // Violet
    '#be185d', // Pink
];

// Track accumulated rotation so spins always continue forward
let wheelAccumulatedRotation = 0;

// Get active (incomplete) tasks directly from the tasks array
function getWheelTasks() {
    return tasks.filter(t => !t.completed);
}

// Draw the wheel using an SVG so labels are always readable (never rotated with the wheel)
function renderWheelSegments() {
    const wheelContainer = document.getElementById('wheel-container');
    if (!wheelContainer) return;

    const activeTasks = getWheelTasks();

    // Reset container — remove old SVG and background
    wheelContainer.innerHTML = '';
    wheelContainer.style.background = '';
    wheelContainer.style.backgroundImage = '';

    // Empty state
    if (activeTasks.length === 0) {
        wheelContainer.style.background = 'linear-gradient(135deg, #e5e9eb 0%, #dfe3e6 100%)';
        wheelContainer.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <span style="color:#595c5e;font-size:11px;font-weight:600;text-align:center;padding:0 16px;font-family:Inter,sans-serif;">
                    Add tasks to spin!
                </span>
            </div>`;
        return;
    }

    const size = 208; // matches w-52 h-52 (208px)
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;
    const n = activeTasks.length;
    const segAngle = (2 * Math.PI) / n;

    // Build SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.cssText = 'display:block;position:absolute;top:0;left:0;';

    // Defs for clip path (circle)
    const defs = document.createElementNS(svgNS, 'defs');
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    clipPath.setAttribute('id', 'wheel-clip');
    const clipCircle = document.createElementNS(svgNS, 'circle');
    clipCircle.setAttribute('cx', cx);
    clipCircle.setAttribute('cy', cy);
    clipCircle.setAttribute('r', r);
    clipPath.appendChild(clipCircle);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    // Group that rotates (segments only — labels stay outside)
    const rotatingGroup = document.createElementNS(svgNS, 'g');
    rotatingGroup.setAttribute('id', 'wheel-rotating-group');
    rotatingGroup.setAttribute('clip-path', 'url(#wheel-clip)');

    // Draw segments
    activeTasks.forEach((task, i) => {
        const startAngle = i * segAngle - Math.PI / 2; // start at top
        const endAngle = startAngle + segAngle;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        const largeArc = segAngle > Math.PI ? 1 : 0;
        const color = WHEEL_COLORS[i % WHEEL_COLORS.length];

        // Slightly lighter version for alternating depth
        const isEven = i % 2 === 0;
        const fillColor = isEven ? color : adjustColorBrightness(color, 20);

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`);
        path.setAttribute('fill', fillColor);
        // Thin white divider lines
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '1.5');
        rotatingGroup.appendChild(path);
    });

    svg.appendChild(rotatingGroup);

    // Label layer — separate group, does NOT rotate with the wheel
    // Labels are positioned at mid-angle of each segment at render time,
    // then updated on each animation frame during spin
    const labelGroup = document.createElementNS(svgNS, 'g');
    labelGroup.setAttribute('id', 'wheel-label-group');

    const labelRadius = n === 1 ? 0 : r * 0.62; // distance from center
    const maxChars = n <= 2 ? 12 : n <= 4 ? 9 : n <= 6 ? 7 : 5;
    const fontSize = n <= 2 ? 11 : n <= 4 ? 10 : n <= 6 ? 9 : 8;

    activeTasks.forEach((task, i) => {
        const midAngle = i * segAngle + segAngle / 2 - Math.PI / 2;
        const lx = cx + labelRadius * Math.cos(midAngle);
        const ly = cy + labelRadius * Math.sin(midAngle);

        // Truncate title
        let label = task.title;
        if (label.length > maxChars) label = label.substring(0, maxChars - 1) + '…';

        // Rotate label to read outward from center
        const rotateDeg = (midAngle * 180 / Math.PI) + 90;

        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', lx);
        text.setAttribute('y', ly);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', fontSize);
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.setAttribute('transform', `rotate(${rotateDeg}, ${lx}, ${ly})`);
        text.style.cssText = 'text-shadow: 0 1px 2px rgba(0,0,0,0.5); filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));';
        text.setAttribute('data-base-angle', midAngle);
        text.setAttribute('data-index', i);
        text.textContent = label;
        labelGroup.appendChild(text);
    });

    svg.appendChild(labelGroup);
    wheelContainer.appendChild(svg);
}

// Utility: lighten a hex color by amount (0–255)
function adjustColorBrightness(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Initialize wheel on page load
function initWheel() {
    wheelAccumulatedRotation = 0;
    renderWheelSegments();
}

// Spin wheel function — rotates the segment group, labels counter-rotate to stay readable
function spinWheel() {
    const wheelContainer = document.getElementById('wheel-container');
    const spinBtn = document.getElementById('spin-btn');
    const resultText = document.getElementById('wheel-result');

    if (!wheelContainer || !spinBtn || !resultText) return;

    const activeTasks = getWheelTasks();

    if (activeTasks.length === 0) {
        resultText.innerHTML = '<span style="color:#b41340;">⚠️ No tasks to spin!</span>';
        setTimeout(() => {
            resultText.textContent = '"Doesn\'t know what to do? Just spin the wheel!"';
        }, 2500);
        return;
    }

    // Disable button
    spinBtn.disabled = true;
    spinBtn.textContent = '🎡 SPINNING...';
    spinBtn.classList.add('scale-95');
    resultText.innerHTML = '<span class="animate-pulse">🎲 Selecting your mission...</span>';

    const n = activeTasks.length;
    const segAngle = 360 / n;

    // Pick random target task
    const targetIndex = Math.floor(Math.random() * n);

    // Compute spin: always add full rotations + land on target segment
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Target segment center in degrees (0 = top, clockwise)
    const targetCenter = targetIndex * segAngle + segAngle / 2;
    // To land pointer (top) on targetCenter, rotate wheel by (360 - targetCenter)
    const landOffset = (360 - targetCenter + Math.random() * segAngle * 0.6 - segAngle * 0.3);
    const totalSpin = fullSpins + landOffset;

    wheelAccumulatedRotation += totalSpin;

    const spinDuration = 3000 + Math.random() * 1500; // 3–4.5s

    // Animate the rotating group with CSS transition
    const rotGroup = wheelContainer.querySelector('#wheel-rotating-group');
    const size = 208;
    const cx = size / 2;
    const cy = size / 2;

    if (rotGroup) {
        rotGroup.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 1)`;
        rotGroup.style.transformOrigin = `${cx}px ${cy}px`;
        rotGroup.style.transform = `rotate(${wheelAccumulatedRotation}deg)`;
    }

    // Counter-rotate labels so they stay upright during spin (using rAF)
    const labelGroup = wheelContainer.querySelector('#wheel-label-group');
    const startTime = performance.now();
    const startRot = wheelAccumulatedRotation - totalSpin;
    const ease = (t) => {
        // Match cubic-bezier(0.17, 0.67, 0.12, 1) approximately
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    function animateLabels(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easedProgress = ease(progress);
        const currentRot = startRot + totalSpin * easedProgress;

        if (labelGroup) {
            // Each label counter-rotates by -currentRot around the wheel center
            // so the text stays facing the reader
            const labelTexts = labelGroup.querySelectorAll('text');
            labelTexts.forEach(text => {
                const baseAngle = parseFloat(text.getAttribute('data-base-angle'));
                const lx = cx + (n === 1 ? 0 : size / 2 * 0.62) * Math.cos(baseAngle);
                const ly = cy + (n === 1 ? 0 : size / 2 * 0.62) * Math.sin(baseAngle);
                // Rotate label's position around center by currentRot, then keep text upright
                const posAngleDeg = (baseAngle * 180 / Math.PI) + 90; // base text tilt
                text.setAttribute('transform', `rotate(${currentRot}, ${cx}, ${cy}) rotate(${posAngleDeg - currentRot}, ${lx}, ${ly})`);
            });
        }

        if (progress < 1) {
            requestAnimationFrame(animateLabels);
        }
    }
    requestAnimationFrame(animateLabels);

    // Show result
    setTimeout(() => {
        const selected = activeTasks[targetIndex];
        const priorityEmoji = { hard: '🔴', medium: '🟡', easy: '🟢' };
        const emoji = priorityEmoji[selected.priority] || '🎯';

        resultText.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                <span style="font-size:18px;">${emoji}</span>
                <span style="color:#4647d3;font-weight:700;font-size:13px;text-align:center;max-width:180px;line-height:1.3;">${escapeHtml(selected.title)}</span>
                <span style="color:#595c5e;font-size:10px;font-weight:500;">${capitalizeFirst(selected.priority)} priority</span>
            </div>`;

        spinBtn.disabled = false;
        spinBtn.textContent = 'SPIN AGAIN';
        spinBtn.classList.remove('scale-95');
    }, spinDuration);
}

// Make functions available globally
window.spinWheel = spinWheel;
window.renderWheelSegments = renderWheelSegments;
window.getActiveTasks = getWheelTasks;

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

// Calendar state
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Month names for display
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Initialize calendar
function initCalendar() {
    const calendarContainer = document.getElementById('calendar-days');
    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');
    
    // Only run on calendar page
    if (!calendarContainer) return;
    
    // Load tasks from localStorage
    loadTasks();
    
    // Render initial calendar
    renderCalendar();
    renderUpcomingEvents();
    
    // Setup navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeMonth(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeMonth(1));
    }
    
    // Listen for storage changes to re-render calendar (when tasks are updated from other pages)
    window.addEventListener('storage', (e) => {
        if (e.key === 'tasksOS') {
            loadTasks();
            renderCalendar();
            renderUpcomingEvents();
        }
    });
    
    // Set up interval to refresh calendar every minute (for date changes)
    setInterval(() => {
        const today = new Date();
        if (today.getMonth() !== currentMonth || today.getFullYear() !== currentYear) {
            currentMonth = today.getMonth();
            currentYear = today.getFullYear();
            renderCalendar();
            renderUpcomingEvents();
        }
    }, 60000);
}

// Change month by direction (-1 for prev, 1 for next)
function changeMonth(direction) {
    currentMonth += direction;
    
    // Handle year change
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    renderCalendar();
    renderUpcomingEvents();
}

// Render the calendar
function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const monthDisplay = document.getElementById('current-month-display');
    
    if (!calendarDays) return;
    
    // Update month display
    if (monthDisplay) {
        monthDisplay.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    }
    
    // Clear existing calendar
    calendarDays.innerHTML = '';
    
    // Get calendar data
    const calendarData = generateCalendarDays();
    
    // Render each day
    calendarData.forEach(day => {
        const dayElement = createCalendarDayElement(day);
        calendarDays.appendChild(dayElement);
    });
}

// Generate calendar days array with proper alignment
function generateCalendarDays() {
    const days = [];
    
    // Get first day of month and total days in month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push({
            day: null,
            isCurrentMonth: false,
            date: null
        });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = formatDateISO(date);
        
        // Check if this is today
        const today = new Date();
        const isToday = (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
        
        days.push({
            day: day,
            isCurrentMonth: true,
            date: dateString,
            isToday: isToday
        });
    }
    
    return days;
}

// Create a calendar day element
function createCalendarDayElement(dayData) {
    const div = document.createElement('div');
    div.className = 'calendar-day flex flex-col';
    
    if (!dayData.isCurrentMonth || dayData.day === null) {
        // Empty cell or non-current month
        div.classList.add('opacity-0');
        return div;
    }
    
    // Get tasks for this date
    const tasksForDay = getTasksByDate(dayData.date);
    
    // Build classes based on state
    let baseClasses = 'bg-white rounded-lg flex flex-col hover:shadow-md transition-all cursor-pointer border-2 overflow-hidden';
    
    if (dayData.isToday) {
        baseClasses += ' border-primary';
    } else {
        baseClasses += ' border-transparent hover:border-primary/20';
    }
    
    div.className = `${baseClasses} ${div.className}`;
    
    // Create day number
    const dayNumber = document.createElement('span');
    dayNumber.className = 'text-xs md:text-sm font-bold text-on-surface shrink-0';
    if (dayData.isToday) {
        dayNumber.className += ' text-primary';
    }
    dayNumber.textContent = dayData.day;
    div.appendChild(dayNumber);
    
    // Add task elements (titles, not just bars)
    if (tasksForDay.length > 0) {
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'mt-1 flex flex-col gap-0.5 overflow-hidden flex-1';
        
        // Show max 2 task titles on mobile (< 640px), 3 on desktop
        const isMobile = window.innerWidth < 640;
        const maxVisible = isMobile ? 2 : 3;
        const visibleTasks = tasksForDay.slice(0, maxVisible);
        
        visibleTasks.forEach(task => {
            const taskEl = document.createElement('div');
            // Priority-based styling
            const priorityClasses = getPriorityTaskClasses(task.priority);
            taskEl.className = `text-[9px] md:text-[10px] px-1 md:px-2 py-0.5 rounded truncate font-medium ${priorityClasses}`;
            taskEl.textContent = task.title;
            taskEl.title = task.title;
            tasksContainer.appendChild(taskEl);
        });
        
        // Show count if more tasks
        if (tasksForDay.length > maxVisible) {
            const moreCount = document.createElement('span');
            moreCount.className = 'text-[8px] md:text-[10px] text-on-surface-variant font-medium px-1';
            moreCount.textContent = `+${tasksForDay.length - maxVisible} more`;
            tasksContainer.appendChild(moreCount);
        }
        
        div.appendChild(tasksContainer);
    }
    
    return div;
}

// Get priority-based classes for task display in calendar
function getPriorityTaskClasses(priority) {
    switch (priority.toLowerCase()) {
        case 'easy':
            return 'bg-purple-100 text-purple-700';
        case 'medium':
            return 'bg-blue-100 text-blue-700';
        case 'hard':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
}

// Get tasks for a specific date (YYYY-MM-DD format)
function getTasksByDate(dateString) {
    if (!dateString) return [];
    
    return tasks.filter(task => {
        if (!task.deadline) return false;
        
        // Normalize both dates for comparison - handle both ISO and simple date strings
        const taskDate = task.deadline.split('T')[0];
        return taskDate === dateString;
    });
}



// Format date to ISO string (YYYY-MM-DD)
function formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Render upcoming events section
function renderUpcomingEvents() {
    const container = document.getElementById('upcoming-events-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = formatDateISO(today);
    
    // Get upcoming tasks (today and future)
    const upcomingTasks = tasks
        .filter(task => {
            if (!task.deadline || task.completed) return false;
            const taskDate = new Date(task.deadline);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate >= today;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    if (upcomingTasks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50">event_available</span>
                <p class="font-medium">No upcoming events</p>
                <p class="text-sm mt-1">Add tasks with deadlines to see them here</p>
            </div>
        `;
        return;
    }
    
    // Render each event card
    upcomingTasks.forEach(task => {
        const eventCard = createEventCard(task);
        container.appendChild(eventCard);
    });
}

// Create an event card element
function createEventCard(task) {
    const div = document.createElement('div');
    div.className = 'event-card bg-surface-container-lowest rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer';
    
    // Get icon and color based on priority
    const { icon, colorClass, iconBgClass } = getEventCardStyles(task.priority);
    
    // Format deadline for display
    const deadlineDisplay = formatCalendarEventDate(task.deadline);
    
    div.innerHTML = `
        <div class="flex items-start gap-3 md:gap-4">
            <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl ${iconBgClass} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined ${colorClass}" data-icon="${icon}" style="font-size: 20px">${icon}</span>
            </div>
            <div class="flex-1 min-w-0">
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider ${colorClass}">${capitalizeFirst(task.priority)} Priority</span>
                <h3 class="text-sm md:text-lg font-bold text-on-surface mt-1 truncate">${escapeHtml(task.title)}</h3>
                <p class="text-xs md:text-sm text-on-surface-variant mt-1">${deadlineDisplay}</p>
            </div>
        </div>
    `;
    
    // Add click handler to open task detail on tasks page
    div.addEventListener('click', () => {
        // Try to open in tasks page detail panel
        if (window.location.pathname.includes('calendar')) {
            // If we're on calendar, save selected task ID and redirect
            localStorage.setItem('selectedTaskFromCalendar', task.id);
            window.location.href = 'tasks.html';
        }
    });
    
    return div;
}

// Get event card icon and color styles based on priority
function getEventCardStyles(priority) {
    switch (priority.toLowerCase()) {
        case 'hard':
            return {
                icon: 'assignment_late',
                colorClass: 'text-error',
                iconBgClass: 'bg-error/10'
            };
        case 'medium':
            return {
                icon: 'quiz',
                colorClass: 'text-secondary',
                iconBgClass: 'bg-secondary/10'
            };
        case 'easy':
        default:
            return {
                icon: 'task_alt',
                colorClass: 'text-primary',
                iconBgClass: 'bg-primary/10'
            };
    }
}

// Format date for calendar event display
function formatCalendarEventDate(dateStr) {
    if (!dateStr) return 'No deadline set';
    
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
        });
    }
}

// Export functions to global scope for calendar
window.changeMonth = changeMonth;
window.renderCalendar = renderCalendar;
window.renderUpcomingEvents = renderUpcomingEvents;

// ============================================
// XP SYSTEM & DASHBOARD STATS
// ============================================

const MAX_XP = 3000;
const XP_VALUES = {
    easy: 50,
    medium: 100,
    hard: 150
};

// Get weekly completed tasks (last 7 days)
function getWeeklyCompletedTasks(taskList = tasks) {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    return taskList.filter(task => {
        if (!task.completed || !task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate >= weekStart;
    });
}

// Calculate total XP from all completed tasks
function calculateXP(taskList = tasks) {
    return taskList.reduce((xp, task) => {
        if (!task.completed) return xp;
        const xpValue = XP_VALUES[task.priority] || XP_VALUES.easy;
        return xp + xpValue;
    }, 0);
}

// Calculate weekly XP gained
function getWeeklyXP(taskList = tasks) {
    const weeklyTasks = getWeeklyCompletedTasks(taskList);
    return weeklyTasks.reduce((xp, task) => {
        const xpValue = XP_VALUES[task.priority] || XP_VALUES.easy;
        return xp + xpValue;
    }, 0);
}

// Update dashboard statistics
function updateDashboardStats() {
    // Only run on dashboard/home page
    const dashboardProfile = document.getElementById('dashboard-profile-name');
    if (!dashboardProfile) return;
    
    const weeklyTasks = getWeeklyCompletedTasks();
    const weeklyXP = getWeeklyXP();
    const totalXP = calculateXP();
    
    // Update Weekly Impact - Tasks Done
    const tasksDoneEl = document.getElementById('weekly-tasks-done');
    if (tasksDoneEl) {
        tasksDoneEl.textContent = weeklyTasks.length;
    }
    
    // Update Weekly Impact - XP Gained
    const xpGainedEl = document.getElementById('weekly-xp-gained');
    if (xpGainedEl) {
        xpGainedEl.textContent = '+' + weeklyXP.toLocaleString();
    }
    
    // Update Academic XP Bar
    updateXPBar(totalXP);
    
    // Update Tasks Today count
    updateTasksTodayCount();
}

// Update XP Bar
function updateXPBar(totalXP) {
    const xpFill = document.getElementById('academic-xp-fill');
    const xpText = document.getElementById('academic-xp-text');
    const xpLevel = document.getElementById('academic-level');
    
    if (xpFill) {
        const percentage = Math.min((totalXP / MAX_XP) * 100, 100);
        xpFill.style.width = percentage + '%';
    }
    
    if (xpText) {
        xpText.textContent = `${totalXP.toLocaleString()} / ${MAX_XP.toLocaleString()}`;
    }
    
    if (xpLevel) {
        const level = Math.floor(totalXP / 250) + 1;
        xpLevel.textContent = `Level ${level}`;
    }
}

// Update Tasks Today count
function updateTasksTodayCount() {
    const countEl = document.getElementById('tasks-today-count');
    if (!countEl) return;
    
    const today = getTodayISO();
    const todayTasks = tasks.filter(t => t.deadline === today && !t.completed).length;
    countEl.textContent = todayTasks.toString().padStart(2, '0');
}

// ============================================
// PROFILE SYSTEM
// ============================================

// Default profile
const defaultProfile = {
    name: '',
    avatar: 'https://ui-avatars.com/api/?name=User&background=9396ff&color=ffffff'
};

// Load profile from localStorage
function loadProfile() {
    const stored = localStorage.getItem('profileOS');
    return stored ? JSON.parse(stored) : { ...defaultProfile };
}

// Save profile to localStorage
function saveProfile(profile) {
    localStorage.setItem('profileOS', JSON.stringify(profile));
}

// Apply profile to all pages
function applyProfileGlobally() {
    const profile = loadProfile();
    
    // Update header avatar
    const headerAvatars = document.querySelectorAll('header img[alt*="Profile"], header img[alt*="Avatar"]');
    headerAvatars.forEach(img => {
        img.src = profile.avatar;
    });
    
    // Update dashboard profile name
    const dashboardName = document.getElementById('dashboard-profile-name');
    if (dashboardName) {
        dashboardName.textContent = profile.name && profile.name.trim() !== '' 
    ? profile.name 
    : 'Welcome!';
    }
    
    // Update dashboard avatar
    const dashboardAvatar = document.getElementById('dashboard-profile-avatar');
    if (dashboardAvatar) {
        dashboardAvatar.src = profile.avatar;
    }
}

// Initialize profile page
function initProfilePage() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;
    
    const profile = loadProfile();
    
    // Load profile data
    const nameInput = document.getElementById('profile-name-input');
    const avatarImg = document.getElementById('profile-avatar-preview');
    const fileInput = document.getElementById('profile-avatar-input');
    
    if (nameInput) nameInput.value = profile.name;
    if (avatarImg) avatarImg.src = profile.avatar;
    
    // Load and display stats
    loadTasks();
    const totalXP = calculateXP();
    const completedTasks = tasks.filter(t => t.completed).length;
    
    const totalXpEl = document.getElementById('profile-total-xp');
    const completedTasksEl = document.getElementById('profile-tasks-completed');
    
    if (totalXpEl) totalXpEl.textContent = totalXP.toLocaleString();
    if (completedTasksEl) completedTasksEl.textContent = completedTasks.toLocaleString();
    
    // Handle file upload
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    avatarImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle save
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedProfile = {
            name: nameInput.value.trim(),
            avatar: avatarImg.src || defaultProfile.avatar
        };
        saveProfile(updatedProfile);
        applyProfileGlobally();
        
        // Show success message
        const btn = document.getElementById('save-profile-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Saved!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        }
    });
}

// ============================================
// MOOD TRACKING SYSTEM
// ============================================

// Initialize mood tracker
function initMoodTracker() {
    const moodButtons = document.querySelectorAll('.mood-emoji');
    const distractionInput = document.getElementById('distraction-input');
    
    if (moodButtons.length === 0) return;
    
    // Load today's mood
    loadTodayMood();
    
    // Render mood history
    renderMoodHistory();
    
    // Add click handlers to mood buttons
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            moodButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Save mood
            saveMood(btn.dataset.mood);
        });
    });
    
    // Load saved distraction
    if (distractionInput) {
        const today = new Date().toISOString().split('T')[0];
        const logs = JSON.parse(localStorage.getItem('distractionOS')) || {};
        if (logs[today]) {
            distractionInput.value = logs[today];
        }
        
        // Save distraction on input
        distractionInput.addEventListener('change', () => {
            saveDistraction(distractionInput.value);
        });
    }
}

// Save mood to localStorage
function saveMood(emoji) {
    const today = new Date().toISOString().split('T')[0];
    let moods = JSON.parse(localStorage.getItem('moodOS')) || {};
    
    moods[today] = emoji;
    localStorage.setItem('moodOS', JSON.stringify(moods));
    
    // Re-render mood history
    renderMoodHistory();
}

// Load today's mood
function loadTodayMood() {
    const today = new Date().toISOString().split('T')[0];
    const moods = JSON.parse(localStorage.getItem('moodOS')) || {};
    const todayMood = moods[today];
    
    if (todayMood) {
        const moodButtons = document.querySelectorAll('.mood-emoji');
        moodButtons.forEach(btn => {
            if (btn.dataset.mood === todayMood) {
                btn.classList.add('active');
            }
        });
    }
}

// Render mood history (next 5 days forward from today)
function renderMoodHistory() {
    const container = document.getElementById('mood-history');
    if (!container) return;
    
    const moods = JSON.parse(localStorage.getItem('moodOS')) || {};
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i); // FORWARD (not backward)
        
        const key = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Label: Today for first, day name for others
        const label = i === 0 ? 'Today' : dayName;
        
        const emoji = moods[key] || '—';
        
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between border-b border-surface-container py-2 mood-history-row';
        row.innerHTML = `
            <span class="text-sm font-medium">${label}</span>
            <span class="text-lg">${emoji}</span>
        `;
        container.appendChild(row);
    }
}

// Save distraction log
function saveDistraction(text) {
    const today = new Date().toISOString().split('T')[0];
    let logs = JSON.parse(localStorage.getItem('distractionOS')) || {};
    
    logs[today] = text;
    localStorage.setItem('distractionOS', JSON.stringify(logs));
}

// ============================================
// FIXED TASKS TODAY COUNT
// ============================================

// Get all active (uncompleted) tasks - matches "Today's Missions"
function getActiveTasks(taskList = tasks) {
    return taskList.filter(task => !task.completed);
}

// Update Tasks Today count - shows ALL uncompleted tasks
function updateTasksTodayCount() {
    const countEl = document.getElementById('tasks-today-count');
    if (!countEl) return;
    
    const activeTasks = getActiveTasks();
    countEl.textContent = activeTasks.length.toString().padStart(2, '0');
}

// Export functions
window.getWeeklyCompletedTasks = getWeeklyCompletedTasks;
window.calculateXP = calculateXP;
window.getWeeklyXP = getWeeklyXP;
window.updateDashboardStats = updateDashboardStats;
window.updateXPBar = updateXPBar;
window.loadProfile = loadProfile;
window.saveProfile = saveProfile;
window.applyProfileGlobally = applyProfileGlobally;
window.initMoodTracker = initMoodTracker;
window.saveMood = saveMood;
window.renderMoodHistory = renderMoodHistory;
window.getActiveTasks = getActiveTasks;
window.updateTasksTodayCount = updateTasksTodayCount;

