## Day 1 HTML, CSS, JS

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Task and Notes</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header id="main-header">
      <!-- Logo -->
      <div class="logo">My Project</div>

      <!-- Desktop Navigation Bar -->
      <nav id="desktop-nav">
        <a href="#dashboard" id="nav-dashboard">Dashboardsssss</a>
        <a href="#tasks" id="nav-tasks">Tasks</a>
        <a href="#notes" id="nav-notes">Notes</a>
        <span id="user-info"></span>
        <!-- add none to below button -->
        <button id="logout-btn" style="display: none">Logout</button>
      </nav>

      <!-- Mobile Navigation Bar -->
      <button class="hamburger" id="hamburger-button">☰</button>
      <div id="mobile-nav" class="mobile-nav" style="display: none">
        <a href="#dashboard" id="mobile-nav-dashboard">Dashboard</a>
        <a href="#tasks" id="mobile-nav-tasks">Tasks</a>
        <a href="#notes" id="mobile-nav-notes">Notes</a>
        <div class="mobile-user-info">
          <span id="mobile-user-email"></span>
          <button id="mobile-logout-btn">Logout</button>
        </div>
    </header>

    <main>
      <!-- Section 2 LogIn Form -->
      <section id="login-section" class="page-section">
        <h2>Login</h2>
        <form id="login-form" class="auth-form">
          <input id="login-email" type="email" placeholder="Email" required />
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="#signup">Sign Up</a></p>
          <div id="login-errors" class="auth-error"></div>
        </form>
      </section>

      <!-- Section 2 SignUp Form -->
      <section id="signup-section" class="page-section">
        <h2>Sign Up</h2>
        <form id="signup-form" class="auth-form">
          <input
            id="signup-username"
            type="text"
            placeholder="Username"
            required
          />
          <input id="signup-email" type="email" placeholder="Email" required />
          <input
            id="signup-password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Signup</button>
          <p>Already have an account? <a href="#login">Login</a></p>
          <div id="signup-errors" class="auth-error"></div>
        </form>
      </section>
    </main>
  </body>
  <script src="./app.js"></script>
</html>

```

```css
:root {
  --primary-color: #6366f1;
  --surface-color: #fff;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --border-radius: 8px;
  --header-height: 60px;
  --sidebar-width: 220px;
  --font-family: "Inter", Arial, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-family);
  background: #f6f7fb;
  color: #222;
}


header {
  height: var(--header-height);
  background: var(--primary-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: var(--box-shadow);
}

/* Desktop Nav CSS Starts Here */
nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

nav a.active,
nav a:hover {
  background: rgba(255, 255, 255, 0.15);
}

nav a.active,
nav a:active {
  background: #e0e7ff;
  color: #3730a3;
  font-weight: bold;
  text-decoration: underline;
}

button {
  font-family: inherit;
}

/* Desktop Nav CSS Ends Here */

/* Mobile Nav CSS Starts Here */
.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  margin-left: 1rem;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  gap: 1rem;
  background: var(--primary-color);
  position: absolute;
  top: var(--header-height);
  left: 0;
  width: 100vw;
  padding: 1rem 0;
  z-index: 100;
  box-shadow: var(--box-shadow);
}

.mobile-nav a {
  color: #fff;
  font-size: 1.2rem;
  padding: 0.5rem 2rem;
  border-radius: 0;
  text-align: left;
}

.mobile-user-info {
  color: #fff;
  padding: 0.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-user-info button {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.mobile-nav a.active,
.mobile-nav a:active {
  background: #e0e7ff;
  color: #3730a3;
  font-weight: bold;
  text-decoration: underline;
}
/* Mobile CSS Ends Here */

/* Media Query for Nav Bar */
/* Below CSS Only Applied if Screen Width is <= 800px */
@media (max-width: 800px) {
  header {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 1rem;
    position: relative;
  }

  nav {
    display: none;
  }

  .hamburger {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1.5rem;
  }

  .mobile-nav {
    display: flex;
  }
}

/* Media Query for Nav Bar Ends Here */

/* Desktop Logout Button CSS */
#logout-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: background 0.2s;
}
#logout-btn:hover {
  background: #b91c1c;
}
/* Desktop Logout Button CSS Ends Here */

/* Mobile Logout Button CSS */
.mobile-user-info button {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.mobile-user-info button:hover {
  background: #b91c1c;
}
/* Mobile Logout Button CSS Ends Here */

/* ---------------------------------------------------------------------------- */


/* Main CSS Starts Here */

/* CSS for Login and Signup */
.page-section {
  display: block;  /* chanage to none */
  max-width: 800px;
  margin: 2rem auto;
  background: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.page-section.active {
  display: block;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 350px;
  margin: 2rem auto 0 auto;
  background: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}
.auth-form input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.auth-form button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.auth-form button:hover {
  background: #4f46e5;
}
.auth-form p {
  margin: 0;
  font-size: 0.95rem;
  text-align: center;
}
.auth-error {
  color: #dc3545;
  font-size: 0.95rem;
  min-height: 1.2em;
  text-align: center;
}

@media (max-width: 600px) {
  .logo {
    font-size: 1.2rem;
  }
  .page-section {
    padding: 1rem;
  }
  .auth-form {
    padding: 1rem;
    max-width: 100%;
  }
}

/* CSS for Login and Signup Ends Here */
```

```javascript
let currentUser = true;

const sections = {
    login: document.getElementById('login-section'),
    signup: document.getElementById('signup-section')

    // task
    // notes
};

function renderHeader() {
    const userInfo = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-btn");
    const desktopNavLinks = document.getElementById("desktop-nav");

    if (currentUser === null) {
        userInfo.textContent = "";
        logoutButton.style.display = "none";
        desktopNavLinks.querySelector("nav-dashboard").style.display = "none"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "none"
        desktopNavLinks.querySelector("#nav-notes").style.display = "none"
    } else {
        userInfo.textContent = "ranom@gmail.com";
        logoutButton.style.display = "inline";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "inline"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "inline"
        desktopNavLinks.querySelector("#nav-notes").style.display = "inline"
    }

}

renderHeader()



function initialize() {
    const signUpForm = document.getElementById('signup-form');
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();  // prevents default behaviour

        // get the values
        const userName = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // If a user exists by the same email

        // If a user not exist by the eneterd email

        // show him the dashboard
        // saving to local storage

        // create an entry
        currentUser = {
            id: Date.now(),
            userName,
            email,
            password
        }
        localStorage.setItem("user", JSON.stringify(currentUser));

    })




    // login form logic
    


    
}

initialize();



function route() {
    const hash = window.location.hash || '#';
    renderHeader();

    if(currentUser) {
        const page = hash.substring(1) || 'dashboard'; //

        switch(page) {
            case 'dashboard':
                // renderDashboard();
                break;
            case 'tasks': 
                // renderTasks();
                break;
            case 'notes':
                    // renderNotes();
                    break;
            default:
                // renderDashboard();
        }
        

    } else {
        if(hash === '#signup') {
            // showSignUp() 
        } else {
            // showLogIn();
        }

    }
}


// hw
// try to get values of the form using onChange event
```