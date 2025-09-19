var ArrayData = new Array();
var ArrayData2 = new Array();
var ArrayDataFiltrado = new Array();

var ArrayPrecio = new Array();
var promo = "";
var viewImcompletos = false;
var clearFiltros = false;
var xPag = 20;
var itemsToDelete = "";
var itemsToDelete_NoProm = "";
var promoToDelete = "";
let acumToDelete = JSON.parse(sessionStorage.getItem("itemsToDelete"));
//-----------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM cargado...')
   //--------------------------------------------------
  validate_login();
  existeBodega();
  localStorage.setItem("sinExistencias", "false");
  const checkbox = document.getElementById("sinExistencias");
  if(checkbox){
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        localStorage.setItem("sinExistencias", "true");
      } else {
        localStorage.setItem("sinExistencias", "false");
      }
    });
  }

  

});
//-----------------------------------------------------------------------------------
function validate_login() {
  const user = sessionStorage.getItem("user");
  if (user) {
    const usuario = existe_Usuario();    
    document.getElementById("usuario").innerHTML = usuario;
    document.getElementById("hUsuario").value = usuario;
  } else {
    window.location = "index.html";
  }
}
//-----------------------------------------------------------------------------------
function existe_Usuario() {
  const usuario = sessionStorage.getItem("user");
  return JSON.parse(usuario) || [];
}
$(document).ready(function () {
  $("#bodega-sucursal").click(function () {
    const usuario = existe_Usuario();
    let htm = "";
    fetch(env.API_URL + "Tiendas?user=" + usuario, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === "SUCCESS") {
          if (result.tiendas.length != 0) {
            $("#bodega_sucursales").modal({ dismissible: false });
            $("#bodega_sucursales").modal("open");
            result.tiendas.forEach(function (key, index) {
              htm += `<!-- CONTENEDOR SUCURSALES -->
                        <div class="sucursal">
                              <h3 class="header-sucursal">${key.NOMBRE}</h3>
                              <div class="description-sucursal">
                                <h5 class="left-align">Dirección</h5>
                                <h6>${key.DIRECCION}</h6>
                                <h6><b>Teléfono:</b> ${key.TELEFONO}</h6>
                                <h5 class="left-align">Horario</h5>
                                <h6>Lunes - Viernes <strong> 8:00am - 5:00pm</strong></h6>
                                <h6>Sábado <strong>8:00am - 1:00pm</strong></h6>
                                <h6>Domingo <strong>Cerrada</strong></h6>
                                <a href="javascript:void(0);" onclick="sucursalbremen('${key.NOMBRE}', '${key.BODEGA}');" class="ui-btn">Elegir esta tienda</a>
                              </div>
                        </div>
                        <!-- CONTENEDOR SUCURSALES -->
                      `;
            });
            document.getElementById("carga_more_sucursales").innerHTML = htm;
          } else {
            alert("Else de condición");
          }
        } else {         
        }
      });
  }); 
});

