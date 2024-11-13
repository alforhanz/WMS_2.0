//Variable global que contiene el detalle del pedido
var detallePedidoList = "";

document.addEventListener("DOMContentLoaded", function () {

  //inicializarBotones();
  //--------------------------------------------------------------------------
  if (localStorage.getItem("documento")) {
    var documento = localStorage.getItem("documento");
    var pedido = localStorage.getItem("pedidoSelect");
    let estado = localStorage.getItem("estado");
    //---------------------------------------------------------------------------
    cargarDetallePedido(documento, pedido, estado);
    localStorage.removeItem("dataArray");//borra los elementos leidos del localstorage.

  } else {
    window.location = "index.html";
  }
});

function cargarDetallePedido(documento, pedido, estado) {
  // Concatena la variable con texto y asigna el valor al label documento y pedido
  document.getElementById("documento").innerHTML = "Documento: " + documento;
  document.getElementById("pedido").innerHTML = "Pedido: " + pedido;
  document.getElementById("estadoPedido").innerHTML = "Estado: " + estado;

  const pPedido = pedido;//Se asigna el número del peddido a una variable constante para pasarlo como parametro
  const params =
    "?pPedido=" +
    pPedido;

  fetch(env.API_URL + "wmsverificacionpedidos/D" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.lineaspedido.length != 0) {
          detallePedidoList = result.lineaspedido;
          armarTablaVerificacion(detallePedidoList);       
          armarTablaLectura(detallePedidoList);
        }
        document.getElementById("carga").innerHTML = "";
      }
    });
}

