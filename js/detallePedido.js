//Variable global que contiene el detalle del pedido
var detallePedidoList = "";

document.addEventListener("DOMContentLoaded", function () {
  //--------------------------------------------------------------------------
  if (localStorage.getItem("documento")) {

    var documento = localStorage.getItem("documento");
    var pedido = localStorage.getItem("pedidoSelect");
    //---------------------------------------------------------------------------
    cargarDetallePedido(documento, pedido);
    
  } else {
    window.location = "index.html";
  }
});

function cargarDetallePedido(documento, pedido) {
  // Concatena la variable con texto y asigna el valor al label documento y pedido
  document.getElementById("documento").innerHTML = "Documento: " + documento;
  document.getElementById("pedido").innerHTML = "Pedido: " + pedido;

  const pPedido = pedido;//Se asigna el número del peddido a una variable constante para pasarlo como parametro
  const params =
    "?pPedido=" +
    pPedido;

  fetch(env.API_URL + "getverificacion/D" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.lineaspedido.length != 0) {
          console.log("Lineas del Pedido seleccionado: ");
          console.log(result);
          detallePedidoList=result.lineaspedido;
          console.log("Lineas del pedido:");
          console.log(detallePedidoList);
          armarTablaVerificacion(detallePedidoList);
        }
        document.getElementById("carga").innerHTML = "";
      } else {
        console.log("No se cargo los modelos, verifique la conexión o Api");
      }
    });
}

/////////VALIDA EL CODIGO LEIDO EN LA PESTAÑA LECTURA//////////////////
function validarCodigoBarras(input) {
  var pedidoList = detallePedidoList;

  const codbarra = input.value.toUpperCase(); // Convertir a mayúsculas

  const row = input.closest('tr');
  const firstTd = row.querySelector('td:first-child');
  const span = firstTd.querySelector('span');
  const siguienteTd = row.querySelector('.codigo-barras-cell2');
  const cantFila = siguienteTd.querySelector('.codigo-barras-input');

  var codigoValido = false;

  for (var i = 0; i < pedidoList.length; i++) {
      // Convertir a mayúsculas antes de comparar
      // if (pedidoList[i].ARTICULO.toUpperCase() === codbarra || pedidoList[i].CODIGO_BARRA.toUpperCase() === codbarra) 
      //primero verifica si las propiedades ARTICULO y CODIGO_BARRA existen antes de intentar convertirlas a mayúsculas y compararlas con codbarra.
      if ((pedidoList[i].ARTICULO && pedidoList[i].ARTICULO.toUpperCase() === codbarra) || (pedidoList[i].CODIGO_BARRA && pedidoList[i].CODIGO_BARRA.toUpperCase() === codbarra)){
          span.textContent = pedidoList[i].ARTICULO;
          cantFila.value = 1;

          // Bloquear la celda del código de barras
          input.setAttribute('readonly', 'readonly');

          // Aquí se genera una fila nueva vacía
          crearNuevaFila();

          // Llamar función que guarda artículos en la tabla
          var dataFromTable = guardarTablaEnArray();
          //console.log(dataFromTable);

          codigoValido = true;
          break;
      }
  }

  if (!codigoValido) {
      // Borrar el contenido de la celda COD
      const codigoBarrasCell = row.querySelector('.codigo-barras-cell');
      const codigoBarrasInput = codigoBarrasCell.querySelector('.codigo-barras-input');
      codigoBarrasInput.value = '';

      Swal.fire({
          icon: 'warning',
          title: '¡Código no válido!',
          text: 'El código ingresado no coincide con ningún artículo del pedido. Intente nuevamente.',
          confirmButtonColor: '#28a745',
      });
  }
}

 ///// Funcion que crea la nueva fila en la pestaña lectura ////////////

 function crearNuevaFila() {
  const tableBody = document.querySelector('#tblbodyLectura');

  const nuevaFilaHTML =
      `<tr>
  <td class="sticky-column" style="user-select: none;"><span display: inline-block;"></span></td>
  <td class="codigo-barras-cell"><input type="text" id="codigo-barras" class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" autofocus></td>
  <td class="codigo-barras-cell2"><input id="cant-pedida" type="text" class="codigo-barras-input" value="" onchange="validarCantidadPedida(this)"></td>
  <td class="codigo-barras-cell2"><i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i></td>
</tr>`;

  tableBody.insertAdjacentHTML('beforeend', nuevaFilaHTML);

  // Obtén el último campo de entrada en la columna COD de la nueva fila
  const nuevoCodigoBarrasInput = tableBody.querySelector('tr:last-child .codigo-barras-input');

  // Establece el enfoque en el último campo de entrada
  if (nuevoCodigoBarrasInput) {
      nuevoCodigoBarrasInput.focus();
  }
}

