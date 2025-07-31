document.addEventListener('DOMContentLoaded', function() {
  // Código que se ejecuta cuando el DOM se haya cargado
  console.log('El DOM se ha cargado completamente. \nVerificacion de Traslados...');
  // Inicializar datepicker de Materialize
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, {
    format: 'yyyy-mm-dd', // Formato de fecha
  });
  
  // Verificar si existe una búsqueda previa
  let busquedaFlag = localStorage.getItem('autoSearchTraslados') === 'true';
  
  if (busquedaFlag) {
      // Obtener la cadena de parámetros guardada en el localStorage
      let parametrosBusqueda = localStorage.getItem('parametrosBusqueda');//contiene la url de losparametros de la busqueda anterior
      let mostrarPreparados = localStorage.getItem('trasladosprocesados') === 'true'; 
      let entradasalida = localStorage.getItem('entrada_Salida_Traslado_switch')=== 'true'
      if (mostrarPreparados) {
        $('#toggleSwitch').prop('checked', true);
      } else {
        $('#toggleSwitch').prop('checked', false);
      }

      if (entradasalida) {
        $('#trasladosSwitch').prop('checked', true);
      } else {
        $('#trasladosSwitch').prop('checked', false);
      }
      
      // Extraer los valores de 'fechaIni' y 'fechaFin' de la cadena de parámetros
      const fechaIni = obtenerValorParametro(parametrosBusqueda, 'fechaIni');
      const fechaFin = obtenerValorParametro(parametrosBusqueda, 'fechaFin');
      
      // // Asignar los valores a los campos de fecha en el HTML
      // document.getElementById('fecha_ini').value = fechaIni;
      // document.getElementById('fecha_fin').value = fechaFin;
      
      // Asignar los valores a los campos de fecha en el HTML usando jQuery
          $('#fecha_ini').val(fechaIni);
          $('#fecha_fin').val(fechaFin);
      
      // Actualizar el datepicker con los valores asignados
        instances.forEach(function(instance) {
        instance.setDate(new Date(fechaIni)); // Asignar la fecha inicial
        instance.setDate(new Date(fechaFin)); // Asignar la fecha final
      });
      
      // Llamar a la función que realiza la búsqueda con los parámetros guardados
      listadoTraslados(parametrosBusqueda);
  } else {
      // Si no hay búsqueda previa, limpiar el localStorage
      localStorage.clear();
  }
 
  // Guardar el estado de usuario, bodega y otros datos en el localStorage
  const user = document.getElementById('hUsuario');
  const bodega = document.getElementById('bodega').value;
  const estadoSwitchTrasPrep = document.getElementById('toggleSwitch');
 
  localStorage.setItem('username', user.value);
  localStorage.setItem('bodegaUser', bodega);
  localStorage.setItem('trasladosprocesados', estadoSwitchTrasPrep.checked);
  localStorage.setItem('entrada_Salida_Traslado_switch',trasladocheckbox.checked);

});

function obtenerValorParametro(parametros, nombreParametro) {
  const urlParams = new URLSearchParams(parametros);
  return urlParams.get(nombreParametro);
}

  function verTrasladosLista(){
    //revisar como toma el valor 
    var bodegaOrigen = document.getElementById("bodega").value;
    //revisar como toma el valor
        if (bodegaOrigen == "") {
          Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, seleccione su bodega de origen.",
          });
          return false; // Evita que se envíe el formulario
        } else {
          var pFechaHasta = $("#fecha_fin").val();
          var pFechaDesde = $("#fecha_ini").val();
          localStorage.setItem("autoSearchTraslados", "false"); // Aquí se establece el valor 'false' para la búsqueda de los traslados
          let pModulo="WMS_VT";
          let typeRpt = "R";
         const trasladosProcesados = localStorage.getItem("trasladosprocesados");
            if(trasladosProcesados!="true"){
              typeRpt="TP";
            }          
          let pOpcion = "E";
          const trasladoSalida=localStorage.getItem('entrada_Salida_Traslado_switch');    
              if(trasladoSalida==="true" || trasladoSalida === null){
                pOpcion="E";
              }else{
                pOpcion="S";
              }
         
          const params =
            "?pModulo="+
            pModulo +
            "&pOpcion=" +
            pOpcion +
            "&typeRpt=" +
            typeRpt +
            "&fechaIni=" +
            pFechaDesde +
            "&fechaFin=" +
            pFechaHasta +
            "&BodegaOrigen=" +
            bodegaOrigen;
          localStorage.setItem("parametrosBusqueda", params);

          listadoTraslados(params);
        }
}//Fin de ver traslados lista

