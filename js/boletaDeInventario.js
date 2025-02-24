const registrosPorPagina = 10; // Número de registros por página
let paginaActual = 1; // Página actual
let totalPaginas = 1; // Total de páginas
let datosResumen = [];  // Definir la variable global para almacenar los datos del resumen

document.addEventListener("DOMContentLoaded", function () {   
 
    console.log(document.getElementById("myTableresumen"));

    fechasDeInventario();   
     console.log('DOM del reporte caRGADO...');
        limpiarTabla();    
    }); 
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
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
async function presentarBoleta(){

    let pSistema = 'WMS';
    let pUsuario = localStorage.getItem('username');
    let TipoConsulta = 'D';    
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
    fetch(`${env.API_URL}wmscreaciondeboletas?${params}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
            if(result.resultado.length > 0){
              datosResumen=result.resultado;
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
        console.log("Error en el SP");
      }
    });  
  }

  async function validarBoleta(){

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
    fetch(`${env.API_URL}wmscreaciondeboletas?${params}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        datosResumen=result.resultado;
            if(result.resultado.length > 0){
              
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
        console.log("Error en el SP");
      }
    });  
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función para obtener datos de la tabla y poder generar el doc PDF(personaliza según tu tabla)/////////////////////////////////////////
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
    //   { id: "tablaReporteRCM", tbody: "tablaReporteRCM", div: "reporteInventarioRCM" },
    //   { id: "tablaReporteRM", tbody: "tablaReporteRM", div: "reporteInventarioRM" },
    //   { id: "tablaReporteRC", tbody: "tablaReporteRC", div: "reporteInventarioRC" },
    //   { id: "tablaReporteD", tbody: "tablaReporteD", div: "reporteInventarioD" }
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
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// function generarTablaBoleta(datos) {
//     const tablaResumen = document.getElementById("myTableBoleta");
//     const tbodyResumen = document.getElementById("tblbodyBoleta");
//     const cantidadRegistros = document.getElementById("cantidadDeRegistros");

//     // Limpiar la tabla antes de insertar nuevos datos
//     tbodyResumen.innerHTML = "";
//     tablaResumen.querySelector("thead").innerHTML = ""; // Limpiar también el thead

//     // Verificar si hay datos
//     if (!datos || datos.length === 0) {
//         cantidadRegistros.textContent = "No hay registros disponibles";
//         return;
//     }

//     // Crear encabezados dinámicos
//     const encabezados = Object.keys(datos[0]);
//     const trHead = document.createElement("tr");
//     encabezados.forEach(encabezado => {
//         const th = document.createElement("th");
//         // Formatear el texto del encabezado
//         th.textContent = encabezado
//             .replace(/_/g, " ") // Reemplazar guiones bajos por espacios
//             .toLowerCase() // Convertir a minúsculas
//             .split(" ")
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" "); // Capitalizar cada palabra
//         th.classList.add("boleta-header"); // Añadir clase para estilizar
//         trHead.appendChild(th);
//     });
//     tablaResumen.querySelector("thead").appendChild(trHead);

//     // Insertar filas de datos
//     datos.forEach(fila => {
//         const tr = document.createElement("tr");
//         Object.values(fila).forEach((valor, index) => {
//             const td = document.createElement("td");
//             td.textContent = valor;
//             // Aplicar clases según la columna
//             switch (encabezados[index]) {
//                 case "SISTEMA":
//                     td.classList.add("boleta-number"); // Para columnas numéricas
//                     break;
//                 case "DESCRIPCION":
//                     td.classList.add("boleta-description"); // Para descripciones largas
//                     break;
//                 default:
//                     td.classList.add("boleta-text"); // Texto genérico
//                     break;
//             }
//             tr.appendChild(td);
//         });
//         tbodyResumen.appendChild(tr);
//     });

//     // Mostrar la cantidad de registros
//     cantidadRegistros.textContent = `Total de registros: ${datos.length}`;
// }
// function generarTablaBoleta(datos) {
//     const tablaResumen = document.getElementById("myTableBoleta");
//     const tbodyResumen = document.getElementById("tblbodyBoleta");
//     const cantidadRegistros = document.getElementById("cantidadDeRegistros");

