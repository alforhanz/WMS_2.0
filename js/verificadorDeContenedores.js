//Variable global que contiene el detalle del contenedor
var detalleLineasContenedoreses=[];
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function (){ 
  cargarBodegas();
  console.log("Verificador de contenedores DOM cargado...");
  // const busqueda = localStorage.getItem('SearchParameterFlag');
  // localStorage.setItem('switch_procesados', 'false');
  // if (busqueda === "true") {
    
  //   const parametrosBusqueda = localStorage.getItem('parametrosBusquedaContenedor');
    
  //   if(parametrosBusqueda){
  //         const params = new URLSearchParams(parametrosBusqueda);
  //         const pBodega = params.get('pBodega');
  //         const pFechaDesde = params.get('pFechaDesde');
  //         const pFechaHasta = params.get('pFechaHasta');
  //         const pUsuario = params.get('pUsuario');
  //         const pConsecutivo = params.get('pConsecutivo');
  //         enviarDatosControlador(pBodega,pFechaDesde,pFechaHasta,pUsuario,pConsecutivo );
  //       }        
  //   } 
});
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function validarBusquedaContenedor() {
 
  // mostrarLoading();
  var bodega = document.getElementById("bodega").value;

  if (bodega == "") {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Por favor, seleccione una bodega.'
    });
    return false; // Evita que se envíe el formulario
  }
  else {
    let pSistema ="WMS";
    // let pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;
     let pUsuario = "PRUEBAPMA";
    let pOpcion ="A";
    // let pBodegaEnvia = document.getElementById("bodega").value;
    // let pBodegaDestino = document.getElementById("bodegaSelectOC").value;
    let pBodegaEnvia = "B-81"
    let pBodegaDestino = "B-01"
    //let pConsecutivo = $('#pContenedor').val();
    let pEstado ="AW"
    // let pFechaDesde = $('#fecha_ini').val();
    let pFechaDesde = "2025-01-01"

   const params =
  "?pSistema="+
    pSistema+
    "&pUsuario="+
    pUsuario+
    "&pOpcion="+
    pOpcion+
    "&pBodegaEnvia=" +
    pBodegaEnvia+
    "&pBodegaDestino=" +
    pBodegaDestino+ 
    // "&pConsecutivo=" +
    // pConsecutivo+
    "&pEstado="+
    pEstado+
    "&pFechaDesde=" +
    pFechaDesde;
    
    enviarDatosControlador(params);
  }
}
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function enviarDatosControlador(params) {
  // mostrarLoading();
  let pag = 1;
  
//Mostrar Loader
  mostrarLoader();
//console.log('BUSQUEDA CONTENEDOR PARAMETROS\n '+params);
 localStorage.setItem('parametrosBusquedaContenedor', params);
// localStorage.setItem('SearchParameterFlag', 'true');

  fetch(env.API_URL + "verificadordecontenedores" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
         detalleLineasContenedoreses=result.respuesta; 
        if (result.respuesta.length != 0) {
          armarTablaVerificacion(detalleLineasContenedoreses);
          console.log('REsultados:');
          console.log(detalleLineasContenedoreses);
        }else{
          Swal.fire({
            icon: "info",
            title: "Información",            
            text: "No hay registros asignados para el usuario:",
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
// Función para cargar las bodegas
function cargarBodegas() {
fetch(env.API_URL + "wmsmostarbodegasconsultaordencompra")
    .then(response => response.json())
    .then(data => {
    const bodegasSelect = document.getElementById('bodegaSelectOC');
    if (data.respuesta && Array.isArray(data.respuesta)) {
        // Limpiar las opciones existentes
        bodegasSelect.innerHTML = '<option value="" disabled selected>Seleccione una bodega</option>';
        
        // Agregar opciones nuevas
        data.respuesta.forEach(bodega => {
        const option = document.createElement('option');
        option.value = bodega.BODEGA;
        option.textContent = bodega.NOMBRE;
        bodegasSelect.appendChild(option);
        });

        // Re-inicializar el select para aplicar los cambios
        M.FormSelect.init(bodegasSelect);
    } else {
        console.error('No se encontraron bodegas.');
    }
    })
    .catch(error => console.error('Error al cargar las bodegas:', error));
}
  /////////////////////////////////////////////////////////////////////////////////////////////////////
 //////////       LECTURA Y VERIFICACION                                          ////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//////////FUNCIONES PARA LA PESTAÑA LECTURA - VALIDA EL CODIGO LEIDO//////////////////
///// Funcion que valida el codigo leido en el imput ////////////
function validarCodigoBarras(input) {
    const LineasContenedor = detalleLineasContenedoreses;
    const codbarra = input.value.trim().toUpperCase();
    const row = input.closest('tr');
    const firstTd = row.querySelector('td:first-child');
    const span = firstTd.querySelector('span');
    const siguienteTd = row.querySelector('.codigo-barras-cell2');
    const cantFila = siguienteTd.querySelector('.codigo-barras-input');

    const codigoValido = LineasContenedor.some(item => {
        // Normaliza valores para evitar errores si son null/undefined
        const articulo = item.Articulo ? item.Articulo.toUpperCase() : '';
        const codigoBarra = item.Codigo_Barra ? item.Codigo_Barra.toUpperCase() : '';

        if (articulo === codbarra || codigoBarra === codbarra) {
            span.textContent = item.Articulo;
            cantFila.value = 1;

            // Bloquear el input
            input.setAttribute('readonly', 'readonly');

            // Crear nueva fila y guardar en el array
            crearNuevaFila();
            guardarTablaEnArray();

            return true; // Detiene el some()
        }

        return false;
    });

    if (!codigoValido) {
        const codigoBarrasCell = row.querySelector('.codigo-barras-cell');
        const codigoBarrasInput = codigoBarrasCell.querySelector('.codigo-barras-input');
        codigoBarrasInput.value = '';

        Swal.fire({
            icon: 'warning',
            title: '¡Código no válido!',
            text: 'El código ingresado no coincide con ningún artículo del contenedor. Intente nuevamente.',
            confirmButtonColor: '#28a745',
        });
    }
}
///// Funcion que crea la nueva fila en la pestaña lectura ////////////
function crearNuevaFila() {
  const tableBody = document.querySelector('#tblbodyLectura');

  // Agregar la clase deseada a la tabla
  tableBody.classList.add("display", "centered");

  const nuevaFilaHTML =
      `<tr>
            <td class="sticky-column" style="text-align: center;" style="user-select: none;"><span display: inline-block;"></span></td>
            <td class="codigo-barras-cell" style="text-align: center;"><input type="text" style="text-align: center;" id="codigo-barras" class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" autofocus></td>
            <td class="codigo-barras-cell2" style="text-align: center;"><input id="cant-pedida" style="text-align: center;" type="text" class="codigo-barras-input" value="" onchange="actualizaLectura(this)"></td>
            <td class="codigo-barras-cell2" style="text-align: center;"><i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i></td>
        </tr>`;

  tableBody.insertAdjacentHTML('beforeend', nuevaFilaHTML);

  // Obtén el último campo de entrada en la columna COD de la nueva fila
  const nuevoCodigoBarrasInput = tableBody.querySelector('tr:last-child .codigo-barras-input');

  // Establece el enfoque en el último campo de entrada
  if (nuevoCodigoBarrasInput) {
      nuevoCodigoBarrasInput.focus();
  }
}
/////////////Actualiza el arreglo de las cantidades leídas, si se modifíca ya ue por defecto esta es 1////////
function actualizaLectura() {  
  guardarTablaEnArray();
}
/////aguarda en un arreglo y en el localstorage la información leida en la tabla lectura
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
    //var articuloEliminado = row.querySelector('.sticky-column').innerText.trim();

    // Mostrar un SweetAlert antes de eliminar la fila
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'A continuación se va a eliminar una fila de la pestaña lectura',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
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
                guardarTablaEnArray();
            }            
        }
    });    
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////VALIDA EL CONTENIDO DE LA PESTAÑA LECTURA CONTRA LA TABLA VERIFICACION//////////////////

// //Funcion que limpia el area de mensajes de error
  function limpiarMensajes() {
    localStorage.removeItem("mensajes");
    const mensajeTextArea = document.getElementById('mensajeText');
    mensajeTextArea.value = '';
    // Limpiar la variable 'mensajes' del localStorage
    guardarTablaEnArray();    
}

///FUNCION QUE ARMA LA TABLA DE LA PESTAÑA VERIFICACION
function armarTablaVerificacion(detalleLineasContenedores) {
    // Obtener la referencia del cuerpo de la tabla
    var tbody = document.getElementById('tblbodyLineasContenedor');

    // Limpiar el contenido actual del cuerpo de la tabla
    tbody.innerHTML = '';

     // Obtener la referencia del label cantidadDeRegistros
    var cantidadDeRegistrosLabel = document.getElementById('cantidadDeRegistros');
    // Actualizar el texto del label con la cantidad de registros
    cantidadDeRegistrosLabel.textContent = 'Cantidad de registros: ' + detalleLineasContenedores.length;

    // Iterar sobre cada elemento en detalleLineasContenedores
    detalleLineasContenedores.forEach(function (detalle) {
        // Crear una nueva fila
        var newRow = document.createElement('tr');

        // Construir el contenido de la fila usando variables HTML
        newRow.innerHTML = `
            <td id="contenedor">${detalle.Contenedor}</td>
            <td id="articulo">${detalle.Articulo || ''}</td>
            <td id="descripcion">${detalle.Descripcion}</td>
            <td id="cantidadPedida">${detalle.Cant_Pedida}</td>
            <td id="cantidadPreparada">${detalle.Cant_Verificada}</td>            
            <td id="cantidadLeida"></td> <!-- Cantidad leída, inicialmente en blanco --> 
            <td id="verificado"></td>            
        `;
        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(newRow);
    });
}
// //FUNCION QUE VERIFICA LAS COINCIDENCIAS,TOMA LOS VALORES DE LAS CANTIDADES
// // POR ARTICULO, COMPARA LO QUE TIENE EL ARRAY DEL LS Y VERIFICA LAS COINCIDENCIAS, PARA MOSTRARLO EN LA PESTAÑA VERIFICACION
function verificacion() {

var dataArray = JSON.parse(localStorage.getItem('dataArray'));

    // Obtener la tabla verificacion por su ID
    const tabla = document.getElementById('myTableVerificacion');

    // Verificar si la tabla existe
    if (tabla) {
        // Obtener el tbody de la tabla
        const tbody = tabla.querySelector('tbody');

        // Buscar todas las filas (tr) dentro del tbody
        const filas = tbody.querySelectorAll('tr');

        // Iterar a través de las filas
        filas.forEach(fila => {
            // Encontrar la celda con el id "cantidadLeida" y vaciar su contenido
            const cantidadLeidaCell = fila.querySelector('#cantidadLeida');
            const verifcheck = fila.querySelector('#verificado');
            if (cantidadLeidaCell) {
                cantidadLeidaCell.textContent = ''; // Vacía el contenido de la celda
            }

            if (verifcheck) {
             verifcheck.textContent = ''; // Vacía el contenido de la celda
         }
        });
    }

// Objeto para almacenar los totales de cantidades
var cantidadesTotales = [];

// Crear un nuevo array con los resultados
var resultadoArray = [];

// Bucle para buscar coincidencias y sumar cantidades
dataArray.forEach(function (item) {
    var articulo = item.ARTICULO;
    var cantidad = item.CANTIDAD_LEIDA;

    if (cantidadesTotales[articulo]) {
        cantidadesTotales[articulo] += cantidad;
      
    } else {
        cantidadesTotales[articulo] = cantidad;
    }

    // Verificar si la cantidad total coincide con la cantidad leída
    if (cantidadesTotales[articulo] === cantidad) {
        resultadoArray.push(item);
        delete cantidadesTotales[articulo];        
    }
});  

// Agregar las cantidades totales restantes al resultadoArray
     for (var articulo in cantidadesTotales) {
        resultadoArray.push({
                      ARTICULO: articulo,
                      CANTIDAD_LEIDA: cantidadesTotales[articulo]
         });
     }
// console.log('resultadoARRAY=');
//   resultadoArray.forEach((item) => {
//     console.log(item.ARTICULO);
//      console.log(item.CANTIDAD_LEIDA);
// });
// console.log("detalleLineasContenedoreses");
// console.log(detalleLineasContenedoreses);
 
    //  //Agregar resto de verificación   
    // var LineasContenedor = detalleLineasContenedoreses;

    // Array para almacenar los mensajes
    const mensajesArray = [];

     resultadoArray.forEach(resultado => {
          const encontrado = detalleLineasContenedoreses.find(item => 
                        item.Articulo.trim() === resultado.ARTICULO.trim() &&
                        parseFloat(item.Cant_Verificada || 0) === parseFloat(resultado.CANTIDAD_LEIDA || 0)
                    );
         
         if (encontrado) {
                  // Código si es verdadero

                 console.log(`✅ Coincidencia encontrada para ${resultado.ARTICULO}`);
             // Buscar la tabla por su ID
             const tabla = document.getElementById('tblcontenedores');

             // Verificar si la tabla existe
             if (tabla) {
                 // Obtener el tbody de la tabla
                 const tbody = tabla.querySelector('tbody');

                 // Buscar todas las filas (tr) dentro del tbody
                 const filas = tbody.querySelectorAll('tr');


                 // Iterar a través de las filas
                 filas.forEach(fila => {
                     // Encontrar la celda (td) con el valor de ARTICULO

                     const celdaARTICULO = fila.querySelector('#articulo');

                     // Verificar si la celda contiene el mismo valor que resultado.ARTICULO
                     //compara la cantidad del detalle del contenedor con la cantidad de lo leido.
                     if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO ) {
                         // Encontrar la celda con el id "verificado"
                         const celdaVerificado = fila.querySelector('#verificado');

                         // Agregar el "Verificado" en la celda
                         if (celdaVerificado) {
                             celdaVerificado.textContent = '';
                            // Crear un elemento <span> para el ícono de Material Icons
                            const spanVerificacion = document.createElement('span');
                            spanVerificacion.classList.add('material-icons');
                            spanVerificacion.textContent = 'done_all'; // Texto que indica qué ícono de Material Icons se mostrará
                            // Establecer el color verde en línea
                            spanVerificacion.style.color = 'green';
                            // Agregar el span a la celda
                            celdaVerificado.appendChild(spanVerificacion);                           
                         }
                         // Encuentra la celda de "CANTIDAD LEIDA" en cada fila para colocar la cantidad que fue leida
                        // const cantidadVerificadaCell = fila.querySelector('[id="cantidadLeida"]');
                         const cantidadVerificadaCell = fila.querySelector('#cantidadLeida');
                         if (cantidadVerificadaCell) {

                            cantidadVerificadaCell.textContent = resultado.CANTIDAD_LEIDA;
                         }
                     }
                 });
             }
             limpiarMensajes();
         }else {
          
              // Código si es falso
              console.log(`❌ No encontrado: ${resultado.ARTICULO}`);
             // Buscar la tabla por su ID
             const tabla = document.getElementById('tblcontenedores');
             // Array para almacenar mensajes de verificación
                 if (tabla) {
                 // Obtener el tbody de la tabla
                 const tbody = tabla.querySelector('tbody');

                 // Buscar todas las filas (tr) dentro del tbody
                 const filas = tbody.querySelectorAll('tr');

                 // Iterar a través de las filas
                 filas.forEach(fila => {
                     // Encontrar la celda (td) con el valor de ARTICULO

                     const celdaARTICULO = fila.querySelector('#articulo');

                     // Verificar si la celda contiene el mismo valor que resultado.ARTICULO en la fila correspondiente
                     if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO) {
                         // Encontrar la celda con el id "verificado"
                         const celdaVerificado = fila.querySelector('#verificado');
                  
                         // Encuentra la celda de "CANT VERIF" en cada fila segun el codigo del artículo
                         const cantPedida = fila.querySelector('#cantidadPreparada');
                         const cantidadVerificadaCell = fila.querySelector('#cantidadLeida');
                         console.log("OPERACION:");   
                         console.log(cantPedida );
                         console.log(cantidadVerificadaCell);
                         if (parseFloat(resultado.CANTIDAD_LEIDA) > parseFloat(cantPedida.textContent)) {
                             var resultadoOperacion = '+' + (resultado.CANTIDAD_LEIDA - parseFloat(cantPedida.textContent)).toString();

                             celdaVerificado.textContent = resultadoOperacion;
                             // Agregar el mensaje directamente al textarea
                                const mensaje = `*La cantidad verificada del artículo ${resultado.ARTICULO} es mayor a la solicitada.`;
                                mensajesArray.push(mensaje);                               
                                
                         } else if (resultado.CANTIDAD_LEIDA < parseFloat(cantPedida.textContent)) {
                             var resultadoOperacion = (resultado.CANTIDAD_LEIDA - parseFloat(cantPedida.textContent)).toString();

                             celdaVerificado.textContent = resultadoOperacion;
                              // Agregar el mensaje directamente al textarea                              
                                const mensaje = `>La cantidad verificada del artículo ${resultado.ARTICULO} es menor a la solicitada.`;
                                mensajesArray.push(mensaje);   
                         }
                         // Encuentra la celda de "CANTIDAD VERIFICADA" en cada fila para colocar la cantidad que fue leida
                         if (cantidadVerificadaCell) {
                             cantidadVerificadaCell.textContent = resultado.CANTIDAD_LEIDA;
                         }
                     }
                 });//fin del forEach                
                    localStorage.setItem("mensajes", JSON.stringify(mensajesArray));
             }
         }

     });

         // Después de realizar la verificación, habilitar o deshabilitar el botón DE PROCESAR      
    //      const estadoPedidoElement = document.getElementById("estadoPedido");
    //      const estadoPedidoText = estadoPedidoElement.textContent;
    //      const estadoPedidoParts = estadoPedidoText.split(':'); // Dividir el texto por los dos puntos
    //      const estadoPedido = estadoPedidoParts.length > 1 ? estadoPedidoParts[1].trim() : ''; // Obtener la parte después de los dos puntos y eliminar espacios en blanco
                
       
    //  const procesarHabilitado = todasLasFilasVerificadas() ;

    // //const procesarHabilitado = todasLasFilasVerificadas();
   
    // if (procesarHabilitado) {
    //     // Habilitar el botón "Procesar"
    //     document.getElementById('btnProcesar').removeAttribute('hidden');
    // } else {
    //     // Deshabilitar el botón "Procesar"
    //     document.getElementById('btnProcesar').setAttribute('hidden', 'hidden');
    // }

    // // Después de realizar la verificación, habilitar o deshabilitar el botón "DE GUARDADO PARCIAL"
    // const guardarParcialHabilitado = activaGuardadoParcial();
    // if (guardarParcialHabilitado) {
    //     // Deshabilitar el botón "Procesar"
    //     document.getElementById('btnGuardar').setAttribute('hidden', 'hidden');
    // } else {
    //     // Habilitar el botón "Procesar"
    //     document.getElementById('btnGuardar').removeAttribute('hidden');
    // }    
    //activaDevolverArticulo();
 }//FIN DE VERIFICACION

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCION QUE VERIFICA LAS CANTIDASDES LEIDAS Y DEL PEDIDO PÁRA ACTIVAR EL BOTON DE GUARDADO PARCIAL
// function activaGuardadoParcial() {
//     // Obtener todas las filas de la tabla de verificación
//     const filas = document.querySelectorAll('#myTableVerificacion tbody tr');

