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
                console.log('Verificacion de codigo');
                console.log(result.codigo[0].CodigoArticulo);
            if(result.codigo[0].CodigoArticulo != 'ND'){
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
            }else{
                Swal.fire({
                    icon: 'warning',
                    title: 'El código ingresado no es válido. Verifíquelo nuevamente o consulte a su supervisor.',               
                    confirmButtonText: 'Cerrar',
                    confirmButtonColor: "#28a745",                
                });
                 // Borrar el contenido del input de código de barras
                 input.value = "";
            }       
        });    
    }
}

 /////////// CREAR NUEVA FILA /////////

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

// function resumen() {

//     let btnFinalizar = document.getElementById('btnFinalizar');
//     let btnResumenGeneral =document.getElementById('btnResumenGeneral');
//     let btnGuardaConteo = document.getElementById('btnGuardaConteo');       
//     if (btnFinalizar) btnFinalizar.hidden = false;
//     if (btnResumenGeneral) btnResumenGeneral.hidden= false;
//     if (btnGuardaConteo) btnGuardaConteo.hidden = true;
//     const tabla = document.getElementById('myTableresumen');
//     //const ubicacion = document.getElementById('ubicacion').value;
//     const fechaInv = document.getElementById('fecha_ini').value;

    
//         if(tabla && tabla.rows.length > 0 && fechaInv.length>0){
//                            // Actualizar los encabezados de la tabla
//             const encabezado = ['ARTICULO', 'COD', 'CANT', 'UBI', 'CL']; // Nuevas columnas de la tabla
//             const thead = tabla.querySelector('thead');
//             thead.innerHTML = ''; // Limpiar encabezados previos

//             const filaEncabezado = document.createElement('tr');
//             filaEncabezado.className = 'themeColor';
//             encabezado.forEach(columna => {
//                 const th = document.createElement('th');
//                 th.textContent = columna;
//                 filaEncabezado.appendChild(th);
//             });
//             thead.appendChild(filaEncabezado);

//            const pSistema = 'WMS';
//            const pUsuario = localStorage.getItem('username');
//            const pOpcion = 'D';
//            const pBodega = document.getElementById('bodega').value;
//            const pFecha = document.getElementById('fecha_ini').value;
//            const pSoloContados = 'S';
//            const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pOpcion=${pOpcion}&pBodega=${pBodega}&pFecha=${pFecha}&pSoloContados=${pSoloContados}`;
    
//            fetch(env.API_URL + "wmsresumeninventario"+ params, myInit)
//            .then((response) => response.json())
//            .then((result) => {
//              if (result.msg === "SUCCESS") {
//                 console.log('RESUMEN');
//                console.log(result.resumen);
    
//             // Obtener el arreglo del API
//                 const dataArray = result.resumen || [];

    
//             // Obtener el cuerpo de la tabla resumen
//                 const tablaResumenBody = document.getElementById("tblbodyRersumen");
    
//             // Limpiar la tabla antes de insertar nuevos datos
//                 tablaResumenBody.innerHTML = "";
    
//             // Iterar sobre el dataArray y agregar filas a la tabla
//                 dataArray.forEach((item) => {
//                     const nuevaFilaHTML = `
//                         <tr>                            
//                             <td style="text-align: center;"><h5 style="color: #f56108 ">${item.ARTICULO}</h5><h6>${item.DESCRIPCION}</h6></td>
//                             <td style="text-align: center;">${item.BARCODEQR}</td>               
//                             <td style="text-align: center;">${item.CONTEO}</td>
//                             <td style="text-align: center;  text-transform: uppercase;">${item.UBICACION}</td>
//                             <td>
//                             <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFilaResumen(this)">clear</i>
//                             </td>
//                         </tr>`;
//                     tablaResumenBody.insertAdjacentHTML("beforeend", nuevaFilaHTML);
//                 });
    
