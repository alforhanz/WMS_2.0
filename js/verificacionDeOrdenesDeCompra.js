

    document.addEventListener("DOMContentLoaded", function (){
      
      const busqueda = localStorage.getItem('autoSearchOrdenDeComprasList');
      localStorage.setItem('switchLecturaState', 'true');
      //revisar como toma el valor
      if (busqueda === "true") {
        console.log("DOM completamente cargado y parseado.");

        const parametrosBusquedaOC = localStorage.getItem('parametrosBusquedaOrdenesDeCompraList');
            if(parametrosBusquedaOC){
              const params = new URLSearchParams(parametrosBusquedaOC);
              const pBodega = params.get('pBodega');
              const pFechaDesde = params.get('pFechaDesde');
              const pFechaHasta = params.get('pFechaHasta');
              const pUsuario = params.get('pUsuario');
              const pOrden = params.get('pOrden');
              const pOpcion = params.get('pOpcion');

              if (pOpcion==="P") {
                $('#toggleSwitch').prop('checked', false);
              }
              else {
                $('#toggleSwitch').prop('checked', true);
              }

              enviarDatosControlador(pBodega, pOrden,pOpcion, pUsuario, pFechaDesde, pFechaHasta);
            }
            }        
        });


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    const checkbox = document.getElementById('toggleSwitch');  
    /////////////// Agregar un evento de cambio al checkbox/////////////
    checkbox.addEventListener('change', function () {
      // Imprimir el valor del checkbox en la consola    
      if (checkbox.checked === false) {
        ordenesDeComprasProcesadas();
        
      } 
     limpiarResultadoGeneral();
    });
     /////////////////Fucnion que activa el toggleSwitch para ver las ordenes de compras procesados
  function ordenesDeComprasProcesadas() {
  
    Swal.fire({
      title: '¿Desea ver solo las ordenes de compras procesadas?',
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
  
  //Verificacion de Ordenes de compra functions
function ValidaOrdenesDeCompra() {
 
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
    var pOrden = $('#pOrden').val();
    let pOpcion = $('#toggleSwitch').prop('checked');
    var pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;
    let pFechaDesde =  document.getElementById('fecha_ini').value; 
    let pFechaHasta = document.getElementById('fecha_fin').value;

    if (pOpcion) {
      pOpcion="E"
    }
    else {
      pOpcion="P"
    }
    enviarDatosControlador(pBodega, pOrden,pOpcion, pUsuario, pFechaDesde, pFechaHasta);
  }
}

 //////////////////FUNCION PARA MOSTRAR EL DETALLE DE las ORDENES DE COMPRAS///////////
  
  function enviarDatosControlador(pBodega, pOrden, pOpcion, pUsuario, pFechaDesde, pFechaHasta) {
    mostrarLoader();
    const params =
      "?pBodega=" +
      pBodega +
      "&pUsuario=" +
      pUsuario +
      "&pOrden=" +
      pOrden +
      "&pOpcion=" +
      pOpcion +
      "&pFechaDesde=" +
      pFechaDesde +
      "&pFechaHasta=" +
      pFechaHasta;
  
    localStorage.setItem('parametrosBusquedaOrdenesDeCompraList', params);
    localStorage.setItem('autoSearchOrdenDeComprasList', 'false');
  
    fetch(env.API_URL + "wmsordenesdecompras/L" + params, myInit)
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === "SUCCESS") {
          if (result.ordenCompra.length != 0) {
            ArrayData = result.ordenCompra;
            ArrayDataFiltrado = result.ordenCompra;
           
            let cantReg = result.ordenCompra.length;
            let nPag = Math.ceil(cantReg / xPag);
            const tabla = document.getElementById("tblordendecompra");
            $("#tblordendecompra tbody").remove();
  
            let htm = `<div class="row" id="totalregistros">
              <div class="col s12"><span>Total de Registros: </span><span>${result.ordenCompra.length}</span></div>
            </div>`;
  
            document.getElementById("resultadoGeneral").innerHTML = htm;  
                   mostrarResultadosVerificacionOrdenes(nPag, 1);  
            document.getElementById("carga").innerHTML = "";
            ocultarLoader();
          } else {
            Swal.fire({
              icon: "info",
              title: "Información",
              text: "No hay registros asignados para el usuario: " + pUsuario,
              confirmButtonColor: "#28a745",
            });
            document.getElementById("carga").innerHTML = "";
            limpiarResultadoGeneral();
            ocultarLoader();
          }
        }
      });
  }
 
  function irDetalleOC(pOrden, OBSERVACION) {
    localStorage.setItem("OrdenDeCompra_finalizadas", checkbox.checked); 
    localStorage.setItem("OrdenDeCompra", pOrden);

    // Manejar el valor de OBSERVACION para asignar null si es undefined
    localStorage.setItem("observacion", OBSERVACION === undefined || OBSERVACION === null ? null : OBSERVACION);

    // localStorage.setItem("bodegaOC", pBodega);
    window.location.href = 'lineasOrdenCompra.html';
}

  function mostrarResultadosVerificacionOrdenes(nPag, pag) {
    let desde = (pag - 1) * xPag;
    let hasta = pag * xPag;
  
    resultadosVerificacionOrdenes(desde, hasta);
  
    let htm = paginadorTablas(nPag, pag, 'mostrarResultadosVerificacionOrdenes');
    document.getElementById("resultadoPaginador").innerHTML = htm;
  }
  
   
  function resultadosVerificacionOrdenes(desde, hasta) {
    // Asegúrate de que ArrayDataFiltrado esté definido y tenga datos
    if (!ArrayDataFiltrado || ArrayDataFiltrado.length === 0) {
      console.error("ArrayDataFiltrado no está definido o está vacío.");
      return;
    }
  
    // Obtener la tabla y su tbody
    const tabla = document.getElementById("tblordendecompra");
    let tbody = tabla.querySelector("tbody");
  
    // Limpiar el tbody existente
    if (tbody) {
      tbody.innerHTML = "";
    } else {
      tbody = document.createElement("tbody");
      tabla.appendChild(tbody);
    }
  
    // Crear el contenido del tbody
    let htm = "";
  
    for (let i = desde; i < hasta; i++) {
      if (ArrayDataFiltrado[i]) {
        // Formatear la fecha
        let fechaOrden = new Date(ArrayDataFiltrado[i].FECHA_ORDEN);
        let fechaFormateada = `${fechaOrden.getDate()}/${fechaOrden.getMonth() + 1}/${fechaOrden.getFullYear()}`;
        // localStorage.setItem ('observacion',ArrayDataFiltrado[i].OBSERVACION); 
        // Determinar si el índice de la fila es par o impar
        let backgroundColor = i % 2 === 0 ? "#f2f2f2" : "#ffffff";
        
        if(ArrayDataFiltrado[i].OBSERVACION){
          htm += `<tr onclick="irDetalleOC('${ArrayDataFiltrado[i].ORDEN_COMPRA}', '${ArrayDataFiltrado[i].OBSERVACION}');" style="background-color:${backgroundColor};">`;
        }else{
          htm += `<tr onclick="irDetalleOC('${ArrayDataFiltrado[i].ORDEN_COMPRA}', '${ArrayDataFiltrado[i].OBSERVACION="null"}');" style="background-color:${backgroundColor};">`;
        }
        // 

        htm += `<td style="text-align:left;">`;
        htm += `<h5>${ArrayDataFiltrado[i].ORDEN_COMPRA}</h5>`;
        htm += `<h6 style="color:#28a745;">${ArrayDataFiltrado[i].EMBARQUE}</h6>`;
        htm += `<h6>${fechaFormateada}</h6>`;
        htm += `</td>`;
        htm += `<td>${ArrayDataFiltrado[i].BODEGA_DESTINO}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].NOMBRE}</td>`;
        htm += `<td>${!isNaN(ArrayDataFiltrado[i].cant_solicitada) && ArrayDataFiltrado[i].cant_solicitada !== null ? parseFloat(ArrayDataFiltrado[i].cant_solicitada).toFixed(0) : "0"}</td>`;
        htm += `<td>${!isNaN(ArrayDataFiltrado[i].cant_verificada) && ArrayDataFiltrado[i].cant_verificada !== null ? parseFloat(ArrayDataFiltrado[i].cant_verificada).toFixed(0) : "0"}</td>`;
        htm += `</tr>`;
      }
    }
  
    // Insertar el HTML generado dentro del tbody de la tabla
    tbody.innerHTML = htm;
  
    // Limpiar el contenido del elemento con id 'carga'
    document.getElementById("carga").innerHTML = "";
  }
  

// //limpiar el contenido de la busqueda
function limpiarResultadoGeneral() {
  const tabla = document.getElementById("tblordendecompra");
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

  