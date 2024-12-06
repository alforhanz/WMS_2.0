const check_switch = document.getElementById('arti_Kit');

// Función que inserta los nuevos códigos de barra encontrados
function InsertaCodigoBarra() {
    const usuario = document.getElementById('hUsuario').value;
    const contrasena = document.getElementById('autorizacion').value;
    const articulo = document.getElementById('pArticulo').value;
    const codigoBarra = document.getElementById('pCodigoBarra').value;
    const switchCodigo = localStorage.getItem('arti_Kit');

    let pOpcion = switchCodigo === "true" ? 'T' : 'K';

    const params = `?pUsuario=${usuario}&pClave=${contrasena}&pArticulo=${articulo}&pCodigoBarra=${codigoBarra}&pOpcion=${pOpcion}`;

    fetch(env.API_URL + "wmsinsertacodigobarra" + params, myInit)
        .then((response) => response.json())
        .then((result) => {
            console.log('rESULTADO\n'+ result.codigobarra[0].Mensaje );
            if (result.msg === "SUCCESS") {
                Swal.fire({
                    position: "centered",
                    icon: "success",
                    title: `${result.codigobarra[0].Mensaje}`,
                    showConfirmButton: false,
                    timer: 2000
                });
                clearScreen();
            }
        });
}

// Agregar un evento de cambio al checkbox
check_switch.addEventListener('change', function () {
   handleSwitchChange();
});

function handleSwitchChange() {
    const originalCheckedState = check_switch.checked;

    Swal.fire({
        title: '¿Desea ingresar un código de barras para un artículo por kits o cajas?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6e7881",
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, se mantiene el valor cambiado
            localStorage.setItem('arti_Kit', check_switch.checked);
        } else {
            // Si el usuario cancela, se restablece el estado original del switch
            check_switch.checked = originalCheckedState;
            localStorage.setItem('arti_Kit', originalCheckedState);
        }
    });
}


function clearScreen(){
    const contrasena = document.getElementById('autorizacion');
    const articulo = document.getElementById('pArticulo');
    const codigoBarra = document.getElementById('pCodigoBarra');

      contrasena.value="";
      articulo.value=""  ;
      codigoBarra.value="";

}