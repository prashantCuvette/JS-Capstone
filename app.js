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