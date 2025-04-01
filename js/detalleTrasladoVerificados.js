 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {    
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
      format: 'yyyy-mm-dd',
    });
    
    // Verificar si existe una búsqueda previa
    let busquedaFlag = localStorage.getItem('autoSearchTraslados') === 'true';
    
    if (busquedaFlag) {
        
        let parametrosBusqueda = localStorage.getItem('parametrosBusqueda');
       
        const fechaIni = obtenerValorParametro(parametrosBusqueda, 'fechaIni');
        const fechaFin = obtenerValorParametro(parametrosBusqueda, 'fechaFin');
              
            $('#fecha_ini').val(fechaIni);
            $('#fecha_fin').val(fechaFin);
       
          instances.forEach(function(instance) {
          instance.setDate(new Date(fechaIni)); 
          instance.setDate(new Date(fechaFin)); 
        });       
        
        listadoTraslados(parametrosBusqueda);
    } else {
        // Si no hay búsqueda previa, limpiar el localStorage
        localStorage.clear();
    }   
   
    const user = document.getElementById('hUsuario');
    const bodega = document.getElementById('bodega').value;
    localStorage.setItem('username', user.value);
    localStorage.setItem('bodegaUser', bodega);
  });
  
 /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////// 
function obtenerValorParametro(parametros, nombreParametro) {
    const urlParams = new URLSearchParams(parametros);
    return urlParams.get(nombreParametro);
  }
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
function verTrasladosLista(){
  
            let pSistema= 'WMS';
            let pUsuario = localStorage.getItem('username');
            let pOpcion = "S";
            let pFechaDesde = $("#fecha_ini").val();
            let pFechaHasta = $("#fecha_fin").val();
            let pTraslado= document.getElementById('pTaslado').value;
            let pArticulo= document.getElementById('pArticulo').value;
             
            const params =
              "?pSistema="+
              pSistema +
              "&pUsuario=" +
              pUsuario +
              "&pOpcion=" +
              pOpcion +              
              "&fechaIni=" +
              pFechaDesde +
              "&fechaFin=" +
              pFechaHasta +
              "&pTraslado=" +
              pTraslado+
              "&pArticulo="+
              pArticulo;
            localStorage.setItem("parametrosBusqueda", params);
           // console.log("Parametros: "+params);
  
            listadoTraslados(params);
          //}
  }//Fin de ver traslados lista
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
function listadoTraslados(parametros) {   
    mostrarLoader();  
    fetch(env.API_URL + "wmsdetallesdetrasladosverificados" + parametros, myInit)
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === "SUCCESS") {
          console.log("TRASLADOS");
          console.log(result.resultado);

          console.log("Done");
          if (result.resultado.length != 0) {
            ArrayData = result.resultado;
            ArrayDataFiltrado = result.resultado;
            let cantReg = result.resultado.length;
            let nPag = Math.ceil(cantReg / xPag);
         
            $("#tblDetallestrasladosVerif tbody").remove();
  
            let htm = `<div class="row" id="totalregistros">
                        <div class="col s12"><span>Total de Registros: </span><span>${result.resultado.length}</span></div>
                        </div>`;
  
            document.getElementById("resultadoGeneral").innerHTML = htm;
            mostrarResultadosVerificacionTraslados(nPag, 1);  
            inicializarBotonesDescarga();      
            ocultarLoader();
            aplicarEstilosTabla();
          } else {
            Swal.fire({
              icon: "info",
              title: "Oops...",
              text: "No tiene traslados pendientes!",
              footer: '<a href="#">Why do I have this issue?</a>',
              confirmButtonColor: '#28a745',
            });   
            limpiarResultadoGeneral();       
            ocultarLoader();
          }
        } else {
         console.log("Error en el SP");
        }
      });
  }
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
function mostrarResultadosVerificacionTraslados(nPag, pag) {
    let htm = "";
    let desde = (pag - 1) * xPag;
    let hasta = pag * xPag;
  
    resultadosVerificacionTraslados(desde, hasta);
    htm += paginadorTablas(nPag, pag, 'mostrarResultadosVerificacionTraslados');
    document.getElementById("resultadoPaginador").innerHTML = htm;
  }
