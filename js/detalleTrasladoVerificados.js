 /////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////// 
// Variable global para almacenar los totales (puedes ajustarla según tu estructura)
let totalEntradasGlobal = 0;
let totalSalidasGlobal = 0;
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
     habilitaclase();
     habilitamarca();
     habilitatipo();
     habilitaVenta();
     habilitaEnvase();
     habilitaSeis();
     limpiarResultadoGeneral();

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
            //Parametros de Sistema
            let pSistema= 'WMS';
            let pUsuario = localStorage.getItem('username');
            let pBodega = document.getElementById('bodega').value;
            let pOpcion = TrasladosEntradaSalida();
            let pFechaDesde = $("#fecha_ini").val();
            let pFechaHasta = $("#fecha_fin").val();
         
            let pTraslado = document.getElementById('pTaslado').value;
            let pArticulo = document.getElementById('pArticulo').value;
            //CLASIFICACIONES
            let pClase = document.getElementById('claseReporte').value;
            let pMarca = document.getElementById('marcaReporte').value;
            let pTipo = document.getElementById('tipoReporte').value;
            let pEnvase = document.getElementById('envaseReporte').value;
            let pVentas = document.getElementById('ventasReporte').value;
            let pT6 = document.getElementById('seisReporte').value;
            //Parametros de Transacciones
            let pTipoTransaccion = getTipoTransaccion();



            //the parameters for the stored procedure here
            const params =
              "?pSistema="+
              pSistema +
              "&pUsuario=" +
              pUsuario +
              "&pOpcion=" +
              pOpcion + 
              "&pBodega="+
              pBodega+                          
              "&pFechaDesde=" +
              pFechaDesde +
              "&pFechaHasta=" +
              pFechaHasta +
              "&pTraslado=" +
              pTraslado+
              "&pArticulo="+
              pArticulo+
              // --clasificaciones--
              "&pClase="+
              pClase+
              "&pMarca="+
              pMarca+
              "&pTipo="+
              pTipo+
              "&pEnvase="+
              pEnvase+
              "&pVentas="+
              pVentas+
              "&pT6="+
              pT6+
              //--transacciones--
              "&pTipoTransaccion="+
              pTipoTransaccion;

            localStorage.setItem("parametrosBusqueda", params);
            console.log("Parametros:\n"+params);
  
           listadoTraslados(params);
         
  }//Fin de ver traslados lista
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
  function getTipoTransaccion() {
    const traslado = document.getElementById('tTraslado');
    const venta = document.getElementById('tVenta');
    const ordenDeCompras = document.getElementById('tOrdenesDeCompras');
  
    let pTipoTransaccion = '';
  
    const checkedCount = (traslado.checked ? 1 : 0) + (venta.checked ? 1 : 0) + (ordenDeCompras.checked ? 1 : 0);
  
    if (checkedCount === 0) {
      pTipoTransaccion = ''; 
    } else if (checkedCount === 1) {
      if (traslado.checked) {
        pTipoTransaccion = 'T';
      } else if (venta.checked) {
        pTipoTransaccion = 'P';
      } else if (ordenDeCompras.checked) {
        pTipoTransaccion = 'O';
      }
    } else if (checkedCount === 2) {
      if (traslado.checked && venta.checked) {
        pTipoTransaccion = 'TP'; 
      } else if (traslado.checked && ordenDeCompras.checked) {
        pTipoTransaccion = 'TO'; 
      } else if (venta.checked && ordenDeCompras.checked) {
        pTipoTransaccion = 'PO'; 
      }
    } else if (checkedCount === 3) {
      pTipoTransaccion = '';
    }
  
    return pTipoTransaccion;
  } 
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
function TrasladosEntradaSalida() {
  // Obtener el estado de los checkboxes
  const entradaChecked = document.getElementById('tEntrada').checked;
  const salidaChecked = document.getElementById('tSalida').checked;

  // Evaluar las combinaciones
  if (entradaChecked && salidaChecked) {
    return 'T'; // Ambos seleccionados
  } else if (entradaChecked && !salidaChecked) {
    return 'E'; // Solo Entrada seleccionado
  } else if (!entradaChecked && salidaChecked) {
    return 'S'; // Solo Salida seleccionado
  } else {
    // Ambos desmarcados
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Debe seleccionar al menos uno de los dos traslados (Entrada o Salida).',
      confirmButtonColor: '#28a745', // Color verde para el botón, consistente con ejemplos previos
    });
    return null; // Opcional: devolver null para indicar que no hay valor válido
  }
}
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
  
    armarTablaDetalleTrasladosVerificados(desde, hasta);
    htm += paginadorTablas(nPag, pag, 'mostrarResultadosVerificacionTraslados');
    document.getElementById("resultadoPaginador").innerHTML = htm;
  }
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////  
// Función para calcular los totales globales (se ejecuta una vez o cuando cambian los datos)
function calcularTotalesGlobales() {
  if (!ArrayDataFiltrado || ArrayDataFiltrado.length === 0) {
    return;
  }

  totalEntradasGlobal = 0;
  totalSalidasGlobal = 0;

  ArrayDataFiltrado.forEach((item) => {
    const value = item["CANT APLICADA"];
    if (!isNaN(value) && value !== "") {
      const numValue = Number(value);
      if (numValue > 0) {
        totalEntradasGlobal += numValue;
      } else if (numValue < 0) {
        totalSalidasGlobal += numValue;
      }
    }
  });
}
  /////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////  
