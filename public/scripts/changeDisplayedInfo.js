const tempbutton=document.getElementById("temp")
const windbutton=document.getElementById("wind")
const pressurebutton=document.getElementById("pressure")
const tempview=document.getElementById("temp-view")
const windview=document.getElementById("wind-view")
const pressureview=document.getElementById("pressure-view")
tempbutton.addEventListener("click",setTempView )
windbutton.addEventListener("click", setWindView)
pressurebutton.addEventListener("click", setPressureView)
tempbutton.classList.add("active");
function setTempView() {
    console.log("temp in view");
    windbutton.classList.remove("active");
    tempbutton.classList.add("active");
    pressurebutton.classList.remove("active");

    tempview.style.display="flex"
    windview.style.display="none"
    pressureview.style.display="none"
}

function setWindView() {
    console.log("wind in view");
    windbutton.classList.add("active");
    tempbutton.classList.remove("active");
    pressurebutton.classList.remove("active");

    tempview.style.display="none"
    windview.style.display="flex"
    pressureview.style.display="none"
}

function setPressureView() {
    console.log("Pressure in view");
    windbutton.classList.remove("active");
    tempbutton.classList.remove("active");
    pressurebutton.classList.add("active");

    tempview.style.display="none"
    windview.style.display="none"
    pressureview.style.display="flex"
}