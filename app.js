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

    if(currentUser === null) {
        userInfo.textContent="";
        logoutButton.style.display="none";
        desktopNavLinks.querySelector("nav-dashboard").style.display="none"
        desktopNavLinks.querySelector("#nav-tasks").style.display="none"
        desktopNavLinks.querySelector("#nav-notes").style.display="none"
    } else {
        userInfo.textContent = "ranom@gmail.com";
        logoutButton.style.display = "inline";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "inline"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "inline"
        desktopNavLinks.querySelector("#nav-notes").style.display = "inline"
    }

}

renderHeader();

function renderSignUp(){

}

renderSignUp()

function renderLogIn() {

}

renderLogIn()