/////////////////////////////////////// LOGOUT //////////////////////////-------------
//------------------------------------------------------------------------------------
function logout() {
  // Eliminar todas las variables de sessionStorage
  Object.keys(sessionStorage).forEach(function (key) {
    sessionStorage.removeItem(key);
  });

  // Eliminar todas las variables de localStorage
  Object.keys(localStorage).forEach(function (key) {
    localStorage.removeItem(key);
  });

  // Redirigir al usuario a la página de inicio
  window.location.href = "index.html";
   // window.location.href = 'http://200.124.12.146:8108/session/close.php';
}
//-----------------------------------------------------------------------------------
function enlace(link) {
  window.location.href = link;
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
function existeBodega() {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  if (bodega) {
    document.getElementById("bodega-sucursal").innerHTML = bodega[0].NOMBRE;
    document.getElementById("bodega").value = bodega[0].BODEGA;   
  }
}
//--------------------FILTROS MODAL DEL BUSCADOR-------------------------------------
function filtrosModal() {
  let htm = "", IDCategoria = "1055";
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);

  if (elem.style.display === 'none') {
    instance.open();
  } else {
    instance.open();
    localStorage.removeItem('claseSelect');
    htm = ` <div class="row">
            <div class="col s12">
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header"><i class="material-icons">add</i>CLASE</div>
                  <div class="collapsible-body">
                    <div id="filtroclase" style="padding-left: 10px"></div>
                      <input type="hidden" value="" id="txtClaseV" name="txtClaseV">
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header"><i class="material-icons">add</i>MARCA</div>
                  <div class="collapsible-body">
                      <div id="filtromarca" style="padding-left: 10px"></div>
                        <input type="hidden" value="" id="txtMarcaV" name="txtMarcaV" >
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header"><i class="material-icons">add</i>TIPO</div>
                  <div class="collapsible-body">
                      <div id="filtrotipo" style="padding-left: 10px"></div>
                        <input type="hidden" value="" id="txtTipo" name="txtTipo" >
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header"><i class="material-icons">add</i>SUBTIPO</div>
                  <div class="collapsible-body">
                      <div id="filtrosubtipo" style="padding-left: 10px"></div>
                        <input type="hidden" value="" id="txtSubtipo" name="txtSubtipo" >
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header"><i class="material-icons">add</i>SUBTIPO2</div>
                  <div class="collapsible-body">
                      <div id="filtrosubtipo2" style="padding-left: 10px"></div>
                        <input type="hidden" value="" id="txtSubtipo2" name="txtSubtipo2" >
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <ul class="collapsible">
                <li>
                  <div class="collapsible-header"><i class="material-icons">add</i>ENVASE</div>
                  <div class="collapsible-body">
                      <div id="filtroenvase" style="padding-left: 10px"></div>
                        <input type="hidden" value="" id="txtEnvase" name="txtEnvase" >
                  </div>
                </li>
              </ul>
            </div>
          </div>`;
    htm += `<div class="row">
          <div class="col s6">
            <a onclick="preBusqueda();" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">check</i>
              Aceptar
            </a>
          </div>
          <div class="col s6">
            <a onclick="LimpiarFiltroPre();" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">update</i>
              Limpiar
            </a>
          </div>
        </div>`;
    ////console.log(htm);
    document.getElementById("divFiltro").innerHTML = htm;
    // Llamar las marcas por API
    getFiltros().then(() => {
      // Una vez que los datos estén listos, llamamos a MostrarClases()
      document.getElementById("filtroclase").innerHTML = MostrarClases(1);
    }).catch((error) => {
      console.error("Error:", error);
    });
    $(".collapsible").collapsible();
  }
}
//----------------------------Filtros Pre Busqueda-----------------------------------
function getFiltros(clase, marca, tipo, subtipo, subtipo2, envase) {
  clase = clase !== undefined ? clase : '';
  marca = marca !== undefined ? marca : '';
  tipo = tipo !== undefined ? tipo : '';
  subtipo = subtipo !== undefined ? subtipo : '';
  subtipo2 = subtipo2 !== undefined ? subtipo2 : '';
  envase = envase !== undefined ? envase : '';

  params =
    "?clase=" +
    clase +
    "&marca=" +
    marca +
    "&tipo=" +
    tipo +
    "&subtipo=" +
    subtipo +
    "&subtipo2=" +
    subtipo2 +
    "&envase=" +
    envase;

  return fetch(env.API_URL + "filtroswms" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.filtros.length > 0) {
          ArrayData = formatData(result.filtros);
          //console.log("Datos formateados:", ArrayData);
          if (ArrayData.some(item => item.hasOwnProperty('CLASIFICACION_2'))) {
            localStorage.setItem('claseSelect', clase);
            localStorage.removeItem('marcaSelect');
            localStorage.removeItem('tipoSelect');
            localStorage.removeItem('subtipoSelect');
            localStorage.removeItem('subtipo2Select');
            localStorage.removeItem('envaseSelect');
            document.getElementById("filtromarca").innerHTML = MostrarMarcas(1);
          }
          else if (ArrayData.some(item => item.hasOwnProperty('CLASIFICACION_3'))) {
            localStorage.setItem('marcaSelect', marca);
            localStorage.removeItem('tipoSelect');
            localStorage.removeItem('subtipoSelect');
            localStorage.removeItem('subtipo2Select');
            localStorage.removeItem('envaseSelect');
            document.getElementById("filtrotipo").innerHTML = MostrarTipos(1);
          }
          else if (ArrayData.some(item => item.hasOwnProperty('CLASIFICACION_4'))) {
            localStorage.setItem('tipoSelect', tipo);
            localStorage.removeItem('subtipoSelect');
            localStorage.removeItem('subtipo2Select');
            localStorage.removeItem('envaseSelect');
            document.getElementById("filtrosubtipo").innerHTML = MostrarSubTipos(1);
          }
          else if (ArrayData.some(item => item.hasOwnProperty('CLASIFICACION_5'))) {
            localStorage.setItem('subtipoSelect', subtipo);
            localStorage.removeItem('subtipo2Select');
            localStorage.removeItem('envaseSelect');
            document.getElementById("filtrosubtipo2").innerHTML = MostrarSubTipos2(1);
          }
          else if (ArrayData.some(item => item.hasOwnProperty('CLASIFICACION_6'))) {
            localStorage.setItem('subtipo2Select', subtipo2);
            localStorage.removeItem('envaseSelect');
            // localStorage.setItem('envaseSelect', envase);
            document.getElementById("filtroenvase").innerHTML = MostrarEnvases(1);
          }         
        } else {
          Swal.fire({
            icon: "warning",
            title: "Información",
            text: "No hay resultado de la consulta",
            confirmButtonColor: "#f90f00",
          });
          document.getElementById("carga").innerHTML = "";
          return []; // Devolver un arreglo vacío en caso de que no haya resultados
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Rechazar la promesa con el error
    });
}
//-----------------------------------------------------------------------------------
function formatData(data) {
  
  return data.map((item) => {
    // Verificar si el objeto item tiene la columna DESCRIPCION
    if ("DESCRIPCION" in item) {
      // Inicializar la bandera para determinar si se ha encontrado una clasificación válida
      let foundClassification = false;

      // Verificar las columnas de clasificación y actuar en consecuencia
      if ("CLASIFICACION_1" in item) {
        foundClassification = true;
        return {
          CLASIFICACION_1: item.CLASIFICACION_1,
          CLASE: item.DESCRIPCION,
        };
      }
      if ("CLASIFICACION_2" in item) {
        foundClassification = true;
        return {
          CLASIFICACION_2: item.CLASIFICACION_2,
          MARCA: item.DESCRIPCION,
        };
      }
      if ("CLASIFICACION_3" in item) {
        foundClassification = true;
        return {
          CLASIFICACION_3: item.CLASIFICACION_3,
          TIPO: item.DESCRIPCION,
        };
      }
      if ("CLASIFICACION_4" in item) {
        foundClassification = true;
        return {
          CLASIFICACION_4: item.CLASIFICACION_4,
          SUBTIPO: item.DESCRIPCION,
        };
      }
      if ("CLASIFICACION_5" in item) {
        foundClassification = true;
        return {
          CLASIFICACION_5: item.CLASIFICACION_5,
          SUBTIPO2: item.DESCRIPCION,
        };
      }
      if ("CLASIFICACION_6" in item) {
        foundClassification = true;
        return {
          CLASIFICACION_6: item.CLASIFICACION_6,
          ENVASE: item.DESCRIPCION,
        };
      }

      // Si no se ha encontrado ninguna clasificación válida, retornar solo la DESCRIPCION
      if (!foundClassification) {
        return {};
      }
    } else {
      // Si no tiene la columna DESCRIPCION, retornar un objeto vacío
      return {};
    }
  });
}
//-----------------------------------------------------------------------------------
function cerrarModal() {
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.close();
}
//-----------------------------------------------------------------------------------
$("#articulo").on("keypress", function (e) {
  if (e.keyCode == 13 || e.keyCode == 9) {
    e.preventDefault();   
    preBusqueda();    
  }
});
//-----------------------------------------------------------------------------------
$("#txtRuc").on("keypress", function (e) {
  if (e.keyCode == 13 || e.keyCode == 9) {
    e.preventDefault();   
  }
});
//-----------------------------------------------------------------------------------
$(document).ready(function () {
  $(".sidenav").sidenav();
  $(".tabs").tabs();
  $(".collapsible").collapsible();
  $(".modal").modal();
  $("select").formSelect();
  $(".dropdown-trigger").dropdown();
  $(".datepicker").datepicker({
    firstDay: true,
    format: "yyyy-mm-dd",
    maxDate: new Date(), //DESABILITA LAS FECHAS FUTURAS
    i18n: {
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      monthsShort: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sept",
        "Oct",
        "Nov",
        "Dic",
      ],
      weekdays: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
      weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
      cancel: "Cancelar",
      clear: "Limpiar",
    },
  });
  var myDate = new Date();
  var date =
    myDate.getFullYear() +
    "-" +
    (myDate.getMonth() + 1) +
    "-" +
    myDate.getDate();
  $("#fecha_ini").val(date);
  $("#fecha_fin").val(date);
});
//-----------------------------------------------------------------------------------
//-----------------BUSQUEDA REGULAR -------------------------------------------------
//-----------------------------------------------------------------------------------
function preBusqueda() {
  // let nPag = 0;
  let pag = 1;
  
  let articulo = document.getElementById("articulo").value.trim();
  
localStorage.removeItem('mostrarEnBodega');
  const art = encodeURIComponent(articulo);
  let bodega = document.getElementById("bodega").value;
  let clase = localStorage.getItem('claseSelect') || '';
  let marca = localStorage.getItem('marcaSelect') || '';
  let tipo = localStorage.getItem('tipoSelect') || '';
  let envase = localStorage.getItem('envaseSelect') || '';
  const checkbox = document.getElementById("sinExistencias");
  const sinExistencias = checkbox ? checkbox.checked : false;
  // localStorage.setItem("sinExistencias",sinExistencias);
  let existenciaBusqueda = "";
  
  if (sinExistencias) {    
    console.log("Buscando con ítems sin existencias...");
     existenciaBusqueda = "N";  
  } else {    
    console.log("Buscando solo ítems con existencias...");
    existenciaBusqueda = "S";
  }
  const params =
    "?pActivos=" +
    "S" +
    "&pExistencia=" +
    existenciaBusqueda +
    "&pArticulo=" +
    art +
    "&pClase=" +
    clase +
    "&pMarca=" +
    marca +
    "&pUso=" +
    tipo +
    "&pEnvase=" +
    envase +
    "&pBodega=" +
    bodega +
    "&pTipoBodega=" +
    0;
    mostrarLoader();
  fetch(env.API_URL + "wmsbusquedaarticulos/1" + params, myInit)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con la API. Por favor, intenta de nuevo.",
        confirmButtonColor: "#28a745",
      });
      ocultarLoader();
    })
    .then((result) => {
      if (result && result.msg === "SUCCESS") {
        console.log('Cantidad de Registros: ', result.data.length);
        console.log(result.data);
        
        if (result.data.length > 0) {
          ArrayData = result.data;
          ArrayDataFiltrado = result.data;          
          ArrayData2 = result.data;
         localStorage.setItem("articulo-Busqueda", JSON.stringify(ArrayData));

          //console.log("DATA DE BUSQUEDA...", ArrayData);
          let totales = ArrayDataFiltrado.length;
          nPag = Math.ceil(totales / xPag);
          LimpiarFiltroPre(1);
          mostrarResultadosBusqueda(nPag, pag);        
          ocultarLoader();
        } else {
          Swal.fire({
            icon: "info",
            title: "Información",
            text: "No hay resultado para la búsqueda: " + articulo,
            confirmButtonColor: "#28a745",
          });
          ocultarLoader();
          LimpiarFiltroPre(1);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Respuesta inválida de la API.",
          confirmButtonColor: "#28a745",
        });
        ocultarLoader();
      }
    });
}
//-----------------------------------------------------------------------------------
function mostrarResultadosBusqueda(nPag, pag) {
 
  let htm = "";
  let desde = (pag - 1) * xPag;
  let hasta = Math.min(pag * xPag, ArrayDataFiltrado.length);

  // Asegurar que desde y hasta estén dentro de los límites
  if (desde >= ArrayDataFiltrado.length) {
    desde = 0;
    hasta = Math.min(xPag, ArrayDataFiltrado.length);
    pag = 1;
  }

  htm = mostrarResultados(desde, hasta);
  htm += paginador(nPag, pag);
  document.getElementById("resultadoBusqueda").innerHTML = htm;
  $("html, body").animate(
    {
      scrollTop: $("#resultadoBusqueda").offset().top - 140,
    },
    1000
  );
  $("select").formSelect();
  $(".dropdown-trigger").dropdown();
}
//-----------------------------------------------------------------------------------
function mostrarResultados(desde, hasta) {
  let htm = "";
  let bodegaLabel = "";
  let url = "";

      const checkbox = document.getElementById("sinExistencias");
if(checkbox){
let esistencias= localStorage.getItem("sinExistencias")==="true";
          if(esistencias){
            checkbox.checked=true;
          }else{
            checkbox.checked=false;
          }
}
    

  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
            <h2 style="text-align:center; text-transform: uppercase;">Resultados de la Búsqueda</h2>
          </div>
          
          `;

htm += `<div class="row" id="totalregistros">        
          <div class="col s6 valign-wrapper">
            <label>
              <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
              <span>Mostrar En Bodega</span>
            </label>
          </div>
            <div class="col s6 valign-wrapper">
            <span>Total de Registros: </span>
            <span>${ArrayDataFiltrado.length}</span>
          </div>
        </div>
        
        <div class="row" id="vistabusqueda">
          <div class="col s6">
            <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
              <i class="material-icons right">list</i>
              VISTA
            </a>
          </div>
          <div class="col s6">
            <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
              <i class="material-icons right">filter_list</i>
              FILTRAR
            </a>
          </div>
        </div>`;

  htm += '<div class="grid-container">'; // Contenedor de la cuadrícula

  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      let DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
      const cantBodega = parseFloat(ArrayDataFiltrado[i].TOTAL_CANTIDAD_BODEGA) || 0;

      // Etiqueta de bodega
      bodegaLabel = cantBodega > 0 ? `<span class="mi-tienda">En Bodega</span>` : `<span></span>`;

      // URL de la imagen (manejo de FOTO = "S" o "N")
      const imagenUrl =
        ArrayDataFiltrado[i].FOTO === "S"? `${env.API_IMAGE}/${DArticulo}` : "https://via.placeholder.com/150?text=Sin+Imagen"; // Imagen por defecto si FOTO = "N"

      url = `href="#"`;

      // Reglas de color
      let colorReorden = "";
      if (ArrayDataFiltrado[i].color === "R") {
        colorReorden = "red accent-4";
      } else if (ArrayDataFiltrado[i].color === "A") {
        colorReorden = "light-blue darken-1";
      } else if (ArrayDataFiltrado[i].color === "N") {
        colorReorden = "deep-orange accent-3";
      } else if (ArrayDataFiltrado[i].color === "V") {
        colorReorden = "green darken-1";
      }     
      htm +=`<div class="container-img">
                 <div id="envoltorio">
               <a ${url}>                
                 <img src="${env.API_IMAGE}/${DArticulo}" width="100%" data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
                  ${bodegaLabel}
               </a>
               <div class="flotante-acciones ${colorReorden}">
                  <div class="link-flotante-acciones-forklift " >
                   <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
                     <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" tabindex="1">
                   </a>             
                 </div>
                  <div class="link-flotante-acciones-bar-code ">
                   <a id="dropbtn${i}" class="dropbtn2x" onclick="impCodBar('${ArrayDataFiltrado[i].ARTICULO}','${ArrayDataFiltrado[i].DESCRIPCION}')">
                   <img src="./img/icon/bar-code.svg"  width="22" height="22">
                   </a>             
                 </div>
                    <div class="link-flotante-acciones-information " >
                   <a id="dropbtn${i}" class="dropbtn2x" onclick="information('${ArrayDataFiltrado[i].ARTICULO}','${ArrayDataFiltrado[i].DESCRIPCION}')">
                   <img src="./img/icon/information.svg"  width="22" height="22">
                   </a>             
                 </div>
               </div>          
             </div>
          <h3 class="articulo-titulo">Nombre: ${ArrayDataFiltrado[i].ARTICULO}</h3>
          <h4>Descripción: ${ArrayDataFiltrado[i].DESCRIPCION}</h4>
          <h4>Cantidad: ${cantBodega.toFixed(2)}</h4>
        </div>`;
    }
  }
  htm += "</div>"; // Cierra grid-container
  htm += "</div>"; // Cierra lista-articulo
  return htm;
}
//------------------------------------------------------------------------------------
function paginador(nPag, pag) {
  //MUESTRA LA CANTIDAD DE PAGINA
  let selected = "";
  sel = `<select class="browser-default" onchange="mostrarResultadosBusqueda(${nPag}, this.value)">
        <option value="" disabled>Páginas</option>`;
  for (var i = 0; i < nPag; i++) {
    if (i + 1 == pag) {
      selected = "selected";
    } else {
      selected = "";
    }
    if (nPag != 1) {
      sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
        }</option>`;
    }
  }
  sel += `</select>`;

  if (pag <= 1) btnAtras = `<a style="color: #aba7a7;">❮ Anterior</a>`;
  else
    btnAtras = `<a onclick="mostrarResultadosBusqueda(${nPag} , ${parseInt(pag) - 1
      });">❮ Anterior</a>`;

  if (pag >= nPag) btnSig = `<a style="color: #aba7a7;"> Siguiente ❯ </a>`;
  else
    btnSig = `<a onclick="mostrarResultadosBusqueda(${nPag},${parseInt(pag) + 1
      })">Siguiente ❯</a>`;

  return `<div id="paginador">
        <div class="row">
          <div class="col s4"></div>
          <div class="col s4" style="text-align: center">${pag}/${nPag}</div>
          <div class="col s4"></div>
        </div>
        <div class="row" style="width:fit-content !important;">
            <div class="col s4" id="btnAtras" style="width:fit-content !important;">
              ${btnAtras}
            </div>
          <div class="col s4">
            ${sel}
          </div>
          <div class="col s4" id="btnSig" style="width:fit-content !important;">
            ${btnSig}
          </div>
        </div>
      </div><br>`;
}
//-----------------------------------------------------------------------------------
function expand(id) {
  let ids = document.getElementById(id);
  if (ids.style.display === "none") ids.style.display = "table-row-group";
  else ids.style.display = "none";
}
//-----------------------------------------------------------------------------------
function closetooltips() {
  document.querySelectorAll(".tooltips-luciano").forEach(function (el) {
    el.style.display = "none";
  });
}
//-----------------------------------------------------------------------------------
// function CerrarModal(key) {
//   //console.log(key);
//   elem = document.getElementById(key);
//   let instance = M.Modal.getInstance(elem);
//   instance.close();
// }
//-----------------------------------------------------------------------------------
function ordenarDescripcion(data) {
  return data.sort(function (a, b) {
    if (a.DESCRIPCION > b.DESCRIPCION) {
      return 1;
    }
    if (a.DESCRIPCION < b.DESCRIPCION) {
      return -1;
    }
    return 0;
  });
}
//-----------------------------------------------------------------------------------
//--------------------FILTROS SOBRE LOS RESULTADOS-----------------------------------
//-----------------------------------------------------------------------------------
function FiltrarModal(IDCategoria, seccion) {
  let htm = "";  
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.open();
  switch (IDCategoria) {
    case "1055":
      htm = `<div class="row">
                  <div class="col s12">
                    <fieldset style="    border: 0;
                      text-shadow: none !important;
                      font-weight: normal !important;
                      background-color: transparent !important;
                      color: #000 !important;
                      border: solid 1px #c1bcbc;margin: 0.5em 0;">
                      <label>
                        <input type="checkbox" id="rematetxt" value="R"/>
                        <span>Solo artículos de remate </span><span id="cantRemate" style="font-size: 15px;">0</span>
                      </label>
                    </fieldset>
                    <fieldset style="border: 0;
                      text-shadow: none !important;
                      font-weight: normal !important;
                      background-color: transparent !important;
                      color: #000 !important;
                      border: solid 1px #c1bcbc;margin: 0.5em 0;">
                      <label>
                        <input type="checkbox" id="incompletotxt" value="I" />
                        <span>Solo artículos incompletos </span><span id="cantIncompleto" style="font-size: 15px;">0</span>
                      </label>
                    </fieldset>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>MARCAS</div>
                        <div class="collapsible-body">
                          <div id="filtromarcas" style="padding-left: 10px"></div>
                            <input type="hidden" value="" id="txtMarcasV" name="txtMarcasV">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>ANCHOS</div>
                        <div class="collapsible-body">
                            <div id="filtroanchos" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtAnchosV" name="txtAnchosV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>CENTER BORE(CB)</div>
                        <div class="collapsible-body">
                            <div id="filtrocenter" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtCBV" name="txtCBV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>OFFSET (ET)</div>
                        <div class="collapsible-body">
                            <div id="filtrooffset" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtETV" name="txtETV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>`;
      break;
    default:
      htm = `   <div class="row">                
                  </div>    
                  <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>CLASES</div>
                        <div class="collapsible-body">
                          <div id="filtroclases" style="padding-left: 10px"></div>
                            <input type="hidden" value="" id="txtClasesV" name="txtClasesV">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>MARCAS</div>
                        <div class="collapsible-body">
                          <div id="filtromarcas" style="padding-left: 10px"></div>
                            <input type="hidden" value="" id="txtMarcasV" name="txtMarcasV">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>TIPOS</div>
                        <div class="collapsible-body">
                            <div id="filtrotipos" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtTiposV" name="txtTiposV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>SUBTIPOS</div>
                        <div class="collapsible-body">
                            <div id="filtrosubtipos" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtSubTiposV" name="txtSubTiposV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>SUBTIPOS2</div>
                        <div class="collapsible-body">
                            <div id="filtrosubtipos2" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtSubTipos2V" name="txtSubTipos2V" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>ENVASES</div>
                        <div class="collapsible-body">
                            <div id="filtroenvases" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtEnvasesV" name="txtEnvasesV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>`;
      break;
  }
  htm += `<div class="row">
          <div class="col s6">
            <a onclick="Filtrar(${IDCategoria},${seccion});" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">filter_list</i>
              Aceptar
            </a>
          </div>
          <div class="col s6">
            <a onclick="LimpiarFiltro(${IDCategoria});" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">update</i>
              Limpiar
            </a>
          </div>
        </div>`;
        document.getElementById("divFiltro").innerHTML = htm;
        document.getElementById("filtroclases").innerHTML = MostrarClases();
        document.getElementById("filtromarcas").innerHTML = MostrarMarcas();
        document.getElementById("filtrotipos").innerHTML = MostrarTipos();
        document.getElementById("filtrosubtipos").innerHTML = MostrarSubTipos();
        document.getElementById("filtrosubtipos2").innerHTML = MostrarSubTipos2();
        document.getElementById("filtroenvases").innerHTML = MostrarEnvases();
        $(".collapsible").collapsible();
        // const estado = localStorage.getItem("mostrarEnBodega");
        // if (estado === "1") {
        //     document.getElementById("miCheckbox").checked = true;
        // } else {
        //     document.getElementById("miCheckbox").checked = false;
        // }

}
//--------------------------------Mostrar Marcas-------------------------------------
function MostrarMarcas(opt) {
  const result = [];
  const map = new Map();
  let marcaHTML = "";
  for (const item of ArrayData) {
    switch (opt) {
      case 1:
        if (!map.has(item.MARCA)) {
          map.set(item.MARCA, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_2,
            DESCRIPCION: item.MARCA,
          });
        }
        marcaHTML = mostrarFiltro(result, "txtMarca", 2);
        break;
      default:
        if (!map.has(item.MARCA)) {
          map.set(item.MARCA, true); // set any value to Map
          result.push({
            VALOR: item.MARCA,
            DESCRIPCION: item.MARCA,
          });
        }
        marcaHTML = mostrarFiltro(result, "txtMarca");
        break;
    }
  }
  return marcaHTML;
}
//--------------------------------Mostrar Clases-------------------------------------
function MostrarClases(opt) {
  const result = [];
  const map = new Map();
  let claseHTML = "";
  for (const item of ArrayData) {
    switch (opt) {
      case 1:
        if (!map.has(item.CLASE)) {
          map.set(item.CLASE, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_1,
            DESCRIPCION: item.CLASE,
          });
        }
        claseHTML = mostrarFiltro(result, "txtClase", opt);
        break;
      default:
        if (!map.has(item.CLASE)) {
          map.set(item.CLASE, true); // set any value to Map
          result.push({
            VALOR: item.CLASE,
            DESCRIPCION: item.CLASE,
          });
        }
        claseHTML = mostrarFiltro(result, "txtClase");
        break;
    }
  }
  return claseHTML;
}
//--------------------------------Mostrar Tipos--------------------------------------
function MostrarTipos(opt) {
  const result = [];
  const map = new Map();
  let tipoHTML = "";
  for (const item of ArrayData) {
    switch (opt) {
      case 1:
        if (!map.has(item.TIPO)) {
          map.set(item.TIPO, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_3,
            DESCRIPCION: item.TIPO,
          });
        }
        tipoHTML = mostrarFiltro(result, "txtTipo", 3);
        break;
      default:
        if (!map.has(item.TIPO)) {
          map.set(item.TIPO, true); // set any value to Map
          result.push({
            VALOR: item.TIPO,
            DESCRIPCION: item.TIPO,
          });
        }
        tipoHTML = mostrarFiltro(result, "txtTipo");
        break;
    }
  }
  return tipoHTML;
}
//--------------------------------Mostrar SubTipos-----------------------------------
function MostrarSubTipos(opt) {
  const result = [];
  const map = new Map();
  let subtipoHTML = "";
  for (const item of ArrayData) {
    switch (opt) {
      case 1:
        if (!map.has(item.SUBTIPO)) {
          map.set(item.SUBTIPO, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_4,
            DESCRIPCION: item.SUBTIPO,
          });
        }
        subtipoHTML = mostrarFiltro(result, "txtSubTipo", 4);
        break;
      default:
        if (!map.has(item.SUBTIPO)) {
          map.set(item.SUBTIPO, true); // set any value to Map
          result.push({
            VALOR: item.SUBTIPO,
            DESCRIPCION: item.SUBTIPO,
          });
        }
        subtipoHTML = mostrarFiltro(result, "txtSubTipo");
        break;
    }
  }
  return subtipoHTML;
}
//--------------------------------Mostrar SubTipos2----------------------------------
function MostrarSubTipos2(opt) {
  const result = [];
  const map = new Map();
  let subtipo2HTML = "";
  for (const item of ArrayData) {
    switch (opt) {
      case 1:
        if (!map.has(item.SUBTIPO2)) {
          map.set(item.SUBTIPO2, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_5,
            DESCRIPCION: item.SUBTIPO2,
          });
        }
        subtipo2HTML = mostrarFiltro(result, "txtSubTipo2", 5);
        break;
      default:
        if (!map.has(item.SUBTIPO2)) {
          map.set(item.SUBTIPO2, true); // set any value to Map
          result.push({
            VALOR: item.SUBTIPO2,
            DESCRIPCION: item.SUBTIPO2,
          });
        }
        subtipo2HTML = mostrarFiltro(result, "txtSubTipo2");
        break;
    }
  }
  return subtipo2HTML;
}
//--------------------------------Mostrar Envases------------------------------------
function MostrarEnvases(opt) {
  const result = [];
  const map = new Map();
  let envaseHTML = "";
  for (const item of ArrayData) {
    switch (opt) {
      case 1:
        if (!map.has(item.ENVASE)) {
          map.set(item.ENVASE, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_6,
            DESCRIPCION: item.ENVASE,
          });
        }
        envaseHTML = mostrarFiltro(result, "txtEnvase", 6);
        break;
      default:
        if (!map.has(item.ENVASE)) {
          map.set(item.ENVASE, true); // set any value to Map
          result.push({
            VALOR: item.ENVASE,
            DESCRIPCION: item.ENVASE,
          });
        }
        envaseHTML = mostrarFiltro(result, "txtEnvase");
        break;
    }
  }
  return envaseHTML;
}
//-----------------------------------------------------------------------------------
function mostrarFiltro(data, id, opt) {
  data = ordenarDescripcion(data);
  let claseSelect, marcaSelect, tipoSelect, subtipoSelect, subtipo2Select;
  claseSelect = localStorage.getItem('claseSelect');
  var htm = "";
  var i = parseInt(1);
  if (data.length > 0) {
    data.forEach(function (key, index) {
      if (key.VALOR != null && key.DESCRIPCION != null) {
        switch (opt) {
          //Clase
          case 1:
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros('${key.VALOR}');">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          //Marca
          case 2:
            claseSelect = localStorage.getItem('claseSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          //Tipo
          case 3:
            claseSelect = localStorage.getItem('claseSelect');
            marcaSelect = localStorage.getItem('marcaSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${marcaSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          //SubTipo
          case 4:
            claseSelect = localStorage.getItem('claseSelect');
            marcaSelect = localStorage.getItem('marcaSelect');
            tipoSelect = localStorage.getItem('tipoSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${marcaSelect},${tipoSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          case 5:
            claseSelect = localStorage.getItem('claseSelect');
            marcaSelect = localStorage.getItem('marcaSelect');
            tipoSelect = localStorage.getItem('tipoSelect');
            subtipoSelect = localStorage.getItem('subtipoSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${marcaSelect},${tipoSelect},${subtipoSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          case 6:
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="guardarEnvaseSelect(${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          default:
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltro('${id}','${id + i}');">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
        }
        i = i + 1;
      }
    });
    return htm;
  } else return "<label >Filtro no existe</label>";
}
//--------------------------Guardar Envase Seleccionado------------------------------
function guardarEnvaseSelect(envaseSelect) {
  localStorage.setItem('envaseSelect', envaseSelect);
}
//-----------------------------------------------------------------------------------
function getFiltro(id, txtInput) {
  let valorM = "",
    valorC = "",
    valorT = "",
    valorST = "",
    valorST2 = "",
    valorE = "";
 

  let chk = "";
  //-------------------Marca-------------------------------------
  if (id == "txtMarca") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      let marcaID = $("#" + txtInput).val();
      let marcaH = $("#txtMarcasV").val();
      //console.log(marcaH);
      if (marcaH.length > 0) {
        valorM += marcaH + "," + marcaID;
      } else {
        valorM += marcaID;
      }
      $("#txtMarcasV").val(valorM);
    } else {
      var marcaID = $("#" + txtInput).val();
      var marcaH = $("#txtMarcasV").val();
      if (marcaH.length > 0) {
        valorMH = BuscarBorrar(marcaH, marcaID);
      } else {
        valorMH += "";
      }
      $("#txtMarcasV").val(valorMH);
    }
  }
  //-------------------Clase-------------------------------------
  if (id == "txtClase") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      let claseID = $("#" + txtInput).val();
      let claseH = $("#txtClasesV").val();
      //console.log(claseH);
      if (claseH.length > 0) {
        valorC += claseH + "," + claseID;
      } else {
        valorC += claseID;
      }
      $("#txtClasesV").val(valorC);
    } else {
      var claseID = $("#" + txtInput).val();
      var claseH = $("#txtMarcasV").val();
      if (claseH.length > 0) {
        valorC = BuscarBorrar(claseH, claseID);
      } else {
        valorC += "";
      }
      $("#txtClasesV").val(valorC);
    }
  }
  //-------------------Tipo-------------------------------------
  if (id == "txtTipo") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      let tipoID = $("#" + txtInput).val();
      let tipoH = $("#txtTiposV").val();
      //console.log(tipoH);
      if (tipoH.length > 0) {
        valorT += tipoH + "," + tipoID;
      } else {
        valorT += tipoID;
      }
      $("#txtTiposV").val(valorT);
    } else {
      var tipoID = $("#" + txtInput).val();
      var tipoH = $("#txtTiposV").val();
      if (tipoH.length > 0) {
        valorT = BuscarBorrar(tipoH, tipoID);
      } else {
        valorT += "";
      }
      $("#txtTiposV").val(valorT);
    }
  }
  //-------------------SubTipo-------------------------------------
  if (id == "txtSubTipo") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      let subtipoID = $("#" + txtInput).val();
      let subtipoH = $("#txtSubTiposV").val();
      //console.log(subtipoH);
      if (subtipoH.length > 0) {
        valorST += subtipoH + "," + subtipoID;
      } else {
        valorST += subtipoID;
      }
      $("#txtSubTiposV").val(valorST);
    } else {
      var subtipoID = $("#" + txtInput).val();
      var subtipoH = $("#txtSubTiposV").val();
      if (subtipoH.length > 0) {
        valorST = BuscarBorrar(subtipoH, subtipoID);
      } else {
        valorST += "";
      }
      $("#txtSubTiposV").val(valorST);
    }
  }
  //-------------------SubTipo2-------------------------------------
  if (id == "txtSubTipo2") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      let subtipo2ID = $("#" + txtInput).val();
      let subtipo2H = $("#txtSubTipos2V").val();
      //console.log(subtipo2H);
      if (subtipo2H.length > 0) {
        valorST2 += subtipo2H + "," + subtipo2ID;
      } else {
        valorST2 += subtipo2ID;
      }
      $("#txtSubTipos2V").val(valorST2);
    } else {
      var subtipo2ID = $("#" + txtInput).val();
      var subtipo2H = $("#txtSubTipos2V").val();
      if (subtipo2H.length > 0) {
        valorST2 = BuscarBorrar(subtipo2H, subtipo2ID);
      } else {
        valorST2 += "";
      }
      $("#txtSubTipos2V").val(valorST2);
    }
  }
  //-------------------Envase-------------------------------------
  if (id == "txtEnvase") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      let envaseID = $("#" + txtInput).val();
      let envaseH = $("#txtEnvasesV").val();
      //console.log(envaseH);
      if (envaseH.length > 0) {
        valorE += envaseH + "," + envaseID;
      } else {
        valorE += envaseID;
      }
      $("#txtEnvasesV").val(valorE);
    } else {
      var envaseID = $("#" + txtInput).val();
      var envaseH = $("#txtEnvasesV").val();
      if (envaseH.length > 0) {
        valorE = BuscarBorrar(envaseH, envaseID);
      } else {
        valorE += "";
      }
      $("#txtEnvasesV").val(valorE);
    }
  }
  //-------------------Ancho-------------------------------------
  //console.log(id);
  if (id == "txtAncho") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      var anchoID = $("#" + txtInput).val();
      var anchoH = $("#txtAnchosV").val();
      if (anchoH.length > 0) {
        valorAH += anchoH + "," + anchoID;
      } else {
        valorAH += anchoID;
      }
      $("#txtAnchosV").val(valorAH);
    } else {
      var anchoID = $("#" + txtInput).val();
      var anchoH = $("#txtAnchosV").val();
      if (anchoH.length > 0) {
        valorAH = BuscarBorrar(anchoH, anchoID);
      } else {
        valorAH += "";
      }
      $("#txtAnchosV").val(valorAH);
    }
  }
  //-----------------------CB---------------------------------
  if (id == "txtCenter") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      var cbID = $("#" + txtInput).val();
      var cbH = $("#txtCBV").val();
      if (cbH.length > 0) {
        valorCBH += cbH + "," + cbID;
      } else {
        valorCBH += cbID;
      }
      $("#txtCBV").val(valorCBH);
    } else {
      var cbID = $("#" + txtInput).val();
      var cbH = $("#txtCBV").val();
      if (cbH.length > 0) {
        valorCBH = BuscarBorrar(cbH, cbID);
      } else {
        valorCBH += "";
      }
      $("#txtCBV").val(valorCBH);
    }
  }
  //------------------------ET--------------------------------
  if (id == "txtOffset") {
    chk = $("#" + txtInput).is(":checked");
    if (chk == true) {
      var etID = $("#" + txtInput).val();
      var etH = $("#txtETV").val();
      if (etH.length > 0) {
        valorETH += etH + "," + etID;
      } else {
        valorETH += etID;
      }
      $("#txtETV").val(valorETH);
    } else {
      var etID = $("#" + txtInput).val();
      var etH = $("#txtETV").val();
      if (etH.length > 0) {
        valorETH = BuscarBorrar(etH, etID);
      } else {
        valorETH += "";
      }
      $("#txtETV").val(valorETH);
    }
  }

}
//-----------------------------------------------------------------------------------
function BuscarBorrar(cadena, value) {
  var arreglo = cadena.split(",");
  $.each(arreglo, function (index, result) {
    if (arreglo[index] == value) {
      arreglo.splice(index, 1);
    }
  });
  return arreglo.toString();
}
//------------------------------Filtrado Post Busqueda para los resultados-----------
function Filtrar(IDCategoria, seccion) {
  let pag = 1;
  idCat = document.getElementById("txtCategoria").value;
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.close();
  let r = $("#rematetxt").is(":checked");
  let i = $("#incompletotxt").is(":checked");
  ////console.log("Valor de i: " + i);
  // //console.log(ArrayData);
  let clase = document.getElementById("txtClasesV").value;
  let marca = document.getElementById("txtMarcasV").value;
  let tipo = document.getElementById("txtTiposV").value;
  let subtipo = document.getElementById("txtSubTiposV").value;
  let subtipo2 = document.getElementById("txtSubTipos2V").value;
  let envase = document.getElementById("txtEnvasesV").value;
  let filtradoPor = new Array();

  if (clase.length > 0) {
    clasesArray = clase.split(",");
  } else {
    clasesArray = "";
  }
  if (marca.length > 0) {
    marcasArray = marca.split(",");
  } else {
    marcasArray = "";
  }
  if (tipo.length > 0) {
    tiposArray = tipo.split(",");
  } else {
    tiposArray = "";
  }
  if (subtipo.length > 0) {
    subtiposArray = subtipo.split(",");
  } else {
    subtiposArray = "";
  }
  if (subtipo2.length > 0) {
    subtipos2Array = subtipo2.split(",");
  } else {
    subtipos2Array = "";
  }
  if (envase.length > 0) {
    envasesArray = envase.split(",");
  } else {
    envasesArray = "";
  }

  filtradoPor = {
    CLASE: clasesArray,
    MARCA: marcasArray,
    TIPO: tiposArray,
    SUBTIPO: subtiposArray,
    SUBTIPO2: subtipos2Array,
    ENVASE: envasesArray,
  };

  if (filtradoPor.CLASE === "") {
    delete filtradoPor.CLASE;
  }
  if (filtradoPor.MARCA === "") {
    delete filtradoPor.MARCA;
  }
  if (filtradoPor.TIPO === "") {
    delete filtradoPor.TIPO;
  }
  if (filtradoPor.SUBTIPO === "") {
    delete filtradoPor.SUBTIPO;
  }
  if (filtradoPor.SUBTIPO2 === "") {
    delete filtradoPor.SUBTIPO2;
  }
  if (filtradoPor.ENVASE === "") {
    delete filtradoPor.ENVASE;
  }

  ArrayDataFiltrado = getFiltrarResultado(filtradoPor);

  if (
    ArrayDataFiltrado.length > 0 &&
    filtradoPor.INCOMPLETO == "I" &&
    clearFiltros == false
  ) {
    viewImcompletos = true;
  }
  //console.log(ArrayDataFiltrado);
  let totales = ArrayDataFiltrado.length;
  nPag = Math.ceil(totales / xPag);
  if (totales > 0) {
    //console.log(IDCategoria + "-" + seccion);
    if (IDCategoria == "1030" && seccion != 0) {
      if (seccion == 1) {
        mostrarResultadosFiltrosReferencia(nPag, pag, idCat);
        //console.log("Esta pasando por aqui");
      }
      if (seccion == 2) {
        mostrarResultadosFiltrosIntercambio(nPag, pag, idCat);
      }
    } else {
      mostrarResultadosBusqueda(nPag, 1, IDCategoria, "");
    }
  } else {
    Swal.fire({
      icon: "info",
      title: "Filtrar busqueda",
      text: "No hay artículos para el filtro selecccionado.",
      confirmButtonColor: "#000",
    });
    return false;
  } 
}
//-----------------------------------------------------------------------------------
function getFiltrarResultado(filtradoPor) {
  //console.log("Estas pasando por getFiltrarResultado");
  //console.log(ArrayData);
  //console.log(filtradoPor);
  if (
    filtradoPor.INCOMPLETO &&
    filtradoPor.INCOMPLETO.length > 0 &&
    filtradoPor.INCOMPLETO[0] === "I"
  ) {
    //ESTABA AQUI
    resultados = ArrayData.filter(
      (item) => item.ID_CLASE === "1055" && parseFloat(item.CANT_DISPONIBLE) < 4
    );
  } else {
    resultados = ArrayData.filter(function (o) {
      return Object.keys(filtradoPor).every(function (k) {
        return filtradoPor[k].some(function (f) {
          return o[k] === f;
        });
      });
    });
  }

  return resultados;
}
//------------------------Limpiar Filtros Pre Busqueda-------------------------------
function LimpiarFiltroPre(opt) {
  if (opt == 1) {
    //Vaciar valor seleccionado
    $("#txtClasesV").val("");
    $("#txtMarcasV").val("");
    $("#txtTiposV").val("");
    $("#txtSubTiposV").val("");
    $("#txtSubTipos2V").val("");
    $("#txtEnvasesV").val("");
    //Vaciar contenedor de categorias
    $("#filtromarca").empty();
    $("#filtrotipo").empty();
    $("#filtrosubtipo").empty();
    $("#filtrosubtipo2").empty();
    $("#filtroenvase").empty();
    //Quitar check en categorias
    $("input[type='checkbox']").prop("checked", false);
    //Vaciar localStorage
    localStorage.removeItem('claseSelect');
    localStorage.removeItem('marcaSelect');
    localStorage.removeItem('tipoSelect');
    localStorage.removeItem('subtipoSelect');
    localStorage.removeItem('subtipo2Select');
    localStorage.removeItem('envaseSelect');
    clearFiltros = true;
    cerrarModal();
  }
  else {
    Swal.fire({
      title: "¿Deseas limpiar toda la información?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        //Vaciar valor seleccionado
        $("#txtClasesV").val("");
        $("#txtMarcasV").val("");
        $("#txtTiposV").val("");
        $("#txtSubTiposV").val("");
        $("#txtSubTipos2V").val("");
        $("#txtEnvasesV").val("");
        //Vaciar contenedor de categorias
        $("#filtromarca").empty();
        $("#filtrotipo").empty();
        $("#filtrosubtipo").empty();
        $("#filtrosubtipo2").empty();
        $("#filtroenvase").empty();
        //Quitar check en categorias
        $("input[type='checkbox']").prop("checked", false);
        //Vaciar localStorage
        localStorage.removeItem('claseSelect');
        localStorage.removeItem('marcaSelect');
        localStorage.removeItem('tipoSelect');
        localStorage.removeItem('subtipoSelect');
        localStorage.removeItem('subtipo2Select');
        localStorage.removeItem('envaseSelect');
        clearFiltros = true;
      }
    });
  }
}
//------------------------Limpiar Filtros Post Busqueda------------------------------
function LimpiarFiltro(IDCategoria) {
  Swal.fire({
    title: "¿Deseas limpiar toda la información?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#6e7881",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      $("#txtClasesV").val("");
      $("#txtMarcasV").val("");
      $("#txtTiposV").val("");
      $("#txtSubTiposV").val("");
      $("#txtSubTipos2V").val("");
      $("#txtEnvasesV").val("");

      $("input[type='checkbox']").prop("checked", false);
      clearFiltros = true;
      Filtrar(IDCategoria);
    }
  });
}
//------------------Mostrar el loading antes de enviar la solicitud-------------------
function mostrarLoading() {
  $('.loading').show();
  document.querySelector('.loading').style.display = 'block';
}

