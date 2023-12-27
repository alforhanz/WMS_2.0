//$(document).ready(function () {
//    $(".codigo-barras-input").on("change", function () {
//        var input = $(this);
//        validarCodigoBarras(input);
//    });

//    $(".cantidad-input").on("change", function () {
//        var input = $(this);
//        actualizarCantidad(input);
//    });

//    function validarCodigoBarras(input) {
//        var codigoInput = input.val();
//        var fila = input.closest("tr");
//        var codigoTabla = fila.data("codigo-barras");
//        var articuloCell = fila.find(".codigo-articulo");
//        var cantidadInput = fila.find(".cantidad-input");

//        if (codigoInput === codigoTabla) {
//            var codigoArticulo = articuloCell.data("articulo");
//            articuloCell.text(codigoArticulo);
//            cantidadInput.prop("readonly", false);
//            cantidadInput.val(1); // Establecer cantidad a 1
//        } else {
//            articuloCell.text("");
//            cantidadInput.prop("readonly", true);
//            cantidadInput.val("");
//        }
//    }

//    function actualizarCantidad(input) {
//        var fila = input.closest("tr");
//        var cantidad = input.val();
//        fila.find(".cantidad-column").text(cantidad);
//        crearNuevaFila();
//    }

//    function crearNuevaFila() {
//        var nuevaFila = $("<tr>");
//        nuevaFila.append('<td class="codigo-articulo"></td>');
//        nuevaFila.append('<td><input type="text" class="codigo-barras-input"></td>');
//        nuevaFila.append('<td><input type="number" class="cantidad-input" readonly></td>');
//        nuevaFila.data("codigo-barras", "");
//        $(".table-hover").append(nuevaFila);
//        nuevaFila.find(".codigo-barras-input").on("change", function () {
//            var input = $(this);
//            validarCodigoBarras(input);
//        });
//        nuevaFila.find(".cantidad-input").on("change", function () {
//            var input = $(this);
//            actualizarCantidad(input);
//        });
//    }
//});


