//Variable global que contiene el detalle del pedido
var detalleLineasOrdenDeCompra = "";

document.addEventListener("DOMContentLoaded", function () {
  const verificacionTab = document.querySelector('a[href="#tabla-verificacion"]');
  const observacionesContainer = document.getElementById('observaciones-container');
  
  // Escuchar clic en la pestaña de Verificación
  verificacionTab.addEventListener('click', function() {
    observacionesContainer.style.display = 'block'; // Mostrar textarea
  });

  // Escuchar clic en la pestaña de Lectura
  const lecturaTab = document.querySelector('a[href="#tabla-lectura"]');
  lecturaTab.addEventListener('click', function() {
    observacionesContainer.style.display = 'none'; // Ocultar textarea
  });


  //--------------------------------------------------------------------------
  if (localStorage.getItem("OrdenDeCompra")) {
    let OrdenDeCompra = localStorage.getItem("OrdenDeCompra");      
    let pBodega = document.getElementById("bodega").value;
    let pUsuario=localStorage.getItem("username");
    loadSwitchState();
    //---------------------------------------------------------------------------
    cargarDetalleOrdenDeCompra(OrdenDeCompra,pBodega,pUsuario);   
  } else {
    Swal.fire({
        icon: 'info',
        title: 'No hay OrdenDeCompraes',
        text: 'Lo sentimos, no hay OrdenDeCompraes disponibles en este momento.'
      });
  }
});

////////////// CARGA LOS DETALLES DE LA ORDEN DE COMPRAS //////////////////////////////////////////////////////////

function cargarDetalleOrdenDeCompra(OrdenDeCompra, pBodega,pUsuario) {
  // Concatena la variable con texto y asigna el valor al label documento y pedido
  document.getElementById("OrdenDeCompra").innerHTML = "#Orden: " + OrdenDeCompra;
  //document.getElementById("bodegaOC").innerHTML = "Bodega destino: " + pBodega;
  
  const pOrden = OrdenDeCompra;//Se asigna el número del peddido a una variable constante para pasarlo como parametro
  const params =
      "?pBodega=" +
      pBodega +
      "&pUsuario=" +      
      pUsuario+
      "&pOrden="+
      pOrden;

  fetch(env.API_URL + "wmsordenesdecompraslist" + params, myInit)//obtierne las lineas del OrdenDeCompra
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.detalleOC.length != 0) {        
          detalleLineasOrdenDeCompra=result.detalleOC;  
          let lineas = JSON.stringify(detalleLineasOrdenDeCompra);
          localStorage.setItem('lineasOC',lineas);
          console.log('listadoOC1');
          console.log(detalleLineasOrdenDeCompra);
        //   console.log("Detalles de la Orden: "+pOrden);     
        //    console.log(result);
            // Verificar si todas las cantidades verificadas tienen un valor
           const siGuardadoParcial = detalleLineasOrdenDeCompra.some((detalle) => detalle.cant_verificada != null && detalle.cant_verificada !== "");

           if (siGuardadoParcial) {
             // Llamar a armarTablaLectura después de armar la tabla de verificación
            armarTablaLectura(detalleLineasOrdenDeCompra);
             guardarTablaEnArray();      
           } 
        }
       armarTablaVerificacion(detalleLineasOrdenDeCompra);
     
      } 
    });
}

//////////////// ARMA LA TABLA LECTURA //////////////////////////////////////////////////////////////////////////

function armarTablaLectura(detalleLineasOrdenDeCompra) {

  var tbody = document.getElementById('tblbodyLectura');  
 

  // Agregar la clase deseada a la tabla
  tbody.classList.add("display", "centered");

  tbody.innerHTML = '';

  detalleLineasOrdenDeCompra.forEach(function (detalle) {
      // Convertir cant_verificada a un número y validar si es mayor que 0
      const cantidadVerificada = parseFloat(detalle.cant_verificada);
      
      if (!isNaN(cantidadVerificada) && cantidadVerificada > 0) { // Verificar que CANTIDAD_VERIFICADA sea mayor a 0
          var newRow = document.createElement('tr');

          newRow.innerHTML = `
              <td>
                  <span style="display: block; text-align: center;">${detalle.ARTICULO}</span>
              </td>
              <td class="codigo-barras-cell" style="text-align: center;">
                  <input id="codigo-barras" type="text" class="codigo-barras-input" value="${detalle.cod_barra || ''}" onchange="validarCodigoBarras(this)" autofocus readonly>
              </td>
              <td class="codigo-barras-cell2" style="text-align: center;">
                  <input id="cant-pedida" style="text-align: center;" type="text" class="codigo-barras-input" value="${detalle.cant_verificada || ''}" onchange="guardarTablaEnArray(this)" readonly>
              </td>
              <td class="codigo-barras-cell2" style="text-align: center;">
                  <i class="material-icons red-text" style="cursor: pointer;" onclick="eliminarFila(this)">clear</i>
              </td>
          `;
          tbody.appendChild(newRow);
      }
  });

  guardarTablaEnArray();
  crearNuevaFila();
}