function armarTablaLectura(detallePedidoList) {
  var tbody = document.getElementById("tblbodyLectura");
  var estadoPreparacion = localStorage.getItem("EstadoPreparacion");
      if(estadoPreparacion === "A"){
                    tbody.innerHTML = "";
                  var newRow = document.createElement("tr");
                  newRow.innerHTML = `
                                            <td>
                                                <span></span>
                                            </td>
                                            <td class="codigo-barras-cell">
                                                <input id="codigo-barras" type="text" class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" autofocus>
                                            </td>
                                            <td class="codigo-barras-cell2">
                                                <input id="cant-pedida" type="text" class="codigo-barras-input" value="" onchange="guardarTablaEnArray(this)" style="
                                                text-align: center;">
                                            </td>
                                            <td class="codigo-barras-cell2">
                                                <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i>
                                            </td>
                                        `;
                  tbody.appendChild(newRow);
                  guardarTablaEnArray();
      }else{
            if(estadoPreparacion != "P"){
                  tbody.innerHTML = "";
                  var newRow = document.createElement("tr");
                  newRow.innerHTML = `
                                                <td>
                                                    <span></span>
                                                </td>
                                                <td class="codigo-barras-cell">
                                                    <input id="codigo-barras" type="text" class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" autofocus disabled>
                                                </td>
                                                <td class="codigo-barras-cell2">
                                                    <input id="cant-pedida" type="text" class="codigo-barras-input" value="" onchange="guardarTablaEnArray(this)" style="
                                                    text-align: center;" disabled>
                                                </td>
                                                <td class="codigo-barras-cell2">
                                                    <i class="material-icons red-text" style="cursor: pointer;">clear</i>
                                                </td>
                                            `;
                  tbody.appendChild(newRow);
            }else{
              tbody.innerHTML = "";

              detallePedidoList.forEach(function (detalle) {
                if (
                  detalle.CANTIDAD_VERIFICADA != null &&
                  detalle.CANTIDAD_VERIFICADA !== ""
                ) {
                  var newRow = document.createElement("tr");
                  newRow.innerHTML = `
                                  <td>
                                      <span>${detalle.ARTICULO}</span>
                                  </td>
                                  <td class="codigo-barras-cell">
                                      <input id="codigo-barras" type="text" class="codigo-barras-input" value="${
                                        detalle.CODIGO_BARRA || ""
                                      }" onchange="validarCodigoBarras(this)" autofocus readonly>
                                  </td>
                                  <td class="codigo-barras-cell2">
                                      <input id="cant-pedida" type="text" class="codigo-barras-input" value="${
                                        detalle.CANTIDAD_VERIFICADA || ""
                                      }" onchange="guardarTablaEnArray(this)" style="
                                      text-align: center;" readonly>
                                  </td>
                                  <td class="codigo-barras-cell2">
                                      <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i>
                                  </td>
                              `;
                  tbody.appendChild(newRow);
                }
              });
              verificacion();
            }
      }
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
    if ((pedidoList[i].ARTICULO && pedidoList[i].ARTICULO.toUpperCase() === codbarra) || (pedidoList[i].CODIGO_BARRA && pedidoList[i].CODIGO_BARRA.toUpperCase() === codbarra)) {
      span.textContent = pedidoList[i].ARTICULO;
      cantFila.value = 1;

      // Bloquear la celda del código de barras
      input.setAttribute('readonly', 'readonly');

      // Aquí se genera una fila nueva vacía
      crearNuevaFila();

      // Llamar función que guarda artículos en la tabla
      guardarTablaEnArray();


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
        <td class="sticky-column" style="user-select: none;"> 
            <span display: inline-block;"></span>
        </td>
        <td class="codigo-barras-cell">
            <input type="text" id="codigo-barras" class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" writingsuggestions="true" autofocus>
        </td>
        <td class="codigo-barras-cell2">
            <input id="cant-pedida" type="text" class="codigo-barras-input" value="" onchange="validarCantidadPedida(this)" style="text-align: center"; writingsuggestions="true">
        </td>
        <td class="codigo-barras-cell2">
            <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i>
        </td>
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
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#28a745",

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

///FUNCIÓN QUE ARMA LA TABLA DE LA PESTAÑA VERIFICACIÓN
function armarTablaVerificacion(detallePedidoList) {

  // Obtener la referencia del cuerpo de la tabla
  var tbody = document.getElementById('tblbodyVerificacion');

  // Limpiar el contenido actual del cuerpo de la tabla
  tbody.innerHTML = '';

  // Obtener la referencia del label cantidadDeRegistros
  var cantidadDeRegistrosLabel = document.getElementById('cantidadDeRegistros');
  // Actualizar el texto del label con la cantidad de registros
  cantidadDeRegistrosLabel.textContent = 'Cantidad de registros: ' + detallePedidoList.length;

  // Iterar sobre cada elemento en detallePedidoList
  detallePedidoList.forEach(function (detalle) {

    // Crear una nueva fila
    var newRow = document.createElement('tr');

    // Verificar si la columna CANTIDAD_PREPARADA es mayor a cero
    var cantidadLeida = '';
    if (parseFloat(detalle.CANTIDAD_PREPARADA) > 0) {
      cantidadLeida = parseFloat(detalle.CANTIDAD_PREPARADA).toFixed(2);
    }

    // Construir el contenido de la fila usando variables HTML
    newRow.innerHTML = `
      <td id="articulo"><h5 id="verifica-articulo"><span class="blue-text text-darken-2">${detalle.ARTICULO}</span></h5><h6>${detalle.DESCRIPCION}</h6></td>
      <td id="codigoDeBarras">${detalle.CODIGO_BARRA || ''}</td>
      <td id="cantidadPedida">${isNaN(parseFloat(detalle.CANTIDAD_PEDIDA)) ? 0 : parseFloat(detalle.CANTIDAD_PEDIDA).toFixed(2)}</td>
      <td id="cantidadPickin">${isNaN(parseFloat(detalle.CANTIDAD_VERIFICADA)) ? 0 : parseFloat(detalle.CANTIDAD_VERIFICADA).toFixed(2)}</td>
      <td id="cantidadLeida">${cantidadLeida}</td> <!-- Mostrar el valor de CANTIDAD_PREPARADA si es mayor a 0 -->
      <td id="verificado"></td> 
      <td id="articulosEliminado" hidden>${detalle.ARTICULO_ELIMINADO}</td> 
    `;

    // Agregar la fila al cuerpo de la tabla
    tbody.appendChild(newRow);
  });

  //verificacion();
}

function limpiarMensajes() {
  localStorage.removeItem("mensajes");
  const mensajeTextArea = document.getElementById('mensajeText');
  mensajeTextArea.value = '';
  // Limpiar la variable 'mensajes' del localStorage
  guardarTablaEnArray();
}


//FUNCION QUE VERIFICA LAS COINCIDENCIAS,TOMA LOS VALORES DE LAS CANTIDADES
// POR ARTICULO, COMPARA LO QUE TIENE EL ARRAY DEL LS Y VERIFICA LAS COINCIDENCIAS, PARA MOSTRARLO EN LA PESTAÑA VERIFICACION

function verificacion() {
  var dataArray = JSON.parse(localStorage.getItem('dataArray')); 
  var cantidadesTotales = {};
  var resultadoArray = [];
  dataArray.forEach(function (item) {
    var articulo = item.ARTICULO;
    var cantidad = item.CANTIDAD_LEIDA;

    if (cantidadesTotales[articulo]) {
      cantidadesTotales[articulo] += cantidad;
    } else {
      cantidadesTotales[articulo] = cantidad;
    }

    if (cantidadesTotales[articulo] === cantidad) {
      resultadoArray.push(item);
      delete cantidadesTotales[articulo];
    }
  });

  for (var articulo in cantidadesTotales) {
    resultadoArray.push({
      ARTICULO: articulo,
      CANTIDAD_LEIDA: cantidadesTotales[articulo]
    });
  }

  var pedidoList = detallePedidoList;
  const mensajesArray = [];
  let contadorMensajes = 1; // Contador para los mensajes

  resultadoArray.forEach(resultado => {
    const pedido = pedidoList.find(pedido => pedido.ARTICULO === resultado.ARTICULO && parseFloat(pedido.CANTIDAD_PEDIDA) === parseFloat(resultado.CANTIDAD_LEIDA));

    if (pedido) {
      const tabla = document.getElementById('myTableVerificacion');
      if (tabla) {
        const tbody = tabla.querySelector('tbody');
        const filas = tbody.querySelectorAll('tr');

        filas.forEach(fila => {
          const celdaARTICULO = fila.querySelector('h5');
          if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO) {
            const celdaVerificado = fila.querySelector('#verificado');
            if (celdaVerificado) {
              celdaVerificado.textContent = '';
              const spanVerificacion = document.createElement('span');
              spanVerificacion.classList.add('material-icons');
              spanVerificacion.textContent = 'done_all';
              spanVerificacion.style.color = 'green';
              celdaVerificado.appendChild(spanVerificacion);
            }
            const cantidadVerificadaCell = fila.querySelector('#cantidadLeida');
            if (cantidadVerificadaCell) {
              cantidadVerificadaCell.textContent = resultado.CANTIDAD_LEIDA;
            }
          }
        });
      }
    } else {
      const tabla = document.getElementById('myTableVerificacion');
      if (tabla) {
        const tbody = tabla.querySelector('tbody');
        const filas = tbody.querySelectorAll('tr');

        filas.forEach(fila => {
          const celdaARTICULO = fila.querySelector('h5');
          if (celdaARTICULO && celdaARTICULO.textContent === resultado.ARTICULO) {
            const celdaVerificado = fila.querySelector('#verificado');
            const cantPedida = fila.querySelector('#cantidadPedida');
            const cantidadVerificadaCell = fila.querySelector('#cantidadLeida');

            if (parseFloat(resultado.CANTIDAD_LEIDA) > parseFloat(cantPedida.textContent)) {
              var resultadoOperacion = '+' + (resultado.CANTIDAD_LEIDA - parseFloat(cantPedida.textContent)).toString();
              celdaVerificado.textContent = resultadoOperacion;
              const mensaje = `${contadorMensajes}. La cantidad verificada del artículo ${resultado.ARTICULO} es mayor a la solicitada.`;
              mensajesArray.push(mensaje);
              contadorMensajes++; // Incrementar el contador
            } else if (resultado.CANTIDAD_LEIDA < parseFloat(cantPedida.textContent)) {
              var resultadoOperacion = (resultado.CANTIDAD_LEIDA - parseFloat(cantPedida.textContent)).toString();
              celdaVerificado.textContent = resultadoOperacion;
              const mensaje = `${contadorMensajes}. La cantidad verificada del artículo ${resultado.ARTICULO} es menor a la solicitada.`;
              mensajesArray.push(mensaje);
              contadorMensajes++; // Incrementar el contador
            }
            if (cantidadVerificadaCell) {
              cantidadVerificadaCell.textContent = resultado.CANTIDAD_LEIDA;
            }
          }
        });
        localStorage.setItem("mensajes", JSON.stringify(mensajesArray));
      }
    }
  });

  const estadoPedidoElement = document.getElementById("estadoPedido");
  const estadoPedidoText = estadoPedidoElement.textContent;
  const estadoPedidoParts = estadoPedidoText.split(':');
  const estadoPedido = estadoPedidoParts.length > 1 ? estadoPedidoParts[1].trim() : '';
  const procesarHabilitado = todasLasFilasVerificadas();  
  const pedidofinalizado = localStorage.getItem("pedidos_finalizados");
  const guardarParcialHabilitado = activaGuardadoParcial();

  if(pedidofinalizado==="true"){

    if(guardarParcialHabilitado){
      const btnGuardar = document.getElementById('btnGuardar');
      //console.log("activa bonton guardar");
      btnGuardar.removeAttribute('hidden');
    }else{
      btnGuardar.setAttribute('hidden', 'hidden');
    }
    if(procesarHabilitado && estadoPedido === 'F'){
      const btnProcesar = document.getElementById('btnProcesar');
        //console.log("activa btn Procesar");
        btnProcesar.removeAttribute('hidden');
      }else{
        btnGuardar.removeAttribute('hidden');
        btnProcesar.setAttribute('hidden', 'hidden');
      }  
}else{
    const btnRegresar = document.getElementById('btnRegresar');
    console.log("activa btn regresar");
    btnRegresar.removeAttribute('hidden');
}

  
    // if (guardarParcialHabilitado === true) {
    //    			document.getElementById('btnGuardar').setAttribute('hidden', 'hidden');
    //  			} else {
    //    				document.getElementById('btnGuardar').removeAttribute('hidden');
    //  			}
  
    //  		if (procesarHabilitado == true && estadoPedido === 'F'){
    //  				document.getElementById('btnProcesar').removeAttribute('hidden');
    //  			}else {
    //         document.getElementById('btnProcesar').setAttribute('hidden', 'hidden');
    //         } 
            
    //      if(pedidofinalizado){
    //       document.getElementById('btnRegresar').setAttribute('hidden', 'hidden');      
    //       }else{
    //         document.getElementById('btnRegresar').removeAttribute('hidden');            
    //         }   

  //activaDevolverArticulo();
}//Fin de verificacion

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función para verificar si todas las filas tienen el ícono "fa-check" en la columna "CANT VERIF", Y ACTIVAR EL BOTON DE PROCESAR
function todasLasFilasVerificadas() {
  // Obtener todas las filas de la tabla de verificación
  const filas = document.querySelectorAll('#myTableVerificacion tbody tr');

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];

    // Obtener la celda de "CANT VERIF" en la fila actual
    const celdaCantidadVerif = fila.querySelector('td#verificado');

    // Verificar si la celda contiene el ícono "done_all"
    const iconoVerificacion = celdaCantidadVerif.querySelector('span.material-icons');

    // Si no se encuentra el ícono "done_all" en la celda, retornar falso
    if (!iconoVerificacion || iconoVerificacion.textContent !== 'done_all') {
      return false;
    }
  }

  // Si todas las celdas contienen el ícono "done_all", retornar verdadero
  return true;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCION QUE VERIFICA LAS CANTIDASDES LEIDAS Y DEL PEDIDO PÁRA ACTIVAR EL BOTON DE GUARDADO PARCIAL