///////////vALIDA LO QUE SE LEE CONTRA EL PEDIDO./////////
function validarCantidadPedida() {
  //Llamado a guardar datos en la variable arrray en el LS
  var dataFromTable = guardarTablaEnArray();
}

function guardarTablaEnArray() {
  var dataArray = [];

  var table = document.getElementById('myTableLectura');
  var rows = table.getElementsByTagName('tr');

  for (var i = 1; i < rows.length; i++) { // Comenzamos desde 1 para omitir la fila de encabezado
      var row = rows[i];
      var cells = row.getElementsByTagName('td');
      //aqui se seleccionan los elemendos de las columnas de la tabla lectura
      
      var articulo = cells[0].querySelector('span').textContent.trim();        
      var codigoBarraInput = cells[1].querySelector('.codigo-barras-input');
      var cantidadLeidaInput = cells[2].querySelector('.codigo-barras-input');

      var codigoBarra = codigoBarraInput.value;
     
      var cantidadLeida = parseFloat(cantidadLeidaInput.value);
      // Verificar si los valores no son nulos ni vacíos antes de almacenarlos
      
      if (articulo !== null && articulo !== "" && !isNaN(cantidadLeida)) {
          var rowData = {
              ARTICULO: articulo,
              CODIGO_BARRA: codigoBarra,
              CANTIDAD_LEIDA: cantidadLeida
          };

          dataArray.push(rowData);
      }
  }

  localStorage.setItem('dataArray', JSON.stringify(dataArray));

  agrupar();

  return dataArray;
}


///////////////////////FUNCION QUE AGRUPA EL DATA ARRAY CON LAS LECTURAS DEL PEDIDO////////////////////
function agrupar() {
  // Obtener el arreglo almacenado en localStorage
  var dataArray = JSON.parse(localStorage.getItem("dataArray")) || [];

  // Objeto para almacenar las cantidades consolidadas
  var cantidadesConsolidadas = {};

  // Recorrer el arreglo dataArray
  dataArray.forEach(function (item) {
      var articulo = item.ARTICULO;
      var cantidad = item.CANTIDAD_LEIDA;

      // Verificar si ya existe una cantidad para este artículo
      if (cantidadesConsolidadas.hasOwnProperty(articulo)) {
          // Si existe, sumar la cantidad
          cantidadesConsolidadas[articulo] += cantidad;
      } else {
          // Si no existe, agregar una nueva entrada
          cantidadesConsolidadas[articulo] = cantidad;
      }
  });

  // Crear un nuevo arreglo con los resultados consolidados
  var newArray = [];
  for (var articulo in cantidadesConsolidadas) {
      if (cantidadesConsolidadas.hasOwnProperty(articulo)) {
          newArray.push({
              ARTICULO: articulo,
              CANTIDAD_LEIDA: cantidadesConsolidadas[articulo],
          });
      }
  }

  // Actualizar el arreglo en localStorage con los resultados consolidados
  localStorage.setItem("dataArray", JSON.stringify(newArray));
}

