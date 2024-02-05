var ArrayData = new Array();
var ArrayDataFiltrado = new Array();
var ArrayPrecio = new Array();
// var ArrayITBMS = new Array();
var promo = "";
var viewImcompletos = false;
var clearFiltros = false;

const xPag = 30;

var itemsToDelete = "";
var itemsToDelete_NoProm = "";
var promoToDelete = "";
// let acumToDelete = [];
let acumToDelete = JSON.parse(sessionStorage.getItem("itemsToDelete"));

// const cartCLSAObj = new carCLSAWEB();
// if (localStorage.getItem("cartCLSA")) {
//   cartCLSAObj.verificaPromoActiva();
//   cartCLSAObj.refrescarCarrito();
// }

document.addEventListener("DOMContentLoaded", function () {
  //------------------------------------------------
  let elems = document.querySelectorAll(".fixed-action-btn");
  let instances = M.FloatingActionButton.init(elems, {
    direction: "left",
    hoverEnabled: false,
  });
  //--------------------------------------------------
  validate_login();
  existeBodega();
  verificarCliente();
  //------------------------------------------------
  //---------------------------------------------------------------------------------
});
//-----------------------------------------------------------------------------------
function validate_login() {
  const tokens = sessionStorage.getItem("tokens");
  if (tokens) {
    const usuario = existe_Usuario();
    const bodega = JSON.parse(sessionStorage.getItem("bodega"));
    const cliente = existe_Cliente();
    console.log(usuario);
    document.getElementById("usuario").innerHTML = usuario;
    document.getElementById("hUsuario").value = usuario;
  } else {
    window.location = "index.html";
  }
}
//--------------------------------------------------------------------------------------
function existeBodega() {
  const bodega = JSON.parse(sessionStorage.getItem("bodega"));
  if (bodega) {
    document.getElementById("bodega-sucursal").innerHTML = bodega[0].NOMBRE;
    document.getElementById("bodega").value = bodega[0].BODEGA;
    // document.getElementById("icon-cliente").setAttribute("href", "#modal1");
  }
}
//--------------------------------------------------------------------------------------
function verificarCliente() {
  const cliente = existe_Cliente();
  if (cliente.length > 0) {
    // document.getElementById("iconCard").style.display = "block";

    document.getElementById("icon-user").classList.remove("icon-usuario");
    document.getElementById("icon-user").classList.add("icon-usuario-activo");
  } else {

  }
}
//--------------------------------------------------------------------------------------
function filtrosModal() {
  let htm = "", IDCategoria = "1055";
  let usuario = document.getElementById("hUsuario").value;
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.open();
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
            <a onclick="Filtrar(${IDCategoria});" class="btn waves-light green darken-4 expand-car">
              <i class="material-icons left">check</i>
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
  //console.log(htm);
  document.getElementById("divFiltro").innerHTML = htm;
  document.getElementById("filtromarcas").innerHTML = MostrarMarcas();
  $(".collapsible").collapsible();
}

//-----------------------------------------------------------------------------------
$("#articulo").on("keypress", function (e) {
  if (e.keyCode == 13 || e.keyCode == 9) {
    e.preventDefault();
    busquedaGeneral("W", "");
  }
});
//-----------------------------------------------------------------------------------
$("#txtRuc").on("keypress", function (e) {
  if (e.keyCode == 13 || e.keyCode == 9) {
    e.preventDefault();
    btnBusquedaCliente();
  }
});
//-----------------------------------------------------------------------------------
// const inputCliente = document.getElementById("inputCliente");
// console.log(inputCliente);
// inputCliente.addEventListener("click", (event) => {
//   console.log("Double-click detected");
//   // Double-click detected
// });
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
function showClientResult(nPag, pag, IDCategoria, ord) {
  let htm = "";
  // htm += paginador(nPag, pag, IDCategoria, ord);
  htm += paginadorServicios(nPag, pag, IDCategoria);
  document.getElementById("BusquedaResultado").innerHTML = htm;
}

//-----------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------


//--------------------funcion mostrar ResultadosBusquedaPedidos------------------
//--------------------funcion mostrar ResultadosBusquedaPedidos--------------------


//------------------------------------------------------------------------------------
//           FUNCION QUE VALIDA SI EXISTE UN CLIENTE SELECCIONADO
//------------------------------------------------------------------------------------
function existe_Cliente() {
  const client = sessionStorage.getItem("cliente");
  // console.log("ESTE ES EL CLIENTE: " + client);
  return JSON.parse(client) || [];
}
//-----------------------------------------------------------------------------------
function existe_Usuario() {
  const usuario = sessionStorage.getItem("user");
  return JSON.parse(usuario) || [];
}
//-----------------------------------------------------------------------------------
function existe_DatosCliente() {
  const datos = localStorage.getItem("clientedatos");
  return JSON.parse(datos) || [];
}

//-----------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
function expand(id) {
  let ids = document.getElementById(id);
  if (ids.style.display === "none") ids.style.display = "table-row-group";
  else ids.style.display = "none";
}



