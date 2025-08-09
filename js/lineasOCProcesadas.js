//Variable global que contiene el detalle del pedido
var detalleLineasOrdenDeCompra = "";

document.addEventListener("DOMContentLoaded", function () {
cargarBodegas();
  //--------------------------------------------------------------------------
if (localStorage.getItem("OrdenDeCompra")) {
    let OrdenDeCompra = localStorage.getItem("OrdenDeCompra");  
    // let pBodega = localStorage.getItem("bodegaOC");  
    // let pBodega = document.getElementById("bodega-sucursal").value;  
    let pBodega = document.getElementById("bodega").value;
    let pUsuario=localStorage.getItem("username");
    //---------------------------------------------------------------------------
    cargarDetalleOrdenDeCompra(OrdenDeCompra,pBodega,pUsuario);
    //localStorage.removeItem("dataArray");//borra los elementos leidos del localstorage.    
  } else {
    Swal.fire({
        icon: 'info',
        title: 'No hay OrdenDeCompraes',
        text: 'Lo sentimos, no hay OrdenDeCompraes disponibles en este momento.'
      });
  }
});

function cargarDetalleOrdenDeCompra(OrdenDeCompra, pBodega,pUsuario) {
    let embarque = localStorage.getItem('embarque');
  // Concatena la variable con texto y asigna el valor al label documento y pedido
  document.getElementById("OrdenDeCompra").innerHTML = "#Orden: " + OrdenDeCompra; 
  document.getElementById("bodega_solicita").innerHTML= "#Embarque: " +embarque;

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
           armarTablaVerificacion(detalleLineasOrdenDeCompra);         
        }           
      } 
    });
}

///FUNCION QUE ARMA LA TABLA DE  VERIFICACION
function armarTablaVerificacion(detalleLineasOrdenDeCompra) {
    // Obtener la referencia del cuerpo de la tabla
    var tbody = document.getElementById('tblbodyLineasOrdenDeCompra');

    // Limpiar el contenido actual del cuerpo de la tabla
    tbody.innerHTML = '';

    // Obtener la referencia del label cantidadDeRegistros
    var cantidadDeRegistrosLabel = document.getElementById('cantidadDeRegistros');
    // Actualizar el texto del label con la cantidad de registros
    cantidadDeRegistrosLabel.textContent = 'Cantidad de registros: ' + detalleLineasOrdenDeCompra.length;

    // Array para almacenar mensajes de verificación
    var mensajesArray = [];

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
        cantidadLeidaCell.textContent = detalle.cant_verificada; // Cantidad leída, inicialmente en blanco

        var verificadoCell = document.createElement('td');
        verificadoCell.id = "verificado";

        // Verificar si las cantidades son iguales y generar mensajes
        var cantPedida = parseFloat(detalle.cant_ordenada);
        var cantLeida = parseFloat(detalle.cant_verificada);

        if (cantLeida > cantPedida) {          
            verificadoCell.innerHTML = '<i class="material-icons" style="color:red;">done_all</i>';
            const mensaje = ` La cantidad verificada del artículo ${detalle.ARTICULO}, es mayor a la solicitada.`;
            mensajesArray.push(mensaje);
        } else if (cantLeida < cantPedida) {          
            verificadoCell.innerHTML = '<i class="material-icons" style="color:red;">done_all</i>';
            const mensaje = ` La cantidad verificada del artículo ${detalle.ARTICULO}, es menor a la solicitada.`;
            mensajesArray.push(mensaje);
        } else {
            verificadoCell.innerHTML = '<i class="material-icons" style="color:green;">done_all</i>';
        }

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

    // Enumerar los mensajes y agregarlos al textArea
    var mensajeTextArea = document.getElementById('mensajeText');
    var mensajesEnumerados = mensajesArray.map((mensaje, index) => `${index + 1}. ${mensaje}`);
    mensajeTextArea.value = mensajesEnumerados.join('\n');
    autoResizeTextArea(mensajeTextArea);
    
    // Guardar los mensajes en localStorage
    localStorage.setItem("mensajes", JSON.stringify(mensajesEnumerados));
}

