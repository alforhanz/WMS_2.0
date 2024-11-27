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
        const params =
        "?pCodigoLectura=" +
        codBarra;
        fetch(env.API_URL + "wmsverificacodigo" + params, myInit)  
        .then((response) => response.json())
        .then((result) => {
                console.log(result.codigo[0].CodigoArticulo);
            // Asignar el código de barras al <span>
            celdaArticulo.textContent = result.codigo[0].CodigoArticulo;

            // Incrementar o inicializar el valor de cantidad leída
            let cantidadActual = parseInt(cantLeidaInput.value) || 0;
            cantLeidaInput.value = cantidadActual + 1;

            // Bloquear el campo del código de barras actual
            input.setAttribute("readonly", "readonly");

            // Crear una nueva fila y guardar los datos
            crearNuevaFila();
            guardarTablaEnArray();
        });    
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
                    type="text" class="codigo-barras-input" value="" onchange="validarCantidades(this)">
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
function validarCantidades() {
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

function resumen() {
    // Obtener el arreglo almacenado en localStorage
    const dataArray = JSON.parse(localStorage.getItem("dataArray")) || [];
    let ubicacion = document.getElementById('ubicacion').value;

    // Obtener el cuerpo de la tabla resumen
    const tablaResumenBody = document.getElementById("tblbodyRersumen");

    // Limpiar la tabla antes de insertar nuevos datos
    tablaResumenBody.innerHTML = "";

    // Iterar sobre el dataArray y agregar filas a la tabla
    dataArray.forEach((item) => {
        const nuevaFilaHTML = `
            <tr>
                <td style="text-align: center;">${item.ARTICULO}</td>
                <td style="text-align: center;">${item.CODIGO_BARRA}</td>
                <td style="text-align: center;">${item.CANTIDAD_LEIDA}</td>
                 <td style="text-align: center;">${item.CANTIDAD_LEIDA}</td>
                <td style="text-align: center;  text-transform: uppercase;">${ubicacion}</td>
            </tr>`;
        tablaResumenBody.insertAdjacentHTML("beforeend", nuevaFilaHTML);
    });

    // Actualizar el contador de registros
    const cantidadDeRegistros = document.getElementById("cantidadDeRegistros");
    cantidadDeRegistros.textContent = `Registros: ${dataArray.length}`;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Funcion de confirmación del guardado parcial
 function confirmarGuardadoParcial() {
    Swal.fire({
        icon: 'info',
        title: '¿A continuación se guardaran los datos leidos en el proceso de conteo...?',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
    }).then((result) => {
        if (result.isConfirmed) {
            let usuario = localStorage.getItem('username'); 
            let fecha = document.getElementById('fecha_ini').value
            let ubicacion = document.getElementById('ubicacion').value;
            let ubicacionUpperCase = ubicacion.toUpperCase();
            let datosLecturaArray = localStorage.getItem('dataArray');
            let bodega = document.getElementById('bodega').value
            let opcion = 'G';
            let pEstado = "I";

             // Convertir el array de objetos a formato JSON
            const chunkSize = 50; // Tamaño del bloque
            const totalChunks = Math.ceil(datosLecturaArray.length / chunkSize);

            const sendChunk = (chunk, index) => {
                const params = 
                    "?pUsuario=" + usuario +
                    "&pOpcion="+ opcion +
                    "&pBodega=" + bodega+
                    "&pEstado=" + pEstado +
                    "&pFechaIni=" + fecha +
                    "&jsonDetalles=" + encodeURIComponent(JSON.stringify(chunk))+
                    "&pUbicacion=" + ubicacionUpperCase ;
                    
    fetch(env.API_URL + "wmsguardaconteoinv/G" + params, myInit)
            .then((response) => response.json())
            .then((result) => {
                if (result.msg === "SUCCESS") {
                    console.log(`Chunk ${index + 1} guardado con éxito.`);
                    // Manejar la respuesta de éxito de los chunks
                    if (index === totalChunks - 1) { // Último chunk
                        Swal.fire({
                            icon: "success",
                            title: "Datos guardados correctamente",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#28a745",
                            cancelButtonColor: "#6e7881",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log('guardado correcto')
                            }
                        });
                    }
                } else {
                    console.error(`Error al guardar chunk ${index + 1}:`, result);
                }
            });
    };   
// Dividir jsonDetalles en bloques y enviarlos
for (let i = 0; i < totalChunks; i++) {
    const chunk = datosLecturaArray.slice(i * chunkSize, (i + 1) * chunkSize);
    sendChunk(chunk, i);
}

}});
}