//-----------------------------------------------------------------------------------
function CerrarModal(key) {
  console.log(key);
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
function cargarPedidos(pedido, IDCliente, NCliente) {
  let usuario = document.getElementById("hUsuario").value;
  let fechaIni = document.getElementById("fecha_ini").value;
  let fechaFin = document.getElementById("fecha_fin").value;
  let bodega = document.getElementById("bodega").value;
  const params =
    "?pedido=" +
    pedido +
    "&user=" +
    usuario +
    "&fechafin=" +
    fechaFin +
    "&fechaini=" +
    fechaIni +
    "&bodega=" +
    bodega;
  // console.log("ESTOS SON LOS PARAMETROS QUE SE ENVIAN A PEDIDOS");
  // console.log(params);
  fetch(env.API_URL + "pedidos/D" + params, myInit)
    .then((response) => response.json())
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.pedidos.length != 0) {
          //----guarda los articulos en cartCLSA------
          console.log(result.pedidos[0].Observacion);
          localStorage.setItem("cartCLSA", JSON.stringify(result.pedidos));
          // Variable to store the initial cart item count
          sessionStorage.setItem(
            "cartItemCount",
            result.pedidos[0].items.length
          );
          sessionStorage.setItem("initObserv", result.pedidos[0].Observacion);
          sessionStorage.setItem("cliente", JSON.stringify(IDCliente));
          sessionStorage.setItem("Ncliente", JSON.stringify(NCliente));
          sessionStorage.setItem("_UpdateOrder", JSON.stringify("1"));
          localStorage.setItem("cargarCotizacion", "TRUE");

          let imprimir = JSON.parse(localStorage.getItem("cartCLSA"));
          // let cantInicial = localStorage.getItem("cartItemCount");
          console.log("PEDIDO DESDE CARGAR PEDIDO");
          console.log(imprimir);
          // localStorage.removeItem("cartItemCount");

          console.log("RESULTADOS DE PEDIDO");
          console.log(result.pedidos);

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "Agregando el pedido seleccionado al carrito",
          }).then(function () {
            Swal.fire({
              icon: "success",
              title: "Agregado correctamente",
              text: "Su pedido fue agregado.",
              confirmButtonColor: "#000",
            });
          });
          document.getElementById("iconCard").style.display = "block";
          document.getElementById("icon-user").classList.remove("icon-usuario");
          document
            .getElementById("icon-user")
            .classList.add("icon-usuario-activo");
          //funcion que agrega los datos del cliente
          ingresarCliente(IDCliente, NCliente);
          //--------llamado funcion refrescarCarrito en pruebaClass.js---------
          cartCLSAObj.refrescarCarrito();
          console.log("Ya ejecuto refrescarCarrito");
        }
        document.getElementById("carga").innerHTML = "";
      } else {
        console.log("No se cargo los modelos, verifique la conexión");
      }
    });
}
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
//-----------------------------------------------------------------------------------
function MostrarRinesIncompletos() {
  let cant = 0;
  for (const item of ArrayData) {
    if (item.CANT_DISPONIBLE <= 3 && item.ID_CLASE == "1055") {
      cant++;
    }
  }
  return cant;
}
//-----------------------------------------------------------------------------------
function MostrarIncompletos() {
  let cant = 0;
  for (const item of ArrayData) {
    if (item.CANT_DISPONIBLE <= 3) {
      cant++;
    }
  }
  return cant;
}
//-----------------------------------------------------------------------------------
function MostrarMarcas() {
  const result = [];
  const map = new Map();
  for (const item of ArrayData) {
    if (!map.has(item.MARCA)) {
      map.set(item.MARCA, true); // set any value to Map
      result.push({
        VALOR: item.MARCA,
        DESCRIPCION: item.MARCA,
      });
    }
  }
  marcaHTML = mostrarFiltro(result, "txtMarca");
  return marcaHTML;
}
//-----------------------------------------------------------------------------------
function MostrarAncho() {
  const result = [];
  const map = new Map();
  for (const item of ArrayData) {
    if (!map.has(item.ANCHOV)) {
      map.set(item.ANCHOV, true); // set any value to Map
      result.push({
        VALOR: item.ANCHO,
        DESCRIPCION: item.ANCHOV,
      });
    }
  }
  anchoHTML = mostrarFiltro(result, "txtAncho");
  return anchoHTML;
}
//-----------------------------------------------------------------------------------
function MostrarCenterB() {
  const result = [];
  const map = new Map();
  for (const item of ArrayData) {
    if (!map.has(item.CENTERBORE)) {
      map.set(item.CENTERBORE, true); // set any value to Map
      result.push({
        VALOR: item.CB,
        DESCRIPCION: item.CENTERBORE,
      });
    }
  }
  centerHTML = mostrarFiltro(result, "txtCenter");
  return centerHTML;
}
//-----------------------------------------------------------------------------------
function MostrarOffset() {
  const result = [];
  const map = new Map();
  for (const item of ArrayData) {
    if (!map.has(item.OFFSET)) {
      map.set(item.OFFSET, true); // set any value to Map
      result.push({
        VALOR: item.ET,
        DESCRIPCION: item.OFFSET,
      });
    }
  }
  offsetHTML = mostrarFiltro(result, "txtOffset");
  return offsetHTML;
}
//-----------------------------------------------------------------------------------
function mostrarFiltro(data, id) {
  data = ordenarDescripcion(data);
  var htm = "";
  var i = parseInt(1);
  if (data.length > 0) {
    data.forEach(function (key, index) {
      if (key.VALOR != null && key.DESCRIPCION != null) {
        htm += `<label>
                  <input type="checkbox" value="${key.VALOR
          }" name="${id}[]" id="${id + i
          }"  onchange="getFiltro('${id}','${id + i}');">
                  <span>${key.DESCRIPCION}</span>
                </label>
                <br>`;
        i = i + 1;
      }
    });
    return htm;
  } else return "<label >Filtro no existe</label>";
}
//-----------------------------------------------------------------------------------
function getFiltro(id, txtInput) {
  let valorMH = "",
    valorAH = "",
    valorCBH = "",
    valorETH = "";
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
      console.log(marcaH);
      if (marcaH.length > 0) {
        valorMH += marcaH + "," + marcaID;
      } else {
        valorMH += marcaID;
      }
      $("#txtMarcasV").val(valorMH);
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
  //-------------------Ancho-------------------------------------
  console.log(id);
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
//-----------------------------------------------------------------------------------
function Filtrar(IDCategoria, seccion) {
  let pag = 1;
  idCat = document.getElementById("txtCategoria").value;
  let elem = document.getElementById("modalFiltro");
  let instance = M.Modal.getInstance(elem);
  instance.close();
  let r = $("#rematetxt").is(":checked");
  let i = $("#incompletotxt").is(":checked");
  console.log("Valor de i: " + i);
  // console.log(ArrayData);
  let marca = document.getElementById("txtMarcasV").value;
  let filtradoPor = new Array();

  if (r == true) {
    remate = new Array("R");
  } else remate = "";
  if (i == true) {
    incompleto = new Array("I");
  } else incompleto = "";
  if (marca.length > 0) {
    marcasArray = marca.split(",");
  } else {
    marcasArray = "";
  }
  switch (IDCategoria) {
    case 1055:
      // console.log(IDCategoria);
      let ancho = document.getElementById("txtAnchosV").value;
      let cb = document.getElementById("txtCBV").value;
      let et = document.getElementById("txtETV").value;
      console.log(ancho);
      if (ancho.length > 0) {
        anchosArray = ancho.split(",");
      } else {
        anchosArray = "";
      }
      if (cb.length > 0) {
        cbArray = cb.split(",");
      } else {
        cbArray = "";
      }
      if (et.length > 0) {
        etArray = et.split(",");
      } else {
        etArray = "";
      }
      filtradoPor = {
        MARCA: marcasArray,
        ANCHO: anchosArray,
        CB: cbArray,
        ET: etArray,
        REMATE: remate,
        INCOMPLETO: incompleto,
      };
      console.log(filtradoPor);
      if (filtradoPor.MARCA === "") {
        delete filtradoPor.MARCA;
      }
      if (filtradoPor.ANCHO === "") {
        delete filtradoPor.ANCHO;
      }
      if (filtradoPor.CB === "") {
        delete filtradoPor.CB;
      }
      if (filtradoPor.ET === "") {
        delete filtradoPor.ET;
      }
      if (filtradoPor.REMATE === "") {
        delete filtradoPor.REMATE;
      }
      if (filtradoPor.INCOMPLETO === "") {
        delete filtradoPor.INCOMPLETO;
      }
      break;
    //Filtrado Default para las otras categorias
    default:
      filtradoPor = {
        MARCA: marcasArray,
        REMATE: remate,
        INCOMPLETO: incompleto,
      };
      // console.log("FILTRADO POR:");
      // console.log(filtradoPor);

      //elimina lo que no se usa de filtradoPor
      if (filtradoPor.MARCA === "") {
        delete filtradoPor.MARCA;
      }
      if (filtradoPor.REMATE === "") {
        delete filtradoPor.REMATE;
      }
      if (filtradoPor.INCOMPLETO === "") {
        delete filtradoPor.INCOMPLETO;
      }
      break;
  }
  ArrayDataFiltrado = getFiltrarResultado(filtradoPor);
  if (
    ArrayDataFiltrado.length > 0 &&
    filtradoPor.INCOMPLETO == "I" &&
    clearFiltros == false
  ) {
    viewImcompletos = true;
  }
  console.log(ArrayDataFiltrado);
  let totales = ArrayDataFiltrado.length;
  nPag = Math.ceil(totales / xPag);
  if (totales > 0) {
    console.log(IDCategoria + "-" + seccion);
    if (IDCategoria == "1030" && seccion != 0) {
      if (seccion == 1) {
        mostrarResultadosFiltrosReferencia(nPag, pag, idCat);
        console.log("Esta pasando por aqui");
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
  //console.log(ArrayDataFiltrado);
  //ArrayData;
}
//-----------------------------------------------------------------------------------
function getFiltrarResultado(filtradoPor) {
  console.log("Estas pasando por getFiltrarResultado");
  console.log(ArrayData);
  console.log(filtradoPor);
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
//-----------------------------------------------------------------------------------
function LimpiarFiltro(IDCategoria) {
  Swal.fire({
    title: "Deseas limpiar toda la información!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      $("#txtMarcaV").val("");
      $("#txtAnchoV").val("");
      $("#txtCBV").val("");
      $("#txtETV").val("");
      $("#txtRemates").prop("checked", false);
      $("#txtIncompletos").prop("checked", false);
      $("#txtRemates").prop("checked", false);
      $("input[type='checkbox']").prop("checked", false);
      // $("#txtRemates").checkboxradio("refresh");
      // $("#txtIncompletos").checkboxradio("refresh");
      // $("input[type='checkbox']").checkboxradio("refresh");
      clearFiltros = true;
      viewImcompletos = false;
      Filtrar(IDCategoria);
    }
  });
}
//-----------------------------------------------------------------------------------
function detalleFactura(tipoDocumento, stock) {
  let bodega = document.getElementById("bodega").value;
  let x = document.querySelector("#FormCarrito");
  for (let elem of x) {
    if (elem.value == "0.00") {
      Swal.fire({
        icon: "warning",
        title: "Linea sin precios",
        text: "Existen articulos sin precios.",
        confirmButtonColor: "#000",
      });
      return false;
    }
  }
  if (tipoDocumento == "P" && stock > 0) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text:
        "No se puede crear pedido, porque hay artículos con cantidad pedida mayor a la cantidad en existencia en bodega " +
        bodega,
    });
    return false;
  } else {
    window.location.href =
      "detalle-factura.html?tipodocumento=" + tipoDocumento;
  }
}

function busquedaGeneral(tiporpt, tipoclase) {
  let tipobusqueda = $("#selectTipoBusqueda option:selected").val();
  localStorage.setItem('tipobusqueda', tipobusqueda);

  if (tipobusqueda == "V") {
    tipoclase = "1040";
    tiporpt = "C";
  }

  let params;
  let nPag = 0,
    htm = "";
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
    document.getElementById("carga").innerHTML = loader;
    if (tipobusqueda != tiporpt) {
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
    } else {
      params =
        "?ptiporpt=" +
        tiporpt +
        "&ptipoclase=" +
        tipoclase +
        "&articulo=" +
        articulo +
        "&bodega=" +
        bodega;
    }

    console.log("Estos son los parametros de busqueda General: " + params);
    // console.log(params);
    fetch(env.API_URL + "busqueda/1" + params, myInit)
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error))
      .then((result) => {
        if (result.msg === "SUCCESS") {
          console.log(result.data.length);
          if (result.data.length > 0) {
            ArrayData = result.data;
            ArrayDataFiltrado = result.data;
            console.log("DATA DE BUSQUEDA GENERAL");
            console.log(ArrayData);
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
              confirmButtonColor: "#f90f00",
            });
            document.getElementById("carga").innerHTML = "";
            return false;
          }
        }
      });
  }
}
//-----------------------------------------------------------------------------------
function mostrarResultadosBusqueda(nPag, pag, IDCategoria, ord, pTipoProd) {
  //console.log("nPage:" + nPag + "- pag:" + pag);
  //VARIABLE client no se esta usando
  let client = existe_Cliente();
  let htm = "";
  let desde = (pag - 1) * xPag;
  let hasta = pag * xPag;
  // console.log("DESDE MOSTRARRESULTADOSBUSQUEDA");
  // console.log(IDCategoria);
  htm = mostrarResultados(desde, hasta, IDCategoria, ord, pTipoProd);
  if (typeof IDCategoria == "undefined") IDCategoria = "";
  htm += paginador(nPag, pag, IDCategoria, ord);
  if (IDCategoria == "1040") {
    document.getElementById("resultadoGeneral").innerHTML = htm;
    $("html, body").animate(
      {
        scrollTop: $("#resultadoGeneral").offset().top - 140,
      },
      1000
    );
  } else {
    document.getElementById("BusquedaResultado").innerHTML = htm;
    $("html, body").animate(
      {
        scrollTop: $("#BusquedaResultado").offset().top - 140,
      },
      1000
    );
  }

  document.getElementById("carga").innerHTML = "";
  $("select").formSelect();
  $(".dropdown-trigger").dropdown();
}
//-----------------------------------------------------------------------------------
function mostrarResultados(desde, hasta, IDCategoria, ord, pTipoProd) {
  var totalRegistros = 0, tipobusqueda = "";
  tipobusqueda = pTipoProd;
  console.log("TIPOBUSQUEDA: " + tipobusqueda);
  //Para productos terminados(T), para KIT (K)
  if (tipobusqueda == "W") {
    tipobusqueda = "T";
  }
  //CONSULTA TOTAL DE REGISTROS
  if (clearFiltros == false) {
    if (viewImcompletos == true) {
      totalRegistros = ArrayDataFiltrado.length;
    } else {
      if (IDCategoria == "1055") {
        totalRegistros = contRinesCompletos();
      } else {
        //Conteo total de registros para todas las demas categorias y rines incompletos
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
        } else {
          totalRegistros = ArrayDataFiltrado.length;
        }
      }
    }
  } else {
    if (IDCategoria == "1055") {
      //RESULTADO DE CONSULTA DESPUES DE LIMPIAR FILTROS
      totalRegistros = contRinesCompletos();
      clearFiltros = false;
    } else {
      //Conteo total de registros para todas las demas categorias y rines incompletos
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
    }
  }

  let client = existe_Cliente();
  //DECLARACION DE VARIABLES
  let htm = "",
    selASC = "",
    selDESC = "",
    bodegaLabel = "",
    remateLabel = "",
    url = "",
    precioL = "";
  var pre = 1;
  if (ord == "asc") {
    selASC = "selected";
  }
  if (ord == "desc") {
    selDESC = "selected";
  }
  htm += '<div id="lista-articulo">';
  htm += `<div class="col s12">
          <h5 class="sub-header"><b>Resultado de Busqueda </b></h5>
        </div>`;
  htm += `<div class="row" id="totalregistros">
            <div class="col s6">
              <span>Total de Registros: </span>
              <span>${totalRegistros}</span>
            </div></div>
            <div class="row">
            <div class="col s6">
              <select class="btn browser-default" style="height: 45px;" onchange="ordenarResultado(this.value,${IDCategoria})">
                <option value="">ORDENAR</option>
                <option value="asc" ${selASC}>PRECIO MÁS BAJO</option>
                <option value="desc" ${selDESC}>PRECIO MÁS ALTO</option>
              </select>
            </div>
            <div class="col s6">
                <a class="btn browser-default" href="javascript:void(0);" onclick="FiltrarModal('${IDCategoria}',0);">
              <i class="material-icons right">filter_list</i>
              FILTRAR </a>
            </div></div>`;
  htm += '<ul id="listas">';
  //console.log(ArrayData);
  for (let i = desde; i < hasta; i++) {
    if (ArrayDataFiltrado[i]) {
      switch (viewImcompletos) {
        case false:
          if (ArrayDataFiltrado[i].INCOMPLETO != "I") {
            DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
            //SI ENCUENTRA STOCK DEL ARTICULO EN BODEGA AGREGA ETIQUETA: EN TIENDA
            if (ArrayDataFiltrado[i].BODEGA == "S") {
              bodegaLabel = '<span class="mi-tienda">En Tienda</span>';
            } else {
              bodegaLabel = "";
            }
            if (ArrayDataFiltrado[i].PRECIOLISTA != null) {
              url = ` href="detalle.html?art=${ArrayDataFiltrado[i].ARTICULO}&IDCategoria=${ArrayDataFiltrado[i].ID_CLASE}&pTipoProd=${tipobusqueda}"`;
              pre = `${parseFloat(ArrayDataFiltrado[i].PRECIOLISTA).toFixed(
                2
              )}`;
            } else {
              pre = parseFloat(0).toFixed(2);
              url = ` onclick="error_precio();"`;
            }

            //SI ENCUENTRA STOCK CON DESCUENTO AGREGA ETIIQUETA: DESCUENTO Y PRECIO DESCUENTO
            if (
              ArrayDataFiltrado[i].PRECIO_DESCUENTO !== ".00" &&
              ArrayDataFiltrado[i].PRECIO_DESCUENTO !== null &&
              ArrayDataFiltrado[i].PRECIO_DESCUENTO !== undefined
            ) {
              remateLabel =
                '<div class="descuentos new-top-left">Descuento</div>';
              precioL = `<span class="black-text" style="font-size: 12px;font-weight: bold;">Precio Descuento: </span><span style="color: #c00; background-color: #fff; font-size: 15px;"><br><strong>B/. ${parseFloat(
                ArrayDataFiltrado[i].PRECIO_DESCUENTO
              ).toFixed(
                2
              )}</strong></span>&nbsp;<span style="color: #000; background-color: #fff; font-size: 13px;">B/. <strike> ${pre}</strike></span>`;
            } else {
              //SI ENCUENTRA STOCK CON REMATE AGREGA ETIQUETA: REMATE Y PRECIO DE REMETE
              if (ArrayDataFiltrado[i].REMATE == "R") {
                remateLabel = '<div class="remates new-top-left">Remate </div>';
                precioL = `<span class="black-text" style="font-size: 12px;font-weight: bold;">Precio Remate: </span><span style="color: #c00; background-color: #fff; font-size: 15px;"><br><strong>B/. ${parseFloat(
                  ArrayDataFiltrado[i].PRECIOREMATE
                ).toFixed(
                  2
                )}</strong></span>&nbsp;<span style="color: #000; background-color: #fff; font-size: 13px;">B/. <strike> ${pre}</strike></span>`;
              }
              //AQUI COLOCA PRECIO NORMAL/REFERENCIA
              else {
                remateLabel = "";
                precioL = `<span style=" font-size: 12px; color: #001; font-weight: bold!important;">Precio <br>Referencia:</span> B/.<strong>${pre}</strong></span>`;
              }
            }

            //a ${url}---> a href="detalle.html?art=225/50R18%20K&IDCategoria=1010"
            if (
              ArrayDataFiltrado[i].ID_CLASE == "1055" &&
              +ArrayDataFiltrado[i].CANT_DISPONIBLE < 4
            ) {
              //no muestra los articulos tipo 1055/rines que tengan cantidad menor a 4
            } else {
              htm += `
          <li>
            <div class="container-img">
            <div id="envoltorio">
              <a ${url}>
                  ${remateLabel}
                  <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
                    data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
                  ${bodegaLabel}
              </a>
              <div class="flotante-acciones">
                      <div class="link-flotante-acciones">
                          <a id="dropbtn${i}" class="dropbtn2x" onclick="precioArticuloVende('${ArrayDataFiltrado[i].ARTICULO}','${i}')">
                            <i class="left material-icons black-text" style="font-size: 24px;">monetization_on</i>
                          </a>
                      </div>
                      <div class="link-flotante-acciones" style="padding-bottom: 5px;">
                          <a id="dropbtn${i}" class="dropbtn2x" onclick="precioArticuloVende2('${ArrayDataFiltrado[i].ARTICULO}',2${i},'${tipobusqueda}')">
                              <!--<i class="icon-inventory" style="font-size: 24px;"></i>-->
                              <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
                          </a>
                          <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
                      </div>
                      <div class="link-flotante-acciones">`;
              if (client.length > 0) {
                htm += `<a id="dropbtn${i}" class="dropbtn3x" onclick="precioArticuloVende3('${ArrayDataFiltrado[i].ARTICULO}',3${i})">
                    <i class="left material-icons black-text" style="font-size: 24px;">bar_chart</i>
                </a>`;
              } else {
                htm += `<a id="dropbtn${i}" class="dropbtn3x">
                    <i class="left material-icons grey-text" style="font-size: 24px;">bar_chart</i>
                </a>`;
              }
              htm += `<div id="myDropdown3${i}" class="dropdown-content2" style="right: 15px; top: 65px;"></div>
              </div>
              </div>
                      <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
                      <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
                      <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
              </div>
              <h3 class="articulo-titulo"> ${ArrayDataFiltrado[i].ARTICULO}</h3>
              <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
              <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
              ${precioL}</span>
            </div>
          </li>`;
            }
          }
          break;
        case true:
          DArticulo = ArrayDataFiltrado[i].ARTICULO.replace("/", "-");
          //SI ENCUENTRA STOCK DEL ARTICULO EN BODEGA AGREGA ETIQUETA: EN TIENDA
          if (ArrayDataFiltrado[i].BODEGA == "S") {
            bodegaLabel = '<span class="mi-tienda">En Tienda</span>';
          } else {
            bodegaLabel = "";
          }
          if (ArrayDataFiltrado[i].PRECIOLISTA != null) {
            url = ` href="detalle.html?art=${ArrayDataFiltrado[i].ARTICULO}&IDCategoria=${ArrayDataFiltrado[i].ID_CLASE}"`;
            pre = `${parseFloat(ArrayDataFiltrado[i].PRECIOLISTA).toFixed(2)}`;
          } else {
            pre = parseFloat(0).toFixed(2);
            url = ` onclick="error_precio();"`;
          }

          //SI ENCUENTRA STOCK CON DESCUENTO AGREGA ETIIQUETA: DESCUENTO Y PRECIO DESCUENTO
          if (
            ArrayDataFiltrado[i].PRECIO_DESCUENTO !== ".00" &&
            ArrayDataFiltrado[i].PRECIO_DESCUENTO !== null &&
            ArrayDataFiltrado[i].PRECIO_DESCUENTO !== undefined
          ) {
            remateLabel =
              '<div class="descuentos new-top-left">Descuento</div>';
            precioL = `<span class="black-text" style="font-size: 12px;font-weight: bold;">Precio Descuento: </span><span style="color: #c00; background-color: #fff; font-size: 15px;"><br><strong>B/. ${parseFloat(
              ArrayDataFiltrado[i].PRECIO_DESCUENTO
            ).toFixed(
              2
            )}</strong></span>&nbsp;<span style="color: #000; background-color: #fff; font-size: 13px;">B/. <strike> ${pre}</strike></span>`;
          } else {
            //SI ENCUENTRA STOCK CON REMATE AGREGA ETIQUETA: REMATE Y PRECIO DE REMETE
            if (ArrayDataFiltrado[i].REMATE == "R") {
              remateLabel = '<div class="remates new-top-left">Remate </div>';
              precioL = `<span class="black-text" style="font-size: 12px;font-weight: bold;">Precio Remate: </span><span style="color: #c00; background-color: #fff; font-size: 15px;"><br><strong>B/. ${parseFloat(
                ArrayDataFiltrado[i].PRECIOREMATE
              ).toFixed(
                2
              )}</strong></span>&nbsp;<span style="color: #000; background-color: #fff; font-size: 13px;">B/. <strike> ${pre}</strike></span>`;
            }
            //AQUI COLOCA PRECIO NORMAL/REFERENCIA
            else {
              remateLabel = "";
              precioL = `<span style=" font-size: 12px; color: #001; font-weight: bold!important;">Precio <br>Referencia:</span> B/.<strong>${pre}</strong></span>`;
            }
          }

          //a ${url}---> a href="detalle.html?art=225/50R18%20K&IDCategoria=1010"
          htm += `
          <li>
            <div class="container-img">
            <div id="envoltorio">
              <a ${url}>
                  ${remateLabel}
                  <img src="${env.API_IMAGE}/${DArticulo}" width="100%"
                    data-src="' + site + 'image/displayimage/' + varArt + '" alt="' + ArrayData[i].ARTICULO + '">
                  ${bodegaLabel}
              </a>
              <div class="flotante-acciones">
                      <div class="link-flotante-acciones">
                          <a id="dropbtn${i}" class="dropbtn2x" onclick="precioArticuloVende('${ArrayDataFiltrado[i].ARTICULO}','${i}')">
                            <i class="left material-icons black-text" style="font-size: 24px;">monetization_on</i>
                          </a>
                      </div>
                      <div class="link-flotante-acciones" style="padding-bottom: 5px;">
                          <a id="dropbtn${i}" class="dropbtn2x" onclick="precioArticuloVende2('${ArrayDataFiltrado[i].ARTICULO}',2${i})">
                              <!--<i class="icon-inventory" style="font-size: 24px;"></i>-->
                              <img src="./img/icon/inventario.svg" width="22" height="22" tabindex="1">
                          </a>
                          <div id="myDropdown2${i}" class="dropdown-content2" style="right: 15px; top: 35px;"></div>
                      </div>
                      <div class="link-flotante-acciones">`;
          if (client.length > 0) {
            htm += `<a id="dropbtn${i}" class="dropbtn3x" onclick="precioArticuloVende3('${ArrayDataFiltrado[i].ARTICULO}',3${i})">
                    <i class="left material-icons black-text" style="font-size: 24px;">bar_chart</i>
                </a>`;
          } else {
            htm += `<a id="dropbtn${i}" class="dropbtn3x">
                    <i class="left material-icons grey-text" style="font-size: 24px;">bar_chart</i>
                </a>`;
          }
          htm += `<div id="myDropdown3${i}" class="dropdown-content2" style="right: 15px; top: 65px;"></div>
              </div>
              </div>
                      <div id="precios_lista${i}" class="closed tooltips-luciano"></div>
                      <div id="inventario_lista2${i}" class="closed tooltips-luciano"></div>
                      <div id="ultimas_compras3${i}" class="closed tooltips-luciano"></div>
              </div>
              <h3 class="articulo-titulo"> ${ArrayDataFiltrado[i].ARTICULO}</h3>
              <h4>${ArrayDataFiltrado[i].DESCRIPCION}</h4>
              <span style="color: #f90f00; font-size: 15px; line-height: 65%;">
              ${precioL}</span>
            </div>
          </li>`;
          break;
      }
    }
  }
  htm += "</ul></div>";
  return htm;
}
//-----------------------------------------------------------------------------------
function paginador(nPag, pag, IDCategoria, ord) {
  //MUESTRA LA CANTIDAD DE PAGINA
  let selected = "";
  sel = `<select class="browser-default" onchange="mostrarResultadosBusqueda(${nPag}, this.value,${IDCategoria},'${ord}')">
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
    btnAtras = `<a onclick="mostrarResultadosBusqueda(${nPag} , ${parseInt(pag) - 1
      }, ${IDCategoria},'${ord}');">❮ Anterior</a>`;

  if (pag >= nPag) btnSig = `<a style="color: #aba7a7;"> Siguiente ❯ </a>`;
  else
    btnSig = `<a onclick="mostrarResultadosBusqueda(${nPag},${parseInt(pag) + 1
      },${IDCategoria},'${ord}')">Siguiente ❯</a>`;

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
function InsertarPedidos(numcons, tipoDocumento, key, estadodocumento) {
  // console.log("Enter to InsertarPedidos");
  //console.log(numcons + "-" + tipoDocumento);

  let usuario = document.getElementById("hUsuario").value;
  let cant = document.getElementById("nav-cart-count").textContent;
  let observ = document.getElementById("observacion").value;
  let cliente = existe_Cliente();
  let cli = ClientData.obtenerCliente();
  let bodega = document.getElementById("bodega").value;
  let productos = cartCLSAObj.cartCLSA;
  let prom = productos[0].promo;
  let subtotal = productos[0].subtotal;
  let impuesto = parseFloat(productos[0].impuesto).toFixed(6);
  let total = productos[0].total_a_facturar;
  let nprecio = productos[0].nivel_precio;
  let pedido = productos[0].pedido;

  // alert("Codigo de Pedido: " + pedido);

  let cartIniCount = sessionStorage.getItem("cartItemCount");
  let cartNewCount = productos[0].items.length;
  let initObserv = sessionStorage.getItem("initObserv");
  //let tipoSistema = "E";

  let tipoDoc = cartCLSAObj.cartCLSA[0].tipo_doc;
  // alert(tipoDoc);

  //estaba creando una validacion para enviar el numero de orden de compra al api para guardarlo en encabezado de pedido
  let requiereoc = localStorage.getItem("requiereoc");

  let pordencompra = "";
  if (requiereoc === "S") {
    // alert(requiereoc);
    // let ordenCompraElement = document.getElementById("orden_compra_cliente");
    let ordenCompraElement = localStorage.getItem("constOrdVal");
    console.log("ordenCompraElement");
    console.log(ordenCompraElement);
    // if (ordenCompraElement !== null && ordenCompraElement.value !== null)
    if (ordenCompraElement !== null) {
      // pordencompra = ordenCompraElement.value;
      pordencompra = ordenCompraElement;
    }
  }

  let tituloMensaje = "",
    mensaje = "",
    proc = "";
  //existe_Cliente;

  for (let i = 0; i < productos[0].items.length; i++) {
    let precio = parseFloat(productos[0].items[i].precio);
    productos[0].items[i].precio = precio.toFixed(2);
  }

  let items = productos[0].items;

  let params = {
    username: usuario,
    password: "",
    user: usuario,
    //codigo de cliente
    cliente: cliente,
    //nombre/razon social
    nombrecuenta: cli[0].NOMBRE,
    bodega: bodega,
    observacion: observ,
    pedido: numcons,
    ordencompra: pordencompra,
    nivelprecio: nprecio,
    condicion: condicion_pago(),
    subtotal: parseFloat(subtotal).toFixed(2),
    impuesto: impuesto,
    total: parseFloat(total).toFixed(2),
    totalunidades: cant,
    tipodocumento: tipoDocumento,
    estadodocumento: estadodocumento,
    promocion: prom,
    items: items,
  };

  console.log("Parametros Pedido a Insertar desde insertarPedidos Function");
  console.log(params);

  if (tipoDocumento == "C") {
    tituloMensaje = "COTIZACIÓN";
  }
  if (tipoDocumento == "P") {
    tituloMensaje = "PEDIDO";
  }

  //console.log("numcons:" + numcons + " estadodoc:" + estadodocumento);
  if (
    numcons != "" &&
    estadodocumento == "A" &&
    tipoDocumento == "P" &&
    tipoDoc === "C"
  ) {
    mensaje = `Su cotización ${numcons} se ha pasado a Pedido`;
    console.log("PASO POR AQUI XXXXX");
  } else if (numcons != "" && estadodocumento == "A" && tipoDocumento == "P") {
    mensaje = `Su Pedido ${numcons} se ha Actualizado`;
  } else if (numcons != "" && estadodocumento == "A" && tipoDocumento == "C") {
    mensaje = `Su cotización ${numcons} se ha Actualizado`;
  } else if (numcons != "" && estadodocumento == "I") {
    mensaje = ` "Se ha creado su ${tituloMensaje} con el numero ${numcons} correctamente"`;
  }

  if (tipoDoc == "C" || tipoDoc == "P") {
    proc = "Actualizando";
  } else {
    proc = "Creando";
  }
  //console.log(mensaje);

  itemsToDelete = JSON.parse(sessionStorage.getItem("itemsToDelete"));

  console.log("ITEMS PARA BORRAR");
  for (let item in itemsToDelete) {
    console.log(item + ": " + itemsToDelete[item]);
  }
  //------------------itemsToDelete_NoProm--------------------
  // itemsToDelete_NoProm = JSON.parse(
  //   sessionStorage.getItem("itemsToDelete_NoProm")
  // );
  //------------------itemsToDelete_NoProm--------------------
  promoToDelete = JSON.parse(sessionStorage.getItem("promoToDelete"));

  console.log("PROMOS PARA BORRAR");
  for (let prop in promoToDelete) {
    console.log(prop + ": " + promoToDelete[prop]);
  }

  if (itemsToDelete && itemsToDelete.length > 0 && pedido && pedido.trim()) {
    // alert("itemsToDelte no esta vacio");
    // console.log("ITEMS PARA BORRAR");
    // console.log(itemsToDelete);
    // alert("ENTRANDO A itemsToDelete");

    let paramsToDelete = {
      pedido: numcons,
      promo: promoToDelete,
      articulo: "",
      username: usuario,
      i: 0,
    };

    console.log("PARAMETROS DE ITEMS A BORRAR");
    console.log(paramsToDelete);

    itemsToDelete.forEach(function (key, index) {
      plinea = key.lineapedido;
      paramsToDelete.articulo = key.articulo;
      // console.log("PARAMETROS");
      // console.log(params);
      const promise = BorrarLineaPedidoDB(paramsToDelete, plinea);
      promise.then((data) => {
        console.log("BORRAR LINEA PEDIDO DB RESPUESTA:");
        console.log(data);
        if (data.resp === 1) {
          cartCLSAObj.cartCLSA[0].items = cartCLSAObj.cartCLSA[0].items.filter(
            function (z) {
              return z.promo != promo;
            }
          );
          cartCLSAObj.save();
          cartCLSAObj.encabezadoCarrito();
          cartCLSAObj.refrescarCarrito();

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "Actualizando " + tituloMensaje + "..",
          }).then(function () {
            Swal.fire({
              icon: "success",
              title: "Actualizado correctamente",
              text: "¡El Pedido " + numcons + " fue Actualizado!",
              confirmButtonColor: "#000",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              }
            });
          });
          //SERVICIO EN PROCESO
        } else if (data.resp === 0) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "Actualizando " + tituloMensaje + "..",
          }).then(function () {
            Swal.fire({
              icon: "warning",
              title: "¡Servicio en Proceso!",
              text: "Notifique a su supervisor, para anular servicio y poder continuar.",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#000",
            }).then((result) => {
              if (result.isConfirmed) {
                //vaciar carrito de compra
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              }
            });
          });
          //SIN ORDEN DE TALLER
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "Actualizando " + tituloMensaje + "..",
          }).then(function () {
            Swal.fire({
              icon: "success",
              title: "Actualizado correctamente",
              text: "¡El Pedido " + numcons + " fue Actualizado!",
              confirmButtonColor: "#000",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                //vaciar carrito de compra
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              }
            });
          });
        }
      });
    });
    //------------------------insertar nuevo pedido/actualizar pedido/cambiar cotizacion a pedido-------------------------
  } else if (
    cartIniCount == null ||
    cartNewCount > cartIniCount ||
    tipoDoc == "C" ||
    observ != initObserv
  ) {
    // alert("ESTA ENTRANDO A INSERTAR PEDIDO");
    fetch(env.API_URL + "insertarpedido", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error.message))
      .then((result) => {
        console.log(result);
        if (result.msg === "SUCCESS") {
          console.log("MENSAJE TALLER: " + result.taCon);
          console.log("MENSAJE PEDIDO: " + result.message);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: proc + " " + tituloMensaje + "..",
          }).then(function () {
            if (result.taCon === "COTIZACION") {
              Swal.fire({
                icon: "success",
                title: "Ingreso de " + tituloMensaje,
                text: mensaje,
                confirmButtonColor: "#000",
              }).then((result) => {
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                //vaciar requiereoc y ordenValue
                localStorage.removeItem("requiereoc");
                localStorage.removeItem("ordenValue");
                localStorage.removeItem("constOrdVal");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              });
            } else if (result.taCon === "SUCCESS") {
              Swal.fire({
                icon: "success",
                title: "Ingreso de " + tituloMensaje,
                text: tituloMensaje + " " + "Actualizado",
                confirmButtonColor: "#000",
              }).then((result) => {
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                //vaciar requiereoc y ordenValue
                localStorage.removeItem("requiereoc");
                localStorage.removeItem("ordenValue");
                localStorage.removeItem("constOrdVal");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              });
            } else if (result.message === "5" || result.message === 5) {
              Swal.fire({
                icon: "error",
                title: "Ingreso de " + tituloMensaje,
                text: "¡No se pudo procesar la solicitud!, El número de orden de compra, ya existe.",
                confirmButtonColor: "#000",
              }).then((result) => {
                //DA LA OPCIÓN PARA CORREGIR NÚMERO DE ORDEN DE COMPRA
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              });
            } else if (result.taCon === "2") {
              Swal.fire({
                icon: "success",
                title: "Ingreso de " + tituloMensaje,
                text: mensaje,
                confirmButtonColor: "#000",
              }).then((result) => {
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                //vaciar requiereoc y ordenValue
                localStorage.removeItem("requiereoc");
                localStorage.removeItem("ordenValue");
                localStorage.removeItem("constOrdVal");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              });
            } else if (result.taCon === "4") {
              Swal.fire({
                icon: "success",
                title: "Ingreso de " + tituloMensaje,
                text: mensaje,
                confirmButtonColor: "#000",
              }).then((result) => {
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                //vaciar requiereoc y ordenValue
                localStorage.removeItem("requiereoc");
                localStorage.removeItem("ordenValue");
                localStorage.removeItem("constOrdVal");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Ingreso de " + tituloMensaje,
                text:
                  mensaje +
                  ", Se ha creado la Orden de Taller: " +
                  result.taCon,
                confirmButtonColor: "#000",
              }).then((result) => {
                cartCLSAObj.empty();
                cartCLSAObj.refrescarCarrito();
                //vaciar itemsToDelete y promoToDelete
                sessionStorage.removeItem("itemsToDelete");
                sessionStorage.removeItem("promoToDelete");
                //vaciar requiereoc y ordenValue
                localStorage.removeItem("requiereoc");
                localStorage.removeItem("ordenValue");
                localStorage.removeItem("constOrdVal");
                window.setTimeout(function () {
                  window.location.href = "home.html";
                }, 1000);
              });
            }
          });
        }
      });
    //FIN INSERTAR PEDIDO
  } else {
    Swal.fire({
      title: "¡Todo está actualizado!",
      text: "No se han detectado cambios recientes",
      icon: "info",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#000",
      showCloseButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      // Aquí se ejecuta el código después de que se cierra el modal
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  }
}
//-------------------------------------------------------------------------------------
function BorrarLineaPedidos(numcons, articulo, linea, promo) {
  //console.log(numcons + "-" + tipoDocumento);
  let usuario = document.getElementById("hUsuario").value;
  let cliente = existe_Cliente();
  let bodega = document.getElementById("bodega").value;
  let productos = cartCLSAObj.cartCLSA;
  let pedido = productos[0].pedido;
  var plinea = 0;
  var line = linea;
  var acumToDeleteLocal = acumToDelete;
  let msg = "",
    text = "",
    lineatalleranulado = "";
  if (promo != 0) {
    if (promo == 5) {
      msg = "un DESCUENTO";
    } else {
      msg = "una PROMOCIÓN";
    }
    text =
      `El articulo seleccionado tiene ${msg}, se eliminará las filas relacionados. Deseas eliminar el artículo ` +
      articulo;
  } else {
    text = "Deseas eliminar el artículo " + articulo;
  }

  //VERIFICACION LINEA ANULADA
  let params = {
    pedido: pedido,
    articulo: articulo,
  };

  let promise = ValidaArticuloAnuladoTaller(params, linea);
  promise
    .then((data) => {
      // Verificar si la respuesta es "SUCCESS"
      if (data.resp.msg === "SUCCESS") {
        // Verificar si el arreglo de message no está vacío
        if (data.resp.message.length > 0) {
          lineatalleranulado = data.resp.message;

          console.log("LINEA_TALLER_ANULADO ES: " + lineatalleranulado); // Aquí tienes el valor de LINEA_TALLER_ANULADO
        } else {
          console.log("No se encontraron resultados");
        }
      } else {
        console.log("La solicitud no tuvo éxito.");
      }
    })
    .catch((error) => {
      console.error(`Error en la solicitud: ${error}`);
    });

  Swal.fire({
    title: "¿Estas seguro?",
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#000",
    cancelButtonColor: "#6bd9ec",
    confirmButtonText: "Si, Eliminar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      //verifica si se esta editando un pedido existente
      if (pedido != null || pedido != "") {
        //VALIDACION PARA SABER SI LA LINEA/ARTICULO ESTA ANULADA

        //funcion verificar si existe una orden de taller, asociada al pedido
        // let promise = verificarOrdenTaller(pedido);
        // promise
        //   .then((data) => {
        //     // Verificar si la respuesta es "SUCCESS"
        //     if (data.resp.msg === "SUCCESS") {
        //       // Verificar si el arreglo de message no está vacío
        //       if (data.resp.message.length > 0) {
        //         // Extraer el valor de ORDEN_TALLER del primer objeto en el arreglo
        //         const ordenTaller = data.resp.message[0].ORDEN_TALLER;

        //         console.log("ORDEN_TALLER: " + ordenTaller); // Aquí tienes el valor de ORDEN_TALLER
        //       } else {
        //         console.log("No se encontraron resultados");
        //       }
        //     } else {
        //       console.log("La solicitud no tuvo éxito.");
        //     }
        //   })
        //   .catch((error) => {
        //     console.error(`Error en la solicitud: ${error}`);
        //   });

        // console.log("DATA");
        // console.log(respuesta);
        // alert("VERIFICA ORDEN TALLER:");

        if (lineatalleranulado === "N") {
          Swal.fire({
            title: "¡Servicio en Proceso!",
            text: "Notifique a su supervisor, para anular servicio y poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#000",
            showCloseButton: true,
            allowOutsideClick: false,
          }).then((result) => {
            // Aquí se ejecuta el código después de que se cierra el modal
            if (result.isConfirmed) {
              Swal.close();
            }
          });
        } else {
          // if (pedido != "") {
          // console.log("ESTA PASANDO POR AQUI");
          let items = productos[0].items;
          let x;
          let tituloMensaje = "",
            mensaje = "";

          //PARAMETROS
          let params = {
            pedido: numcons,
            promo: promo,
            articulo: articulo,
            username: usuario,
            i: 0,
            /* password: "65361198",
                user: usuario,
                cliente: cliente,*/
          };

          // VALIDACION PARA NO BORRAR SERVICIO SI HAY PRODUCTO ASOCIADO
          switch (promo) {
            case 9:
              if (
                cartCLSAObj.cartCLSA[0].items.some(
                  (item) => item.clase === 1010
                )
              ) {
                for (
                  i = cartCLSAObj.cartCLSA[0].items.length - 1;
                  i >= 0;
                  i--
                ) {
                  if (cartCLSAObj.cartCLSA[0].items[i].clase == 1040) {
                    cartCLSAObj.cartCLSA[0].items[i].promo = 10;
                    cartCLSAObj.cartCLSA[0].promo = "PROMO*" + 10 + "*" + 1010;
                  }
                }
              } else {
                // alert("NO LO INCLUYE");
              }
              break;
            case 10:
              var resp = false;
              for (i = cartCLSAObj.cartCLSA[0].items.length - 1; i >= 0; i--) {
                if (cartCLSAObj.cartCLSA[0].items[i].clase == 1055) {
                  resp = true;
                }
              }
              // if (cartCLSAObj.cartCLSA[0].items.some((item) => item.clase === 1055)) {
              if (resp) {
                // alert("ESTA CAYENDO ACA");
                for (
                  i = cartCLSAObj.cartCLSA[0].items.length - 1;
                  i >= 0;
                  i--
                ) {
                  if (cartCLSAObj.cartCLSA[0].items[i].clase == 1040) {
                    cartCLSAObj.cartCLSA[0].items[i].promo = 9;
                    cartCLSAObj.cartCLSA[0].promo = "PROMO*" + 9 + "*" + 1055;
                  }
                }
              } else {
                // alert("NO LO INCLUYE");
              }
              break;
          }
          // FIN VALIDACION PARA NO BORRAR SERVICIO SI HAY PRODUCTO ASOCIADO

          if (promo != 0) {
            x = cartCLSAObj.cartCLSA[0].items.filter(function (y) {
              return y.promo == promo;
            });

            // if (sessionStorage.getItem("itemsToDelete_NoProm")) {
            // }
            // itemsToDelete = x;
            if (acumToDeleteLocal != null) {
              acumToDeleteLocal = acumToDeleteLocal.concat(x);
            } else {
              acumToDeleteLocal = x;
            }

            sessionStorage.setItem(
              "itemsToDelete",
              JSON.stringify(acumToDeleteLocal)
            );
            sessionStorage.setItem("promoToDelete", JSON.stringify(promo));

            // console.log("itemsToDelete");
            // console.log(itemsToDelete);
            // x.forEach(function (key, index) {
            //   plinea = key.lineapedido;
            //   params.articulo = key.articulo;
            //   // console.log("PARAMETROS");
            //   // console.log(params);
            //   const promise = BorrarLineaPedidoDB(params, plinea);
            //   promise.then((data) => {
            //     if (data.resp === "SUCCESS") {
            //       cartCLSAObj.cartCLSA[0].items =
            //         cartCLSAObj.cartCLSA[0].items.filter(function (z) {
            //           return z.promo != promo;
            //         });
            //       cartCLSAObj.save();
            //       cartCLSAObj.encabezadoCarrito();
            //       cartCLSAObj.refrescarCarrito();
            //       Swal.fire({
            //         icon: "info",
            //         title: "Actualizado",
            //         text: "Pedido fue actualizado..",
            //       });
            //     }
            //   });
            // });
            // window.location.href = "home.html";
            //FUNCION PARA BORRAR LINEA SIN PROMOCIONES, NI ARTICULOS ASOCIADOS
          } else {
            x = cartCLSAObj.cartCLSA[0].items.filter(function (y) {
              return y.articulo == articulo;
            });

            // if (sessionStorage.getItem("itemsToDelete")) {
            if (acumToDeleteLocal != null) {
              acumToDeleteLocal = acumToDeleteLocal.concat(x);
            } else {
              acumToDeleteLocal = x;
            }
            //....hay que guardar acumToDelete en una variable session
            // } else {
            sessionStorage.setItem(
              "itemsToDelete",
              JSON.stringify(acumToDeleteLocal)
            );
            // }

            //   const promise = BorrarLineaPedidoDB(params, linea);
            //   promise.then((data) => {
            //     if (data.resp === "SUCCESS") {
            //       cartCLSAObj.cartCLSA[0].items =
            //         cartCLSAObj.cartCLSA[0].items.filter(function (x) {
            //           return x.lineapedido != linea;
            //         });
            //       cartCLSAObj.save();
            //       cartCLSAObj.encabezadoCarrito();
            //       cartCLSAObj.refrescarCarrito();
            //       Swal.fire({
            //         icon: "info",
            //         title: "Actualizado",
            //         text: "Pedido fue actualizado...",
            //       });
            //       // console.log("ESTA PASANDO POR AQUI");
            //     }
            //   });
          }
          //FUNCION PARA ELIMINAR PRODUCTOS DE CARRITO NO ESTANDO EN MODO PEDIDO
          // }
          // else {
          // alert("Else borrar linea no pedido: " + promo);

          //BORRAR ARTICULO DEL CARRITO DE COMPRA LOCALMENTE
          cartCLSAObj.eliminarItem(articulo, linea, promo);
          sessionStorage.removeItem("_promoActive");
          sessionStorage.removeItem("_promoActiveClase");
          document.getElementById("promocionActiva").style.display = "none";
          document.getElementById("promocionActiva").innerHTML = "";
          window.location.href = "home.html";
          // }
          // fin de confirm
        }
      } else {
        //BORRAR ARTICULO DEL CARRITO DE COMPRA LOCALMENTE
        cartCLSAObj.eliminarItem(articulo, linea, promo);
        sessionStorage.removeItem("_promoActive");
        sessionStorage.removeItem("_promoActiveClase");
        document.getElementById("promocionActiva").style.display = "none";
        document.getElementById("promocionActiva").innerHTML = "";
        window.location.href = "home.html";
      }
    } else {
      return false;
    }
  });
}
//-------------------------------------------------------------------------------------
async function BorrarLineaPedidoDB(params, linea) {
  try {
    const response = await fetch(env.API_URL + "borrarpedido/" + linea, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return {
      resp: data.msg,
    };
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}
//----------------------FUNCION PARA VERIFICAR ARTICULO ANULADO-----------------------
async function ValidaArticuloAnuladoTaller(params, linea) {
  try {
    const response = await fetch(
      env.API_URL + "verificarordentaller/" + linea,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json",
        },
        body: JSON.stringify(params),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return {
      resp: data,
    };
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}
//------------------------FUNCION PARA VERFICAR ORDEN DE TALLER--------------------------
function ingresarCliente(cliente, nombre) {
  let subcadena = "";
  //traer nombre/razon social de localStorage
  var infopedido = JSON.parse(localStorage.getItem("cartCLSA"));
  if (infopedido && infopedido[0] && infopedido[0].CLIENTE) {
    // El valor de infopedido[0].CLIENTE no es nulo
    // Realiza aquí la acción que deseas hacer con este valor
    razonPedido = infopedido[0].CLIENTE;
    subcadena = razonPedido.substring(razonPedido.indexOf(" ") + 1);
    console.log("RAZON PEDIDO:");
    console.log(subcadena.trim());
  }

  let usuario = document.getElementById("hUsuario").value;
  cliente = cliente.replace("&", "%26");
  console.log(cliente + "-" + nombre);
  //-------------------datos de cliente de tabla cliente-------------------
  const params = "?user=" + usuario + "&cliente=" + cliente + "&opcion=2";
  console.log("Parametros de usuario: " + params);
  fetch(env.API_URL + "cliente/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.cliente.length != 0) {
          ClientData.datos = result.cliente;
          //guarda el permiso para cambiar precio de articulos en carrito
          sessionStorage.setItem(
            "cambPrecio",
            ClientData.datos[0].MODIF_PRECIO
          );
          //insertar razon social aqui
          if (infopedido && infopedido[0] && infopedido[0].CLIENTE) {
            ClientData.datos[0].NOMBRE = subcadena.trim();
          }

          console.log("DATOS CLIENTE: ");
          console.log(ClientData.datos);
          if (cartCLSAObj.cartCLSA.length > 0) {
            ClientData.datos[0].CONDICION_PAGO =
              cartCLSAObj.cartCLSA[0].condicion_pago;
          }
        }
        document.getElementById("carga").innerHTML = "";
      }
    });
  //-------------------fin datos de cliente de tabla cliente-------------------
  const data = "?user=" + usuario + "&cliente=" + cliente;
  fetch(env.API_URL + "cliente/2" + data, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.cuenta.length != 0) {
          window.setTimeout(function () {
            ClientData.datos[0].CUENTA = [];
            ClientData.datos[0].CUENTA.push(result.cuenta);
            ClientData.guardarCliente();
          }, 1000);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "Agregando el cliente seleccionado",
          }).then(function () {
            Swal.fire({
              icon: "success",
              title: "Agregado correctamente",
              text: "Su cliente fue agregado.",
              confirmButtonColor: "#000",
            }).then(function () {
              window.setTimeout(function () {
                window.location.href = "home.html";
              }, 1000);
            });
          });
        }
        document.getElementById("carga").innerHTML = "";
      }
    });
}
//-----------------------------------------------------------------------------------
//MODAL LATERAL
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
          console.log("Get bodegas no cargadas, verifique la conexión");
        }
      });
  });
  //---------------------------------------------------------------------------------
});
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
function logout() {
  // Eliminar todas las variables de sessionStorage
  Object.keys(sessionStorage).forEach(function (key) {
    sessionStorage.removeItem(key);
  });
  document.location.href = "index.html";
}
//-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------



// Mostrar el loading antes de enviar la solicitud
function mostrarLoading() {
  $('.loading').show();
  document.querySelector('.loading').style.display = 'block';
}


//------------FUNCION PAGINADOR PARA BUSQUEDA PEDIDOS/COTIZACIONES------------------
function paginadorPedidos(nPag, pag, IDCategoria) {
  console.log("desde: " + (pag - 1) * xPag + " hasta: " + pag * xPag);
  console.log("nPag:" + nPag + "- pag:" + pag);
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