function activaGuardadoParcial() {
  // Obtener todas las filas de la tabla de verificación
  const filas = document.querySelectorAll('#myTableVerificacion tbody tr');

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];

    // Obtener las celdas de "CANT PEDIDA" y "CANT LEIDA" en la fila actual
    const celdaCantidadPedida = fila.querySelector('td#cantidadPedida');
    const celdaCantidadLeida = fila.querySelector('td#cantidadLeida');

    // Verificar si la cantidad leída es mayor que la cantidad pedida en al menos una fila
    if (parseFloat(celdaCantidadLeida.textContent) > parseFloat(celdaCantidadPedida.textContent)) {
      // Si encontramos una fila donde la cantidad leída es mayor, retornamos true
      return true;
    }
  }
  // Si ninguna fila tiene cantidad leída mayor que cantidad pedida, retornamos false
  return false;
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

// Llama a la función mostrarMensajesLocalStorage cuando se hace clic en la pestaña "Verificación"
document.querySelector('a[href="#tabla-verificacion"]').addEventListener('click', mostrarMensajesLocalStorage);

// function inicializarBotones() {
//   // Crear los botones y el contenedor
//   const pedidofinalizado = localStorage.getItem("pedidos_finalizados");
//   const contenedorBotones = document.createElement('div');
//   const botonProcesar = document.createElement('button');
//   const botonGuardarParcial = document.createElement('button');
//   const botonRegresar = document.createElement('button'); // Crear botón Regresar
 

