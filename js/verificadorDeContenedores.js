//Variable global que contiene el detalle del contenedor
var detalleLineasContenedoreses=[];
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function (){ 
  cargarBodegas();
  console.log("Verificador de contenedores DOM cargado...");
    //permisoCrearPaquete();  
});
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function validarBusquedaContenedor() {
 
  // mostrarLoading();
  var bodega = document.getElementById("bodega").value;
   let pPlaca = document.getElementById("placa-camion").value;   

  if (pPlaca==="") {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Por favor, ingrese la placa del camión.'
    });    
  }
  else {
    let pSistema ="WMS";
    let pUsuario = document.getElementById("usuario").innerText || document.getElementById("usuario").innerHTML;    
    let pOpcion ="A";
    // let pBodegaEnvia = document.getElementById("bodega").value;
     let pBodegaEnvia = bodega;
    let pBodegaDestino = document.getElementById("bodegaSelectOC").value;  
    let pConsecutivo = $('#pContenedor').val();  
    let pEstado ="AW"
    let pFechaDesde = $('#fecha_ini').val();
    
    //parametros quemados
    //let pUsuario = "PRUEBAPMA";
    //let pBodegaEnvia = "B-81"
    //let pBodegaDestino = "B-01"
    //let pConsecutivo = $('#pContenedor').val();
    //let pFechaDesde = "2025-01-01"

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
    "&pContenedor=" +
    pConsecutivo+
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
//Mostrar Loader
  mostrarLoader();
console.log('BUSQUEDA CONTENEDOR PARAMETROS\n '+params);
 localStorage.setItem('parametrosBusquedaContenedor', params);

  fetch(env.API_URL + "verificadordecontenedores" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
         detalleLineasContenedoreses=result.respuesta; 
        if (result.respuesta.length != 0) {
          armarTablaLectura(detalleLineasContenedoreses);
          guardarTablaEnArray();  
          armarTablaVerificacion(detalleLineasContenedoreses);
          console.log('REsultados:');
          console.log(detalleLineasContenedoreses);
        }else{
          Swal.fire({
            icon: "info",
            title: "Información",            
            text: "No hay registros asignados para el usuario",
            confirmButtonColor: "#28a745",
          });
        }
        document.getElementById("carga").innerHTML = "";        
      }
      else {
        Swal.fire({
            icon: "error",
            title: "error",            
            text: "Se registro un error en la aplicación",
            confirmButtonColor: "#28a745",
          });
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
function limpiarTblLectura() {
  const tabla = document.getElementById("myTableLectura");

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
/////////                       LECTURA Y VERIFICACION                          ////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////// ARMA LA TABLA LECTURA ///////////////////////////////////////////////////////////
function armarTablaLectura(detalleLineasContenedor) {
    var tbody = document.getElementById('tblbodyLectura');  
 
    tbody.classList.add("display", "centered");

    tbody.innerHTML = '';

    detalleLineasContenedor.forEach(function (detalle) {
        if (detalle.Cant_leida != null && detalle.Cant_leida !== "") { 
            if(detalle.Cant_leida!=0){
            var newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>
                    <span style="display: block; text-align: center;">${detalle.Articulo}</span>
                </td>
                <td class="codigo-barras-cell" style="text-align: center;">
                    <input id="codigo-barras" type="text" class="codigo-barras-input" value="${detalle.Codigo_Barra || ''}" onchange="validarCodigoBarras(this)" autofocus>
                </td>
                <td class="codigo-barras-cell2" style="text-align: center;">
                    <input id="cant-pedida" style="text-align: center;" type="text" class="codigo-barras-input" value="${detalle.Cant_leida || ''}" onchange="guardarTablaEnArray(this)">
                </td>
                <td class="codigo-barras-cell2" style="text-align: center;">
                <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i>
                </td>
            `;
            tbody.appendChild(newRow);
            }         
        }
    });
    guardarTablaEnArray();
    crearNuevaFila();
}
//////////     FUNCIONES PARA LA PESTAÑA LECTURA - VALIDA EL CODIGO LEIDO   ///////////////////////
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
        const articulo = item.Articulo ? item.Articulo.toUpperCase() : '';
        const codigoBarra = item.Codigo_Barra ? item.Codigo_Barra.toUpperCase() : '';
            if (articulo === codbarra || codigoBarra === codbarra) {
                span.textContent = item.Articulo;
                cantFila.value = 1;            
                input.setAttribute('readonly', 'readonly');            
                crearNuevaFila();
                guardarTablaEnArray();
                return true; 
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
///////////////   Funcion que crea la nueva fila en la pestaña lectura ////////////////
function crearNuevaFila() {
  const tableBody = document.querySelector('#tblbodyLectura');
 
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
///////////////////////FUNCION QUE AGRUPA EL DATA ARRAY CON LAS LECTURAS DEL PEDIDO/////////////////////////
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
/////// Funcion que elimina filas en la pestaña lectura  //////////////////////////////////////////////////
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
           <td id="solicitud" hidden>${detalle.Traslado}</td>        
           <td id="contenedor" style="text-align: left;">${detalle.Contenedor}</td>
           <td id="articulo"><h5  id="verifica-articulo"><span class="blue-text text-darken-2">${detalle.Articulo}</span></h5><h6 style="text-align:left; vertical-align:middle;" >${detalle.Descripcion}</h6></td>           
           <td id="cantidadPedida" style="text-align: left;">${isNaN(parseFloat(detalle.Cant_Pedida)) ? 0 : parseFloat(detalle.Cant_Pedida).toFixed(2)}</td>        
           <td id="cantidadPreparada" style="text-align: left;">${isNaN(parseFloat(detalle.Cant_Verificada)) ? 0 : parseFloat(detalle.Cant_Verificada).toFixed(2)}</td>
           <td id="cantidadLeida" style="text-align: left;"></td> <!-- Cantidad leída, inicialmente en blanco --> 
           <td id="verificado" style="text-align: left;"></td>            
        `;
        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(newRow);
    });
}
 //FUNCION QUE VERIFICA LAS COINCIDENCIAS,TOMA LOS VALORES DE LAS CANTIDADES
// POR ARTICULO, COMPARA LO QUE TIENE EL ARRAY DEL LS Y VERIFICA LAS COINCIDENCIAS, PARA MOSTRARLO EN LA PESTAÑA VERIFICACION
function verificacion() {

var dataArray = JSON.parse(localStorage.getItem('dataArray'));

    // Obtener la tabla verificacion por su ID
    const tabla = document.getElementById('tblcontenedores');

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
               // console.log(`✅ Coincidencia encontrada para ${resultado.ARTICULO}`);
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
                     const celdaARTICULO = fila.querySelector('h5');
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
              // console.log(`❌ No encontrado: ${resultado.ARTICULO}`);
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
                     const celdaARTICULO = fila.querySelector('h5');
                     // Verificar si la celda contiene el mismo valor que resultado.ARTICULO en la fila correspondiente
                     if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO) {
                         // Encontrar la celda con el id "verificado"
                         const celdaVerificado = fila.querySelector('#verificado');                  
                         // Encuentra la celda de "CANT VERIF" en cada fila segun el codigo del artículo
                         const cantPedida = fila.querySelector('#cantidadPreparada');
                         const cantidadVerificadaCell = fila.querySelector('#cantidadLeida');
                        //  console.log("OPERACION:");   
                        //  console.log(cantPedida );
                        //  console.log(cantidadVerificadaCell);
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
                    
             }
         }
     });     
     localStorage.setItem("mensajes", JSON.stringify(mensajesArray));

    //  const celdaVacia = columnaEstaVacia();
    //     celdaVacia ?null: mostrarMensajesLocalStorage();


 }//FIN DE VERIFICACION
function inicializarBotones() {
    // Crear los botones y el contenedor
    const contenedorBotones = document.createElement('div');
    const botonProcesar = document.createElement('button');
    const botonGuardarParcial = document.createElement('button');

    // Configurar propiedades de los botones
    botonProcesar.textContent = 'Crear Paquete';
    botonProcesar.id = 'btnProcesar';
    botonProcesar.hidden = false;
    botonProcesar.onclick = confirmaProcesar; // Agregar onclick

    botonGuardarParcial.textContent = 'Guardar';
    botonGuardarParcial.id = 'btnGuardar';  
    botonGuardarParcial.hidden = false; 
    botonGuardarParcial.onclick = confirmarGuardadoParcial; // Agregar onclick

    // Aplicar estilos al botón de guardado parcial
    botonGuardarParcial.style.backgroundColor = '#28a745';
    botonGuardarParcial.style.borderRadius = '5px';
    botonGuardarParcial.style.color = 'white';
    botonGuardarParcial.style.marginTop = '16px';
    botonGuardarParcial.style.marginLeft = '16px';
    botonGuardarParcial.style.marginRight = '16px';
    botonGuardarParcial.style.height = '36px';
    botonGuardarParcial.style.width = '100px';

    // Aplicar estilos al botón de Procesar
    botonProcesar.style.width = '100px';
    botonProcesar.style.backgroundColor = '#28a745';
    botonProcesar.style.borderRadius = '5px';
    botonProcesar.style.color = 'white';
    botonProcesar.style.marginTop = '16px';
    botonProcesar.style.marginLeft = '6em';
    botonProcesar.style.height = '40px';
    botonProcesar.style.marginbottom = '25px';

    // Agregar botones al contenedor
    contenedorBotones.appendChild(botonGuardarParcial);
    contenedorBotones.appendChild(botonProcesar);
   

    // Obtener tabla de verificación
    const tablaVerificacion = document.getElementById('tblcontenedores');

    // Insertar contenedor de botones después de la tabla de verificación
    tablaVerificacion.parentNode.insertBefore(contenedorBotones, tablaVerificacion.nextSibling);

      // Media query para pantallas grandes
      const mediaQuery = window.matchMedia('(min-width: 64em)');
      if (mediaQuery.matches) {
          // Aplicar estilos específicos para pantallas grandes
          botonGuardarParcial.style.marginLeft = '200px';
          botonProcesar.style.marginLeft = '500px';
      }
}
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
///////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion de confirmación del guardado parcial
 function confirmarGuardadoParcial() {
    Swal.fire({
        icon: 'info',
        title: '¿A continuación se guardaran los datos leidos de la pestaña verificación...?',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
    }).then((result) => {
        if (result.isConfirmed) {
            guardaParcialMente();
        //    Swal.fire({
        //     icon: 'info',
        //     title: 'Guardado',
        //     text: 'Cuardando...'
        //   });
        }
    });
}
//FUNCION DE GUARDADO PARCIAL
function guardaParcialMente() {
        //var dataArray = JSON.parse(localStorage.getItem('dataArray'));
        let pSistema = "WMS";        
        let pUsuario = localStorage.getItem('username');
        let pOpcion = "L";
        let pBodegaOrigen= document.getElementById("bodega").value;
        let pBodegaDestino =document.getElementById("bodegaSelectOC").value;
        //let pBodegaDestino ="B-04";
        let pFecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD   
        let pPlaca = document.getElementById("placa-camion").value;     
        //let pPlaca= "447537";
        let pReferencia="Ref o null";
        let pComentario="Comentario o null";
        
            // Array para almacenar todas las cantidades y artículos
            var detalles = [];
       
                            // Obtener la tabla
                    let table = document.getElementById("tblcontenedores");

                    // Iterar sobre las filas de la tabla (excluyendo el encabezado)
                    for (let i = 1; i < table.rows.length; i++) {
                        let row = table.rows[i];

                          // Obtener el consecutivo del contenedor
                        let contenedor = row.querySelector("#contenedor").textContent.trim() || 0;

                         // Obtener lasolicitud
                        let solicitud = row.querySelector("#solicitud").textContent.trim() || 0;
                        
                        // Obtener el valor del artículo
                        let articulo = row.querySelector("#verifica-articulo span").textContent.trim();
                        
                        // Obtener la cantidad pedida
                        let cantidadPedida = row.querySelector("#cantidadPedida").textContent.trim();
                         // Obtener la cantidad pedida
                        let cantidadPreparada = row.querySelector("#cantidadPreparada").textContent.trim();
                        
                        // Obtener la cantidad leída
                        let cantidadLeida = row.querySelector("#cantidadLeida").textContent.trim() || 0;

                        if (isNaN(cantidadLeida) || cantidadLeida == undefined || cantidadLeida == null || cantidadLeida == "") {
                              cantidadLeida = 0;
                          }
                            // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
                            var detalle = {
                                CONTENEDOR: contenedor,
                                SOLICITUD: solicitud,
                                ARTICULO: articulo,
                                CANT_CONSEC: cantidadPedida,
                                CANT_PREPARADA: cantidadPreparada,
                                CANT_LEIDA: cantidadLeida                               
                            };
                           // Agregar el objeto al array
                            detalles.push(detalle);
                    }
                    //Convertir el array de objetos a formato JSON
                    var jsonPaquete = JSON.stringify(detalles);
                    //console.log("jsonPaquetes:\n"+jsonPaquete);

        const params =
        "?pSistema="+
        pSistema+
        "&pUsuario=" +
        pUsuario +
        "&pOpcion="+
        pOpcion+
        "&pBodegaOrigen="+
        pBodegaOrigen+
        "&pBodegaDestino="+
        pBodegaDestino+
        "&pFecha="+
        pFecha+
        "&pPlaca="+
        pPlaca+
        "&jsonPaquete=" +
        jsonPaquete+
        "&pReferencia="+
        pReferencia+
        "&pComentario="+
        pComentario ; 
         console.log("Params:\n"+params);
          Swal.fire({
                icon: "success",
                title: "Guardando...:",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6e7881",
            });
        
    
fetch(env.API_URL + "guardacreapaquete" + params, myInit)
 .then((response) => response.json())     
  .then((result) => {  
    console.log("Respuesta del SP");
    console.log(result.respuesta);      
    if (result.msg === "SUCCESS") {
      if (result.respuesta.length != 0) {           
        Swal.fire({
            icon: "success",
            title: "Datos guardados correctamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6e7881",
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirecciona a tu otra vista aquí
               // window.location.href = 'BusquedaDeContenedores.html';                 
            }
        });
      }          
    } 
    else{            
    }
  });      
    
}//fin fn   
///////FUNCION PARA PROCESAR//////       
function confirmaProcesar() {   
    Swal.fire({
        icon: 'warning',
        title: '¿Desea crear el paquete?',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
    }).then((result) => {
        if (result.isConfirmed) {
          // Verificar si todas las celdas de verificación están marcadas
          if(validarVerificacion()) {
            // Si todas están marcadas, procesar el contenedor
             localStorage.removeItem("UsuarioAutorizacion");
             procesarContenedor();
        } else {
                Swal.fire({
                title: "Ingrese sus credenciales",
                html:
                '<input id="swal-input1" class="swal2-input" placeholder="Usuario" autocomplete="off">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Contraseña" type="password" autocomplete="off">',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Aprobar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6e7881",
                preConfirm: () => {
                    const usuario = document.getElementById('swal-input1').value.toUpperCase();
                    const contraseña = document.getElementById('swal-input2').value;
                    return { usuario: usuario, contraseña: contraseña };
                }
            }).then((result) => {
                if (!result.isDismissed && result.value && result.value.usuario && result.value.contraseña) {
                    fetch(env.API_URL + "wmsautorizacioncontenedor")
                    .then((response) => response.json())     
                    .then((resultado) => {    
                        // console.log('Autorizacion Resultado: ');
                        // console.log(resultado.respuesta);      
                        const respuesta = resultado.respuesta[0];
                        if (respuesta && respuesta.USUARIO === result.value.usuario && respuesta.PIN === result.value.contraseña) {
                            // console.log("Credenciales válidas");
                            // console.log(respuesta.USUARIO);
                            localStorage.setItem('UsuarioAutorizacion',respuesta.USUARIO);
                            // Realiza la acción deseada, como procesar el contenedor
                           procesarContenedor();
                        } else {
                            // console.log("Credenciales inválidas");
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Credenciales inválidas'
                            });
                        }
                    }).catch((error) => {
                        // console.error('Error al obtener los datos del API:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo obtener los datos del API'
                        });
                    }); 
                } else {
                    // console.error('Error: No se pudieron obtener los valores de usuario y contraseña del Swal');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron obtener los valores de usuario y contraseña del Swal'
                    });
                }
            });
            }
                
            
        }
    });
}   
// FUNCION PARA CREAR EL PAQUETE
// procesar quemado para priuebas
function procesarContenedor() {
        let result = "TRAS81-0000031086";        
       if (result.toUpperCase().startsWith("TRAS")) {
                console.log("Respuesta del API:\n" + result);
                Swal.fire({
                            icon: "success",
                            title: "Se creó el paquete N° " + result+ " con éxito",
                            showDenyButton: true,                // <- activamos botón extra
                            confirmButtonText: "Aceptar",
                            denyButtonText: "Imprimir",
                            confirmButtonColor: "#28a745",       // verde aceptar
                            denyButtonColor: "#007bff",          // azul imprimir
                            cancelButtonColor: "#6e7881",
                        }).then((resultSwal) => {
                            if (resultSwal.isConfirmed) {
                            //   location.reload();               // recarga página
                            } else if (resultSwal.isDenied) {
                                imprimirPaqueteReporte(result);        // llama tu función
                                limpiarResultadoGeneral();
                               // location.reload(); 
                            }
                        });           
                }
}

