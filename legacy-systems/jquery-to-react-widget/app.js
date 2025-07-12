// Global variables - anti-pattern #1
var tasks = [];
var filteredTasks = [];
var currentFilter = 'all';
var currentCategory = 'all';
var searchTerm = '';
var editingTaskId = null;
var taskIdCounter = 1;

// More global state
var isLoading = false;
var hasLoaded = false;

// Global DOM elements cache (but still querying repeatedly)
var $taskList;
var $newTaskInput;
var $searchInput;

// Anti-pattern: Document ready with everything in it
$(document).ready(function() {
    // Initialize
    init();
    
    // Bind all events in one place - anti-pattern #2
    bindEvents();
    
    // Load initial data
    loadTasks();
});

// Anti-pattern: No encapsulation, everything global
function init() {
    // Cache some elements but not others - inconsistent
    $taskList = $('#task-list');
    $newTaskInput = $('#new-task-input');
    $searchInput = $('#search-input');
    
    // Set up some initial state
    currentFilter = 'all';
    currentCategory = 'all';
    searchTerm = '';
}

// Anti-pattern: Mixed event binding approaches
function bindEvents() {
    // Some events bound here
    $('#add-task-btn').click(function() {
        addTask();
    });
    
    // Some events bound inline in HTML (mentioned in comments)
    // onclick="someFunction()" - would be in HTML
    
    // Event delegation mixed with direct binding
    $(document).on('click', '.task-checkbox', function() {
        var id = $(this).data('task-id');
        toggleTask(id);
    });
    
    // More inconsistent event binding
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        filterTasks();
    });
    
    // Different syntax for similar events
    $('#search-input').on('input', function() {
        searchTerm = $(this).val();
        filterTasks();
    });
    
    // Yet another way to bind events
    $('#category-filter').change(function() {
        currentCategory = $(this).val();
        filterTasks();
    });
    
    // Bulk actions
    $('#mark-all-complete').click(markAllComplete);
    $('#clear-completed').click(clearCompleted);
    $('#delete-all').click(deleteAllTasks);
    
    // Edit modal events
    $(document).on('click', '.edit-btn', function() {
        editingTaskId = $(this).data('task-id');
        openEditModal();
    });
    
    $(document).on('click', '.delete-btn', function() {
        var id = $(this).data('task-id');
        deleteTask(id);
    });
    
    $('#save-edit-btn').click(saveEdit);
    $('#cancel-edit-btn').click(closeEditModal);
    
    // Modal backdrop click
    $('#edit-modal').click(function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    // Enter key handlers - more inconsistent binding
    $('#new-task-input').keypress(function(e) {
        if (e.which === 13) {
            addTask();
        }
    });
    
    $('#search-input').keypress(function(e) {
        if (e.which === 13) {
            // Do nothing, just here to show inconsistency
        }
    });
}

// Anti-pattern: Mock API with inconsistent async patterns
function loadTasks() {
    isLoading = true;
    $('#loading').show();
    
    // Simulate API call with callback hell
    setTimeout(function() {
        // Nested callbacks - anti-pattern #3
        setTimeout(function() {
            // Some tasks have promises, others callbacks
            if (Math.random() > 0.5) {
                // Sometimes use promises
                Promise.resolve().then(function() {
                    tasks = [
                        {id: 1, text: 'Review quarterly budget', completed: false, category: 'work', priority: 'high', createdAt: new Date()},
                        {id: 2, text: 'Buy groceries', completed: true, category: 'personal', priority: 'medium', createdAt: new Date()},
                        {id: 3, text: 'Fix critical bug', completed: false, category: 'urgent', priority: 'high', createdAt: new Date()},
                        {id: 4, text: 'Call mom', completed: false, category: 'personal', priority: 'low', createdAt: new Date()},
                        {id: 5, text: 'Prepare presentation', completed: false, category: 'work', priority: 'medium', createdAt: new Date()}
                    ];
                    taskIdCounter = 6;
                    isLoading = false;
                    hasLoaded = true;
                    $('#loading').hide();
                    renderTasks();
                });
            } else {
                // Sometimes use callbacks
                loadTasksCallback(function(data) {
                    tasks = data;
                    taskIdCounter = 6;
                    isLoading = false;
                    hasLoaded = true;
                    $('#loading').hide();
                    renderTasks();
                });
            }
        }, 500);
    }, 200);
}