//     // Limpiar la tabla antes de insertar nuevos datos
//     tbodyResumen.innerHTML = "";
//     tablaResumen.querySelector("thead").innerHTML = ""; // Limpiar también el thead

//     // Verificar si hay datos
//     if (!datos || datos.length === 0) {
//         cantidadRegistros.textContent = "No hay registros disponibles";
//         return;
//     }

//     // Crear encabezados dinámicos
//     const encabezados = Object.keys(datos[0]);
//     const trHead = document.createElement("tr");
//     encabezados.forEach(encabezado => {
//         const th = document.createElement("th");
//         th.textContent = encabezado
//             .replace(/_/g, " ")
//             .toLowerCase()
//             .split(" ")
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" ");
//         th.classList.add("boleta-header");
//         trHead.appendChild(th);
//     });
//     tablaResumen.querySelector("thead").appendChild(trHead);

//     // Insertar filas de datos
//     datos.forEach(fila => {
//         const tr = document.createElement("tr");
//         Object.values(fila).forEach((valor, index) => {
//             const td = document.createElement("td");
//             // Formatear valores numéricos en la columna "SISTEMA"
//             if (encabezados[index] === "SISTEMA" && !isNaN(valor) && valor !== "") {
//                 td.textContent = Number(valor).toFixed(2); // Limitar a 2 decimales
//             } else {
//                 td.textContent = valor; // Mantener el valor original si no es numérico
//             }
//             // Aplicar clases según la columna
//             switch (encabezados[index]) {
//                 case "SISTEMA":
//                     td.classList.add("boleta-number");
//                     break;
//                 case "DESCRIPCION":
//                     td.classList.add("boleta-description");
//                     break;
//                 default:
//                     td.classList.add("boleta-text");
//                     break;
//             }
//             tr.appendChild(td);
//         });
//         tbodyResumen.appendChild(tr);
//     });

//     // Mostrar la cantidad de registros
//     cantidadRegistros.textContent = `Total de registros: ${datos.length}`;
// }
// function generarTablaBoleta(datos) {
//     const tablaResumen = document.getElementById("myTableBoleta");
//     const tbodyResumen = document.getElementById("tblbodyBoleta");
//     const cantidadRegistros = document.getElementById("cantidadDeRegistros");

//     // Limpiar la tabla antes de insertar nuevos datos
//     tbodyResumen.innerHTML = "";
//     tablaResumen.querySelector("thead").innerHTML = ""; // Limpiar también el thead

//     // Verificar si hay datos
//     if (!datos || datos.length === 0) {
//         cantidadRegistros.textContent = "No hay registros disponibles";
//         return;
//     }

//     // Crear encabezados dinámicos
//     const encabezados = Object.keys(datos[0]);
//     const trHead = document.createElement("tr");
//     encabezados.forEach(encabezado => {
//         const th = document.createElement("th");
//         th.textContent = encabezado
//             .replace(/_/g, " ")
//             .toLowerCase()
//             .split(" ")
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" ");
//         th.classList.add("boleta-header");
//         trHead.appendChild(th);
//     });
//     tablaResumen.querySelector("thead").appendChild(trHead);

//     // Insertar filas de datos
//     datos.forEach(fila => {
//         const tr = document.createElement("tr");
//         Object.values(fila).forEach((valor, index) => {
//             const td = document.createElement("td");
//             // Verificar si el valor es numérico y formatearlo a 2 decimales
//             if (!isNaN(valor) && valor !== "" && !isNaN(parseFloat(valor))) {
//                 td.textContent = parseFloat(valor).toFixed(2);
//                 td.classList.add("boleta-number"); // Aplicar clase para números
//             } else {
//                 td.textContent = valor; // Mantener el valor original si no es numérico
//                 td.classList.add("boleta-text"); // Clase para texto genérico
//             }
//             // Aplicar clase adicional para "DESCRIPCION"
//             if (encabezados[index] === "DESCRIPCION") {
//                 td.classList.add("boleta-description");
//             }
//             tr.appendChild(td);
//         });
//         tbodyResumen.appendChild(tr);
//     });