//   // Configurar propiedades del botón Procesar
//   botonProcesar.textContent = 'Procesar';
//   botonProcesar.id = 'btnProcesar';
//   botonProcesar.hidden = true;
//   botonProcesar.onclick = confirmaProcesar; // Agregar onclick

//   // Configurar propiedades del botón Guardar Parcial
//   botonGuardarParcial.textContent = 'Guardar';
//   botonGuardarParcial.id = 'btnGuardar';
//   botonGuardarParcial.hidden = true;
//   botonGuardarParcial.onclick = confirmarGuardadoParcial; // Agregar onclick

//   // Configurar propiedades del botón Regresar
//   botonRegresar.textContent = 'Regresar';
//   botonRegresar.id = 'btnRegresar';
//   botonRegresar.hidden = false;
//   botonRegresar.onclick = confirmaRegresar;
//   // botonRegresar.onclick = function() {
//   // window.location.href = 'verificacionDePedidos.html';
//   // };

//   // Aplicar estilos al botón de Guardar Parcial
//   botonGuardarParcial.style.backgroundColor = '#28a745';
//   botonGuardarParcial.style.borderRadius = '5px';
//   botonGuardarParcial.style.color = 'white';
//   botonGuardarParcial.style.marginTop = '16px';
//   botonGuardarParcial.style.marginLeft = '16px';
//   botonGuardarParcial.style.marginRight = '16px';
//   botonGuardarParcial.style.height = '36px';

