//Variable global que contiene el detalle del pedido
var detalleLineasOrdenDeCompra = "";

document.addEventListener("DOMContentLoaded", function () {
console.log("DOM cargado");
});

function validarCodigoBarras(input) {
    const codBarra = input.value.toUpperCase(); // Convertir a mayúsculas
    const filaActual = input.closest('tr'); // Obtener la fila actual
    const celdaArticulo = filaActual.querySelector('td span'); // Seleccionar el span para el artículo
    const cantLeidaInput = filaActual.querySelector('input[id^="cant-leida"]'); // Input de cantidad leída

    if (codBarra) {
        // Asignar el código de barras al <span>
        celdaArticulo.textContent = codBarra;

        // Incrementar o inicializar el valor de cantidad leída
        let cantidadActual = parseInt(cantLeidaInput.value) || 0;
        cantLeidaInput.value = cantidadActual + 1;

        // Bloquear el campo del código de barras actual
       // input.setAttribute("readonly", "readonly");

        // Crear una nueva fila y guardar los datos
        crearNuevaFila();
        guardarTablaEnArray();
    }
}


  
  //////////////////////////////////////
 /////////// CREAR NUEVA FILA /////////
//////////////////////////////////////

function crearNuevaFila() {
    const tableBody = document.querySelector('#tblbodyLectura');
    const uniqueId = Date.now(); // Generar un ID único para los elementos

    const nuevaFilaHTML =
        `<tr>
            <td class="sticky-column" style="text-align: center;" style="user-select: none;">
                <span display: inline-block;"></span>
            </td>
            <td class="codigo-barras-cell">
                <input type="text" style="text-align: center;" id="codigo-barras-${uniqueId}" 
                    class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" autofocus>
            </td>
            <td class="codigo-barras-cell2" >
                <input id="cant-leida-${uniqueId}" style="text-align: center;" 
                    type="text" class="codigo-barras-input" value="" onchange="validarCantidadPedida(this)">
            </td>
            <td class="codigo-barras-cell2" >
                <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i>
            </td>
        </tr>`;

    tableBody.insertAdjacentHTML('beforeend', nuevaFilaHTML);

    // Enfocar el nuevo campo del código de barras
    const nuevoCodigoBarrasInput = tableBody.querySelector(`#codigo-barras-${uniqueId}`);
    if (nuevoCodigoBarrasInput) {
        nuevoCodigoBarrasInput.focus();
    }
}


///////////vALIDA LO QUE SE LEE CONTRA EL PEDIDO de la orden de comra./////////
function validarCantidadPedida() {
  //Llamado a guardar datos en la variable arrray en el LS
  guardarTablaEnArray();
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
  
    // Objeto para almacenar las cantidades consolidadas y el código de barra
    var cantidadesConsolidadas = {};
  
    // Recorrer el arreglo dataArray
    dataArray.forEach(function (item) {
        let articulo = item.ARTICULO;
        let codBarra = item.CODIGO_BARRA;
        let cantidad = item.CANTIDAD_LEIDA;
  
        // Verificar si ya existe una entrada para este artículo
        if (cantidadesConsolidadas.hasOwnProperty(articulo)) {
            // Si existe, sumar la cantidad
            cantidadesConsolidadas[articulo].CANTIDAD_LEIDA += cantidad;
        } else {
            // Si no existe, agregar una nueva entrada
            cantidadesConsolidadas[articulo] = {
                CODIGO_BARRA: codBarra,
                CANTIDAD_LEIDA: cantidad,
            };
        }
    });
  
    // Crear un nuevo arreglo con los resultados consolidados
    var newArray = [];
    for (var articulo in cantidadesConsolidadas) {
        if (cantidadesConsolidadas.hasOwnProperty(articulo)) {
            newArray.push({
                ARTICULO: articulo,
                CODIGO_BARRA: cantidadesConsolidadas[articulo].CODIGO_BARRA,
                CANTIDAD_LEIDA: cantidadesConsolidadas[articulo].CANTIDAD_LEIDA,
            });
        }
    }
  
    // Actualizar el arreglo en localStorage con los resultados consolidados
    localStorage.setItem("dataArray", JSON.stringify(newArray));
  }
  

// Funcion que elimina filas en la pestaña lectura
function eliminarFila(icon) {

    var row = icon.closest('tr');
    //var articuloEliminado = row.querySelector('.sticky-column').innerText.trim();

    // Mostrar un SweetAlert antes de eliminar la fila
    Swal.fire({
              title: '¿Estás seguro?',
              text: 'A continuación se va a eliminar una fila de la pestaña lectura',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#6e7881",
              confirmButtonText: 'Sí, eliminar',             
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
                guardarTablaEnArray();
            }            
        }
    });    
}


