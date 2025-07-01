# Day 5 JS

```javascript
function taskCRUD(currentUserId) {
  const STORAGE_KEY = "tasks-" + currentUserId;
  const BASE_URL = "http://localhost:3000/tasks";

  // ======= Local Storage Helpers =======
  function loadTasksFromLocal() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveTasksToLocal(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ============ CREATE =============
  async function createTask(task) {
    try {
      task.userId = currentUserId;
      task.completed = false;
      task.createdAt = new Date().toISOString();

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const savedTask = await res.json();

      const localTasks = loadTasksFromLocal();
      localTasks.push(savedTask);
      saveTasksToLocal(localTasks);

      return savedTask;
    } catch (err) {
      console.error("❌ Failed to create task:", err);
      return null;
    }
  }

  // ============ READ =============
  async function readTasks() {
    try {
      const res = await fetch(`${BASE_URL}?userId=${currentUserId}`);
      const tasks = await res.json();
      saveTasksToLocal(tasks); // sync to local
      return tasks;
    } catch (err) {
      console.warn("⚠️ Failed to fetch tasks from server. Using local copy.");
      return loadTasksFromLocal();
    }
  }

  // ============ UPDATE =============
  async function updateTask(id, updates) {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Server error");

      // Sync localStorage
      let localTasks = loadTasksFromLocal();
      localTasks = localTasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      saveTasksToLocal(localTasks);

      return true;
    } catch (err) {
      console.error("❌ Failed to update task:", err);
      return false;
    }
  }

  // ============ DELETE =============
  async function deleteTask(id) {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Server error");

      const localTasks = loadTasksFromLocal().filter((t) => t.id !== id);
      saveTasksToLocal(localTasks);

      return true;
    } catch (err) {
      console.error("❌ Failed to delete task:", err);
      return false;
    }
  }

  // Return all CRUD methods
  return {
    createTask,
    readTasks,
    updateTask,
    deleteTask,
  };
}

function renderTasks() {
  const { createTask, readTasks, updateTask, deleteTask } = taskCRUD(
    currentUser.id
  );

  let tasks = [];

  // 1️⃣ Load & display tasks from server/localStorage
  readTasks().then((fetchedTasks) => {
    tasks = fetchedTasks;
    renderList();
  });

  // 2️⃣ Render tasks in the DOM
  function renderList() {
    const list = document.getElementById("tasks-list");
    if (!list) return;

    list.innerHTML = tasks.length
      ? tasks.map(taskItemHTML).join("")
      : "<p>No tasks yet. Add one to get started!</p>";

    // Bind check, delete, edit
    tasks.forEach((task) => {
      document.getElementById("task-check-" + task.id).onchange = (e) =>
        updateTask(task.id, { completed: e.target.checked }).then(() =>
          renderTasks()
        );

      document.getElementById("task-del-" + task.id).onclick = () =>
        deleteTask(task.id).then(() => renderTasks());

      document.getElementById("task-edit-" + task.id).onclick = () =>
        showEditTaskModal(task, updateTask, renderTasks);
    });
  }

  // 3️⃣ Show Add Task Modal
  document.getElementById("add-task-btn").onclick = () => {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("add-task-form");

    document.getElementById("task-modal-title").textContent = "Add Task";
    form.reset();

    setTimeout(() => {
      if (window.easyMDETask) window.easyMDETask.toTextArea();
      window.easyMDETask = new EasyMDE({
        element: document.getElementById("task-desc"),
        autoDownloadFontAwesome: false,
        minHeight: "100px",
        status: false,
      });
      window.easyMDETask.value("");
    }, 10);

    form.onsubmit = async (e) => {
      e.preventDefault();
      const newTask = {
        title: document.getElementById("task-title").value,
        description: window.easyMDETask.value(),
        priority: document.getElementById("task-priority").value,
        color: document.getElementById("task-color").value,
      };
      await createTask(newTask);
      modal.style.display = "none";
      renderTasks(); // re-render after adding
    };

    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
    modal.style.display = "flex";
  };
}

function taskItemHTML(task) {
  return `
        <div class="task-item" data-color="${task.color}">
            <div class="task-header">
                <h3>${escapeHTML(task.title)}</h3>
                <div>
                    <button id="task-edit-${
                      task.id
                    }" class="task-edit-btn">✏️</button>
                    <input type="checkbox" id="task-check-${task.id}" ${
    task.completed ? "checked" : ""
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

function showEditTaskModal(task, updateTask, rerender) {
  const modal = document.getElementById("task-modal");
  const form = document.getElementById("add-task-form");

  document.getElementById("task-modal-title").textContent = "Edit Task";
  form.querySelector('button[type="submit"]').textContent = "Update Task";

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-priority").value = task.priority;
  document.getElementById("task-color").value = task.color;

  setTimeout(() => {
    if (window.easyMDETask) window.easyMDETask.toTextArea();
    window.easyMDETask = new EasyMDE({
      element: document.getElementById("task-desc"),
      autoDownloadFontAwesome: false,
      minHeight: "100px",
      status: false,
    });
    window.easyMDETask.value(task.description || "");
  }, 10);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const updates = {
      title: document.getElementById("task-title").value,
      description: window.easyMDETask.value(),
      priority: document.getElementById("task-priority").value,
      color: document.getElementById("task-color").value,
    };
    await updateTask(task.id, updates);
    modal.style.display = "none";
    rerender(); // refresh after update
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
  modal.style.display = "flex";
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function markdownToHTML(markdown) {
  if (!window.easyMDETask) return markdown; // Ensure editor is initialized
  return window.easyMDETask.markdown(markdown);
}
```