function listadoTraslados(parametros) {
 let pag = 1;
  mostrarLoader();

  fetch(env.API_URL + "wmsverificaciontraslados/E" + parametros, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        console.log("TRASLADOS");
        console.log(result.traslados);
        if (result.traslados.length != 0) {
          ArrayData = result.traslados;
          ArrayDataFiltrado = result.traslados;
          let cantReg = result.traslados.length;
          let nPag = Math.ceil(cantReg / xPag);
       
          $("#tbltraslados tbody").remove();

          let htm = `<div class="row" id="totalregistros">
            <div class="col s12"><span>Total de Registros: </span><span>${result.traslados.length}</span></div>
          </div>`;

          document.getElementById("resultadoGeneral").innerHTML = htm;
          mostrarResultadosVerificacionTraslados(nPag, pag);        
          ocultarLoader();
          aplicarEstilosTabla();
        } else {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "No tiene traslados pendientes!",           
            confirmButtonColor: '#28a745',
          });   
          limpiarResultadoGeneral();       
          ocultarLoader();
        }
      } else {
        //  console.log("Error en el SP");
            Swal.fire({
                  icon: "info",
                  title: "Información",            
                  text: "Fallo en el API",
                  confirmButtonColor: "#28a745",
                });
      }
    });
}

function mostrarResultadosVerificacionTraslados(nPag, pag) {
  let htm = "";
  let desde = (pag - 1) * xPag;
  let hasta = pag * xPag;

  resultadosVerificacionTraslados(desde, hasta);
  htm += paginadorTablas(nPag, pag, 'mostrarResultadosVerificacionTraslados');
  document.getElementById("resultadoPaginador").innerHTML = htm;
}


function resultadosVerificacionTraslados(desde, hasta) {

 if (!ArrayDataFiltrado || ArrayDataFiltrado.length === 0) {
    console.error("ArrayDataFiltrado no está definido o está vacío.");
    return;
  }

  const tipoconsulta = localStorage.getItem('entrada_Salida_Traslado_switch') === 'true'; // Convertir a booleano
  const columnaDestino = document.getElementById('destino');
  const columnaOrigen = document.getElementById('origen');
 // const colCantPrep = document.getElementById('cant_prep');   
  if (tipoconsulta) {
    // Si tipoconsulta es verdadero, mostrar BODEGA ORIGEN y ocultar BODEGA DESTINO TRASLADOS eNTRADA
    columnaDestino.hidden = true;
    columnaOrigen.hidden = false;
  } else {
    // Si tipoconsulta es falso, mostrar BODEGA DESTINO y ocultar BODEGA ORIGEN TRASLADOS SALIDA
    columnaDestino.hidden = false;
    columnaOrigen.hidden = true;
    //colCantPrep.hidden= true
  }

  const tabla = document.getElementById("tbltraslados");
  let tbody = tabla.querySelector("tbody");

  if (tbody) {
    tbody.innerHTML = "";
  } else {
    tbody = document.createElement("tbody");
    tabla.appendChild(tbody);
  }

  let htm = "";
  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      //let backgroundColor = i % 2 === 0 ? "" : "#fff";
      let backgroundColor = i % 2 === 0 ? "" : "#D7D5D5";     

      if(tipoconsulta){
        htm += `<tr onclick="irDetalleTraslado('${ArrayDataFiltrado[i].TRASLADO}','${ArrayDataFiltrado[i].BODEGA_DESTINO}','${ArrayDataFiltrado[i].ESTADO_TRASLADO}');" style="background-color:${backgroundColor};">`;
        htm += `<td>${ArrayDataFiltrado[i].TRASLADO}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].BODEGA_ORIGEN}</td>`;
       // htm += `<td>${ArrayDataFiltrado[i].LINEAS_VERIFICADAS}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].LINEAS_PREPARADAS}</td>`;
        htm += `<td>${Number(ArrayDataFiltrado[i].TOTAL_UNIDADES).toFixed(2)}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].FECHA}</td>`;
        htm += `</tr>`;  
      }else{
        htm += `<tr onclick="irDetalleTraslado('${ArrayDataFiltrado[i].TRASLADO}','${ArrayDataFiltrado[i].BODEGA_DESTINO}','${ArrayDataFiltrado[i].ESTADO_TRASLADO}');" style="background-color:${backgroundColor};">`;
        htm += `<td>${ArrayDataFiltrado[i].TRASLADO}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].BODEGA_DESTINO}</td>`;
        //htm += `<td>${ArrayDataFiltrado[i].LINEAS_VERIFICADAS}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].LINEAS_PREPARADAS}</td>`;
        htm += `<td>${Number(ArrayDataFiltrado[i].TOTAL_UNIDADES).toFixed(2)}</td>`;
        htm += `<td>${ArrayDataFiltrado[i].FECHA}</td>`;
        htm += `</tr>`;  
      }     
    }
  }
  tbody.innerHTML = htm; // Insertar el contenido generado en el tbody 
}

  function irDetalleTraslado(documento,bodegaDestino,estadoPreparacion) {
    let bodegaOrigen = document.getElementById("bodega").value;
    let pFechaHasta = $('#fecha_fin').val();
    let pFechaDesde = $('#fecha_ini').val();    
    const entradaSalida=localStorage.getItem('entrada_Salida_Traslado_switch');
      let pModulo="WMS_VP"
    let pOpcion="E";
    let typeRpt="D"
  
      if(entradaSalida==="false"){
        pOpcion="S"
        const params =
        "?pModulo="+ pModulo+  
        "&pOpcion="+ pOpcion+
        "&typeRpt=" + typeRpt +
        "&fechaIni=" + pFechaDesde +
        "&fechaFin=" + pFechaHasta +
        "&BodegaOrigen=" + bodegaOrigen; 
          localStorage.setItem("ListParamsDetalle",params) ;  
          localStorage.setItem("traslado", documento);
          localStorage.setItem("destinoBodegaTraslado", bodegaDestino);
          localStorage.setItem("estadotraslado",estadoPreparacion);
        window.location.href = 'detalleTrasladoSalida.html'; 
      }else{
        const params =
        "?pModulo="+ pModulo+  
        "&pOpcion="+ pOpcion+
        "&typeRpt=" + typeRpt +
        "&fechaIni=" + pFechaDesde +
        "&fechaFin=" + pFechaHasta +
        "&BodegaOrigen=" + bodegaOrigen; 
          localStorage.setItem("ListParamsDetalle",params) ;  
          localStorage.setItem("traslado", documento);
          localStorage.setItem("destinoBodegaTraslado", bodegaDestino);
          localStorage.setItem("estadotraslado",estadoPreparacion);
          window.location.href = 'detalleTrasladoEntrada.html'; 
      }
    
}

