// const template = document.createElement("template");

class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<header id="header" class="page-topbar">
    <!-- encabezado logo-->
    <nav class="nav-extended green">
      <div class="row">
        <div class="s1 col">
          <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        </div>
        <div class="s8 col center-align">
          <a href="home.html" class="brand-logo"></a>
        </div>
      </div>
    </nav>
    <!-- encabezado logo-->

    <!--BUSCADOR-->
    <div class="contenedor-buscador">
      <div class="row">
        <div class="col s11">
          <div class="row buscador">
            <div class="s10 col">
              <input class="uil uil-search-alt" data-role="none" id="articulo" placeholder="Buscar" value=""
                autocomplete="off">
            </div>
            <div class="s2 col">
              <!--<button id="buscado" class="search-action ui-btn" onclick="javascript: busquedaGeneral()">Esta funcion no va-->
              <button id="buscado" class="search-action ui-btn" onclick="javascript: preBusqueda()">
                <i class="material-icons">search</i>
              </button>
            </div>
          </div>
        </div>
        <div class="col s1" style="padding-left: 0;">
          <a href="#" onclick="filtrosModal();"><span class="material-symbols-outlined text-black"
              style="font-size: 23px;margin-top: 0;padding: 10px;background: #535162 !important;border-radius: 5px;color: #ffffff;margin-left: -16px;"><i class="material-icons">filter_list</i></span></a>
        </div>
      </div>
      <!--Switch button-->
      <!--Fin Switch button-->
    </div>
    <!--FIN BUSCADOR-->

    <!--UBICACION-->
    <div class="row shop-bodegas">
      <a>
        <div class="col s2">
          <div class="img">
            <img src="img/icon/location.svg?SDdd" alt="">
          </div>
        </div>
        <div class="col s9">
          <h6 id="bodega-sucursal">Seleccionar Sucursal</h6>
        </div>
      </a>
      <input type="hidden" id="bodega" />
      <input type="hidden" id="txtCategoria" />
    </div>
    <!--UBICACION-->

    <!--  MODAL DE LAS BODEGAS  -->
    <div id="bodega_sucursales" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="close-modal">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat green-text">
              <span class="text">CERRAR</span><span class="material-symbols-outlined right">close</span></a>
          </div>
        </div>
        <h5 class="left-align">Seleccionar Bodega O Sucursal</h5>
        <!-- AQUI SE CARGAN LA DATA DE LAS BODEGAS -->
        <div id="carga_more_sucursales"></div>
      </div>
    </div>
    <!-- FIN MODAL DE LAS BODEGAS -->

    <!-- MENU LATERAL IZQUIERDO -->
    <div class="sidenav" id="mobile-demo">
      <div class="row bordered">
        <div class="col s6 m6" style="display: flex; align-items: center;">
          <a href="home.html">
          <img src="img/Logo2.png" class="img-circle profile_img" style="max-width: 74%; height: auto;margin-right: 10px;">
          </a>
          <span id="usuario" class="hide-on-med-and-downx" style="color: #000;">Contenido del span</span>
          <input type="hidden" id="hUsuario" />
        </div>
        <div class="col s6 m6">
          <div class="close-session">
            <a href="#" onclick="logout();" class="green-text"><span class="material-symbols-outlined green-text right"
                style="margin-right: 0px;">power_off</span><span class="textclose-sesion">Cerrar sesión</span></a>
          </div>
        </div>
      </div>
      <ul class="collapsible" id="MenuL" style="font-size: 13px;"></ul>
    </div>
    <!-- FIN MENU LATERAL IZQUIERDO -->

    <!--PANTALLA FILTRO MODAL-->
    <div id="modalFiltro" class="modal">
      <div class="modal-header">
        <div class="row bordered">
          <div class="col s8">
          </div>
          <div class="col s4">
            <div class="close-modal">
              <a onclick="cerrarModal()" class="modal-close waves-effect waves-green btn-flat green-text">
                <span class="text">CERRAR</span><span class="material-symbols-outlined right">close</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-content">
        <div id="divFiltro">
        </div>
      </div>
    </div>
    <!--FIN PANTALLA FILTRO MODAL-->
  </header>
`;
  }
}
// template.innerHTML = document.body.appendChild(template.content);

customElements.define("my-header", MyHeader);