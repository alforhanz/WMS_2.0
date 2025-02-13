const registrosPorPagina = 10; // Número de registros por página
let paginaActual = 1; // Página actual
let totalPaginas = 1; // Total de páginas
let datosResumen = [];  // Definir la variable global para almacenar los datos del resumen

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
     agrupadoClase.checked = true;
 
 
 
     // Agregar eventos de cambio
     tipoDetallado.addEventListener("change", actualizarEstadoAgrupado);
     tipoResumido.addEventListener("change", actualizarEstadoAgrupadodefault);
 
     // Llamar a la función una vez al inicio para asegurarse de que el estado sea correcto
     //actualizarEstadoAgrupado();

        habilitaclase();
        habilitamarca();
        habilitatipo();
        habilitaVenta();
        habilitaEnvase();
        habilitaSeis();
        limpiarTabla();    
    }); 

        function actualizarEstadoAgrupado() {
            const agrupadoClase = document.getElementById("agrupadoClase");
            const agrupadoMarca = document.getElementById("agrupadoMarca");
         const deshabilitar = tipoDetallado.checked;
         agrupadoClase.disabled = deshabilitar;
         agrupadoMarca.disabled = deshabilitar;
         agrupadoClase.checked = false;
         agrupadoMarca.checked = false;
     }

     function actualizarEstadoAgrupadodefault() {
        const agrupadoClase = document.getElementById("agrupadoClase");
        const agrupadoMarca = document.getElementById("agrupadoMarca");
     const deshabilitar = tipoDetallado.checked;
     agrupadoClase.disabled = deshabilitar;
     agrupadoMarca.disabled = deshabilitar;
     agrupadoClase.checked = true;
     agrupadoMarca.checked = false;
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

//Selecciona las los valores de los select de las clasificaciones
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

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
async function resumenGeneral(){

  const pSistema = 'WMS';
  const pUsuario = localStorage.getItem('username');
  let pTipoRpt = document.getElementById('tipoResumido').checked ? 'R' : 'D';
  const pSoloContados = document.getElementById('articulosContados').checked?'S' : 'N';
  const pFecha = document.getElementById('fecha_ini').value;
  const pBodega = document.getElementById('bodega').value;

  let pAgrupadoClase = document.getElementById('agrupadoClase').checked ? 'S' : 'N';
  let pAgrupadoMarca = document.getElementById('agrupadoMarca').checked ? 'S' : 'N';

  const pclase = document.getElementById('claseReporte').value.trim() === "" ? null : document.getElementById('claseReporte').value;
  const pmarca = document.getElementById('marcaReporte').value.trim() === "" ? null : document.getElementById('marcaReporte').value;
  const ptipo = document.getElementById('tipoReporte').value.trim() === "" ? null : document.getElementById('tipoReporte').value;
  const penvase = document.getElementById('envaseReporte').value.trim() === "" ? null : document.getElementById('envaseReporte').value;
  const pventa = document.getElementById('ventasReporte').value.trim() === "" ? null : document.getElementById('ventasReporte').value;
  const pseis = document.getElementById('seisReporte').value.trim() === "" ? null : document.getElementById('seisReporte').value;
    
  
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
          if(result.resultado.length > 0){
            datosResumen=result.resultado;
            console.log('TIPO DE REPORTE:');
            if(pTipoRpt === 'R' && pAgrupadoClase === 'S' && pAgrupadoMarca === 'S'){
                console.log('llamamos a Resumido, Clase, MArca');
                console.log(result.resultado)
                generarReporteInventarioRCM(datosResumen);
                inicializarBotonesDescarga();
              }else if(pTipoRpt === 'R' && pAgrupadoClase === 'N' && pAgrupadoMarca === 'S'){
                console.log('llamamos a Resumido, MArca');
                console.log(result.resultado)
                generarReporteInventarioRM(datosResumen)
                inicializarBotonesDescarga();
              }else if(pTipoRpt === 'R' && pAgrupadoClase === 'S' && pAgrupadoMarca === 'N'){
                console.log('llamamos a Resumido, Clase');
                console.log(result.resultado)
                generarReporteInventarioRC(datosResumen)
                inicializarBotonesDescarga();
              }else if(pTipoRpt === 'D' && pAgrupadoClase === 'N' && pAgrupadoMarca === 'N'){
                console.log('llamamos a Detallado, Todas las Clasificaciones');
                console.log(result.resultado)
                generarReporteInventarioD(datosResumen)
                inicializarBotonesDescarga();
              } 
          }else{
            Swal.fire({
                icon: "info",
                title: "Información",
                text: "No hay registros en este momento verifique los filtros de búsqueda",
                confirmButtonColor: "#28a745",
              });            
        }

          
        ocultarLoader();             
    } else {
      console.log("Error en el SP");
    }
  });  
} 


// function toggleColumnas(event) {
//     const btnRestaurar = document.getElementById("btnRestaurarColumnas");
//     btnRestaurar.hidden= false;
//     const index = event.target.dataset.index;
//     const tabla = document.getElementById("myTableresumen");
//     tabla.querySelectorAll(`th:nth-child(${+index + 1}), td:nth-child(${+index + 1})`)
//         .forEach(cell => {
//             if (cell.style.display === "none") {
//                 cell.style.display = ""; // Mostrar columna
//                 event.target.style.opacity = "1"; // Restaurar visibilidad
//                 event.target.style.background = ""; // Restaurar color original
//             } else {
//                 cell.style.display = "none"; // Ocultar columna
//                 event.target.style.opacity = "0.5"; // Indicar que está oculta
//                 event.target.style.background = "#ccc"; // Resaltar encabezado oculto
//             }
//         });
// }



// Función para restaurar todas las columnas
// function restaurarColumnas() {
//     const tabla = document.getElementById("myTableresumen");

//     tabla.querySelectorAll("th, td").forEach(cell => {
//         cell.style.display = ""; // Mostrar todas las columnas
//     });
//     // Restaurar estilos de los encabezados
//     tabla.querySelectorAll("th").forEach(th => {
//         th.style.opacity = "1";
//         th.style.background = "";
//     });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

function inicializarBotonesDescarga() {    
    const btnDescargarExcel = document.getElementById('btnDescargarExcel'); // Obtener el botón de Excel
    const btnDescargarPDF = document.getElementById('btnDescargarPDF'); // Crear el botón de PDF    
    const lblExcel = document.getElementById('lblExcel').style.display = 'block';
    const lblPDF = document.getElementById('lblPDF').style.display = 'block';
    btnDescargarExcel ? btnDescargarExcel.hidden = false : btnDescargarExcel.hidden = true;
    btnDescargarPDF ? btnDescargarPDF.hidden = false : btnDescargarPDF.hidden = true;
     
 } 
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// function descargarPDF() {
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

