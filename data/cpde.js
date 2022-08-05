// variables de control de ESP32 
var DEBUG = false;

// Funciones
function toggleButton(element, StateBtn) {
    var xhttp = new XMLHttpRequest();
    if (StateBtn) { xhttp.open("GET", "/update?output=" + element.id + "&status=1", true); }
    else { xhttp.open("GET", "/update?output=" + element.id + "&status=0", true); }
    xhttp.send();
}

/** Parte logica */
// boton salida 2
var btnLedBuilt1 = document.querySelector('.btn-led-built');
let StateBtnLedBuilt1 = true;
btnLedBuilt1.addEventListener('click', () => {
    if (!DEBUG) {
        toggleButton(btnLedBuilt1, StateBtnLedBuilt1);
        let statusButton = document.querySelector('.salida-2');
        if (StateBtnLedBuilt1) {
            statusButton.classList.remove('status-LOW');
            statusButton.classList.add('status-HIGH');
            StateBtnLedBuilt1 = false;
        }
        else {
            statusButton.classList.remove('status-HIGH');
            statusButton.classList.add('status-LOW');
            StateBtnLedBuilt1 = true;
        }
    }
})

//boton salida 3
var btnLedBuilt2 = document.querySelector('.btn-led-3');
let StateBtnLedBuilt2 = true;
btnLedBuilt2.addEventListener('click', () => {
    if (!DEBUG) {
        toggleButton(btnLedBuilt2, StateBtnLedBuilt2);
        let statusButton = document.querySelector('.salida-3');
        if (StateBtnLedBuilt2) {
            statusButton.classList.remove('status-LOW');
            statusButton.classList.add('status-HIGH');
            StateBtnLedBuilt2 = false;
        }
        else {
            statusButton.classList.remove('status-HIGH');
            statusButton.classList.add('status-LOW');
            StateBtnLedBuilt2 = true;
        }
    }
})

/** Control del Circular Progress Bar */
let TiempoDeMuestreo = 500;
// Temperatura CPU
let progressCircular = document.querySelector(".progress-circular");
let value = document.querySelector(".value");
let start = 0;
let endValue = 0;

if (!DEBUG) {
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
}

// Lectura de sensor
let progressCircularSensor = document.querySelector(".progress-circular-sensor-1");
let valueSensor = document.querySelector(".value-sensor-1");
let startSensor = 0;
let endValueSensor = 0;
let valorDegres = 0.087890625; // 360/4096

if (!DEBUG) {
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
}

/** Control del tema de la pagina con ESP32 */
var themeSystem = window.matchMedia('(prefers-color-scheme: dark)');
var btnTheme = document.getElementById('btn-theme');
var auxThemeWeb1 = true;
// Cambiar de tema
// boton 1
// btnTheme.addEventListener('click', () => {
//     if (auxThemeWeb1) {
//         changeTheme(false);
//         auxThemeWeb1 = false;
//         localStorage.setItem("WebTheme", JSON.stringify(auxThemeWeb1));
//     } else {
//         changeTheme(true);
//         auxThemeWeb1 = true;
//         localStorage.setItem("WebTheme", JSON.stringify(auxThemeWeb1));
//     }
// })

// boton 2 switch
let toggleSwitch = document.querySelector('.toggle');
let textSW = document.querySelector('.text');
let buttonSW = document.querySelector('#ButtonSW');
toggleSwitch.addEventListener('click', () => {
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
    let themeCheckButton = document.querySelectorAll('.checkButton');

    if (value) {
        themeBody.classList.remove('light-body');
        themeBody.classList.add('dark-body');
        themeTitulo.classList.remove('light-title');
        themeTitulo.classList.add('dark-title');
        themeNav.classList.remove('light-navBar');
        themeNav.classList.add('dark-navBar');
        themeFooter.style.color = '#fff';
        toggleSwitch.classList.remove('light-active-SW');
        toggleSwitch.classList.add('dark-active-SW');
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
        for (let index = 0; index < themeCheckButton.length; index++) {
            themeCheckButton[index].classList.remove('light-checkButton');
            themeCheckButton[index].classList.add('dark-checkButton');
        }
        auxThemeWeb1 = true;
        // btnSwitchTheme.ariaChecked = true;
    } else {
        themeBody.classList.remove('dark-body');
        themeBody.classList.add('light-body');
        themeTitulo.classList.remove('dark-title');
        themeTitulo.classList.add('light-title');
        themeNav.classList.remove('dark-navBar');
        themeNav.classList.add('light-navBar');
        themeFooter.style.color = '#000';
        toggleSwitch.classList.remove('dark-active-SW');
        toggleSwitch.classList.add('light-active-SW');
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
        for (let index = 0; index < themeCheckButton.length; index++) {
            themeCheckButton[index].classList.remove('dark-checkButton');
            themeCheckButton[index].classList.add('light-checkButton');
        }
        auxThemeWeb1 = false;
        // btnSwitchTheme.ariaChecked = false;
    }
}