//     for (let i = 0; i < filas.length; i++) {
//         const fila = filas[i];

//         // Obtener las celdas de "CANT PEDIDA" y "CANT LEIDA" en la fila actual
//         const celdaCantidadPedida = fila.querySelector('td#cantidadPedida');
//         const celdaCantidadLeida = fila.querySelector('td#cantidadLeida');

//         // Verificar si la cantidad leída es mayor que la cantidad pedida en al menos una fila
//         if (parseFloat(celdaCantidadLeida.textContent) > parseFloat(celdaCantidadPedida.textContent)) {
//             // Si encontramos una fila donde la cantidad leída es mayor, retornamos true
//             return true;
//         }
//     }
//     // Si ninguna fila tiene cantidad leída mayor que cantidad pedida, retornamos false
//     return false;
// }
// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función para mostrar los mensajes almacenados en el localStorage en el textarea
function mostrarMensajesLocalStorage() {
    const mensajesStorage = localStorage.getItem("mensajes");
    if (mensajesStorage) {
        const mensajes = JSON.parse(mensajesStorage);
        const textarea = document.getElementById('mensajeText');
        // Limpiar el textarea antes de agregar nuevos mensajes
        textarea.value = '';
        // Agregar cada mensaje al textarea
        for (let i = 0; i < mensajes.length; i++) {
            textarea.value += mensajes[i] + '\n'; // Agregar el mensaje y un salto de línea
        }
    }
}
//Llama a la función mostrarMensajesLocalStorage cuando se hace clic en la pestaña "Verificación"
document.querySelector('a[href="#tabla-verificacion"]').addEventListener('click', mostrarMensajesLocalStorage);

