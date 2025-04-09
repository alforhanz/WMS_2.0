/////////////////////scripts del Login//////////////////////////////////////////////////////

const rmCheck = document.getElementById("remember-me");
const emailInput = document.getElementById("username");
let password = document.getElementById('password');
let Mostrar = document.getElementById('Mostrar');
let click = false;

//muestra el password
Mostrar.addEventListener('click', (e) => {
  if (!click) {
    password.type = 'text'
    document.getElementById('Mostrar').textContent = 'visibility_off'
    click = true
  } else if (click) {
    password.type = 'password'
    document.getElementById('Mostrar').textContent = 'visibility'
    click = false
  }
});

if (localStorage.checkbox && localStorage.checkbox !== "") {
  rmCheck.setAttribute("checked", "checked");
  emailInput.value = localStorage.username;
  password.value = localStorage.password;
} else {
  rmCheck.removeAttribute("checked");
  emailInput.value = "";
}

window.onload = function () {
  Object.keys(localStorage).forEach(function (key) {
    localStorage.removeItem(key);
  });
}  

  ///////////acciona el login con el boton enter  
  document.addEventListener("DOMContentLoaded", function () {
  const bodyMaster = document.getElementById('login');
  const passwordInput = document.getElementById('password');
  const usernameInput = document.getElementById('username');

   // Controlador de eventos para el body del login
   bodyMaster.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });

  // Controlador de eventos para el campo de contraseña
  passwordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });

  // Controlador de eventos para el campo de usuario
  usernameInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });
});

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function login() {

  let usuario = document.querySelector("#username").value;
  let pass = document.querySelector("#password").value;

  //------------------guarda datos recordar-------------------
  if (rmCheck.checked && usuario.value !== "" && pass.value !== "") {
    localStorage.username = usuario;
    localStorage.password = pass;
    localStorage.checkbox = rmCheck.value;
    //console.log("Esta guardando los datos");
  } else {
    localStorage.username = "";
    localStorage.checkbox = "";
  }

  //-----------------user and pass validation--------------
  if (usuario == "") {
    Swal.fire({
      text: "Por favor ingrese su nombre de usuario",
      confirmButtonColor: "#000",
    });
    document.getElementById("username").focus();
  } else if (pass == "") {
    Swal.fire({
      text: "Por favor ingrese la contraseña",
      confirmButtonColor: "#000",
    });
  } else {
    //DATA INFORMATION(USER AND PASS)
    const data = { username: usuario, password: pass };
    //console.log(data);
    fetch(env.API_URL + "index.php/auth/login", {
      //TRAE MODULOS PARA EL USUARIO
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      //mode: "cors",  // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //  "Access-Control-Allow-Origin": "*",
      },body: JSON.stringify(data),})
          .then((response) => response.json())
          .then((result) => {

          if (result.msg === "SUCCESS") {
            console.log("Esta pasando por el login");
            console.log(result.msg);            
            localStorage.setItem('username', result.username);
            sessionStorage.setItem("tokens", JSON.stringify(result.access_token));
            sessionStorage.setItem("user", JSON.stringify(result.username));
            sessionStorage.setItem("compania", JSON.stringify(result.compania));            
            sessionStorage.setItem("bodega", JSON.stringify(result.bodega));
            sessionStorage.setItem("_priv", JSON.stringify(result.priv));         

            //DECLARACION DEL TOAST INICIO DE SESION
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "Iniciando Bremen.security configuración",
            }).then(function () {             
              window.location = "home.html";
            });
          } else {
          Swal.fire({
            icon: "error",
            title: "Usuario o contraseña inválida",
            text: "Por favor comuníquese con nuestro equipo de soporte.",
            confirmButtonColor: "#28a745",
          });
          document.querySelector("#username").va("");
          document.querySelector("#password").val("");
        }
      });
  }
}