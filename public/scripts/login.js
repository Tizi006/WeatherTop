const login = document.getElementById("login-button");
const signUp = document.getElementById("sign-up-button");
const loginForm = document.getElementById("sign-in-container");
const signUpForm = document.getElementById("sign-up-container");
login.addEventListener('click', loginClick);
signUp.addEventListener('click', signUpClick);
login.classList.add("active-button");
signUpForm.style.display = "none";

function loginClick() {
    if (login.classList.contains("active-button")) {
    } else {
        login.classList.add("active-button")
        signUp.classList.remove("active-button")
        loginForm.style.display = "block";
        signUpForm.style.display = "none";
    }
}

function signUpClick() {
    if (signUp.classList.contains("active-button")) {

    } else {
    signUp.classList.add("active-button")
    login.classList.remove("active-button")
        signUpForm.style.display = "block";
        loginForm.style.display = "none";
}}