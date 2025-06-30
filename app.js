let currentUser = null;

const sections = {
    login: document.getElementById('login-section'),
    signup: document.getElementById('signup-section'),
    dashboard: document.getElementById('dashboard-section'),
    tasks: document.getElementById('tasks-section'),

    // task
    // notes
};

function renderHeader() {
    const userInfo = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-btn");
    const desktopNavLinks = document.getElementById("desktop-nav");


    if (currentUser) {
        userInfo.textContent = currentUser.email;
        logoutButton.style.display = "block";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "inline"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "inline"
        desktopNavLinks.querySelector("#nav-notes").style.display = "inline"

    } else {
        userInfo.textContent = "";
        logoutButton.style.display = "none";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "none"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "none"
        desktopNavLinks.querySelector("#nav-notes").style.display = "none"
    }

    // implement logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.hash = "#login"
        currentUser = null;
        route();
    })
}




function initialize() {

    // SignUp Handler
    const signUpForm = document.getElementById('signup-form');
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();  // prevents default behaviou

        // get the values
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
            })

            const createdUser = await createUser.json();
            currentUser = createdUser;
            console.log("signup", currentUser)

            // save the current user to local storage
            localStorage.setItem("user", JSON.stringify(currentUser));

            // show dashboard
            window.location.hash = "dashboard";
            route();

        } catch (err) {
            document.getElementById('signup-errors').textContent = err.message;
        }
    });

    // login Handler
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            if (data.length === 0) {
                throw new Error("Invalid Credentials")
            }

            const user = data.find(item => item.password === password);
            currentUser = user
            console.log("login", currentUser)
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.location.hash = 'dashboard';
            route();

        } catch (err) {
            document.getElementById('login-errors').textContent = err.message;
        }


    })

    // Default Handler. User might already be logged in
    currentUser = localStorage.getItem('user');
    route();

    window.onhashchange = route; // this will store the function reference of route and will get called everytime when we run the app and there is any change in the hash

}
initialize();




function route() {
    const hash = window.location.hash || '#';
    // initial render value of hash = #
    renderHeader();

    if (currentUser) {
        const page = hash.substring(1) || 'dashboard'; //
        showSections(page);
        switch (page) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'tasks':
                // renderTasks();
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
}


function showSections(name) {

    // remove the display: block property from each section
    const values = Object.values(sections);
    values.forEach((item) => {
        item.classList.remove('active')
    });

    // only add active property to currently visible section
    if (sections[name]) {
        sections[name].classList.add('active')
    }
}

function renderDashboard() {
    sections.dashboard.innerHTML = `
        <h2>Welcome to your Dashboard</h2> ${JSON.parse(currentUser).userName} !<p> Choose Either Tasks or Notes to Get Started</p>
    `;

    setActiveNavLink();
}

function setActiveNavLink() {
    const hash = window.location.hash || "#dashboard";
    console.log(hash)

    const navLinks = {
        dashboard: document.getElementById('nav-dashboard'),
        tasks: document.getElementById('nav-tasks'),
        notes: document.getElementById('nav-notes')
    }

    const navData = Object.values(navLinks);
    navData.forEach((item) => {
        item.classList.remove('active');
        if (hash.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
}

function renderTasks() {
    let users = [];
    let tasks = [];

    Promise.all([
        fetch(`http://localhost:3000/users`).then(res => res.json()),
        fetch(`http://localhost:3000/tasks?userId=${currentUser.id}`).then(res => res.json())
    ]).then(([fetchedUsers, fetchedTasks]) => {
        users = fetchedUsers;
        tasks = fetchedTasks;
    }).catch((err) => console.log("Some Error Occurred"))

    const addTaskButton = document.getElementById('add-task-btn');

    addTaskButton.addEventListener('click', () => {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('add-task-form');

        modal.style.display = "flex";

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newTask = {
                userId: currentUser.id,
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-desc'),
                priority: document.getElementById('task-priority').value,
                color: document.getElementById('task-color').value,
                createdAt: new Date().toISOString()
            };

            await addTask(newTask);
        });


        // saving to local storage if data got saved in database
        async function addTask(task) {
            const savedTask = syncTaskToServer(task);
            if(savedTask) {
                tasks.push(savedTask);
                let storageTask = [...tasks]
                localStorage.setItem('tasks', JSON.stringify(storageTask))

            }
        }


        // first my data should be saved on the database then only save in local storage
        async function syncTaskToServer(task) {
            try {
                const res = await fetch('http://localhost:3000/tasks', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(task)
                })

                return await res.json();

            } catch(err) {
                console.log("Failed to Store tasks on server", err)
                return null;
            }
        }



    })

    function renderList() {
        
    }





}

renderTasks()