//---------------FUNCION PAGINADOR PARA BUSQUEDA PEDIDOS/COTIZACIONES-----------------
function paginadorPedidos(nPag, pag, IDCategoria) {
  //console.log("desde: " + (pag - 1) * xPag + " hasta: " + pag * xPag);
  //console.log("nPag:" + nPag + "- pag:" + pag);
  //MUESTRA LA CANTIDAD DE PAGINA
  let selected = "";
  sel = `<select class="browser-default" onchange="mostrarResultadosBusquedaPedidos(${nPag}, this.value,${IDCategoria})">
        <option value="" disabled>Páginas</option>`;
  for (var i = 0; i < nPag; i++) {
    if (i + 1 == pag) {
      selected = "selected";
    } else {
      selected = "";
    }
    if (nPag != 1) {
      sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
        }</option>`;
    }
  }
  sel += `</select>`;

  if (pag <= 1) btnAtras = `<a style="color:#aba7a7;">❮ Anterior</a>`;
  else
    btnAtras = `<a onclick="mostrarResultadosBusquedaPedidos(${nPag} , ${parseInt(pag) - 1
      }, ${IDCategoria});">❮ Anterior</a>`;

  if (pag >= nPag) btnSig = `<a style="color: #aba7a7;"> Siguiente ❯ </a>`;
  else
    btnSig = `<a onclick="mostrarResultadosBusquedaPedidos(${nPag},${parseInt(pag) + 1
      },${IDCategoria})">Siguiente ❯</a>`;

  return `
          <div id="paginador">
        <div class="row">
          <div class="col s4"></div>
          <div class="col s4" style="text-align: center">${pag}/${nPag}</div>
          <div class="col s4"></div>
        </div>
        <div class="row" style="width:fit-content !important;">
            <div class="col s4" id="btnAtras" style="width:fit-content !important;">
              ${btnAtras}
            </div>
          <div class="col s4">
            ${sel}
          </div>
          <div class="col s4" id="btnSig" style="width:fit-content !important;">
            ${btnSig}
          </div>
        </div>
      </div><br>`;
}
//-----------------------------------------------------------------------------------
//---------------------- cambio de vista      ---------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
function cambiarVistaMosaico(){
   let totales = ArrayDataFiltrado.length;
          nPag = Math.ceil(totales / xPag);       
          mostrarResultadosBusqueda(nPag, 1);
}
//-----------------------------------------------------------------------------------
function cambiarVistaLista() {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  let bodegaCod = bodega[0].BODEGA;
  let totalRegistros = ArrayDataFiltrado.length;
  let pag = 1; // Página inicial
  let desde = (pag - 1) * xPag;
  let hasta = Math.min(pag * xPag, totalRegistros);
  let nPag = Math.ceil(totalRegistros / xPag);
  let htm = "";

  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
          <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
          </div>`;


  htm += `<div class="row" id="totalregistros">          
            <div class="col s6 valign-wrapper">
              <label>
                <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
                <span>Mostrar En Bodega</span>
              </label>
            </div>
            <div class="col s6 valign-wrapper">
              <span>Total de Registros: </span>
              <span>${totalRegistros}</span>
            </div>
          </div>
          <div class="row">
            <div class="col s6">
                <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaMosaico();">
              <i class="material-icons right">apps</i>
              VISTA </a>
            </div>
            <div class="col s6">
              <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
              <i class="material-icons right">filter_list</i>
              FILTRAR </a>
            </div>
          </div>`;

  htm += `<table class="striped centered" style="margin-top:5%;">
  <thead style="background:#28a745;color:white;">
    <tr>
      <th style="width:30%;">CODIGO</th>
      <th style="width:30%;">CODIGO DE BARRAS</th>
      <th style="width:10%;">EN ${bodegaCod}</th>
      <th style="width:30%;">ACTION</th>
    </tr>
  </thead>
  <tbody>`;

  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      htm += `<tr>`;
      //cambiar mostrar existencias
      htm += `<td class="sticky-column text-align:center"><h5 style="font-size:12px; text-align:left; color:orangered;">${ArrayDataFiltrado[i].ARTICULO}</h5><h6 style="font-size: 10px; text-align: left;">${ArrayDataFiltrado[i].DESCRIPCION}</td>
              <td>${ArrayDataFiltrado[i].CODIGO_BARRAS_INVT ? ArrayDataFiltrado[i].CODIGO_BARRAS_INVT : ''}</td>
              <td>${Math.floor(ArrayDataFiltrado[i].TOTAL_CANTIDAD_BODEGA)}</td>
              <td>
                <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(ArrayDataFiltrado[i].ARTICULO)}', '${ArrayDataFiltrado[i].DESCRIPCION}')">visibility</i>              
                <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" onclick="mostrarExistencias('${encodeURIComponent(ArrayDataFiltrado[i].ARTICULO)}')" tabindex="1">                
               <img src="./img/icon/bar-code.svg"  width="22" height="22"  onclick="impCodBar('${ArrayDataFiltrado[i].ARTICULO}','${ArrayDataFiltrado[i].DESCRIPCION}')" tabindex="1">
               <img src="./img/icon/information.svg"  width="22" height="22"  onclick="information('${ArrayDataFiltrado[i].ARTICULO}','${ArrayDataFiltrado[i].DESCRIPCION}')" tabindex="1">
              </td>`;
      htm += `</tr>`;
    }
  }

  htm += `</tbody>
          </table>`;

  htm += `<div id="resultadoPaginador">`;
  htm += paginadorTablas(nPag, pag, 'mostrarResultadosVistaLista');
  htm += `</div>`;

  htm += "</div>";

  document.getElementById("resultadoBusqueda").innerHTML = htm;
  $("html, body").animate(
    {
      scrollTop: $("#resultadoBusqueda").offset().top - 140,
    },
    1000
  );
}
//-----------------------------------------------------------------------------------
function mostrarResultadosVistaLista(nPag, pag) {
  let htm = "";
  let desde = (pag - 1) * xPag;
  let hasta = pag * xPag;
 
  resultadosVistaLista(desde, hasta);
  htm += paginadorTablas(nPag, pag, 'mostrarResultadosVistaLista');
  document.getElementById("resultadoPaginador").innerHTML = htm;
}
//-----------------------------------------------------------------------------------
function resultadosVistaLista(desde, hasta) {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  let bodegaCod = bodega[0].BODEGA;
  let totalRegistros = 0, htm = "";
  totalRegistros = ArrayDataFiltrado.length;
  // let nPag = Math.ceil(totalRegistros / xPag);

  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
          <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
          </div>`;
         
  
          htm += `<div class="row" id="totalregistros">           
             <div class="col s6 valign-wrapper">
              <label>
                <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
                <span>Mostrar En Bodega</span>
              </label>
            </div>
             <div class="col s6 valign-wrapper">
              <span>Total de Registros: </span>
              <span>${totalRegistros}</span>
            </div>
          </div>
          <div class="row">
            <div class="col s6">
                <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaMosaico(${desde},${hasta});">
              <i class="material-icons right">apps</i>
              VISTA </a>
            </div>
            <div class="col s6">
              <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
              <i class="material-icons right">filter_list</i>
              FILTRAR </a>
            </div>
          </div>`;

  htm += `<table class="striped centered" style="margin-top:5%;">
  <thead style="background:#28a745;color:white;">
    <tr>
      <th style="width:30%;">CODIGO</th>
      <th style="width:30%;">CODIGO DE BARRAS</th>
      <th style="width:10%;">EN ${bodegaCod}</th>
      <th style="width:30%;">ACTION</th>
    </tr>
  </thead>
  <tbody>`;

  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      htm += `<tr>`;
      htm += `<td class="sticky-column text-align:center"><h5 style="font-size:12px; text-align:left; color:orangered;">${ArrayDataFiltrado[i].ARTICULO}</h5><h6 style="font-size: 10px; text-align: left;">${ArrayDataFiltrado[i].DESCRIPCION}</td>
              <td>${ArrayDataFiltrado[i].CODIGO_BARRAS_INVT ? ArrayDataFiltrado[i].CODIGO_BARRAS_INVT : ''}</td>
              <td>${Math.floor(ArrayDataFiltrado[i].TOTAL_CANTIDAD_BODEGA)}</td>
              <td>
                <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(ArrayDataFiltrado[i].ARTICULO)}', '${ArrayDataFiltrado[i].DESCRIPCION}')">visibility</i>              
                <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')" tabindex="1">
                <img src="./img/icon/bar-code.svg"  width="22" height="22"  onclick="impCodBar('${ArrayDataFiltrado[i].ARTICULO}','${ArrayDataFiltrado[i].DESCRIPCION}')" tabindex="1">
                <img src="./img/icon/information.svg"  width="22" height="22"  onclick="information('${ArrayDataFiltrado[i].ARTICULO}','${ArrayDataFiltrado[i].DESCRIPCION}')" tabindex="1">
              </td>`; // Puedes poner aquí el botón de acción que desees
      htm += `</tr>`;
    }
  }

  htm += `</tbody>
          </table>`;

  htm += `<div id="resultadoPaginador">`;
  htm += `</div>`;
  htm += "</div>";

  document.getElementById("resultadoBusqueda").innerHTML = htm;
  $("html, body").animate(
    {
      scrollTop: $("#resultadoBusqueda").offset().top - 140,
    },
    1000
  );
}
//------------------------------------------------------------------------------------
function paginadorTablas(nPag, pag, dynamicFunction) {
  // Generar el select con las páginas
  let selected = "";
  let sel = `<select class="browser-default paginador-select" onchange="${dynamicFunction}(${nPag}, this.value)">
              <option value="" disabled>Páginas</option>`;

          for (var i = 0; i < nPag; i++) {
              if (i + 1 == pag) {
                selected = "selected";
              } else {
                selected = "";
              }
              if (nPag != 1) {
                sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
                  }</option>`;
              }
            }
              // for (let i = 0; i < nPag; i++) {
  //   selected = i + 1 === pag ? "selected" : "";
  //   if (nPag !== 1) {
  //     sel += `<option value="${i + 1}" ${selected}>${i + 1}</option>`;
  //   }
  // }
  sel += `</select>`;

  // Botones de navegación
  const btnAtras = pag <= 1
    ? `<a class="paginador-btn disabled">❮ Anterior</a>`
    : `<a class="paginador-btn" onclick="${dynamicFunction}(${nPag}, ${pag - 1})">❮ Anterior</a>`;

  const btnSig = pag >= nPag
    ? `<a class="paginador-btn disabled">Siguiente ❯</a>`
    : `<a class="paginador-btn" onclick="${dynamicFunction}(${nPag}, ${pag + 1})">Siguiente ❯</a>`;

  // Retornar el HTML con clases en lugar de estilos inline
  return `
    <div id="paginador" class="paginador-container">
      <div class="row paginador-info">
        <div class="col s12 center-align">${pag}/${nPag}</div>
      </div>
      <div class="row paginador-controls">
        <div class="col s4 paginador-btn-container">${btnAtras}</div>
        <div class="col s4 paginador-select-container">${sel}</div>
        <div class="col s4 paginador-btn-container">${btnSig}</div>
      </div>
    </div>
  `;
}

//-----------------------------------------------------------------------------------
//---------------------- Otras funcionalidades     ----------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
function mostrarImagen(codigo, descripcion) {
  let code;
  try {
    code = decodeURIComponent(codigo); // Decodificar para el título
  } catch (e) {
    console.error("Error decodificando código:", e);
    code = codigo; // Usar codificado como respaldo
  }
  //console.log(env.API_IMAGE+"/"+code.replace("/", "-"));
  Swal.fire({
    confirmButtonColor: "#28a745",
    html: `
      <div>
        <h3>${code}</h3>
        <img src="${env.API_IMAGE}/${code.replace("/", "-")}" alt="Imagen" width="200" height="200">
        <p>${descripcion}</p>
      </div>
    `,
    customClass: {
      title: 'img-tamaño-articulo'
    }
  });
}
//-----------------------------------------------------------------------------------
function mostrarExistencias(p_Articulo) {
  let code;
  try {
    code = decodeURIComponent(p_Articulo); // Decodificar para el título y API
  } catch (e) {
    console.error("Error decodificando código:", e);
    code = p_Articulo; // Usar codificado como respaldo
  }

  // Mostrar el loading antes de abrir la ventana emergente
  Swal.fire({
    title: "Cargando Registros....",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: function () {
      Swal.showLoading();
    }
  });

  // Ruta del API
  const apiUrl = env.API_URL + "wmsexistenciaarticulosporbodega/1";

  // Parámetros de la solicitud
  const params = `?p_Articulo=${encodeURIComponent(code)}`;

  fetch(apiUrl + params, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      return response.json();
    })
    .then(data => {
          console.log('Existencias')
          console.log(data.reporte);
          console.log('cant registros:', data.reporte.length)
          if(data.reporte.length > 0){
                var existenciaArticulos = data.reporte; // Accede a la propiedad 'reporte'
                  var tablaHtml = '<table style="border-collapse: collapse; width: 100%;">' +
                    '<thead>' +
                    '<tr style="border-bottom: 1px solid #ddd;">' +
                    '<th style="text-align: left; padding: 8px;"> Bodega </th>' +
                    '<th style="text-align: center; padding: 8px;"> Cantidad </th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';

                  existenciaArticulos.forEach(articulo => {
                    tablaHtml += '<tr style="border-bottom: 1px solid #ddd;">' +
                      '<td style="text-align: left; padding: 8px;">' + articulo.NOMBRE + '</td>' +
                      '<td style="text-align: center; padding: 8px;">' + parseFloat(articulo.CANTIDAD).toFixed(2) + '</td>' +
                      '</tr>';
                  });

                  tablaHtml += '</tbody>' + '</table>';

                  Swal.fire({
                    title: "Artículo: " + code, // Usar decodificado
                    html: tablaHtml,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#55b251"
                  });

          }else{
            Swal.fire({
                title: "Artículo: " + code, // Usar decodificado
                text:"Sin existencias",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#55b251"
              });
          }     
     
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al obtener los registros de existencia",
        icon: "error",
        confirmButtonColor: "#55b251"
      });
    });
}
//-----------------------------------------------------------------------------------
function sucursalbremen(tienda, id_tienda) {
  ////console.log("Tienda: " + tienda + " " + "Id: " + id_tienda);
  document.getElementById("bodega-sucursal").innerHTML = tienda;
  document.getElementById("bodega").value = id_tienda;
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  $("#bodega_sucursales").modal("close");
  //JSON
  let newbodega = [
    {
      BODEGA: id_tienda,
      NOMBRE: tienda,
      PERFIL: bodega[0].PERFIL,
    },
  ];
  sessionStorage.setItem("bodega", JSON.stringify(newbodega));
  
  const bodegaChange = document.getElementById("bodega");

  if (bodegaChange) {
    // Verificar si fechasDeInventario está definida antes de llamarla
    if (typeof fechasDeInventario === "function") {
      bodegaChange.addEventListener("change", function () {
        fechasDeInventario(); // Llamar solo si existe
      });
      fechasDeInventario(); // Llamada inicial solo si existe
    }  
  }  
}
//-----------------------------------------------------------------------------------
function impCodBar(p_Articulo,p_Descripcion) {
 localStorage.setItem('impCodeBar', p_Articulo);
 localStorage.setItem('descripcionImpCode',p_Descripcion);
 //window.location.href = 'barcodeGen.html';
mostrarModalGeneradorCodigoBarras();
}
//-----------------------------------------------------------------------------------
function mostrarModalGeneradorCodigoBarras() {
  const esPantallaPequena = window.matchMedia("(max-width: 600px)").matches;
  
  Swal.fire({
    title: 'Generador de Códigos de Barras',
    width: esPantallaPequena ? '100%' : '60%',     padding: '2em',
    showConfirmButton: false,
    showCloseButton: true,
    html: `
      <style>
        .container {
          text-align: center;
          background: white;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        label {
          margin: 10px 0 5px 0;
          font-weight: bold;
        }
        input, select {
          margin-bottom: 15px;
          padding: 10px;
          width: 100%;
          max-width: 300px;
          text-align: center;
        }
        #barcode {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        #printBarcode {
          width: 35%;
        }
          /* Small only */
        @media screen and (max-width: 39.9375em) {
        
         #printBarcode {
          width: 100%!important;
        }
        }   
      </style>            
      <div class="container">
        <label for="symbology">Elija la simbología de código de barras:</label>
        <select id="symbology">
          <option value="CODE128">Código 128</option>
          <option value="QR">Código QR</option>
        </select>

        <label for="data" hidden>Ingrese el código del artículo:</label>
        <input type="text" id="data" placeholder="Ingrese aquí">

        <label for="size">Seleccione el tamaño:</label>
        <select id="size">
          <option value="0.75" selected>75%</option>
          <option value="1">100%</option>
          <option value="2">200%</option>
        </select>

        <div id="barcode"></div>
        <button id="printBarcode" class="btn waves-effect waves-light">
          <i class="material-icons left">print</i>Imprimir Código
        </button>
      </div>
    `,

    didOpen: () => {
  // Cargar script QRCode dinámicamente
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  script.onload = () => {
    inicializarGenerador(); // solo inicializa después que el script esté listo
  };
  document.body.appendChild(script);
}
  });
}
//-----------------------------------------------------------------------------------
function inicializarGenerador() {
  const codigo = localStorage.getItem('impCodeBar');
  //const descripcion = localStorage.getItem('descripcionImpCode');

  const inputData = document.getElementById('data');
  const descripcionElement = document.createElement('p');
  descripcionElement.style.marginTop = '10px';
  descripcionElement.style.fontSize = '16px';
  descripcionElement.style.fontFamily = 'Arial, sans-serif';

  if (codigo && inputData) {
    inputData.value = codigo;
    generateBarcode();
  }

  document.getElementById('symbology').addEventListener('change', generateBarcode);
  document.getElementById('data').addEventListener('input', generateBarcode);
  document.getElementById('size').addEventListener('change', generateBarcode);

  document.getElementById('printBarcode').addEventListener('click', imprimeCodigo);
  M.FormSelect.init(document.querySelectorAll('select'));

}
//-----------------------------------------------------------------------------------
function generateBarcode() {
    const symbology = document.getElementById('symbology').value;
    const data = document.getElementById('data').value;
    const size = parseFloat(document.getElementById('size').value);
    const descripcion = localStorage.getItem('descripcionImpCode'); // Obtener descripción directamente

    const barcodeContainer = document.getElementById('barcode');
    barcodeContainer.innerHTML = '';

    if (data.trim() === '') {
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';

    if (symbology === 'QR') {
        generateQRCode(data, size, wrapper);
    } else if (symbology === 'CODE128') {
        generate1DBarcode(symbology, data, size, wrapper);
    }

    // Agregar la descripción debajo del código
    if (descripcion) {
        const descElement = document.createElement('p');
        descElement.textContent = descripcion;
        descElement.style.marginTop = '10px';
        descElement.style.fontSize = '16px';
        descElement.style.fontFamily = 'Arial, sans-serif';
        wrapper.appendChild(descElement);
    }

    barcodeContainer.appendChild(wrapper);
}
//-----------------------------------------------------------------------------------
function generate1DBarcode(format, data, size, container) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data, {
        format: format,
        width: 2 * size,
        height: 100 * size,
        displayValue: true
    });
    container.appendChild(canvas);
}
//-----------------------------------------------------------------------------------
function generateQRCode(data, size, container) {
    const qrContainer = document.createElement('div');
    new QRCode(qrContainer, {
        text: data,
        width: 150 * size,
        height: 150 * size
    });
    container.appendChild(qrContainer);
}
//-----------------------------------------------------------------------------------
function imprimeCodigo() {
    const data = document.getElementById('data').value;
    const symbology = document.getElementById('symbology').value;
    const size = parseFloat(document.getElementById('size').value);
    const descripcion = localStorage.getItem('descripcionImpCode');

    if (!data.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'Por favor, ingrese un valor para generar el código de barras antes de imprimir.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#55b251'
        });
        return;
    }

    // Crear una nueva ventana para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Código de Barras</title>
            <style>
                body { 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    margin: 0; 
                    font-family: Arial, sans-serif; 
                }
                canvas, div { 
                    margin: 0 auto; 
                }
                p {
                    margin-top: 10px;
                    font-size: 10px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div id="printBarcode"></div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            <script>
                function generateBarcodeForPrint() {
                    const data = "${data}";
                    const size = ${size};
                    const symbology = "${symbology}";
                    const descripcion = "${descripcion || ''}";
                    const printContainer = document.getElementById('printBarcode');
                    const wrapper = document.createElement('div');
                    wrapper.style.textAlign = 'center';
                    
                    if (symbology === 'QR') {
                        const qrContainer = document.createElement('div');
                        new QRCode(qrContainer, {
                            text: data,
                            width: 150 * size,
                            height: 150 * size
                        });
                        wrapper.appendChild(qrContainer);
                    } else if (symbology === 'CODE128') {
                        const canvas = document.createElement('canvas');
                        JsBarcode(canvas, data, {
                            format: symbology,
                            width: 2 * size,
                            height: 100 * size,
                            displayValue: true
                        });
                        wrapper.appendChild(canvas);
                    }

                    if (descripcion) {
                        const descElement = document.createElement('p');
                        descElement.textContent = descripcion;
                        wrapper.appendChild(descElement);
                    }

                    printContainer.appendChild(wrapper);
                }
                generateBarcodeForPrint();
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();

    // Mostrar notificación de impresión
    Swal.fire({
        icon: 'info',
        title: 'Imprimiendo',
        text: 'Imprimiendo código...',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#55b251'
    });
}
//-----------------------------------------------------------------------------------
function information(codeArticulo,descripcion){

let pUsuario = localStorage.getItem('username');
const params =
    "?pUsuario=" +
    pUsuario +
    "&pCodigo=" +
    codeArticulo;
  
  // Realizar la petición para obtener el detalle de los traslados
  fetch(env.API_URL + "detallearticulo" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.resultado.length !== 0) {
          //console.log("Detalle del traslado:", result.resultado[0].NOTAS);
          Swal.fire({
                title: "Artículo: " + codeArticulo,
                html: `
                  <div style="text-align: left;">Descripción:
                    ${descripcion}<br><br>
                    El color <span style="color:red; font-weight:bold;">rojo</span> indica existencias por debajo del punto de reorden, se recomienda hacer solicitud de este artículo o referencia.<br><br>
                    El color <span style="color:green; font-weight:bold;">verde</span> indica que el punto de reorden es estable.
                    <br><br>
                    <h5>DETALLE</h5>
                    <p style="text-align: justify;">${result.resultado[0].NOTAS}</p>
                  </div>
                `,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#55b251"
              });
        }        
      }
    });
}



// ////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////MOSTRAR RESULTADOS EN BODEGA ////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////
// //-----------------------------------------------------------------------------------
var articulosConExistencia = new Array();
// //-----------------------------Filtros sobre el resultado de la búsqueda--------------
// // Evento de cambio del checkbox
function toggleMostrarEnBodega() {
    const check = document.getElementById("miCheckbox");
    const isChecked = check.checked;

    // Guardar el estado en localStorage
    localStorage.setItem("mostrarEnBodega", isChecked ? "1" : "0");

    if (isChecked) {
        // Filtrar artículos con existencia en bodega > 0
    articulosConExistencia = ArrayData2.filter(item =>parseFloat(item.TOTAL_CANTIDAD_BODEGA) > 0);
    let nPag = Math.ceil(articulosConExistencia.length / xPag);  
    let pag = 1;

        
        mostrarResultadosBusquedaEnBodega(nPag, pag);
        ocultarLoader();     
        //FiltrarModalEnBodega();
        
    } else {
          let pag = 1;
          let totales = ArrayDataFiltrado.length;
          let nPag = Math.ceil(totales / xPag);
          LimpiarFiltroPre(1);
          mostrarResultadosBusqueda(nPag, pag);        
          ocultarLoader();        
         // FiltrarModal();       
    }
}
// //-----------------------------------------------------------------------------------
function mostrarResultadosBusquedaEnBodega(nPag, pag){
  let htm = "";
    let desde = (pag - 1) * xPag;
    let data = articulosConExistencia;
    let hasta = Math.min(pag * xPag, data.length);

    if (desde >= data.length) {
        desde = 0;
        hasta = Math.min(xPag, data.length);
        pag = 1;
    }

    htm = mostrarResultadosEnBodega(desde, hasta, data);
    htm += paginadorEnBodega(nPag, pag);

    document.getElementById("resultadoBusqueda").innerHTML = htm;
    $("html, body").animate(
        { scrollTop: $("#resultadoBusqueda").offset().top - 140 },
        1000
    );
    $("select").formSelect();
    $(".dropdown-trigger").dropdown();

     const estado = localStorage.getItem("mostrarEnBodega");
        if (estado === "1") {
            document.getElementById("miCheckbox").checked = true;
        } else {
            document.getElementById("miCheckbox").checked = false;
        }
}
// //-----------------------------------------------------------------------------------
function mostrarResultadosEnBodega(desde, hasta, data) {
    let htm = "";
    let bodegaLabel = "";

    htm += '<div id="lista-articulo">';
    htm += `<div class="col s12">
              <h2 style="text-align:center; text-transform: uppercase;">Resultados de la Búsqueda</h2>
            </div>           
                         
            `;

            
    htm += `<div class="row" id="totalregistros">              
              <div class="col s6 valign-wrapper">
              <label>
                <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
                <span>Mostrar En Bodega</span>
              </label>
            </div>   
            <div class="col s6 valign-wrapper">
                <span>Total de Registros: </span>
                <span>${data.length}</span>
              </div>
            </div>            
            <div class="row" id="vistabusqueda">
              <div class="col s6">
                <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaListaEnBodega();">
                  <i class="material-icons right">list</i>
                  VISTA
                </a>
              </div>
              <div class="col s6">
                <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModalEnBodega();">
                  <i class="material-icons right">filter_list</i>
                  FILTRAR
                </a>
              </div>
            </div>`;

    htm += '<div class="grid-container">';

    for (let i = desde; i < hasta; i++) {
        if (data[i]) {
            let DArticulo = data[i].ARTICULO.replace("/", "-");
            let cantBodega = parseFloat(data[i].TOTAL_CANTIDAD_BODEGA) || 0;

            bodegaLabel = `<span class="mi-tienda">En Bodega</span>`;

            let colorReorden = "";
            if (data[i].color === "R") colorReorden = "red accent-4";
            else if (data[i].color === "A") colorReorden = "light-blue darken-1";
            else if (data[i].color === "N") colorReorden = "deep-orange accent-3";
            else if (data[i].color === "V") colorReorden = "green darken-1";

            htm += `
            <div class="container-img">
              <div id="envoltorio">
                <a href="#">                
                  <img src="${env.API_IMAGE}/${DArticulo}" width="100%" alt="${data[i].ARTICULO}">
                  ${bodegaLabel}
                </a>
                <div class="flotante-acciones ${colorReorden}">
                  <div class="link-flotante-acciones-forklift">
                    <a onclick="mostrarExistencias('${data[i].ARTICULO}')">
                      <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22">
                    </a>             
                  </div>
                  <div class="link-flotante-acciones-bar-code">
                    <a onclick="impCodBar('${data[i].ARTICULO}','${data[i].DESCRIPCION}')">
                      <img src="./img/icon/bar-code.svg" width="22" height="22">
                    </a>             
                  </div>
                  <div class="link-flotante-acciones-information">
                    <a onclick="information('${data[i].ARTICULO}','${data[i].DESCRIPCION}')">
                      <img src="./img/icon/information.svg" width="22" height="22">
                    </a>             
                  </div>
                </div>          
              </div>
              <h3 class="articulo-titulo">Nombre: ${data[i].ARTICULO}</h3>
              <h4>Descripción: ${data[i].DESCRIPCION}</h4>
              <h4>Cantidad: ${cantBodega.toFixed(2)}</h4>
            </div>`;
        }
       
    }
      // const estado = localStorage.getItem("mostrarEnBodega");
      //   if (estado === "1") {
      //       document.getElementById("miCheckbox").checked = true;
      //   } else {
      //       document.getElementById("miCheckbox").checked = false;
      //   }
    htm += "</div></div>";
  
    return htm;

 
}
//-----------------------------------------------------------------------------------
function paginadorEnBodega(nPag, pag) {
  //MUESTRA LA CANTIDAD DE PAGINA
  let selected = "";
  sel = `<select class="browser-default" onchange="mostrarResultadosBusquedaEnBodega(${nPag}, this.value)">
        <option value="" disabled>Páginas</option>`;
  for (var i = 0; i < nPag; i++) {
    if (i + 1 == pag) {
      selected = "selected";
    } else {
      selected = "";
    }
    if (nPag != 1) {
      sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
        }</option>`;
    }
  }
  sel += `</select>`;

  if (pag <= 1) btnAtras = `<a style="color: #aba7a7;">❮ Anterior</a>`;
  else
    btnAtras = `<a onclick="mostrarResultadosBusquedaEnBodega(${nPag} , ${parseInt(pag) - 1
      });">❮ Anterior</a>`;

  if (pag >= nPag) btnSig = `<a style="color: #aba7a7;"> Siguiente ❯ </a>`;
  else
    btnSig = `<a onclick="mostrarResultadosBusquedaEnBodega(${nPag},${parseInt(pag) + 1
      })">Siguiente ❯</a>`;

  return `<div id="paginador">
        <div class="row">
          <div class="col s4"></div>
          <div class="col s4" style="text-align: center">${pag}/${nPag}</div>
          <div class="col s4"></div>
        </div>
        <div class="row" style="width:fit-content !important;">
            <div class="col s4" id="btnAtras" style="width:fit-content !important;">
              ${btnAtras}
            </div>
          <div class="col s4">
            ${sel}
          </div>
          <div class="col s4" id="btnSig" style="width:fit-content !important;">
            ${btnSig}
          </div>
        </div>
      </div><br>`;
}
// ////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////MOSTRAR RESULTADOS Tabla lista  EN BODEGA ////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
function cambiarVistaMosaicoEnBodega(){
  let totales = articulosConExistencia.length;
          nPag = Math.ceil(totales / xPag);       
          mostrarResultadosBusquedaEnBodega(nPag, 1);   
}

