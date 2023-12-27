// Obtener el elemento raíz del documento (normalmente <html>)
const root = document.documentElement;

function login() {
  let usuario = document.querySelector("#username").value;
  let pass = document.querySelector("#password").value;

  //------------------guarda datos recordar-------------------
  if (rmCheck.checked && usuario.value !== "" && pass.value !== "") {
    localStorage.username = usuario;
    localStorage.password = pass;
    localStorage.checkbox = rmCheck.value;
    // console.log("Esta guardando los datos");
  } else {
    localStorage.username = "";
    localStorage.checkbox = "";
  }
  //-----------------user and pass validation--------------
  if (usuario == "") {
    Swal.fire({
      text: "Por favor ingrese su nombre de usuario",
      confirmButtonColor: "#f90f00",
    });
    document.getElementById("username").focus();
  } else if (pass == "") {
    Swal.fire({
      text: "Por favor ingrese la contraseña",
      confirmButtonColor: "#f90f00",
    });
  } else {
    //DATA INFORMATION(USER AND PASS)
    const data = { username: usuario, password: pass };
    console.log(data);
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
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === "SUCCESS") {
          sessionStorage.setItem("tokens", JSON.stringify(result.access_token));
          sessionStorage.setItem("user", JSON.stringify(result.username));
          sessionStorage.setItem("compania", JSON.stringify(result.compania));
          var compania = sessionStorage.getItem("compania");
          compania = compania.replace(/"/g, "");

          // compania = compania.replace(/"/g, "");
          sessionStorage.setItem("bodega", JSON.stringify(result.bodega));
          //PRIVILEGIOS (MODULOS)
          sessionStorage.setItem("_priv", JSON.stringify(result.priv));

          // Ejemplo de uso: Cambiar el color principal a negro(#ff0000)
          // changePrimaryColor("#000");

          console.log("Resultado Usuario Login");
          console.log(result);

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
            title: "Iniciando WMS.security configura",
          }).then(function () {
            //hay que cambiar esta vaina
            //if (compania !== "bremen") {
            //window.location = "../splash-screen2.html";
            //window.location = "norwing/home.html";
            //} else {
            window.location = "home.html";
            //window.location = "../splash-screen.html";
            //}
          });
          //alert("You are logged in");
          //this.goToMain();
        } else {
          Swal.fire({
            icon: "error",
            title: "Usuario o contraseña inválida",
            text: "Por favor comuníquese con nuestro equipo de soporte.",
            confirmButtonColor: "#f90f00",
          });
          document.querySelector("#username").va("");
          document.querySelector("#password").val("");
        }
      });
  }
}

function runLogin(e) {
  if (event.keyCode === 13 || event.which == 13) {
    event.preventDefault();
    login();
  }
}

// // Función para cambiar el color principal
// function changePrimaryColor(newColor) {
//   // Actualizar el valor de la variable CSS --color-primary
//   root.style.setProperty("--color-primary", newColor);
// }