// function inicializarBotones() {
//     // Crear los botones y el contenedor
//     const contenedorBotones = document.createElement('div');
//     const botonProcesar = document.createElement('button');
//     const botonGuardarParcial = document.createElement('button');

//     // Configurar propiedades de los botones
//     botonProcesar.textContent = 'Crear Paquete';
//     botonProcesar.id = 'btnProcesar';
//     botonProcesar.hidden = false;
//     botonProcesar.onclick = confirmaProcesar; // Agregar onclick

//     botonGuardarParcial.textContent = 'Guardar';
//     botonGuardarParcial.id = 'btnGuardar';  
//     botonGuardarParcial.hidden = false; 
//     botonGuardarParcial.onclick = confirmarGuardadoParcial; // Agregar onclick

//     // Aplicar estilos al botón de guardado parcial
//     botonGuardarParcial.style.backgroundColor = '#28a745';
//     botonGuardarParcial.style.borderRadius = '5px';
//     botonGuardarParcial.style.color = 'white';
//     botonGuardarParcial.style.marginTop = '16px';
//     botonGuardarParcial.style.marginLeft = '16px';
//     botonGuardarParcial.style.marginRight = '16px';
//     botonGuardarParcial.style.height = '36px';
//     botonGuardarParcial.style.width = '100px';

