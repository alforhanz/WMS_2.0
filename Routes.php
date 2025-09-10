<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);
/* --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */
// We get a performance increase by specifying the default
// route since we don't have to scan directories.
#$routes->get('/', 'Home::index');

//$routes->resource('marcas');
$routes->get('menu/(:num)', 'Menu::show/$1');

$routes->get('marcasv', 'Marcas_vehiculo::index'); // obtiene marcas que estan en el sistema GET
$routes->post('marcasv', 'Marcas_vehiculo::store');  // agregar una marca nueva POST
$routes->get('marcasv/(:num)', 'Marcas_vehiculo::show/$1'); // obtener una marca especifica por id
$routes->post('marcasv/(:num)', 'Marcas_vehiculo::update/$1'); // actualizar la marca POST
$routes->delete('marcasv/(:num)', 'Marcas_vehiculo::destroy/$1'); // eliminar la marca POST

$routes->get('clasificacionesv', 'GetClasificaciones::index'); // obtiene clasificaciones que estan en el sistema GET

$routes->get('modelosv', 'Modelos_vehiculo::index');
$routes->post('modelosv', 'Modelos_vehiculo::store');
$routes->get('modelosv/(:num)', 'Modelos_vehiculo::show/$1');
$routes->get('modelosv/(:num)/(:num)', 'Modelos_vehiculo::show/$1/$2');
$routes->post('modelosv/(:num)', 'Modelos_vehiculo::update/$1');
$routes->delete('modelosv/(:num)', 'Modelos_vehiculo::destroy/$1');

$routes->get('aniov', 'Anio_vehiculo::index');
$routes->post('aniov', 'Anio_vehiculo::store');
$routes->get('aniov/(:num)', 'Anio_vehiculo::show/$1');
$routes->get('aniov/(:num)/(:num)', 'Anio_vehiculo::show/$1/$2');
$routes->post('aniov/(:num)', 'Anio_vehiculo::update/$1');
$routes->delete('aniov/(:num)', 'Anio_vehiculo::destroy/$1');

$routes->get('versionest', 'VersionesTamano_vehiculo::index');
$routes->get('versionest/(:num)/(:num)/(:num)', 'VersionesTamano_vehiculo::show/$1/$2/$3');

$routes->get('rines/(:num)', 'BusquedaRines::show/$1');
$routes->get('llantas/(:num)', 'Llantas::show/$1');

$routes->get('pernos', 'Pernos_vehiculo::index');
$routes->get('pernos/(:num)', 'Pernos_vehiculo::show/$1');

$routes->get('distancias', 'Distancias_vehiculo::index');
$routes->get('distancias/(:num)', 'Distancias_vehiculo::show/$1');

$routes->get('tamano', 'TamanoRinPernos_vehiculo::index');
$routes->get('tamano/(:num)/(:num)', 'TamanoRinPernos_vehiculo::show/$1/$2');

$routes->get('filtros', 'Filtros::index');
$routes->get('filtros/(:num)', 'Filtros::show/$1');

$routes->get('seccion/(:num)/(:num)', 'Secciones::show/$1/$2');

$routes->get('tipo/(:num)', 'Tipo::show/$1');
$routes->get('subtipo/(:num)/(:num)', 'SubTipo::show/$1/$2');

$routes->get('detalle/(:num)', 'DetalleProducto::show/$1');

$routes->get('cliente/(:num)', 'Cliente::show/$1');
$routes->post('cliente', 'Cliente::store');
$routes->get('verificarnit/(:num)','VerificarNitCliente::show/$1');

$routes->get('pedidos/(:any)', 'Pedidos::show/$1');
$routes->post('pedidos', 'Pedidos::store'); // inserta pedidos en linea [CLSA].
 // inserta pedidos en linea [CLSA].[SP_PEDIDOS_WEB_ONLINE_PEDIDO]

$routes->get('insertarpedido', 'Insertar_Pedido::index'); // obtiene marcas que estan en el sistema GET
$routes->post('insertarpedido', 'Insertar_Pedido::create'); // inserta pedidos en linea [CLSA].[SP_PEDIDOS_WEB_ONLINE_PEDIDO]/ESTE INSERTA PEDIDO NUEVO/ACTUALIZA SI HAY ARTICULOS NUEVOS
$routes->get('insertarpedido/(:num)', 'Insertar_Pedido::show/$1'); // obtener una marca especifica por id
$routes->post('insertarpedido/(:num)', 'Insertar_Pedido::update/$1'); // actualizar la marca POST

$routes->post('actualizarcliente/(:num)', 'ActualizarCliente::update/$1'); // actualizar la marca POST


$routes->post('insertarcliente', 'InsertarCliente::create'); // inserta pedidos en linea [CLSA].

$routes->delete('borrarpedido/(:num)', 'Borrar_LineaPedido::destroy/$1');

$routes->get('image/(:any)', 'Image::show/$1');

