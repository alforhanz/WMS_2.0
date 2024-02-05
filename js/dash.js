$(document).ready(function () {
  getDataDash();
});

function getDataDash() {
  // var usuario = sessionStorage.getItem('user');
  var usuario = localStorage.getItem('username');
  const params =
    "?usuario=" +
    usuario;
  // "pruebapma";
  console.log("Estos son los parametros de busqueda General: " + params);
  // console.log(params);
  fetch(env.API_URL + "getdashinfo/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.data.length > 0) {
          ArrayData = result.data[0];

          // Actualizar elementos HTML
          document.getElementById("pedidos_solicitados").innerText = parseFloat(ArrayData.PEDIDOS_SOLICITADOS).toFixed(2);
          document.getElementById("articulos_solicitados").innerText = parseFloat(ArrayData.CANT_ARTICULOS_SOLICITADOS).toFixed(2);
          document.getElementById("articulos_pendientes").innerText = parseFloat(ArrayData.CANT_ARTICULOS_PENDIENTES).toFixed(2);
          document.getElementById("articulos_prioridad").innerText = parseFloat(ArrayData.ARTICULOS_CON_PRIORIDAD).toFixed(2);

          // Puedes seguir actualizando más elementos según necesites

          // Guardar en localStorage
          // localStorage.setItem('dashinfo', JSON.stringify(ArrayData));
        } else {
          Swal.fire({
            icon: "info",
            title: "Información",
            text: "No hay resultado para la busqueda " + articulo,
            confirmButtonColor: "#000",
          });
          document.getElementById("carga").innerHTML = "";
          return false;
        }
      }
    });
}