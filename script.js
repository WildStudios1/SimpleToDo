document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const currentTasksCount = document.getElementById('current-tasks-count');
    const completedTasksCount = document.getElementById('completed-tasks-count');
    const noTasksMessage = document.getElementById('no-tasks');
    const toggleModeButton = document.getElementById('toggle-mode');
    const themeIcon = document.getElementById('theme-icon');
    let currentTasks = 0;
    let completedTasks = parseInt(localStorage.getItem('completedTasks')) || 0;

    function updateTaskCounters() {
        currentTasksCount.textContent = currentTasks;
        completedTasksCount.textContent = completedTasks;
        localStorage.setItem('completedTasks', completedTasks);
    }

    function checkNoTasks() {
        noTasksMessage.style.display = currentTasks === 0 ? 'block' : 'none';
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({ text: taskItem.textContent, completed: taskItem.querySelector('input').checked });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function () {
                if (checkbox.checked) {
                    listItem.classList.add('moving');
                    setTimeout(() => {
                        listItem.remove();
                        completedTasks++;
                        currentTasks--;
                        updateTaskCounters();
                        checkNoTasks();
                        saveTasks();
                    }, 500);
                }
            });
            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(task.text));
            taskList.appendChild(listItem);
            if (task.completed) {
                completedTasks++;
            } else {
                currentTasks++;
            }
        });
        updateTaskCounters();
        checkNoTasks();
    }

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', function () {
                if (checkbox.checked) {
                    listItem.classList.add('moving');
                    setTimeout(() => {
                        listItem.remove();
                        completedTasks++;
                        currentTasks--;
                        updateTaskCounters();
                        checkNoTasks();
                        saveTasks();
                    }, 500);
                }
            });
            listItem.appendChild(checkbox);
            listItem.appendChild(document.createTextNode(taskText));
            taskList.appendChild(listItem);
            currentTasks++;
            updateTaskCounters();
            checkNoTasks();
            saveTasks();
            newTaskInput.value = '';
        }
    }

    addTaskButton.addEventListener('click', addTask);

    newTaskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    toggleModeButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const darkModeEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', darkModeEnabled);
        themeIcon.textContent = darkModeEnabled ? '🌙' : '☀️';
    });

    // Load saved tasks and dark mode preference
    loadTasks();
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '🌙';
    }
});