//     // Aplicar estilos al botón de Procesar
//     botonProcesar.style.width = '100px';
//     botonProcesar.style.backgroundColor = '#28a745';
//     botonProcesar.style.borderRadius = '5px';
//     botonProcesar.style.color = 'white';
//     botonProcesar.style.marginTop = '16px';
//     botonProcesar.style.marginLeft = '6em';
//     botonProcesar.style.height = '40px';
//     botonProcesar.style.marginbottom = '25px';

//     // Agregar botones al contenedor
//     contenedorBotones.appendChild(botonGuardarParcial);
//     contenedorBotones.appendChild(botonProcesar);
   

//     // Obtener tabla de verificación
//     const tablaVerificacion = document.getElementById('myTableVerificacion');

//     // Insertar contenedor de botones después de la tabla de verificación
//     tablaVerificacion.parentNode.insertBefore(contenedorBotones, tablaVerificacion.nextSibling);

//       // Media query para pantallas grandes
//       const mediaQuery = window.matchMedia('(min-width: 64em)');
//       if (mediaQuery.matches) {
//           // Aplicar estilos específicos para pantallas grandes
//           botonGuardarParcial.style.marginLeft = '200px';
//           botonProcesar.style.marginLeft = '500px';
//       }
// }


// // Llamar a la función para cargar y mostrar los mensajes desde el localStorage al cargar la página
// window.onload = function() {
//    // inicializarBotones();
//     guardarTablaEnArray();
      
