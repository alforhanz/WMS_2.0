function validarFormulario() {
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
    enviarDatosPedido();
  }
}


function enviarDatosPedido() {
  // mostrarLoading();
  let pag = 1;
  var pBodega = document.getElementById("bodega").value;
  var pPedido = $('#pPedido').val();
  var pFechaHasta = $('#fecha_fin').val();
  var pFechaDesde = $('#fecha_ini').val();
  var pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;
  let pOpcion = $('#toggleSwitch').prop('checked');

  if (pOpcion) {
    pOpcion = "R";
  }
  else {
    pOpcion = "FF";
  }

  const params =
    "?pBodega=" +
    pBodega +
    "&pFechaDesde=" +
    pFechaDesde +
    "&pFechaHasta=" +
    pFechaHasta +
    "&pUsuario=" +
    pUsuario +
    "&pPedido=" +
    pPedido +
    "&pOpcion=" +
    pOpcion;

  //Mostrar Loader
  mostrarLoader();


  fetch(env.API_URL + "getverificacion/P" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.pedidos.length != 0) {
          ////console.log("Lista de Pedidos: ");
          ////console.log(result);


          let cantReg = result.pedidos.length;
          //ArrayData = result.pedidos;
          //ArrayDataFiltrado = result.pedidos;
          let nPag = Math.ceil(cantReg / xPag);
          const tabla = document.getElementById("tblpedido");
          $("#tblpedido tbody").remove();
          let i = 1;
          let nombre = "";
          let fecha = "";
          let htm = "";
          htm = `<div class="row" id="totalregistros">
      <div class="col s12"><span>Total de Registros: </span><span>${result.pedidos.length}</span></div>
    </div>`;
          result.pedidos.forEach(function (key, index) {
            fecha = key.FECHA_PEDIDO.split(" ");
            let tblBody = document.createElement("tbody");
            let fila = document.createElement("tr");
            fila.setAttribute("onclick", `irDetallePedido('${key.DOCUMENTO}','${key.PEDIDO}');`);
            let col = fila.appendChild(document.createElement("td"));
            // col.setAttribute("onclick", "expand('rotate-" + i + "');");
            col.innerHTML = key.DOCUMENTO;


            col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.DESCRIPCION;
            col = fila.appendChild(document.createElement("td"));
            col.innerHTML = key.TOTAL_UNIDADES;
            col = fila.appendChild(document.createElement("td"));
            if (key.LINEAS_VERIFICADAS == ".00") {
              col.innerHTML = 0;
            } else {
              col.innerHTML = key.LINEAS_VERIFICADAS;
            }

            
            tblBody.appendChild(fila);
            tabla.appendChild(tblBody);
            let tblBody2 = document.createElement("tbody");
            tblBody2.setAttribute("id", "rotate-" + i);
            tblBody2.setAttribute("style", "display:none;");
            let fila2 = document.createElement("tr");
            col2 = fila2.appendChild(document.createElement("td"));
            col2.setAttribute("style", "background-color:#fff;");
            col2.setAttribute("colspan", "2");
            col2.innerHTML =
              "Total a Facturar: " +
              parseFloat(key.TOTAL_A_FACTURAR).toFixed(2);
            tblBody2.appendChild(fila2);
            tabla.appendChild(tblBody2);
            i++;
          });
          document.getElementById("resultadoGeneral").innerHTML = htm;

          //paginador para pedidos
          document.getElementById("resultadoPaginador").innerHTML =
            paginadorPedidos(nPag, pag, "1040");

          document.getElementById("carga").innerHTML = "";
          //Ocultar Loader
          ocultarLoader();
          aplicarEstilosTablaPedidos();
        }
        document.getElementById("carga").innerHTML = "";
      } else {
        ////console.log("No se cargo los modelos, verifique la conexión");
      }
    });

}

//////////////////FUNCION PARA MOSTRAR EL DETALLE DE LOS PEDIDOS///////////
function irDetallePedido(documento, pedido) {
  localStorage.setItem("documento", documento);
  localStorage.setItem("pedidoSelect", pedido);
  window.location.href = 'detalle_pedido.html';
}

// Obtener el elemento toggleSwitch de entrada tipo checkbox
const checkbox = document.getElementById('toggleSwitch');

// Agregar un evento de cambio al checkbox
checkbox.addEventListener('change', function () {
  // Imprimir el valor del checkbox en la consola

  // if (checkbox.checked === true)
  if (checkbox.checked === false) {
    pedidosFinalizados();
  } else {
    ////console.log('Valor del checkbox:', checkbox.checked);
  }
});

////Fucnion que activa el toggleSwitch para ver los pedidos facturados y finalizados
function pedidosFinalizados() {
  // Mostrar el cuadro de diálogo con SweetAlert2
  Swal.fire({
    title: '¿Desea ver solo los pedidos finalizados?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    // Resultado de la acción
    if (result.isConfirmed) {
      // Acción a realizar si el usuario hace clic en "Sí"
      // ////console.log('A continuación se mostrarán solamente los pedidos finalizados y facturados.');
      // Establecer el valor del toggleSwitch como true
      $('#toggleSwitch').prop('checked', false);
    } else {
      // Acción a realizar si el usuario hace clic en "No" o cierra el cuadro de diálogo
      // ////console.log('Se mostrarán los resultados de los pedidos en proceso.');
      // Establecer el valor del toggleSwitch como false
      $('#toggleSwitch').prop('checked', true);
    }
  });
}


// ///////////se aplican estilos a las filas cuyos documentos comienzan con 'T'. /////////////////
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