//                 // Actualizar el contador de registros
//                 const cantidadDeRegistros = document.getElementById("cantidadDeRegistros");
//                 cantidadDeRegistros.textContent = `Registros: ${dataArray.length}`;    
//              }
//            });
//     }else{
//         Swal.fire({
//             icon: 'warning',
//             title: 'Debe seleccionar una fecha programada de inventario',               
//             confirmButtonText: 'Cerrar',
//             confirmButtonColor: "#28a745",                
//         });

//           // Actualizar el contador de registros
//           const cantidadDeRegistros = document.getElementById("cantidadDeRegistros");
//           cantidadDeRegistros.textContent =`Registros: 0`;  
//     } 
// }

// // Función que genera y actualiza la tabla myTableresumen usando datos de un API
// async function resumenGeneral() {
//     // Obtener la tabla y sus elementos
//     const tablaResumen = document.getElementById('myTableresumen');
//     const tblBodyResumen = document.getElementById('tblbodyRersumen');
//     const labelCantidadRegistros = document.getElementById('cantidadDeRegistros'); // Obtener el label
//     // Limpiar el contenido previo del cuerpo de la tabla
//     tblBodyResumen.innerHTML = '';

//     // Actualizar los encabezados de la tabla
//     const encabezado = ['ARTICULO', 'COD', 'CANT', 'EXIST', 'DIF']; // Nuevas columnas de la tabla
//     const thead = tablaResumen.querySelector('thead');
//     thead.innerHTML = ''; // Limpiar encabezados previos

//     const filaEncabezado = document.createElement('tr');
//     filaEncabezado.className = 'themeColor';
//     encabezado.forEach(columna => {
//         const th = document.createElement('th');
//         th.textContent = columna;
//         filaEncabezado.appendChild(th);
//     });
//     thead.appendChild(filaEncabezado);

//     try {
//         // Obtener parámetros para la llamada al API
//         const pSistema = 'WMS';
//         const pUsuario = localStorage.getItem('username');
//         const pOpcion = 'R'; // Parámetro específico para resumen general
//         const pBodega = document.getElementById('bodega').value;
//         const pFecha = document.getElementById('fecha_ini').value;
//         const pSoloContados = 'S';
//         const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pOpcion=${pOpcion}&pBodega=${pBodega}&pFecha=${pFecha}&pSoloContados=${pSoloContados}`;
//             console.log('PARAMETROS');
//             console.log(params);
//         // Realizar la llamada al API
//         const response = await fetch(env.API_URL + "wmsresumeninventario" + params, myInit);

//         if (!response.ok) {
//             throw new Error(`Error en la solicitud: ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.msg === "SUCCESS") {
//             const datos = result.resumen || []; // Asumimos que el API devuelve un array de objetos
//             console.log('RESULTADO FINAL');           
//             console.log(datos);
//             labelCantidadRegistros.textContent = `Cantidad de registros: ${datos.length}`;
//             datos.forEach(dato => {
//                 const fila = document.createElement('tr');
                
//                  // Aplicar estilo si CONSILIADO es 'N'
//                  if (dato.CONCILIADO === 'N') {
//                     fila.classList.add('fila-no-consiliada'); // Clase personalizada para estilos
//                 }
//                 // Crear celdas con los datos de cada fila
//                 const celdaArticulo = document.createElement('td');
//                 celdaArticulo.textContent = dato.ARTICULO || 'N/A';
//                 fila.appendChild(celdaArticulo);

//                 const celdaCod = document.createElement('td');
//                 celdaCod.textContent = dato.BARCODEQR || 'N/A';
//                 fila.appendChild(celdaCod);

//                 const celdaCant = document.createElement('td');
//                 celdaCant.textContent = dato.CONTEO || 'N/A';
//                 fila.appendChild(celdaCant);

//                 const celdaExist = document.createElement('td');
//                 celdaExist.textContent = dato.EXISTENCIA || 'N/A';
//                 fila.appendChild(celdaExist);