// };



/////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Funcion de confirmación del guardado parcial
//  function confirmarGuardadoParcial() {
//     Swal.fire({
//         icon: 'info',
//         title: '¿A continuación se guardaran los datos leidos del contenedor...?',
//         showCancelButton: true,
//         confirmButtonText: 'Continuar',
//         cancelButtonText: 'Cancelar',
//         confirmButtonColor: "#28a745",
//         cancelButtonColor: "#6e7881",
//     }).then((result) => {
//         if (result.isConfirmed) {
//             guardaParcialMente();
//            Swal.fire({
//             icon: 'info',
//             title: 'Guardado',
//             text: 'Esta guardado.'
//           });
//         }
//     });
// }

// //FUNCION DE GUARDADO PARCIAL
//      function guardaParcialMente() {
//         //var dataArray = JSON.parse(localStorage.getItem('dataArray'));
//         let pUsuario = localStorage.getItem('username');
//         var pConsecutivo = localStorage.getItem('contenedor');
        
//             // Array para almacenar todas las cantidades y artículos
//             var detalles = [];
       
//                             // Obtener la tabla
//                     let table = document.getElementById("myTableVerificacion");

//                     // Iterar sobre las filas de la tabla (excluyendo el encabezado)
//                     for (let i = 1; i < table.rows.length; i++) {
//                         let row = table.rows[i];