///////VALIDA EL CODIGO LEIDO EN LA PESTAÑA LECTURA//////////////////
function validarCodigoBarras(input) {
    let lecturaSwitch = localStorage.getItem('switchLecturaState') === 'true';
    var LineasOrdenDeCompra2 = localStorage.getItem('lineasOC');
    var LineasOrdenDeCompra = JSON.parse(LineasOrdenDeCompra2);
  
    const codbarra = input.value.toUpperCase(); // Convertir a mayúsculas
  
    const row = input.closest("tr");
    const firstTd = row.querySelector("td:first-child");
    const span = firstTd.querySelector("span");
    const siguienteTd = row.querySelector(".codigo-barras-cell2");
    const cantFila = siguienteTd.querySelector(".codigo-barras-input");
  
    var codigoValido = false;
  
    if (lecturaSwitch) {
      for (var i = 0; i < LineasOrdenDeCompra.length; i++) {
        
        let codigosArrayArticulo = [];
        let codigoArrayPadre= [];
        if (LineasOrdenDeCompra[i].codigos_barras) {
          codigosArrayArticulo = LineasOrdenDeCompra[i].codigos_barras.split("|").map((codigo) => codigo.toUpperCase());
          codigoArrayPadre = LineasOrdenDeCompra[i].codigos_barras_kits.split("|").map((codigo) => codigo.toUpperCase());
        }
  
        if ((LineasOrdenDeCompra[i].articulo && LineasOrdenDeCompra[i].ARTICULO.toUpperCase() === codbarra) || codigosArrayArticulo.includes(codbarra) || codigoArrayPadre.includes(codbarra)) {
                  
                if(codigosArrayArticulo.includes(codbarra)){
                    span.textContent = LineasOrdenDeCompra[i].ARTICULO;
                    cantFila.value = 1;
                      // Bloquear la celda del código de barras
                      input.setAttribute("readonly", "readonly");              
                      // Aquí se genera una fila nueva vacía
                      crearNuevaFila();
                  }else{
                    input.value = "";
                    Swal.fire({
                      title: "Alerta: El modo de lectura por unidad esta activado",
                      text: "Está intentando leer un código por kit o caja. Cambie al modo de lectura por Kit o caja",
                      confirmButtonColor: "#28a745",
                      icon: "warning"
                    });
                  }           
          guardarTablaEnArray();  
          codigoValido = true;
          break;
        }
      }
  
      if (!codigoValido) {
        // Borrar el contenido de la celda COD
        const codigoBarrasCell = row.querySelector(".codigo-barras-cell");
        const codigoBarrasInput = codigoBarrasCell.querySelector(".codigo-barras-input");
        codigoBarrasInput.value = "";
  
        Swal.fire({
          icon: "warning",
          title: "¡Código " + codbarra + " no encontrado!",
          text: "¿Desea ingresarlo?.",
          showCancelButton: true,
          confirmButtonText: "Ingresar código nuevo",
          confirmButtonColor: "#28a745",
          cancelButton: "btn btn-danger",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Código " + codbarra + " no encontrado!",
              html: `
                <input type="text" id="usuariocodigo" class="swal2-input" placeholder="Usuario">       
                <input type="password" id="contrasena" class="swal2-input" placeholder="Contraseña">            
                <input type="text" id="articulo" class="swal2-input" placeholder="Código de Artículo">
                <input type="text" id="codigoBarra" class="swal2-input" placeholder="Código de Barra" value="${codbarra}">
              `,
              showCancelButton: true,
              confirmButtonText: "Ingresar código nuevo",
              confirmButtonColor: "#28a745",
              cancelButton: "btn btn-danger",
              preConfirm: () => {
                const usuario = Swal.getPopup().querySelector("#usuariocodigo").value;
                const contrasena = Swal.getPopup().querySelector("#contrasena").value;
                const articulo = Swal.getPopup().querySelector("#articulo").value;
                const codigoBarra = Swal.getPopup().querySelector("#codigoBarra").value;
                
                if (!usuario || !contrasena || !articulo || !codigoBarra) {
                  Swal.showValidationMessage(`Por favor, completa todos los campos`);
                }
                return { usuario: usuario, contrasena: contrasena, articulo: articulo, codigoBarra: codigoBarra };
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { usuario, contrasena, articulo, codigoBarra } = result.value;
                InsertaCodigoBarra(usuario, contrasena, articulo, codigoBarra, lecturaSwitch);
              }
            });
          }
        });
      }
    } else {
      for (var i = 0; i < LineasOrdenDeCompra.length; i++) {
        let codigosArrayPadre = [];
        let codigoArrayHijo=[];
        if (LineasOrdenDeCompra[i].codigos_barras) {
          codigosArrayPadre = LineasOrdenDeCompra[i].codigos_barras_kits.split("|").map((codigo) => codigo.toUpperCase());
          codigoArrayHijo = LineasOrdenDeCompra[i].codigos_barras.split("|").map((codigo) => codigo.toUpperCase());
        }
        
        let cantKit = LineasOrdenDeCompra[i].cant_kits;
        let cantPorKits = parseFloat(cantKit).toFixed(2); 
  
        if ((LineasOrdenDeCompra[i].articulo && LineasOrdenDeCompra[i].ARTICULO_PADRE.toUpperCase() === codbarra) || codigosArrayPadre.includes(codbarra) || codigoArrayHijo.includes(codbarra)) {

                if(codigoArrayHijo.includes(codbarra)){
                  input.value = "";
                  Swal.fire({
                    title: "Alerta: La lectura por caja o kit esta activada",
                    text: "Está intentando leer un código por unidad. Cambie al modo de lectura por unidad.",
                    confirmButtonColor: "#28a745",
                    icon: "warning"
                  });                  
                }else{
                  span.textContent = LineasOrdenDeCompra[i].ARTICULO;
                  cantFila.value = cantPorKits;
                  span.style.color = "#28a745";  // Aplicar el color al contenido del span
                    // Bloquear la celda del código de barras
                    input.setAttribute("readonly", "readonly");            
                    // Aquí se genera una fila nueva vacía
                    crearNuevaFila();
                }
                   
          // Llamar función que guarda artículos en la tabla
          guardarTablaEnArray();
  
          codigoValido = true;
          break;
        }
      }
  
      if (!codigoValido) {
        // Borrar el contenido de la celda COD
        const codigoBarrasCell = row.querySelector(".codigo-barras-cell");
        const codigoBarrasInput = codigoBarrasCell.querySelector(".codigo-barras-input");
        codigoBarrasInput.value = "";
  
        Swal.fire({
          icon: "warning",
          title: "¡Código " + codbarra + " no encontrado!",
          text: "¿Desea ingresarlo?.",
          showCancelButton: true,
          confirmButtonText: "Ingresar código nuevo",
          confirmButtonColor: "#28a745",
          cancelButton: "btn btn-danger",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Código " + codbarra + " no encontrado!",
              html: `
                <input type="text" id="usuariocodigo" class="swal2-input" placeholder="Usuario">       
                <input type="password" id="contrasena" class="swal2-input" placeholder="Contraseña">            
                <input type="text" id="articulo" class="swal2-input" placeholder="Código de Artículo">
                <input type="text" id="codigoBarra" class="swal2-input" placeholder="Código de Barra" value="${codbarra}">
              `,
              showCancelButton: true,
              confirmButtonText: "Ingresar código nuevo",
              confirmButtonColor: "#28a745",
              cancelButton: "btn btn-danger",
              preConfirm: () => {
                const usuario = Swal.getPopup().querySelector("#usuariocodigo").value;
                const contrasena = Swal.getPopup().querySelector("#contrasena").value;
                const articulo = Swal.getPopup().querySelector("#articulo").value;
                const codigoBarra = Swal.getPopup().querySelector("#codigoBarra").value;
                
                if (!usuario || !contrasena || !articulo || !codigoBarra) {
                  Swal.showValidationMessage(`Por favor, completa todos los campos`);
                }
                return { usuario: usuario, contrasena: contrasena, articulo: articulo, codigoBarra: codigoBarra };
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const { usuario, contrasena, articulo, codigoBarra } = result.value;
                InsertaCodigoBarra(usuario, contrasena, articulo, codigoBarra, lecturaSwitch);
              }
            });
          }
        });
      }
    }
  }
  
  //////////////////////////////////////
 /////////// CREAR NUEVA FILA /////////