//                 const celdaDif = document.createElement('td');
//                 celdaDif.textContent = dato.DIFERENCIA || 'N/A';
//                 fila.appendChild(celdaDif);

//                 // Agregar la fila al cuerpo de la tabla
//                 tblBodyResumen.appendChild(fila);
//             });
            
//         } else {
           
//             const mensajeError = document.createElement('tr');
//             const celdaError = document.createElement('td');
//             celdaError.colSpan = encabezado.length;
//             celdaError.textContent = 'No se encontraron datos para mostrar.';
//             mensajeError.appendChild(celdaError);
//             tblBodyResumen.appendChild(mensajeError);
//             labelCantidadRegistros.textContent = `Cantidad de registros: 0`;
//             return;
//         }

//     } catch (error) {
//         console.error('Error al generar la tabla:', error);
//         const mensajeError = document.createElement('tr');
//         const celdaError = document.createElement('td');
//         celdaError.colSpan = encabezado.length;
//         celdaError.textContent = 'Hubo un error al cargar los datos. Inténtalo de nuevo más tarde.';
//         mensajeError.appendChild(celdaError);
//         tblBodyResumen.appendChild(mensajeError);
//         labelCantidadRegistros.textContent = `Cantidad de registros: 0`;
//         return;
//     }
// }

