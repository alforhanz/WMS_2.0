var ArrayData = new Array();
//Array para almacenar filtros
var ArrayData2 = new Array();
var ArrayDataFiltrado = new Array();
var ArrayPrecio = new Array();
// var ArrayITBMS = new Array();
var promo = "";
var viewImcompletos = false;
var clearFiltros = false;
const xPag = 20;
var itemsToDelete = "";
var itemsToDelete_NoProm = "";
var promoToDelete = "";
// let acumToDelete = [];
let acumToDelete = JSON.parse(sessionStorage.getItem("itemsToDelete"));

document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM cargado...')
   //--------------------------------------------------
  validate_login();
  existeBodega();
});
//-------------------------------------------------------------------------------
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
//-------------------------------------------------------------------------------
function existeBodega() {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  if (bodega) {
    document.getElementById("bodega-sucursal").innerHTML = bodega[0].NOMBRE;
    document.getElementById("bodega").value = bodega[0].BODEGA;
    // document.getElementById("icon-cliente").setAttribute("href", "#modal1");
  }
}

//-----------------------------FILTRAR MODAL---------quemao----------------------------
function FiltrarModal(IDCategoria, seccion) {
  let htm = "";
  let usuario = document.getElementById("hUsuario").value;
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
      htm = `<div class="row">
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
}
//-----------------------------FILTROS MODAL-------------------------------------
function filtrosModal() {
  let htm = "", IDCategoria = "1055";
  let usuario = document.getElementById("hUsuario").value;
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
// Busqueda de clientes
$("#txtRuc").on("keypress", function (e) {
  if (e.keyCode == 13 || e.keyCode == 9) {
    e.preventDefault();
    // btnBusquedaCliente();
  }
});
//-----------------------------------------------------------------------------------

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
          // else {
          //   localStorage.removeItem('claseSelect');
          //   localStorage.removeItem('marcaSelect');
          //   localStorage.removeItem('tipoSelect');
          //   localStorage.removeItem('subtipoSelect');
          //   localStorage.removeItem('subtipo2Select');
          //   localStorage.removeItem('envaseSelect');
          // }
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

function formatData(data) {
  let name = "";
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
function enlace(link) {
  window.location.href = link;
}
//-----------------------------------------------------------------------------------
function secciones(categoria) {
  let seccion = menu2.find((x) => x.id == categoria);
  document.location = seccion.link + "?IDCategoria=" + seccion.id;
}
//-----------------------------------------------------------------------------------
function busquedaCategoria(categoria) {
  let cat = menu2.find((x) => x.id == categoria);
  return cat.descripcion;
}
//-----------------------------------------------------------------------------------
function message(info, titulo, mensaje) {
  Swal.fire({
    icon: info,
    title: titulo,
    text: mensaje,
    confirmButtonColor: "#000",
  });
}
//-----------------------------------------------------------------------------------
//FUNCION PARA VALIDAR INPUT TEXT OBLIGATORIOS
function validate_error(mensaje) {
  let message = mensaje;
  Swal.fire({
    icon: "error",
    title: "¡Ups!",
    text: message,
    confirmButtonColor: "#000",
  });
}

//FUNCION AGREGAR PAGINADOR SECCION BUSQUEDA CLIENTES
//-----------------------------------------------------------------------------------
// function showClientResult(nPag, pag, IDCategoria, ord) {
//   let htm = "";
//   // htm += paginador(nPag, pag, IDCategoria, ord);
//   htm += paginadorServicios(nPag, pag, IDCategoria);
//   document.getElementById("BusquedaResultado").innerHTML = htm;
// }



//-----------------------------------------------------------------------------------
function existe_Usuario() {
  const usuario = sessionStorage.getItem("user");
  return JSON.parse(usuario) || [];
}


//-----------------------------------------------------------------------------------
// function existe_DatosCliente() {
//   const datos = localStorage.getItem("clientedatos");
//   return JSON.parse(datos) || [];
// }



//-----------------------------------------------------------------------------------
function expand(id) {
  let ids = document.getElementById(id);
  if (ids.style.display === "none") ids.style.display = "table-row-group";
  else ids.style.display = "none";
}

function closetooltips() {
  document.querySelectorAll(".tooltips-luciano").forEach(function (el) {
    el.style.display = "none";
  });
}

//-----------------------------------------------------------------------------------
function CerrarModal(key) {
  //console.log(key);
  elem = document.getElementById(key);
  let instance = M.Modal.getInstance(elem);
  instance.close();
}
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
//-----------------------------------------------------------------------------------
// function cargarPedidos(pedido, IDCliente, NCliente) {
//   let usuario = document.getElementById("hUsuario").value;
//   let fechaIni = document.getElementById("fecha_ini").value;
//   let fechaFin = document.getElementById("fecha_fin").value;
//   let bodega = document.getElementById("bodega").value;
//   const params =
//     "?pedido=" +
//     pedido +
//     "&user=" +
//     usuario +
//     "&fechafin=" +
//     fechaFin +
//     "&fechaini=" +
//     fechaIni +
//     "&bodega=" +
//     bodega;
//   // //console.log("ESTOS SON LOS PARAMETROS QUE SE ENVIAN A PEDIDOS");
//   // //console.log(params);
//   fetch(env.API_URL + "pedidos/D" + params, myInit)
//     .then((response) => response.json())
//     .then((result) => {
//       if (result.msg === "SUCCESS") {
//         if (result.pedidos.length != 0) {
//           //----guarda los articulos en cartCLSA------
//           //console.log(result.pedidos[0].Observacion);
//           localStorage.setItem("cartCLSA", JSON.stringify(result.pedidos));
//           // Variable to store the initial cart item count
//           sessionStorage.setItem(
//             "cartItemCount",
//             result.pedidos[0].items.length
//           );
//           sessionStorage.setItem("initObserv", result.pedidos[0].Observacion);
//           sessionStorage.setItem("cliente", JSON.stringify(IDCliente));
//           sessionStorage.setItem("Ncliente", JSON.stringify(NCliente));
//           sessionStorage.setItem("_UpdateOrder", JSON.stringify("1"));
//           localStorage.setItem("cargarCotizacion", "TRUE");

//           let imprimir = JSON.parse(localStorage.getItem("cartCLSA"));
//           // let cantInicial = localStorage.getItem("cartItemCount");
//           //console.log("PEDIDO DESDE CARGAR PEDIDO");
//           //console.log(imprimir);
//           // localStorage.removeItem("cartItemCount");

//           //console.log("RESULTADOS DE PEDIDO");
//           //console.log(result.pedidos);

//           const Toast = Swal.mixin({
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//             timer: 2000,
//             timerProgressBar: true,
//             onOpen: (toast) => {
//               toast.addEventListener("mouseenter", Swal.stopTimer);
//               toast.addEventListener("mouseleave", Swal.resumeTimer);
//             },
//           });
//           Toast.fire({
//             icon: "success",
//             title: "Agregando el pedido seleccionado al carrito",
//           }).then(function () {
//             Swal.fire({
//               icon: "success",
//               title: "Agregado correctamente",
//               text: "Su pedido fue agregado.",
//               confirmButtonColor: "#000",
//             });
//           });
//           document.getElementById("iconCard").style.display = "block";
//           document.getElementById("icon-user").classList.remove("icon-usuario");
//           document
//             .getElementById("icon-user")
//             .classList.add("icon-usuario-activo");
//           //funcion que agrega los datos del cliente
//           ingresarCliente(IDCliente, NCliente);
//           //--------llamado funcion refrescarCarrito en pruebaClass.js---------
//           cartCLSAObj.refrescarCarrito();
//           //console.log("Ya ejecuto refrescarCarrito");
//         }
//         document.getElementById("carga").innerHTML = "";
//       } else {
//         //console.log("No se cargo los modelos, verifique la conexión");
//       }
//     });
// }
//-----------------------------------------------------------------------------------
function MostrarRemates() {
  let cant = 0;
  for (const item of ArrayData) {
    if (item.REMATE == "R") {
      cant++;
    }
  }
  return cant;
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
//--------------------------------Mostrar Clases---------------------------------------
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
//--------------------------------Mostrar Tipos---------------------------------------
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
//--------------------------------Mostrar SubTipos---------------------------------------
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
//--------------------------------Mostrar SubTipos2---------------------------------------
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
//--------------------------------Mostrar Envases---------------------------------------
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
  // valorCLH = "",
  // valorTH = "",
  // valorSTH = "";

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
//------------------------------------------------------------------------------------
function BuscarBorrar(cadena, value) {
  var arreglo = cadena.split(",");
  $.each(arreglo, function (index, result) {
    if (arreglo[index] == value) {
      arreglo.splice(index, 1);
    }
  });
  return arreglo.toString();
}
////////////////// BUSQUEDA DE ARTICULOS EN INVENTARIO X BODEGA /////////////////////////////////////////

function preBusqueda() {
  let nPag = 0;
  let pag = 1;
  let articulo = document.getElementById("articulo").value.trim();
  if (!articulo) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia",
      text: "Por favor, ingrese un artículo para buscar.",
      confirmButtonColor: "#28a745",
    });
    return;
  }
  const art = encodeURIComponent(articulo);
  let bodega = document.getElementById("bodega").value;
  let clase = localStorage.getItem('claseSelect') || '';
  let marca = localStorage.getItem('marcaSelect') || '';
  let tipo = localStorage.getItem('tipoSelect') || '';
  let envase = localStorage.getItem('envaseSelect') || '';

  const params =
    "?pActivos=" +
    "S" +
    "&pExistencia=" +
    null +
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
        if (result.data.length > 0) {
          ArrayData = result.data;
          ArrayDataFiltrado = result.data;
          console.log("DATA DE BUSQUEDA...", ArrayData);
          let totales = ArrayDataFiltrado.length;
          nPag = Math.ceil(totales / xPag);
          LimpiarFiltroPre(1);
          mostrarResultadosBusqueda(nPag, pag);
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
//------------------------------Filtrado Post Busqueda para los resultados--------------------------------
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
  ////console.log(ArrayDataFiltrado);
  //ArrayData;
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
//------------------------Limpiar Filtros Pre Busqueda--------------------------------
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
//------------------------Limpiar Filtros Post Busqueda--------------------------------
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
//-----------------------------------------------------------------------------------
// function detalleFactura(tipoDocumento, stock) {
//   let bodega = document.getElementById("bodega").value;
//   let x = document.querySelector("#FormCarrito");
//   for (let elem of x) {
//     if (elem.value == "0.00") {
//       Swal.fire({
//         icon: "warning",
//         title: "Linea sin precios",
//         text: "Existen articulos sin precios.",
//         confirmButtonColor: "#000",
//       });
//       return false;
//     }
//   }
//   if (tipoDocumento == "P" && stock > 0) {
//     Swal.fire({
//       icon: "warning",
//       title: "Oops...",
//       text:
//         "No se puede crear pedido, porque hay artículos con cantidad pedida mayor a la cantidad en existencia en bodega " +
//         bodega,
//     });
//     return false;
//   } else {
//     window.location.href =
//       "detalle-factura.html?tipodocumento=" + tipoDocumento;
//   }
// }
//-----------------------------------------------------------------------------------
// function precioArticuloVende(art, i) {
//   const usuario = existe_Usuario();
//   idCat = document.getElementById("txtCategoria").value;
//   const params = "?art=" + art + "&user=" + usuario + "&idcategoria=" + idCat;
//   //console.log(env.API_URL + "reportes/1" + params);
//   fetch(env.API_URL + "reportes/1" + params, {
//     method: "GET", // *GET, POST, PUT, DELETE, etc.
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       if (result.msg === "SUCCESS") {
//         let htm =
//           "<h6 class='red-text right' onclick='closetooltips()'><i class='material-icons red-text'>close</i></h6><table>";
//         result.reporte.forEach(function (key, index) {
//           htm +=
//             "<tr><td>" +
//             key.NIVEL_PRECIO +
//             " : </td><td>B/." +
//             parseFloat(key.PRECIO).toFixed(2) +
//             "</td></tr>";
//         });
//         htm += "</table>";

//         document.getElementById("precios_lista" + i).innerHTML = htm;
//         document.querySelectorAll(".tooltips-luciano").forEach(function (el) {
//           el.style.display = "none";
//         });
//         document.getElementById("precios_lista" + i).style.display = "block";
//         window.setTimeout(function () {
//           $("#precios_lista" + i).fadeOut();
//         }, 8000);
//       } else {
//         //console.log("No se cargo los modelos, verifique la conexión");
//       }
//     });
// }
// //-----------------------trae stock articulo por bodega------------------------------
// function precioArticuloVende2(art, i, tipobusqueda) {
//   // tipobusqueda = localStorage.getItem('tipobusqueda');
//   let loader = `<div class="loading"></div>`;
//   // document.getElementById("carga").innerHTML = loader;
//   const usuario = existe_Usuario();
//   idCat = document.getElementById("txtCategoria").value;
//   let params = "";
//   if (tipobusqueda == "K") {
//     params = "?user=" + usuario + "&art=" + art + "&p_Opcion=" + 3;
//   }
//   else {
//     params = "?user=" + usuario + "&art=" + art;
//   }

//   fetch(env.API_URL + "reportes/3" + params, {
//     method: "GET", // *GET, POST, PUT, DELETE, etc.
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       //console.log(result.reporte);
//       let htm = "";
//       if (result.msg === "SUCCESS") {
//         htm +=
//           "<h6 class='red-text right' onclick='closetooltips()'><i class='material-icons red-text'>close</i></h6><table><tr><td>SUCURSAL</td><td>CANTIDAD</td></tr>";
//         result.reporte.forEach(function (key, index) {
//           // Verificar si key.CANTIDAD es un número válido
//           var cantidad = parseFloat(key.CANTIDAD);
//           // Si no es un número válido o es igual a 0, asignar 0
//           if (isNaN(cantidad) || cantidad === 0) {
//             cantidad = 0;
//           } else {
//             // Convertir a entero si es un número válido y diferente de 0
//             cantidad = parseInt(cantidad);
//           }
//           htm +=
//             '<tr><td style="font-size:8px">' +
//             key.BODEGAS +
//             " : </td><td class='center-align'>" +
//             cantidad +
//             "</td></tr>";
//         });
//         htm += "</table>";
//         // document.getElementById("carga").innerHTML = "";
//         document.getElementById("inventario_lista" + i).innerHTML = htm;
//         document.querySelectorAll(".tooltips-luciano").forEach(function (el) {
//           el.style.display = "none";
//         });
//         document.getElementById("inventario_lista" + i).style.display = "block";
//         window.setTimeout(function () {
//           $("#inventario_lista" + i).fadeOut();
//         }, 8000);
//       } else {
//         //console.log("No se cargo los modelos, verifique la conexión");
//       }
//     });
// }
// //-----------------------------------------------------------------------------------
// function precioArticuloVende3(art, i) {
//   //ULTIMAS COMPRAS
//   let loader = `<div class="loading"></div>`;
//   document.getElementById("carga").innerHTML = loader;
//   const usuario = existe_Usuario();
//   const client = existe_Cliente();
//   idCat = document.getElementById("txtCategoria").value;
//   const params = "?user=" + usuario + "&art=" + art + "&cliente=" + client;
//   //console.log(env.API_URL + "reportes/2" + params);
//   fetch(env.API_URL + "reportes/2" + params, {
//     method: "GET", // *GET, POST, PUT, DELETE, etc.8
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       let htm = "";
//       if (result.msg === "SUCCESS") {
//         //console.log(result.reporte);
//         if (result.reporte != 0) {
//           htm +=
//             "<h6 class='red-text right' onclick='closetooltips()'><i class='material-icons red-text'>close</i></h6><table><tr><td>FECHA</td><td>CANT.</td><td>PRECIO</td></tr>";
//           result.reporte.forEach(function (key, index) {
//             htm +=
//               "<tr><td>" +
//               key.FECHA +
//               "</td><td class='center-align'>" +
//               parseInt(key.CANTIDAD).toFixed(0) +
//               "</td><td class='center-align'>" +
//               key.PRECIO_TOTAL +
//               "</td></tr>";
//           });
//           htm += "</table>";
//         } else {
//           htm = `<h6 class='red-text right' onclick='closetooltips()'><i class='material-icons red-text'>close</i></h6><table><tr><td>Cliente no tiene <br>ultimas compras<br>del articulo ${art}</td></table>`;
//         }
//         document.getElementById("carga").innerHTML = "";
//         document.getElementById("ultimas_compras" + i).innerHTML = htm;
//         document.querySelectorAll(".tooltips-luciano").forEach(function (el) {
//           el.style.display = "none";
//         });
//         document.getElementById("ultimas_compras" + i).style.display = "block";
//         window.setTimeout(function () {
//           $("#ultimas_compras" + i).fadeOut();
//         }, 8000);
//       } else {
//         //console.log("No se cargo los modelos, verifique la conexión");
//       }
//     });
// }


// //-----------------------------------------------------------------------------------
function busquedaGeneral() {
  let params;
  let nPag = 0;
  // htm = "";
  let pag = 1;
  let loader = `<div class="loading"></div>`;
  let articulo = document.getElementById("articulo").value;
  bodega = document.getElementById("bodega").value;
  idCat = 1040;
  if (articulo == "") {
    Swal.fire({
      icon: "warning",
      text: "Por favor ingrese la palabra a buscar",
      confirmButtonColor: "#f90f00",
    });
    document.getElementById("articulo").focus();
  } else {   

    params =
      "?ptiporpt=" +
      tiporpt +
      "&ptipoclase=" +
      tipoclase +
      "&articulo=" +
      articulo +
      "&bodega=" +
      bodega +
      "&ptipoprod=" +
      tipobusqueda;

    //console.log("Estos son los parametros de busqueda General: " + params);
    // //console.log(params);
    fetch(env.API_URL + "wmsbusquedaarticulos/1" + params, myInit)
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error))
      .then((result) => {
        if (result.msg === "SUCCESS") {
          //console.log(result.data.length);
          if (result.data.length > 0) {
            ArrayData = result.data;
            ArrayDataFiltrado = result.data;
            //console.log("DATA DE BUSQUEDA GENERAL");
            //console.log(ArrayData);
            let totales = ArrayDataFiltrado.length;
            nPag = Math.ceil(totales / xPag);
            if (tipoclase == "1040") {
              mostrarResultadosBusquedaServicios(nPag, pag, idCat);
            } else {
              mostrarResultadosBusqueda(nPag, pag, idCat, "", tipobusqueda);
            }
          } else {
            Swal.fire({
              icon: "info",
              title: "Información",
              text: "No hay resultado para la busqueda " + articulo,
              confirmButtonColor: "#28a745",
            });
            document.getElementById("carga").innerHTML = "";
            return false;
          }
        }
      });
  }
}
//-----------------------------------------------------------------------------------
// function mostrarResultadosBusqueda(nPag, pag) {
//   ////console.log("nPage:" + nPag + "- pag:" + pag);
//   //VARIABLE client no se esta usando
//   pTipoProd = "T";
//   // let client = existe_Cliente();
//   let htm = "";
//   let desde = (pag - 1) * xPag;
//   let hasta = pag * xPag;
//   // //console.log("DESDE MOSTRARRESULTADOSBUSQUEDA");
//   // //console.log(IDCategoria);
//   htm = mostrarResultados(desde, hasta);
//   htm += paginador(nPag, pag);
//   document.getElementById("resultadoBusqueda").innerHTML = htm;
//   $("html, body").animate(
//     {
//       scrollTop: $("#resultadoBusqueda").offset().top - 140,
//     },
//     1000
//   );
//   // document.getElementById("carga").innerHTML = "";
//   $("select").formSelect();
//   $(".dropdown-trigger").dropdown();
// }

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


// // -----------------------------------------------------------------------------------
// function mostrarResultados(desde, hasta) {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;
//   var totalRegistros = 0, tipobusqueda = "";
//   //console.log("TIPOBUSQUEDA: " + tipobusqueda);
//   //Para productos terminados(T), para KIT (K)
//   tipobusqueda = "T";
//   //Conteo total de registros para todas las demas categorias y rines incompletos
//   var totalizador = 0;
//   for (var i = 0; i < ArrayDataFiltrado.length; i++) {
//     if (
//       ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//       +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//     ) {
//       totalizador++;
//     }
//   }

//   if (totalizador !== 0) {
//     totalRegistros = ArrayDataFiltrado.length - totalizador;
//     clearFiltros = false;
//   } else {
//     totalRegistros = ArrayDataFiltrado.length;
//     clearFiltros = false;
//   }
//   let client = 0;
//   //DECLARACION DE VARIABLES
//   let htm = "",
//     remateLabel = "",
//     bodegaLabel = "",
//     url = "",
//     precioL = "";
//   //var pre = 1;
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//         </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6 m12" >
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div></div>
//             <div class="row" id="vistabusqueda">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
//               <i class="material-icons right">list</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
//               <i class="material-icons right">filter_list</i>
//               FILTRAR </a>
//             </div>
//             </div>`;
//   htm += '<ul id="listas">';
//   ////console.log(ArrayData);
//   for (let i = desde; i < hasta; i++) {
//     if (ArrayDataFiltrado[i]) {
//       DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
//       //SI ENCUENTRA STOCK DEL ARTICULO EN BODEGA AGREGA ETIQUETA: EN TIENDA
//       if (ArrayDataFiltrado[i].BODEGA == "S") {
//         bodegaLabel = `<span class="mi-tienda">En Bodega</span>`;
//         //bodegaLabel = '<span class="mi-tienda">En Bodega </span>';
//         // bodegaLabel = `<span class="mi-tienda">En ${bodegaCod}</span>`;
//       } else {
//         bodegaLabel = `<span class="mi-tienda card-panel red darken-1">No disponible</span>`;
//       }
//       // url = ` href="detalle.html?art=${ArrayDataFiltrado[i].ARTICULO}&IDCategoria=${ArrayDataFiltrado[i].ID_CLASE}&pTipoProd=${tipobusqueda}"`;
//       url = ` href="#"`;
//       htm += `
//           <li>
//             <div class="container-img">
//             <div id="envoltorio">
//               <a ${url}>
//                   ${remateLabel}
//                   <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
//                     data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
//                   ${bodegaLabel}
//               </a>
//               <div class="flotante-acciones">
//                       <div class="link-flotante-acciones" style="padding-bottom: 5px;">
//                           <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
//                               <!--<i class="icon-inventory" style="font-size: 24px;"></i>-->
//                               <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
//                           </a>
//                           <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
//                       </div>`;
//       htm += `</div>
//                       <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
//                       <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
//                       <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
//               </div>
//               <h3 class="articulo-titulo"> ${ArrayDataFiltrado[i].ARTICULO}</h3>
//               <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
//               <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
//               ${precioL}</span>
//             </div>
//           </li>`;
//     }
//   }
//   htm += "</ul></div>";
//   return htm;
// }


function mostrarResultados(desde, hasta) {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  let bodegaCod = bodega[0].BODEGA;
  var totalRegistros = 0, tipobusqueda = "";
  tipobusqueda = "T";
  var totalizador = 0;
  for (var i = 0; i < ArrayDataFiltrado.length; i++) {
    if (
      ArrayDataFiltrado[i].ID_CLASE == "1055" &&
      +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
    ) {
      totalizador++;
    }
  }

  if (totalizador !== 0) {
    totalRegistros = ArrayDataFiltrado.length - totalizador;
    clearFiltros = false;
  } else {
    totalRegistros = ArrayDataFiltrado.length;
    clearFiltros = false;
  }
  let client = 0;
  let htm = "",
    remateLabel = "",
    bodegaLabel = "",
    url = "",
    precioL = "";
  var pre = 1;
  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
          <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
        </div>`;
  htm += `<div class="row" id="totalregistros">
            <div class="col s6 m12" >
              <span>Total de Registros: </span>
              <span>${totalRegistros}</span>
            </div></div>
            <div class="row" id="vistabusqueda">
            <div class="col s6">
                <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
              <i class="material-icons right">list</i>
              VISTA </a>
            </div>
            <div class="col s6">
              <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
              <i class="material-icons right">filter_list</i>
              FILTRAR </a>
            </div>
            </div>`;
  htm += '<div class="row">'; // Inicia la primera fila
  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
      if (ArrayDataFiltrado[i].BODEGA == "S") {
        bodegaLabel = `<span class="mi-tienda">En Bodega</span>`;
      } else {
        bodegaLabel = `<span class="mi-tienda card-panel red darken-1">No disponible</span>`;
      }
      url = ` href="#"`;
      htm += `
        <div class="col s6 m4 l3">         
            <div class="container-img">
              <div id="envoltorio">
                <a ${url}>
                  ${remateLabel}
                  <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
                    data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
                  ${bodegaLabel}
                </a>
                <div class="flotante-acciones">
                  <div class="link-flotante-acciones" style="padding-bottom: 5px;">
                    <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
                      <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
                    </a>
                    <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
                  </div>
                </div>
                <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
                <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
                <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
              </div>
              <h3 class="articulo-titulo">${ArrayDataFiltrado[i].ARTICULO}</h3>
              <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
              <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
                ${precioL}</span>
            </div>
         
        </div>`;
      // Cerrar la fila cada 4 elementos y abrir una nueva
      if ((i - desde + 1) % 4 === 0 && i < hasta - 1) {
        htm += '</div><div class="row">';
      }
    }
  }
  htm += '</div>'; // Cierra la última fila
  htm += '</div>'; // Cierra lista-articulo
  return htm;
}



// function mostrarResultados(desde, hasta) {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;
//   var totalRegistros = 0, tipobusqueda = "";
//   tipobusqueda = "T";
//   var totalizador = 0;
//   for (var i = 0; i < ArrayDataFiltrado.length; i++) {
//     if (
//       ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//       +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//     ) {
//       totalizador++;
//     }
//   }

//   if (totalizador !== 0) {
//     totalRegistros = ArrayDataFiltrado.length - totalizador;
//     clearFiltros = false;
//   } else {
//     totalRegistros = ArrayDataFiltrado.length;
//     clearFiltros = false;
//   }
//   let client = 0;
//   let htm = "",
//     remateLabel = "",
//     bodegaLabel = "",
//     url = "",
//     precioL = "";
//   var pre = 1;
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//         </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6 m12" >
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div></div>
//             <div class="row" id="vistabusqueda">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
//               <i class="material-icons right">list</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
//               <i class="material-icons right">filter_list</i>
//               FILTRAR </a>
//             </div>
//             </div>`;
//   htm += '<ul><div class="row">'; // Inicia la lista y la primera fila
//   for (let i = desde; i < hasta; i++) {
//     if (ArrayDataFiltrado[i]) {
//       DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
//       if (ArrayDataFiltrado[i].BODEGA == "S") {
//         bodegaLabel = `<span class="mi-tienda">En Bodega</span>`;
//       } else {
//         bodegaLabel = `<span class="mi-tienda card-panel red darken-1">No disponible</span>`;
//       }
//       url = ` href="#"`;
//       htm += `
//         <div class="col s6 m4 l3">
//           <li>
//             <div class="card container-img">
//               <div id="envoltorio">
//                 <a ${url}>
//                   ${remateLabel}
//                   <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
//                     data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
//                   ${bodegaLabel}
//                 </a>
//                 <div class="flotante-acciones">
//                   <div class="link-flotante-acciones" style="padding-bottom: 5px;">
//                     <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
//                       <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
//                     </a>
//                     <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
//                   </div>
//                 </div>
//                 <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
//                 <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
//                 <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
//               </div>
//               <h3 class="articulo-titulo">${ArrayDataFiltrado[i].ARTICULO}</h3>
//               <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
//               <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
//                 ${precioL}</span>
//             </div>
//           </li>
//         </div>`;
//       // Cerrar la fila cada 4 elementos y abrir una nueva
//       if ((i - desde + 1) % 4 === 0 && i < hasta - 1) {
//         htm += '</div><div class="row">';
//       }
//     }
//   }
//   htm += '</div></ul>'; // Cierra la última fila y la lista
//   htm += '</div>'; // Cierra lista-articulo
//   return htm;
// }




// function mostrarResultados(desde, hasta) {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;
//   var totalRegistros = 0, tipobusqueda = "";
//   tipobusqueda = "T";
//   var totalizador = 0;
//   for (var i = 0; i < ArrayDataFiltrado.length; i++) {
//     if (
//       ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//       +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//     ) {
//       totalizador++;
//     }
//   }

//   if (totalizador !== 0) {
//     totalRegistros = ArrayDataFiltrado.length - totalizador;
//     clearFiltros = false;
//   } else {
//     totalRegistros = ArrayDataFiltrado.length;
//     clearFiltros = false;
//   }
//   let client = 0;
//   let htm = "",
//     remateLabel = "",
//     bodegaLabel = "",
//     url = "",
//     precioL = "";
//   var pre = 1;
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//         </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6 m12" >
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div></div>
//             <div class="row" id="vistabusqueda">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
//               <i class="material-icons right">list</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
//               <i class="material-icons right">filter_list</i>
//               FILTRAR </a>
//             </div>
//             </div>`;
//   htm += '<ul><div class="row">'; // Inicia la lista y la primera fila
//   for (let i = desde; i < hasta; i++) {
//     if (ArrayDataFiltrado[i]) {
//       DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
//       if (ArrayDataFiltrado[i].BODEGA == "S") {
//         bodegaLabel = `<span class="mi-tienda">En Bodega</span>`;
//       } else {
//         bodegaLabel = `<span class="mi-tienda card-panel red darken-1">No disponible</span>`;
//       }
//       url = ` href="#"`;
//       htm += `
//         <div class="col s6 m4 l3">
//           <li>
//             <div class="card container-img">
//               <div class="card-image" id="envoltorio">
//                 <a ${url}>
//                   ${remateLabel}
//                   <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
//                     data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
//                   ${bodegaLabel}
//                 </a>
//               </div>
//               <div class="card-content">
//                 <h3 class="articulo-titulo">${ArrayDataFiltrado[i].ARTICULO}</h3>
//                 <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
//                 <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
//                   ${precioL}</span>
//               </div>
//               <div class="flotante-acciones">
//                 <div class="link-flotante-acciones" style="padding-bottom: 5px;">
//                   <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
//                     <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
//                   </a>
//                   <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
//                 </div>
//               </div>
//               <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
//               <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
//               <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
//             </div>
//           </li>
//         </div>`;
//       // Cerrar la fila cada 4 elementos y abrir una nueva
//       if ((i - desde + 1) % 4 === 0 && i < hasta - 1) {
//         htm += '</div><div class="row">';
//       }
//     }
//   }
//   htm += '</div></ul>'; // Cierra la última fila y la lista
//   htm += '</div>'; // Cierra lista-articulo
//   return htm;
// }



//-----------------------------------------------------------------------------------



// function mostrarResultados(desde, hasta) {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;
//   var totalRegistros = 0, tipobusqueda = "";
//   tipobusqueda = "T";
//   var totalizador = 0;
//   for (var i = 0; i < ArrayDataFiltrado.length; i++) {
//     if (
//       ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//       +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//     ) {
//       totalizador++;
//     }
//   }

//   if (totalizador !== 0) {
//     totalRegistros = ArrayDataFiltrado.length - totalizador;
//     clearFiltros = false;
//   } else {
//     totalRegistros = ArrayDataFiltrado.length;
//     clearFiltros = false;
//   }
//   let client = 0;
//   let htm = "",
//     remateLabel = "",
//     bodegaLabel = "",
//     url = "",
//     precioL = "";
//   var pre = 1;
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//         </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6 m12" >
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div></div>
//             <div class="row" id="vistabusqueda">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
//               <i class="material-icons right">list</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
//               <i class="material-icons right">filter_list</i>
//               FILTRAR </a>
//             </div>
//             </div>`;
//   htm += '<div class="row">'; // Inicia la primera fila
//   for (let i = desde; i < hasta; i++) {
//     if (ArrayDataFiltrado[i]) {
//       DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
//       if (ArrayDataFiltrado[i].BODEGA == "S") {
//         bodegaLabel = `<span class="mi-tienda">En Bodega</span>`;
//       } else {
//         bodegaLabel = `<span class="mi-tienda card-panel red darken-1">No disponible</span>`;
//       }
//       url = ` href="#"`;
//       htm += `
//         <div class="col s6 m4 l3">         
//             <div class="container-img" style="border: 1px solid #000;">
//               <div id="envoltorio">
//                 <a ${url}>
//                   ${remateLabel}
//                   <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
//                     data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
//                   ${bodegaLabel}
//                 </a>
//                 <div class="flotante-acciones">
//                   <div class="link-flotante-acciones" style="padding-bottom: 5px;">
//                     <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
//                       <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
//                     </a>
//                     <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
//                   </div>
//                 </div>
//                 <div id="precios_lista${i}" class="closed tooltips-l degliano"></div>
//                 <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
//                 <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
//               </div>
//               <h3 class="articulo-titulo">${ArrayDataFiltrado[i].ARTICULO}</h3>
//               <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
//               <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
//                 ${precioL}</span>
//             </div>
//         </div>`;
//       // Cerrar la fila cada 4 elementos y abrir una nueva
//       if ((i - desde + 1) % 4 === 0 && i < hasta - 1) {
//         htm += '</div><div class="row">';
//       }
//     }
//   }
//   htm += '</div>'; // Cierra la última fila
//   htm += '</div>'; // Cierra lista-articulo
//   return htm;
// }


//-----------------------------------------------------------------------------------
// function mostrarResultados(desde, hasta) {
//   var totalRegistros = 0;
//   // Conteo total de registros, excluyendo rines incompletos si viewImcompletos es false
//   if (viewImcompletos) {
//     totalRegistros = ArrayDataFiltrado.length;
//   } else {
//     var totalizador = 0;
//     for (var i = 0; i < ArrayDataFiltrado.length; i++) {
//       if (
//         ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//         +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//       ) {
//         totalizador++;
//       }
//     }
//     totalRegistros = ArrayDataFiltrado.length - totalizador;
//     clearFiltros = false;
//   }

//   let htm = "",
//     bodegaLabel = "",
//     remateLabel = "",
//     url = "",
//     precioL = "";
//   var pre = 1;
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h5 class="sub-header"><b>Resultado de Búsqueda</b></h5>
//         </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6 m12">
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div></div>
//             <div class="row" id="vistabusqueda">
//             <div class="col s6">
//               <a class="btn red darken-4" href="javascript:void(0);" onclick="FiltrarModal();">
//                 <i class="material-icons right">filter_list</i>
//                 FILTRAR </a>
//             </div></div>`;
//   htm += '<ul><div class="row">'; // Inicia la lista y la primera fila
//   for (let i = desde; i < hasta; i++) {
//     if (ArrayDataFiltrado[i]) {
//       DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
//       // Etiqueta de disponibilidad en tienda
//       if (ArrayDataFiltrado[i].BODEGA == "S") {
//         bodegaLabel = '<span class="mi-tienda">En Tienda</span>';
//       } else {
//         bodegaLabel = "";
//       }
//       // URL y precio
//       if (ArrayDataFiltrado[i].PRECIOLISTA != null) {
//         url = ` href="detalle.html?art=${ArrayDataFiltrado[i].ARTICULO}"`;
//         pre = `${parseFloat(ArrayDataFiltrado[i].PRECIOLISTA).toFixed(2)}`;
//       } else {
//         pre = parseFloat(0).toFixed(2);
//         url = ` onclick="error_precio();"`;
//       }
//       // Etiquetas de descuento o remate
//       if (
//         ArrayDataFiltrado[i].PRECIO_DESCUENTO !== ".00" &&
//         ArrayDataFiltrado[i].PRECIO_DESCUENTO !== null &&
//         ArrayDataFiltrado[i].PRECIO_DESCUENTO !== undefined
//       ) {
//         remateLabel = '<div class="descuentos new-top-left">Descuento</div>';
//         precioL = `<span class="black-text" style="font-size: 12px;font-weight: bold;">Precio Descuento: </span><span style="color: #c00; background-color: #fff; font-size: 15px;"><br><strong>B/. ${parseFloat(
//           ArrayDataFiltrado[i].PRECIO_DESCUENTO
//         ).toFixed(
//           2
//         )}</strong></span> <span style="color: #000; background-color: #fff; font-size: 13px;">B/. <strike> ${pre}</strike></span>`;
//       } else if (ArrayDataFiltrado[i].REMATE == "R") {
//         remateLabel = '<div class="remates new-top-left">Remate </div>';
//         precioL = `<span class="black-text" style="font-size: 12px;font-weight: bold;">Precio Remate: </span><span style="color: #c00; background-color: #fff; font-size: 15px;"><br><strong>B/. ${parseFloat(
//           ArrayDataFiltrado[i].PRECIOREMATE
//         ).toFixed(
//           2
//         )}</strong></span> <span style="color: #000; background-color: #fff; font-size: 13px;">B/. <strike> ${pre}</strike></span>`;
//       } else {
//         remateLabel = "";
//         precioL = `<span style="font-size: 12px; color: #001; font-weight: bold!important;">Precio <br>Referencia:</span> B/.<strong>${pre}</strong></span>`;
//       }

//       // Filtrado de rines incompletos
//       if (
//         !viewImcompletos &&
//         ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//         +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//       ) {
//         continue; // No muestra rines incompletos
//       }

//       htm += `
//         <div class="col s6 m4 l3">
//           <li>
//             <div class="container-img">
//               <div id="envoltorio">
//                 <a ${url}>
//                   ${remateLabel}
//                   <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
//                     data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
//                   ${bodegaLabel}
//                 </a>
//                 <div class="flotante-acciones">
//                   <div class="link-flotante-acciones">
//                     <a id="dropbtn${i}" class="dropbtn2x" onclick="precioArticuloVende('${ArrayDataFiltrado[i].ARTICULO}','${i}')">
//                       <i class="left material-icons black-text" style="font-size: 24px;">monetization_on</i>
//                     </a>
//                   </div>
//                   <div class="link-flotante-acciones" style="padding-bottom: 5px;">
//                     <a id="dropbtn${i}" class="dropbtn2x" onclick="precioArticuloVende2('${ArrayDataFiltrado[i].ARTICULO}',2${i})">
//                       <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
//                     </a>
//                     <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
//                   </div>
//                 </div>
//                 <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
//                 <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
//                 <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
//               </div>
//               <h3 class="articulo-titulo">${ArrayDataFiltrado[i].ARTICULO}</h3>
//               <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
//               <span style="color: #000; font-size: 15px; line-height: 65%;">
//                 ${precioL}</span>
//             </div>
//           </li>
//         </div>`;
//       // Cerrar la fila cada 4 elementos y abrir una nueva
//       if ((i - desde + 1) % 4 === 0 && i < hasta - 1) {
//         htm += '</div><div class="row">';
//       }
//     }
//   }
//   htm += '</div></ul></div>'; // Cierra la última fila, lista y lista-articulo
//   return htm;
// }

// function mostrarResultados(desde, hasta) {
//   var totalRegistros = 0;
//   // Conteo total de registros, excluyendo rines incompletos si viewImcompletos es false
//   if (viewImcompletos) {
//     totalRegistros = ArrayDataFiltrado.length;
//   } else {
//     var totalizador = 0;
//     for (var i = 0; i < ArrayDataFiltrado.length; i++) {
//       if (
//         ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//         +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//       ) {
//         totalizador++;
//       }
//     }
//     totalRegistros = ArrayDataFiltrado.length - totalizador;
//     clearFiltros = false;
//   }

//   let htm = "",
//     bodegaLabel = "",
//     url = "";
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h5 class="sub-header"><b>Resultado de Búsqueda</b></h5>
//         </div>`;
//         htm += `<div class="row" id="totalregistros">
//         <div class="col s6 m12" >
//           <span>Total de Registros: </span>
//           <span>${totalRegistros}</span>
//         </div></div>
//         <div class="row" id="vistabusqueda">
//         <div class="col s6">
//             <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaLista();">
//           <i class="material-icons right">list</i>
//           VISTA </a>
//         </div>
//         <div class="col s6">
//           <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
//           <i class="material-icons right">filter_list</i>
//           FILTRAR </a>
//         </div>
//         </div>`;
//   htm += '<ul><div class="row">'; // Inicia la lista y la primera fila
//   for (let i = desde; i < hasta; i++) {
//     if (ArrayDataFiltrado[i]) {
//       DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
//       // Etiqueta de disponibilidad en tienda
//       if (ArrayDataFiltrado[i].BODEGA == "S") {
//         bodegaLabel = '<span class="mi-tienda">En Tienda</span>';
//       } else {
//         bodegaLabel = "";
//       }
//       // URL
//       url = ` href="detalle.html?art=${ArrayDataFiltrado[i].ARTICULO}"`;

//       // Filtrado de rines incompletos
//       if (
//         !viewImcompletos &&
//         ArrayDataFiltrado[i].ID_CLASE == "1055" &&
//         +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
//       ) {
//         continue; // No muestra rines incompletos
//       }

//       htm += `
//         <div class="col s6 m4 l3">
//           <li>
//             <div class="container-img">
//               <div id="envoltorio">
//                 <a ${url}>
//                   <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
//                     data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
//                   ${bodegaLabel}
//                 </a>
//                 <div class="flotante-acciones">
//                   <div class="link-flotante-acciones" style="padding-bottom: 5px;">
//                     <a id="dropbtn${i}" class="dropbtn2x" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')">
//                        <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
//                      </a>
//                     <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
//                   </div>
//                 </div>
//                 <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
//                 <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
//               </div>
//               <h3 class="articulo-titulo">${ArrayDataFiltrado[i].ARTICULO}</h3>
//               <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
//             </div>
//           </li>
//         </div>`;
//       // Cerrar la fila cada 4 elementos y abrir una nueva
//       if ((i - desde + 1) % 4 === 0 && i < hasta - 1) {
//         htm += '</div><div class="row">';
//       }
//     }
//   }
//   htm += '</div></ul></div>'; // Cierra la última fila, lista y lista-articulo
//   return htm;
// }



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
// function ingresarCliente(cliente, nombre) {
//   let subcadena = "";
//   //traer nombre/razon social de localStorage
//   var infopedido = JSON.parse(localStorage.getItem("cartCLSA"));
//   if (infopedido && infopedido[0] && infopedido[0].CLIENTE) {
//     // El valor de infopedido[0].CLIENTE no es nulo
//     // Realiza aquí la acción que deseas hacer con este valor
//     razonPedido = infopedido[0].CLIENTE;
//     subcadena = razonPedido.substring(razonPedido.indexOf(" ") + 1);
//     //console.log("RAZON PEDIDO:");
//     //console.log(subcadena.trim());
//   }

//   let usuario = document.getElementById("hUsuario").value;
//   cliente = cliente.replace("&", "%26");
//   //console.log(cliente + "-" + nombre);
//   //-------------------datos de cliente de tabla cliente-------------------
//   const params = "?user=" + usuario + "&cliente=" + cliente + "&opcion=2";
//   //console.log("Parametros de usuario: " + params);
//   fetch(env.API_URL + "cliente/1" + params, myInit)
//     .then((response) => response.json())
//     .catch((error) => console.error("Error:", error))
//     .then((result) => {
//       if (result.msg === "SUCCESS") {
//         if (result.cliente.length != 0) {
//           ClientData.datos = result.cliente;
//           //guarda el permiso para cambiar precio de articulos en carrito
//           sessionStorage.setItem(
//             "cambPrecio",
//             ClientData.datos[0].MODIF_PRECIO
//           );
//           //insertar razon social aqui
//           if (infopedido && infopedido[0] && infopedido[0].CLIENTE) {
//             ClientData.datos[0].NOMBRE = subcadena.trim();
//           }

//           //console.log("DATOS CLIENTE: ");
//           //console.log(ClientData.datos);
//           if (cartCLSAObj.cartCLSA.length > 0) {
//             ClientData.datos[0].CONDICION_PAGO =
//               cartCLSAObj.cartCLSA[0].condicion_pago;
//           }
//         }
//         document.getElementById("carga").innerHTML = "";
//       }
//     });
//   //-------------------fin datos de cliente de tabla cliente-------------------
//   const data = "?user=" + usuario + "&cliente=" + cliente;
//   fetch(env.API_URL + "cliente/2" + data, myInit)
//     .then((response) => response.json())
//     .catch((error) => console.error("Error:", error))
//     .then((result) => {
//       if (result.msg === "SUCCESS") {
//         if (result.cuenta.length != 0) {
//           window.setTimeout(function () {
//             ClientData.datos[0].CUENTA = [];
//             ClientData.datos[0].CUENTA.push(result.cuenta);
//             ClientData.guardarCliente();
//           }, 1000);
//           const Toast = Swal.mixin({
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//             timer: 2000,
//             timerProgressBar: true,
//             onOpen: (toast) => {
//               toast.addEventListener("mouseenter", Swal.stopTimer);
//               toast.addEventListener("mouseleave", Swal.resumeTimer);
//             },
//           });
//           Toast.fire({
//             icon: "success",
//             title: "Agregando el cliente seleccionado",
//           }).then(function () {
//             Swal.fire({
//               icon: "success",
//               title: "Agregado correctamente",
//               text: "Su cliente fue agregado.",
//               confirmButtonColor: "#000",
//             }).then(function () {
//               window.setTimeout(function () {
//                 window.location.href = "home.html";
//               }, 1000);
//             });
//           });
//         }
//         document.getElementById("carga").innerHTML = "";
//       }
//     });
// }

//---------------------------------MODAL LATERAL-------------------------------------
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
          //console.log("Get bodegas no cargadas, verifique la conexión");
        }
      });
  });
  //---------------------------------------------------------------------------------
});
/////////////////////////////////////// LOGOUT //////////////////////////------------

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
}