//   Título, subtítulo y fechas
//   const titulo = "CENTRAL DE LUBRICANTES, S.A.";
//   const subtitulo = "    Reporte de Inventario General Resumen";
//   const pBodega = document.getElementById('bodega-sucursal').textContent;
//   const fechaInventario = document.getElementById('fecha_ini').value;
//   const fechaDescarga = new Date().toLocaleDateString();

//   Obtener las cabeceras de la tabla
//   const tabla = document.getElementById("reporteInventario").querySelector("table");
//   const thead = tabla.querySelector("thead");
//   const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

//   Obtener los datos de la tabla
//   const rows = Array.from(tabla.querySelectorAll("tbody tr"));
//   const filas = rows.map(row => {
//       return Array.from(row.querySelectorAll("td")).map(td => td.textContent);
//   });
//   Función para dibujar encabezado en cada página
//   const dibujarEncabezado = () => {
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const tituloWidth = doc.getTextWidth(titulo);
//       const subtituloWidth = doc.getTextWidth(subtitulo);

//       doc.setFontSize(14);
//       doc.text(titulo, (pageWidth - tituloWidth) / 2, 30);

//       doc.setFontSize(12);
//       doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 40);

//       doc.setFontSize(9);
//       doc.text(`Agrupado por: Clase, Marca y solo contados`, 9, 55);
//       doc.text(`Bodega: B-${pBodega}  /  Fecha del inventario: ${fechaInventario}`, 9, 50);
//       doc.text(`Fecha de impresión: ${fechaDescarga}`, pageWidth - 60, 6);
//   };

//   Agregar pie de página con número de página
//   const agregarPiePagina = (data) => {
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       doc.setFontSize(7);
//       doc.text(`Página ${data.pageNumber}`, pageWidth - 20, pageHeight - 10);
//   };

//   Crear la tabla en el PDF
//   doc.autoTable({
//       head: [headers],
//       body: filas,
//       startY: 60,
//       styles: { fontSize: 8 },
//       headStyles: { 
//           fillColor: [0, 128, 0], 
//           textColor: [255, 255, 255],         
//           halign: 'center' 
//       },
//       margin: { top: 40 },
//       columnStyles: {
//           0: { halign: 'center' },
//           1: { halign: 'center' },
//           2: { halign: 'center' },
//           3: { halign: 'center' },
//           4: { halign: 'center' },
//           5: { halign: 'center' }
//       },
//       didDrawPage: (data) => {
//           dibujarEncabezado();
//           agregarPiePagina(data);
//       },
//       didParseCell: (data) => {
//         Aplicar el mismo formato del encabezado a la fila de Gran Total
//         if (data.row.index === filas.length - 1) {
//           data.cell.styles.fillColor = [0, 128, 0]; // Fondo verde
//             data.cell.styles.textColor = [255, 255, 255]; // Texto blanco
//             data.cell.styles.fontStyle = "bold";
//             data.cell.styles.halign = "center"; // Centrar texto
//         }
//     }
//   });

//   Guardar el PDF
//   doc.save("Reporte_Conteo_Inventario_General.pdf");
// }

