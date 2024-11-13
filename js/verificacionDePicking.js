
const checkbox = document.getElementById('toggleSwitch');

  // Inicializar datepicker de Materialize
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, {
    format: 'yyyy-mm-dd', // Formato de fecha
  });
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM completamente cargado y parseado.");

    const busqueda = localStorage.getItem('autoSearchPedidos');
    
    //revisar como toma el valor
    if (busqueda === "true") {
            // Obtener los parámetros de búsqueda del localStorage
            const parametrosBusqueda = localStorage.getItem('parametrosBusqueda');
            if (parametrosBusqueda) {
                // Crear un objeto URLSearchParams a partir de los parámetros
                const params = new URLSearchParams(parametrosBusqueda);
            
                // Extraer los valores de los parámetros
                const pBodega = params.get('pBodega');
                const pFechaDesde = params.get('pFechaDesde');
                const pFechaHasta = params.get('pFechaHasta');
                const pUsuario = params.get('pUsuario');
                const pPedido = params.get('pPedido');
                const pOpcion = params.get('pOpcion');


            // Establecer los valores de los campos de fecha
            document.getElementById('fecha_ini').value = pFechaDesde;
            document.getElementById('fecha_fin').value = pFechaHasta;
                          
                // Actualizar los datepickers de Materialize
                  var fechaIniElem = document.getElementById('fecha_ini');
                  var fechaFinElem = document.getElementById('fecha_fin');
                  var fechaIniInstance = M.Datepicker.getInstance(fechaIniElem);
                  var fechaFinInstance = M.Datepicker.getInstance(fechaFinElem);
                  fechaIniInstance.setDate(new Date(pFechaDesde));
                  fechaFinInstance.setDate(new Date(pFechaHasta));
                  fechaIniInstance.gotoDate(new Date(pFechaDesde));
                  fechaFinInstance.gotoDate(new Date(pFechaHasta));

              if (pOpcion==="FPK") {

                $('#toggleSwitch').prop('checked', false);
                
              }
              else {
                $('#toggleSwitch').prop('checked', true);
              }
            
                // Llamar a la función listadoPedido con los valores extraídos
                listadoPedido(pBodega, pPedido, pFechaDesde, pFechaHasta, pUsuario, pOpcion);
              }      
            }
    });


function validarFormulario() {
  //revisar como toma el valor 
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
    var pBodega = document.getElementById("bodega").value;
    var pPedido = $('#pPedido').val();
    var pFechaHasta = $('#fecha_fin').val();
    var pFechaDesde = $('#fecha_ini').val();
    var pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;
    let pOpcion = $('#toggleSwitch').prop('checked');
    
    if (pOpcion) {
      pOpcion = "EPK";
    }
    else {
      pOpcion = "FPK";
    }
    listadoPedido(pBodega, pPedido, pFechaDesde, pFechaHasta, pUsuario, pOpcion);
  }
}

function listadoPedido(pBodega, pPedido, pFechaDesde, pFechaHasta, pUsuario, pOpcion) {
  localStorage.setItem('autoSearchPedidos', 'false'); // Aquí se establece el valor 'false' para la búsqueda de las órdenes de compra

  const params =
    "?pBodega=" + pBodega +
    "&pFechaDesde=" + pFechaDesde +
    "&pFechaHasta=" + pFechaHasta +
    "&pUsuario=" + pUsuario +
    "&pPedido=" + pPedido +
    "&pOpcion=" + pOpcion;
  localStorage.setItem('BodegaUsuario', pBodega);  
  localStorage.setItem('parametrosBusqueda', params);
  mostrarLoader();

  fetch(env.API_URL + "wmsverificacionpedidos/P" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.pedidos.length != 0) {
          ArrayData = result.pedidos;
          ArrayDataFiltrado = result.pedidos;
          let cantReg = result.pedidos.length;
          let nPag = Math.ceil(cantReg / xPag);
          
          $("#tblpedido tbody").remove();

          let htm = `<div class="row" id="totalregistros">
            <div class="col s12"><span>Total de Registros: </span><span>${result.pedidos.length}</span></div>
          </div>`;

          document.getElementById("resultadoGeneral").innerHTML = htm;
          mostrarResultadosVerificacionPedidos(nPag, 1);

          document.getElementById("carga").innerHTML = "";
          ocultarLoader();
          aplicarEstilosTablaPedidos();
        } else {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "No tiene pedidos pendientes!",
            footer: '<a href="#">Why do I have this issue?</a>',
            confirmButtonColor: '#28a745',
          });
          limpiarResultadoGeneral();
          ocultarLoader();
        }
      } else {
        console.log("Error en el SP");
      }
    });
}

