document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM cargado imp code bar...');
  let codigo = localStorage.getItem('impCodeBar');
  const inputData = document.getElementById('data');
  
  if (codigo && inputData) {
    inputData.value = codigo; // Asignar el valor al input
    generateBarcode(); // Generar el código de barras automáticamente
  }

  // Inicializar botones de Materialize
  M.AutoInit();

  // Añadir evento al botón de impresión
  const printButton = document.getElementById('printBarcode');
  if (printButton) {
    printButton.addEventListener('click', imprimeCodigo);
  }
});

document.getElementById('symbology').addEventListener('change', generateBarcode);
document.getElementById('data').addEventListener('input', generateBarcode);
document.getElementById('size').addEventListener('change', generateBarcode);

function generateBarcode() {
    const symbology = document.getElementById('symbology').value;
    const data = document.getElementById('data').value;
    const size = document.getElementById('size').value;

    document.getElementById('barcode').innerHTML = '';

    if (data.trim() === '') {
        return;
    }

    if (symbology === 'QR') {
        generateQRCode(data, size);
    } else if (symbology === 'CODE128') {
        generate1DBarcode(symbology, data, size);
    }
}

function generate1DBarcode(format, data, size) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data, {
        format: format,
        width: 2 * size,
        height: 100 * size,
        displayValue: true
    });
    document.getElementById('barcode').appendChild(canvas);
}

function generateQRCode(data, size) {
    const qrContainer = document.createElement('div');
    new QRCode(qrContainer, {
        text: data,
        width: 100 * size,
        height: 100 * size,
    });
    document.getElementById('barcode').appendChild(qrContainer);
}

function imprimeCodigo() {
    const data = document.getElementById('data').value;
    const symbology = document.getElementById('symbology').value;
    const size = document.getElementById('size').value;

    if (!data.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'Por favor, ingrese un valor para generar el código de barras antes de imprimir.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#55b251'
        });
        return;
    }

    // Crear una nueva ventana para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Código de Barras</title>
            <style>
                body { 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    margin: 0; 
                    font-family: Arial, sans-serif; 
                }
                canvas, div { 
                    margin: auto; 
                }
            </style>
        </head>
        <body>
            <div id="printBarcode"></div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            <script>
                function generateBarcodeForPrint() {
                    const data = "${data}";
                    const size = ${size};
                    const symbology = "${symbology}";
                    const printContainer = document.getElementById('printBarcode');
                    
                    if (symbology === 'QR') {
                        const qrContainer = document.createElement('div');
                        new QRCode(qrContainer, {
                            text: data,
                            width: 100 * size,
                            height: 100 * size,
                        });
                        printContainer.appendChild(qrContainer);
                    } else if (symbology === 'CODE128') {
                        const canvas = document.createElement('canvas');
                        JsBarcode(canvas, data, {
                            format: symbology,
                            width: 2 * size,
                            height: 100 * size,
                            displayValue: true
                        });
                        printContainer.appendChild(canvas);
                    }
                }
                generateBarcodeForPrint();
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();

    // Mostrar notificación de impresión
    Swal.fire({
        icon: 'info',
        title: 'Imprimiendo',
        text: 'Imprimiendo código...',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#55b251'
    });
}


// document.addEventListener("DOMContentLoaded", function () {
//   console.log('DOM cargado imp code bar...');
//   let codigo = localStorage.getItem('impCodeBar');
//   const inputData = document.getElementById('data');
  
//   if (codigo && inputData) {
//     inputData.value = codigo; // Asignar el valor al input
//     generateBarcode(); // Generar el código de barras automáticamente
//   }
// });

// document.getElementById('symbology').addEventListener('change', generateBarcode);
// document.getElementById('data').addEventListener('input', generateBarcode);
// document.getElementById('size').addEventListener('change', generateBarcode);

// function generateBarcode() {
//     const symbology = document.getElementById('symbology').value;
//     const data = document.getElementById('data').value;
//     const size = document.getElementById('size').value;

//     document.getElementById('barcode').innerHTML = '';

//     if (data.trim() === '') {
//         return;
//     }

//     if (symbology === 'QR') {
//         generateQRCode(data, size);
//     } else if (symbology === 'CODE128') {
//         generate1DBarcode(symbology, data, size);
//     }
// }

// function generate1DBarcode(format, data, size) {
//     const canvas = document.createElement('canvas');
//     JsBarcode(canvas, data, {
//         format: format,
//         width: 2 * size,
//         height: 100 * size,
//         displayValue: true
//     });
//     document.getElementById('barcode').appendChild(canvas);
// }

// function generateQRCode(data, size) {
//     const qrContainer = document.createElement('div');
//     new QRCode(qrContainer, {
//         text: data,
//         width: 100 * size,
//         height: 100 * size,
//     });
//     document.getElementById('barcode').appendChild(qrContainer);
// }

// function imprimeCodigo(){
//             Swal.fire({
//                 title: "IMP: " ,
//                 text:"Imprimiendo codigo",
//                 confirmButtonText: "Aceptar",
//                 confirmButtonColor: "#55b251"
//               });
// }