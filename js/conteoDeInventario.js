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


function ordenarTabla(index) {
    const tabla = document.getElementById('myTableresumen');
    const filas = Array.from(tabla.rows).slice(1); // Excluye el encabezado

    // Recupera los datos originales desde localStorage
    const originalData = JSON.parse(localStorage.getItem('originalData'));
    
    // Ordena los datos según el índice de la columna
    originalData.sort((a, b) => {
        const aText = a[index];
        const bText = b[index];

        if (isNaN(aText) && isNaN(bText)) {
            return aText.localeCompare(bText);
        } else {
            return parseFloat(aText) - parseFloat(bText);
        }
    });

    // Limpia la tabla
    tabla.querySelector('tbody').innerHTML = '';

    // Vuelve a insertar las filas ordenadas
    originalData.forEach(item => {
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
        tabla.querySelector('tbody').insertAdjacentHTML("beforeend", nuevaFilaHTML);
    });

    // Llamada para actualizar la paginación
    updatePagination(1); // Resetear a la primera página tras ordenar
}

// Declaración de registrosPorPagina fuera de la función resumenGeneral
const registrosPorPagina = 10; // Número de registros por página
let paginaActual = 1; // Página actual
let totalPaginas = 1; // Total de páginas
let datosResumen = [];  // Definir la variable global para almacenar los datos del resumen