function mostrarResultadosVerificacionPedidos(nPag, pag) {
  let htm = "";
  let desde = (pag - 1) * xPag;
  let hasta = pag * xPag;

  resultadosVerificacionPedidos(desde, hasta);
  htm += paginadorTablas(nPag, pag, 'mostrarResultadosVerificacionPedidos');
  document.getElementById("resultadoPaginador").innerHTML = htm;
}

function resultadosVerificacionPedidos(desde, hasta) {
  if (!ArrayDataFiltrado || ArrayDataFiltrado.length === 0) {
    console.error("ArrayDataFiltrado no está definido o está vacío.");
    return;
  }

  const tabla = document.getElementById("tblpedido");
  let tbody = tabla.querySelector("tbody");

  if (tbody) {
    tbody.innerHTML = "";
  } else {
    tbody = document.createElement("tbody");
    tabla.appendChild(tbody);
  }

  let htm = "";

  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      let backgroundColor = i % 2 === 0 ? "" : "#fff";
      htm += `<tr onclick="irDetallePedido('${ArrayDataFiltrado[i].DOCUMENTO}','${ArrayDataFiltrado[i].PEDIDO}','${ArrayDataFiltrado[i].ESTADO_PEDIDO}');" style="background-color:${backgroundColor};">`;
      htm += `<td>${ArrayDataFiltrado[i].DOCUMENTO}</td>`;
      htm += `<td>${ArrayDataFiltrado[i].DESCRIPCION}</td>`;
      htm += `<td>${parseFloat(ArrayDataFiltrado[i].TOTAL_UNIDADES).toFixed(2)}</td>`;
      htm += `<td>${parseFloat(ArrayDataFiltrado[i].LINEAS_VERIFICADAS).toFixed(2)}</td>`;

      let cantSolicitada = parseFloat(ArrayDataFiltrado[i].TOTAL_UNIDADES).toFixed(2);
      let cantVerificada = parseFloat(ArrayDataFiltrado[i].LINEAS_VERIFICADAS).toFixed(2);
      htm += `<td>`;
      if (cantVerificada == 0 && cantSolicitada != cantVerificada) {
        htm += '';
      } else if (cantSolicitada == cantVerificada) {
        htm += '<i class="material-icons" style="color:green;">done_all</i>';
      } else if (cantVerificada > 0 && cantSolicitada != cantVerificada) {
        htm += '<i class="material-icons" style="color:red;">done_all</i>';
      }
      htm += `</td>`;
      htm += `</tr>`;
    }
  }

  tbody.innerHTML = htm;
  document.getElementById("carga").innerHTML = "";
}



//////////////////FUNCION PARA MOSTRAR EL DETALLE DE LOS PEDIDOS///////////
function irDetallePedido(documento, pedido, estado) {
  const checkbox = document.getElementById('toggleSwitch');
//   let bodega = localStorage.getItem('BodegaUsuario');
let bodega =document.getElementById('bodega').value;
  // Extraer solo el número de la bodega
  let bodegaNumero = bodega.match(/\d+/)[0];

  console.log(bodegaNumero); // Esto mostrará "52" si el valor original era "B-52"
  localStorage.setItem("pedidos_finalizados",checkbox.checked); 
  localStorage.setItem("documento", documento);
  localStorage.setItem("pedidoSelect", pedido);
  localStorage.setItem("estado", estado);

    if((bodegaNumero>=51 && bodegaNumero <= 55 ) || bodegaNumero === '05'){       
        window.location.href = 'preparacionPicking.html';
        }else{
            //window.location.href = 'detalle_pedido.html';         
        } 
}

///////////// Obtener el elemento toggleSwitch de entrada tipo checkbox//////////

/////////////// Agregar un evento de cambio al checkbox/////////////
checkbox.addEventListener('change', function () {
  // Imprimir el valor del checkbox en la consola
  if (checkbox.checked === false) {
    pedidosFinalizados();
  } else {
  }
  limpiarResultadoGeneral()
});

/////////////////Fucnion que activa el toggleSwitch para ver los pedidos facturados y finalizados
function pedidosFinalizados() {
  // Mostrar el cuadro de diálogo con SweetAlert2
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
   const tabla = document.getElementById("tblpedido");
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
fecha_fin.addEventListener('change', function(){
  limpiarResultadoGeneral();
});