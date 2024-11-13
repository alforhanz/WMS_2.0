$(document).ready(function () {
    // evento para manejar la solicitud AJAX
    
        $.ajax({
            url: '/Inventario/filtrosBusqueda',
            type: 'POST',
            data: { clase: $('#input-clase').val() },
            success: function (data) {
                // eliminar las opciones anteriores
                $('#clase').empty();

                // agregar una opción por cada objeto FiltroClasificacion
                $.each(data, function (index, filtro) {
                    var opcion = $('<option>').attr('value', filtro.CLASE);
                    $('#clase').append(opcion);
                });

                // Agregar el evento change al input #buscado
                $('#buscado').on('change', function () {
                    $(this).val($(this).val().split(' - ')[0]);
                });
            },
            error: function (xhr, status, error) {
                // manejar el error
            }
        });
   
});