function resumen() {
    let btnFinalizar = document.getElementById('btnFinalizar');
    let btnResumenGeneral = document.getElementById('btnResumenGeneral');
    let btnGuardaConteo = document.getElementById('btnGuardaConteo');
    if (btnFinalizar) btnFinalizar.hidden = false;
    if (btnResumenGeneral) btnResumenGeneral.hidden = false;
    if (btnGuardaConteo) btnGuardaConteo.hidden = true;

    const tabla = document.getElementById('myTableresumen');
    const fechaInv = document.getElementById('fecha_ini').value;

    if (tabla && tabla.rows.length > 0 && fechaInv.length > 0) {
        // Actualizar los encabezados de la tabla
        const encabezado = ['ARTICULO', 'COD', 'CANT', 'UBI', 'CL']; // Nuevas columnas de la tabla
        const thead = tabla.querySelector('thead');
        thead.innerHTML = ''; // Limpiar encabezados previos

        const filaEncabezado = document.createElement('tr');
        filaEncabezado.className = 'themeColor';
        encabezado.forEach((columna, index) => {
            const th = document.createElement('th');
            th.textContent = columna;
            th.dataset.index = index; // Almacenar el índice de la columna
            th.style.cursor = 'pointer'; // Mostrar cursor de puntero
            th.addEventListener('click', () => ordenarTabla(index)); // Agregar evento de clic
            filaEncabezado.appendChild(th);
        });
        thead.appendChild(filaEncabezado);

        const pSistema = 'WMS';
        const pUsuario = localStorage.getItem('username');
        const pOpcion = 'D';
        const pBodega = document.getElementById('bodega').value;
        const pFecha = document.getElementById('fecha_ini').value;
        const pSoloContados = 'S';
        const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pOpcion=${pOpcion}&pBodega=${pBodega}&pFecha=${pFecha}&pSoloContados=${pSoloContados}`;

        fetch(env.API_URL + "wmsresumeninventario" + params, myInit)
            .then((response) => response.json())
            .then((result) => {
                if (result.msg === "SUCCESS") {
                    console.log('RESUMEN');
                    console.log(result.resumen);

                    // Obtener el arreglo del API
                    const dataArray = result.resumen || [];

                    // Obtener el cuerpo de la tabla resumen
                    const tablaResumenBody = document.getElementById("tblbodyRersumen");

                    // Limpiar la tabla antes de insertar nuevos datos
                    tablaResumenBody.innerHTML = "";

                    // Iterar sobre el dataArray y agregar filas a la tabla
                    dataArray.forEach((item) => {
                        const nuevaFilaHTML = `
                            <tr>
                                <td style="text-align: center;"><h5 style="color: #f56108 ">${item.ARTICULO}</h5><h6>${item.DESCRIPCION}</h6></td>
                                <td style="text-align: center;">${item.BARCODEQR}</td>
                                <td style="text-align: center;">${item.CONTEO}</td>
                                <td style="text-align: center; text-transform: uppercase;">${item.UBICACION}</td>
                                <td>
                                    <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFilaResumen(this)">clear</i>
                                </td>
                            </tr>`;
                        tablaResumenBody.insertAdjacentHTML("beforeend", nuevaFilaHTML);
                    });

                    // Actualizar el contador de registros
                    const cantidadDeRegistros = document.getElementById("cantidadDeRegistros");
                    cantidadDeRegistros.textContent = `Registros: ${dataArray.length}`;
                }
            });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Debe seleccionar una fecha programada de inventario',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: "#28a745",
        });

        // Actualizar el contador de registros
        const cantidadDeRegistros = document.getElementById("cantidadDeRegistros");
        cantidadDeRegistros.textContent = `Registros: 0`;
    }

    // Función para ordenar la tabla
    function ordenarTabla(index) {
        const tablaBody = document.getElementById("tblbodyRersumen");
        const filas = Array.from(tablaBody.rows);

        // Determinar si la columna es numérica o alfabética
        const tipo = typeof filas[0].cells[index].textContent.trim() === 'number' ? 'num' : 'str';

        // Ordenar las filas
        filas.sort((a, b) => {
            const cellA = a.cells[index].textContent.trim();
            const cellB = b.cells[index].textContent.trim();
            return tipo === 'num' 
                ? parseFloat(cellA) - parseFloat(cellB) 
                : cellA.localeCompare(cellB);
        });

        // Volver a agregar las filas ordenadas al cuerpo de la tabla
        filas.forEach(fila => tablaBody.appendChild(fila));
    }
}


async function resumenGeneral() {

    let btnFinalizar = document.getElementById('btnFinalizar');
    if (btnFinalizar) btnFinalizar.hidden = true;
    const tablaResumen = document.getElementById('myTableresumen');
    const tblBodyResumen = document.getElementById('tblbodyRersumen');
    const labelCantidadRegistros = document.getElementById('cantidadDeRegistros');
    tblBodyResumen.innerHTML = '';

    const encabezado = ['ARTICULO', 'COD', 'CANT', 'EXIST', 'DIF'];
    const thead = tablaResumen.querySelector('thead');
    thead.innerHTML = '';

    const filaEncabezado = document.createElement('tr');
    filaEncabezado.className = 'themeColor';
    encabezado.forEach((columna, index) => {
        const th = document.createElement('th');
        th.textContent = columna;
        th.setAttribute('data-column', index); // Asignar índice para identificar la columna
        th.style.cursor = 'pointer'; // Cambiar el cursor para indicar que es clicable
        th.addEventListener('click', () => ordenarTabla(index)); // Agregar evento de click
        filaEncabezado.appendChild(th);
    });
    thead.appendChild(filaEncabezado);

    try {
        const pSistema = 'WMS';
        const pUsuario = localStorage.getItem('username');
        const pOpcion = 'R';
        const pBodega = document.getElementById('bodega').value;
        const pFecha = document.getElementById('fecha_ini').value;
        const pSoloContados = 'S';
        const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pOpcion=${pOpcion}&pBodega=${pBodega}&pFecha=${pFecha}&pSoloContados=${pSoloContados}`;

        const response = await fetch(env.API_URL + "wmsresumeninventario" + params, myInit);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

        const result = await response.json();
        if (result.msg === "SUCCESS") {
            const datos = result.resumen || [];
            labelCantidadRegistros.textContent = `Cantidad de registros: ${datos.length}`;
            renderizarDatos(datos);
        } else {
            mostrarMensajeError('No se encontraron datos para mostrar.', encabezado.length);
            labelCantidadRegistros.textContent = 'Cantidad de registros: 0';
        }
    } catch (error) {
        console.error('Error al generar la tabla:', error);
        mostrarMensajeError('Hubo un error al cargar los datos. Inténtalo de nuevo más tarde.', encabezado.length);
        labelCantidadRegistros.textContent = 'Cantidad de registros: 0';
    }

    function renderizarDatos(datos) {
        tblBodyResumen.innerHTML = '';
        datos.forEach(dato => {
            const fila = document.createElement('tr');
            if (dato.CONCILIADO === 'N') {
                //fila.style.backgroundColor = '#f8d7da';
                fila.style.color = '#f56108';
                fila.style.fontWeight = 'bold';
            }
            ['ARTICULO', 'BARCODEQR', 'CONTEO', 'EXISTENCIA', 'DIFERENCIA'].forEach(campo => {
                const celda = document.createElement('td');
                celda.textContent = dato[campo] || 'N/A';
                fila.appendChild(celda);
            });
            tblBodyResumen.appendChild(fila);
        });
    }

    function ordenarTabla(indiceColumna) {
        const filas = Array.from(tblBodyResumen.querySelectorAll('tr'));
        const ordenAscendente = !thead.getAttribute('data-order') || thead.getAttribute('data-order') === 'desc';
        filas.sort((a, b) => {
            const valorA = a.children[indiceColumna].textContent.trim();
            const valorB = b.children[indiceColumna].textContent.trim();
            if (!isNaN(valorA) && !isNaN(valorB)) {
                return ordenAscendente ? valorA - valorB : valorB - valorA;
            }
            return ordenAscendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
        });
        filas.forEach(fila => tblBodyResumen.appendChild(fila));
        thead.setAttribute('data-order', ordenAscendente ? 'asc' : 'desc');
    }

    function mostrarMensajeError(mensaje, columnas) {
        const mensajeError = document.createElement('tr');
        const celdaError = document.createElement('td');
        celdaError.colSpan = columnas;
        celdaError.textContent = mensaje;
        mensajeError.appendChild(celdaError);
        tblBodyResumen.appendChild(mensajeError);
    }
}



 //Funcion de confirmación del guardado parcial en la pestaña lectura
 function confirmarGuardadoParcialLectura() {
        const tabla = document.getElementById('myTableLectura');
        //const tbody = document.getElementById("tblbodyLectura");
        const ubicacion = document.getElementById('ubicacion').value;
        const fechaInv = document.getElementById('fecha_ini').value;
       

        if(tabla && tabla.rows.length > 2 && ubicacion.length > 0 && fechaInv.length>0){
            Swal.fire({
                icon: 'info',
                title: '¿A continuación se guardaran los datos leidos?',
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
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Está intentando guardar sin antes realizar una lectura válida del inventario. Recuerde verificar la ubicación y la fecha asignadas al inventario.',               
                confirmButtonText: 'Cerrar',
                confirmButtonColor: "#28a745",                
            });
        }
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
          title: '¿Desea Finalizar el conteo del inventario',
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
    const tabla = document.getElementById('myTableresumen');
    const filas = tabla.querySelectorAll('tbody tr'); // Obtiene todas las filas del cuerpo de la tabla

    // Crear el arreglo para almacenar los datos
    const dataArray = [];

    // Recorrer las filas de la tabla
    filas.forEach(fila => {
        const columnas = fila.getElementsByTagName('td');

        // Extraer los datos de cada columna
        const articulo = columnas[0].querySelector('h5').innerText; // Artículo está en el <h5>
        const descripcion = columnas[0].querySelector('h6').innerText; // Descripción está en el <h6>
        const barcodeqr = columnas[1].innerText; // Código de barras
        const conteo = parseInt(columnas[2].innerText); // Cantidad
        const ubicacion = columnas[3].innerText.trim(); // Ubicación

        // Crear un objeto con los datos de la fila
        const filaDatos = {
            ARTICULO: articulo,
            DESCRIPCION: descripcion,
            BARCODEQR: barcodeqr,
            CONTEO: conteo,
            UBICACION: ubicacion
        };

        // Agregar la fila al arreglo
        dataArray.push(filaDatos);
    });

    // Verificar si hay datos en el arreglo
    if (dataArray.length === 0) {
        console.error("No hay datos en la tabla para enviar.");
        return;
    }

    // Transformar el arreglo en JSON
    const jsonDetalles = JSON.stringify(dataArray);
    console.log("JSON Detalles a enviar:", jsonDetalles);

    // Parámetros adicionales
    const pUsuario = localStorage.getItem('username');
    const pBodega = document.getElementById('bodega').value;
    const pEstado = 'P';
    const pFecha = document.getElementById('fecha_ini').value;
    const pUbicacion = document.getElementById('ubicacion').value;      
    const chunkSize = 20; // Tamaño del bloque
    const totalChunks = Math.ceil(dataArray.length / chunkSize);

    // Función para enviar cada bloque
    const sendChunk = (chunk, index) => {
        const params = `?pUsuario=${pUsuario}&pBodega=${pBodega}&pEstado=${pEstado}&pFecha=${pFecha}&jsonDetalles=${encodeURIComponent(JSON.stringify(chunk))}&pUbicacion=${pUbicacion}`;
        // console.log('params: ');
        // console.log(params);
        // console.log(`Enviando bloque ${index + 1}/${totalChunks}:`, chunk);

        fetch(env.API_URL + "wmsguardaconteoinv/I" + params, myInit)
            .then(response => response.json())
            .then(result => {
                console.log('Resultado del API: ');
                console.log(result.conteoguardado[0].Mensaje);
                if (result.msg === "SUCCESS") {
                    //console.log(`Bloque ${index + 1} finalizado con éxito.`);
                    limpiarResultadoGeneral();
                    // Cambiar automáticamente a la pestaña "Lectura"
                    const tabsInstance = M.Tabs.getInstance(document.querySelector('.tabs'));
                    tabsInstance.select('tabla-lectura');
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

// function finalizaConteoInventario() {   
//     const tabla = document.getElementById('myTableresumen');
//     const filas = tabla.querySelectorAll('tbody tr'); 

//     // Crear el arreglo para almacenar los datos
//     const dataArray = [];

//     filas.forEach(fila => {
//         const columnas = fila.getElementsByTagName('td');

//         // Extraer los datos de cada columna
//         const articulo = columnas[0].querySelector('h5')?.innerText || ''; 
//         const descripcion = columnas[0].querySelector('h6')?.innerText || '';
//         const barcodeqr = columnas[1]?.innerText || ''; 
//         const conteo = parseInt(columnas[2]?.innerText || 0); 
//         const ubicacion = columnas[3]?.innerText.trim() || '';

//         if (articulo && descripcion && barcodeqr) {
//             dataArray.push({ ARTICULO: articulo, DESCRIPCION: descripcion, BARCODEQR: barcodeqr, CONTEO: conteo, UBICACION: ubicacion });
//         }
//     });

//     if (dataArray.length === 0) {
//         console.error("No hay datos en la tabla para enviar.");
//         return;
//     }

//     const jsonDetalles = JSON.stringify(dataArray);
//     console.log("JSON Detalles a enviar:", jsonDetalles);

//     const pUsuario = localStorage.getItem('username');
//     const pBodega = document.getElementById('bodega')?.value || '';
//     const pEstado = 'P';
//     const pFecha = document.getElementById('fecha_ini')?.value || '';
//     const pUbicacion = document.getElementById('ubicacion')?.value || '';
//     const chunkSize = 50;
//     const totalChunks = Math.ceil(dataArray.length / chunkSize);

//     if (!pUsuario || !pBodega || !pFecha || !pUbicacion) {
//         console.error("Faltan parámetros necesarios para enviar la solicitud.");
//         return;
//     }

//     const sendChunk = (chunk, index) => {
//         const params = `?pUsuario=${pUsuario}&pBodega=${pBodega}&pEstado=${pEstado}&pFecha=${pFecha}&pUbicacion=${pUbicacion}`;
//         const body = JSON.stringify(chunk);

//         fetch(env.API_URL + "wmsguardaconteoinv/I" + params, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: body
//         })
//         .then(response => response.json())
//         .then(result => {
//             if (result.msg === "SUCCESS") {
//                 console.log(`Bloque ${index + 1}/${totalChunks} guardado con éxito.`);
//                 limpiarResultadoGeneral();

//                 // Cambiar a la pestaña "Lectura" si el último bloque fue exitoso
//                 if (index === totalChunks - 1) {
//                     const tabsInstance = M.Tabs.getInstance(document.querySelector('.tabs'));
//                     tabsInstance.select('tabla-lectura');
//                 }
//             } else {
//                 console.error(`Error en el bloque ${index + 1}: ${result.message}`);
//             }
//         })
//         .catch(error => {
//             console.error(`Error en el envío del bloque ${index + 1}:`, error);
//         });
//     };

//     for (let i = 0; i < totalChunks; i++) {
//         const chunk = dataArray.slice(i * chunkSize, (i + 1) * chunkSize);
//         sendChunk(chunk, i);
//     }
// }
// function finalizaConteoInventario() {   
//     const tabla = document.getElementById('myTableresumen');
//     const filas = tabla.querySelectorAll('tbody tr'); 

//     // Crear el arreglo para almacenar los datos
//     const dataArray = [];

//     filas.forEach(fila => {
//         const columnas = fila.getElementsByTagName('td');

//         const articulo = columnas[0].querySelector('h5')?.innerText || ''; 
//         const descripcion = columnas[0].querySelector('h6')?.innerText || '';
//         const barcodeqr = columnas[1]?.innerText || ''; 
//         const conteo = parseInt(columnas[2]?.innerText || 0); 
//         const ubicacion = columnas[3]?.innerText.trim() || '';

//         if (articulo && descripcion && barcodeqr) {
//             dataArray.push({ ARTICULO: articulo, DESCRIPCION: descripcion, BARCODEQR: barcodeqr, CONTEO: conteo, UBICACION: ubicacion });
//         }
//     });

//     if (dataArray.length === 0) {
//         console.error("No hay datos en la tabla para enviar.");
//         return;
//     }

//     const pUsuario = localStorage.getItem('username');
//     const pBodega = document.getElementById('bodega')?.value || '';
//     const pEstado = 'P';
//     const pFecha = document.getElementById('fecha_ini')?.value || '';
//     const pUbicacion = document.getElementById('ubicacion')?.value || '';
//     const chunkSize = 20; // Reduce el tamaño de cada bloque para evitar exceder los límites de URL
//     const totalChunks = Math.ceil(dataArray.length / chunkSize);

//     if (!pUsuario || !pBodega || !pFecha || !pUbicacion) {
//         console.error("Faltan parámetros necesarios para enviar la solicitud.");
//         return;
//     }

//     const sendChunk = (chunk, index) => {
//         const jsonChunk = encodeURIComponent(JSON.stringify(chunk));
//         const params = `?pUsuario=${pUsuario}&pBodega=${pBodega}&pEstado=${pEstado}&pFecha=${pFecha}&jsonDetalles=${jsonChunk}&pUbicacion=${pUbicacion}`;

//         fetch(env.API_URL + "wmsguardaconteoinv/I" + params, { method: 'GET' })
//             .then(response => response.json())
//             .then(result => {
//                 if (result.msg === "SUCCESS") {
//                     console.log(`Bloque ${index + 1}/${totalChunks} guardado con éxito.`);
//                     if (index === totalChunks - 1) {
//                         const tabsInstance = M.Tabs.getInstance(document.querySelector('.tabs'));
//                         tabsInstance.select('tabla-lectura');
//                     }
//                 } else {
//                     console.error(`Error en el bloque ${index + 1}: ${result.message}`);
//                 }
//             })
//             .catch(error => {
//                 console.error(`Error en el envío del bloque ${index + 1}:`, error);
//             });
//     };

//     for (let i = 0; i < totalChunks; i++) {
//         const chunk = dataArray.slice(i * chunkSize, (i + 1) * chunkSize);
//         sendChunk(chunk, i);
//     }
// }


function limpiarResultadoGeneral() {
    const tabla = document.getElementById("myTableLectura");

    if (tabla) {
        const tbody = document.getElementById("tblbodyLectura");

        if (tbody) {
            // Removemos todas las filas del tbody directamente
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
        }
    }

    // Limpieza del campo de ubicación (opcional)
    const ubicacion = document.getElementById("ubicacion");
    if (ubicacion) {
        ubicacion.value = ""; // Limpia el input
    }

    console.log("Tabla de lectura y campos relacionados limpiados correctamente.");
    crearNuevaFila();
}

function activabtnguardar()
{
    let btnFinalizar = document.getElementById('btnFinalizar');
    let btnGuardaConteo = document.getElementById('btnGuardaConteo');
    let btnResumenGeneral =document.getElementById('btnResumenGeneral');
    
    if (btnFinalizar) btnFinalizar.hidden = true;
    if (btnResumenGeneral) btnResumenGeneral.hidden= true;
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
                    text: "En este momento no cuenta con una fecha de inventario programada, Comuniquese con su supervisor.",
                    confirmButtonText: "Cerrar",
                    confirmButtonColor: "#28a745",
                    icon: "warning"
                });
            }      
        })
        .catch(error => console.error("Error en la solicitud:", error));
}