//                          // Obtener lasolicitud
//                         let solicitud = row.querySelector("#solicitud").textContent.trim() || 0;
                        
//                         // Obtener el valor del artículo
//                         let articulo = row.querySelector("#verifica-articulo span").textContent.trim();
                        
//                         // Obtener la cantidad pedida
//                         let cantidadPedida = row.querySelector("#cantidadPedida").textContent.trim();
                        
//                         // Obtener la cantidad leída
//                         let cantidadLeida = row.querySelector("#cantidadLeida").textContent.trim() || 0;

                       


//                         // if (isNaN(cantidadLeida) || cantidadLeida == undefined || cantidadLeida == null || cantidadLeida == "") {
//                         //       cantidadLeida = 0;
//                         //   }

//                             // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
//                             var detalle = {
//                                 SOLICITUD: solicitud,
//                                 ARTICULO: articulo,
//                                 CANT_CONSEC: cantidadPedida,
//                                 CANT_LEIDA: cantidadLeida                               
//                             };

//                             // Agregar el objeto al array
//                             detalles.push(detalle);
//                     }
//             // Convertir el array de objetos a formato JSON
//             var jsonDetalles = JSON.stringify(detalles);
       
//         const params =
//         "?pUsuario=" +
//         pUsuario +
//         "&pConsecutivo=" +   
//         pConsecutivo +
//         "&jsonDetalles=" +
//         jsonDetalles ;               
    
//       fetch(env.API_URL + "contenedor/G" + params, myInit)
//       .then((response) => response.json())     
//       .then((result) => {  
//         console.log("Respuesta del SP");
//         console.log(result.contenedor);      

//         console.log("Respuesta Contenedor");
//         console.log(result);  

//         if (result.msg === "SUCCESS") {
//           if (result.contenedor.length != 0) {   
//              // Resto del código de éxito
//             Swal.fire({
//                 icon: "success",
//                 title: "Datos guardados correctamente",
//                 confirmButtonText: "Aceptar",
//                 confirmButtonColor: "#28a745",
//                 cancelButtonColor: "#6e7881",
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     // Redirecciona a tu otra vista aquí
//                     window.location.href = 'BusquedaDeContenedores.html';                 
//                 }
//             });
//           }          
//         } 
//         else{            
//         }
//       });      
    
// }//fin fn
      
// ///////FUNCION PARA PROCESAR//////       
// function confirmaProcesar() {
//  // Obtener todas las celdas de verificación
//  //var celdasVerificacion = document.querySelectorAll('#tblbodyLineasContenedor td#verificado');

//     Swal.fire({
//         icon: 'warning',
//         title: '¿Desea procesar el contenedor?',
//         showCancelButton: true,
//         confirmButtonText: 'Continuar',
//         cancelButtonText: 'Cancelar',
//         confirmButtonColor: "#28a745",
//         cancelButtonColor: "#6e7881",
//     }).then((result) => {
//         if (result.isConfirmed) {