async function resumen() {

    let btnFinalizar = document.getElementById('btnFinalizar');
    let btnResumenGeneral = document.getElementById('btnResumenGeneral');
    let btnGuardaConteo = document.getElementById('btnGuardaConteo');
    if (btnFinalizar) btnFinalizar.hidden = false;
    if (btnResumenGeneral) btnResumenGeneral.hidden = false;
    if (btnGuardaConteo) btnGuardaConteo.hidden = true;
const tablaResumen = document.getElementById('myTableresumen');
    const tblBodyResumen = document.getElementById('tblbodyRersumen');
    const labelCantidadRegistros = document.getElementById('cantidadDeRegistros');
    tblBodyResumen.innerHTML = '';

    const encabezado = ['ARTICULO', 'COD', 'CANT', 'UBI', 'CL'];
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
        const pOpcion = 'D';
        const pBodega = document.getElementById('bodega').value;
        const pFecha = document.getElementById('fecha_ini').value;
        const pSoloContados = 'S';
        const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pOpcion=${pOpcion}&pBodega=${pBodega}&pFecha=${pFecha}&pSoloContados=${pSoloContados}`;

        const response = await fetch(env.API_URL + "wmsresumeninventario" + params, myInit);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

        const result = await response.json();
        if (result.msg === "SUCCESS") {
            datosResumen = result.resumen || [];  // Asignar los datos a la variable global
            labelCantidadRegistros.textContent = `Cantidad de registros: ${datosResumen.length}`;
            renderizarDatos(datosResumen);  // Aquí pasamos los datos a la función de renderizado
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

        console.log(datos);
        tblBodyResumen.innerHTML = ''; // Limpiar el contenido actual
        totalPaginas = Math.ceil(datos.length / registrosPorPagina); // Calcular el total de páginas
    
        // Mostrar los datos de la página actual
        const start = (paginaActual - 1) * registrosPorPagina;
        const end = start + registrosPorPagina;
        const paginaDatos = datos.slice(start, end);
    
        // Iterar sobre los datos de la página actual y crear las filas HTML
        paginaDatos.forEach(dato => {
            // Definir el estilo de la fila
            let filaHTML = `
                <tr>
                    <td style="text-align: center;">
                        <h5 style="color: #f56108">${dato.ARTICULO}</h5>
                        <h6>${dato.DESCRIPCION || 'N/A'}</h6>
                    </td>
                    <td style="text-align: center;">${dato.BARCODEQR || 'N/A'}</td>
                    <td style="text-align: center;">${dato.CONTEO || 'N/A'}</td>
                    <td style="text-align: center; text-transform: uppercase;">${dato.UBICACION || 'N/A'}</td>
                    <td>
                        <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFilaResumen(this)">clear</i>
                    </td>
                </tr>
            `;
            
            // Verificar si el artículo no está conciliado, para aplicar el estilo correspondiente
            if (dato.CONCILIADO === 'N') {
                filaHTML = filaHTML.replace('<tr>', '<tr style="color: #f56108; font-weight: bold;">');
            }
    
            // Insertar la fila HTML generada en el cuerpo de la tabla
            tblBodyResumen.insertAdjacentHTML("beforeend", filaHTML);
        });
    
        // Actualizar los controles de paginación
        actualizarPaginacion();
    }

    function actualizarPaginacion() {
        const paginacion = document.getElementById('pagination');
        if (!paginacion) {
            console.error("No se encontró el contenedor de paginación.");
            return;
        }

        paginacion.innerHTML = '';  // Limpiar la paginación antes de renderizar

        // Crear botones de paginación
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = 'Anterior';
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.addEventListener('click', () => cambiarPagina(paginaActual - 1));
        paginacion.appendChild(btnAnterior);

        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement('button');
            btnPagina.textContent = i;
            btnPagina.disabled = i === paginaActual;
            btnPagina.addEventListener('click', () => cambiarPagina(i));
            paginacion.appendChild(btnPagina);
        }

        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = 'Siguiente';
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.addEventListener('click', () => cambiarPagina(paginaActual + 1));
        paginacion.appendChild(btnSiguiente);
    }

    function cambiarPagina(pagina) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            paginaActual = pagina;
            renderizarDatos(datosResumen);  // Vuelve a renderizar los datos al cambiar de página
        }
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

async function resumenGeneral() {
    let btnFinalizar = document.getElementById('btnFinalizar');
    let btnResumenGeneral = document.getElementById('btnResumenGeneral');
    let btnGuardaConteo = document.getElementById('btnGuardaConteo');
    if (btnFinalizar) btnFinalizar.hidden = true;
    if (btnResumenGeneral) btnResumenGeneral.hidden = false;
    if (btnGuardaConteo) btnGuardaConteo.hidden = true;

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
            datosResumen = result.resumen || [];  // Asignar los datos a la variable global
            labelCantidadRegistros.textContent = `Cantidad de registros: ${datosResumen.length}`;
            renderizarDatos(datosResumen);  // Aquí pasamos los datos a la función de renderizado
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
        totalPaginas = Math.ceil(datos.length / registrosPorPagina); // Calcular el total de páginas

        // Mostrar los datos de la página actual
        const start = (paginaActual - 1) * registrosPorPagina;
        const end = start + registrosPorPagina;
        const paginaDatos = datos.slice(start, end);

        paginaDatos.forEach(dato => {
            const fila = document.createElement('tr');
            if (dato.CONCILIADO === 'N') {
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

        // Actualizar los controles de paginación
        actualizarPaginacion();
    }

    function actualizarPaginacion() {
        const paginacion = document.getElementById('pagination');
        if (!paginacion) {
            console.error("No se encontró el contenedor de paginación.");
            return;
        }

        paginacion.innerHTML = '';  // Limpiar la paginación antes de renderizar

        // Crear botones de paginación
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = 'Anterior';
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.addEventListener('click', () => cambiarPagina(paginaActual - 1));
        paginacion.appendChild(btnAnterior);

        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement('button');
            btnPagina.textContent = i;
            btnPagina.disabled = i === paginaActual;
            btnPagina.addEventListener('click', () => cambiarPagina(i));
            paginacion.appendChild(btnPagina);
        }

        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = 'Siguiente';
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.addEventListener('click', () => cambiarPagina(paginaActual + 1));
        paginacion.appendChild(btnSiguiente);
    }

    function cambiarPagina(pagina) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            paginaActual = pagina;
            renderizarDatos(datosResumen);  // Vuelve a renderizar los datos al cambiar de página
        }
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

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////





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