// Anti-pattern: Inconsistent callback style
function loadTasksCallback(callback) {
    setTimeout(function() {
        var data = [
            {id: 1, text: 'Review quarterly budget', completed: false, category: 'work', priority: 'high', createdAt: new Date()},
            {id: 2, text: 'Buy groceries', completed: true, category: 'personal', priority: 'medium', createdAt: new Date()},
            {id: 3, text: 'Fix critical bug', completed: false, category: 'urgent', priority: 'high', createdAt: new Date()},
            {id: 4, text: 'Call mom', completed: false, category: 'personal', priority: 'low', createdAt: new Date()},
            {id: 5, text: 'Prepare presentation', completed: false, category: 'work', priority: 'medium', createdAt: new Date()}
        ];
        callback(data);
    }, 100);
}

// Anti-pattern: Heavy DOM manipulation, no abstraction
function renderTasks() {
    // Always query DOM instead of using cached elements
    $('#task-list').empty();
    
    // Filter tasks every time we render - inefficient
    filteredTasks = [];
    
    // Nested loops - anti-pattern #4
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var shouldShow = true;
        
        // Complex filtering logic inline
        if (currentFilter === 'active' && task.completed) {
            shouldShow = false;
        }
        if (currentFilter === 'completed' && !task.completed) {
            shouldShow = false;
        }
        if (currentCategory !== 'all' && task.category !== currentCategory) {
            shouldShow = false;
        }
        if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase())) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            filteredTasks.push(task);
        }
    }
    
    // More inefficient DOM manipulation
    if (filteredTasks.length === 0) {
        $('#task-list').append('<div class="empty-state"><p>No tasks found. Add a task to get started!</p></div>');
    } else {
        // Build HTML string - anti-pattern #5
        for (var j = 0; j < filteredTasks.length; j++) {
            var task = filteredTasks[j];
            var html = buildTaskHTML(task);
            $('#task-list').append(html);
        }
    }
    
    // Update stats - but query DOM again
    updateStats();
}

// Anti-pattern: String concatenation for HTML
function buildTaskHTML(task) {
    var checkedAttr = task.completed ? 'checked' : '';
    var completedClass = task.completed ? 'completed' : '';
    
    // Inline string building - hard to maintain
    var html = '<div class="task-item ' + completedClass + '">';
    html += '<input type="checkbox" class="task-checkbox" data-task-id="' + task.id + '" ' + checkedAttr + '>';
    html += '<div class="task-content">';
    html += '<div class="task-text">' + task.text + '</div>';
    html += '<div class="task-meta">';
    html += '<span class="task-category ' + task.category + '">' + task.category + '</span>';
    html += '<span class="task-priority ' + task.priority + '">' + task.priority + '</span>';
    html += '<span class="task-date">' + formatDate(task.createdAt) + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="task-actions">';
    html += '<button class="edit-btn" data-task-id="' + task.id + '">Edit</button>';
    html += '<button class="delete-btn" data-task-id="' + task.id + '">Delete</button>';
    html += '</div>';
    html += '</div>';
    
    return html;
}

// Anti-pattern: Utility functions mixed with business logic
function formatDate(date) {
    // Poor date formatting
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
}

// Anti-pattern: No validation, direct DOM access
function addTask() {
    var text = $('#new-task-input').val();
    var category = $('#task-category').val();
    var priority = $('#task-priority').val();
    
    // No validation
    if (text === '') {
        alert('Please enter a task');
        return;
    }
    
    // Create task object
    var newTask = {
        id: taskIdCounter++,
        text: text,
        completed: false,
        category: category,
        priority: priority,
        createdAt: new Date()
    };
    
    // Add to global array
    tasks.push(newTask);
    
    // Clear input
    $('#new-task-input').val('');
    
    // Re-render everything
    renderTasks();
    
    // Mock API call - inconsistent async again
    setTimeout(function() {
        console.log('Task saved to server:', newTask);
    }, 100);
}

