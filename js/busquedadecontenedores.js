/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function (){ 
  console.log("DOM cargado...");
  const busqueda = localStorage.getItem('SearchParameterFlag');
  localStorage.setItem('switch_procesados', 'false');
  if (busqueda === "true") {
    
    const parametrosBusqueda = localStorage.getItem('parametrosBusquedaContenedor');
    localStorage.setItem('contenedorSwitch',true);
    
    if(parametrosBusqueda){
          const params = new URLSearchParams(parametrosBusqueda);
          const pSistema = params.get('pSistema')
          const pUsuario = params.get('pUsuario');
          const pOpcion = params.get('pOpcion');
          const pBodegaEnvia = params.get('pBodegaEnvia');
          const pFechaDesde = params.get('pFechaDesde');
          const pFechaHasta = params.get('pFechaHasta');          
         
          enviarDatosControlador(pSistema,pUsuario,pOpcion,pBodegaEnvia,pFechaHasta,pFechaDesde);
        }        
    } 
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//busquedadecontenedores functions
function validarBusquedaContenedor() {
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
  }else {     

          let pSistema='WMS'
          let pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;

          let switchContenedor = localStorage.getItem('contenedorSwitch');
          let pOpcion = "";

          if (switchContenedor === "true") {
              pOpcion = "E";
          } else {
              pOpcion = "A";
          }

          let pBodegaEnvia = document.getElementById("bodega").value;
          // let pBodegaSolicita ="";
          // let pConsecutivo = $('#pContenedor').val();
          // let pEstado ="";
          let pFechaHasta = $('#fecha_fin').val();
          let pFechaDesde = $('#fecha_ini').val();
      enviarDatosControlador(pSistema,pUsuario,pOpcion,pBodegaEnvia,pFechaHasta,pFechaDesde);    
   }
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function  enviarDatosControlador(pSistema,pUsuario,pOpcion,pBodegaEnvia,pFechaHasta,pFechaDesde) {
  
      const params =
                    "?pSistema="+ 
                    pSistema+
                    "&pUsuario="+
                    pUsuario +
                    "&pOpcion="+
                    pOpcion+
                    "&pBodegaEnvia="+
                    pBodegaEnvia+                    
                    "&pFechaDesde="+
                    pFechaDesde +
                    "&pFechaHasta="+
                    pFechaHasta ;

localStorage.setItem('parametrosBusquedaContenedor', params);
localStorage.setItem('SearchParameterFlag', 'true');

  let pag = 1;

  mostrarLoader();
  //console.log('BUSQUEDA CONTENEDOR PARAMETROS\n '+env.API_URL +'contenedor'+params);
  fetch(env.API_URL +"contenedor"+params, myInit)
    .then((response) => response.json())
    .then((result) => {
      console.log('Resultados]API:');
      console.log(result.contenedor);

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

            
            (fila.appendChild(document.createElement("td"))).innerHTML = (pOpcion === "A") ? key.LineaCargada : key.LineaContada;
              
            //opcion A con operador ternario para la condicion
            // col = fila.appendChild(document.createElement("td"));
            // col.innerHTML = (pOpcion === "A") ? key.LineaCargada : key.LineaContada;


            //opcion B mediante if else para la condicion
            // if(pOpcion==="A"){
            //   col = fila.appendChild(document.createElement("td"));
            // col.innerHTML = key.LineaCargada;
            // }else{
            //     col = fila.appendChild(document.createElement("td"));
            // col.innerHTML = key.LineaContada;
            // }
            
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


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////FUNCION PARA MOSTRAR EL DETALLE DE LOS PEDIDOS///////////
function irDetalleContenedor(pTraslado, Bodega_Solicita) {
  localStorage.setItem("contenedor", pTraslado);
  localStorage.setItem("bodega_solicita", Bodega_Solicita);
  window.location.href = 'lineasContenedor.html';
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//se aplican estilos a las filas cuyos documentos comienzan con 'T'.
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
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// //limpiar el contenido de la busqueda cuando cambia la fecha
const fecha_ini=document.getElementById('fecha_ini');
fecha_ini.addEventListener('change', function(){
  limpiarResultadoGeneral();
  
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
const fecha_fin=document.getElementById('fecha_fin');
fecha_ini.addEventListener('change', function(){
  limpiarResultadoGeneral();
  
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///////////// Obtener el elemento toggleSwitch de entrada tipo checkbox//////////
const checkbox = document.getElementById('toggleSwitch');
/////////////// Agregar un evento de cambio al checkbox/////////////
checkbox.addEventListener('change', function () {
  if (checkbox.checked === false) {
    contenedoresProcesados();
  } else {
  }
 limpiarResultadoGeneral();
 $('#toggleSwitch').prop('checked', true);
 localStorage.setItem('contenedorSwitch',true)
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//Fucnion que activa el toggleSwitch para ver los contenedorers procesados
function contenedoresProcesados() {

  Swal.fire({
    title: '¿Desea ver solo los contenedores finalizados?',
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
      localStorage.setItem('contenedorSwitch',false);

    } else {
      $('#toggleSwitch').prop('checked', true);
      localStorage.setItem('contenedorSwitch',true);
    }
  });
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
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
localStorage.removeItem('SearchParameterFlag');
localStorage.removeItem('parametrosBusquedaContenedor');

}