//-----------------------------------------------------------------------------------
function cambiarVistaListaEnBodega() {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  let bodegaCod = bodega[0].BODEGA;

  // Filtrar solo artículos con existencia en bodega
  const articulosConExistencia = ArrayDataFiltrado.filter(item =>
    parseFloat(item.TOTAL_CANTIDAD_BODEGA) > 0
  );

  let totalRegistros = articulosConExistencia.length;
  let pag = 1; // Página inicial
  let desde = (pag - 1) * xPag;
  let hasta = Math.min(pag * xPag, totalRegistros);
  let nPag = Math.ceil(totalRegistros / xPag);
  let htm = "";

  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
          <h2 style="text-align:center; text-transform: uppercase;">Resultados de la Búsqueda</h2>
          </div>`;
          
  htm += `<div class="row" id="totalregistros">           
            <div class="col s6 valign-wrapper">
              <label>
                <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
                <span>Mostrar En Bodega</span>
              </label>
            </div>
            <div class="col s6 valign-wrapper">
              <span>Total de Registros: </span>
              <span>${totalRegistros}</span>
            </div>
          </div>
          <div class="row">
            <div class="col s6">
              <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaMosaicoEnBodega();">
                <i class="material-icons right">apps</i>
                VISTA
              </a>
            </div>
            <div class="col s6">
              <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModalEnBodega();">
                <i class="material-icons right">filter_list</i>
                FILTRAR
              </a>
            </div>
          </div>`;

  htm += `<table class="striped centered" style="margin-top:5%;">
  <thead style="background:#28a745;color:white;">
    <tr>
      <th style="width:30%;">CODIGO</th>
      <th style="width:30%;">CODIGO DE BARRAS</th>
      <th style="width:10%;">EN ${bodegaCod}</th>
      <th style="width:30%;">ACTION</th>
    </tr>
  </thead>
  <tbody id="tablaBodyEnBodega">`;

  for (let i = desde; i < hasta; i++) {
    if (articulosConExistencia[i]) {
      htm += `<tr>
        <td class="sticky-column text-align:center">
          <h5 style="font-size:12px; text-align:left; color:orangered;">${articulosConExistencia[i].ARTICULO}</h5>
          <h6 style="font-size: 10px; text-align: left;">${articulosConExistencia[i].DESCRIPCION}</h6>
        </td>
        <td>${articulosConExistencia[i].CODIGO_BARRAS_INVT || ''}</td>
        <td>${Math.floor(articulosConExistencia[i].TOTAL_CANTIDAD_BODEGA)}</td>
        <td>
          <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(articulosConExistencia[i].ARTICULO)}', '${articulosConExistencia[i].DESCRIPCION}')">visibility</i>
          <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" onclick="mostrarExistencias('${encodeURIComponent(articulosConExistencia[i].ARTICULO)}')" tabindex="1">
          <img src="./img/icon/bar-code.svg" width="22" height="22" onclick="impCodBar('${articulosConExistencia[i].ARTICULO}','${articulosConExistencia[i].DESCRIPCION}')" tabindex="1">
          <img src="./img/icon/information.svg" width="22" height="22" onclick="information('${articulosConExistencia[i].ARTICULO}','${articulosConExistencia[i].DESCRIPCION}')" tabindex="1">
        </td>
      </tr>`;
    }
  }

  htm += `</tbody></table>`;
  htm += `<div id="resultadoPaginador">`;
  htm += paginadorTablasEnBodega(nPag, pag, 'mostrarResultadosVistaListaEnBodega');
  htm += `</div></div>`;

  document.getElementById("resultadoBusqueda").innerHTML = htm;
  $("html, body").animate(
    { scrollTop: $("#resultadoBusqueda").offset().top - 140 },
    1000
  );

  const estado = localStorage.getItem("mostrarEnBodega");
  if (estado === "1") {
    document.getElementById("miCheckbox").checked = true;
  } else {
    document.getElementById("miCheckbox").checked = false;
  }

  // Guardar array filtrado para la paginación
  window.ArticulosBodegaFiltrados = articulosConExistencia;
}

//-----------------------------------------------------------------------------------
function mostrarResultadosVistaListaEnBodega(nPag, pag) {
  let desde = (pag - 1) * xPag;
  const data = window.ArticulosBodegaFiltrados || [];
  let hasta = Math.min(pag * xPag, data.length);

  if (desde >= data.length) {
    desde = 0;
    hasta = Math.min(xPag, data.length);
    pag = 1;
  }

  // Actualizar el cuerpo de la tabla
  resultadosVistaListaEnBodega(desde, hasta);

  // Actualizar la paginación
  const paginadorHtml = paginadorTablasEnBodega(nPag, pag, 'mostrarResultadosVistaListaEnBodega');
  const paginadorElement = document.getElementById("resultadoPaginador");
  if (paginadorElement) {
    paginadorElement.innerHTML = paginadorHtml;
  } else {
    console.error("Elemento 'resultadoPaginador' no encontrado en el DOM");
    // Opcional: Crear el elemento si no existe
    const nuevoPaginador = document.createElement("div");
    nuevoPaginador.id = "resultadoPaginador";
    nuevoPaginador.innerHTML = paginadorHtml;
    document.getElementById("lista-articulo").appendChild(nuevoPaginador);
  }

  $("html, body").animate(
    { scrollTop: $("#resultadoBusqueda").offset().top - 140 },
    1000
  );
}

//-----------------------------------------------------------------------------------
function resultadosVistaListaEnBodega(desde, hasta) {
  const data = window.ArticulosBodegaFiltrados || [];
  let rows = "";

  for (let i = desde; i < hasta; i++) {
    if (data[i]) {
      rows += `<tr>
        <td class="sticky-column text-align:center">
          <h5 style="font-size:12px; text-align:left; color:orangered;">${data[i].ARTICULO}</h5>
          <h6 style="font-size: 10px; text-align: left;">${data[i].DESCRIPCION}</h6>
        </td>
        <td>${data[i].CODIGO_BARRAS_INVT || ''}</td>
        <td>${Math.floor(data[i].TOTAL_CANTIDAD_BODEGA)}</td>
        <td>
          <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(data[i].ARTICULO)}', '${data[i].DESCRIPCION}')">visibility</i>
          <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" onclick="mostrarExistencias('${encodeURIComponent(data[i].ARTICULO)}')" tabindex="1">
          <img src="./img/icon/bar-code.svg" width="22" height="22" onclick="impCodBar('${data[i].ARTICULO}','${data[i].DESCRIPCION}')" tabindex="1">
          <img src="./img/icon/information.svg" width="22" height="22" onclick="information('${data[i].ARTICULO}','${data[i].DESCRIPCION}')" tabindex="1">
        </td>
      </tr>`;
    }
  }

  const tablaBody = document.getElementById("tablaBodyEnBodega");
  if (tablaBody) {
    tablaBody.innerHTML = rows;
  } else {
    console.error("Elemento 'tablaBodyEnBodega' no encontrado en el DOM");
  }
}

//-----------------------------------------------------------------------------------
function paginadorTablasEnBodega(nPag, pag, dynamicFunction) {
  let selected = "";
  let sel = `<select class="browser-default paginador-select" onchange="${dynamicFunction}(${nPag}, this.value)">
              <option value="" disabled>Páginas</option>`;

          for (var i = 0; i < nPag; i++) {
              if (i + 1 == pag) {
                selected = "selected";
              } else {
                selected = "";
              }
              if (nPag != 1) {
                sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
                  }</option>`;
              }
            }
  sel += `</select>`;


  // let sel = `<select class="browser-default paginador-select" onchange="${dynamicFunction}(${nPag}, this.value)">
  //             <option value="" disabled>Páginas</option>`;

  // for (let i = 0; i < nPag; i++) {
  //   if (i + 1 === pag) {
  //     selected = "selected";
  //   } else {
  //     selected = "";
  //   }
  //   if (nPag !== 1) {
  //     sel += `<option value="${i + 1}" ${selected}>${i + 1}</option>`;
  //   }
  // }
  // sel += `</select>`;

  const btnAtras = pag <= 1
    ? `<a class="paginador-btn disabled">❮ Anterior</a>`
    : `<a class="paginador-btn" onclick="${dynamicFunction}(${nPag}, ${pag - 1})">❮ Anterior</a>`;

  const btnSig = pag >= nPag
    ? `<a class="paginador-btn disabled">Siguiente ❯</a>`
    : `<a class="paginador-btn" onclick="${dynamicFunction}(${nPag}, ${pag + 1})">Siguiente ❯</a>`;

  return `
    <div id="paginador" class="paginador-container">
      <div class="row paginador-info">
        <div class="col s12 center-align">${pag}/${nPag}</div>
      </div>
      <div class="row paginador-controls">
        <div class="col s4 paginador-btn-container">${btnAtras}</div>
        <div class="col s4 paginador-select-container">${sel}</div>
        <div class="col s4 paginador-btn-container">${btnSig}</div>
      </div>
    </div>
  `;
}






