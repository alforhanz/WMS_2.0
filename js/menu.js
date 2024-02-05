var ArrayMenu = [];
let menuEnlaces = [
  //WMS
  {
    MODULO: 10,
    SUBMODULO: 0,
    ICON: "apps",
    LINK: "metas-vendedor.html",
  },
  //WMS SUBMODULOS
  //VERIFICACION DE PEDIDOS
  {
    MODULO: 10,
    SUBMODULO: 1,
    ICON: "remove",
    LINK: "verificacionDePedidos.html",
  },
  //VERIFICACION DE ORDENES DE COMPRA
  {
    MODULO: 10,
    SUBMODULO: 2,
    ICON: "remove",
    LINK: "verificacionDeOrdenesDeCompra.html",
  },
  //VERIFICACION DE CONTENEDORES
  {
    MODULO: 10,
    SUBMODULO: 3,
    ICON: "remove",
    LINK: "verificacionDeContenedor.html",
  },
];

$(document).ready(function () {
  $("#expand_morefather").click(function () {
    let element = document.getElementById("expand_more");
    ////console.log(element.matches(".icon-up"));
    if (element.matches(".icon-up") === false) {
      element.classList.remove("icon-down");
      element.classList.add("icon-up");
    } else {
      ////console.log("quitar class de girar");
      element.classList.remove("icon-up");
      element.classList.add("icon-down");
    }
  });
});

cargarMenu();

function cargarMenu() {
  //let loader = `<div class="loading"></div>`;
  const usuario = existe_Usuario();
  const params = "?user=" + usuario + "&sistema=W";
  //document.getElementById("carga").innerHTML = loader;
  fetch(env.API_URL + "menu/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      //console.log("Resultado de los modulos");
      //console.log(result);
      ArrayMenu = result.menu;
      //console.log("OPCIONES DE MENU");
      //console.log(result.menu);
      var source = builddata();
      buildUL(source);
    });
}

var builddata = function () {
  var source = [];
  var items = [];
  // build hierarchical source.
  for (i = 0; i < ArrayMenu.length; i++) {
    var item = ArrayMenu[i];
    var label = item["DESCRIPCION"];
    var parentid = item["PARENT"];
    var id = item["MODULO"];
    var modulo = item["MODULO"];

    if (items[parentid]) {
      var item = { parentid: parentid, label: label, item: item };
      if (!items[parentid].items) {
        items[parentid].items = [];
      }
      items[parentid].items[items[parentid].items.length] = item;
      items[id] = item;
    } else {
      items[id] = {
        parentid: parentid,
        label: label,
        item: item,
        modulo: modulo,
      };
      source[id] = items[id];
    }
  }
  return source;
};

var buildUL = function (items) {
  let htm = "",
    icono = "",
    icono2 = "",
    link = "";

  //INICIO
  htm += `<li>
    <div class="collapsible-header" id="expand_morefather">
        <a href="home.html">
            <span class="margen-pedido" style="color:black;">
                <span class="material-symbols-outlined left" style="margin-top: 13px; margin-right: 15px;color:black;">home</span>
                INICIO
            </span>
        </a>
    </div>
</li>`;

  items.forEach(function (key, index) {
    ////console.log(menuEnlaces);
    const m = menuEnlaces.find(
      (x) => x.MODULO === key.item.MODULO && x.SUBMODULO === 0
    );
    ////console.log(m);
    if (m) {
      icono = m.ICON;
    } else {
      icono = "";
    }



    if (key.label) {
      if (key.items && key.items.length > 0) {
        if (key.label == "WMS") {
          htm += `<li><div class="collapsible-header" id="expand_morefather">
                  <span class="margen-pedido"><span class="material-symbols-outlined left"
                      style="margin-top: 13px;margin-right: 15px;">${icono}</span>PROCESOS</span>
                  <span id="expand_more" class="material-icons red-text"
                    style="position: absolute;margin-right: 0; top:13px;padding-right: 0;right: 21px;background: #000;color: white !important;border-radius: 50%;">expand_more</span>
              </div>`;
        }
        else {
          htm += `<li><div class="collapsible-header" id="expand_morefather">
                  <span class="margen-pedido"><span class="material-symbols-outlined left"
                      style="margin-top: 13px;margin-right: 15px;">${icono}</span> ${key.label}</span>
                  <span id="expand_more" class="material-icons red-text"
                    style="position: absolute;margin-right: 0; top:13px;padding-right: 0;right: 21px;background: #000;color: white !important;border-radius: 50%;">expand_more</span>
                </div>`;
        }
      } else {
        htm += `<li onclick="javascript:alert('En Desarrollo');">
                <span class="material-symbols-outlined" style="position: relative;margin-right: 11px;top: 5px;">${icono}</span>
                  ${key.label}
                <a href="javascript:alert('En Desarrollo');" class="btn-floating btn-large waves-effect waves-light red">
                <i class="icon-chevron-right-circle"></i>
                </a>`;
      }
      //carga las opciones de los submenu
      if (key.items && key.items.length > 0) {
        htm += `<div class="collapsible-body"><ul class="collection-item" id="submenu">`;
        key.items.forEach(function (key2, index2) {
          const n = menuEnlaces.find(
            (x) =>
              x.MODULO === key.modulo && x.SUBMODULO === key2.item.SUBMODULO
          );
          if (n) {
            icono2 = n.ICON;
            link = n.LINK;
          } else {
            icono2 = "";
            link = "";
          }
          htm += `<li class="collection-item" onclick="enlace('${link}');"><span style="padding-left: 5px; font-size:11px">
          <span class="material-symbols-outlined left" style="margin-right: -3px;margin-top: 18px;font-size: 13px;padding-left: 32px;">remove</span>
          ${key2.label}</span>
                    <a href="${link}" class="btn-floating btn-large waves-effect waves-light">
                      <i class="icon-chevron-right-circle">remove</i>
                    </a>
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
