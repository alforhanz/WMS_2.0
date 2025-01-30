document.addEventListener("DOMContentLoaded", function () {   
    const checkClase = document.getElementById("clase-todas");    
    localStorage.setItem("check_Clase", checkClase.checked);
    const checkMarca = document.getElementById("marca-todas");
    localStorage.setItem('ckeck_Marca', checkMarca.checked);
    const checkTipo = document.getElementById("tipo-todas");
    localStorage.setItem('ckeck_Tipo', checkTipo.checked);
    const checkVentas = document.getElementById("ventas-todas");
    localStorage.setItem('ckeck_Ventas', checkVentas.checked);
    const checkEnvase = document.getElementById("envase-todas");
    localStorage.setItem('ckeck_Envase', checkEnvase.checked);
    const checkSeis = document.getElementById("seis-todas");
    localStorage.setItem('ckeck_Seis', checkSeis.checked);
    
    fechasDeInventario();   

    cargarClasificacionesCLase();
    cargarClasificacionesMarca();
    cargarClasificacionesTipo();
    cargarClasificacionesVenta();
    cargarClasificacionesEnvase();
    cargarClasificacionesSeis();      

     // Inicializar los selects de Materialize
     var elems = document.querySelectorAll('select');
     M.FormSelect.init(elems);
 
     // Agregar un evento para detectar cambios en el checkbox
     checkClase.addEventListener("change", habilitaclase);
     checkMarca.addEventListener("change", habilitamarca);
     checkTipo.addEventListener("change", habilitatipo);
     checkVentas.addEventListener("change", habilitaVenta);
     checkEnvase.addEventListener("change", habilitaEnvase);
     checkSeis.addEventListener("change", habilitaSeis);

     console.log('DOM del reporte caRGADO...');

     const tipoDetallado = document.getElementById("tipoDetallado");
     const tipoResumido = document.getElementById("tipoResumido");
     const agrupadoClase = document.getElementById("agrupadoClase");
     const agrupadoMarca = document.getElementById("agrupadoMarca");
 
     function actualizarEstadoAgrupado() {
         const deshabilitar = tipoDetallado.checked;
         agrupadoClase.disabled = deshabilitar;
         agrupadoMarca.disabled = deshabilitar;
         agrupadoClase.checked = false;
         agrupadoMarca.checked = false;
     }
 
     // Agregar eventos de cambio
     tipoDetallado.addEventListener("change", actualizarEstadoAgrupado);
     tipoResumido.addEventListener("change", actualizarEstadoAgrupado);
 
     // Llamar a la función una vez al inicio para asegurarse de que el estado sea correcto
     actualizarEstadoAgrupado();

        habilitaclase();
        habilitamarca();
        habilitatipo();
        habilitaVenta();
        habilitaEnvase();
        habilitaSeis();
        limpiarTabla();    
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
    
     ///////// CREAR NUEVA FILA /////////
    
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
                        class="codigo-barras-input" value="" oninput="validarCodigoBarras(this)" autofocus>
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
    
    /////////vALIDA LO QUE SE LEE CONTRA EL PEDIDO de la orden de comra./////////
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
       // const filas = Array.from(tabla.rows).slice(1); // Excluye el encabezado
    
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
     /////////////////////////////////////////////////////////////////////////////////////// 
    ///////////////////////////RESUMEN DEL INVENTARIO /////////////////////////////////////
   ///////////////////////////////////////////////////////////////////////////////////////
  ///// Declaración de registrosPorPagina fuera de la función resumenGeneral/////////////
 ///////////////////////////////////////////////////////////////////////////////////////

    const registrosPorPagina = 10; // Número de registros por página
    let paginaActual = 1; // Página actual
    let totalPaginas = 1; // Total de páginas
    let datosResumen = [];  // Definir la variable global para almacenar los datos del resumen
    
    // async function resumen() {
    //     let btnFinalizar = document.getElementById('btnFinalizar');
    //     let btnResumenGeneral = document.getElementById('btnResumenGeneral');
    //     let btnGuardaConteo = document.getElementById('btnGuardaConteo');
    //     if (btnFinalizar) btnFinalizar.hidden = false;
    //     if (btnResumenGeneral) btnResumenGeneral.hidden = false;
    //     if (btnGuardaConteo) btnGuardaConteo.hidden = true;
    
    //     const tablaResumen = document.getElementById('myTableresumen');
    //     const tblBodyResumen = document.getElementById('tblbodyRersumen');
    //     const labelCantidadRegistros = document.getElementById('cantidadDeRegistros');
    //     tblBodyResumen.innerHTML = '';
    
    //     const encabezado = ['ARTICULO', 'COD', 'CANT', 'UBI', 'CL'];
    //     const thead = tablaResumen.querySelector('thead');
    //     thead.innerHTML = '';
    
    //     const filaEncabezado = document.createElement('tr');
    //     filaEncabezado.className = 'themeColor';
    //     encabezado.forEach((columna, index) => {
    //         const th = document.createElement('th');
    //         th.textContent = columna;
    //         th.setAttribute('data-column', index);
    //         th.style.cursor = 'pointer';
    //         th.addEventListener('click', () => ordenarTabla(index));
    //         filaEncabezado.appendChild(th);
    //     });
    //     thead.appendChild(filaEncabezado);
    
    //     try {
    //         const pSistema = 'WMS';
    //         const pUsuario = localStorage.getItem('username');
    //         const pOpcion = 'D';
    //         const pBodega = document.getElementById('bodega').value;
    //         const pFecha = document.getElementById('fecha_ini').value;
    //         const pSoloContados = 'S';
    //         const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pOpcion=${pOpcion}&pBodega=${pBodega}&pFecha=${pFecha}&pSoloContados=${pSoloContados}`;
    
    //         const response = await fetch(env.API_URL + "wmsresumeninventario" + params, myInit);
    //         if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
    
    //         const result = await response.json();
    //         if (result.msg === "SUCCESS") {
    //             datosResumen = result.resumen || [];
    //             labelCantidadRegistros.textContent = `Cantidad de registros: ${datosResumen.length}`;
    //             renderizarDatos(datosResumen);
    //         } else {
    //             mostrarMensajeError('No se encontraron datos para mostrar.', encabezado.length);
    //             labelCantidadRegistros.textContent = 'Cantidad de registros: 0';
    //         }
    //     } catch (error) {
    //         console.error('Error al generar la tabla:', error);
    //         mostrarMensajeError('Hubo un error al cargar los datos. Inténtalo de nuevo más tarde.', encabezado.length);
    //         labelCantidadRegistros.textContent = 'Cantidad de registros: 0';
    //     }
    
    //     function renderizarDatos(datos) {
    //         tblBodyResumen.innerHTML = '';
    //         totalPaginas = Math.ceil(datos.length / registrosPorPagina);
    
    //         const start = (paginaActual - 1) * registrosPorPagina;
    //         const end = start + registrosPorPagina;
    //         const paginaDatos = datos.slice(start, end);
    
    //         paginaDatos.forEach(dato => {
    //             let filaHTML = `
    //                 <tr>
    //                     <td style="text-align: center;">
    //                         <h5 style="text-align: center;color: #f56108;">${dato.ARTICULO}</h5>
    //                         <h6>${dato.DESCRIPCION || 'N/A'}</h6>
    //                     </td>
    //                     <td style="text-align: center;">${dato.BARCODEQR || 'N/A'}</td>
    //                     <td style="text-align: center;">${dato.CONTEO || 'N/A'}</td>
    //                     <td style="text-align: center; text-transform: uppercase;">${dato.UBICACION || 'N/A'}</td>
    //                     <td>
    //                         <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFilaResumen(this)">clear</i>
    //                     </td>
    //                 </tr>
    //             `;
    //             if (dato.CONCILIADO === 'N') {
    //                 filaHTML = filaHTML.replace('<tr>', '<tr style="color: #f56108; font-weight: bold;">');
    //             }
    //             tblBodyResumen.insertAdjacentHTML("beforeend", filaHTML);
    //         });
    
    //         actualizarPaginacion();
    //     }
    //     function actualizarPaginacion() {
    //         const paginacion = document.getElementById('pagination');
    //         if (!paginacion) {
    //             console.error("No se encontró el contenedor de paginación.");
    //             return;
    //         }
    
    //         paginacion.innerHTML = '';
    
    //                 // Botón Anterior
    //         const btnAnterior = document.createElement('button');     
    //         btnAnterior.textContent = 'Anterior';
    //         btnAnterior.disabled = paginaActual === 1;
    //         btnAnterior.addEventListener('click', () => cambiarPagina(paginaActual - 1));
    //         btnAnterior.style.backgroundColor = '#28a745'; // Color de fondo
    //         btnAnterior.style.color = 'white';            // Color del texto
    //         btnAnterior.style.border = 'none';            // Sin bordes
    //         btnAnterior.style.borderRadius = '5px';       // Bordes redondeados
    //         btnAnterior.style.padding = '10px 15px';      // Espaciado interno
    //         btnAnterior.style.cursor = 'pointer';         // Cambiar cursor
    //         btnAnterior.style.margin = '0 5px';           // Margen entre botones
    //         btnAnterior.style.fontSize = '14px';          // Tamaño de fuente
    //         btnAnterior.style.fontWeight = 'bold';        // Negrita
    //         btnAnterior.style.transition = '0.3s';        // Animación suave
    //         btnAnterior.onmouseover = () => btnAnterior.style.backgroundColor = '#218838'; // Hover
    //         btnAnterior.onmouseleave = () => btnAnterior.style.backgroundColor = '#28a745'; // Volver al original
    //         paginacion.appendChild(btnAnterior);
    
    //         // Botón para abrir el modal de números de página
    //         const btnVerPaginas = document.createElement('button');
    //         btnVerPaginas.textContent = `Página ${paginaActual}`;
    //         btnVerPaginas.addEventListener('click', () => {
    //             mostrarModalPaginas();
    //         });
    //         btnVerPaginas.style.backgroundColor = '#28a745';
    //         btnVerPaginas.style.color = 'white';
    //         btnVerPaginas.style.border = 'none';
    //         btnVerPaginas.style.borderRadius = '5px';
    //         btnVerPaginas.style.padding = '10px 15px';
    //         btnVerPaginas.style.cursor = 'pointer';
    //         btnVerPaginas.style.margin = '0 5px';
    //         btnVerPaginas.style.fontSize = '14px';
    //         btnVerPaginas.style.fontWeight = 'bold';
    //         btnVerPaginas.style.transition = '0.3s';
    //         btnVerPaginas.onmouseover = () => btnVerPaginas.style.backgroundColor = '#218838';
    //         btnVerPaginas.onmouseleave = () => btnVerPaginas.style.backgroundColor = '#28a745';
    //         paginacion.appendChild(btnVerPaginas);
    
    //         // Botón Siguiente
    //         const btnSiguiente = document.createElement('button');
    //         btnSiguiente.textContent = 'Siguiente';
    //         btnSiguiente.disabled = paginaActual === totalPaginas;
    //         btnSiguiente.addEventListener('click', () => cambiarPagina(paginaActual + 1));
    //         btnSiguiente.style.backgroundColor = '#28a745';
    //         btnSiguiente.style.color = 'white';
    //         btnSiguiente.style.border = 'none';
    //         btnSiguiente.style.borderRadius = '5px';
    //         btnSiguiente.style.padding = '10px 15px';
    //         btnSiguiente.style.cursor = 'pointer';
    //         btnSiguiente.style.margin = '0 5px';
    //         btnSiguiente.style.fontSize = '14px';
    //         btnSiguiente.style.fontWeight = 'bold';
    //         btnSiguiente.style.transition = '0.3s';
    //         btnSiguiente.onmouseover = () => btnSiguiente.style.backgroundColor = '#218838';
    //         btnSiguiente.onmouseleave = () => btnSiguiente.style.backgroundColor = '#28a745';
    //         paginacion.appendChild(btnSiguiente);
    //     }
    //     function mostrarModalPaginas() {
    //         let modal = document.getElementById('modalPaginas');
    //         if (!modal) {
    //             crearModalPaginas();
    //             modal = document.getElementById('modalPaginas');
    //         }
    
    //         const modalBody = modal.querySelector('.modal-body');
    //         if (!modalBody) {
    //             console.error("El cuerpo del modal no existe en el DOM.");
    //             return;
    //         }
    
    //         modalBody.innerHTML = '';
    
    //         for (let i = 1; i <= totalPaginas; i++) {
    //             const btnPagina = document.createElement('button');
    //             btnPagina.textContent = i;
    //             btnPagina.style.margin = '5px';
    //             btnPagina.disabled = i === paginaActual;
    //             btnPagina.addEventListener('click', () => {
    //                 cambiarPagina(i);
    //                 modal.style.display = 'none';
    //             });
    //             modalBody.appendChild(btnPagina);
    //         }
    
    //         modal.style.display = 'block';
    //     }
    //     function crearModalPaginas() {
    //         const modal = document.createElement('div');
    //         modal.id = 'modalPaginas';
    //         modal.className = 'modal-conteo';
    //         modal.style.display = 'none';
    //         modal.innerHTML = `
    //             <div class="modal-content">
    //                 <div class="modal-header">
    //                     <button class="close-button" style="background: none; border: none; cursor: pointer; color: red; font-size: 24px;">
    //                         <span class="material-icons">close</span>
    //                     </button>
    //                 </div>
    //                 <div class="modal-body"></div>
    //             </div>
    //         `;
        
    //         // Añadir evento al botón de cerrar
    //         const closeButton = modal.querySelector('.close-button');
    //         closeButton.style.marginLeft = '14em';
    //         closeButton.addEventListener('click', () => {
    //             modal.style.display = 'none';
                
    //         });
        
    //         document.body.appendChild(modal);
    //     }
    //     function cambiarPagina(pagina) {
    //         if (pagina >= 1 && pagina <= totalPaginas) {
    //             paginaActual = pagina;
    //             renderizarDatos(datosResumen);
    //         }
    //     }
    //     function ordenarTabla(indiceColumna) {
    //         const filas = Array.from(tblBodyResumen.querySelectorAll('tr'));
    //         const ordenAscendente = !thead.getAttribute('data-order') || thead.getAttribute('data-order') === 'desc';
    //         filas.sort((a, b) => {
    //             const valorA = a.children[indiceColumna].textContent.trim();
    //             const valorB = b.children[indiceColumna].textContent.trim();
    //             if (!isNaN(valorA) && !isNaN(valorB)) {
    //                 return ordenAscendente ? valorA - valorB : valorB - valorA;
    //             }
    //             return ordenAscendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    //         });
    //         filas.forEach(fila => tblBodyResumen.appendChild(fila));
    //         thead.setAttribute('data-order', ordenAscendente ? 'asc' : 'desc');
    //     }
    //     function mostrarMensajeError(mensaje, columnas) {
    //         const mensajeError = document.createElement('tr');
    //         const celdaError = document.createElement('td');
    //         celdaError.colSpan = columnas;
    //         celdaError.textContent = mensaje;
    //         mensajeError.appendChild(celdaError);
    //         tblBodyResumen.appendChild(mensajeError);
    //     }
    // }
    

    
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
        //console.log("Data a enviar:", dataArray);
    
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
            
            //console.log(`Enviando bloque ${index + 1}/${totalChunks}:`, chunk);
    
            fetch(env.API_URL + "wmsguardaconteoinv/I" + params, myInit)
                .then(response => response.json())
                .then(result => {
                    if (result.msg === "SUCCESS") {
                        //console.log(`Bloque ${index + 1} guardado con éxito.`);
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
               //console.log('LLama a finalizar conteo');
               finalizaConteoInventario()
            }
          });    
      }
    
    function finalizaConteoInventario() {   
        //console.log('datosResumen:');
        //console.log(datosResumen);
      
        // // Crear el arreglo para almacenar los datos
        const dataArray = [];
    
        const filas = datosResumen.length;
    
        for(let i=0 ; i< filas ; i++){
                 // Extraer los datos de cada columna
            const articulo = datosResumen[i].ARTICULO; // Artículo está en el <h5>
            const descripcion = datosResumen[i].DESCRIPCION; // Descripción está en el <h6>
            const barcodeqr = datosResumen[i].BARCODEQR; // Código de barras
            const conteo = datosResumen[i].CONTEO; // Cantidad
            const ubicacion = datosResumen[i].UBICACION; // Ubicación
    
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
    
        } 
        // Verificar si hay datos en el arreglo
        if (dataArray.length === 0) {
            console.error("No hay datos en la tabla para enviar.");
            return;
        }
        console.log('Total de registros: ');
        console.log(dataArray.length);
    
        const pUsuario = localStorage.getItem('username');
        const pBodega = document.getElementById('bodega').value;
        const pEstado = 'P';
        const pFecha = document.getElementById('fecha_ini').value;
        const pUbicacion = document.getElementById('ubicacion').value;      
        const chunkSize = 20; // Tamaño del bloque
        const totalChunks = Math.ceil(dataArray.length / chunkSize);
    
          // Transformar el arreglo en JSON
       // const jsonDetalles = JSON.stringify(dataArray);
    
        // Función para enviar cada bloque
        const sendChunk = (chunk, index) => {
            const params = `?pUsuario=${pUsuario}&pBodega=${pBodega}&pEstado=${pEstado}&pFecha=${pFecha}&jsonDetalles=${encodeURIComponent(JSON.stringify(chunk))}&pUbicacion=${pUbicacion}`;
       
            console.log(`Enviando bloque ${index + 1}/${totalChunks}:`, chunk);
    
            fetch(env.API_URL + "wmsguardaconteoinv/I" + params, myInit)
                .then(response => response.json())
                .then(result => {
                   
                    if (result.msg === "SUCCESS") {
    
                        console.log('Resultado del API: ');
                        console.log(result.conteoguardado[0].Mensaje);
                        console.log(`Bloque ${index + 1} finalizado con éxito.`);
                       
                        // Cambiar automáticamente a la pestaña "Lectura"
                        // const tabsInstance = M.Tabs.getInstance(document.querySelector('.tabs'));
                        // tabsInstance.select('tabla-lectura');
                    } else {
                        console.error(`Error al guardar bloque ${index + 1}:`, result.message);
                    }
                })
                .catch(error => {
                    console.error(`Error en el envío del bloque ${index + 1}:`, error);
                });        
        };
    
        // Dividir y enviar en bloques a json detalles
        for (let i = 0; i < totalChunks; i++) {
             const chunk = dataArray.slice(i * chunkSize, (i + 1) * chunkSize);
            //const chunk = jsonDetalles.slice(i * chunkSize, (i + 1) * chunkSize);
            sendChunk(chunk, i);
        }
     
        limpiarResultadoGeneral();
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
    
        //console.log("Tabla de lectura y campos relacionados limpiados correctamente.");
        crearNuevaFila();
    }
    
    function activabtnguardar()
    {
        let btnFinalizar = document.getElementById('btnFinalizar');
        let btnGuardaConteo = document.getElementById('btnGuardaConteo');
        let btnResumenGeneral =document.getElementById('btnResumenGeneral');
        const paginacion = document.getElementById('pagination');
        if (!paginacion) {
            console.error("No se encontró el contenedor de paginación.");
            return;
        }
    
        paginacion.innerHTML = '';  // Limpiar la paginación antes de renderizar
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
                //console.log("Fechas programadas: ");
                //console.log(resultado);
    
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
       
                const params = `?pUsuario=${usuario}&pBodega=${bodega}&pFecha=${fechaSelect}&jsonDetalles=${jsonCadena}`;
    
                fetch(env.API_URL + "wmseliminadatosinventario" + params, myInit)
                .then((response) => response.json())    
                .then((result) => {       
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
    
//////////////////////////////////////DESGARGAR DATOS/////////////////////



    //FUNCIONES QUE CARGAN LAS CLASIFICACIONES A LOS SELECT 

async function cargarClasificacionesCLase() {
    const checkClase = document.getElementById("clase-todas");
    const selectClase = document.getElementById("claseReporte"); 
    const isChecked = localStorage.getItem('check_Clase') === 'true';
    const isDisabled = localStorage.getItem('Selector_de_Clase') === 'true';
    checkClase.checked = isChecked;
    selectClase.disabled = isDisabled;

fetch(env.API_URL + "filtroswms", myInit)
.then((response) => response.json())
.then((result) => {
  if (result.msg === "SUCCESS") {
    if (result.filtros.length != 0) {
         // Limpiar el select antes de agregar opciones
         selectClase.innerHTML = '<option value="" disabled selected>Seleccionar Clase</option>';

         // Agregar opciones al select
         result.filtros.forEach((item) => {
           const option = document.createElement("option");
           option.value = item.CLASIFICACION_1;
           option.textContent = item.DESCRIPCION;
           selectClase.appendChild(option);
         });
   
         // Inicializar el select (si usas Materialize)
         M.FormSelect.init(selectClase);
         habilitaclase();
         limpiarTabla();
    } 
  } else {
    console.log("Error en el SP");
  }
});
} 
async function cargarClasificacionesMarca() {    
    const clase= document.getElementById('claseReporte').value;
    const checkMarca = document.getElementById("marca-todas"); 
    const selectMArca = document.getElementById("marcaReporte");
    
    const isChecked = localStorage.getItem('ckeck_Marca') === 'true';
    const isDisabled = localStorage.getItem('Selector_de_Marca') === 'true';
    checkMarca.checked = isChecked;
    selectMArca.disabled = isDisabled;   
  
   const params ="?clase="+clase;

try{

}catch(error){
    console.error("Error al cargar clasificaciones:", error.message);
}

return fetch(env.API_URL + "filtroswms" + params, myInit)
.then((response) => response.json())
.then((result) => {
  if (result.msg === "SUCCESS") {
    if (result.filtros.length != 0) {
         // Limpiar el select antes de agregar opciones
         selectMArca.innerHTML = '<option value="" disabled selected>Seleccionar Clase</option>';

         // Agregar opciones al select
         result.filtros.forEach((item) => {
           const option = document.createElement("option");
           option.value = item.CLASIFICACION_2;
           option.textContent = item.DESCRIPCION;
           selectMArca.appendChild(option);
         });
   
         // Inicializar el select (si usas Materialize)
         M.FormSelect.init(selectMArca);
         habilitamarca();
         limpiarTabla();
    } 
  } else {
    console.log("Error en el SP");
  }
});
}  
async function cargarClasificacionesTipo() {
    const clase= document.getElementById('claseReporte').value;
    const marca= document.getElementById('marcaReporte').value;
    const checkTipo = document.getElementById("tipo-todas");
    const selectTipo = document.getElementById("tipoReporte");
    const isChecked = localStorage.getItem('ckeck_Tipo') === 'true';
    const isDisabled = localStorage.getItem('Selector_de_Tipo') === 'true';
    checkTipo.checked = isChecked;
    selectTipo.disabled = isDisabled;
    const params = "?clase="+clase+"&marca="+marca ;

try{

}catch(error){
    console.error("Error al cargar clasificaciones:", error.message);
}

fetch(env.API_URL + "filtroswms" + params, myInit)
.then((response) => response.json())
.then((result) => {
  if (result.msg === "SUCCESS") {
    if (result.filtros.length != 0) {
         // Limpiar el select antes de agregar opciones
         selectTipo.innerHTML = '<option value="" disabled selected>Seleccionar Clase</option>';

         // Agregar opciones al select
         result.filtros.forEach((item) => {
           const option = document.createElement("option");
           option.value = item.CLASIFICACION_3;
           option.textContent = item.DESCRIPCION;
           selectTipo.appendChild(option);
         });
   
         // Inicializar el select (si usas Materialize)
         M.FormSelect.init(selectTipo);
         habilitatipo();
         limpiarTabla();
    } 
  } else {
    console.log("Error en el SP");
  }
});
}
async function cargarClasificacionesVenta() {
    const clase= document.getElementById('claseReporte').value;
    const marca= document.getElementById('marcaReporte').value;
    const tipo= document.getElementById('tipoReporte').value;
  const selectVenta = document.getElementById("ventasReporte");
  const checkVentas = document.getElementById("ventas-todas");
  const isChecked = localStorage.getItem("ckeck_Ventas") === "true";
  const isDisabled = localStorage.getItem("Selector_de_Ventas") === "true";
  checkVentas.checked = isChecked;
  selectVenta.disabled = isDisabled;

  const params = "?clase=" + clase + "&marca=" + marca + "&tipo=" + tipo;

  try {
  } catch (error) {
    console.error("Error al cargar clasificaciones:", error.message);
  }

  fetch(env.API_URL + "filtroswms" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.filtros.length != 0) {
          // Limpiar el select antes de agregar opciones
          selectVenta.innerHTML =
            '<option value="" disabled selected>Seleccionar Clase</option>';

          // Agregar opciones al select
          result.filtros.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.CLASIFICACION_4;
            option.textContent = item.DESCRIPCION;
            selectVenta.appendChild(option);
          });

          // Inicializar el select (si usas Materialize)
          M.FormSelect.init(selectVenta);
          habilitaVenta();
          limpiarTabla();
        }
      } else {
        console.log("Error en el SP");
      }
    });
}
async function cargarClasificacionesEnvase() {
    const clase= document.getElementById('claseReporte').value;
    const marca= document.getElementById('marcaReporte').value;
    const tipo= document.getElementById('tipoReporte').value;
    const subtipo= document.getElementById('ventasReporte').value;
  const selectEnvase = document.getElementById("envaseReporte");
  const checkEnvase = document.getElementById("envase-todas");
  const isChecked = localStorage.getItem("ckeck_Envase") === "true";
  const isDisabled = localStorage.getItem("Selector_de_Envase") === "true";
  checkEnvase.checked = isChecked;
  selectEnvase.disabled = isDisabled;

  const params =
    "?clase=" +
    clase +
    "&marca=" +
    marca +
    "&tipo=" +
    tipo +
    "&subtipo=" +
    subtipo;

  try {
  } catch (error) {
    console.error("Error al cargar clasificaciones:", error.message);
  }

  fetch(env.API_URL + "filtroswms" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.filtros.length != 0) {
          // Limpiar el select antes de agregar opciones
          selectEnvase.innerHTML =
            '<option value="" disabled selected>Seleccionar Clase</option>';

          // Agregar opciones al select
          result.filtros.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.CLASIFICACION_5;
            option.textContent = item.DESCRIPCION;
            selectEnvase.appendChild(option);
          });

          // Inicializar el select (si usas Materialize)
          M.FormSelect.init(selectEnvase);
          habilitaEnvase();
          limpiarTabla();
        }
      } else {
        console.log("Error en el SP");
      }
    });
}
async function cargarClasificacionesSeis() {
    const clase= document.getElementById('claseReporte').value;
    const marca= document.getElementById('marcaReporte').value;
    const tipo= document.getElementById('tipoReporte').value;
    const subtipo= document.getElementById('ventasReporte').value;
    const subtipo2= document.getElementById('envaseReporte').value;

    const selectSeis = document.getElementById("seisReporte");     
    const checkSeis = document.getElementById("envase-todas"); 
    const isChecked = localStorage.getItem('ckeck_Seis') === 'true';
    const isDisabled = localStorage.getItem('Selector_de_Seis') === 'true';
    checkSeis.checked = isChecked;
    selectSeis.disabled = isDisabled;

    const params =
      "?clase=" +
      clase +
      "&marca=" +
      marca +
      "&tipo=" +
      tipo +
      "&subtipo=" +
      subtipo +
      "&subtipo2=" +
      subtipo2;

try{

}catch(error){
    console.error("Error al cargar clasificaciones:", error.message);
}

fetch(env.API_URL + "filtroswms" + params, myInit)
.then((response) => response.json())
.then((result) => {
  if (result.msg === "SUCCESS") {
    if (result.filtros.length != 0) {
         // Limpiar el select antes de agregar opciones
         selectSeis.innerHTML = '<option value="" disabled selected>Seleccionar Clase</option>';

         // Agregar opciones al select
         result.filtros.forEach((item) => {
           const option = document.createElement("option");
           option.value = item.CLASIFICACION;
           option.textContent = item.DESCRIPCION;
           selectSeis.appendChild(option);
         });
   
         // Inicializar el select (si usas Materialize)
         M.FormSelect.init(selectSeis);
         habilitaSeis();
         limpiarTabla();
    } 
  } else {
    console.log("Error en el SP");
  }
});
}