$routes->get('bodegau/(:any)', 'BodegaUsuario::show/$1');

$routes->get('servicios/(:num)', 'Servicios::show/$1');
$routes->get('busqueda/(:num)', 'Buscador::show/$1');
$routes->get('reportes/(:num)', 'Reportes::show/$1');

$routes->get('promo/(:num)', 'Promociones::show/$1');

$routes->get('consecutivos/(:num)', 'ConsecutivoPedido::show/$1');

$routes->get('ventascliente', 'VentasCliente::index');
$routes->get('clasificacionarticulos', 'ClasificacionArticulos::index');
$routes->get('fitrarmarcas', 'FitrarMarcas::index');
$routes->get('getinformeventafacturador', 'GetInformeVentaFacturador::index');
$routes->get('getinformeventafacturadoreco', 'GetInformeVentaFacturadorEco::index');

$routes->get('getimpuesto/(:num)', 'GetImpuestoArticulo::show/$1');

$routes->get('verificarordentaller/(:any)', 'verificarOrdenTaller::create/$1'); // verifica si el pedido tiene orden de taller
$routes->post('verificarordentaller/(:any)', 'verificarOrdenTaller::validaranulado/$1'); // verifica el articulo en una linea especifica esta anulado o no

$routes->get('getvalidaordencompra', 'GetValidaOrdenCompra::index');

$routes->get('getencuesta/(:any)', 'GetEncuestas::show/$1'); // Encuestas CRM Vendedor

//Routes for Norwing E-Commerce
$routes->get('getmetasvendedor', 'GetMetasVendedor::index');

//Routes for Norwing E-Commerce
$routes->get('getmetasvendedor', 'GetMetasVendedor::index');
$routes->get('getdescuentos', 'GetDescuentos::index');
$routes->get('norwingreportes/(:any)', 'NorwingGetReportes::index/$1');


// RUTAS PARA MOTORIZADOS - E-COMMERCE
$routes->get('getmotorizados', 'GetMotorizados::index');

// RUTAS PARA ARTICULOS DE EMBARQUES - E-COMMERCE
$routes->get('getnuevosProductos', 'GetNuevosProductos::index');

// RUTA PARA CONSULTAR CATEGORIA DEL CLIENTE AL USAR BUSCADOR GENERAL
$routes->get('categorias', 'GetCategorias::index');

// RUTA PARA GENERAR TIPOS DE INFORME EN GESTION DE ACTIVIDAD
//$routes->get('/tipos-informe', 'TipoInformeController::index');
$routes->get('/tipos-informe', 'TipoInforme::index');

// RUTA PARA APROBAR PEDIDOS DE CREDITOS
$routes->get('aprobarP/R', 'AprobarPedido::index');
$routes->post('aprobarP/aprobar', 'AprobarPedido::aprobar');

 //RUTA PARA ACTUALIZAR PEDIDOS DE CREDITOS
$routes->post('actualizar', 'ActualizarPedido::actualizar');




  ///////////////////////////////////////////////////////////////////////////////////////////////////////
 /////////			  RUTAS DEL WMS 	 				    ////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

$routes->get('wmslogin', 'WMSspLogin::login');//Establece la ruta al controlador para el login de usuarios
$routes->get('getdashinfo/(:num)', 'GetDashInfo::show/$1');//Establece la ruta al controller para los diferentes Dashboards
$routes->get('wmsgetdashinfo/(:num)', 'WMSGetDashInfo::show/$1');
$routes->get('filtroswms', 'GetFiltrosWMS::index');
$routes->get('wmsbusquedaarticulos/(:any)', 'WMSbusquedaArticulos::show/$1');//Establece la ruta al controlador de la búsqueda de articulos
$routes->get('wmsexistenciaarticulosporbodega/(:any)', 'WMSExistenciasArticuloBodegas::show/$1');//Establece la ruta al controlador de las existencias de los articulos por bodega
$routes->get('detallearticulo', 'WMSGetDetalleArticulo::articuloDetalleNota');//Ruta al controlador que obtiene el detalle del articulo y la nota de este.

//VERIFICACION DE PEDIDOS
$routes->get('wmsverificacionpedidos/(:any)', 'WMSgetVerificacionPedidos::show/$1'); //Ruta al controlador GetVerificacion
$routes->get('wmsguardadopedidos/(:any)', 'WMSgetGuardadoParcialPedidos::show/$1');//Ruta Guardado Parcial,  Procesar Pedidos y actualizar filas eliminadas
$routes->get('devolverarticulo/(:any)', 'GetDevolverArticulo::show/$1');//Ruta al controlador GetDevolverArticulo
$routes->get('wmsguardadopicking/(:any)', 'WMSgetGuardadoParcialPicking::show/$1');//Ruta al controlador para Guardado Parcial,  Procesar Pedidos y actualizar filas eliminadas