function descargarPDF() {
  let pTipoRpt = document.getElementById('tipoResumido').checked ? 'R' : 'D';
  let pAgrupadoClase = document.getElementById('agrupadoClase').checked ? 'S' : 'N';
  let pAgrupadoMarca = document.getElementById('agrupadoMarca').checked ? 'S' : 'N';


    console.log('TIPO DE REPORTE:');
    if(pTipoRpt === 'R' && pAgrupadoClase === 'S' && pAgrupadoMarca === 'S'){
        console.log('Descarga Resumido, Clase, MArca');
        descargarPDFRCM();
      }else if(pTipoRpt === 'R' && pAgrupadoClase === 'N' && pAgrupadoMarca === 'S'){
        console.log('Descarga a Resumido, MArca');
        descargarPDFRM();
      }else if(pTipoRpt === 'R' && pAgrupadoClase === 'S' && pAgrupadoMarca === 'N'){
        console.log('Descarga a Resumido, Clase');
        descargarPDFRC();
      }else if(pTipoRpt === 'D' && pAgrupadoClase === 'N' && pAgrupadoMarca === 'N'){
        console.log('Descarga a Detallado, Todas las Clasificaciones');   
        descargarPDFDetalle()    
      } 
}
function descargarPDFRCM() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

 // Título, subtítulo y fechas
  const titulo = "CENTRAL DE LUBRICANTES, S.A.";
  const subtitulo = "    Reporte de Inventario General Resumen";
  const pBodega = document.getElementById('bodega-sucursal').textContent;
  const fechaInventario = document.getElementById('fecha_ini').value;
  const fechaDescarga = new Date().toLocaleDateString();

 // Obtener las cabeceras de la tabla
  const tabla = document.getElementById("reporteInventarioRCM").querySelector("table");
  const thead = tabla.querySelector("thead");
  const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

 // Obtener los datos de la tabla
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
      doc.text(titulo, (pageWidth - tituloWidth) / 2, 30);

      doc.setFontSize(12);
      doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 40);

      doc.setFontSize(9);
      doc.text(`Agrupado por: Clase, Marca y solo contados`, 9, 55);
      doc.text(`Bodega: B-${pBodega}  /  Fecha del inventario: ${fechaInventario}`, 9, 50);
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
      head: [headers],
      body: filas,
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { 
          fillColor: [0, 128, 0], 
          textColor: [255, 255, 255],         
          halign: 'center' 
      },
      margin: { top: 40 },
      columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center' }
      },
      didDrawPage: (data) => {
          dibujarEncabezado();
          agregarPiePagina(data);
      },
      didParseCell: (data) => {
     //   Aplicar el mismo formato del encabezado a la fila de Gran Total
        if (data.row.index === filas.length - 1) {
          data.cell.styles.fillColor = [0, 128, 0]; // Fondo verde
            data.cell.styles.textColor = [255, 255, 255]; // Texto blanco
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "center"; // Centrar texto
        }
    }
  });

 // Guardar el PDF
  doc.save("Reporte_Conteo_Inventario_General.pdf");
}
function descargarPDFRM() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

 // Título, subtítulo y fechas
  const titulo = "CENTRAL DE LUBRICANTES, S.A.";
  const subtitulo = "    Reporte de Inventario General Resumen";
  const pBodega = document.getElementById('bodega-sucursal').textContent;
  const fechaInventario = document.getElementById('fecha_ini').value;
  const fechaDescarga = new Date().toLocaleDateString();

 // Obtener las cabeceras de la tabla
  const tabla = document.getElementById("reporteInventarioRM").querySelector("table");
  const thead = tabla.querySelector("thead");
  const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

 // Obtener los datos de la tabla
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
      doc.text(titulo, (pageWidth - tituloWidth) / 2, 30);

      doc.setFontSize(12);
      doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 40);

      doc.setFontSize(9);
      doc.text(`Agrupado por: Clase, Marca y solo contados`, 9, 55);
      doc.text(`Bodega: B-${pBodega}  /  Fecha del inventario: ${fechaInventario}`, 9, 50);
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
      head: [headers],
      body: filas,
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { 
          fillColor: [0, 128, 0], 
          textColor: [255, 255, 255],         
          halign: 'center' 
      },
      margin: { top: 40 },
      columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center' }
      },
      didDrawPage: (data) => {
          dibujarEncabezado();
          agregarPiePagina(data);
      },
      didParseCell: (data) => {
     //   Aplicar el mismo formato del encabezado a la fila de Gran Total
        if (data.row.index === filas.length - 1) {
          data.cell.styles.fillColor = [0, 128, 0]; // Fondo verde
            data.cell.styles.textColor = [255, 255, 255]; // Texto blanco
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "center"; // Centrar texto
        }
    }
  });

 // Guardar el PDF
  doc.save("Reporte_Conteo_Inventario_General.pdf");
}
function descargarPDFRC() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

 // Título, subtítulo y fechas
  const titulo = "CENTRAL DE LUBRICANTES, S.A.";
  const subtitulo = "    Reporte de Inventario General Resumen";
  const pBodega = document.getElementById('bodega-sucursal').textContent;
  const fechaInventario = document.getElementById('fecha_ini').value;
  const fechaDescarga = new Date().toLocaleDateString();

 // Obtener las cabeceras de la tabla
  const tabla = document.getElementById("reporteInventarioRC").querySelector("table");
  const thead = tabla.querySelector("thead");
  const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

 // Obtener los datos de la tabla
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
      doc.text(titulo, (pageWidth - tituloWidth) / 2, 30);

      doc.setFontSize(12);
      doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 40);

      doc.setFontSize(9);
      doc.text(`Agrupado por: Clase, Marca y solo contados`, 9, 55);
      doc.text(`Bodega: B-${pBodega}  /  Fecha del inventario: ${fechaInventario}`, 9, 50);
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
      head: [headers],
      body: filas,
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { 
          fillColor: [0, 128, 0], 
          textColor: [255, 255, 255],         
          halign: 'center' 
      },
      margin: { top: 40 },
      columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center' }
      },
      didDrawPage: (data) => {
          dibujarEncabezado();
          agregarPiePagina(data);
      },
      didParseCell: (data) => {
     //   Aplicar el mismo formato del encabezado a la fila de Gran Total
        if (data.row.index === filas.length - 1) {
          data.cell.styles.fillColor = [0, 128, 0]; // Fondo verde
            data.cell.styles.textColor = [255, 255, 255]; // Texto blanco
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "center"; // Centrar texto
        }
    }
  });

 // Guardar el PDF
  doc.save("Reporte_Conteo_Inventario_General.pdf");
}
// function descargarPDFDetalle() { 
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('l', 'mm', 'a4'); 

//   // Obtener la fecha actual de impresión
//   const fechaImpresion = new Date().toLocaleDateString();

//   // Verificar cuál es el reporte visible
//   let tablaVisible = null;

//   // Verificar qué div tiene la propiedad display: block
//   const reportes = [
//     { id: 'reporteInventarioRCM', tabla: 'tablaReporteRCM' },
//     { id: 'reporteInventarioRM', tabla: 'tablaReporteRM' },
//     { id: 'reporteInventarioRC', tabla: 'tablaReporteRC' },
//     { id: 'reporteInventarioD', tabla: 'tablaReporteD' }
//   ];

//   // Recorremos los reportes y verificamos si el contenedor está visible
//   reportes.forEach(reporte => {
//     const divReporte = document.getElementById(reporte.id);
//     if (divReporte && divReporte.style.display !== 'none') {
//       tablaVisible = reporte.tabla;
//     }
//   });

//   // Si se encontró una tabla visible, procedemos con la generación del PDF
//   if (tablaVisible) {
//     const tabla = document.getElementById(tablaVisible);
//     if (tabla) {
//       // Configuración de márgenes
//       const margenIzquierdo = 10;
//       let y = 10; // Posición inicial en Y

//       // Agregar la fecha de impresión alineada a la derecha
//       doc.setFontSize(10);
//       const pageWidth = doc.internal.pageSize.getWidth();
//       doc.text(`Fecha de impresión: ${fechaImpresion}`, pageWidth - 48, y);
      
//       // Espacio entre líneas
//       y += 10;

//       // Agregar el título centrado
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text("CENTRAL DE LUBRICANTES, S.A.", pageWidth / 2, y, { align: "center" });

//       // Espacio entre líneas
//       y += 10;

//       // Agregar el subtítulo centrado
//       doc.setFontSize(12);
//       doc.text("Reporte de Inventario General Detallado Por Bodega, Clase y Marca", pageWidth / 2, y, { align: "center" });

//       // Espacio entre líneas
//       y += 10;

//       // Información del reporte
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       doc.text(`Fecha inventario: 2024-02-07    Bodega: 81 Centro de Distribucion (CEDI)    Clase Marca`, margenIzquierdo, y);

//       // Espacio antes de la tabla
//       y += 10;

//       // Usando el plugin autotable para agregar la tabla al PDF
//       doc.autoTable({
//         html: `#${tablaVisible}`,
//         startY: y,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255], halign: 'center' }
//       });

//       // Guardamos el archivo PDF
//       doc.save('Reporte_Inventario_General_Detallado.pdf');  
//     }
//   } else {
//     alert("No hay tabla visible para generar el reporte.");
//   }
// }

// function descargarPDFDetalle() { 
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('l', 'mm', 'a4');
//   // Obtener la fecha actual de impresión
//   const fechaImpresion = new Date().toLocaleDateString();

//   // Verificar cuál es el reporte visible
//   let tablaVisible = null;

//   const reportes = [
//     { id: 'reporteInventarioRCM', tabla: 'tablaReporteRCM' },
//     { id: 'reporteInventarioRM', tabla: 'tablaReporteRM' },
//     { id: 'reporteInventarioRC', tabla: 'tablaReporteRC' },
//     { id: 'reporteInventarioD', tabla: 'tablaReporteD' }
//   ];