//   // Aplicar estilos al botón de Procesar
//   botonProcesar.style.width = '105px';
//   botonProcesar.style.backgroundColor = '#28a745';
//   botonProcesar.style.borderRadius = '5px';
//   botonProcesar.style.color = 'white';
//   botonProcesar.style.marginTop = '16px';
//   botonProcesar.style.height = '36px';
//   botonProcesar.style.marginbottom = '25px';

//   // Aplicar estilos al botón de Regresar
//   botonRegresar.style.backgroundColor = '#28a745';
//   botonRegresar.style.borderRadius = '5px';
//   botonRegresar.style.color = 'white';
//   botonRegresar.style.marginTop = '16px';
//   botonRegresar.style.marginLeft = '16px';
//   botonRegresar.style.marginRight = '16px';
//   botonRegresar.style.height = '36px';

//   // Agregar botones al contenedor
//   if(pedidofinalizado != 'true'){
//     contenedorBotones.appendChild(botonRegresar);
//   }else{
//     contenedorBotones.appendChild(botonGuardarParcial);
//     contenedorBotones.appendChild(botonProcesar);    
//   }
//   // contenedorBotones.appendChild(botonGuardarParcial);
//   // contenedorBotones.appendChild(botonProcesar);
//   // contenedorBotones.appendChild(botonRegresar); // Agregar botón Regresar al contenedor