//-----------------------------------------------------------------------------------
// function cambiarVistaListaEnBodega() {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;

//   // Filtrar solo artículos con existencia en bodega
//   const articulosConExistencia = ArrayDataFiltrado.filter(item =>
//     parseFloat(item.TOTAL_CANTIDAD_BODEGA) > 0
//   );

//   let totalRegistros = articulosConExistencia.length;
//   let pag = 1; // Página inicial
//   let desde = (pag - 1) * xPag;
//   let hasta = Math.min(pag * xPag, totalRegistros);
//   let nPag = Math.ceil(totalRegistros / xPag);
//   let htm = "";

//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//           </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6">
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div>
//               <div class="col s6">
//               <label>
//                 <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
//                 <span>Mostrar En Bodega</span>
//               </label>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaMosaicoEnBodega();">
//               <i class="material-icons right">apps</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModalEnBodega();">
//               <i class="material-icons right">filter_list</i>
//               FILTRAR </a>
//             </div>
//           </div>`;

//   htm += `<table class="striped centered" style="margin-top:5%;">
//   <thead style="background:#28a745;color:white;">
//     <tr>
//       <th style="width:30%;">CODIGO</th>
//       <th style="width:30%;">CODIGO DE BARRAS</th>
//       <th style="width:10%;">EN ${bodegaCod}</th>
//       <th style="width:30%;">ACTION</th>
//     </tr>
//   </thead>
//   <tbody>`;