//     // Mostrar la cantidad de registros
//     cantidadRegistros.textContent = `Total de registros: ${datos.length}`;
// }

function generarTablaBoleta(datos) {
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

function inicializarBotonesDescarga() {    
  const btnDescargarExcel = document.getElementById('btnDescargarExcel'); // Obtener el botón de Excel
  const btnDescargarPDF = document.getElementById('btnDescargarPDF'); // Crear el botón de PDF    
  const lblExcel = document.getElementById('lblExcel').style.display = 'block';
  const lblPDF = document.getElementById('lblPDF').style.display = 'block';
  btnDescargarExcel ? btnDescargarExcel.hidden = false : btnDescargarExcel.hidden = true;
  btnDescargarPDF ? btnDescargarPDF.hidden = false : btnDescargarPDF.hidden = true;
   
} 
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
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
  const doc = new jsPDF('p', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

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
// function descargarPDFRM() {
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('p', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

//  // Título, subtítulo y fechas
//   const titulo = "CENTRAL DE LUBRICANTES, S.A.";
//   const subtitulo = "    Reporte de Inventario General Resumen";
//   const pBodega = document.getElementById('bodega-sucursal').textContent;
//   const fechaInventario = document.getElementById('fecha_ini').value;
//   const fechaDescarga = new Date().toLocaleDateString();

//  // Obtener las cabeceras de la tabla
//   const tabla = document.getElementById("reporteInventarioRM").querySelector("table");
//   const thead = tabla.querySelector("thead");
//   const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

//  // Obtener los datos de la tabla
//   const rows = Array.from(tabla.querySelectorAll("tbody tr"));
//   const filas = rows.map(row => {
//       return Array.from(row.querySelectorAll("td")).map(td => td.textContent);
//   });
//  // Función para dibujar encabezado en cada página
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

//  // Agregar pie de página con número de página
//   const agregarPiePagina = (data) => {
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       doc.setFontSize(7);
//       doc.text(`Página ${data.pageNumber}`, pageWidth - 20, pageHeight - 10);
//   };

//  // Crear la tabla en el PDF
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
//      //   Aplicar el mismo formato del encabezado a la fila de Gran Total
//         if (data.row.index === filas.length - 1) {
//           data.cell.styles.fillColor = [0, 128, 0]; // Fondo verde
//             data.cell.styles.textColor = [255, 255, 255]; // Texto blanco
//             data.cell.styles.fontStyle = "bold";
//             data.cell.styles.halign = "center"; // Centrar texto
//         }
//     }
//   });

//  // Guardar el PDF
//   doc.save("Reporte_Conteo_Inventario_General.pdf");
// }
// function descargarPDFRC() {
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('p', 'mm', 'a4'); // 'l' para horizontal (landscape), 'mm' para milímetros, 'a4' para tamaño A4

//  // Título, subtítulo y fechas
//   const titulo = "CENTRAL DE LUBRICANTES, S.A.";
//   const subtitulo = "    Reporte de Inventario General Resumen";
//   const pBodega = document.getElementById('bodega-sucursal').textContent;
//   const fechaInventario = document.getElementById('fecha_ini').value;
//   const fechaDescarga = new Date().toLocaleDateString();

//  // Obtener las cabeceras de la tabla
//   const tabla = document.getElementById("reporteInventarioRC").querySelector("table");
//   const thead = tabla.querySelector("thead");
//   const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);

//  // Obtener los datos de la tabla
//   const rows = Array.from(tabla.querySelectorAll("tbody tr"));
//   const filas = rows.map(row => {
//       return Array.from(row.querySelectorAll("td")).map(td => td.textContent);
//   });
//  // Función para dibujar encabezado en cada página
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

//  // Agregar pie de página con número de página
//   const agregarPiePagina = (data) => {
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       doc.setFontSize(7);
//       doc.text(`Página ${data.pageNumber}`, pageWidth - 20, pageHeight - 10);
//   };

//  // Crear la tabla en el PDF
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
//      //   Aplicar el mismo formato del encabezado a la fila de Gran Total
//         if (data.row.index === filas.length - 1) {
//           data.cell.styles.fillColor = [0, 128, 0]; // Fondo verde
//             data.cell.styles.textColor = [255, 255, 255]; // Texto blanco
//             data.cell.styles.fontStyle = "bold";
//             data.cell.styles.halign = "center"; // Centrar texto
//         }
//     }
//   });

//  // Guardar el PDF
//   doc.save("Reporte_Conteo_Inventario_General.pdf");
// }
// function descargarPDFDetalle() { 
//   let bodega=document.getElementById('bodega-sucursal').textContent;
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF('p', 'mm', 'a4');

//   // Obtener la fecha actual
//   const fechaImpresion = new Date().toLocaleDateString();

//   // Configuración de márgenes y posiciones
//   const margenIzquierdo = 10;
//   let y = 10; 

//   // Agregar la fecha de impresión alineada a la derecha
//   doc.setFontSize(10);
//   const pageWidth = doc.internal.pageSize.getWidth();
//   doc.text(`Fecha de impresión: ${fechaImpresion}`, pageWidth - 55, y);
  
//   y += 10;

//   // Título
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text("CENTRAL DE LUBRICANTES, S.A.", pageWidth / 2, y, { align: "center" });

//   y += 10;

//   // Subtítulo
//   doc.setFontSize(12);
//   doc.text("Reporte de Inventario General Detallado Por Bodega, Clase y Marca", pageWidth / 2, y, { align: "center" });

//   y += 10;

//   // Información del reporte
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("Fecha inventario: 2024-02-07 "+"Bodega: "+bodega+" / Clase y Marca, segun artículos contados", margenIzquierdo, y);

//   y += 10;

//   // Obtener la tabla y procesar filas manualmente
//   const tabla = document.getElementById("tablaReporteD");

//   if (tabla) {
//     let encabezados = [];
//     let datos = [];

//     // Obtener los encabezados desde el thead
//     const thead = tabla.closest("table").querySelector("thead");
//     if (thead) {
//       encabezados = [...thead.querySelectorAll("th")].map(th => th.innerText);
//     }

//     // Obtener los datos de cada fila
//     const filas = tabla.querySelectorAll("tr");
//     filas.forEach(fila => {
//       const celdas = [...fila.querySelectorAll("td")].map(td => td.innerText);

//       if (celdas.length > 0) {
//         // Verificar si la fila es un subtotal o total
//         const primeraCelda = celdas[0].trim();
//         if (
//           primeraCelda.startsWith("SubTotal") || 
//           primeraCelda.startsWith("Gran Total")
//         ) {
//           // Insertar una columna vacía después de la primera celda
//           celdas.splice(1, 0, "");
//         }
//         datos.push(celdas);
//       }
//     });

//     // Generar la tabla en el PDF con autoTable
//     doc.autoTable({
//       head: [encabezados],
//       body: datos,
//       startY: y,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255], halign: "center" },
//       columnStyles: {
//         0: { halign: "left" },  // Alinear Artículo a la izquierda
//         1: { halign: "left" },  // Alinear Descripción a la izquierda
//         2: { halign: "right" }, // Alinear números a la derecha
//         3: { halign: "right" },
//         4: { halign: "right" },
//         5: { halign: "right" },
//         6: { halign: "right" },
//       }
//     });


//     // Obtener el número total de páginas
// const totalPages = doc.getNumberOfPages();

// for (let i = 1; i <= totalPages; i++) {
//   doc.setPage(i); // Ir a la página i
//   doc.setFontSize(10);
//   doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
// }

//     // Guardar el archivo PDF
//     doc.save("Reporte_Inventario_General_Detallado.pdf");
//   } else {
//     alert("No se encontró la tabla para generar el reporte.");
//   }
// }
