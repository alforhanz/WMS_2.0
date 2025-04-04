const registrosPorPagina = 10; // Número de registros por página
let paginaActual = 1; // Página actual
let totalPaginas = 1; // Total de páginas
let datosResumen = [];  // Definir la variable global para almacenar los datos del resumen

document.addEventListener("DOMContentLoaded", function () {
  fechasDeInventario();
  //limpiarTabla();
  //console.log("DOM cargado completamente ...");
  // Inicializar el select de Materialize
  var elems = document.querySelectorAll("select");
  M.FormSelect.init(elems);
  // Añadir evento change al select de fechas
  const fechaIniSelect = document.getElementById("fecha_ini");
  if (fechaIniSelect) {
    fechaIniSelect.addEventListener("change", function () {
      limpiarTabla();
    });
  }
}); 
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function fechasDeInventario() {
        const pBodega = document.getElementById('bodega').value;
        const params = `?pBodega=${pBodega}`;
    
        fetch(env.API_URL + "wmsfechainventario" + params, myInit)
            .then((response) => response.json())
            .then((result) => {
                const resultado = result.fechainv; // Arreglo con las fechas
                ////console.log("Fechas programadas: ");
                ////console.log(resultado);
    
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
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
async function presentarBoleta(){

    let pSistema = 'WMS';
    let pUsuario = localStorage.getItem('username');
    let TipoConsulta = 'D';    
    let FechaProceso = document.getElementById('fecha_ini').value;
    let Bodega = document.getElementById('bodega').value;  
    let SoloDiferencia = document.getElementById('soloDiferencias').checked ? 'S' : 'N';
    let SoloConteoCero = document.getElementById('contIgualaCero').checked ? 'S' : 'N';  
    let Clasificacion = 'null';     
    
    const params = new URLSearchParams({
        pSistema,
        pUsuario,
        TipoConsulta,
        FechaProceso,
        Bodega,
        SoloDiferencia,
        SoloConteoCero,
        Clasificacion       
    }).toString();
    mostrarLoader();
    fetch(`${env.API_URL}wmspresentaciondeboletas?${params}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
            if(result.resultado.length > 0){
              datosResumen=result.resultado;
              const btnValidarBoleta = document.getElementById('btnValidarBoleta');
              btnValidarBoleta.disabled = false; 
                  console.log('BOLETA DE INVENTARIO');
                  console.log(result.resultado)
                  generarTablaBoleta(datosResumen);
                 inicializarBotonesDescarga();    
                             
            }else{                
                limpiarTabla();
              Swal.fire({                
                  icon: "info",
                  title: "Información",
                  text: "No hay registros en este momento verifique los filtros de búsqueda",
                  confirmButtonColor: "#28a745",
                });            
                
          }             
          ocultarLoader();             
      } else {
        //console.log("Error en el SP");
      }
    });  
  }
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
async function validarBoleta() {
    let pSistema = 'WMS';
    let pUsuario = localStorage.getItem('username');
    let TipoConsulta = 'R';    
    let FechaProceso = document.getElementById('fecha_ini').value;
    let Bodega = document.getElementById('bodega').value;  
    let SoloDiferencia = 'S';
    let SoloConteoCero = 'N';  
    let Clasificacion = 'S';     
    
    const params = new URLSearchParams({
        pSistema,
        pUsuario,
        TipoConsulta,
        FechaProceso,
        Bodega,
        SoloDiferencia,
        SoloConteoCero,
        Clasificacion       
    }).toString();
    
    mostrarLoader();
    fetch(`${env.API_URL}wmspresentaciondeboletas?${params}`)
    .then((response) => response.json())
    .then((result) => {
        if (result.msg === "SUCCESS") {
            datosResumen = result.resultado;
            const btnCrearBoleta = document.getElementById('btnCrearBoleta'); // Referencia al botón
            const btnValidarBoleta = document.getElementById('btnValidarBoleta');
            if (result.resultado.length > 0) {
                //console.log('BOLETA DE INVENTARIO');
                //console.log(result.resultado);
                Swal.fire({
                    icon: "info",
                    title: "Información",
                    text: "No se puede proceder a crear la Boleta porque existen " + result.resultado.length + " artículos en estado Remitida.",
                    showCancelButton: true,                    
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#9e9e9e",
                    confirmButtonText: "Ver info",
                    cancelButtonText: "Cerrar"
                }).then((swalResult) => {
                    if (swalResult.isConfirmed) {
                        generarTablaBoleta(datosResumen);
                        inicializarBotonesDescarga();               
                    }
                });
                limpiarTabla();  
                btnCrearBoleta.disabled = true; // Deshabilitar el botón si hay artículos remitidos
            } else {
                //limpiarTabla();
                Swal.fire({
                    icon: "info",
                    title: "Información",
                    text: "Proceda a la creación de la boleta",
                    confirmButtonColor: "#28a745",
                }).then((swalResult) => {
                    if (swalResult.isConfirmed) {
                        agregarColumnaValidated();
                        btnCrearBoleta.disabled = false; // Habilitar el botón si no hay artículos remitidos
                        btnValidarBoleta.disabled = true;            
                    }
                });            
               
            } 
            
            ocultarLoader();             
        } else {
            //console.log("Error en el SP");
            ocultarLoader();
        }
    })
    .catch((error) => {
        console.error("Error en la solicitud fetch:", error);
        ocultarLoader();
    });
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function agregarColumnaValidated() {
    const tablaResumen = document.getElementById("myTableBoleta");
    const thead = tablaResumen.querySelector("thead tr");
    const tbody = document.getElementById("tblbodyBoleta");
    const filas = tbody.getElementsByTagName("tr");

    // Agregar encabezado "Estado" al thead
    const thEstado = document.createElement("th");
    thEstado.textContent = "Estado";
    thEstado.classList.add("boleta-header");
    thead.appendChild(thEstado);

    // Agregar "Verificado" a cada fila en el tbody
    for (let i = 0; i < filas.length; i++) {
        const tdEstado = document.createElement("td");
        tdEstado.textContent = "Verificado";
        tdEstado.classList.add("boleta-text"); // Reutilizamos la clase existente
        filas[i].appendChild(tdEstado);
    }
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
async function actualizaCostos(){

    let pSistema = 'WMS';
    let pUsuario = localStorage.getItem('username');
    let pOrigen = 'S';      
    
    const params = new URLSearchParams({
        pSistema,
        pUsuario,
        pOrigen    
    }).toString();
    mostrarLoader();
    fetch(`${env.API_URL}wmsactualizacostosinv?${params}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
            if(result.resultado.length > 0){
              datosResumen=result.resultado;
              const btnValidarBoleta = document.getElementById('btnValidarBoleta');
              btnValidarBoleta.disabled = false; 
                  //console.log('BOLETA DE INVENTARIO');
                  //console.log(result.resultado)
                  crearBoleta();
            }else{
                
                limpiarTabla();
              Swal.fire({                
                  icon: "info",
                  title: "Información",
                  text: "No es posible crear la boleta",
                  confirmButtonColor: "#28a745",
                });            
                
          }             
          ocultarLoader();             
      } else {
        //console.log("Error en el SP");
      }
    });  

}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
async function crearBoleta(){
    // Swal.fire({
    //     icon: "info",
    //     title: "Información",
    //     text: "Funcionalidad en construcción",
    //     confirmButtonColor: "#28a745",
    //   });
    let pSistema = 'WMS';
    let pUsuario = localStorage.getItem('username');
    let pOrigen = 'I';    
    let FechaProceso = document.getElementById('fecha_ini').value;
    let Bodega = document.getElementById('bodega').value;  
    let SoloDiferencia = 'S';
   
    
    const params = new URLSearchParams({
        pSistema,
        pUsuario,
        pOrigen,
        FechaProceso,
        Bodega,
        SoloDiferencia    
    }).toString();
    mostrarLoader();
    fetch(`${env.API_URL}wmscrearvoletainv?${params}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
            if(result.resultado.length > 0){
              datosResumen=result.resultado;
              const btnValidarBoleta = document.getElementById('btnValidarBoleta');
              btnValidarBoleta.disabled = false; 
                  //console.log('BOLETA DE INVENTARIO');
                  //console.log(result.resultado)                  
                  Swal.fire({                
                    icon: "info",
                    title: "Información",
                    text: "Consecutivo Boleta: "+result.resultado[0][""],
                    confirmButtonColor: "#28a745",
                  });                 
            }else{
                
                limpiarTabla();
              Swal.fire({                
                  icon: "info",
                  title: "Información",
                  text: "No hay registros en este momento verifique los filtros de búsqueda",
                  confirmButtonColor: "#28a745",
                });            
                
          }             
          ocultarLoader();             
      } else {
        //console.log("Error en el SP");
      }
    });  

}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function obtenerDatosTabla() {    
    if (Array.isArray(datosResumen)) {
        return datosResumen; 
    } else {
        console.error("datosResumen no está definido o no es un arreglo.");
        return [];
    }
}  
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function generarTablaBoleta(datos) {
   // limpiarTabla();
    const tablaResumen = document.getElementById("myTableBoleta");
    const tbodyResumen = document.getElementById("tblbodyBoleta");
    const cantidadRegistros = document.getElementById("cantidadDeRegistros");

    // Limpiar la tabla antes de insertar nuevos datos
    tbodyResumen.innerHTML = "";
    tablaResumen.querySelector("thead").innerHTML = ""; // Limpiar también el thead

    // Verificar si hay datos
    if (!datos || datos.length === 0) {
        cantidadRegistros.textContent = "No hay registros disponibles";
        return;
    }

    // Crear encabezados dinámicos
    const encabezados = Object.keys(datos[0]);
    const trHead = document.createElement("tr");
    encabezados.forEach(encabezado => {
        const th = document.createElement("th");
        th.textContent = encabezado
            .replace(/_/g, " ")
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        th.classList.add("boleta-header");
        trHead.appendChild(th);
    });
    tablaResumen.querySelector("thead").appendChild(trHead);

    // Insertar filas de datos
    datos.forEach(fila => {
        const tr = document.createElement("tr");
        Object.values(fila).forEach((valor, index) => {
            const td = document.createElement("td");
            const encabezadoActual = encabezados[index].toUpperCase(); // Normalizar a mayúsculas para comparación

            // Verificar si el valor es numérico
            if (!isNaN(valor) && valor !== "" && !isNaN(parseFloat(valor))) {
                if (encabezadoActual === "ITEM") {
                    // Formatear como entero para la columna "ITEM"
                    td.textContent = Math.round(parseFloat(valor)); // Redondea a entero
                    td.classList.add("boleta-number");
                } else {
                    // Formatear a 2 decimales para otras columnas numéricas
                    td.textContent = parseFloat(valor).toFixed(2);
                    td.classList.add("boleta-number");
                }
            } else {
                // Mantener el valor original si no es numérico
                td.textContent = valor;
                td.classList.add("boleta-text");
            }

            // Aplicar clase adicional para "DESCRIPCION"
            if (encabezadoActual === "DESCRIPCION") {
                td.classList.add("boleta-description");
            }

            tr.appendChild(td);
        });
        tbodyResumen.appendChild(tr);
    });

    // Mostrar la cantidad de registros
    cantidadRegistros.textContent = `Total de registros: ${datos.length}`;
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function inicializarBotonesDescarga() {    
    const btnDescargarExcel = document.getElementById('btnDescargarExcel');
    const btnDescargarPDF = document.getElementById('btnDescargarPDF');
    const lblExcel = document.getElementById('lblExcel');
    const lblPDF = document.getElementById('lblPDF');

    if (btnDescargarExcel) {
        btnDescargarExcel.removeAttribute("hidden");
    }
    if (btnDescargarPDF) {
        btnDescargarPDF.removeAttribute("hidden");
    }
    if (lblExcel) {
        lblExcel.removeAttribute("hidden");
    }
    if (lblPDF) {
        lblPDF.removeAttribute("hidden");
    }
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4'); // 'p' para vertical (portrait), 'mm' para milímetros, 'a4' para tamaño

    // Título, subtítulo y fechas
    const titulo = "CENTRAL DE LUBRICANTES, S.A.";
    const subtitulo = "Reporte de Inventario General Resumen";
    const pBodega = document.getElementById('bodega')?.value || 'N/A'; // Usar #bodega del header o 'N/A' si no existe
    const fechaInventario = document.getElementById('fecha_ini').value || 'N/A';
    const fechaDescarga = new Date().toLocaleDateString();

    // Obtener la tabla
    const tabla = document.getElementById("myTableBoleta");
    if (!tabla || !tabla.querySelector("thead") || !tabla.querySelector("tbody")) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "No hay tabla disponible para descargar.",
            confirmButtonColor: "#28a745",
        });
        return;
    }

    // Obtener las cabeceras de la tabla
    const thead = tabla.querySelector("thead");
    const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent.trim());

    // Obtener los datos de la tabla
    const tbody = tabla.querySelector("tbody");
    const filas = Array.from(tbody.querySelectorAll("tr")).map(row => {
        return Array.from(row.querySelectorAll("td")).map(td => td.textContent.trim());
    });

    // Si no hay filas, mostrar advertencia
    if (filas.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "La tabla está vacía. No hay datos para descargar.",
            confirmButtonColor: "#28a745",
        });
        return;
    }

    // Función para dibujar encabezado en cada página
    const dibujarEncabezado = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const tituloWidth = doc.getTextWidth(titulo);
        const subtituloWidth = doc.getTextWidth(subtitulo);

        doc.setFontSize(14);
        doc.text(titulo, (pageWidth - tituloWidth) / 2, 20);

        doc.setFontSize(12);
        doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 30);

        doc.setFontSize(9);
        doc.text(`Agrupado por: Clase, Marca y solo contados`, 10, 45);
        doc.text(`Bodega: B-${pBodega}  /  Fecha del inventario: ${fechaInventario}`, 10, 40);
        doc.text(`Fecha de impresión: ${fechaDescarga}`, pageWidth - 60, 10);
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
        startY: 50, // Ajustar para dejar espacio al encabezado
        styles: { fontSize: 8 },
        headStyles: { 
            fillColor: [0, 128, 0], // Verde
            textColor: [255, 255, 255], // Blanco
            halign: 'left', // Alinear a la izquierda como en la tabla HTML
            fontStyle: 'bold'
        },
        margin: { top: 50, left: 10, right: 10 },
        columnStyles: {
            // Ajustar alineación según las clases de las celdas HTML
            0: { halign: 'left' }, // Clase
            1: { halign: 'left' }, // Marca
            2: { halign: 'left' }, // Item
            3: { halign: 'left' }, // Articulos
            4: { halign: 'left' }, // Descripcion
            5: { halign: 'left' }  // Sistema
        },
        didDrawPage: (data) => {
            dibujarEncabezado();
            agregarPiePagina(data);
        }
    });

    // Guardar el PDF
    doc.save("Boleta_de_inventario.pdf");
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
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


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function limpiarTabla() {
    const tablas = [
        { id: "myTableBoleta", tbody: "tblbodyBoleta" }
    ];

    const labelCantidad = document.getElementById("cantidadDeRegistros");
    if (labelCantidad) {
        labelCantidad.innerHTML = "";
    }

    tablas.forEach(tablaInfo => {
        const tabla = document.getElementById(tablaInfo.id);
        const tbody = document.getElementById(tablaInfo.tbody);

        if (tabla && tbody) {
            tbody.innerHTML = "";
            tabla.querySelector("thead").innerHTML = "";
        }
    });

   //// Ocultar los botones de descarga y sus etiquetas
    const btnValidarBoleta = document.getElementById("btnValidarBoleta");
    btnValidarBoleta.disabled=true;
    const btnCrearBoleta = document.getElementById("btnCrearBoleta");
    btnCrearBoleta.disabled=true;

    const btnDescargarExcel = document.getElementById("btnDescargarExcel");
    const lblExcel = document.getElementById("lblExcel");
    const btnDescargarPDF = document.getElementById("btnDescargarPDF");
    const lblPDF = document.getElementById("lblPDF");


    if (btnDescargarExcel) {
        btnDescargarExcel.setAttribute("hidden", "");
        //console.log("Ocultando btnDescargarExcel"); // Para depuración
    }
    if (lblExcel) {
        lblExcel.setAttribute("hidden", "");
        //console.log("Ocultando lblExcel"); // Para depuración
    }
    if (btnDescargarPDF) {
        btnDescargarPDF.setAttribute("hidden", "");
        //console.log("Ocultando btnDescargarPDF"); // Para depuración
    }
    if (lblPDF) {
        lblPDF.setAttribute("hidden", "");
        //console.log("Ocultando lblPDF"); // Para depuración
    }
}