//   for (let i = desde; i < hasta; i++) {
//     if (articulosConExistencia[i]) {
//       htm += `<tr>
//         <td class="sticky-column text-align:center">
//           <h5 style="font-size:12px; text-align:left; color:orangered;">${articulosConExistencia[i].ARTICULO}</h5>
//           <h6 style="font-size: 10px; text-align: left;">${articulosConExistencia[i].DESCRIPCION}</h6>
//         </td>
//         <td>${articulosConExistencia[i].CODIGO_BARRAS_INVT || ''}</td>
//         <td>${Math.floor(articulosConExistencia[i].TOTAL_CANTIDAD_BODEGA)}</td>
//         <td>
//           <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(articulosConExistencia[i].ARTICULO)}', '${articulosConExistencia[i].DESCRIPCION}')">visibility</i>
//           <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" onclick="mostrarExistencias('${encodeURIComponent(articulosConExistencia[i].ARTICULO)}')" tabindex="1">
//           <img src="./img/icon/bar-code.svg"  width="22" height="22"  onclick="impCodBar('${articulosConExistencia[i].ARTICULO}','${articulosConExistencia[i].DESCRIPCION}')" tabindex="1">
//           <img src="./img/icon/information.svg"  width="22" height="22"  onclick="information('${articulosConExistencia[i].ARTICULO}','${articulosConExistencia[i].DESCRIPCION}')" tabindex="1">
//         </td>
//       </tr>`;
//     }
//   }

