// FUNCION QUE EJECUTA LA VENTANA EMERGENTE, QUE MUESTRA LAS EXIXTENCIAS DE UN ARTICULO POR BODEGA AL DAR CLIC EN EL ICONO
function mostrarExistencia(btn) {
    // Obtener la fila del botón
    var fila = btn.parentNode.parentNode;
    // Obtener el valor de la segunda columna
    var valor = fila.cells[0].textContent;

    // Mostrar el loading antes de abrir la ventana emergente
    swal.fire({
        title: "Cargando Registros....",
        allowOutsideClick: false, // Evita que se cierre la ventana emergente al hacer clic fuera de ella
        showConfirmButton: false, // Oculta el botón OK
        onBeforeOpen: function () {
            swal.showLoading();
        }
    });

    $.ajax({
        type: "POST",
        url: "/Inventario/ExistenciaArticulo",
        data: JSON.stringify({ codigo: valor }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {            
           var existenciaArticulos = response;
            var matrizArticulos = [];

            for (var key in existenciaArticulos) {
                if (existenciaArticulos.hasOwnProperty(key)) {
                    matrizArticulos.push(existenciaArticulos[key]);
                }
            }
            var tablaHtml = '<table style="border-collapse: collapse; width: 100%;">' +
                '<thead>' +
                '<tr style="border-bottom: 1px solid #ddd;">' +
                '<th style="text-align: left; padding: 8px;"> Bodega </th>' +
                '<th style="text-align: center; padding: 8px;"> Cantidad </th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            for (var i = 0; i < matrizArticulos.length; i++) {
                tablaHtml += '<tr style="border-bottom: 1px solid #ddd;">' +
                    '<td style="text-align: left; padding: 8px;">' + matrizArticulos[i].NOMBRE + '</td>' +
                    '<td style="text-align: center; padding: 8px;">' + parseFloat(matrizArticulos[i].CANTIDAD).toFixed(2) + '</td>' +
                    '</tr>';
            }

            tablaHtml += '</tbody>' + '</table>';          

            swal.fire({
                title: "Articulo: " + valor,
                html: tablaHtml,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#55b251"
            });
        },
        error: function (xhr, status, error) {
            swal.fire({
                title: "El código buscado no existe " + valor,               
            });
        }
    });   
}

function mostrarImagenArticulo(btn) {
    // Obtener la fila del botón
    var fila = btn.parentNode.parentNode;
    // Obtener el valor de la segunda columna
    var valor = fila.cells[0].textContent;

    // Mostrar el loading antes de abrir la ventana emergente
    swal.fire({
        title: "Cargando Registros....",
        allowOutsideClick: false, // Evita que se cierre la ventana emergente al hacer clic fuera de ella
        showConfirmButton: false, // Oculta el botón OK
        onBeforeOpen: function () {
            swal.showLoading();
        }
    });

    $.ajax({
        type: "POST",
        url: "/Inventario/ExistenciaArticulo",
        data: JSON.stringify({ codigo: valor }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var existenciaArticulos = response;
            var matrizArticulos = [];

            for (var key in existenciaArticulos) {
                if (existenciaArticulos.hasOwnProperty(key)) {
                    matrizArticulos.push(existenciaArticulos[key]);
                }
            }
            var tablaHtml = '<table style="border-collapse: collapse; width: 100%;">' +
                '<thead>' +
                '<tr style="border-bottom: 1px solid #ddd;">' +
                '<th style="text-align: left; padding: 8px;"> Bodega </th>' +
                '<th style="text-align: center; padding: 8px;"> Cantidad </th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            for (var i = 0; i < matrizArticulos.length; i++) {
                tablaHtml += '<tr style="border-bottom: 1px solid #ddd;">' +
                    '<td style="text-align: left; padding: 8px;">' + matrizArticulos[i].NOMBRE + '</td>' +
                    '<td style="text-align: center; padding: 8px;">' + parseFloat(matrizArticulos[i].CANTIDAD).toFixed(2) + '</td>' +
                    '</tr>';
            }

            tablaHtml += '</tbody>' + '</table>';

            swal.fire({
                title: "Articulo: " + valor,
                html: tablaHtml,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#55b251"
            });
        },
        error: function (xhr, status, error) {
            swal.fire({
                title: "El código buscado no existe" + valor,
            });
        }
    }); 


}