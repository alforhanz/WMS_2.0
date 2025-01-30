function mostrarLoader() {
  document.getElementById("contenedorLoader").innerHTML = '<div class="loading"></div>';
}

function ocultarLoader() {
  const loaderContainer = document.getElementById("contenedorLoader");
  if (loaderContainer) {
      loaderContainer.innerHTML = ''; // Elimina el loader
  }
}


// function mostrarLoader() {
//   const loader = '<div class="loading"></div>';
//   document.getElementById("contenedorLoader").innerHTML = loader;
// }


// // Función para ocultar el loader
// function ocultarLoader() {
//   const loader = document.querySelector(".loading");

//   // Oculta el loader
//   loader.style.display = 'none';
// }