// Anti-pattern: Direct array manipulation, no abstraction
function toggleTask(id) {
    // Linear search every time
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    
    // Re-render everything
    renderTasks();
    
    // Mock API call
    saveTaskToServer(id, function() {
        console.log('Task updated on server');
    });
}

// Anti-pattern: Inconsistent parameter passing
function saveTaskToServer(taskId, callback) {
    setTimeout(function() {
        if (callback) {
            callback();
        }
    }, 50);
}

// Anti-pattern: More direct DOM manipulation
function updateStats() {
    var total = tasks.length;
    var completed = 0;
    var active = 0;
    
    // Count manually every time
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        } else {
            active++;
        }
    }
    
    // Direct DOM updates
    $('#total-tasks').text(total);
    $('#completed-tasks').text(completed);
    $('#active-tasks').text(active);
}

// Anti-pattern: Repetitive code
function markAllComplete() {
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].completed = true;
    }
    renderTasks();
}

function clearCompleted() {
    var newTasks = [];
    for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    renderTasks();
}

function deleteAllTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        renderTasks();
    }
}

// Anti-pattern: No abstraction for filtering
function filterTasks() {
    renderTasks(); // Just re-render everything
}

// Anti-pattern: Modal handling with direct DOM manipulation
function openEditModal() {
    // Find task by ID
    var task = null;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == editingTaskId) {
            task = tasks[i];
            break;
        }
    }
    
    if (!task) return;
    
    // Populate modal fields
    $('#edit-task-input').val(task.text);
    $('#edit-task-category').val(task.category);
    $('#edit-task-priority').val(task.priority);
    
    // Show modal
    $('#edit-modal').show();
}

function closeEditModal() {
    $('#edit-modal').hide();
    editingTaskId = null;
}

function saveEdit() {
    var text = $('#edit-task-input').val();
    var category = $('#edit-task-category').val();
    var priority = $('#edit-task-priority').val();
    
    if (text === '') {
        alert('Please enter a task');
        return;
    }
    
    // Find and update task
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == editingTaskId) {
            tasks[i].text = text;
            tasks[i].category = category;
            tasks[i].priority = priority;
            break;
        }
    }
    
    closeEditModal();
    renderTasks();
}

// Anti-pattern: Direct deletion
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        var newTasks = [];
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id != id) {
                newTasks.push(tasks[i]);
            }
        }
        tasks = newTasks;
        renderTasks();
    }
}

// Anti-pattern: Random utility functions at the end
function findTaskById(id) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return tasks[i];
        }
    }
    return null;
}

// Anti-pattern: Inconsistent error handling
function handleError(error) {
    console.error('Error:', error);
    alert('Something went wrong!');
}

// Anti-pattern: Global click handlers
$(document).click(function(e) {
    // Close modal if clicked outside
    if ($(e.target).closest('.modal-content').length === 0 && $(e.target).closest('.edit-btn').length === 0) {
        if ($('#edit-modal').is(':visible')) {
            closeEditModal();
        }
    }
});

// Anti-pattern: Window resize handler doing unnecessary work
$(window).resize(function() {
    // Unnecessary re-render on resize
    if (hasLoaded) {
        setTimeout(function() {
            renderTasks();
        }, 100);
    }
});

// Anti-pattern: Polluting global namespace with more functions
window.debugTasks = function() {
    console.log('Current tasks:', tasks);
    console.log('Filtered tasks:', filteredTasks);
    console.log('Current filter:', currentFilter);
    console.log('Current category:', currentCategory);
    console.log('Search term:', searchTerm);
};

// Anti-pattern: Immediate function execution in global scope
(function() {
    // Some initialization code that could be anywhere
    var startTime = new Date();
    window.appStartTime = startTime;
})(); 