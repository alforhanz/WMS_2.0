//busquedadecontenedores functions
function validarBodega() {
  //revisar como toma el valor
  // mostrarLoading();
  var bodega = document.getElementById("bodega").value;
  //revisar como toma el valor
  if (bodega == "") {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Por favor, seleccione una bodega.'
    });
    return false; // Evita que se envíe el formulario
  }
  else {
    enviarDatosControlador();
  }
}


function enviarDatosControlador() {
  // mostrarLoading();
  let pag = 1;
  var pBodega = document.getElementById("bodega").value;
  var pConsecutivo = $('#pContenedor').val();
  var pFechaHasta = $('#fecha_fin').val();
  var pFechaDesde = $('#fecha_ini').val();
  var pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;

  const params =
    "?pBodega=" +
    pBodega +
    "&pFechaDesde=" +
    pFechaDesde +
    "&pFechaHasta=" +
    pFechaHasta +
    "&pUsuario=" +
    pUsuario +
    "&pConsecutivo=" +
    pConsecutivo;

  //Mostrar Loader
  mostrarLoader();
console.log('BUSQUEDA CONTENEDOR PARAMETROS\n '+params);

  fetch(env.API_URL + "contenedor/E" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.contenedor.length != 0) {

          let cantReg = result.contenedor.length;
          let nPag = Math.ceil(cantReg / xPag);
          const tabla = document.getElementById("tblcontenedores");
          $("#tblcontenedores tbody").remove();
          let i = 1;
          let htm = "";
          htm = `<div class="row" id="totalregistros">
            <div class="col s12"><span>Total de Registros: </span><span>${result.contenedor.length}</span></div>
            </div>`;
          result.contenedor.forEach(function (key) {
            //fecha = key.FECHA_PEDIDO.split(" ");

            let tblBody = document.createElement("tbody");
            let fila = document.createElement("tr");
            fila.setAttribute("onclick", `irDetalleContenedor('${key.Contenedor}','${key.Bodega_Solicita}');`);
            let col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.Contenedor;
            col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.LineaConsecutivo;
            col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.LineaContada;
            col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.Bodega_Solicita;
            col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.Fecha_Creacion;

            tblBody.appendChild(fila);
            tabla.appendChild(tblBody);

            // Aplicar estilos a las filas de la tabla
            let rows = document.querySelectorAll("#tblcontenedores tbody tr");
            rows.forEach((row, index) => {
              if (index % 2 === 0) {
                row.style.backgroundColor = "#f2f2f2";
              } else {
                row.style.backgroundColor = "#ffffff";
              }
            });
          });
          document.getElementById("resultadoGeneral").innerHTML = htm;

          //paginador para pedidos
          document.getElementById("resultadoPaginador").innerHTML =
            paginadorPedidos(nPag, pag, "1040");

          document.getElementById("carga").innerHTML = "";
          //Ocultar Loader
          ocultarLoader();
          aplicarEstilosTablaPedidos();
        }else{
          Swal.fire({
            icon: "info",
            title: "Información",            
            text: "No hay registros asignados para el usuario: "+pUsuario,
            confirmButtonColor: "#28a745",
          });
        }
        document.getElementById("carga").innerHTML = "";
        //limpiarResultadoGeneral();
      }
      else {
      }
    });
ocultarLoader();
}

//////////////////FUNCION PARA MOSTRAR EL DETALLE DE LOS PEDIDOS///////////
function irDetalleContenedor(pTraslado, Bodega_Solicita) {
  localStorage.setItem("contenedor", pTraslado);
  localStorage.setItem("bodega_solicita", Bodega_Solicita);
  window.location.href = 'lineasContenedor.html';
}

///////////// Obtener el elemento toggleSwitch de entrada tipo checkbox//////////
const checkbox = document.getElementById('toggleSwitch');

/////////////// Agregar un evento de cambio al checkbox/////////////
checkbox.addEventListener('change', function () {
  if (checkbox.checked === false) {
    pedidosFinalizados();
  } else {
  }
 // limpiarResultadoGeneral();
});

/////////////////Fucnion que activa el toggleSwitch para ver los contenedorers procesados
function pedidosFinalizados() {

  Swal.fire({
    title: '¿Desea ver solo los pedidos finalizados?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6e7881",
  }).then((result) => {
    // Resultado de la acción
    if (result.isConfirmed) {
      $('#toggleSwitch').prop('checked', false);
    } else {
      $('#toggleSwitch').prop('checked', true);
    }
  });
}


////////////////////se aplican estilos a las filas cuyos documentos comienzan con 'T'. /////////////////
function aplicarEstilosTablaPedidos() {
  $('#tblpedido tbody tr').each(function () {
    var documentoValue = $(this).find('td:eq(0)').text().trim();

    if (documentoValue.startsWith('T')) {
      $(this).find('td:eq(0)').css({
        'color': 'red',
        'font-weight': 'bold'
      });
    }
  });
}

// //limpiar el contenido de la busqueda
function limpiarResultadoGeneral() {
  const tabla = document.getElementById("tblcontenedores");
  const resultadoPaginador = document.getElementById("resultadoPaginador");
  const totalRegistros = document.getElementById("totalregistros");

 // Limpiar el contenido del paginador si existe
 if (resultadoPaginador) {
  resultadoPaginador.innerHTML = "";
}

// Limpiar el contenido de totalRegistros si existe
if (totalRegistros) {
  totalRegistros.innerHTML = "";
}

// Limpiar el contenido del tbody de la tabla si la tabla existe
if (tabla) {
  let tbody = tabla.querySelector("tbody");
  if (tbody) {
    tbody.innerHTML = "";
  }
}
}

const fecha_ini=document.getElementById('fecha_ini');
fecha_ini.addEventListener('change', function(){
  limpiarResultadoGeneral();
});

const fecha_fin=document.getElementById('fecha_fin');
fecha_ini.addEventListener('change', function(){
  limpiarResultadoGeneral();
});