//   htm += `</tbody></table>`;
//   htm += `<div id="resultadoPaginador">`;
//   htm += paginadorTablasEnBodega(nPag, pag, 'mostrarResultadosVistaListaEnBodega');
//   htm += `</div></div>`;

//   document.getElementById("resultadoBusqueda").innerHTML = htm;
//   $("html, body").animate(
//     { scrollTop: $("#resultadoBusqueda").offset().top - 140 },
//     1000
//   );

//    const estado = localStorage.getItem("mostrarEnBodega");
//   if (estado === "1") {
//       document.getElementById("miCheckbox").checked = true;
//   } else {
//       document.getElementById("miCheckbox").checked = false;
//   }

//   // Guardar array filtrado para la paginación
//   window.ArticulosBodegaFiltrados = articulosConExistencia;
// }
// //-----------------------------------------------------------------------------------
// function mostrarResultadosVistaListaEnBodega(nPag, pag) {
//   let htm = "";
//   let desde = (pag - 1) * xPag;
//   let hasta = pag * xPag;
//   resultadosVistaListaEnBodega(desde, hasta);
//   htm += paginadorTablasEnBodega(nPag, pag, 'mostrarResultadosVistaListaEnBodega');
//   document.getElementById("resultadoPaginador").innerHTML = htm;
// }
// //-----------------------------------------------------------------------------------
// function resultadosVistaListaEnBodega(desde, hasta) {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;

//   const data = window.ArticulosBodegaFiltrados || []; // Usar filtrados
//   let totalRegistros = data.length;
//   let htm = "";

//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//           </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6">
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div>
//               <div class="col s6">
//               <label>
//                 <input type="checkbox" id="miCheckbox" onchange="toggleMostrarEnBodega()">
//                 <span>Mostrar En Bodega</span>
//               </label>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaMosaicoEnBodega();">
//               <i class="material-icons right">apps</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModalEnBodega();">
//               <i class="material-icons right">filter_list</i>
//               FILTRAR </a>
//             </div>
//           </div>`;

//   htm += `<table class="striped centered" style="margin-top:5%;">
//   <thead style="background:#28a745;color:white;">
//     <tr>
//       <th style="width:30%;">CODIGO</th>
//       <th style="width:30%;">CODIGO DE BARRAS</th>
//       <th style="width:10%;">EN ${bodegaCod}</th>
//       <th style="width:30%;">ACTION</th>
//     </tr>
//   </thead>
//   <tbody>`;
//  const estado = localStorage.getItem("mostrarEnBodega");
//         if (estado === "1") {
//             document.getElementById("miCheckbox").checked = true;
//         } else {
//             document.getElementById("miCheckbox").checked = false;
//         }
//   for (let i = desde; i < hasta; i++) {
//     if (data[i]) {
//       htm += `<tr>
//         <td class="sticky-column text-align:center">
//           <h5 style="font-size:12px; text-align:left; color:orangered;">${data[i].ARTICULO}</h5>
//           <h6 style="font-size: 10px; text-align: left;">${data[i].DESCRIPCION}</h6>
//         </td>
//         <td>${data[i].CODIGO_BARRAS_INVT || ''}</td>
//         <td>${Math.floor(data[i].TOTAL_CANTIDAD_BODEGA)}</td>
//         <td>
//           <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(data[i].ARTICULO)}', '${data[i].DESCRIPCION}')">visibility</i>
//           <img src="./img/icon/forklift-1-svgrepo-com.svg" width="22" height="22" onclick="mostrarExistencias('${data[i].ARTICULO}')" tabindex="1">
//           <img src="./img/icon/bar-code.svg"  width="22" height="22"  onclick="impCodBar('${data[i].ARTICULO}','${data[i].DESCRIPCION}')" tabindex="1">
//           <img src="./img/icon/information.svg"  width="22" height="22"  onclick="information('${data[i].ARTICULO}','${data[i].DESCRIPCION}')" tabindex="1">
//         </td>
//       </tr>`;
//     }
//   }

//   htm += `</tbody></table></div>`;

//   document.getElementById("resultadoBusqueda").innerHTML = htm;
//   $("html, body").animate(
//     { scrollTop: $("#resultadoBusqueda").offset().top - 140 },
//     1000
//   );   
// }
// //------------------------------------------------------------------------------------

// function paginadorTablasEnBodega(nPag, pag, dynamicFunction) {
//   // Generar el select con las páginas
//   let selected = "";
//   let sel = `<select class="browser-default paginador-select" onchange="${dynamicFunction}(${nPag}, this.value)">
//               <option value="" disabled>Páginas</option>`;

//           for (var i = 0; i < nPag; i++) {
//               if (i + 1 == pag) {
//                 selected = "selected";
//               } else {
//                 selected = "";
//               }
//               if (nPag != 1) {
//                 sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
//                   }</option>`;
//               }
//             }
//   sel += `</select>`;

//   // Botones de navegación
//   const btnAtras = pag <= 1
//     ? `<a class="paginador-btn disabled">❮ Anterior</a>`
//     : `<a class="paginador-btn" onclick="${dynamicFunction}(${nPag}, ${pag - 1})">❮ Anterior</a>`;

//   const btnSig = pag >= nPag
//     ? `<a class="paginador-btn disabled">Siguiente ❯</a>`
//     : `<a class="paginador-btn" onclick="${dynamicFunction}(${nPag}, ${pag + 1})">Siguiente ❯</a>`;

