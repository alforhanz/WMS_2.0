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

    const headers = Object.keys(datos[0]);

    // Fila de encabezados
    const trHead = document.createElement("tr");

    headers.forEach((header, index) => {
        const th = document.createElement("th");
        th.textContent = header.replace(/_/g, " ").toUpperCase();
        th.dataset.index = index;
        th.style.cursor = "pointer"; // Indicar que se puede hacer clic
        th.style.transition = "background 0.3s"; // Animación suave al ocultar
        th.addEventListener("click", toggleColumnas);
        trHead.appendChild(th);
    });

    thead.appendChild(trHead);

    // Crear filas
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
    //agregarBotonRestaurar();
}

// Función para ocultar/mostrar columnas al hacer clic en el encabezado
function toggleColumnas(event) {
    const btnRestaurar = document.getElementById("btnRestaurarColumnas");
    btnRestaurar.hidden= false;
    const index = event.target.dataset.index;
    const tabla = document.getElementById("myTableresumen");

    tabla.querySelectorAll(`th:nth-child(${+index + 1}), td:nth-child(${+index + 1})`)
        .forEach(cell => {
            if (cell.style.display === "none") {
                cell.style.display = ""; // Mostrar columna
                event.target.style.opacity = "1"; // Restaurar visibilidad
                event.target.style.background = ""; // Restaurar color original
            } else {
                cell.style.display = "none"; // Ocultar columna
                event.target.style.opacity = "0.5"; // Indicar que está oculta
                event.target.style.background = "#ccc"; // Resaltar encabezado oculto
            }
        });
}

// Función para restaurar todas las columnas
function restaurarColumnas() {
    const tabla = document.getElementById("myTableresumen");

    tabla.querySelectorAll("th, td").forEach(cell => {
        cell.style.display = ""; // Mostrar todas las columnas
    });

    // Restaurar estilos de los encabezados
    tabla.querySelectorAll("th").forEach(th => {
        th.style.opacity = "1";
        th.style.background = "";
    });
}

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