//------------------Mostrar el loading antes de enviar la solicitud-------------------
function mostrarLoading() {
  $('.loading').show();
  document.querySelector('.loading').style.display = 'block';
}

//---------------FUNCION PAGINADOR PARA BUSQUEDA PEDIDOS/COTIZACIONES------------------

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
//////////////////////////////////////////////////////////////////////////////////////

// function paginadorTablas(nPag, pag, dynamicFunction) {
//   //console.log("desde: " + (pag - 1) * xPag + " hasta: " + pag * xPag);
//   //console.log("nPag:" + nPag + "- pag:" + pag);
//   //MUESTRA LA CANTIDAD DE PAGINA
//   let selected = "";
//   sel = `<select class="browser-default" onchange="${dynamicFunction}(${nPag}, this.value)">
//         <option value="" disabled>Páginas</option>`;
//   for (var i = 0; i < nPag; i++) {
//     if (i + 1 == pag) {
//       selected = "selected";
//     } else {
//       selected = "";
//     }
//     if (nPag != 1) {
//       sel += `<option  value="${parseInt(i) + 1}" ${selected}> ${parseInt(i) + 1
//         }</option>`;
//     }
//   }
//   sel += `</select>`;

//   if (pag <= 1) btnAtras = `<a style="color:#aba7a7;">❮ Anterior</a>`;
//   else
//     btnAtras = `<a onclick="${dynamicFunction}(${nPag} , ${parseInt(pag) - 1
//       });">❮ Anterior</a>`;

