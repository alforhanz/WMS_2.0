$(document).ready(function () {
  getDataDash();
});

function getDataDash() {
  const params =
    "?usuario=" +
    "pruebapma";
  console.log("Estos son los parametros de busqueda General: " + params);
  // console.log(params);
  fetch(env.API_URL + "getdashinfo/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.data.length > 0) {
          ArrayData = result.data[0];
          // console.log("RESULTADO");
          // console.log(ArrayData);
          // Actualizar elementos HTML
          document.getElementById("pedidos_solicitados").innerText = ArrayData.PEDIDOS_SOLICITADOS;
          document.getElementById("articulos_solicitados").innerText = ArrayData.CANT_ARTICULOS_SOLICITADOS;
          document.getElementById("articulos_pendientes").innerText = ArrayData.CANT_ARTICULOS_PENDIENTES;
          document.getElementById("articulos_prioridad").innerText = ArrayData.ARTICULOS_CON_PRIORIDAD;

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