// function procesarContenedor() {
//         let pSistema = "WMS";        
//         let pUsuario = localStorage.getItem('username');
//         let pOpcion = "R";
//         let pBodegaOrigen= document.getElementById("bodega").value;
//         let pBodegaDestino =document.getElementById("bodegaSelectOC").value;
//         //let pBodegaDestino ="B-04";
//         let pFecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD   
//         let pPlaca = document.getElementById("placa-camion").value;     
//         //let pPlaca= "447537";
//         let pReferencia="Ref o null";
//         let pComentario="Comentario o null";
        
//             // Array para almacenar todas las cantidades y artículos
//             var detalles = [];
       
//                             // Obtener la tabla
//                     let table = document.getElementById("tblcontenedores");

//                     // Iterar sobre las filas de la tabla (excluyendo el encabezado)
//                 for (let i = 1; i < table.rows.length; i++) {
//                         let row = table.rows[i];

//                           // Obtener el consecutivo del contenedor
//                         let contenedor = row.querySelector("#contenedor").textContent.trim() || 0;

//                          // Obtener lasolicitud
//                         let solicitud = row.querySelector("#solicitud").textContent.trim() || 0;
                        
//                         // Obtener el valor del artículo
//                         let articulo = row.querySelector("#verifica-articulo span").textContent.trim();
                        
