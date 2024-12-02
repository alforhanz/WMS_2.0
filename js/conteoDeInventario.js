document.addEventListener("DOMContentLoaded", function () {
console.log("DOM cargado");
fechasDeInventario();
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
       let btnFinalizar = document.getElementById('btnFinalizar');
       let btnGuardaConteo = document.getElementById('btnGuardaConteo');
       
       if (btnFinalizar) btnFinalizar.hidden = false;
       if (btnGuardaConteo) btnGuardaConteo.hidden = true;


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
                <td style="text-align: center;"><h5 style="color: #f56108 ">${item.ARTICULO}</h5><h6>${item.CODIGO_BARRA}</h6></td>
                <td style="text-align: center;">${item.CODIGO_BARRA}</td>               
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
 //Funcion de confirmación del guardado parcial en la pestaña lectura
 function confirmarGuardadoParcialLectura() {
    Swal.fire({
        icon: 'info',
        title: '¿A continuación se guardaran los datos leidos de la Orden De Compra...?',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
    }).then((result) => {
        if (result.isConfirmed) {                  
            guardaParcialMenteLectura();    
        }
    });
}

function guardaParcialMenteLectura() {   
    const dataArray = JSON.parse(localStorage.getItem('dataArray')); // Obtener como objeto
    console.log("Data a enviar:", dataArray);

    if (!dataArray || dataArray.length === 0) {
        console.error("No hay datos en el localStorage para enviar.");
        return;
    }

    const pUsuario = localStorage.getItem('username');
    const pBodega = document.getElementById('bodega').value;
    const pEstado = 'G';
    const pFecha = document.getElementById('fecha_ini').value;
    const pUbicacion = document.getElementById('ubicacion').value;      
    const chunkSize = 50; // Tamaño del bloque
    const totalChunks = Math.ceil(dataArray.length / chunkSize);

    // Función para enviar cada bloque
    const sendChunk = (chunk, index) => {
        const params = `?pUsuario=${pUsuario}&pBodega=${pBodega}&pEstado=${pEstado}&pFecha=${pFecha}&jsonDetalles=${encodeURIComponent(JSON.stringify(chunk))}&pUbicacion=${pUbicacion}`;
        
        console.log(`Enviando bloque ${index + 1}/${totalChunks}:`, chunk);

        fetch(env.API_URL + "wmsguardaconteoinv/I" + params, myInit)
            .then(response => response.json())
            .then(result => {
                if (result.msg === "SUCCESS") {
                    console.log(`Bloque ${index + 1} guardado con éxito.`);
                    limpiarResultadoGeneral();
                    crearNuevaFila();
                } else {
                    console.error(`Error al guardar bloque ${index + 1}:`, result.message);
                }
            })
            .catch(error => {
                console.error(`Error en el envío del bloque ${index + 1}:`, error);
            });
    };

    // Dividir y enviar en bloques
    for (let i = 0; i < totalChunks; i++) {
        const chunk = dataArray.slice(i * chunkSize, (i + 1) * chunkSize);
        sendChunk(chunk, i);
    }
}


///////FUNCION PARA Finalizar//////       
function confirmaFinalizar() {  
  
      Swal.fire({
          icon: 'warning',
          title: '¿Desea Finalizar el conteo',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#6e7881",
      }).then((result) => {
        if (result.isConfirmed) {             
           console.log('LLama a finalizar conteo');
           finalizaConteoInventario()
        }
      });    
  }

  function finalizaConteoInventario() {   
    const dataArray = JSON.parse(localStorage.getItem('dataArray')); // Obtener como objeto
    console.log("Data a enviar:", dataArray);

    if (!dataArray || dataArray.length === 0) {
        console.error("No hay datos en el localStorage para enviar.");
        return;
    }

    const pUsuario = localStorage.getItem('username');
    const pBodega = document.getElementById('bodega').value;
    const pEstado = 'P';
    const pFecha = document.getElementById('fecha_ini').value;
    const pUbicacion = document.getElementById('ubicacion').value;      
    const chunkSize = 50; // Tamaño del bloque
    const totalChunks = Math.ceil(dataArray.length / chunkSize);

    // Función para enviar cada bloque
    const sendChunk = (chunk, index) => {
        const params = `?pUsuario=${pUsuario}&pBodega=${pBodega}&pEstado=${pEstado}&pFecha=${pFecha}&jsonDetalles=${encodeURIComponent(JSON.stringify(chunk))}&pUbicacion=${pUbicacion}`;
        
        console.log(`Enviando bloque ${index + 1}/${totalChunks}:`, chunk);

        fetch(env.API_URL + "wmsguardaconteoinv/I" + params, myInit)
            .then(response => response.json())
            .then(result => {
                if (result.msg === "SUCCESS") {
                    console.log(`Bloque ${index + 1} finalizado con éxito.`);
                    limpiarResultadoGeneral();
                    crearNuevaFila();
                } else {
                    console.error(`Error al guardar bloque ${index + 1}:`, result.message);
                }
            })
            .catch(error => {
                console.error(`Error en el envío del bloque ${index + 1}:`, error);
            });
    };

    // Dividir y enviar en bloques
    for (let i = 0; i < totalChunks; i++) {
        const chunk = dataArray.slice(i * chunkSize, (i + 1) * chunkSize);
        sendChunk(chunk, i);
    }
}


function limpiarResultadoGeneral() {

    const tabla = document.getElementById("myTableLectura");
    const ubicacion = document.getElementById("ubicacion");
    ubicacion ? (ubicacion.innerHTML = "") : null;
     // Limpiar el contenido del tbody de la tabla si la tabla existe
  if (tabla) {
    const tbody = document.getElementById("tblbodyLectura");
    tbody ? (tbody.innerHTML = "") : null;
 
  }

}

function activabtnguardar()
{
    let btnFinalizar = document.getElementById('btnFinalizar');
    let btnGuardaConteo = document.getElementById('btnGuardaConteo');
    
    if (btnFinalizar) btnFinalizar.hidden = true;
    if (btnGuardaConteo) btnGuardaConteo.hidden = false;

}

function fechasDeInventario() {
    const pBodega = document.getElementById('bodega').value;
    const params = `?pBodega=${pBodega}`;

    fetch(env.API_URL + "wmsfechainventario" + params, myInit)
        .then((response) => response.json())
        .then((result) => {
            const resultado = result.fechainv; // Arreglo con las fechas
            console.log("Fechas programadas: ");
            console.log(resultado);

            const fechaSelect = document.getElementById('fecha_ini');

            // Limpiar opciones previas
            fechaSelect.innerHTML = '<option value="" disabled selected>Selecciona una fecha</option>';

            if(resultado.length > 0){
                          // Agregar cada fecha como una opción formateada
            resultado.forEach(item => {
                const option = document.createElement('option');
                
                // Formatear la fecha para mostrar solo "YYYY-MM-DD"
                const fechaFormateada = item.fecha.split(" ")[0];
                
                option.value = fechaFormateada; // Valor del atributo 'value'
                option.textContent = fechaFormateada; // Texto visible en la lista
                fechaSelect.appendChild(option);
            });

            // Actualizar el componente select de Materialize (si lo estás usando)
            const elems = document.querySelectorAll('select');
            M.FormSelect.init(elems); // Esto es necesario si usas Materialize
            } else{
                Swal.fire({
                    title: "Información",
                    text: "En este momento no cuenta con una fecha de inventario programada",
                    confirmButtonText: "Cerrar",
                    confirmButtonColor: "#28a745",
                    icon: "warning"
                });
            }      
        })
        .catch(error => console.error("Error en la solicitud:", error));
}