// Función para habilitar o deshabilitar el select según el estado del checkbox
function habilitaclase() {   
    const selectClase = document.getElementById("claseReporte"); // Select
    const checkClase = document.getElementById("clase-todas");  

    if (checkClase.checked) {
        // Si el checkbox está marcado, deshabilitar el select
        selectClase.disabled = true;

         // Establecer el valor del select a null
         selectClase.value = null;       

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('check_Clase', checkClase.checked);
        localStorage.setItem('Selector_de_Clase', 'true');
    } else {
        // Si el checkbox no está marcado, habilitar el select
        selectClase.disabled = false;

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('check_Clase', checkClase.checked);
        localStorage.setItem('Selector_de_Clase', 'false');
    }

    // Reiniciar el select de Materialize después de cambiar el estado
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }
function habilitamarca(){
    const checkMArca = document.getElementById("marca-todas");
    const selectMarca = document.getElementById("marcaReporte");

    if (checkMArca.checked) {
        // Si el checkbox está marcado, deshabilitar el select
        selectMarca.disabled = true;

          // Establecer el valor del select a null
          selectMarca.value = null;    

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Marca', checkMArca.checked);
        localStorage.setItem('Selector_de_Marca', 'true');
    } else {
        // Si el checkbox no está marcado, habilitar el select
        selectMarca.disabled = false;

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Marca', checkMArca.checked);
        localStorage.setItem('Selector_de_Marca', 'false');
    }

    // Reiniciar el select de Materialize después de cambiar el estado
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

}
function habilitatipo(){
    const checkTipo = document.getElementById("tipo-todas");
    const selectTipo = document.getElementById("tipoReporte");

    if (checkTipo.checked) {
        // Si el checkbox está Tipodo, deshabilitar el select
        selectTipo.disabled = true;

       // Establecer el valor del select a null
       selectTipo.value = null;   

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Tipo', checkTipo.checked);
        localStorage.setItem('Selector_de_Tipo', 'true');
    } else {
        // Si el checkbox no está Tipodo, habilitar el select
        selectTipo.disabled = false;

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Tipo', checkTipo.checked);
        localStorage.setItem('Selector_de_Tipo', 'false');
    }

    // Reiniciar el select de Materialize después de cambiar el estado
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
}
function habilitaVenta(){
        const checkVentas = document.getElementById("ventas-todas");
        const selectVentas = document.getElementById("ventasReporte");

        if (checkVentas.checked) {
            // Si el checkbox está Tipodo, deshabilitar el select
            selectVentas.disabled = true;

            // Establecer el valor del select a null
            selectVentas.value = null;   

            // Guardar el estado del checkbox y del select en localStorage
            localStorage.setItem('ckeck_Ventas', checkVentas.checked);
            localStorage.setItem('Selector_de_Ventas', 'true');
        } else {
            // Si el checkbox no está Tipodo, habilitar el select
            selectVentas.disabled = false;

            // Guardar el estado del checkbox y del select en localStorage
            localStorage.setItem('ckeck_Ventas', checkVentas.checked);
            localStorage.setItem('Selector_de_Ventas', 'false');
        }

        // Reiniciar el select de Materialize después de cambiar el estado
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
}
function habilitaEnvase(){
    const checkEnvase = document.getElementById("envase-todas");
    const selectEnvase = document.getElementById("envaseReporte");

    if (checkEnvase.checked) {
        // Si el checkbox está Tipodo, deshabilitar el select
        selectEnvase.disabled = true;

        // Establecer el valor del select a null
        selectEnvase.value = null;   

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Envase', checkEnvase.checked);
        localStorage.setItem('Selector_de_Envase', 'true');
    } else {
        // Si el checkbox no está Tipodo, habilitar el select
        selectEnvase.disabled = false;

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Envase', checkEnvase.checked);
        localStorage.setItem('Selector_de_Envase', 'false');
    }

    // Reiniciar el select de Materialize después de cambiar el estado
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
}
function habilitaSeis(){
    const checkSeis = document.getElementById("seis-todas");
    const selectSeis = document.getElementById("seisReporte");

    if (checkSeis.checked) {
        // Si el checkbox está Tipodo, deshabilitar el select
        selectSeis.disabled = true;

        // Establecer el valor del select a null
        selectSeis.value = null;   

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Seis', checkSeis.checked);
        localStorage.setItem('Selector_de_Seis', 'true');
    } else {
        // Si el checkbox no está Tipodo, habilitar el select
        selectSeis.disabled = false;

        // Guardar el estado del checkbox y del select en localStorage
        localStorage.setItem('ckeck_Seis', checkSeis.checked);
        localStorage.setItem('Selector_de_Seis', 'false');
    }

    // Reiniciar el select de Materialize después de cambiar el estado
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
}