//////////////////////////////////////

function crearNuevaFila() {
  const tableBody = document.querySelector('#tblbodyLectura');

  // Agregar la clase deseada a la tabla
  tableBody.classList.add("display", "centered");

  const nuevaFilaHTML =
      `<tr>
            <td class="sticky-column" style="text-align: center;" style="user-select: none;"><span display: inline-block;"></span></td>
            <td class="codigo-barras-cell" style="text-align: center;"><input type="text" style="text-align: center;" id="codigo-barras" class="codigo-barras-input" value="" onchange="validarCodigoBarras(this)" autofocus></td>
            <td class="codigo-barras-cell2" style="text-align: center;"><input id="cant-pedida" style="text-align: center;" type="text" class="codigo-barras-input" value="" onchange="validarCantidadPedida(this)"></td>
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

// ///FUNCION QUE ARMA LA TABLA DE LA PESTAÑA VERIFICACION
///FUNCION QUE ARMA LA TABLA DE LA PESTAÑA VERIFICACION
function armarTablaVerificacion(detalleLineasOrdenDeCompra) {
    // Obtener la referencia del cuerpo de la tabla
    var tbody = document.getElementById('tblbodyLineasOrdenDeCompra');

    // Limpiar el contenido actual del cuerpo de la tabla
    tbody.innerHTML = '';

    // Obtener la referencia del label cantidadDeRegistros
    var cantidadDeRegistrosLabel = document.getElementById('cantidadDeRegistros');
    // Actualizar el texto del label con la cantidad de registros
    cantidadDeRegistrosLabel.textContent = 'Cantidad de registros: ' + detalleLineasOrdenDeCompra.length;

    // Iterar sobre cada elemento en detalleLineasOrdenDeCompra
    detalleLineasOrdenDeCompra.forEach(function (detalle) {
        // Crear una nueva fila
        var newRow = document.createElement('tr');

        // Construir el contenido de la fila usando textContent y &nbsp;
        var articuloCell = document.createElement('td');
        articuloCell.id = "articulo";
        var articuloHeader = document.createElement('h5');
        articuloHeader.id = "verifica-articulo";
        var articuloSpan = document.createElement('span');
        articuloSpan.className = "blue-text text-darken-2 centered";
        articuloSpan.textContent = detalle.ARTICULO;
        articuloHeader.appendChild(articuloSpan);
        var descripcionHeader = document.createElement('h6');       
        descripcionHeader.innerHTML = detalle.descripcion;
        articuloCell.appendChild(articuloHeader);
        articuloCell.appendChild(descripcionHeader);

        var codigoDeBarrasCell = document.createElement('td');
        codigoDeBarrasCell.id = "codigoDeBarras";
        codigoDeBarrasCell.textContent = detalle.cod_barra || '';

        var cantidadPedidaCell = document.createElement('td');
        cantidadPedidaCell.id = "cantidadPedida";
        cantidadPedidaCell.textContent = isNaN(parseFloat(detalle.cant_ordenada)) ? 0 : parseFloat(detalle.cant_ordenada).toFixed(0);

        var cantidadLeidaCell = document.createElement('td');
        cantidadLeidaCell.id = "cantidadLeida";
        cantidadLeidaCell.textContent = ''; // Cantidad leída, inicialmente en blanco

        var verificadoCell = document.createElement('td');
        verificadoCell.id = "verificado";
        verificadoCell.textContent = '';

        var articulosEliminadoCell = document.createElement('td');
        articulosEliminadoCell.id = "articulosEliminado";
        articulosEliminadoCell.textContent = detalle.ARTICULO_ELIMINADO;
        articulosEliminadoCell.setAttribute('hidden', true);

        newRow.appendChild(articuloCell);
        newRow.appendChild(codigoDeBarrasCell);
        newRow.appendChild(cantidadPedidaCell);
        newRow.appendChild(cantidadLeidaCell);
        newRow.appendChild(verificadoCell);
        newRow.appendChild(articulosEliminadoCell);

        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(newRow);    
    });

    //agrega las observaciones si las hay
    let obs = localStorage.getItem('observacion');
    let contobs = 0
    const observaciones= document.getElementById('observaciones');
    observaciones.innerHTML = (obs !== "" && obs !== "null") ? `${++contobs}- ${obs}` : ""; 

}


//Funcion que limpia el area de mensajes de error
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
          const filas = document.querySelectorAll('#myTableVerificacion tbody tr');// Obtener todas las filas de la tabla de verificación
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


      // Array para almacenar los mensajes
        const mensajesArray = [];
        let mensajeContador = 1;

    
     
      filas.forEach(lineas=>{
        const articulo = lineas.querySelector("h5").textContent;
        const cantSolicitada = lineas.querySelector('#cantidadPedida').textContent;
        const celdaCantidadLeida = lineas.querySelector("#cantidadLeida");
        const celdaVerificado = lineas.querySelector('#verificado');

         
          let dataArray = JSON.parse(localStorage.getItem('dataArray'));

          dataArray.forEach((arrayLectura) => { //recorremos el arreglo de las cantidades leidas  
            
            if ( articulo === arrayLectura.ARTICULO) {
              // localStorage.setItem('diferencias',true);
              if (celdaCantidadLeida) {
                celdaCantidadLeida.textContent = arrayLectura.CANTIDAD_LEIDA;
              } 
              
              if(parseFloat(celdaCantidadLeida.textContent) > parseFloat(cantSolicitada)){
                let resultado =  '+' +( parseFloat(celdaCantidadLeida.textContent) - parseFloat(cantSolicitada)).toString();
                celdaVerificado.textContent = resultado;
                const mensaje = `${mensajeContador}. La cantidad leida del artículo ${articulo} es mayor a la solicitada.`;
                mensajesArray.push(mensaje);
                mensajeContador++;
              }else if(parseFloat(celdaCantidadLeida.textContent) < parseFloat(cantSolicitada)){
                let resultado =  '-' +(parseFloat(cantSolicitada) - parseFloat(celdaCantidadLeida.textContent)).toString();
                celdaVerificado.textContent = resultado;
                const mensaje = `${mensajeContador}. La cantidad leida del artículo ${articulo} es menor a la solicitada.`;
                mensajesArray.push(mensaje);
                mensajeContador++;
              }else{
                celdaVerificado.textContent = "";
                          // Crear un elemento <span> para el ícono de Material Icons
                          const spanVerificacion =
                            document.createElement("span");
                          spanVerificacion.classList.add("material-icons");
                          spanVerificacion.textContent = "done_all"; // Texto que indica qué ícono de Material Icons se mostrará
                          // Establecer el color verde en línea
                          spanVerificacion.style.color = "green";
                          // Agregar el span a la celda
                          celdaVerificado.appendChild(spanVerificacion);
              }
              //console.log(arrayLectura.ARTICULO + ' - ' + arrayLectura.CANTIDAD_LEIDA);
            }else{
              console.log('no hay coincidencias');
              //localStorage.setItem('diferencias',false);
          
            }
          });              
              if(celdaCantidadLeida.textContent === ""){
                celdaCantidadLeida.textContent = 0;                
                const mensaje = `${mensajeContador}. La cantidad leida del artículo ${articulo} es cero.`;
                mensajesArray.push(mensaje);
                mensajeContador++;
                          celdaVerificado.textContent = "";                         
                          const spanVerificacion =
                          document.createElement("span");
                          spanVerificacion.classList.add("material-icons");
                          spanVerificacion.textContent = "cancel";                      
                          spanVerificacion.style.color = "red";                         
                          celdaVerificado.appendChild(spanVerificacion);
              }

      });
      localStorage.setItem("mensajes", JSON.stringify(mensajesArray));
       // Actualizar el contenido del textarea con los mensajes enumerados
      const mensajeTextArea = document.getElementById('mensajeText');
      mensajeTextArea.value = mensajesArray.join('\n');

} // FIN DE VERIFICACION

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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
 /////  Función para mostrar los mensajes almacenados en el localStorage en el textarea         ////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function inicializarBotones() {
    // Crear los botones y el OrdenDeCompra
    const ordenesfinalizado = localStorage.getItem("OrdenDeCompra_finalizadas");
    const OrdenDeCompraBotones = document.createElement('div');
    const botonProcesar = document.createElement('button');
    const botonGuardadoParcalLectura = document.createElement('button');
    const botonGuardarParcial = document.createElement('button');
    const botonRegresar = document.createElement('button'); // Crear botón Regresar


     // Configurar propiedades del botón de guardado parcial de la tabla lectura
     botonGuardadoParcalLectura.textContent = 'Guardar';
     botonGuardadoParcalLectura.id = 'btnGuardadoParcalLectura';
     botonGuardadoParcalLectura.hidden = false;
     botonGuardadoParcalLectura.onclick = confirmarGuardadoParcialLectura; // Agregar onclick

    // Configurar propiedades de los botones
    botonProcesar.textContent = 'Procesar';
    botonProcesar.id = 'btnProcesar';
    botonProcesar.hidden = false;
    botonProcesar.onclick = confirmaProcesar; // Agregar onclick

    botonGuardarParcial.textContent = 'Guardar';
    botonGuardarParcial.id = 'btnGuardar';  
    botonGuardarParcial.hidden = false; 
    botonGuardarParcial.onclick = confirmarGuardadoParcial; // Agregar onclick

    // Configurar propiedades del botón Regresar
    botonRegresar.textContent = 'Regresar';
    botonRegresar.id = 'btnRegresar';
    botonRegresar.hidden = false;
    botonRegresar.onclick = confirmaRegresar;

    // Aplicar estilos al botón de guardado parcial  de la tabla lectura
    botonGuardadoParcalLectura.style.backgroundColor = '#28a745';
    botonGuardadoParcalLectura.style.borderRadius = '5px';
    botonGuardadoParcalLectura.style.color = 'white';
    botonGuardadoParcalLectura.style.marginTop = '16px';
    botonGuardadoParcalLectura.style.marginLeft = '16px';
    botonGuardadoParcalLectura.style.marginRight = '16px';
    botonGuardadoParcalLectura.style.height = '36px';
    botonGuardadoParcalLectura.style.width = '150px';

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
    botonProcesar.style.height = '36px';
    botonProcesar.style.marginbottom = '25px';

    // Aplicar estilos al botón de Regresar
    botonRegresar.style.backgroundColor = '#28a745';
    botonRegresar.style.borderRadius = '5px';
    botonRegresar.style.color = 'white';
    botonRegresar.style.marginTop = '16px';
    botonRegresar.style.marginLeft = '16px';
    botonRegresar.style.marginRight = '16px';
    botonRegresar.style.height = '36px';

    // Agregar botones al OrdenDeCompra

      // Agregar botones al contenedor
        if(ordenesfinalizado != 'true'){
            OrdenDeCompraBotones.appendChild(botonRegresar);
        }else{
            OrdenDeCompraBotones.appendChild(botonGuardarParcial);
            OrdenDeCompraBotones.appendChild(botonProcesar);    
        }


    // Obtener tabla de verificación
    const tablaVerificacion = document.getElementById('myTableVerificacion');
    const tablaLectura = document.getElementById('myTableLectura');

    // Insertar OrdenDeCompra de botones después de la tabla de verificación
    tablaVerificacion.parentNode.insertBefore(OrdenDeCompraBotones, tablaVerificacion.nextSibling);
    // Insertar el botón de guardado parcial después de la tabla de lectura
    tablaLectura.parentNode.insertBefore(botonGuardadoParcalLectura, tablaLectura.nextSibling);

      // Media query para pantallas grandes
      const mediaQuery = window.matchMedia('(min-width: 64em)');
      if (mediaQuery.matches) {
          // Aplicar estilos específicos para pantallas grandes
          botonGuardarParcial.style.marginLeft = '200px';
          botonProcesar.style.marginLeft = '500px';            
          botonGuardadoParcalLectura.style.marginLeft = '200px';
      }
}

// Llamar a la función para cargar y mostrar los mensajes desde el localStorage al cargar la página
window.onload = function() {
    inicializarBotones();
    guardarTablaEnArray();
      
};

function mostrarProcesoEnConstruccion() {
    Swal.fire({
        title: "Proceso en Construcción",
        text: "Esta funcionalidad está en construcción.",
        icon: "info",
        confirmButtonText: "Salir"
    });
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
            verificacion();           
            guardaParcialMenteLectura();    
        }
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Funcion de confirmación del guardado parcial
 function confirmarGuardadoParcial() {
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
           guardaParcialMente();    
        }
    });
}


function guardaParcialMenteLectura() {
    let pUsuario = localStorage.getItem('username');
    var pConsecutivo = localStorage.getItem('OrdenDeCompra');
    localStorage.removeItem('mensajes');
    
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
    const chunkSize = 50; // Tamaño del bloque
    const totalChunks = Math.ceil(detalles.length / chunkSize);

    // Función para enviar cada bloque
    const sendChunk = (chunk, index) => {
        const params = "?pUsuario=" + pUsuario +
                       "&pConsecutivo=" + pConsecutivo +
                       "&jsonDetalles=" + encodeURIComponent(JSON.stringify(chunk));

        fetch(env.API_URL + "wmsguardaprocesaordendecompralist/G" + params, myInit)
            .then((response) => response.json())
            .then((result) => {
                if (result.msg === "SUCCESS") {
                    console.log(`Chunk ${index + 1} guardado con éxito.`);
                    // Aquí puedes manejar el resultado de cada chunk
                } else {
                    console.error(`Error al guardar chunk ${index + 1}:`, result);
                }
            });
    };

    // Dividir jsonDetalles en bloques y enviarlos
    for (let i = 0; i < totalChunks; i++) {
        const chunk = detalles.slice(i * chunkSize, (i + 1) * chunkSize);
        sendChunk(chunk, i);
    }
}

function guardaParcialMente() {
    let pUsuario = localStorage.getItem('username');
    var pConsecutivo = localStorage.getItem('OrdenDeCompra');
    localStorage.removeItem('mensajes');
    
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
    let cantidadLeida = row.querySelector("#cantidadLeida").textContent.trim()|| 0;


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
    const chunkSize = 50; // Tamaño del bloque
    const totalChunks = Math.ceil(detalles.length / chunkSize);

    // Función para enviar cada bloque
    const sendChunk = (chunk, index) => {
        const params = "?pUsuario=" + pUsuario +
                       "&pConsecutivo=" + pConsecutivo +
                       "&jsonDetalles=" + encodeURIComponent(JSON.stringify(chunk));

        fetch(env.API_URL + "wmsguardaprocesaordendecompralist/G" + params, myInit)
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
                                localStorage.setItem('autoSearchOrdenDeComprasList', 'true');
                                window.location.href = 'verificacionDeOrdenesDeCompra.html';
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
        const chunk = detalles.slice(i * chunkSize, (i + 1) * chunkSize);
        sendChunk(chunk, i);
    }
}
      
///// FUNCION PARA VERIFICAR EL CHECK EN LA COLUNA DE VERIFICACO
function validarVerificacion() {
  // Obtener todas las celdas de verificación
  var celdasVerificacion = document.querySelectorAll('#tblbodyLineasOrdenDeCompra td#verificado');

  // Iterar sobre cada celda de verificación
  for (var i = 0; i < celdasVerificacion.length; i++) {
      // Obtener el span dentro de la celda
      var spanVerificacion = celdasVerificacion[i].querySelector('span.material-icons');
      // Verificar si el span no está presente o su contenido no es 'done_all'
      if (!spanVerificacion || spanVerificacion.textContent !== 'done_all') {
          // Si encuentra una celda sin verificar, retorna false
          return "false";
      }
  } 
  // Si todas las celdas están verificadas, retorna true
  return "true";
}

///////FUNCION PARA PROCESAR//////       
function confirmaProcesar() {

  const observaciones= document.getElementById('observaciones').value;
  // const diferenciasLineas= localStorage.getItem('diferencias');
  const diferenciasLineas= validarVerificacion();

    Swal.fire({
        icon: 'warning',
        title: '¿Desea procesar la Orden De Compra?',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
    }).then((result) => {
      if (result.isConfirmed) {   
        
            if(diferenciasLineas === "true"){
              procesarOrdenDeCompra();    
            }else{
              Swal.fire({
                title: "Autorización",
                html: `<input type="text" id="usuariocodigo" class="swal2-input" placeholder="Usuario">       
                        <input type="password" id="contrasena" class="swal2-input" placeholder="Contraseña">`,
                showCancelButton: true,
                confirmButtonText: "Autorizar",
                confirmButtonColor: "#28a745",
                cancelButtonText: "Cancelar", // Cambia este parámetro
                cancelButtonColor: "#6e7881", // Color del botón de cancelación
                preConfirm: () => {
                  const usuario = Swal.getPopup().querySelector("#usuariocodigo").value;
                  const contrasena = Swal.getPopup().querySelector("#contrasena").value;        
                  if (!usuario || !contrasena) {
                    Swal.showValidationMessage(`Por favor, completa todos los campos`);
                  }
                  return { usuario: usuario, contrasena: contrasena };
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  if(observaciones !=""){
                    const { usuario, contrasena } = result.value;                  
                   autorizacion(usuario, contrasena);
                  }else{
                    Swal.fire({
                    icon: 'warning',
                    title: 'Debe ingresar las observaciones antes de procesar la orden de compra',
                    showCancelButton: true,
                    confirmButtonText: 'Continuar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#6e7881",
                    });
                    }                    
                }
              });
            }
      }
    });    
}

function autorizacion(usuario, contrasena) {
  const params = "?pUsuario=" + usuario + "&pOpcion=" + contrasena;

  fetch(env.API_URL + "wmsautorizaciones" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
        if ( result.autorizacion[0].respuesta === 0) {        
        procesarOrdenDeCompra();
      } else {
        console.log('no autorizado\n' + result.autorizacion[0].respuesta);
           Swal.fire({
                icon: "warning",
                title: "Credenciales incorrectas",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6e7881",
            }).then((result) => {
                if (result.isConfirmed) {
                   confirmaProcesar()               
                }
            });         
      }
    })
    .catch((error) => {
      console.log('Error en la solicitud:', error);
    });
}

//FUNCION DE PROCESAR EL OrdenDeCompra

function procesarOrdenDeCompra() {
    let pUsuario = localStorage.getItem('username');
    var pConsecutivo = localStorage.getItem('OrdenDeCompra');
    let pObservaciones = document.getElementById('observaciones').value;

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
    const batchSize = 50; // Tamaño del bloque
    const totalBatches = Math.ceil(detalles.length / batchSize); // Total de bloques
    let promises = [];

    for (let i = 0; i < totalBatches; i++) {
        const batch = detalles.slice(i * batchSize, (i + 1) * batchSize); // Obtener el bloque de detalles
        var jsonDetalles = JSON.stringify(batch); // Convertir a JSON

        const params =
            "?pUsuario=" + pUsuario +
            "&pConsecutivo=" + pConsecutivo +
            "&jsonDetalles=" + jsonDetalles +
            "&pObservacion=" + pObservaciones;

        // Enviar el bloque a la API
        const fetchPromise = fetch(env.API_URL + "wmsguardaprocesaordendecompralist/P" + params, myInit)
            .then((response) => response.json())
            .then((result) => {
                if (result.msg === "SUCCESS") {
                    console.log('Bloque ' + (i + 1) + ' procesado con éxito.');
                } else {
                    console.error('Error en bloque ' + (i + 1) + ': ', result);
                }
            });
        
        promises.push(fetchPromise); // Agregar la promesa a la lista
    }

    // Esperar a que todos los bloques se procesen
    Promise.all(promises)
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Datos procesados con éxito",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6e7881",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirecciona a tu otra vista aquí
                    localStorage.setItem('autoSearchOrdenDeComprasList', 'true');
                    window.location.href = 'verificacionDeOrdenesDeCompra.html';
                }
            });
        })
        .catch((error) => {
            console.error('Error procesando los bloques: ', error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al procesar los datos.",
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#dc3545",
                icon: "error"
            });
        });
}


///////FUNCION PARA Retornar a la vista anterior//////       
function confirmaRegresar() {
    localStorage.setItem('autoSearchOrdenDeComprasList', 'true');   
    localStorage.removeItem('mensajes');
    //localStorage.clear();
    window.location.href = 'verificacionDeOrdenesDeCompra.html';
  }

////// FUNCION QUE INSERTA LOS NUEVOS CODIGOS DE BARRA ENCONTRADOS
function  InsertaCodigoBarra(usuario, contrasena, articulo, codigoBarra,valorswitch){    
        let pOpcion = "";

        if(valorswitch){
            pOpcion= 'T';
        }else{
            pOpcion='K';
        }

     const params =
         "?pUsuario=" +
         usuario +
         "&pClave="+
         contrasena+
         "&pArticulo=" +      
         articulo+
         "&pCodigoBarra="+
         codigoBarra+
         "&pOpcion="+
         pOpcion;
   
     fetch(env.API_URL + "wmsinsertacodigobarra" + params, myInit)
       .then((response) => response.json())
       .then((result) => {
         if (result.msg === "SUCCESS") {
            actualizaOrdenDeComprasList();           
               
            Swal.fire({
                      position: "centered",
                      icon: "success",
                      title:  ` ${result.codigobarra[0].Mensaje} `,
                      showConfirmButton: false,
                      timer: 2000
                    });
         } 
       });
}  

function actualizaOrdenDeComprasList(){
    if (localStorage.getItem("OrdenDeCompra")) {
        let OrdenDeCompra = localStorage.getItem("OrdenDeCompra");      
        let pBodega = document.getElementById("bodega").value;
        let pUsuario=localStorage.getItem("username");
        const pOrden = OrdenDeCompra;//Se asigna el número del peddido a una variable constante para pasarlo como parametro
        const params =
            "?pBodega=" +
            pBodega +
            "&pUsuario=" +      
            pUsuario+
            "&pOrden="+
            pOrden;
      
        fetch(env.API_URL + "wmsordenesdecompraslist" + params, myInit)//obtierne las lineas del OrdenDeCompra
          .then((response) => response.json())
          .then((result) => {
            if (result.msg === "SUCCESS") {
              if (result.detalleOC.length != 0) {        
                detalleLineasOrdenDeCompra=result.detalleOC; 
                    let lineas = JSON.stringify(detalleLineasOrdenDeCompra);
                    localStorage.setItem('lineasOC',lineas);      
                   // console.log(detalleLineasOrdenDeCompra);
                    //validarCodigoBarras(codigoBarra);
              }
            } 
          });
    }
}

// Función para guardar el estado del switch en localStorage
function saveSwitchState() {
    const switchElement = document.getElementById('toggleSwitchLectura');
    localStorage.setItem('switchLecturaState', switchElement.checked);
  }
  
  // Función para cargar el estado del switch desde localStorage
function loadSwitchState() {
    const switchElement = document.getElementById('toggleSwitchLectura');
    const savedState = localStorage.getItem('switchLecturaState');
    if (savedState !== null) {
      switchElement.checked = (savedState === 'true');
    }
  }
  
  // Event listener para guardar el estado del switch cuando cambie
  document.getElementById('toggleSwitchLectura').addEventListener('change', saveSwitchState);
  
  // Cargar el estado del switch cuando se cargue la página
  window.addEventListener('load', loadSwitchState);
  