//   reportes.forEach(reporte => {
//     const divReporte = document.getElementById(reporte.id);
//     if (divReporte && divReporte.style.display !== 'none') {
//       tablaVisible = reporte.tabla;
//     }
//   });

//   if (tablaVisible) {
//     const tabla = document.getElementById(tablaVisible);
//     if (tabla) {
//       const margenIzquierdo = 10;
//       let y = 10;

//       // Agregar la fecha de impresión alineada a la derecha
//       doc.setFontSize(10);
//       const pageWidth = doc.internal.pageSize.getWidth();
//       doc.text(`Fecha de impresión: ${fechaImpresion}`, pageWidth - 48, y);
      
//       y += 10;

//       // Agregar el título centrado
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text("CENTRAL DE LUBRICANTES, S.A.", pageWidth / 2, y, { align: "center" });

//       y += 10;

//       // Agregar el subtítulo centrado
//       doc.setFontSize(12);
//       doc.text("Reporte de Inventario General Detallado Por Bodega, Clase y Marca", pageWidth / 2, y, { align: "center" });

//       y += 10;

//       // Información del reporte
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       doc.text(`Fecha inventario: 2024-02-07    Bodega: 81 Centro de Distribucion (CEDI)    Clase Marca`, margenIzquierdo, y);

//       y += 10;

//       // Extraer los encabezados de la tabla
//       const encabezados = [];
//       const filas = [];
//       const thead = tabla.querySelector("thead tr");
//       if (thead) {
//         thead.querySelectorAll("th").forEach(th => {
//           encabezados.push(th.innerText.trim()); // Trim para limpiar espacios
//         });
//       }

//       // Extraer el contenido de la tabla
//       tabla.querySelectorAll("tbody tr").forEach(row => {
//         const fila = [];
//         row.querySelectorAll("td").forEach(td => {
//           fila.push(td.innerText.trim()); // Trim para limpiar espacios
//         });
//         filas.push(fila);
//       });

//       // Ajustar la tabla al ancho de la página
//       doc.autoTable({
//         head: [encabezados],
//         body: filas,
//         startY: y,
//         tableWidth: 'auto',  // Ajusta el ancho de la tabla a la página
//         columnWidth: 'wrap', // Ajusta automáticamente las columnas
//         styles: { fontSize: 8, cellPadding: 2 }, // Reducimos el tamaño de la fuente
//         headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255], halign: 'center' },
//         margin: { left: 10, right: 10 }, // Márgenes
//         didDrawCell: (data) => {
//           if (data.column.index === encabezados.length - 1 && data.cell.text.length > 15) {
//             data.cell.styles.cellWidth = 'wrap'; // Envuelve el texto en celdas largas
//           }
//         }
//       });

//       // Guardamos el archivo PDF
//       doc.save('Reporte_Inventario_General_Detallado.pdf');  
//     }
//   } else {
//     alert("No hay tabla visible para generar el reporte.");
//   }
// }

/////////////////////////////////////////////////////////////////
// function descargarPDFDetalle() { 
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('l', 'mm', 'a4'); 

//   // Obtener la fecha actual de impresión
//   const fechaImpresion = new Date().toLocaleDateString();

//   // Identificar la tabla visible
//   const tabla = document.getElementById('tablaReporteD');

//   if (tabla) {
//     // Configuración de márgenes
//     const margenIzquierdo = 10;
//     let y = 10; // Posición inicial en Y

//     // Agregar la fecha de impresión alineada a la derecha
//     doc.setFontSize(10);
//     const pageWidth = doc.internal.pageSize.getWidth();
//     doc.text(`Fecha de impresión: ${fechaImpresion}`, pageWidth - 48, y);
    
//     // Espacio entre líneas
//     y += 10;

//     // Agregar el título centrado
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("CENTRAL DE LUBRICANTES, S.A.", pageWidth / 2, y, { align: "center" });

//     // Espacio entre líneas
//     y += 10;

//     // Agregar el subtítulo centrado
//     doc.setFontSize(12);
//     doc.text("Reporte de Inventario General Detallado Por Bodega, Clase y Marca", pageWidth / 2, y, { align: "center" });

//     // Espacio entre líneas
//     y += 10;

//     // Información del reporte
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Fecha inventario: 2024-02-07    Bodega: 81 Centro de Distribucion (CEDI)    Clase Marca`, margenIzquierdo, y);

//     // Espacio antes de la tabla
//     y += 10;

//     // Usando el plugin autotable para agregar la tabla al PDF
//     doc.autoTable({
//       html: `#tablaReporteD`,
//       startY: y,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255], halign: 'center' }
//     });

//     // Guardamos el archivo PDF
//     doc.save('Reporte_Inventario_General_Detallado.pdf');  
//   } else {
//     alert("No hay tabla visible para generar el reporte.");
//   }
// }

// function descargarPDFDetalle() {
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('l', 'mm', 'a4');

//   // Obtener la fecha actual de impresión
//   const fechaImpresion = new Date().toLocaleDateString();
  
//   // Configuración de márgenes y posición inicial
//   const margenIzquierdo = 10;
//   let y = 10; 

//   const pageWidth = doc.internal.pageSize.getWidth();

//   // Agregar la fecha de impresión alineada a la derecha
//   doc.setFontSize(10);
//   doc.text(`Fecha de impresión: ${fechaImpresion}`, pageWidth - 48, y);
  
//   y += 10;

//   // Agregar el título centrado
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text("CENTRAL DE LUBRICANTES, S.A.", pageWidth / 2, y, { align: "center" });

//   y += 10;

//   // Agregar el subtítulo centrado
//   doc.setFontSize(12);
//   doc.text("Reporte de Inventario General Detallado Por Bodega, Clase y Marca", pageWidth / 2, y, { align: "center" });

//   y += 10;