// Función para mostrar los totales en un elemento separado
function mostrarTotalesGlobales() {
  const totalesContainer = document.getElementById("totalesContainer") || document.createElement("div");
  totalesContainer.id = "totalesContainer";
  totalesContainer.innerHTML = `
    <div style="font-size: 20px; text-align: right; margin-top: 20px; padding: 10px;">
      <p id="totalEntradas" style="margin: 5px 0; font-weight: bold; color: #00796b;">Total de Entradas: ${totalEntradasGlobal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p id="ttotalSalidas" style="margin: 5px 0; font-weight: bold; color: #d32f2f;">Total de Salidas: ${totalSalidasGlobal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  `;
  // Asegurarse de que esté después de la tabla
  const tabla = document.getElementById("tblDetallestrasladosVerif");
  if (!document.getElementById("totalesContainer")) {
    tabla.parentNode.insertBefore(totalesContainer, tabla.nextSibling);
  }
}

// function mostrarTotalesGlobales() {
//   const totalesContainer = document.getElementById("totalesContainer") || document.createElement("div");
//   totalesContainer.id = "totalesContainer";
//   totalesContainer.innerHTML = `
//     <div style="font-size: 20px; text-align: right; right margin-top: 20px; padding: 10px; ">
//       <p style="margin: 5px 0; font-weight: bold; color: #00796b;">Total de Entradas: ${totalEntradasGlobal.toFixed(2)}</p>
//       <p style="margin: 5px 0; font-weight: bold; color: #d32f2f;">Total de Salidas: ${totalSalidasGlobal.toFixed(2)}</p>
//     </div>
//   `;
//   // Asegurarse de que esté después de la tabla
//   const tabla = document.getElementById("tblDetallestrasladosVerif");
//   if (!document.getElementById("totalesContainer")) {
//     tabla.parentNode.insertBefore(totalesContainer, tabla.nextSibling);
//   }
// }



  /////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////  
// Función principal actualizada
function armarTablaDetalleTrasladosVerificados(desde, hasta) {
  if (!ArrayDataFiltrado || ArrayDataFiltrado.length === 0) {
    console.error("ArrayDataFiltrado no está definido o está vacío.");
    return;
  }

  const tabla = document.getElementById("tblDetallestrasladosVerif");
  const thead = document.getElementById("theadDetallestrasladosVerif");
  let tbody = tabla.querySelector("tbody");

  if (!tbody) {
    tbody = document.createElement("tbody");
    tabla.appendChild(tbody);
  }

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const headersOriginales = Object.keys(ArrayDataFiltrado[0]);
  const headers = headersOriginales.filter(header => header.toUpperCase() !== "DESCRIPCION");
  let headerHtml = '<tr class="themeColor-Traslado">';
  headers.forEach((header) => {
    headerHtml += `<th style="text-align: center;">${header.toUpperCase()}</th>`;
  });
  headerHtml += "</tr>";
  thead.innerHTML = headerHtml;

  let bodyHtml = "";
  for (let i = desde; i < hasta && i < ArrayDataFiltrado.length; i++) {
    if (ArrayDataFiltrado[i]) {
      let backgroundColor = i % 2 === 0 ? "" : "#D7D5D5";
      bodyHtml += `<tr style="background-color:${backgroundColor};">`;

      headers.forEach((header) => {
        let value;
        let alignment = "left";

        if (header.toUpperCase() === "ARTICULO") {
          const articulo = ArrayDataFiltrado[i]["ARTICULO"] || "";
          const descripcion = ArrayDataFiltrado[i]["DESCRIPCION"] || "";
          value = `
            <h5 style="text-align: left; color: #f56108; margin: 0;">${articulo}</h5>
            <h6 style="text-align: left; margin: 0;">${descripcion}</h6>
          `;
          alignment = "center";
        } else {
          value = ArrayDataFiltrado[i][header] || "";
          if (header.toUpperCase() === "CANT TRASLADO" && !isNaN(value) && value !== "") {
            value = Number(value).toFixed(2);
            alignment = "right";
          } else if (header.toUpperCase() === "FECHA HORA APLICACION") {
            alignment = "right";
          } else if (!isNaN(value) && value !== "") {
            value = Number(value).toFixed(2);
            alignment = "right";
          }
        }
        bodyHtml += `<td style="text-align: ${alignment};" data-label="${header.toUpperCase()}">${value}</td>`;
      });

      bodyHtml += "</tr>";
    }
  }

  tbody.innerHTML = bodyHtml;

  // Calcular y mostrar totales globales (solo la primera vez o si cambian los datos)
  if (desde === 0) { // Ejecutar solo en la primera página para evitar recálculos innecesarios
    calcularTotalesGlobales();
  }
  mostrarTotalesGlobales();
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
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
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
 ////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function limpiarResultadoGeneral() {
  const tabla = document.getElementById("tblDetallestrasladosVerif");
  const thead = document.getElementById("theadDetallestrasladosVerif");
  const resultadoPaginador = document.getElementById("resultadoPaginador");
  const totalRegistros = document.getElementById("totalregistros");
  const totalEntradas = document.getElementById('totalEntradas');
  const ttotalSalidas = document.getElementById('ttotalSalidas');


if(totalEntradas){
  totalEntradas.innerHTML= "";
}
if(ttotalSalidas){
  ttotalSalidas.innerHTML= "";
}


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
 /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
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
 //////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
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
 ////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////   
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
       limpiarResultadoGeneral();
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
       limpiarResultadoGeneral();
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
       limpiarResultadoGeneral();
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
        limpiarResultadoGeneral();
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
        limpiarResultadoGeneral();
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
       limpiarResultadoGeneral();
  } 
} else {
  console.log("Error en el SP");
}
});
}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
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