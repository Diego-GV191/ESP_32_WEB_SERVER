// variables de control de ESP32 
var btnLedBuilt = document.getElementById('btn-led-built');

/** Parte logica */
btnLedBuilt.addEventListener('click', () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
    xhttp.open("GET", "/btn-built", true);
    xhttp.send();
})


/** Control del Circular Progress Bar */
let TiempoDeMuestreo = 500;
// Temperatura CPU
let progressCircular = document.querySelector(".progress-circular");
let value = document.querySelector(".value");
let start = 0;
let endValue = 0;

setInterval(() => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            endValue = parseInt(this.responseText, 10);
        }
    }
    xhttp.open("GET", "/temp-cpu", true);
    xhttp.send();
    let progress = setInterval(() => {
        if (start < endValue) {
            start++;
            progressEnd();
        } else if (start > endValue) {
            start--;
            progressEnd();
        } else {
            clearInterval(progress);
        }

        function progressEnd() {
            if (start == endValue) {
                clearInterval(progress);
            }
            value.textContent = `${start}°C`;
            progressCircular.style.background = `conic-gradient(rgba(85, 85, 255, 0.685) ${start * 3.6}deg, rgba(255, 255, 255, 0) 0deg)`;
        }
    }, 50);
}, TiempoDeMuestreo);

// Lectura de sensor
let progressCircularSensor = document.querySelector(".progress-circular-sensor-1");
let valueSensor = document.querySelector(".value-sensor-1");
let startSensor = 0;
let endValueSensor = 0;
let valorDegres = 0.087890625;

setInterval(() => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            endValueSensor = parseInt(this.responseText, 10);
            valueSensor.textContent = `${endValueSensor}`;
            progressCircularSensor.style.background = `conic-gradient(rgba(85, 85, 255, 0.685) ${endValueSensor * valorDegres}deg, rgba(255, 255, 255, 0) 0deg)`;
        }
    }
    xhttp.open("GET", "/AnalogSensor", true);
    xhttp.send();
}, TiempoDeMuestreo);

/** Control del tema de la pagina con ESP32 */
var themeSystem = window.matchMedia('(prefers-color-scheme: dark)');
var btnTheme = document.getElementById('btn-theme');
var auxThemeWeb1 = true;
// Cambiar de tema
btnTheme.addEventListener('click', () => {
    if (auxThemeWeb1) {
        changeTheme(false);
        auxThemeWeb1 = false;
        localStorage.setItem("WebTheme", JSON.stringify(auxThemeWeb1));
    } else {
        changeTheme(true);
        auxThemeWeb1 = true;
        localStorage.setItem("WebTheme", JSON.stringify(auxThemeWeb1));
    }
})

// Detecta el tema del sistema opertivo al cargar la pagina
document.body.onload = () => {
    if (localStorage.getItem("WebTheme")) {
        changeTheme(JSON.parse(localStorage.getItem("WebTheme")));
    } else {
        changeTheme(themeSystem.matches);
    }
}

// Detecta el cambio de tema del sistema
themeSystem.addEventListener('change', event => {
    localStorage.setItem("WebTheme", JSON.stringify(event.matches));
    changeTheme(event.matches);
})

// Aplicar estilos
function changeTheme(value) {
    // variables del tema de la pagina
    let themeBody = document.body;
    let themeTitulo = document.getElementById('titulo');
    let themeNav = document.getElementById('nav');
    let themeFooter = document.getElementById('footer');
    let themeDegres = document.querySelectorAll('.grados');
    let themeBtn = document.querySelectorAll('.btn');
    let themeProgressCircularBar = document.querySelectorAll(".progress-circular");
    let themeInfoCPB = document.querySelectorAll('.textoInfoCPB');

    if (value) {
        themeBody.classList.remove('light-body');
        themeBody.classList.add('dark-body');
        themeTitulo.classList.remove('light-title');
        themeTitulo.classList.add('dark-title');
        themeNav.classList.remove('light-navBar');
        themeNav.classList.add('dark-navBar');
        themeFooter.style.color = '#fff';

        /**
         *  Si son varios componentes con la misma clase
         *  Se requiere usar un for o algun metodo para
         *  cambiar el estilo uno por uno
         */
        for (let index = 0; index < themeDegres.length; index++) {
            themeDegres[index].classList.remove('light-CPB-Number');
            themeDegres[index].classList.add('dark-CPB-Number');
        }
        for (let index = 0; index < themeProgressCircularBar.length; index++) {
            themeProgressCircularBar[index].classList.remove('light-progress-circular');
            themeProgressCircularBar[index].classList.add('dark-progress-circular');
        }
        for (let index = 0; index < themeBtn.length; index++) {
            themeBtn[index].classList.remove('light-button');
            themeBtn[index].classList.add('dark-button');
        }
        for (let index = 0; index < themeInfoCPB.length; index++) {
            themeInfoCPB[index].classList.remove('light-texto-Info-CPB');
            themeInfoCPB[index].classList.add('dark-texto-Info-CPB');
        }
        auxThemeWeb1 = true;
    } else {
        themeBody.classList.remove('dark-body');
        themeBody.classList.add('light-body');
        themeTitulo.classList.remove('dark-title');
        themeTitulo.classList.add('light-title');
        themeNav.classList.remove('dark-navBar');
        themeNav.classList.add('light-navBar');
        themeFooter.style.color = '#000';
        for (let index = 0; index < themeDegres.length; index++) {
            themeDegres[index].classList.remove('dark-CPB-Number');
            themeDegres[index].classList.add('light-CPB-Number');
        }
        for (let index = 0; index < themeProgressCircularBar.length; index++) {
            themeProgressCircularBar[index].classList.remove('dark-progress-circular');
            themeProgressCircularBar[index].classList.add('light-progress-circular');
        }
        for (let index = 0; index < themeBtn.length; index++) {
            themeBtn[index].classList.remove('dark-button');
            themeBtn[index].classList.add('light-button');
        }
        for (let index = 0; index < themeInfoCPB.length; index++) {
            themeInfoCPB[index].classList.remove('dark-texto-Info-CPB');
            themeInfoCPB[index].classList.add('light-texto-Info-CPB');
        }
        auxThemeWeb1 = false;
    }
}