//BUSQUEDA DE CONTENEDORES
$routes->get('contenedor', 'WMSGetContenedores::buscaContenedores');//Ruta al controlador GetContenedor
$routes->get('wmsautorizacioncontenedor', 'WMSgetTrasladoAutorizacion::show');//Ruta al controlador que autoriza el cierre de un contenedor
// $routes->get('verificadordecontenedores', 'WMSGetVerificaContenedores::verificaContenedores');//Ruta al controlador GetContenedor
$routes->get('verificadordecontenedores', 'WMSVerificadorDeContenedores::verificaContenedor');//Ruta al controlador GetContenedor
$routes->get('guardacreapaquete', 'WMSVerificadorDeContenedores::guardaCreaPaquete');
$routes->get('imprimepaquete', 'WMSVerificadorDeContenedores::impPaqueteReporte');


//ORDENES DE COMPRA
$routes->get('wmsordenesdecompras/(:any)', 'WMSordenesDeCompras::show_OrdenesDeCompras/$1');//Ruta al controlador que trae la lista de las ordenes de compras
$routes->get('wmsordenesdecompraslist', 'WMSordenesDeCompras::show_OrdenDeComprasList');//Ruta al controlador que trae la lista de las ordenes de compras
$routes->get('wmsguardaprocesaordendecompralist/(:any)', 'WMSguardaOdenesDeCompras::show/$1');//Ruta al controlador que guarda parciálmente la lista de las ordenes de compras
$routes->get('wmsmostarbodegasconsultaordencompra', 'WMSmuestraBodegasConsultaOrdenCompra::show_Bodega');//Ruta al controlador que muestra dinamicamente las bodegas en OC procesadas
$routes->get('wmscambiaboddestinooc', 'WMScambiaBodegaDestinoOrdenCompra::show_CambioBodega');
$routes->get('wmsautorizaciones', 'WMSautorizacion::show_autoriza');

//TRASLADOS
$routes->get('wmsverificaciontraslados/(:any)', 'WMSgetVerificacionDeTraslados::show/$1'); //Ruta al controlador Traslados DE PREPARACION Y PREPARADOS
$routes->get('wmsguardadotraslado/(:any)', 'WMSgetGuardadoParcialTraslado::show/$1');////Ruta al controlador para GUARDAR Y PROCESAR TRASLADOS
$routes->get('wmsguardadopickingtraslado/(:any)', 'WMSgetGuardadoParcialPickingTraslado::show/$1');//Ruta al controlador para GUARDAR, PREPARAR TRASLADOS

//INSERTAR CODIGOS DE BARRA NUEVOS
$routes->get('wmsinsertacodigobarra', 'WMSinsertaCodigoDeBarra::insertaCodigo');//Establece la ruta al controlador que inserta los nuevos codigos de barra
$routes->get('wmsverificacodigo', 'WMSverificaCodigo::verificaCodigo');//Establece la ruta al controlador que verifica los codigos de barra y de articulo.

//CONTEO INVENTARIO
$routes->get('wmsfechainventario', 'WMSgetFechasInventario::getfechainv');//Establece la ruta al controlador que trae las fechas de inventsario de la bodega especifica.
$routes->get('wmsguardaconteoinv/(:any)', 'WMSgetGuardadoConteoInventario::show/$1');////Ruta al controlador para GUARDAR Y PROCESAR el conteo del inventario
$routes->get('wmsresumeninventario', 'WMSgetResumenInventario::getResumeninv');//Establece la ruta al controlador que trae las fechas de inventsario de la bodega especifica.
$routes->get('wmseliminadatosinventario', 'WMSdeleteDatosInventario::delDatosinv');//Establece la ruta al controlador que trae las fechas de inventsario de la bodega especifica.

//REPORTE DEL INVENTARIO GENERAL
//$routes->get('wmsclasificacionesreporte','WMSgetClasificacionesReporte::reporteclasificaciones');//Obtiene las clasificaciones de clase marca tipo etc...
$routes->get('wmsclasificacionesreporteinventario', 'WMSgetClasificacionesReporte::getClasificacion');//Obtiene las clasificaciones de clase marca tipo etc...
$routes->get('wmsreporteinventariogeneral', 'WMSreporteInventarioGeneral::ResumenInventarioGeneral');

//CREACIÓN DE BOLETAS
$routes->get('wmspresentaciondeboletas', 'WMScreacionDeBoletas::presentarBoleta');
$routes->get('wmsactualizacostosinv', 'WMScreacionDeBoletas::actualizaCostos');
$routes->get('wmscrearvoletainv', 'WMScreacionDeBoletas::crearBoleta');


//DETALLE DE TRASLADOS VERIFICADOS
$routes->get('wmsdetallesdetrasladosverificados', 'WMSdetallesTrasladosVerificados::detalleTrasladosVerif');


//Routes for Dalbos
$routes->get('getrptventasdinamico', 'DBSGetReporteDinamicoVentas::index');


/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
        require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