// Funcion que elimina filas en la pestaña lectura
function eliminarFila(icon) {

    var row = icon.closest('tr');
    var articuloEliminado = row.querySelector('.sticky-column').innerText.trim();

    // Mostrar un SweetAlert antes de eliminar la fila
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'A continuación se va a eliminar una fila de la pestaña lectura',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {

            // Verificar si la fila está vacía
            var isEmptyRow = true;
            var cells = row.querySelectorAll('.codigo-barras-input');
            var artic = row.querySelector
            cells.forEach(function (cell) {
                if (cell.value.trim() !== '') {
                    isEmptyRow = false;
                }
            });

            // Elimina la fila solo si no está vacía
            if (isEmptyRow) {
                // Llamar función que guarda artículos en la tabla
                var dataFromTable = guardarTablaEnArray();

                Swal.fire({
                    icon: "warning",
                    title: "Está intentando borrar una fila vacia",
                    confirmButtonText: "Cerrar"
                });
            } else {
                row.remove();

                // Después de eliminar la fila, establecer el enfoque en el último campo de entrada en la columna COD
                const tableBody = document.querySelector('#tblbodyLectura');
                const ultimoCodigoBarrasInput = tableBody.querySelector('tr:last-child .codigo-barras-input');

                // Establecer el enfoque en el último campo de entrada
                if (ultimoCodigoBarrasInput) {
                    ultimoCodigoBarrasInput.focus();
                }
                // Llamar a la función para actualizar filas eliminadas con el artículo eliminado como parámetro
               // ActualizarFilasEliminadas(articuloEliminado);
                //RecargarVista();
                guardarTablaEnArray();
            }
            //RecargarVista()
        }
    });
    //guardarTablaEnArray();
}

//  //Funcion Actualizar fiilas eliminadas
//  function ActualizarFilasEliminadas(articuloEliminado) {
//   var ArticuloEliminado = articuloEliminado;
// // var numeroPedido = '@ViewBag.NumeroPedido';
// var numeroPedido = detallePedidoList.pPedido;
// console.log("Funcion Actualizar fiilas eliminadas");
// console.log("variable numeroPedido ");
// console.log(numeroPedido);
// var detalleCantidad = parseFloat(document.querySelector('#myTableVerificacion tbody tr:first-child td:nth-child(3)').innerText);
// var bodega = localStorage.getItem('selectedIndex');

// var url = '@Url.Action("ActualizaFilasEliminadas", "DetallePedido")';

// var dataToSend = {
//     articulo: ArticuloEliminado, // Serializar el array a JSON
//     numeroPedido: numeroPedido,
//     detalleCantidad: detalleCantidad,
//     bodega: parseInt(bodega) // Asumiendo que bodega es un entero
// };

// $.ajax({
//     url: url,
//     type: "POST",
//     data: dataToSend,
//     success: function (response) {
//         console.log(response);
//             // Resto del código de éxito

//             Swal.fire({
//                 icon: "success",
//                 title: "Datos eliminados correctamente",
//                 confirmButtonText: "Aceptar",
//             }).then((result) => {
//                 if (result.isConfirmed) {

//                 }
//             });
//         guardarTablaEnArray();
//        // RecargarVista();
//         },
//     error: function (xhr, textStatus, errorThrown) {
//         console.error("Error en la solicitud:", textStatus, errorThrown);
//         Swal.fire({
//             icon: "error",
//             title: "Error al eliminar los datos al servidor",
//             text: "Por favor, intenta nuevamente.",
//             confirmButtonText: "Aceptar"
//         });
//     }
// });
// }


////////Funcion que trae y arma el pedido a la tabla verificacion

function armarTablaVerificacion(detallePedidoList) {
  // Obtener la referencia del cuerpo de la tabla
  var tbody = document.getElementById('tblbodyVerificacion');

  // Limpiar el contenido actual del cuerpo de la tabla
  tbody.innerHTML = '';

  // Iterar sobre cada elemento en detallePedidoList
  detallePedidoList.forEach(function (detalle) {
    // Crear una nueva fila
    var newRow = tbody.insertRow();

    // Insertar celdas con los valores correspondientes
    var articuloCell = newRow.insertCell(0);
    articuloCell.textContent = detalle.ARTICULO;

    var codigoBarrasCell = newRow.insertCell(1);
    codigoBarrasCell.textContent = detalle.CODIGO_BARRA || ''; // Si CODIGO_BARRA es null, se asigna un string vacío

    var cantidadCell = newRow.insertCell(2);
    // cantidadCell.textContent = detalle.CANTIDAD_PEDIDA;
    cantidadCell.textContent = parseFloat(detalle.CANTIDAD_PEDIDA).toFixed(2);

    var cantidadLeidaCell = newRow.insertCell(3);
    cantidadLeidaCell.textContent = ''; // Inicialmente, se deja en blanco, puedes ajustar según tus necesidades

    var verificacionCell = newRow.insertCell(4);
    verificacionCell.textContent = ''; // También inicialmente en blanco, puedes ajustar según tus necesidades
  });
}