//   // Retornar el HTML con clases en lugar de estilos inline
//   return `
//     <div id="paginador" class="paginador-container">
//       <div class="row paginador-info">
//         <div class="col s12 center-align">${pag}/${nPag}</div>
//       </div>
//       <div class="row paginador-controls">
//         <div class="col s4 paginador-btn-container">${btnAtras}</div>
//         <div class="col s4 paginador-select-container">${sel}</div>
//         <div class="col s4 paginador-btn-container">${btnSig}</div>
//       </div>
//     </div>
//   `;
// }

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------  FILTROS --------------------------------------------
function FiltrarModalEnBodega(IDCategoria, seccion) {
  let htm = "";  
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.open();
  switch (IDCategoria) {
    case "1055":
      htm = `<div class="row">
                  <div class="col s12">
                    <fieldset style="    border: 0;
                      text-shadow: none !important;
                      font-weight: normal !important;
                      background-color: transparent !important;
                      color: #000 !important;
                      border: solid 1px #c1bcbc;margin: 0.5em 0;">
                      <label>
                        <input type="checkbox" id="rematetxt" value="R"/>
                        <span>Solo artículos de remate </span><span id="cantRemate" style="font-size: 15px;">0</span>
                      </label>
                    </fieldset>
                    <fieldset style="border: 0;
                      text-shadow: none !important;
                      font-weight: normal !important;
                      background-color: transparent !important;
                      color: #000 !important;
                      border: solid 1px #c1bcbc;margin: 0.5em 0;">
                      <label>
                        <input type="checkbox" id="incompletotxt" value="I" />
                        <span>Solo artículos incompletos </span><span id="cantIncompleto" style="font-size: 15px;">0</span>
                      </label>
                    </fieldset>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>MARCAS</div>
                        <div class="collapsible-body">
                          <div id="filtromarcas" style="padding-left: 10px"></div>
                            <input type="hidden" value="" id="txtMarcasV" name="txtMarcasV">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>ANCHOS</div>
                        <div class="collapsible-body">
                            <div id="filtroanchos" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtAnchosV" name="txtAnchosV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>CENTER BORE(CB)</div>
                        <div class="collapsible-body">
                            <div id="filtrocenter" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtCBV" name="txtCBV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>OFFSET (ET)</div>
                        <div class="collapsible-body">
                            <div id="filtrooffset" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtETV" name="txtETV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>`;
      break;
    default:
      htm = `     
                  <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>CLASES</div>
                        <div class="collapsible-body">
                          <div id="filtroclases" style="padding-left: 10px"></div>
                            <input type="hidden" value="" id="txtClasesV" name="txtClasesV">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>MARCAS</div>
                        <div class="collapsible-body">
                          <div id="filtromarcas" style="padding-left: 10px"></div>
                            <input type="hidden" value="" id="txtMarcasV" name="txtMarcasV">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>TIPOS</div>
                        <div class="collapsible-body">
                            <div id="filtrotipos" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtTiposV" name="txtTiposV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>SUBTIPOS</div>
                        <div class="collapsible-body">
                            <div id="filtrosubtipos" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtSubTiposV" name="txtSubTiposV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>SUBTIPOS2</div>
                        <div class="collapsible-body">
                            <div id="filtrosubtipos2" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtSubTipos2V" name="txtSubTipos2V" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12">
                    <ul class="collapsible">
                      <li>
                        <div class="collapsible-header"><i class="material-icons">add</i>ENVASES</div>
                        <div class="collapsible-body">
                            <div id="filtroenvases" style="padding-left: 10px"></div>
                              <input type="hidden" value="" id="txtEnvasesV" name="txtEnvasesV" >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>`;
      break;
  }
  htm += `<div class="row">
          <div class="col s6">
            <a onclick="FiltrarEnBodega(${IDCategoria},${seccion});" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">filter_list</i>
              Aceptar
            </a>
          </div>
          <div class="col s6">
            <a onclick="LimpiarFiltro(${IDCategoria});" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">update</i>
              Limpiar
            </a>
          </div>
        </div>`;
      document.getElementById("divFiltro").innerHTML = htm;
      document.getElementById("filtroclases").innerHTML = MostrarClasesEnBodega();
      document.getElementById("filtromarcas").innerHTML = MostrarMarcasEnBodega();
      document.getElementById("filtrotipos").innerHTML = MostrarTiposEnBodega();
      document.getElementById("filtrosubtipos").innerHTML = MostrarSubTiposEnBodega();
      document.getElementById("filtrosubtipos2").innerHTML = MostrarSubTipos2EnBodega();
      document.getElementById("filtroenvases").innerHTML = MostrarEnvasesEnBodega();
      $(".collapsible").collapsible();

  const estado = localStorage.getItem("mostrarEnBodega");
  if (estado === "1") {
      document.getElementById("miCheckbox").checked = true;
  } else {
      document.getElementById("miCheckbox").checked = false;
  }

}
function FiltrarEnBodega(IDCategoria, seccion) {
  let pag = 1;
  idCat = document.getElementById("txtCategoria").value;
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.close();
  let r = $("#rematetxt").is(":checked");
  let i = $("#incompletotxt").is(":checked");
  ////console.log("Valor de i: " + i);
  // //console.log(articulosConExistencia);
  let clase = document.getElementById("txtClasesV").value;
  let marca = document.getElementById("txtMarcasV").value;
  let tipo = document.getElementById("txtTiposV").value;
  let subtipo = document.getElementById("txtSubTiposV").value;
  let subtipo2 = document.getElementById("txtSubTipos2V").value;
  let envase = document.getElementById("txtEnvasesV").value;
  let filtradoPor = new Array();

  if (clase.length > 0) {
    clasesArray = clase.split(",");
  } else {
    clasesArray = "";
  }
  if (marca.length > 0) {
    marcasArray = marca.split(",");
  } else {
    marcasArray = "";
  }
  if (tipo.length > 0) {
    tiposArray = tipo.split(",");
  } else {
    tiposArray = "";
  }
  if (subtipo.length > 0) {
    subtiposArray = subtipo.split(",");
  } else {
    subtiposArray = "";
  }
  if (subtipo2.length > 0) {
    subtipos2Array = subtipo2.split(",");
  } else {
    subtipos2Array = "";
  }
  if (envase.length > 0) {
    envasesArray = envase.split(",");
  } else {
    envasesArray = "";
  }

  filtradoPor = {
    CLASE: clasesArray,
    MARCA: marcasArray,
    TIPO: tiposArray,
    SUBTIPO: subtiposArray,
    SUBTIPO2: subtipos2Array,
    ENVASE: envasesArray,
  };

  if (filtradoPor.CLASE === "") {
    delete filtradoPor.CLASE;
  }
  if (filtradoPor.MARCA === "") {
    delete filtradoPor.MARCA;
  }
  if (filtradoPor.TIPO === "") {
    delete filtradoPor.TIPO;
  }
  if (filtradoPor.SUBTIPO === "") {
    delete filtradoPor.SUBTIPO;
  }
  if (filtradoPor.SUBTIPO2 === "") {
    delete filtradoPor.SUBTIPO2;
  }
  if (filtradoPor.ENVASE === "") {
    delete filtradoPor.ENVASE;
  }

  articulosConExistencia = getFiltrarResultadoEnBodega(filtradoPor);

  if (
    articulosConExistencia.length > 0 &&
    filtradoPor.INCOMPLETO == "I" &&
    clearFiltros == false
  ) {
    viewImcompletos = true;
  }
  //console.log(articulosConExistencia);
  let totales = articulosConExistencia.length;
  nPag = Math.ceil(totales / xPag);
  if (totales > 0) {
    //console.log(IDCategoria + "-" + seccion);
    if (IDCategoria == "1030" && seccion != 0) {
      if (seccion == 1) {
        mostrarResultadosFiltrosReferencia(nPag, pag, idCat);
        //console.log("Esta pasando por aqui");
      }
      if (seccion == 2) {
        mostrarResultadosFiltrosIntercambio(nPag, pag, idCat);
      }
    } else {
      mostrarResultadosBusquedaEnBodega(nPag, 1, articulosConExistencia);
    }
  } else {
    Swal.fire({
      icon: "info",
      title: "Filtrar busqueda",
      text: "No hay artículos para el filtro selecccionado.",
      confirmButtonColor: "#000",
    });
    return false;
  } 
}
function getFiltrarResultadoEnBodega(filtradoPor) {
  //console.log("Estas pasando por getFiltrarResultadoEnBodega");
  //console.log(articulosConExistencia);
  //console.log(filtradoPor);
  if (
    filtradoPor.INCOMPLETO &&
    filtradoPor.INCOMPLETO.length > 0 &&
    filtradoPor.INCOMPLETO[0] === "I"
  ) {
    //ESTABA AQUI
    resultados = articulosConExistencia.filter(
      (item) => item.ID_CLASE === "1055" && parseFloat(item.CANT_DISPONIBLE) < 4
    );
  } else {
    resultados = articulosConExistencia.filter(function (o) {
      return Object.keys(filtradoPor).every(function (k) {
        return filtradoPor[k].some(function (f) {
          return o[k] === f;
        });
      });
    });
  }

  return resultados;
}
//--------------------------------Mostrar Clases---------------------------------------
function MostrarClasesEnBodega(opt) {
  const result = [];
  const map = new Map();
  let claseHTML = "";
  for (const item of articulosConExistencia) {
    switch (opt) {
      case 1:
        if (!map.has(item.CLASE)) {
          map.set(item.CLASE, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_1,
            DESCRIPCION: item.CLASE,
          });
        }
        claseHTML = mostrarFiltroEnBodega(result, "txtClase", opt);
        break;
      default:
        if (!map.has(item.CLASE)) {
          map.set(item.CLASE, true); // set any value to Map
          result.push({
            VALOR: item.CLASE,
            DESCRIPCION: item.CLASE,
          });
        }
        claseHTML = mostrarFiltroEnBodega(result, "txtClase");
        break;
    }
  }
  return claseHTML;
}
//--------------------------------Mostrar Marcas---------------------------------------
function MostrarMarcasEnBodega(opt) {
  const result = [];
  const map = new Map();
  let marcaHTML = "";
  for (const item of articulosConExistencia) {
    switch (opt) {
      case 1:
        if (!map.has(item.MARCA)) {
          map.set(item.MARCA, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_2,
            DESCRIPCION: item.MARCA,
          });
        }
        marcaHTML = mostrarFiltroEnBodega(result, "txtMarca", 2);
        break;
      default:
        if (!map.has(item.MARCA)) {
          map.set(item.MARCA, true); // set any value to Map
          result.push({
            VALOR: item.MARCA,
            DESCRIPCION: item.MARCA,
          });
        }
        marcaHTML = mostrarFiltroEnBodega(result, "txtMarca");
        break;
    }
  }
  return marcaHTML;
}
//--------------------------------Mostrar Tipos----------------------------------------
function MostrarTiposEnBodega(opt) {
  const result = [];
  const map = new Map();
  let tipoHTML = "";
  for (const item of articulosConExistencia) {
    switch (opt) {
      case 1:
        if (!map.has(item.TIPO)) {
          map.set(item.TIPO, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_3,
            DESCRIPCION: item.TIPO,
          });
        }
        tipoHTML = mostrarFiltroEnBodega(result, "txtTipo", 3);
        break;
      default:
        if (!map.has(item.TIPO)) {
          map.set(item.TIPO, true); // set any value to Map
          result.push({
            VALOR: item.TIPO,
            DESCRIPCION: item.TIPO,
          });
        }
        tipoHTML = mostrarFiltroEnBodega(result, "txtTipo");
        break;
    }
  }
  return tipoHTML;
}
//--------------------------------Mostrar SubTipos-------------------------------------
function MostrarSubTiposEnBodega(opt) {
  const result = [];
  const map = new Map();
  let subtipoHTML = "";
  for (const item of articulosConExistencia) {
    switch (opt) {
      case 1:
        if (!map.has(item.SUBTIPO)) {
          map.set(item.SUBTIPO, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_4,
            DESCRIPCION: item.SUBTIPO,
          });
        }
        subtipoHTML = mostrarFiltroEnBodega(result, "txtSubTipo", 4);
        break;
      default:
        if (!map.has(item.SUBTIPO)) {
          map.set(item.SUBTIPO, true); // set any value to Map
          result.push({
            VALOR: item.SUBTIPO,
            DESCRIPCION: item.SUBTIPO,
          });
        }
        subtipoHTML = mostrarFiltroEnBodega(result, "txtSubTipo");
        break;
    }
  }
  return subtipoHTML;
}
//--------------------------------Mostrar SubTipos2------------------------------------
function MostrarSubTipos2EnBodega(opt) {
  const result = [];
  const map = new Map();
  let subtipo2HTML = "";
  for (const item of articulosConExistencia) {
    switch (opt) {
      case 1:
        if (!map.has(item.SUBTIPO2)) {
          map.set(item.SUBTIPO2, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_5,
            DESCRIPCION: item.SUBTIPO2,
          });
        }
        subtipo2HTML = mostrarFiltroEnBodega(result, "txtSubTipo2", 5);
        break;
      default:
        if (!map.has(item.SUBTIPO2)) {
          map.set(item.SUBTIPO2, true); // set any value to Map
          result.push({
            VALOR: item.SUBTIPO2,
            DESCRIPCION: item.SUBTIPO2,
          });
        }
        subtipo2HTML = mostrarFiltroEnBodega(result, "txtSubTipo2");
        break;
    }
  }
  return subtipo2HTML;
}
//--------------------------------Mostrar Envases--------------------------------------
function MostrarEnvasesEnBodega(opt) {
  const result = [];
  const map = new Map();
  let envaseHTML = "";
  for (const item of articulosConExistencia) {
    switch (opt) {
      case 1:
        if (!map.has(item.ENVASE)) {
          map.set(item.ENVASE, true); // set any value to Map
          result.push({
            VALOR: item.CLASIFICACION_6,
            DESCRIPCION: item.ENVASE,
          });
        }
        envaseHTML = mostrarFiltroEnBodega(result, "txtEnvase", 6);
        break;
      default:
        if (!map.has(item.ENVASE)) {
          map.set(item.ENVASE, true); // set any value to Map
          result.push({
            VALOR: item.ENVASE,
            DESCRIPCION: item.ENVASE,
          });
        }
        envaseHTML = mostrarFiltroEnBodega(result, "txtEnvase");
        break;
    }
  }
  return envaseHTML;
}
function mostrarFiltroEnBodega(data, id, opt) {
  data = ordenarDescripcion(data);
  let claseSelect, marcaSelect, tipoSelect, subtipoSelect, subtipo2Select;
  claseSelect = localStorage.getItem('claseSelect');
  var htm = "";
  var i = parseInt(1);
  if (data.length > 0) {
    data.forEach(function (key) {
      if (key.VALOR != null && key.DESCRIPCION != null) {
        switch (opt) {
          //Clase
          case 1:
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros('${key.VALOR}');">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          //Marca
          case 2:
            claseSelect = localStorage.getItem('claseSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          //Tipo
          case 3:
            claseSelect = localStorage.getItem('claseSelect');
            marcaSelect = localStorage.getItem('marcaSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${marcaSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          //SubTipo
          case 4:
            claseSelect = localStorage.getItem('claseSelect');
            marcaSelect = localStorage.getItem('marcaSelect');
            tipoSelect = localStorage.getItem('tipoSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${marcaSelect},${tipoSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          case 5:
            claseSelect = localStorage.getItem('claseSelect');
            marcaSelect = localStorage.getItem('marcaSelect');
            tipoSelect = localStorage.getItem('tipoSelect');
            subtipoSelect = localStorage.getItem('subtipoSelect');
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltros(${claseSelect},${marcaSelect},${tipoSelect},${subtipoSelect},${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          case 6:
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="guardarEnvaseSelect(${key.VALOR});">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
          default:
            htm += `<label>
                  <input type="checkbox" value="${key.VALOR
              }" name="${id}[]" id="${id + i
              }"  onchange="getFiltro('${id}','${id + i}');">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
            break;
        }
        i = i + 1;
      }
    });
    return htm;
  } else return "<label >Filtro no existe</label>";
}
(function() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'touchmove' && options !== false) {
            if (typeof options === 'object') {
                options.passive = true;
            } else {
                options = { passive: true };
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();