/////////////////Fucnion que activa el toggleSwitch para ver los traslados de entrada o salida
const trasladocheckbox = document.getElementById('trasladosSwitch');
/////////////// Agregar un evento de cambio al checkbox/////////////
trasladocheckbox.addEventListener('change', function () {
  //limpiarResultadoGeneral();
    localStorage.setItem('entrada_Salida_Traslado_switch',trasladocheckbox.checked);
    if (trasladocheckbox.checked === false) {
        entradaSalida(); 
    } else {
    }
    limpiarResultadoGeneral(); 
  });

/////////////////Fucnion que activa el toggleSwitch para ver los traslados de entrada o salida
function entradaSalida() {
    // Mostrar el cuadro de diálogo con SweetAlert2
    Swal.fire({
      title: '¿Desea ver solo los traslados de Salida?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6e7881",
    }).then((result) => {
      // Resultado de la acción
      if (result.isConfirmed) {
        $('#trasladosSwitch').prop('checked', false);        
      } else {
        $('#trasladosSwitch').prop('checked', true);
        localStorage.setItem('entrada_Salida_Traslado_switch','true');
      }
    });
  }

/////////////// Agregar un evento de cambio al checkbox/////////////
const mostrar_procesados_checkbox = document.getElementById('toggleSwitch');

mostrar_procesados_checkbox.addEventListener('change', function () {
    localStorage.setItem('trasladosprocesados',mostrar_procesados_checkbox.checked);
    if (mostrar_procesados_checkbox.checked === false) {
      trasladosFinalizados();
      
    } else {
    }
    limpiarResultadoGeneral(); 
  });
  
  /////////////////Fucnion que activa el toggleSwitch para ver los traslados facturados y finalizados
  function trasladosFinalizados() {
    // Mostrar el cuadro de diálogo con SweetAlert2
    Swal.fire({
      title: '¿Desea ver solo los traslados finalizados?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6e7881",
    }).then((result) => {
      // Resultado de la acción
      if (result.isConfirmed) {
        $('#toggleSwitch').prop('checked', false);       
      } else {
        $('#toggleSwitch').prop('checked', true);
        localStorage.setItem('trasladosprocesados','true');
      }
    });
  }

  function aplicarEstilosTabla() {
    $('#tbltraslados tbody tr').each(function () {
      var documentoValue = $(this).find('td:eq(0)').text().trim();
  
      if (documentoValue.startsWith('T')) {
        $(this).find('td:eq(0)').css({
          'color': 'red',
          'font-weight': 'bold',
        });
      }      
    });
  }


// //limpiar el contenido de la busqueda
function limpiarResultadoGeneral() {

  const tabla = document.getElementById("tbltraslados");
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
}

const fecha_ini=document.getElementById('fecha_ini');
fecha_ini.addEventListener('change', function(){
  limpiarResultadoGeneral();
});

const fecha_fin=document.getElementById('fecha_fin');
fecha_ini.addEventListener('change', function(){
  limpiarResultadoGeneral();
});