//           // Verificar si todas las celdas de verificación están marcadas
//           if(validarVerificacion()) {
//             // Si todas están marcadas, procesar el contenedor
//              localStorage.removeItem("UsuarioAutorizacion");
//             procesarContenedor();
//         } else {
//                 Swal.fire({
//                 title: "Ingrese sus credenciales",
//                 html:
//                 '<input id="swal-input1" class="swal2-input" placeholder="Usuario" autocomplete="off">' +
//                 '<input id="swal-input2" class="swal2-input" placeholder="Contraseña" type="password" autocomplete="off">',
//                 focusConfirm: false,
//                 showCancelButton: true,
//                 confirmButtonText: 'Aprobar',
//                 cancelButtonText: 'Cancelar',
//                 confirmButtonColor: "#28a745",
//                 cancelButtonColor: "#6e7881",
//                 preConfirm: () => {
//                     const usuario = document.getElementById('swal-input1').value.toUpperCase();
//                     const contraseña = document.getElementById('swal-input2').value;
//                     return { usuario: usuario, contraseña: contraseña };
//                 }
//             }).then((result) => {
//                 if (!result.isDismissed && result.value && result.value.usuario && result.value.contraseña) {
//                     fetch(env.API_URL + "wmsautorizacioncontenedor")
//                     .then((response) => response.json())     
//                     .then((resultado) => {    
//                         console.log('Autorizacion Resultado: ');
//                         console.log(resultado.respuesta);      
//                         const respuesta = resultado.respuesta[0];
//                         if (respuesta && respuesta.USUARIO === result.value.usuario && respuesta.PIN === result.value.contraseña) {
//                             console.log("Credenciales válidas");
//                             console.log(respuesta.USUARIO);
//                             localStorage.setItem('UsuarioAutorizacion',respuesta.USUARIO);
//                             // Realiza la acción deseada, como procesar el contenedor
//                            procesarContenedor();
//                         } else {
//                             console.log("Credenciales inválidas");
//                             Swal.fire({
//                                 icon: 'error',
//                                 title: 'Error',
//                                 text: 'Credenciales inválidas'
//                             });
//                         }
//                     }).catch((error) => {
//                         console.error('Error al obtener los datos del API:', error);
//                         Swal.fire({
//                             icon: 'error',
//                             title: 'Error',
//                             text: 'No se pudo obtener los datos del API'
//                         });
//                     }); 
//                 } else {
//                     console.error('Error: No se pudieron obtener los valores de usuario y contraseña del Swal');
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error',
//                         text: 'No se pudieron obtener los valores de usuario y contraseña del Swal'
//                     });
//                 }
//             });
//             }
                
            
//         }
//     });
// }

// ///// FUNCION PARA VERIFICAR EL CHECK EN LA COLUNA DE VERIFICACO
// function validarVerificacion() {
//     // Obtener todas las celdas de verificación
//     var celdasVerificacion = document.querySelectorAll('#tblbodyLineasContenedor td#verificado');

//     // Iterar sobre cada celda de verificación
//     for (var i = 0; i < celdasVerificacion.length; i++) {
//         // Obtener el span dentro de la celda
//         var spanVerificacion = celdasVerificacion[i].querySelector('span.material-icons');
//         // Verificar si el span no está presente o su contenido no es 'done_all'
//         if (!spanVerificacion || spanVerificacion.textContent !== 'done_all') {
//             // Si encuentra una celda sin verificar, retorna false
//             return false;
//         }
//     } 
//     // Si todas las celdas están verificadas, retorna true
//     return true;
// }
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// function columnaEstaVacia() {
//     // Selecciona todas las celdas con id "cantidadLeida" dentro del cuerpo de la tabla
//     var celdasCantidadLeida = document.querySelectorAll('#tblbodyLineasContenedor td#cantidadLeida');

//     // Recorremos cada celda y verificamos si alguna tiene contenido
//     for (var i = 0; i < celdasCantidadLeida.length; i++) {
//         if (celdasCantidadLeida[i].textContent.trim() !== '') {
//             return false; // Al menos una celda tiene datos
//         }
//     }

//     return true; // Todas las celdas están vacías
// }
   
// //FUNCION DE PROCESAR EL CONTENEDOR
// function procesarContenedor() {
      
//         let pUsuario = localStorage.getItem('username');
//         let pConsecutivo = localStorage.getItem('contenedor');
//        let pUsuarioAutorizacion = localStorage.getItem('UsuarioAutorizacion') || null;


//         //  let pUsuarioAutorizacion = localStorage.getItem('UsuarioAutorizacion');
//         //  pUsuarioAutorizacion = (pUsuarioAutorizacion && pUsuarioAutorizacion.trim() !== "") 
//         //  ? pUsuarioAutorizacion.toUpperCase() 
//         //  : null;

       
//             // Array para almacenar todas las cantidades y artículos
//             var detalles = [];
       
//                         // Obtener la tabla
//                 let table = document.getElementById("myTableVerificacion");

//                 // Iterar sobre las filas de la tabla (excluyendo el encabezado)
//                 for (let i = 1; i < table.rows.length; i++) {
//                     let row = table.rows[i];