function selectClase(){
    //const check = document.getElementById('clase-todas')
    const clase= document.getElementById('claseReporte').value;
    const marca= document.getElementById('marcaReporte').value;
    const tipo= document.getElementById('tipoReporte').value;
    const venta= document.getElementById('ventasReporte').value;
    const envase= document.getElementById('envaseReporte').value;
    const seis= document.getElementById('seisReporte').value;

    console.log(clase);
    console.log(marca);
    console.log(tipo);
    console.log(venta);
    console.log(envase);
    console.log(seis);

    
}


async function resumenGeneral(){

            const pSistema = 'WMS';
            const pUsuario = localStorage.getItem('username');
            const pTipoRpt = document.getElementById('tipoResumido').checked ? 'R' : 'D';
            const pSoloContados = document.getElementById('articulosContados').checked?'S' : 'N';
            const pFecha = document.getElementById('fecha_ini').value;
            const pBodega = document.getElementById('bodega').value;

            const pAgrupadoClase = document.getElementById('agrupadoClase').checked ? 'S' : 'N';
            const pAgrupadoMarca = document.getElementById('agrupadoMarca').checked ? 'S' : 'N';

            const pclase = document.getElementById('claseReporte').value.trim() === "" ? null : document.getElementById('claseReporte').value;
            const pmarca = document.getElementById('marcaReporte').value.trim() === "" ? null : document.getElementById('marcaReporte').value;
            const ptipo = document.getElementById('tipoReporte').value.trim() === "" ? null : document.getElementById('tipoReporte').value;
            const penvase = document.getElementById('envaseReporte').value.trim() === "" ? null : document.getElementById('envaseReporte').value;
            const pventa = document.getElementById('ventasReporte').value.trim() === "" ? null : document.getElementById('ventasReporte').value;
            const pseis = document.getElementById('seisReporte').value.trim() === "" ? null : document.getElementById('seisReporte').value;
     
           
            // const params = `?pSistema=${pSistema}&pUsuario=${pUsuario}&pTipoRpt=${pTipoRpt}&pSoloContados=${pSoloContados}&pFecha=${pFecha}&pBodega=${pBodega}&pAgrupadoClase=${pAgrupadoClase}&pAgrupadoMarca=${pAgrupadoMarca}&pclase=${pclase}&pmarca=${pmarca},&ptipo=${ptipo}&pEnvase=${penvase}&pVentas=${pventa}&pT6=${pseis}`;
            const params = new URLSearchParams({
                pSistema,
                pUsuario,
                pTipoRpt,
                pSoloContados,
                pFecha,
                pBodega,
                pAgrupadoClase,
                pAgrupadoMarca,
                pclase: pclase ?? '',
                pmarca: pmarca ?? '',
                ptipo: ptipo ?? '',
                pEnvase: penvase ?? '',
                pVentas: pventa ?? '',
                pT6: pseis ?? ''
            }).toString();
            mostrarLoader();
            fetch(`${env.API_URL}wmsreporteinventariogeneral?${params}`)
            .then((response) => response.json())
            .then((result) => {
              if (result.msg === "SUCCESS") {
                    // console.log('Reporte');
                    if(result.resultado.length > 0){
                        datosResumen=result.resultado;
                        // console.log(datosResumen);
                        const labelCantidad = document.getElementById("cantidadDeRegistros");
                        if (labelCantidad) {
                            labelCantidad.textContent = `Cantidad de Registros: ${datosResumen.length}`;
                        }
                        generarTabla(datosResumen); 
                    }else{
                        Swal.fire({
                            icon: "info",
                            title: "Información",
                            text: "No hay registros en este momento verifique los filtros de búsqueda",
                            confirmButtonColor: "#28a745",
                          });
                          ocultarLoader();
                    }
                                 
              } else {
                console.log("Error en el SP");
              }
            });
}