//   // Obtener tabla de verificación
//   const tablaVerificacion = document.getElementById('myTableVerificacion');

//   // Insertar contenedor de botones después de la tabla de verificación
//   tablaVerificacion.parentNode.insertBefore(contenedorBotones, tablaVerificacion.nextSibling);
// }

// Llamar a la función para cargar y mostrar los mensajes desde el localStorage al cargar la página


window.onload = function () {
 // inicializarBotones();
  guardarTablaEnArray();
};

function mostrarProcesoEnConstruccion() {
  Swal.fire({
    title: "Proceso en Construcción",
    text: "Esta funcionalidad está en construcción.",
    icon: "info",
    confirmButtonText: "Salir",
    confirmButtonColor: "#28a745",
    //cancelButtonColor: "#6e7881",
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//Funcion de confirmación del guardado parcial
function confirmarGuardadoParcial() {
  Swal.fire({
    icon: 'info',
    title: '¿Desea continuar con el guardado parcial del pedido?',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: "#28a745",
    //cancelButtonColor: "#6e7881",
  }).then((result) => {
    if (result.isConfirmed) {
      guardaParcialMente();
      localStorage.removeItem('mensaje');
    }
  });
}

//FUNCION DE GUARDADO PARCIAL
function guardaParcialMente() {
  //var dataArray = JSON.parse(localStorage.getItem('dataArray'));
  let pUsuario = localStorage.getItem("username");
  var pConsecutivoPed = localStorage.getItem("pedidoSelect");
  //var detalleCantidad = parseFloat(document.querySelector('#myTableVerificacion tbody tr:first-child td:nth-child(3)').innerText);
  var pBodega = document.getElementById("bodega").value;

  // Array para almacenar todas las cantidades y artículos
  var detalles = [];
  localStorage.removeItem("mensajes");
  // Iterar sobre todas las filas de la tabla

  // Iterar sobre las filas de la tabla (excluyendo el encabezado)

      let table = document.getElementById("myTableVerificacion");

      for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];

        // Obtener el valor del artículo
        let articulo = row
          .querySelector("#verifica-articulo span")
          .textContent.trim();

        // Obtener la cantidad pedida
        let cantidadPedida = row
          .querySelector("#cantidadPedida")
          .textContent.trim();

        // Obtener la cantidad leída
        let cantidadLeida =
          row.querySelector("#cantidadLeida").textContent.trim() || 0;

        // if (isNaN(cantidadLeida) || cantidadLeida == undefined || cantidadLeida == null || cantidadLeida == "") {
        //       cantidadLeida = 0;
        //   }

        // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
        var detalle = {
          ARTICULO: articulo,
          CANT_CONSEC: cantidadPedida,
          CANT_LEIDA: cantidadLeida,
        };

        // Agregar el objeto al array
        detalles.push(detalle);
      }
  // $('#myTableVerificacion tbody tr').each(function () {
  //   var articulo = $(this).find('td:first-child').text().trim();
  //   var articulo = $(this).find('h5:first-child').text().trim();
  //   var cantidad = parseFloat($(this).find('td:nth-child(3)').text());
  //   var cantLeida = parseFloat($(this).find('td:nth-child(4)').text());

  //   if (isNaN(cantLeida) || cantLeida == undefined || cantLeida == null || cantLeida == "") {
  //     cantLeida = 0;
  //     // cantLeida = "";
  //   }
  //   // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
  //   var detalle = {
  //     ARTICULO: articulo,
  //     CANT_CONSEC: cantidad,
  //     CANT_LEIDA: cantLeida
  //   };

  //   // Agregar el objeto al array
  //   detalles.push(detalle);
  // });
  // Convertir el array de objetos a formato JSON
  var jsonDetalles = JSON.stringify(detalles);

  //validar la opcion si es BREMEN O NORWING
  var pOpcion = "";
  //  let bodega = localStorage.getItem('BodegaUsuario');
  let bodega = pBodega;
  // Extraer solo el número de la bodega
  let bodegaNumero = bodega.match(/\d+/)[0];
  if (bodegaNumero >= 51 || bodegaNumero === 5) {
    pOpcion = "N";
  } else {
    pOpcion = "B";
  }

  const params =
    "?pUsuario=" +
    pUsuario +
    "&pOpcion=" +
    pOpcion +
    "&pConsecutivoPed=" +
    pConsecutivoPed +
    "&jsonDetalles=" +
    jsonDetalles +
    "&pBodega=" +
    pBodega;

  fetch(env.API_URL + "wmsguardadopicking/G" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.message);
      if (result.msg === "SUCCESS") {
        if (result.pedidoguardado.length != 0) {
          // Resto del código de éxito
          Swal.fire({
            icon: "success",
            title: "Datos guardados correctamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#28a745",
            //cancelButtonColor: "#6e7881",
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirecciona a tu otra vista aquí
              localStorage.setItem("autoSearchPedidos", "true");
              window.location.href = "verificacionDePedidos.html";
            }
          });
        }
      } else {
      }
    });
}//fin fn