//                     // Obtener lasolicitud
//                     let solicitud = row.querySelector("#solicitud").textContent.trim() || 0;
                    
//                     // Obtener el valor del artículo
//                     let articulo = row.querySelector("#verifica-articulo span").textContent.trim();
                    
//                     // Obtener la cantidad pedida
//                     let cantidadPedida = row.querySelector("#cantidadPedida").textContent.trim();
                    
//                     // Obtener la cantidad leída
//                     let cantidadLeida = row.querySelector("#cantidadLeida").textContent.trim() || 0;


//                         // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
//                         var detalle = {
//                             SOLICITUD: solicitud,
//                             ARTICULO: articulo,
//                             CANT_CONSEC: cantidadPedida,
//                             CANT_LEIDA: cantidadLeida
//                         };

//                         // Agregar el objeto al array
//                         detalles.push(detalle);
//                 }

//             // Convertir el array de objetos a formato JSON
//             var jsonDetalles = JSON.stringify(detalles);

           
       
//         const params =
//         "?pUsuario=" +
//         pUsuario +
//         "&pConsecutivo=" +   
//         pConsecutivo +
//         "&jsonDetalles=" +
//         jsonDetalles+
//         "&pUsuarioAutorizacion="+
//         pUsuarioAutorizacion;
//         let vacia = columnaEstaVacia();
//         if(vacia){
//            console.log('la columna de cantidad leida esta vacia...')
//               Swal.fire({
//                         icon: "warning",
//                         title: "La columna de cantidad leida esta vacia",
//                         confirmButtonText: "Aceptar",
//                         confirmButtonColor: "#28a745",
//                         cancelButtonColor: "#6e7881",
//                     })
//         }else{
//              console.log('Se ha guardado con exito el contenedor...')
                 
//             fetch(env.API_URL + "contenedor/P" + params, myInit)
//             .then((response) => response.json())     
//             .then((result) => {          
//                 if (result.msg === "SUCCESS") {
//                 if (result.contenedor.length != 0) {   
//                     // Resto del código de éxito
//                     Swal.fire({
//                         icon: "success",
//                         title: "Datos procesados con éxito",
//                         confirmButtonText: "Aceptar",
//                         confirmButtonColor: "#28a745",
//                         cancelButtonColor: "#6e7881",
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             // Redirecciona a tu otra vista aquí
//                             window.location.href = 'BusquedaDeContenedores.html';   
                           
       
//                         }
//                     });
//                 }          
//                 } 
//                 else{            
//                 }
//             });            
//         }

// }

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Función para devolver un artículo eliminado del contenedor
// function devolverArticulo(articulo) {

// let table = document.getElementById("myTableVerificacion");
// let pPedido = localStorage.getItem('contenedorSelect');
// let pArticulo = articulo;
   
//     // Mostrar mensaje con swal.fire
//     swal.fire({
//         title: "Devolver Artículo",
//         text: "¿Estás seguro de devolver el artículo " + pArticulo + " del contenedor número " + pPedido + "?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Sí, devolver",
//         cancelButtonText: "Cancelar"
//     }).then((result) => {
//         // Si se hace clic en "Sí, devolver"
//         if (result.isConfirmed) {
//             const params =
//             "?pPedido=" +
//             pPedido +
//             "&pArticulo=" +   
//             pArticulo;  

//             fetch(env.API_URL + "devolverarticulo/D" + params, myInit)
//             .then((response) => response.json())     
//             .then((result) => {          
//             if (result.msg === "SUCCESS") {
//                 if (result.articulodevuelto.length != 0) {                                
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'Articulo Devuelto con exito',
//                     showCancelButton: true,
//                     confirmButtonText: 'Continuar',
//                     cancelButtonText: 'Cancelar'
//                 })
//                        // Iterar a través de las filas de la tabla (ignorando la fila de encabezado)
//                     for (var i = 1; i < table.rows.length; i++) {
                       
//                         var articuloEnFila = table.rows[i].cells[0].querySelector("h5#verifica-articulo span").innerText.trim();

//                         // Verificar si el artículo en la fila coincide con el artículo a devolver
//                         if (articuloEnFila === articulo) {
//                             // Eliminar la fila
//                             table.deleteRow(i);

//                             // Mostrar mensaje de éxito
//                             swal.fire("Éxito", "Artículo devuelto correctamente.", "success");
//                             break; // Salir del bucle después de eliminar la fila
//                         }
//                     }       
//                 }          
//             } 
//             else{                 
//                 Swal.fire({
//                         icon: 'error',
//                         title: 'Error al procesar el contenedor',
//                         showCancelButton: true,
//                         confirmButtonText: 'Continuar',
//                         cancelButtonText: 'Cancelar'
//                     })        
//             }
//             });
//         }
//     });
// }