function generarTabla(datos) {
    const tabla = document.getElementById("myTableresumen");
    const thead = tabla.querySelector("thead");
    const tbody = tabla.querySelector("#tblbodyRersumen");

    // Asegúrate de que la tabla y los elementos existen
    if (!tabla || !thead || !tbody) {
        console.error("La tabla o los elementos no fueron encontrados en el DOM.");
        return;
    }

    // Limpiar contenido previo
    thead.innerHTML = "";
    tbody.innerHTML = "";

    if (datos.length === 0) {
        tbody.innerHTML = "<tr><td colspan='100%'>No hay datos disponibles</td></tr>";
        return;
    }

    // Crear encabezados de la tabla basados en las claves del primer objeto
    const headers = Object.keys(datos[0]);
    const trHead = document.createElement("tr");

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header.replace(/_/g, " "); // Reemplazar guiones bajos por espacios si los hay
        trHead.appendChild(th);
    });

    thead.appendChild(trHead);

    // Crear filas de datos
    datos.forEach(item => {
        const tr = document.createElement("tr");

        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = item[header];
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    inicializarBotonesDescarga();   
    ocultarLoader();
}
function inicializarBotonesDescarga() {    
    const btnDescargarExcel = document.getElementById('btnDescargarExcel'); // Obtener el botón de Excel
    const btnDescargarPDF = document.getElementById('btnDescargarPDF'); // Crear el botón de PDF    
    const lblExcel = document.getElementById('lblExcel').style.display = 'block';
    const lblPDF = document.getElementById('lblPDF').style.display = 'block';
    btnDescargarExcel ? btnDescargarExcel.hidden = false : btnDescargarExcel.hidden = true;
    btnDescargarPDF ? btnDescargarPDF.hidden = false : btnDescargarPDF.hidden = true;
     
 }     
// Función para obtener datos de la tabla (personaliza según tu tabla)
function obtenerDatosTabla() {
    // Asegúrate de que datosResumen esté definido y sea un arreglo
    if (Array.isArray(datosResumen)) {
        return datosResumen; // Devuelve el arreglo directamente
    } else {
        console.error("datosResumen no está definido o no es un arreglo.");
        return [];
    }
}   

function descargarPDF() {
    const { jsPDF } = window.jspdf; // Importar jsPDF desde el espacio global
    const doc = new jsPDF();

    // Título, subtítulo, fechas
    const titulo = "Reporte de conteo de inventario General";
    const pBodega = document.getElementById('bodega-sucursal').textContent;
    const subtitulo = `Bodega: B-${pBodega}`;
    const fechaInventario = document.getElementById('fecha_ini').value;
    const fechaDescarga = new Date().toLocaleDateString();

    // Obtener las cabeceras de la tabla dinámica
    const tabla = document.getElementById("myTableresumen");
    const thead = tabla.querySelector("thead");
    const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

    // Obtener los datos de la tabla dinámica
    const rows = Array.from(tabla.querySelectorAll("tbody tr"));
    const filas = rows.map(row => {
        return Array.from(row.querySelectorAll("td")).map(td => td.textContent);
    });

    // Función para dibujar encabezado en cada página
    const dibujarEncabezado = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const tituloWidth = doc.getTextWidth(titulo);
        const subtituloWidth = doc.getTextWidth(subtitulo);

        doc.setFontSize(14);
        doc.text(titulo, (pageWidth - tituloWidth) / 2, 10);

        doc.setFontSize(9);
        doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 20);

        doc.setFontSize(8);
        doc.text(`Fecha del inventario: ${fechaInventario}`, 10, 30);
        doc.text(`Fecha de impresión: ${fechaDescarga}`, pageWidth - 60, 6);
    };

    // Agregar pie de página con número de página
    const agregarPiePagina = (data) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(7);
        doc.text(`Página ${data.pageNumber}`, pageWidth - 20, pageHeight - 10);
    };

    // Crear la tabla en el PDF
    doc.autoTable({
        head: [headers], // Encabezado de la tabla
        body: filas,     // Filas de la tabla
        startY: 40,      // Posición inicial de la tabla
        styles: { fontSize: 8 }, // Estilo de texto
        headStyles: { 
            fillColor: [0, 0, 0], 
            textColor: [255, 255, 255], 
            halign: 'center' 
        }, // Estilo para los encabezados
        margin: { top: 40 }, // Margen superior
        columnStyles: {
            3: { halign: 'right' }, // Conteo alineado a la derecha
            4: { halign: 'right' }, // Existencia alineado a la derecha
            5: { halign: 'right' }  // Diferencia alineado a la derecha
        },
        didDrawPage: (data) => {
            dibujarEncabezado();
            agregarPiePagina(data);
        }
    });

    // Guardar el archivo PDF
    doc.save("Reporte_Conteo_Inventario_General.pdf");
}


