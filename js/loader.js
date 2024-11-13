function mostrarLoader() {
  const loader = '<div class="loading"></div>';
  document.getElementById("contenedorLoader").innerHTML = loader;
}


// Función para ocultar el loader
function ocultarLoader() {
  const loader = document.querySelector(".loading");

  // Oculta el loader
  loader.style.display = 'none';
}