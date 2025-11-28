// Wait for the entire HTML document to load before running the script
document.addEventListener('DOMContentLoaded', function () {

    // -----------------------------
    // 1. Select DOM elements
    // -----------------------------
    const addButton = document.getElementById('add-btn');      // "Add Task" button
    const taskInput = document.getElementById('task-input');   // Input field for entering tasks
    const taskList = document.getElementById('task-list');     // UL element to display tasks

    // In-memory array of task strings to mirror localStorage
    let tasks = [];

    // -----------------------------
    // 2. Load tasks from Local Storage and render them
    // -----------------------------
    function loadTasks() {
        // Retrieve stored tasks (default to empty array)
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        // Update in-memory array
        tasks = storedTasks.slice();

        // Clear existing DOM list (in case)
        taskList.innerHTML = '';

        // For each stored task, create a list item in the DOM without saving again
        storedTasks.forEach(taskText => {
            addTask(taskText, false); // false => don't save back to localStorage while loading
        });
    }

    // -----------------------------
    // 3. Save current tasks array to Local Storage
    // -----------------------------
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // -----------------------------
    // 4. Function to add a new task
    //    Supports two usages:
    //    - addTask()               -> reads from taskInput and saves (user action)
    //    - addTask(taskText,save)  -> add a specific task (used by loadTasks)
    // -----------------------------
    function addTask(taskText = null, save = true) {
        // If no taskText provided, read from input field (user action)
        if (taskText === null) {
            taskText = taskInput.value.trim();
        }

        // Validate input: show alert if empty (only when invoked from input)
        if (taskText === "") {
            // If this was called programmatically with an empty string, just return silently
            if (taskInput === document.activeElement || taskInput.value.trim() === "") {
                alert("Please enter a task.");
            }
            return;
        }

        // -----------------------------
        // Create new list item (li)
        // -----------------------------
        const li = document.createElement('li');

        // Create a text node for the task so we can append button separately
        const textNode = document.createTextNode(taskText);
        li.appendChild(textNode);

        // -----------------------------
        // Create remove button
        // -----------------------------
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.className = "remove-btn";

        // Attach click handler to remove the li and update localStorage
        removeButton.onclick = function () {
            // Remove the li from DOM
            if (li.parentElement === taskList) {
                taskList.removeChild(li);
            }

            // Remove one occurrence of the taskText from the tasks array
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const index = storedTasks.indexOf(taskText);
            if (index > -1) {
                storedTasks.splice(index, 1);
                // Update in-memory array and localStorage
                tasks = storedTasks.slice();
                localStorage.setItem('tasks', JSON.stringify(storedTasks));
            } else {
                // As a fallback, update in-memory array too (remove first match)
                const idxInMemory = tasks.indexOf(taskText);
                if (idxInMemory > -1) {
                    tasks.splice(idxInMemory, 1);
                    saveTasksToLocalStorage();
                }
            }
        };

        // Append the remove button to the li, then li to the list
        li.appendChild(removeButton);
        taskList.appendChild(li);

        // If requested, update localStorage (and in-memory array)
        if (save) {
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            storedTasks.push(taskText);
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
            tasks = storedTasks.slice(); // keep in-memory array in sync
        }

        // Clear input field only when the task was added via the input field
        if (taskInput && taskInput.value.trim() !== "" && taskText === taskInput.value.trim()) {
            taskInput.value = "";
        }
    }

    // -----------------------------
    // 5. Event listeners
    // -----------------------------

    // When the "Add Task" button is clicked
    addButton.addEventListener('click', function () {
        addTask(); // reads from input and saves
    });

    // Allow adding a task when the Enter key is pressed
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // -----------------------------
    // 6. Initialize: load tasks from Local Storage
    // -----------------------------
    loadTasks();

});