// Función para ajustar dinámicamente el tamaño del textarea
function autoResizeTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

// Evento para ajustar el tamaño del textarea al escribir
document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase() === 'textarea') {
        autoResizeTextArea(event.target);
    }
}, false);


// Función para ajustar dinámicamente el tamaño del textarea
function autoResizeTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

// Evento para ajustar el tamaño del textarea al escribir
document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase() === 'textarea') {
        autoResizeTextArea(event.target);
    }
}, false);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCION QUE VERIFICA LAS CANTIDASDES LEIDAS Y DEL PEDIDO PÁRA ACTIVAR EL BOTON DE GUARDADO PARCIAL
function activaVolver() {
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

//Llama a la función mostrarMensajesLocalStorage cuando se hace clic en la pestaña "Verificación"
document.querySelector('a[href="#tabla-verificacion"]').addEventListener('click', mostrarMensajesLocalStorage);
  
//////////////inicializa los botones Guardar y cerrar/////////////////
function inicializarBotones() {
    // Crear los botones y el OrdenDeCompra
    const OrdenDeCompraBotones = document.createElement('div');
    const botonDevolver = document.createElement('button');
    const botonGuardarParcial = document.createElement('button');

    // Configurar propiedades de los botones
    botonDevolver.textContent = 'Regresar';
    botonDevolver.id = 'btnDevolver';
    botonDevolver.hidden = false;
    botonDevolver.onclick = confirmaDevolver; // Agregar onclick

    botonGuardarParcial.textContent = 'Guardar';
    botonGuardarParcial.id = 'btnGuardar';  
    botonGuardarParcial.hidden = false; 
    botonGuardarParcial.onclick = confirmaDevolver; // Agregar onclick

    // Aplicar estilos al botón de guardado parcial
    botonGuardarParcial.style.backgroundColor = '#28a745';
    botonGuardarParcial.style.borderRadius = '5px';    
    botonGuardarParcial.style.color = 'white';
    botonGuardarParcial.style.marginTop = '16px';
    botonGuardarParcial.style.marginLeft = '16px';
    botonGuardarParcial.style.marginRight = '16px';
    botonGuardarParcial.style.height = '36px';
    botonGuardarParcial.style.width = '100px';

    // Aplicar estilos al botón de Devolver
    botonDevolver.style.width = '100px';
    botonDevolver.style.backgroundColor = '#28a745';
    botonDevolver.style.borderRadius = '5px';
    botonDevolver.style.color = 'white';
    botonDevolver.style.marginTop = '16px';
    botonDevolver.style.marginLeft = '6em';
    botonDevolver.style.height = '36px';
    botonDevolver.style.marginbottom = '25px';

    // Agregar botones al OrdenDeCompra
   // OrdenDeCompraBotones.appendChild(botonGuardarParcial);
    OrdenDeCompraBotones.appendChild(botonDevolver);
   

    // Obtener tabla de verificación
    const tablaVerificacion = document.getElementById('myTableVerificacion');

    // Insertar OrdenDeCompra de botones después de la tabla de verificación
    tablaVerificacion.parentNode.insertBefore(OrdenDeCompraBotones, tablaVerificacion.nextSibling);

      // Media query para pantallas grandes
      const mediaQuery = window.matchMedia('(min-width: 64em)');
      if (mediaQuery.matches) {
          // Aplicar estilos específicos para pantallas grandes
          botonGuardarParcial.style.marginLeft = '200px';
          botonDevolver.style.marginLeft = '6px';
      }
}

// Llamar a la función para cargar y mostrar los mensajes desde el localStorage al cargar la página
window.onload = function() {
    inicializarBotones();  
};
    
///////FUNCION PARA Devolver//////       
function confirmaDevolver() {
    localStorage.setItem('autoSearchOC', 'true');   
    localStorage.removeItem('mensajes');
    localStorage.removeItem('bodega_Destino_OC');
    localStorage.removeItem('embarque');
    localStorage.removeItem('OrdenDeCompra');
    window.location.href = 'verificacionDeOrdenesDeCompraProcesadas.html';
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
 // Función para manejar el cambio de selección
function handleBodegaChange(event) {
    ////console.log('Bodega seleccionada:', event.target.value);
    localStorage.setItem('bodega_Destino_OC',event.target.value)
  }
  // Obtener el elemento <select> y agregar el evento onchange
document.getElementById('bodegaSelectOC').addEventListener('change', handleBodegaChange);


/////////   CAMBIAR LA BODEGA DESTINO EN LA OC          /////////////////////////////////

function validaCambioBodegaDestino(){
    let bodDestino=localStorage.getItem('bodega_Destino_OC');
    let ordenDeCompra = localStorage.getItem('OrdenDeCompra');
    let embarque = localStorage.getItem('embarque');     
            if(bodDestino!= null){
                Swal.fire({
                    title: 'Sí desea aplicar el cambio de bodega de destino al embarque, presione Sí, de lo contrario de click en No o fuera del cuadro',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No',
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#6e7881",
                }).then((result) => {                   
                    if (result.isConfirmed) {  
                        ordenDeCompra="";          
                        cambiarBodegaDestino(bodDestino,embarque,ordenDeCompra);
                        localStorage.removeItem('bodega_Destino_OC');
                    } else {           
                        cambiarBodegaDestino(bodDestino,embarque,ordenDeCompra);
                        localStorage.removeItem('bodega_Destino_OC');
                    }
                });
            }else{
                Swal.fire({
                    title: 'Porfavor Seleccione una bodega',
                    icon: 'warning',
                    //showCancelButton: true,
                    confirmButtonText: 'cerrar',        
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#6e7881",
                })
            }  
}


function cambiarBodegaDestino(bodDestino, embarque, ordenDeCompra) {
    const params =
        "?Bodega=" +
        bodDestino +
        "&Embarque=" +      
        embarque +
        "&OrdenCompra=" +
        ordenDeCompra;

    fetch(env.API_URL + "wmscambiaboddestinooc" + params, myInit)
        .then((response) => response.json())
        .then((result) => {
            if (result.msg === "SUCCESS") {
                // console.log('API-Message:');
                // console.log(result.message);
                // console.log('BD-Respuesta:');
                // console.log(result.respuesta[0].mensaje);
                // console.log('Respuesta Tamaño: ');
                // console.log(result.respuesta.length);


                if(result.respuesta[0].mensaje === "OK"){
                    Swal.fire({
                                icon: 'success',
                                title: 'Cambio de bodega exitoso',
                                text: 'Cambio de bodega de destino Exitoso',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: "#28a745"
                            });
                }else{
                     if (result.respuesta.length > 0) {
                    // Construir el contenido del mensaje como una tabla
                    let contenidoHTML = `
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr>
                                   <th style="border: 1px solid #ccc; padding: 8px;">Item</th>
                                    <th style="border: 1px solid #ccc; padding: 8px;">Artículo</th>
                                   <!-- <th style="border: 1px solid #ccc; padding: 8px;">Descripción</th>-->
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    result.respuesta.forEach(ref => {
                        contenidoHTML += `
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 8px;">${ref.ITEM}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">${ref.ARTICULO}</td>
                              <!--  <td style="border: 1px solid #ccc; padding: 8px;">${ref.DESCRIPCION}</td>-->
                            </tr>
                        `;
                    });

                    contenidoHTML += `
                            </tbody>
                        </table>
                    `;

                    Swal.fire({
                        icon: 'warning',
                        title: 'Aviso',
                        html: `
                            <p>Existen ${result.respuesta.length} referencias que no están asociadas a la bodega de destino seleccionada:</p>
                            ${contenidoHTML}
                        `,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: "#28a745"
                    });
                }else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Aviso',
                        text: 'Mensaje:'+ result.respuesta[0].mensaje ,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: "#28a745"
                    });
                }
                }
            }
        });
}