///FUNCION QUE VERIFICA LAS COINCIDENCIAS,TOMA LOS VALORES DE LAS CANTIDADES
// POR ARTICULO, COMPARA LO QUE TIENE EL ARRAY DEL LS Y VERIFICA LAS COINCIDENCIAS, PARA MOSTRARLO EN LA PESTAÑA VERIFICACION

function verificacion() {
  // RecargarVista();
   var dataArray = JSON.parse(localStorage.getItem('dataArray'));

   // Objeto para almacenar los totales de cantidades
   var cantidadesTotales = {};

   // Bucle para buscar coincidencias y sumar cantidades
   dataArray.forEach(function (item) {
       var articulo = item.ARTICULO;
       var cantidad = item.CANTIDAD_LEIDA;

       if (cantidadesTotales[articulo]) {
           cantidadesTotales[articulo] += cantidad;
       }
       else {
           cantidadesTotales[articulo] = cantidad;
       }
   });

   // Crear un nuevo array con los resultados
   var resultadoArray = [];

   // Bucle para agregar elementos al resultadoArray
   dataArray.forEach(function (item) {
       var articulo = item.ARTICULO;
       var cantidad = item.CANTIDAD_LEIDA;

       if (cantidadesTotales[articulo] === cantidad) {
           resultadoArray.push(item);
           delete cantidadesTotales[articulo];
       }
   });

   // Agregar las cantidades totales restantes al resultadoArray
   for (var articulo in cantidadesTotales) {
       resultadoArray.push({
           ARTICULO: articulo,
           CANTIDAD_PEDIDA: cantidadesTotales[articulo]f:
           
       });
   }

   // En este punto, resultadoArray contendrá los resultados deseados
   //console.log("Array con coincidencias sumadas")
   //console.log(resultadoArray);

   //Agregar resto de verificación
  //  var pedidoList = JSON.parse(document.getElementById('pedidoList').value);
  var pedidoList = detallePedidoList;
   console.log("Array pedidoList aqui")
   console.log(pedidoList);

   resultadoArray.forEach(resultado => {
       const pedido = pedidoList.find(pedido => pedido.ARTICULO === resultado.ARTICULO && parseFloat(pedido.CANTIDAD_PEDIDA) === resultado.CANTIDAD_PEDIDA);

       if (pedido) {
           // Buscar la tabla por su ID
           const tabla = document.getElementById('myTableVerificacion');

           // Verificar si la tabla existe
           if (tabla) {
               // Obtener el tbody de la tabla
               const tbody = tabla.querySelector('tbody');

               // Buscar todas las filas (tr) dentro del tbody
               const filas = tbody.querySelectorAll('tr');

               // Iterar a través de las filas
               filas.forEach(fila => {
                   // Encontrar la celda (td) con el valor de ARTICULO

                   const celdaARTICULO = fila.querySelector('h5');

                   // Verificar si la celda contiene el mismo valor que resultado.ARTICULO
                   //compara la cantidad del detalle del pedido con la cantidad de lo leido.
                   if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO ) {
                       // Encontrar la celda con el id "verificado"
                       const celdaVerificado = fila.querySelector('#verificado');

                       // Agregar el texto "Verificado" en la celda
                       if (celdaVerificado) {
                           celdaVerificado.textContent = '';
                           //agregar la ruta de la imagen
                           const iconoVerificacion = document.createElement('i');
                           iconoVerificacion.className = 'fa fa-check';  // Agrega las clases FontAwesome
                           // Agregar clases adicionales para cambiar el color a verde
                           iconoVerificacion.classList.add('verde'); // Agrega la clase 'verde' para cambiar el color
                           // Agregar el elemento <i> a la celda
                           celdaVerificado.appendChild(iconoVerificacion);
                       }
                       // Encuentra la celda de "CANTIDAD VERIFICADA" en cada fila para colocar la cantidad que fue leida
                       const cantidadVerificadaCell = fila.querySelector('[id="cantidadVerificada"]');
                       if (cantidadVerificadaCell) {
                           cantidadVerificadaCell.textContent = resultado.CANTIDAD_PEDIDA;
                       }
                   }
               });
           }
       }
       //No hay coincidencias
       else {
           // Buscar la tabla por su ID
           const tabla = document.getElementById('myTableVerificacion');
           // Array para almacenar mensajes de verificación
           const mensajesVerificacion = [];
           // Verificar si la tabla existe
           if (tabla) {
               // Obtener el tbody de la tabla
               const tbody = tabla.querySelector('tbody');

               // Buscar todas las filas (tr) dentro del tbody
               const filas = tbody.querySelectorAll('tr');

               // Iterar a través de las filas
               filas.forEach(fila => {
                   // Encontrar la celda (td) con el valor de ARTICULO

                   const celdaARTICULO = fila.querySelector('h5');

                   // Verificar si la celda contiene el mismo valor que resultado.ARTICULO en la fila correspondiente
                   if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO) {
                       // Encontrar la celda con el id "verificado"
                       const celdaVerificado = fila.querySelector('#verificado');

                       // Agregar el texto "Verificado" en la celda
                       if (celdaVerificado) {
                          /* celdaVerificado.textContent = ' ';*/

                       }

                       // Encuentra la celda de "CANT VERIF" en cada fila segun el codigo del artículo
                       const cantPedida = fila.querySelector('[id="cantidadPedida"]');
                       const cantidadVerificadaCell = fila.querySelector('[id="cantidadVerificada"]');

                       if (resultado.CANTIDAD_PEDIDA > parseFloat(cantPedida.textContent)) {
                           var resultadoOperacion = '+' + (resultado.CANTIDAD_PEDIDA - parseFloat(cantPedida.textContent)).toString();

                           celdaVerificado.textContent = resultadoOperacion;
                           agregarMensajeAlTextarea(`La cantidad verificada del artículo ${resultado.ARTICULO} es mayor a la solicitada.`);
                       } else if (resultado.CANTIDAD_PEDIDA < parseFloat(cantPedida.textContent)) {
                           var resultadoOperacion = (resultado.CANTIDAD_PEDIDA - parseFloat(cantPedida.textContent)).toString();

                           celdaVerificado.textContent = resultadoOperacion;
                           agregarMensajeAlTextarea(`La cantidad verificada del artículo ${resultado.ARTICULO} es menor a la solicitada.`);
                       }
                       // Encuentra la celda de "CANTIDAD VERIFICADA" en cada fila para colocar la cantidad que fue leida
                       if (cantidadVerificadaCell) {
                           cantidadVerificadaCell.textContent = resultado.CANTIDAD_PEDIDA;
                       }
                   }
               });//fin del forEach
           }
       }

   });
         // Después de realizar la verificación, habilitar o deshabilitar el botón DE PROCESAR
         if (todasLasFilasVerificadas() && detallePedidoList.ESTADO === 'F') {
          // Habilitar el botón "Procesar"
          document.getElementById('btnProcesar').removeAttribute('hidden');
}       else {
          // Deshabilitar el botón "Procesar"
          document.getElementById('btnProcesar').setAttribute('hidden', 'hidden');
          }
        // Después de realizar la verificación, habilitar o deshabilitar el botón " DE GUARDADO PARCIAL"
      if (activaGuardadoParcial()) {
          // Deshabilitar el botón "Procesar"
          document.getElementById('btnGuardar').setAttribute('hidden', 'hidden');
      } else {
          // Habilitar el botón "Procesar"
          document.getElementById('btnGuardar').removeAttribute('hidden');
      }
  }