//                         // Obtener la cantidad pedida
//                         let cantidadPedida = row.querySelector("#cantidadPedida").textContent.trim();
//                          // Obtener la cantidad pedida
//                         let cantidadPreparada = row.querySelector("#cantidadPreparada").textContent.trim();
                        
//                         // Obtener la cantidad leída
//                         let cantidadLeida = row.querySelector("#cantidadLeida").textContent.trim() || 0;

//                         if (isNaN(cantidadLeida) || cantidadLeida == undefined || cantidadLeida == null || cantidadLeida == "") {
//                               cantidadLeida = 0;
//                           }
//                             // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
//                         var detalle = {
//                                 CONTENEDOR: contenedor,
//                                 SOLICITUD: solicitud,
//                                 ARTICULO: articulo,
//                                 CANT_CONSEC: cantidadPedida,
//                                 CANT_PREPARADA: cantidadPreparada,
//                                 CANT_LEIDA: cantidadLeida                               
//                             };
//                            // Agregar el objeto al array
//                             detalles.push(detalle);
//                     }
//                     //Convertir el array de objetos a formato JSON
//                 var jsonPaquete = JSON.stringify(detalles);
//                     //console.log("jsonPaquetes:\n"+jsonPaquete);

//         const params =
//         "?pSistema="+
//         pSistema+
//         "&pUsuario=" +
//         pUsuario +
//         "&pOpcion="+
//         pOpcion+
//         "&pBodegaOrigen="+
//         pBodegaOrigen+
//         "&pBodegaDestino="+
//         pBodegaDestino+
//         "&pFecha="+
//         pFecha+
//         "&pPlaca="+
//         pPlaca+
//         "&jsonPaquete=" +
//         jsonPaquete+
//         "&pReferencia="+
//         pReferencia+
//         "&pComentario="+
//         pComentario ; 
//          console.log("Params:\n"+params);
//         fetch(env.API_URL + "guardacreapaquete" + params, myInit)
//         .then((response) => response.json())
//         .then((result) => {
//             console.log("Respuesta del SP");
//             console.log(result.respuesta);
//         if (result.msg === "SUCCESS") {
//             if (result.respuesta.length != 0) {
//                 let respuesta=result.respuesta[0].Respuesta;
//                 console.log("Respuesta del API:\n" + result.respuesta[0].Respuesta);
//                 if (result.respuesta[0].Respuesta.toUpperCase().startsWith("TRAS")) {
//                     Swal.fire({
//                                 icon: "success",
//                                 title: "Se creó el paquete N° " + respuesta+ " con éxito",
//                                 showDenyButton: true,                
//                                 confirmButtonText: "Aceptar",
//                                 denyButtonText: "Imprimir",
//                                 confirmButtonColor: "#28a745",       
//                                 denyButtonColor: "#007bff",          
//                                 cancelButtonColor: "#6e7881",
//                             }).then((resultSwal) => {
//                                 if (resultSwal.isConfirmed) {
//                                 //location.reload();               
//                                 } else if (resultSwal.isDenied) {
//                                     imprimirPaqueteReporte(respuesta);
//                                     limpiarResultadoGeneral();    
//                                     limpiarMensajes();    
//                                     //location.reload(); 
//                                 }
//                                 });                
//                 }else{
//                        Swal.fire({
//                             icon: "error",                                                      
//                             title: result.respuesta[0].Respuesta,
//                             confirmButtonText: "Aceptar",                           
//                             confirmButtonColor: "#28a745",
//                         })
//                 }
//             }else{
//                 console.log("El API no devolvio nada");
//             }
//          } else {
//             }
//         }); 
// }