//   if (pag >= nPag) btnSig = `<a style="color: #aba7a7;"> Siguiente ❯ </a>`;
//   else
//     btnSig = `<a onclick="${dynamicFunction}(${nPag},${parseInt(pag) + 1
//       })">Siguiente ❯</a>`;

//   return `
//         <div id="paginador">
//         <div class="row">
//           <div class="col s4"></div>
//           <div class="col s4" style="text-align: center">${pag}/${nPag}</div>
//           <div class="col s4"></div>
//         </div>
//         <div class="row" style="width:fit-content !important;">
//             <div class="col s4" id="btnAtras" style="width:fit-content !important;">
//               ${btnAtras}
//             </div>
//           <div class="col s4">
//             ${sel}
//           </div>
//           <div class="col s4" id="btnSig" style="width:fit-content !important;">
//             ${btnSig}
//           </div>
//         </div>
//       </div><br>`;
// }

function paginadorTablas(nPag, pag, dynamicFunction) {
  // Generar el select con las páginas
  let selected = "";
  let sel = `<select class="browser-default paginador-select" onchange="${dynamicFunction}(${nPag}, this.value)">
              <option value="" disabled>Páginas</option>`;
  for (let i = 0; i < nPag; i++) {
    selected = i + 1 === pag ? "selected" : "";
    if (nPag !== 1) {
      sel += `<option value="${i + 1}" ${selected}>${i + 1}</option>`;
    }
  }
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

//---------------------------------------------------------------------------
function cambiarVistaMosaico() {
  mostrarResultadosBusqueda(4, 1);
}

function mostrarResultadosVistaLista(nPag, pag) {
  let htm = "";
  let desde = (pag - 1) * xPag;
  let hasta = pag * xPag;
 
  resultadosVistaLista(desde, hasta);
  htm += paginadorTablas(nPag, pag, 'mostrarResultadosVistaLista');
  document.getElementById("resultadoPaginador").innerHTML = htm;
}

function resultadosVistaLista(desde, hasta) {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  let bodegaCod = bodega[0].BODEGA;
  let totalRegistros = 0, htm = "";
  totalRegistros = ArrayDataFiltrado.length;
  let nPag = Math.ceil(totalRegistros / xPag);

  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
          <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
          </div>`;
  htm += `<div class="row" id="totalregistros">
            <div class="col s6">
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
      htm += `<td class="sticky-column text-align:center"><h5 style="font-size:12px; text-align:left; color:orangered;">${ArrayDataFiltrado[i].ARTICULO}</h5><h6 style="font-size: 10px; text-align: left;">${ArrayDataFiltrado[i].DESCRIPCION}</td>
              <td>${ArrayDataFiltrado[i].CODIGO_BARRAS_INVT ? ArrayDataFiltrado[i].CODIGO_BARRAS_INVT : ''}</td>
              <td>${Math.floor(ArrayDataFiltrado[i].TOTAL_CANTIDAD_BODEGA)}</td>
              <td>
                <i class="material-symbols-outlined" onclick="mostrarImagen('${ArrayDataFiltrado[i].ARTICULO}', '${ArrayDataFiltrado[i].DESCRIPCION}')">visibility</i>              
                <img src="./img/icon/inventario.svg" width="22" height="22" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')" tabindex="1">
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

//-----------------------------------------------------------------------------------------------------------------------
// function cambiarVistaLista() {
//   const bodega = JSON.parse(sessionStorage.getItem("bodega"));
//   let bodegaCod = bodega[0].BODEGA;
//   let totalRegistros = 0, htm = "";
//   totalRegistros = ArrayDataFiltrado.length;
//   let nPag = Math.ceil(totalRegistros / xPag);
 
//   htm += '<div id="lista-articulo">';
//   htm += `<div class="col s12">
//           <h2 style="text-align:center ; text-transform: uppercase;">Resultados de la Búsqueda</h2>
//           </div>`;
//   htm += `<div class="row" id="totalregistros">
//             <div class="col s6">
//               <span>Total de Registros: </span>
//               <span>${totalRegistros}</span>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col s6">
//                 <a style="background: #535162 !important;" class="btn browser-default" href="javascript:void(0);" onclick="cambiarVistaMosaico();">
//               <i class="material-icons right">apps</i>
//               VISTA </a>
//             </div>
//             <div class="col s6">
//               <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal();">
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

//   for (let i = 0; i < ArrayDataFiltrado.length; i++) {
//     if (ArrayDataFiltrado[i]) {
//       htm += `<tr>`;
//       htm += `<td class="sticky-column text-align:center"><h5 style="font-size:12px; text-align:left; color:orangered;">${ArrayDataFiltrado[i].ARTICULO}</h5><h6 style="font-size: 10px; text-align: left;">${ArrayDataFiltrado[i].DESCRIPCION}</td>
//               <td>${ArrayDataFiltrado[i].CODIGO_BARRAS_INVT ? ArrayDataFiltrado[i].CODIGO_BARRAS_INVT : ''}</td>
//               <td>${Math.floor(ArrayDataFiltrado[i].TOTAL_CANTIDAD_BODEGA)}</td>
//               <td>
//                 <i class="material-symbols-outlined" onclick="mostrarImagen('${ArrayDataFiltrado[i].ARTICULO}', '${ArrayDataFiltrado[i].DESCRIPCION}')">visibility</i>              
//                 <img src="./img/icon/inventario.svg" width="22" height="22" onclick="mostrarExistencias('${ArrayDataFiltrado[i].ARTICULO}')" tabindex="1">
//               </td>`; // Puedes poner aquí el botón de acción que desees
//       htm += `</tr>`;
//     }
//   }


//   htm += `</tbody>
//           </table>`;

//   htm += `<div id="resultadoPaginador">`;
//   htm += paginadorTablas(nPag, 1, 'mostrarResultadosVistaLista');
//   htm += `</div>`;

//   htm += "</div>";

//   document.getElementById("resultadoBusqueda").innerHTML = htm;
//   $("html, body").animate(
//     {
//       scrollTop: $("#resultadoBusqueda").offset().top - 140,
//     },
//     1000
//   );
// }

//funcion que muestra las imagenes en el swall.fire

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
            <div class="col s6">
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
      htm += `<td class="sticky-column text-align:center"><h5 style="font-size:12px; text-align:left; color:orangered;">${ArrayDataFiltrado[i].ARTICULO}</h5><h6 style="font-size: 10px; text-align: left;">${ArrayDataFiltrado[i].DESCRIPCION}</td>
              <td>${ArrayDataFiltrado[i].CODIGO_BARRAS_INVT ? ArrayDataFiltrado[i].CODIGO_BARRAS_INVT : ''}</td>
              <td>${Math.floor(ArrayDataFiltrado[i].TOTAL_CANTIDAD_BODEGA)}</td>
              <td>
                <i class="material-symbols-outlined" onclick="mostrarImagen('${encodeURIComponent(ArrayDataFiltrado[i].ARTICULO)}', '${ArrayDataFiltrado[i].DESCRIPCION}')">visibility</i>              
                <img src="./img/icon/inventario.svg" width="22" height="22" onclick="mostrarExistencias('${encodeURIComponent(ArrayDataFiltrado[i].ARTICULO)}')" tabindex="1">
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

function mostrarImagen(codigo, descripcion) {
  let code;
  try {
    code = decodeURIComponent(codigo); // Decodificar para el título
  } catch (e) {
    console.error("Error decodificando código:", e);
    code = codigo; // Usar codificado como respaldo
  }

  Swal.fire({
    confirmButtonColor: "#28a745",
    html: `
      <div>
        <h3>${code}</h3>
        <img src="${env.API_IMAGE}/${codigo}" alt="Imagen" width="200" height="200">
        <p>${descripcion}</p>
      </div>
    `,
    customClass: {
      title: 'img-tamaño-articulo'
    }
  });
}

// function mostrarImagen(codigo, descripcion) {
// // aqui decodificamos a codigo
// const code = decodeURIComponent(codigo);
//   Swal.fire({
//     confirmButtonColor: "#28a745",
//     html: `
//                       <div>
//                           <h3>${codigo}</h3>
//                           <!-- <img src="//200.124.12.146:8097/index.php/image/displayimage/${code}" alt="Imagen" width="200" height="200">-->
//                           <img src="${env.API_IMAGE}/${codigo}" alt="Imagen" width="200" height="200">
//                           <p>${descripcion}</p>
//                       </div>
//                   `,
//     customClass: {
//       title: 'img-tamaño-articulo'
//     }

//   });
// }

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

// //muestra las existencias en un swall.fire
// function mostrarExistencias(p_Articulo) {
//    let code;
//   try {
//     code = decodeURIComponent(p_Articulo); // Decodificar para el título
//   } catch (e) {
//     console.error("Error decodificando código:", e);
//     code = p_Articulo; // Usar codificado como respaldo
//   }

//   // Mostrar el loading antes de abrir la ventana emergente
//   Swal.fire({
//     title: "Cargando Registros....",
//     allowOutsideClick: false,
//     showConfirmButton: false,
//     onBeforeOpen: function () {
//       Swal.showLoading();
//     }
//   });

//   // Ruta del API
//   const apiUrl = env.API_URL + "wmsexistenciaarticulosporbodega/1";

//   // Parámetros de la solicitud
//   // const params = `?p_Articulo=${art}`;
//   const params = `?p_Articulo=${code}`;

//   fetch(apiUrl + params, {
//     method: 'GET',
//     cache: 'no-cache',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     }
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('La solicitud no fue exitosa');
//       }
//       return response.json();
//     })
//     .then(data => {
//       var existenciaArticulos = data.reporte; // Accede a la propiedad 'reporte'
//       var tablaHtml = '<table style="border-collapse: collapse; width: 100%;">' +
//         '<thead>' +
//         '<tr style="border-bottom: 1px solid #ddd;">' +
//         '<th style="text-align: left; padding: 8px;"> Bodega </th>' +
//         '<th style="text-align: center; padding: 8px;"> Cantidad </th>' +
//         '</tr>' +
//         '</thead>' +
//         '<tbody>';

//       existenciaArticulos.forEach(articulo => {
//         tablaHtml += '<tr style="border-bottom: 1px solid #ddd;">' +
//           '<td style="text-align: left; padding: 8px;">' + articulo.NOMBRE + '</td>' +
//           '<td style="text-align: center; padding: 8px;">' + parseFloat(articulo.CANTIDAD).toFixed(2) + '</td>' +
//           '</tr>';
//       });

//       tablaHtml += '</tbody>' + '</table>';

//       Swal.fire({
//         title: "Articulo: " + p_Articulo,
//         html: tablaHtml,
//         confirmButtonText: "Aceptar",
//         confirmButtonColor: "#55b251"
//       });
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       Swal.fire({
//         title: "Error",
//         text: "Ocurrió un error al obtener los registros de existencia",
//         icon: "error"
//       });
//     });
// }

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