function eliminarFilaResumen(icon) {
    let usuario = localStorage.getItem('username');
    let bodega = document.getElementById('bodega').value;
    let fechaSelect = document.getElementById('fecha_ini').value;
    let row = icon.closest('tr'); // Obtiene la fila más cercana
    let celsConten = row.getElementsByTagName('td'); // Obtiene las celdas de la fila

    // Extrae los valores de las celdas  
    let celdaArticulo = row.getElementsByTagName('td')[0];  
    let articulo = celdaArticulo.querySelector('h5').innerText;
    let cantidad = parseFloat(celsConten[2].innerText.trim()); // Tercera columna (como número)
    let ubicacion = celsConten[3].innerText.trim(); // Cuarta columna


// console.log(articulo);
// console.log(cantidad);
// console.log(ubicacion);
    // Agrupa los datos en un objeto JSON
    let filaDatos = {
       //indice: indice,
        articulo: articulo,       
        cantidad: cantidad,
        ubicacion: ubicacion
    };

    let jsonCadena = JSON.stringify(filaDatos);
    // Mostrar alerta de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'A continuación se va a eliminar una fila del resumen del conteo del inventario',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Elimina la fila de la tabla
            row.remove();
            
            // Envía los datos JSON como parámetro (por ejemplo, en un POST)
          
            console.log('Enviar los Parametros')
            const params = `?pUsuario=${usuario}&pBodega=${bodega}&pFecha=${fechaSelect}&jsonDetalles=${jsonCadena}`;
            console.log('Datos al API:', params);
            fetch(env.API_URL + "wmseliminadatosinventario" + params, myInit)
            .then((response) => response.json())    
            .then((result) => {
            console.log(result.msg);      
            console.log(result.message);
            console.log(result.respuesta);
              if (result.msg === "SUCCESS") {
                if (result.respuesta.length != 0) {
                  // Resto del código de éxito
                  Swal.fire({
                    icon: "success",
                    title: "Datos eliminados correctamente",
                    confirmButtonText: "Cerrar",
                    confirmButtonColor: "#28a745",

                  }); 
                  resumen();                 
                }
              }            
            });           
        }
    });
}



