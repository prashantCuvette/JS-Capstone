let currentUser = null;

const sections = {
    login: document.getElementById('login-section'),
    signup: document.getElementById('signup-section'),
    dashboard: document.getElementById('dashboard-section'),
    tasks: document.getElementById('tasks-section'),
    notes: document.getElementById('notes-section')
};

// Logout handler - defined once
function handleLogout() {
    localStorage.removeItem('user');
    currentUser = null;
    window.location.hash = "#login";
    route();
}

function renderHeader() {
    const userInfo = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-btn");
    const desktopNavLinks = document.getElementById("desktop-nav");

    if (currentUser) {
        userInfo.textContent = currentUser.email;
        logoutButton.style.display = "block";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "inline";
        desktopNavLinks.querySelector("#nav-tasks").style.display = "inline";
        desktopNavLinks.querySelector("#nav-notes").style.display = "inline";
    } else {
        userInfo.textContent = "";
        logoutButton.style.display = "none";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "none";
        desktopNavLinks.querySelector("#nav-tasks").style.display = "none";
        desktopNavLinks.querySelector("#nav-notes").style.display = "none";
    }
    setActiveNavLink();
}

// Bind logout once when DOM loads
document.getElementById("logout-btn").addEventListener('click', handleLogout);

function initialize() {
    // SignUp Handler
    const signUpForm = document.getElementById('signup-form');
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userName = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.length > 0) {
                throw new Error("Email Exists");
            }

            const createUser = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, email, password })
            });

            const createdUser = await createUser.json();
            currentUser = createdUser;
            localStorage.setItem("user", JSON.stringify(currentUser));

            window.location.hash = "dashboard";
            route();

        } catch (err) {
            document.getElementById('signup-errors').textContent = err.message;
        }
    });

    // Login Handler
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            if (data.length === 0) {
                throw new Error("Invalid Credentials");
            }

            const user = data.find(item => item.password === password);
            if (!user) {
                throw new Error("Invalid Credentials");
            }

            currentUser = user;
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.location.hash = 'dashboard';
            route();

        } catch (err) {
            document.getElementById('login-errors').textContent = err.message;
        }
    });

    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    currentUser = storedUser ? JSON.parse(storedUser) : null;

    route();
    window.onhashchange = route;
}
initialize();

function route() {
    const hash = window.location.hash || '#';
    renderHeader();

    if (currentUser) {
        const page = hash.substring(1) || 'dashboard';
        showSections(page);
        switch (page) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'tasks':
                renderTasks();
                break;
            case 'notes':
                // renderNotes();
                break;
            default:
                showSections('dashboard');
                renderDashboard();
        }
    } else {
        if (hash === '#signup') {
            showSections('signup');
        } else {
            showSections('login');
        }
    }
    setActiveNavLink();
}

function showSections(name) {
    Object.values(sections).forEach(item => item.classList.remove('active'));
    if (sections[name]) {
        sections[name].classList.add('active');
    }
}

function renderDashboard() {
    sections.dashboard.innerHTML = `
        <h2>Welcome to your Dashboard</h2> ${currentUser.userName} !<p>Choose Either Tasks or Notes to Get Started</p>
    `;
    setActiveNavLink();
}

function setActiveNavLink() {
    const hash = window.location.hash || '#dashboard';
    ['nav-dashboard', 'nav-tasks', 'nav-notes', 'mobile-nav-dashboard', 'mobile-nav-tasks', 'mobile-nav-notes'].forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.classList.remove('active');
            if (hash.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        }
    });
}

// renderTasks function
// Create Read Update Delete (CRUD) operations for tasks

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
        try{
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
            if(!result) {
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
    const {createTask, readTasks, updateTask, deleteTask} = tasksCRUD(currentUser.id);

    let tasks = [];

    readTasks().then((data) =>  {
        tasks = data;
        renderList();
    })

    function renderList() {
        const list = document.getElementById("tasks-list");
        if(!list) return;

        // list.innerHTML = tasks.length ? tasks.map(taskItemHTML).join("") : "<p>No tasks found</p>";

        if (tasks.length > 0) {
            list.innerHTML = tasks.map((item) => taskItemHTML(item)).join("");
        } else {
            list.innerHTML = "<p>No tasks found</p>";
        }   
    }
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



