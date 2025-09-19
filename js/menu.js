//Se creaun arreglo para los menús
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
var ArrayMenu = [];
let menuEnlaces = [
  //CONSULTA
  { MODULO: 10, SUBMODULO: 0, ICON: "manufacturing", LINK: ""},//PROCESOS
    { MODULO: 10, SUBMODULO: 1, ICON: "", LINK: "verificacionDePedidos.html"},//VERIFICACION DE PEDIDOS
    { MODULO: 10, SUBMODULO: 2, ICON: "", LINK: "verificacionDePicking.html"},// ORDENES DE COMPRAS
    { MODULO: 10, SUBMODULO: 3, ICON: "", LINK: "BusquedaDeContenedores.html"},//
    { MODULO: 10, SUBMODULO: 4, ICON: "", LINK: "VerificadorDeContenedores.html"},   
    { MODULO: 10, SUBMODULO: 5, ICON: "", LINK: "verificacionDeTraslados.html"}, 
    { MODULO: 10, SUBMODULO: 6, ICON: "", LINK: "verificacionDePickingDetraslados.html"}, 
    { MODULO: 10, SUBMODULO: 7, ICON: "", LINK: "conteoDeInventario.html"}, 
    { MODULO: 10, SUBMODULO: 8, ICON: "", LINK: "boletaDeInventario.html"}, 
    { MODULO: 10, SUBMODULO: 9, ICON: "", LINK: "verificacionDeOrdenesDeCompra.html"}, 

  { MODULO: 12, SUBMODULO: 0, ICON: "feature_search", LINK: ""},//CONSULTAS
    { MODULO: 12, SUBMODULO: 1, ICON: "", LINK: "verificacionDeOrdenesDeCompraProcesadas.html"}, 
    { MODULO: 12, SUBMODULO: 2, ICON: "", LINK: "detalleTrasladoVerificados.html"},  

  { MODULO: 13, SUBMODULO: 0, ICON: "rocket", LINK: ""},//Operacion
   { MODULO: 13, SUBMODULO: 1, ICON: "", LINK: "ingresaCodigoBarra.html"},//ingresa cod barras

  { MODULO: 3, SUBMODULO: 0, ICON: "monitoring", LINK: ""}, //REPORTES
   { MODULO: 3, SUBMODULO: 23, ICON: "", LINK: "resumenConteoDeInventario.html"}, //REPORTES
   { MODULO: 3, SUBMODULO: 24, ICON: "", LINK: "reportedeInventarioGeneral.html"}, //Resumen de Conteo de Inventario General
   
  { MODULO: 4, SUBMODULO: 0, ICON: "manage_accounts", LINK: ""},//ADMINISTRACION
  { MODULO: 4, SUBMODULO: 7, ICON: "", LINK: "#"},  
 
];
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  $("#expand_morefather").click(function () {
    let element = document.getElementById("expand_more");   
    if (element.matches(".icon-up") === false) {
      element.classList.remove("icon-down");
      element.classList.add("icon-up");
    } else {   
      element.classList.remove("icon-up");
      element.classList.add("icon-down");
    }
  });
  cargarMenu();
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function cargarMenu() {
  //let loader = `<div class="loading"></div>`;
  const usuario = existe_Usuario();
  const params = "?user=" + usuario + "&sistema=WMS";
  //document.getElementById("carga").innerHTML = loader;
  fetch(env.API_URL + "menu/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      // console.log("Resultado de los modulos");
      // console.log(result);
      ArrayMenu = result.menu;
      // console.log("OPCIONES DE MENU");
      // console.log(ArrayMenu);
      var source = builddata();
      // console.log("MENU");
      // console.log(source);
      buildUL(source);
    });
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
var builddata = function () {
  var source = [];
  var items = [];

  // Ordenar ArrayMenu por ID para mantener el orden original
  ArrayMenu.sort((a, b) => a.ID - b.ID);

  // Construir fuente jerárquica
  for (var i = 0; i < ArrayMenu.length; i++) {
    var item = ArrayMenu[i];
    var label = item["DESCRIPCION"];
    var parentid = item["PARENT"];
    var id = item["MODULO"];
    var modulo = item["MODULO"];

    // Verificar si el elemento ya está en items
    if (items[id]) {
      items[id].label = label;
      items[id].item = item;
    } else {
      items[id] = { parentid: parentid, label: label, item: item, modulo: modulo };
    }

    // Si tiene un padre, agregarlo a los elementos del padre
    if (parentid !== -1) {
      if (!items[parentid].items) {
        items[parentid].items = [];
      }
      // Crear un nuevo objeto para cada elemento hijo
      var childItem = { parentid: parentid, label: label, item: item, modulo: modulo };
      items[parentid].items.push(childItem);
    } else {
      // Si no tiene padre, agregarlo directamente a la fuente
      source.push(items[id]);
    }
  }

  return source;
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
var buildUL = function (items) {
	 let url_dalbos= "http://200.124.12.146:8108/home.php";
  let htm = "",
    icono = "",
    icono2 = "",
    link = "";

 //INICIO y DALBOS

  htm += `<li>
    <div class="collapsible-header" id="expand_morefather">
        <a href="home.html">
            <span class="margen-pedido" style="color:black;">
                <span id="inicio" class="material-symbols-outlined left " style="margin-top: 13px; margin-right: 15px;color:black;">home</span>
                INICIO
            </span>
        </a>
    </div>
    <div class="collapsible-header" id="expand_morefather">
        <a href="${url_dalbos}">
            <span class="margen-pedido" style="color:black;">
                <span id="inicio" class="material-symbols-outlined left " style="margin-top: 13px; margin-right: 15px;color:black;">account_balance</span>
                DALBOS
            </span>
        </a>
    </div>
</li>`;

  items.forEach(function (key) {
    
    const m = menuEnlaces.find((x) => x.MODULO === key.item.MODULO && x.SUBMODULO === 0);
  
    if (m) {
      icono = m.ICON;
    } else {
      icono = "";
    }

    if (key.label) {
      if (key.items && key.items.length > 0) {
        if (key.label == "WMS") {//ENLACE PADRE
          htm += `<li><div class="collapsible-header" id="expand_morefather">                  
                  <span class="margen-pedido"><span class="material-symbols-outlined left" style="margin-top: 13px;margin-right: 15px;">${icono}</span>${key.label}</span>
                  <span id="expand_more" class="material-icons red-text" style="position: absolute;margin-right: 0; top:13px;padding-right: 0;right: 21px;background: transparent;color: white !important;border-radius: 50%;">expand_more</span>
                </div>`;
        }
        else if (key.label == "INVENTARIO") {
          //No se carga nada
        }
        else {
          htm += `<li><div class="collapsible-header" id="expand_morefather">
                  <span class="margen-pedido"><span class="material-symbols-outlined left" style="margin-top: 13px;margin-right: 15px;">${icono}</span> ${key.label}</span>
                  <span id="expand_more" class="material-icons red-text" style="position: absolute;margin-right: 0; top:13px;padding-right: 0;right: 21px;background: transparent;color: white !important;border-radius: 50%;">expand_more</span>
                </div>`;
        }
      } else {
        htm += `<li onclick="javascript:alert('En Desarrollo');">
                <span class="material-symbols-outlined" style="position: relative;margin-right: 11px;top: 5px;">${icono}</span>${key.label}
                <a href="javascript:alert('En Desarrollo');" class="btn-floating btn-large waves-effect waves-light red">
                <i class="icon-chevron-right-circle"></i>
                </a>`;
      }
      //Carga las opciones de submenus
      if (key.items && key.items.length > 0) {
        htm += `<div class="collapsible-body"><ul class="collection-item" id="submenu">`;
        key.items.forEach(function (key2) {
          const n = menuEnlaces.find(
            (x) => x.MODULO === key.modulo && x.SUBMODULO === key2.item.SUBMODULO
          );
         
          if (n) {
            //icono2 = n.ICON;
            link = n.LINK;
          } else {
            icono2 = "";
            link = "";
          }

          htm += `<li class="collection-item" onclick="enlace('${link}');">        
                    <span class="submenu-enlace">${key2.label.toUpperCase()}<a href="${link}" ></a></span>
                  </li>`;
        });
        htm += `</ul></div>`;
      }
      htm += `</li>`;
    }
  });
  document.getElementById("MenuL").innerHTML = htm;
  $(".collapsible").collapsible();
};