//Funcion de confirmación de procesar pedido
function confirmaProcesar() {
  Swal.fire({
    icon: 'warning',
    title: '¿Desea procesar el pedido?',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6e7881",
  }).then((result) => {
    if (result.isConfirmed) {
      procesar();
    }
  });
}

//FUNCION DE Procesar el pedido
function procesar() {
  let pUsuario = localStorage.getItem('username');
  var pConsecutivoPed = localStorage.getItem('pedidoSelect');
  var pBodega = document.getElementById('bodega').value;
  // Array para almacenar todas las cantidades y artículos
  var detalles = [];

// Obtener la tabla
let table = document.getElementById("myTableVerificacion");

// Iterar sobre las filas de la tabla (excluyendo el encabezado)
for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];
    
    // Obtener el valor del artículo
    let articulo = row.querySelector("#verifica-articulo span").textContent.trim();
    
    // Obtener la cantidad pedida
    let cantidadPedida = row.querySelector("#cantidadPedida").textContent.trim();
    
    // Obtener la cantidad leída
    let cantidadLeida = row.querySelector("#cantidadLeida").textContent.trim() || 0;

      // if (isNaN(cantidadLeida) || cantidadLeida == undefined || cantidadLeida == null || cantidadLeida == "") {
      //       cantidadLeida = 0;
      //   }

        // Crear un objeto para cada fila con las propiedades ARTICULO y CANTCONSEC
        var detalle = {
            ARTICULO: articulo,
            CANT_CONSEC: cantidadPedida,
            CANT_LEIDA: cantidadLeida
        };

        // Agregar el objeto al array
        detalles.push(detalle);
}

  // Convertir el array de objetos a formato JSON
  var jsonDetalles = JSON.stringify(detalles);

   //validar la opcion si es BREMEN O NORWING
   var pOpcion = '';
   let bodega = pBodega;
   // Extraer solo el número de la bodega
   let bodegaNumero = bodega.match(/\d+/)[0];
   if(bodegaNumero>=51 || bodegaNumero === 5){       
     pOpcion= 'N';
     }else{
       pOpcion= 'B';
     } 

  const params =
    "?pUsuario=" +
    pUsuario +
    "&pOpcion="+
    pOpcion+
    "&pConsecutivoPed=" +
    pConsecutivoPed +
    "&jsonDetalles=" +
    jsonDetalles +
    "&pBodega=" +
    pBodega;

  fetch(env.API_URL + "wmsguardadopicking/PP" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.message);
      if (result.msg === "SUCCESS") {
        if (result.pedidoprocesado.length != 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Procesado con exito',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6e7881",
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirecciona a tu otra vista aquí
              localStorage.setItem('autoSearchPedidos', 'true'); 
              window.location.href = 'verificacionDePedidos.html';
            }
          });
          //window.location.href = 'verificacionDePedidos.html';        
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Error al procesar el pedido',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#6e7881",
        })
      }
    });
}