/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////// 
function resultadosVerificacionTraslados(desde, hasta) {
  // Validar que ArrayDataFiltrado exista y no esté vacío
  if (!ArrayDataFiltrado || ArrayDataFiltrado.length === 0) {
    console.error("ArrayDataFiltrado no está definido o está vacío.");
    return;
  }

  const tabla = document.getElementById("tblDetallestrasladosVerif");
  const thead = document.getElementById("theadDetallestrasladosVerif");
  let tbody = tabla.querySelector("tbody");

  // Crear tbody si no existe
  if (!tbody) {
    tbody = document.createElement("tbody");
    tabla.appendChild(tbody);
  }

  // Limpiar contenido previo
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Generar encabezados dinámicamente desde las claves del primer objeto
  const headers = Object.keys(ArrayDataFiltrado[0]);
  let headerHtml = '<tr class="themeColor-Traslado">';
  headers.forEach((header) => {
    // Convertir a mayúsculas y agregar al HTML
    headerHtml += `<th>${header.toUpperCase()}</th>`;
  });
  headerHtml += "</tr>";
  thead.innerHTML = headerHtml;

  // Generar filas de datos
  let bodyHtml = "";
  for (let i = desde; i < hasta && i < ArrayDataFiltrado.length; i++) {
    if (ArrayDataFiltrado[i]) {
      // Alternar color de fondo
      let backgroundColor = i % 2 === 0 ? "" : "#D7D5D5";

      // Crear fila
      bodyHtml += `<tr style="background-color:${backgroundColor};">`;

      // Iterar sobre las claves para mantener el orden de los encabezados
      headers.forEach((header) => {
        // Asegurar que el valor exista, si no, mostrar un string vacío
        const value = ArrayDataFiltrado[i][header] || "";
        bodyHtml += `<td>${value}</td>`;
      });

      bodyHtml += "</tr>";
    }
  }

  // Insertar contenido en el tbody
  tbody.innerHTML = bodyHtml;
}
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
function aplicarEstilosTabla() {
      $('#tblDetallestrasladosVerif tbody tr').each(function () {
        var documentoValue = $(this).find('td:eq(0)').text().trim();
    
        if (documentoValue.startsWith('T')) {
          $(this).find('td:eq(0)').css({
            'color': 'red',
            'font-weight': 'bold',
          });
        }      
      });
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
  /////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////
function limpiarResultadoGeneral() {
  const tabla = document.getElementById("tblDetallestrasladosVerif");
  const thead = document.getElementById("theadDetallestrasladosVerif");
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

  // Limpiar el contenido del thead y tbody de la tabla si la tabla existe
  if (tabla) {
    // Limpiar thead
    if (thead) {
      thead.innerHTML = "";
    }

    // Limpiar tbody
    let tbody = tabla.querySelector("tbody");
    if (tbody) {
      tbody.innerHTML = "";
    }
  }
}
 /////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4'); // 'p' para vertical (portrait), 'mm' para milímetros, 'a4' para tamaño

  // Título, subtítulo y datos
  const titulo = "CENTRAL DE LUBRICANTES, S.A.";
  const subtitulo = "Detalle de Traslados Verificados";
  const pBodega = document.getElementById('bodega')?.value || 'N/A'; // Usar #bodega del header o 'N/A' si no existe
  const fechaDescarga = new Date().toLocaleDateString();

  // Obtener la tabla
  const tabla = document.getElementById("tblDetallestrasladosVerif");
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
    doc.text(`Bodega: B-${pBodega}`, 10, 40);
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
      halign: 'left', // Alinear a la izquierda
      fontStyle: 'bold'
    },
    margin: { top: 50, left: 10, right: 10 },
    columnStyles: {
      // Ajustar alineación para las columnas dinámicas
      0: { halign: 'left' }, // Ejemplo: APLICACION
      1: { halign: 'left' }, // Ejemplo: ARTICULO
      2: { halign: 'left' }, // Ejemplo: AUDIT_TRANS_INV
      3: { halign: 'left' }, // Ejemplo: BODEGA
      4: { halign: 'left' }  // Ejemplo: FECHA
      // Nota: Si hay más columnas, se alinearán por defecto a la izquierda
    },
    didDrawPage: (data) => {
      dibujarEncabezado();
      agregarPiePagina(data);
    }
  });

  // Guardar el PDF
  doc.save("Detalle_Traslados_Verif.pdf");
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function descargarExcel() {
  // Obtener los datos de la tabla generada dinámicamente
  const jsonData = ArrayData;

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
  /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
const fecha_ini=document.getElementById('fecha_ini');
fecha_ini.addEventListener('change', function(){
    limpiarResultadoGeneral();
  });
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
const fecha_fin=document.getElementById('fecha_fin');
fecha_ini.addEventListener('change', function(){
    limpiarResultadoGeneral();
  });