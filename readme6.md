# Day 6 JS

```javascript

function tasksCRUD(currentUserID) {

    const STORAGE_KEY = "tasks-" + currentUserID;
    const BASE_URL = "http://localhost:3000/tasks";

    function loadTasksFromLocal() {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return tasks ? tasks : [];
    }

    function saveTasksToLocal(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    async function createTask(task) {
        try {
            task.userId = currentUserID;
            task.completed = false;
            task.createdAt = new Date().toISOString();

            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });

            const savedTask = await response.json();

            const localTasks = loadTasksFromLocal(); // [] || tasks
            localTasks.push(savedTask);
            saveTasksToLocal(localTasks);

        } catch (err) {
            console.log("Error creating task:", err);
            return null;
        }

    }


    // ?userId=currentUserID
    async function readTasks() {
        try {
            const response = await fetch(`${BASE_URL}?userId=${currentUserID}`);
            const tasks = await response.json();
            saveTasksToLocal(tasks);
            return tasks;
        } catch (err) {
            console.log("Error reading tasks:", err);
            return loadTasksFromLocal(); // Fallback to local storage
        }
    }

    // updateTask
    // http://localhost:3000/tasks/:taskId
    async function updateTask(taskId, updatedTask) {
        try {
            const response = await fetch(`${BASE_URL}/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });

            const result = await response.json();
            if (!result) {
                alert("Task not found or update failed");
                return null;
            }

            let localTasks = loadTasksFromLocal();

            localTasks = localTasks.map((item) => {
                if (item.id === taskId) {
                    return { ...item, ...updatedTask };
                }
                return item;
            });

            saveTasksToLocal(localTasks);
            return true;




        } catch (error) {
            console.log("Error updating task:", error);
            return null;
        }


    }

    // deleteTask
    // http://localhost:3000/tasks/:taskId
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${BASE_URL}/${taskId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (!result) {
                alert("Task not found or deletion failed");
                return null;
            }

            let localTasks = loadTasksFromLocal();
            localTasks = localTasks.filter((item) => item.id !== taskId);
            saveTasksToLocal(localTasks);
            return true;

        } catch (error) {
            console.log("Error deleting task:", error);
            return null;
        }
    }

    return {
        createTask,
        readTasks,
        updateTask,
        deleteTask
    }
}

function renderTasks() {

    // console.log("Rendering Tasks...");
    const { createTask, readTasks, updateTask, deleteTask } = tasksCRUD(currentUser.id);

    let tasks = [];

    readTasks().then((data) => {
        tasks = data;
        renderList();
    })

    function renderList() {
        const list = document.getElementById("tasks-list");
        if (!list) return;

        // list.innerHTML = tasks.length ? tasks.map(taskItemHTML).join("") : "<p>No tasks found</p>";

        if (tasks.length > 0) {
            list.innerHTML = tasks.map((item) => taskItemHTML(item)).join("");
        } else {
            list.innerHTML = "<p>No tasks found</p>";
        }


        // add delete and edit

        tasks.forEach((task) => {
            const checkBtn = document.getElementById('task-check-' + task.id)
            checkBtn.addEventListener('change', async (e) => {
                updateTask(task.id, { completed: e.target.checked }).then(() => renderTasks());
            })

            const delBtn = document.getElementById('task-del-' + task.id);
            delBtn.addEventListener('click', async () => {
                deleteTask(task.id).then(() => renderTasks());
            })

            const editBtn = document.getElementById('task-edit-' + task.id);
            editBtn.addEventListener('click', () => {
                showEditTaskModal(task, updateTask, renderTasks);
            })
        })
    }

    const addTaskButton = document.getElementById("add-task-btn");
    // console.log(addTaskButton);

    addTaskButton.addEventListener("click", () => {
        const modal = document.getElementById("task-modal");
        const form = document.getElementById("add-task-form");

        // modal.style.display = "flex";

        document.getElementById("task-modal-title").textContent = "Add New Task";
        form.reset();

        // easyMDE initialization
        setTimeout(() => {
            if (window.easyMDETask) {
                window.easyMDETask.toTextArea();
                window.easyMDETask = new EasyMDE({
                    element: document.getElementById("task-desc"),
                    autoDownloadFontAwesome: true,
                    minHeight: "200px",
                    status: false
                })
            }
        }, 100)

        form.onsubmit = async () => {
            try {
                const newTask = {
                    title: document.getElementById("task-title").value,
                    description: document.getElementById("task-desc").value,
                    priority: document.getElementById("task-priority").value,
                    color: document.getElementById("task-color").value
                }

                await createTask(newTask);
                modal.style.display = "none";
                renderTasks();

            } catch (err) {
                console.error("Error adding task:", err);
            }
        }
        modal.onclick = (event) => {
            console.log(event)
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
        modal.style.display = "flex";

    })
}


function showEditTaskModal(task, updateTask, renderTasks) {
    // console.log("showEditTaskModal called for task:");
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("add-task-form");

    document.getElementById("task-modal-title").textContent = "Update the Task";
    form.querySelector("button[type='submit']").textContent = "Update Task";

    // fill the existing values in the form
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-color").value = task.color;

    // easyMDE initialization

    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedTask = {
                title: document.getElementById("task-title").value,
                description: document.getElementById("task-desc").value,
                priority: document.getElementById("task-priority").value,
                color: document.getElementById("task-color").value
            }

            await updateTask(task.id, updatedTask);
            modal.style.display = "none";
            renderTasks();
        } catch (err) {
            console.error("Error updating task:", err);
        }
}
    modal.onclick = (event) => {
        console.log(event)
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    modal.style.display = "flex";
}

// tasks.map((item) => taskItemHTML(item)


// () => {}
// function () {}


// [{task1}, {task2}, {task3}]
//  => {task1} => (task) => {}

// this is used to render cards at each entry of tasks
function taskItemHTML(task) {
    return `
          <div class="task-item" data-color="${task.color}">
              <div class="task-header">
                  <h3>${escapeHTML(task.title)}</h3>
                  <div>
                      <button id="task-edit-${task.id
        }" class="task-edit-btn">✏️</button>
                      <input type="checkbox" id="task-check-${task.id}" ${task.completed ? "checked" : ""
        } />
                  </div>
              </div>
              <div class="task-description">${markdownToHTML(
            task.description
        )}</div>
              <div class="task-footer">
                  <span>${new Date(task.createdAt).toLocaleDateString()}</span>
                  <button id="task-del-${task.id}">🗑️</button>
              </div>
          </div>
      `;
}

// below function is used to change special symbols into an escaped HTML format
// > :gt; & :amp; &lt; :lt; &gt; :gt; " :quot; '
function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// this function is used to convert markdown to HTML using EasyMDE
// it checks if the EasyMDE editor is initialized before converting
function markdownToHTML(markdown) {
    if (!window.easyMDETask) return markdown; // Ensure editor is initialized
    return window.easyMDETask.markdown(markdown);
}

```