// FUNCION PARA VERIFICAR EL CHECK EN LA COLUNA DE VERIFICACO

function validarVerificacion() {
    // Obtener todas las celdas de verificación
    var celdasVerificacion = document.querySelectorAll('#tblbodyLineasContenedor td#verificado');
    // Iterar sobre cada celda de verificación
    for (var i = 0; i < celdasVerificacion.length; i++) {
        // Obtener el span dentro de la celda
        var spanVerificacion = celdasVerificacion[i].querySelector('span.material-icons');
        // Verificar si el span no está presente o su contenido no es 'done_all'
        if (!spanVerificacion || spanVerificacion.textContent !== 'done_all') {
            // Si encuentra una celda sin verificar, retorna false
            return false;
        }
    } 
    // Si todas las celdas están verificadas, retorna true
    return true;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function columnaEstaVacia() {
    // Selecciona todas las celdas con id "cantidadLeida" dentro del cuerpo de la tabla
    var celdasCantidadLeida = document.querySelectorAll('#tblbodyLineasContenedor td#cantidadLeida');

    // Recorremos cada celda y verificamos si alguna tiene contenido
    for (var i = 0; i < celdasCantidadLeida.length; i++) {
        if (celdasCantidadLeida[i].textContent.trim() !== '') {
            return false; // Al menos una celda tiene datos
        }
    }

    return true; // Todas las celdas están vacías
}   
/////// Llamar a la función para cargar y mostrar los mensajes desde el localStorage al cargar la página
window.onload = function() {
   inicializarBotones();
    guardarTablaEnArray();      
};
function permisoCrearPaquete(){
   let user = sessionStorage.getItem('user')?.trim() || '';
       user = user.replace(/^["'](.*)["']$/, '$1');

    if(user==="JOSENAVA"){
        Swal.fire({
              icon: 'info',
              title: 'Permisos',
              text:"permiso consedido",
              showCancelButton: true,
              confirmButtonText: 'Continuar',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#6e7881",
            })
    }else{
            Swal.fire({
              icon: 'info',
              title: 'Ñagare',
              text:"permiso  no consedido",
              showCancelButton: true,
              confirmButtonText: 'Continuar',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#6e7881",
            });
    }
      
}

async function imprimirPaqueteReporte(respuesta) {
    let pSistema = "WMS";        
    let pUsuario = localStorage.getItem('username');
    let pTipoConsulta = "l";
    let pPaquete = respuesta;

    const params =
        "?pSistema=" + pSistema +
        "&pUsuario=" + pUsuario +
        "&pTipoConsulta=" + pTipoConsulta +        
        "&pPaquete=" + pPaquete;

    console.log("Params:\n" + params);

    // const response = await fetch(env.API_URL + "imprimepaquete" + params, myInit);
    // const result = await response.json();
fetch(env.API_URL + "imprimepaquete" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
    if (result.msg === "SUCCESS" && result.respuesta.length > 0) {
        console.log("REPORTE CREACION DE PAQUETE", result.respuesta);

        // Crear PDF (p = portrait / vertical)
        const { jsPDF } = window.jspdf;
            const doc = new jsPDF("P", "pt", "a4");
        // const doc = new jsPDF("landscape", "pt", "a4");

        // Encabezado
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("CREACIÓN DE PAQUETES", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("PAQUETE: " + pPaquete, doc.internal.pageSize.getWidth() / 2, 60, { align: "center" });

        doc.setFontSize(12);        
        doc.text("Camión: " + (result.respuesta[0].REFERENCIA || "N/A"), 40, 90);

        // Definir columnas (encabezados)
        const columnas = [           
            "ARTÍCULO",  
            "CÓDIGO\nBARRAS",         
            "CANT\nSOLI",
            "CANT\nPREP.",
            "CANT\nVERIF.",  
            "CONSECUTIVO\nCONTENEDOR",
            "FECHA\nCREACIÓN"           
        ];

        // Mapear los datos a filas
        const filas = result.respuesta.map(item => [           
            `${item.articulo}\n${item.descripcion}`,        
            item.Codigo_Barra,
            item.LineaConsecutivo,           
            item.LineaAprobada,
            item.LineaVerificada,    
            item.Contenedor,                    
            item.Fecha_Aplicacion                     
        ]);

                // Generar tabla debajo del encabezado
                    doc.autoTable({
                    head: [columnas],
                    body: filas,
                    startY: 140,
                    styles: { fontSize: 8, cellWidth: "wrap" }, 
                    headStyles: { fillColor: [40, 167, 69] },
                    tableWidth: "auto",     
                    columnStyles: {0: { cellWidth: 120 },}
                    });

            // doc.autoTable({
            //     head: [columnas],
            //     body: filas,
            //     startY: 140,
            //     styles: { fontSize: 8, cellWidth: "wrap" },
            //     headStyles: { fillColor: [40, 167, 69] },
            //     tableWidth: "auto"
            // });

            console.log("Se generó el pdf");

// Descargar PDF
       doc.save("Reporte_Paquete_" + pPaquete + ".pdf");       

    } else {
        console.log("El API no devolvió nada");
    }
});
}