function descargarExcel() {
    // Obtener los datos de la tabla generada dinámicamente
    const jsonData = obtenerDatosTabla();

    // Obtener los encabezados dinámicos (del mismo modo que en generarTabla)
    const headers = Object.keys(jsonData[0]);
    const encabezado = headers.map(header => header.replace(/_/g, " ")); // Reemplazar guiones bajos por espacios

    // Crear las filas con los datos
    const rows = jsonData.map(item => 
        headers.map(header => parseFloat(item[header]) || item[header]) // Asegurar que los valores numéricos sean correctos
    );

    // Crear la hoja de Excel
    const worksheetData = [encabezado, ...rows];

    // Crear la hoja de Excel a partir de los datos
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Crear un nuevo libro de trabajo y agregar la hoja con los datos
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Escribir y descargar el archivo Excel
    XLSX.writeFile(workbook, "Reporte_Conteo_Inventario_General.xlsx");
}

  // Función para borrar la tabla
  function limpiarTabla() {
    const tabla = document.getElementById("myTableresumen");
    const thead = tabla.querySelector("thead");
    const tbody = tabla.querySelector("#tblbodyRersumen");
    const labelCantidad = document.getElementById("cantidadDeRegistros");
    
    if(labelCantidad){
            labelCantidad.innerHTML="";
    }

    // Asegúrate de que la tabla y los elementos existen
    if (!tabla || !thead || !tbody) {
        console.error("La tabla o los elementos no fueron encontrados en el DOM.");
        return;
    }

    // Limpiar contenido previo
    thead.innerHTML = "";
    tbody.innerHTML = "";
  }