function activaDevolverArticulo() {
  // Obtener la tabla por su ID
  var table = document.getElementById('tblbodyVerificacion');
  // Iterar a través de las filas de la tabla (ignorando la fila de encabezado)
  for (var i = 0; i < table.rows.length; i++) {

    // Obtener el valor de la columna "ARTICULO" en cada fila
    var articulo = table.rows[i].cells[0].querySelector("h5#verifica-articulo span").innerText.trim();


    // Obtener el valor de la columna "articulosEliminado" en cada fila
    var valorEliminado = table.rows[i].cells[5].innerText.trim(); // Ajuste aquí, acceder a la sexta celda

    if (valorEliminado.toUpperCase() === "S") {
            // Obtener el valor de la columna "ARTICULO" en cada fila
            var articulo = table.rows[i].cells[0].querySelector("h5#verifica-articulo span").innerText.trim();      
            // Colocar el span con el ícono en la columna "VERIF" con evento onclick
            // table.rows[i].cells[4].innerHTML = '<span class="material-symbols-outlined" style="cursor: pointer;" onclick="devolverArticulo(\'' + articulo + '\')">reply_all</span>';
            table.rows[i].cells[4].innerHTML = '<i class="material-icons" style="color: #FF0000; cursor: pointer;" onclick="devolverArticulo(\'' + articulo + '\')">reply</i>';
          } else {
      // Si no ha sido eliminado, puedes realizar alguna otra acción si es necesario
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función para devolver un artículo eliminado del pedido
function devolverArticulo(articulo) {

  let table = document.getElementById("myTableVerificacion");
  let pPedido = localStorage.getItem('pedidoSelect');
  let pArticulo = articulo;

  // Mostrar mensaje con swal.fire
  swal.fire({
    title: "Devolver Artículo",
    text: "¿Estás seguro de devolver el artículo " + pArticulo + " del pedido número " + pPedido + "?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, devolver",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6e7881",
  }).then((result) => {
    // Si se hace clic en "Sí, devolver"
    if (result.isConfirmed) {
      const params =
        "?pPedido=" +
        pPedido +
        "&pArticulo=" +
        pArticulo;

      fetch(env.API_URL + "devolverarticulo/D" + params, myInit)
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "SUCCESS") {
            if (result.articulodevuelto.length != 0) {
              Swal.fire({
                icon: 'warning',
                title: 'Articulo Devuelto con exito',
                showCancelButton: true,
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6e7881",
              })
              // Iterar a través de las filas de la tabla (ignorando la fila de encabezado)
              for (var i = 1; i < table.rows.length; i++) {

                var articuloEnFila = table.rows[i].cells[0].querySelector("h5#verifica-articulo span").innerText.trim();

                // Verificar si el artículo en la fila coincide con el artículo a devolver
                if (articuloEnFila === articulo) {
                  // Eliminar la fila
                  table.deleteRow(i);

                  // Mostrar mensaje de éxito
                  swal.fire("Éxito", "Artículo devuelto correctamente.", "success");
                  break; // Salir del bucle después de eliminar la fila
                }
              }
            }
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Error al procesar el pedido',
              showCancelButton: true,
              confirmButtonText: 'Continuar',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#6e7881",
            })
          }
        });
    }
  });
}


///////FUNCION PARA Retornar a la vista anterior//////       
function confirmaRegresar() {
  localStorage.setItem('autoSearchPedidos', 'true');   
  localStorage.removeItem('mensajes');
  //localStorage.clear();
  window.location.href = 'verificacionDePedidos.html';
}