//   // Información del reporte
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Fecha inventario: 2024-02-07    Bodega: 81 Centro de Distribucion (CEDI)    Clase Marca`, margenIzquierdo, y);

//   y += 10;

//   // Obtener la tabla desde el DOM
//   const tabla = document.querySelector("#tablaReporteD");

//   if (tabla) {
//     let encabezados = [];
//     let filas = [];

//     // Extraer los encabezados de la tabla
//     const thead = tabla.closest("table").querySelector("thead tr");
//     if (thead) {
//       thead.querySelectorAll("th").forEach(th => {
//         encabezados.push(th.innerText.trim());
//       });
//     }

//     // Extraer las filas de datos
//     tabla.querySelectorAll("tr").forEach(row => {
//       let fila = [];
//       row.querySelectorAll("td").forEach(td => {
//         fila.push(td.innerText.trim());
//       });
//       filas.push(fila);
//     });

//     // Agregar la tabla al PDF
//     doc.autoTable({
//       head: [encabezados],
//       body: filas,
//       startY: y,
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255], halign: 'center' },
//       margin: { left: 10, right: 10 }
//     });

//     // Guardamos el archivo PDF
//     doc.save('Reporte_Inventario_General_Detallado.pdf');  
//   } else {
//     alert("No se encontró la tabla para generar el reporte.");
//   }
// }


function descargarPDFDetalle() { 
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4');

  // Obtener la fecha actual
  const fechaImpresion = new Date().toLocaleDateString();

  // Configuración de márgenes y posiciones
  const margenIzquierdo = 10;
  let y = 10; 

  // Agregar la fecha de impresión alineada a la derecha
  doc.setFontSize(10);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(`Fecha de impresión: ${fechaImpresion}`, pageWidth - 48, y);
  
  y += 10;

  // Título
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CENTRAL DE LUBRICANTES, S.A.", pageWidth / 2, y, { align: "center" });

  y += 10;

  // Subtítulo
  doc.setFontSize(12);
  doc.text("Reporte de Inventario General Detallado Por Bodega, Clase y Marca", pageWidth / 2, y, { align: "center" });

  y += 10;

  // Información del reporte
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha inventario: 2024-02-07    Bodega: 81 Centro de Distribucion (CEDI)    Clase Marca", margenIzquierdo, y);

  y += 10;

  // Obtener la tabla y procesar filas manualmente
  const tabla = document.getElementById("tablaReporteD");

  if (tabla) {
    let encabezados = [];
    let datos = [];

    // Obtener los encabezados desde el thead
    const thead = tabla.closest("table").querySelector("thead");
    if (thead) {
      encabezados = [...thead.querySelectorAll("th")].map(th => th.innerText);
    }

    // Obtener los datos de cada fila
    const filas = tabla.querySelectorAll("tr");
    filas.forEach(fila => {
      const celdas = [...fila.querySelectorAll("td")].map(td => td.innerText);
      if (celdas.length > 0) datos.push(celdas);
    });

    // Generar la tabla en el PDF con autoTable
    doc.autoTable({
      head: [encabezados],
      body: datos,
      startY: y,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255], halign: "center" }
    });

    // Guardar el archivo PDF
    doc.save("Reporte_Inventario_General_Detallado.pdf");
  } else {
    alert("No se encontró la tabla para generar el reporte.");
  }
}


function encabezadoReporte(){

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
  const tablas = [
      { id: "myTableresumen", tbody: "tblbodyRersumen", div: "tabla-resumen" },
      { id: "tablaReporteRCM", tbody: "tablaReporteRCM", div: "reporteInventarioRCM" },
      { id: "tablaReporteRM", tbody: "tablaReporteRM", div: "reporteInventarioRM" },
      { id: "tablaReporteRC", tbody: "tablaReporteRC", div: "reporteInventarioRC" },
      { id: "tablaReporteD", tbody: "tablaReporteD", div: "reporteInventarioD" }
  ];

  const labelCantidad = document.getElementById("cantidadDeRegistros");
  if (labelCantidad) {
      labelCantidad.innerHTML = "";
  }

  tablas.forEach(tablaInfo => {
      const tabla = document.getElementById(tablaInfo.id);
      const tbody = document.getElementById(tablaInfo.tbody);
      const divTabla = document.getElementById(tablaInfo.div);

      if (tabla && tbody) {
          tbody.innerHTML = "";
      }

      if (divTabla) {
          divTabla.style.display = "none"; // Oculta la tabla
      }
  });
}

function generarReporteInventarioRCM(datos) {
  const tablaReporte = document.getElementById("tablaReporteRCM");
  tablaReporte.innerHTML = ""; // Limpiar la tabla antes de empezar

  let granTotalSistema = 0, granTotalConteo = 0, granTotalDiferencia = 0, 
      granTotalCantSistema = 0, granTotalCantContada = 0;

  const marcasAgrupadas = datos.reduce((acc, item) => {
      const key = `${item.MARCA}-${item.CLASE}`;
      if (!acc[key]) {
          acc[key] = {
              MARCA: item.MARCA,
              CLASE: item.CLASE,
              SISTEMA: 0,
              CONTEO: 0,
              DIFERENCIA: 0,
              CANTIDAD_SISTEMA: 0,
              CANTIDAD_CONTEO: 0
          };
      }
      acc[key].SISTEMA += parseFloat(item.SISTEMA) || 0;
      acc[key].CONTEO += parseFloat(item.CONTEO) || 0;
      acc[key].DIFERENCIA += parseFloat(item.DIFERENCIA) || 0;
      acc[key].CANTIDAD_SISTEMA += parseFloat(item.CANTIDAD_SISTEMA) || 0;
      acc[key].CANTIDAD_CONTEO += parseFloat(item.CANTIDAD_CONTEO) || 0;
      return acc;
  }, {});

  const fragmento = document.createDocumentFragment(); // Mejor rendimiento en el DOM

  const marcasOrdenadas = Object.values(marcasAgrupadas).reduce((acc, item) => {
      acc[item.MARCA] = acc[item.MARCA] || [];
      acc[item.MARCA].push(item);
      return acc;
  }, {});

  Object.entries(marcasOrdenadas).forEach(([marca, items]) => {
      let subtotalSistema = 0, subtotalConteo = 0, subtotalDiferencia = 0, 
          subtotalCantSistema = 0, subtotalCantContada = 0;

      let rowMarca = document.createElement("tr");
      rowMarca.classList.add("fila-marca");
      rowMarca.innerHTML = `<td colspan="6">${marca}</td>`;
      fragmento.appendChild(rowMarca);

      items.forEach(item => {
          subtotalSistema += item.SISTEMA;
          subtotalConteo += item.CONTEO;
          subtotalDiferencia += item.DIFERENCIA;
          subtotalCantSistema += item.CANTIDAD_SISTEMA;
          subtotalCantContada += item.CANTIDAD_CONTEO;

          let row = document.createElement("tr");
          row.innerHTML = `
              <td>${item.CLASE}</td>
              <td>${item.SISTEMA.toFixed(2)}</td>
              <td>${item.CONTEO.toFixed(2)}</td>
              <td>${item.DIFERENCIA.toFixed(2)}</td>
              <td>${item.CANTIDAD_SISTEMA.toFixed(2)}</td>
              <td>${item.CANTIDAD_CONTEO.toFixed(2)}</td>
          `;
          fragmento.appendChild(row);
      });

      let rowSubtotal = document.createElement("tr");
      rowSubtotal.classList.add("fila-subtotal");
      rowSubtotal.innerHTML = `
          <td>Subtotal</td>
          <td>${subtotalSistema.toFixed(2)}</td>
          <td>${subtotalConteo.toFixed(2)}</td>
          <td>${subtotalDiferencia.toFixed(2)}</td>
          <td>${subtotalCantSistema.toFixed(2)}</td>
          <td>${subtotalCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowSubtotal);

      let rowTotalMarca = document.createElement("tr");
      rowTotalMarca.classList.add("fila-total");
      rowTotalMarca.innerHTML = `
          <td>Total ${marca}:</td>
          <td>${subtotalSistema.toFixed(2)}</td>
          <td>${subtotalConteo.toFixed(2)}</td>
          <td>${subtotalDiferencia.toFixed(2)}</td>
          <td>${subtotalCantSistema.toFixed(2)}</td>
          <td>${subtotalCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowTotalMarca);

      granTotalSistema += subtotalSistema;
      granTotalConteo += subtotalConteo;
      granTotalDiferencia += subtotalDiferencia;
      granTotalCantSistema += subtotalCantSistema;
      granTotalCantContada += subtotalCantContada;
  });

  let rowGranTotal = document.createElement("tr");
  rowGranTotal.classList.add("fila-gran-total");
  rowGranTotal.innerHTML = `
      <td>Gran Total</td>
      <td>${granTotalSistema.toFixed(2)}</td>
      <td>${granTotalConteo.toFixed(2)}</td>
      <td>${granTotalDiferencia.toFixed(2)}</td>
      <td>${granTotalCantSistema.toFixed(2)}</td>
      <td>${granTotalCantContada.toFixed(2)}</td>
  `;
  fragmento.appendChild(rowGranTotal);

  tablaReporte.appendChild(fragmento); // Inserción única en el DOM

  ocultarLoader();
  document.getElementById("reporteInventarioRCM").style.display = "block";
}

function generarReporteInventarioRM(datos) {
  const tablaReporte = document.getElementById("tablaReporteRM");
  tablaReporte.innerHTML = ""; // Limpiar la tabla antes de empezar

  let granTotalSistema = 0, granTotalConteo = 0, granTotalDiferencia = 0, 
      granTotalCantSistema = 0, granTotalCantContada = 0;

  const marcasAgrupadas = datos.reduce((acc, item) => {
      const key = `${item.MARCA}-${item.CLASE}`;
      if (!acc[key]) {
          acc[key] = {
              MARCA: item.MARCA,
              CLASE: item.CLASE,
              SISTEMA: 0,
              CONTEO: 0,
              DIFERENCIA: 0,
              CANTIDAD_SISTEMA: 0,
              CANTIDAD_CONTEO: 0
          };
      }
      acc[key].SISTEMA += parseFloat(item.SISTEMA) || 0;
      acc[key].CONTEO += parseFloat(item.CONTEO) || 0;
      acc[key].DIFERENCIA += parseFloat(item.DIFERENCIA) || 0;
      acc[key].CANTIDAD_SISTEMA += parseFloat(item.CANTIDAD_SISTEMA) || 0;
      acc[key].CANTIDAD_CONTEO += parseFloat(item.CANTIDAD_CONTEO) || 0;
      return acc;
  }, {});

  const fragmento = document.createDocumentFragment(); // Mejor rendimiento en el DOM

  const marcasOrdenadas = Object.values(marcasAgrupadas).reduce((acc, item) => {
      acc[item.MARCA] = acc[item.MARCA] || [];
      acc[item.MARCA].push(item);
      return acc;
  }, {});

  Object.entries(marcasOrdenadas).forEach(([marca, items]) => {
      let subtotalSistema = 0, subtotalConteo = 0, subtotalDiferencia = 0, 
          subtotalCantSistema = 0, subtotalCantContada = 0;

      // let rowMarca = document.createElement("tr");
      // rowMarca.classList.add("fila-marca");
      // rowMarca.innerHTML = `<td colspan="6">${marca}</td>`;
      // fragmento.appendChild(rowMarca);

      items.forEach(item => {
          subtotalSistema += item.SISTEMA;
          subtotalConteo += item.CONTEO;
          subtotalDiferencia += item.DIFERENCIA;
          subtotalCantSistema += item.CANTIDAD_SISTEMA;
          subtotalCantContada += item.CANTIDAD_CONTEO;

          let row = document.createElement("tr");
          row.innerHTML = `
              <td>${item.CLASE}</td>
              <td>${item.SISTEMA.toFixed(2)}</td>
              <td>${item.CONTEO.toFixed(2)}</td>
              <td>${item.DIFERENCIA.toFixed(2)}</td>
              <td>${item.CANTIDAD_SISTEMA.toFixed(2)}</td>
              <td>${item.CANTIDAD_CONTEO.toFixed(2)}</td>
          `;
          fragmento.appendChild(row);
      });

      let rowSubtotal = document.createElement("tr");
      rowSubtotal.classList.add("fila-subtotal");
      rowSubtotal.innerHTML = `
          <td>Subtotal</td>
          <td>${subtotalSistema.toFixed(2)}</td>
          <td>${subtotalConteo.toFixed(2)}</td>
          <td>${subtotalDiferencia.toFixed(2)}</td>
          <td>${subtotalCantSistema.toFixed(2)}</td>
          <td>${subtotalCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowSubtotal);

      let rowTotalMarca = document.createElement("tr");
      rowTotalMarca.classList.add("fila-total");
      rowTotalMarca.innerHTML = `
          <td>Total ${marca}:</td>
          <td>${subtotalSistema.toFixed(2)}</td>
          <td>${subtotalConteo.toFixed(2)}</td>
          <td>${subtotalDiferencia.toFixed(2)}</td>
          <td>${subtotalCantSistema.toFixed(2)}</td>
          <td>${subtotalCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowTotalMarca);

      granTotalSistema += subtotalSistema;
      granTotalConteo += subtotalConteo;
      granTotalDiferencia += subtotalDiferencia;
      granTotalCantSistema += subtotalCantSistema;
      granTotalCantContada += subtotalCantContada;
  });

  let rowGranTotal = document.createElement("tr");
  rowGranTotal.classList.add("fila-gran-total");
  rowGranTotal.innerHTML = `
      <td>Gran Total</td>
      <td>${granTotalSistema.toFixed(2)}</td>
      <td>${granTotalConteo.toFixed(2)}</td>
      <td>${granTotalDiferencia.toFixed(2)}</td>
      <td>${granTotalCantSistema.toFixed(2)}</td>
      <td>${granTotalCantContada.toFixed(2)}</td>
  `;
  fragmento.appendChild(rowGranTotal);

  tablaReporte.appendChild(fragmento); // Inserción única en el DOM

  ocultarLoader();
  document.getElementById("reporteInventarioRM").style.display = "block";
}

function generarReporteInventarioRC(datos) {
  const tablaReporte = document.getElementById("tablaReporteRC");
  tablaReporte.innerHTML = ""; // Limpiar la tabla antes de empezar

  let granTotalSistema = 0, granTotalConteo = 0, granTotalDiferencia = 0, 
      granTotalCantSistema = 0, granTotalCantContada = 0;

  const marcasAgrupadas = datos.reduce((acc, item) => {
      const key = `${item.MARCA}-${item.CLASE}`;
      if (!acc[key]) {
          acc[key] = {
              MARCA: item.MARCA,
              CLASE: item.CLASE,
              SISTEMA: 0,
              CONTEO: 0,
              DIFERENCIA: 0,
              CANTIDAD_SISTEMA: 0,
              CANTIDAD_CONTEO: 0
          };
      }
      acc[key].SISTEMA += parseFloat(item.SISTEMA) || 0;
      acc[key].CONTEO += parseFloat(item.CONTEO) || 0;
      acc[key].DIFERENCIA += parseFloat(item.DIFERENCIA) || 0;
      acc[key].CANTIDAD_SISTEMA += parseFloat(item.CANTIDAD_SISTEMA) || 0;
      acc[key].CANTIDAD_CONTEO += parseFloat(item.CANTIDAD_CONTEO) || 0;
      return acc;
  }, {});

  const fragmento = document.createDocumentFragment(); // Mejor rendimiento en el DOM

  const marcasOrdenadas = Object.values(marcasAgrupadas).reduce((acc, item) => {
      acc[item.MARCA] = acc[item.MARCA] || [];
      acc[item.MARCA].push(item);
      return acc;
  }, {});

  Object.entries(marcasOrdenadas).forEach(([marca, items]) => {
      let subtotalSistema = 0, subtotalConteo = 0, subtotalDiferencia = 0, 
          subtotalCantSistema = 0, subtotalCantContada = 0;

      // let rowMarca = document.createElement("tr");
      // rowMarca.classList.add("fila-marca");
      // rowMarca.innerHTML = `<td colspan="6">${clase}</td>`;
      // fragmento.appendChild(rowMarca);

      items.forEach(item => {
          subtotalSistema += item.SISTEMA;
          subtotalConteo += item.CONTEO;
          subtotalDiferencia += item.DIFERENCIA;
          subtotalCantSistema += item.CANTIDAD_SISTEMA;
          subtotalCantContada += item.CANTIDAD_CONTEO;

          let row = document.createElement("tr");
          row.innerHTML = `
              <td>${item.CLASE}</td>
              <td>${item.SISTEMA.toFixed(2)}</td>
              <td>${item.CONTEO.toFixed(2)}</td>
              <td>${item.DIFERENCIA.toFixed(2)}</td>
              <td>${item.CANTIDAD_SISTEMA.toFixed(2)}</td>
              <td>${item.CANTIDAD_CONTEO.toFixed(2)}</td>
          `;
          fragmento.appendChild(row);
      });

      let rowSubtotal = document.createElement("tr");
      rowSubtotal.classList.add("fila-subtotal");
      rowSubtotal.innerHTML = `
          <td>Subtotal</td>
          <td>${subtotalSistema.toFixed(2)}</td>
          <td>${subtotalConteo.toFixed(2)}</td>
          <td>${subtotalDiferencia.toFixed(2)}</td>
          <td>${subtotalCantSistema.toFixed(2)}</td>
          <td>${subtotalCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowSubtotal);

      let rowTotalMarca = document.createElement("tr");
      rowTotalMarca.classList.add("fila-total");
      rowTotalMarca.innerHTML = `
          <td>Total ${marca}:</td>
          <td>${subtotalSistema.toFixed(2)}</td>
          <td>${subtotalConteo.toFixed(2)}</td>
          <td>${subtotalDiferencia.toFixed(2)}</td>
          <td>${subtotalCantSistema.toFixed(2)}</td>
          <td>${subtotalCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowTotalMarca);

      granTotalSistema += subtotalSistema;
      granTotalConteo += subtotalConteo;
      granTotalDiferencia += subtotalDiferencia;
      granTotalCantSistema += subtotalCantSistema;
      granTotalCantContada += subtotalCantContada;
  });

  let rowGranTotal = document.createElement("tr");
  rowGranTotal.classList.add("fila-gran-total");
  rowGranTotal.innerHTML = `
      <td>Gran Total</td>
      <td>${granTotalSistema.toFixed(2)}</td>
      <td>${granTotalConteo.toFixed(2)}</td>
      <td>${granTotalDiferencia.toFixed(2)}</td>
      <td>${granTotalCantSistema.toFixed(2)}</td>
      <td>${granTotalCantContada.toFixed(2)}</td>
  `;
  fragmento.appendChild(rowGranTotal);

  tablaReporte.appendChild(fragmento); // Inserción única en el DOM

  ocultarLoader();
  document.getElementById("reporteInventarioRC").style.display = "block";
}

function generarReporteInventarioD(datos) {
  const tablaReporte = document.getElementById("tablaReporteD");
  tablaReporte.innerHTML = ""; // Limpiar la tabla antes de empezar

  let granTotalSistema = 0, granTotalConteo = 0, granTotalDiferencia = 0, 
      granTotalCantSistema = 0, granTotalCantContada = 0;

  const marcasAgrupadas = datos.reduce((acc, item) => {
      const key = `${item.MARCA}-${item.CLASE}`;
      if (!acc[key]) {
          acc[key] = {
              MARCA: item.MARCA,
              CLASE: item.CLASE,
              SISTEMA: 0,
              CONTEO: 0,
              DIFERENCIA: 0,
              CANTIDAD_SISTEMA: 0,
              CANTIDAD_CONTEO: 0,
              ARTICULOS: []
          };
      }
      acc[key].SISTEMA += parseFloat(item.SISTEMA) || 0;
      acc[key].CONTEO += parseFloat(item.CONTEO) || 0;
      acc[key].DIFERENCIA += parseFloat(item.DIFERENCIA) || 0;
      acc[key].CANTIDAD_SISTEMA += parseFloat(item.CANTIDAD_SISTEMA) || 0;
      acc[key].CANTIDAD_CONTEO += parseFloat(item.CANTIDAD_CONTEO) || 0;
      acc[key].ARTICULOS.push(item);
      return acc;
  }, {});

  const fragmento = document.createDocumentFragment(); // Mejor rendimiento en el DOM

  let rowBodega = document.createElement("tr");
  rowBodega.innerHTML = `<td colspan="7">BODEGA 81 CENTRO DE DISTRIBUCION (CEDI)</td>`;
  fragmento.appendChild(rowBodega);

  let subtotalBodegaSistema = 0, subtotalBodegaConteo = 0, subtotalBodegaDiferencia = 0, 
      subtotalBodegaCantSistema = 0, subtotalBodegaCantContada = 0;

  const clasesAgrupadas = {};
  Object.values(marcasAgrupadas).forEach(item => {
      if (!clasesAgrupadas[item.CLASE]) {
          clasesAgrupadas[item.CLASE] = [];
      }
      clasesAgrupadas[item.CLASE].push(item);
  });

  Object.entries(clasesAgrupadas).forEach(([clase, marcas]) => {
      let rowClase = document.createElement("tr");
      rowClase.innerHTML = `<td colspan="7">CLASE ${clase}</td>`;
      fragmento.appendChild(rowClase);

      let subtotalClaseSistema = 0, subtotalClaseConteo = 0, subtotalClaseDiferencia = 0, 
          subtotalClaseCantSistema = 0, subtotalClaseCantContada = 0;

      marcas.forEach(marca => {
          let rowMarca = document.createElement("tr");
          rowMarca.innerHTML = `<td colspan="7">MARCA ${marca.MARCA}</td>`;
          fragmento.appendChild(rowMarca);

          let subtotalSistema = 0, subtotalConteo = 0, subtotalDiferencia = 0, 
              subtotalCantSistema = 0, subtotalCantContada = 0;

          marca.ARTICULOS.forEach(item => {
              let row = document.createElement("tr");
              row.innerHTML = `
                  <td>${item.Articulos}</td>
                  <td>${item.DESCRIPCION}</td>
                  <td>${parseFloat(item.SISTEMA).toFixed(2)}</td>
                  <td>${parseFloat(item.CONTEO).toFixed(2)}</td>
                  <td>${parseFloat(item.DIFERENCIA).toFixed(2)}</td>
                  <td>${parseFloat(item.CANTIDAD_SISTEMA).toFixed(2)}</td>
                  <td>${parseFloat(item.CANTIDAD_CONTEO).toFixed(2)}</td>
              `;
              fragmento.appendChild(row);

              subtotalSistema += parseFloat(item.SISTEMA) || 0;
              subtotalConteo += parseFloat(item.CONTEO) || 0;
              subtotalDiferencia += parseFloat(item.DIFERENCIA) || 0;
              subtotalCantSistema += parseFloat(item.CANTIDAD_SISTEMA) || 0;
              subtotalCantContada += parseFloat(item.CANTIDAD_CONTEO) || 0;
          });

          let rowSubtotalMarca = document.createElement("tr");
          rowSubtotalMarca.innerHTML = `
              <td colspan="2">SubTotal MARCA ${marca.MARCA}:</td>
              <td>${subtotalSistema.toFixed(2)}</td>
              <td>${subtotalConteo.toFixed(2)}</td>
              <td>${subtotalDiferencia.toFixed(2)}</td>
              <td>${subtotalCantSistema.toFixed(2)}</td>
              <td>${subtotalCantContada.toFixed(2)}</td>
          `;
          fragmento.appendChild(rowSubtotalMarca);

          subtotalClaseSistema += subtotalSistema;
          subtotalClaseConteo += subtotalConteo;
          subtotalClaseDiferencia += subtotalDiferencia;
          subtotalClaseCantSistema += subtotalCantSistema;
          subtotalClaseCantContada += subtotalCantContada;
      });

      let rowSubtotalClase = document.createElement("tr");
      rowSubtotalClase.innerHTML = `
          <td colspan="2">SubTotal CLASE ${clase}:</td>
          <td>${subtotalClaseSistema.toFixed(2)}</td>
          <td>${subtotalClaseConteo.toFixed(2)}</td>
          <td>${subtotalClaseDiferencia.toFixed(2)}</td>
          <td>${subtotalClaseCantSistema.toFixed(2)}</td>
          <td>${subtotalClaseCantContada.toFixed(2)}</td>
      `;
      fragmento.appendChild(rowSubtotalClase);

      subtotalBodegaSistema += subtotalClaseSistema;
      subtotalBodegaConteo += subtotalClaseConteo;
      subtotalBodegaDiferencia += subtotalClaseDiferencia;
      subtotalBodegaCantSistema += subtotalClaseCantSistema;
      subtotalBodegaCantContada += subtotalClaseCantContada;

      granTotalSistema += subtotalClaseSistema;
      granTotalConteo += subtotalClaseConteo;
      granTotalDiferencia += subtotalClaseDiferencia;
      granTotalCantSistema += subtotalClaseCantSistema;
      granTotalCantContada += subtotalClaseCantContada;
  });

  let rowSubtotalBodega = document.createElement("tr");
  rowSubtotalBodega.innerHTML = `
      <td colspan="2">SubTotal BODEGA 81 CENTRO DE DISTRIBUCION (CEDI):</td>
      <td>${subtotalBodegaSistema.toFixed(2)}</td>
      <td>${subtotalBodegaConteo.toFixed(2)}</td>
      <td>${subtotalBodegaDiferencia.toFixed(2)}</td>
      <td>${subtotalBodegaCantSistema.toFixed(2)}</td>
      <td>${subtotalBodegaCantContada.toFixed(2)}</td>
  `;
  fragmento.appendChild(rowSubtotalBodega);

  let rowGranTotal = document.createElement("tr");
    rowGranTotal.innerHTML = `
        <td colspan="2">Gran Total:</td>
        <td>${granTotalSistema.toFixed(2)}</td>
        <td>${granTotalConteo.toFixed(2)}</td>
        <td>${granTotalDiferencia.toFixed(2)}</td>
        <td>${granTotalCantSistema.toFixed(2)}</td>
        <td>${granTotalCantContada.toFixed(2)}</td>
    `;
    fragmento.appendChild(rowGranTotal);

  tablaReporte.appendChild(fragmento); // Inserción única en el DOM
  ocultarLoader();
  document.getElementById("reporteInventarioD").style.display = "block";
}



