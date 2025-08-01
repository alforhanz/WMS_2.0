// document.addEventListener("DOMContentLoaded", function () {
//   console.log('DOM cargado imp code bar...');
//   let codigo = localStorage.getItem('impCodeBar');
//   let descripcion = localStorage.getItem('descripcionImpCode');
//   const inputData = document.getElementById('data');
//   const descripcionElement = document.getElementById('descripcion');
  
//   if (codigo && inputData) {
//     inputData.value = codigo; // Asignar el valor al input
//     generateBarcode(); // Generar el código de barras automáticamente
//   }

//   if (descripcion && descripcionElement) {
//     descripcionElement.textContent = descripcion; // Asignar la descripción al elemento <p>
//   }

//   // Inicializar botones de Materialize
//   M.AutoInit();

//   // Añadir evento al botón de impresión
//   const printButton = document.getElementById('printBarcode');
//   if (printButton) {
//     printButton.addEventListener('click', imprimeCodigo);
//   }
// });

// function generateBarcode() {
//     const symbology = document.getElementById('symbology').value;
//     const data = document.getElementById('data').value;
//     const size = parseFloat(document.getElementById('size').value);
//     const descripcion = localStorage.getItem('descripcionImpCode'); // Obtener descripción directamente

//     const barcodeContainer = document.getElementById('barcode');
//     barcodeContainer.innerHTML = '';

//     if (data.trim() === '') {
//         return;
//     }

//     const wrapper = document.createElement('div');
//     wrapper.style.textAlign = 'center';

//     if (symbology === 'QR') {
//         generateQRCode(data, size, wrapper);
//     } else if (symbology === 'CODE128') {
//         generate1DBarcode(symbology, data, size, wrapper);
//     }

//     // Agregar la descripción debajo del código
//     if (descripcion) {
//         const descElement = document.createElement('p');
//         descElement.textContent = descripcion;
//         descElement.style.marginTop = '10px';
//         descElement.style.fontSize = '16px';
//         descElement.style.fontFamily = 'Arial, sans-serif';
//         wrapper.appendChild(descElement);
//     }

//     barcodeContainer.appendChild(wrapper);
// }

// function generate1DBarcode(format, data, size, container) {
//     const canvas = document.createElement('canvas');
//     JsBarcode(canvas, data, {
//         format: format,
//         width: 2 * size,
//         height: 100 * size,
//         displayValue: true
//     });
//     container.appendChild(canvas);
// }

// function generateQRCode(data, size, container) {
//     const qrContainer = document.createElement('div');
//     new QRCode(qrContainer, {
//         text: data,
//         width: 150 * size,
//         height: 150 * size
//     });
//     container.appendChild(qrContainer);
// }

// function imprimeCodigo() {
//     const data = document.getElementById('data').value;
//     const symbology = document.getElementById('symbology').value;
//     const size = parseFloat(document.getElementById('size').value);
//     const descripcion = localStorage.getItem('descripcionImpCode');

//     if (!data.trim()) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Sin datos',
//             text: 'Por favor, ingrese un valor para generar el código de barras antes de imprimir.',
//             confirmButtonText: 'Aceptar',
//             confirmButtonColor: '#55b251'
//         });
//         return;
//     }

//     // Crear una nueva ventana para imprimir
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//         <html>
//         <head>
//             <title>Imprimir Código de Barras</title>
//             <style>
//                 body { 
//                     display: flex; 
//                     flex-direction: column; 
//                     justify-content: center; 
//                     align-items: center; 
//                     height: 100vh; 
//                     margin: 0; 
//                     font-family: Arial, sans-serif; 
//                 }
//                 canvas, div { 
//                     margin: 0 auto; 
//                 }
//                 p {
//                     margin-top: 10px;
//                     font-size: 10px;
//                     text-align: center;
//                 }
//             </style>
//         </head>
//         <body>
//             <div id="printBarcode"></div>
//             <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
//             <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
//             <script>
//                 function generateBarcodeForPrint() {
//                     const data = "${data}";
//                     const size = ${size};
//                     const symbology = "${symbology}";
//                     const descripcion = "${descripcion || ''}";
//                     const printContainer = document.getElementById('printBarcode');
//                     const wrapper = document.createElement('div');
//                     wrapper.style.textAlign = 'center';
                    
//                     if (symbology === 'QR') {
//                         const qrContainer = document.createElement('div');
//                         new QRCode(qrContainer, {
//                             text: data,
//                             width: 150 * size,
//                             height: 150 * size
//                         });
//                         wrapper.appendChild(qrContainer);
//                     } else if (symbology === 'CODE128') {
//                         const canvas = document.createElement('canvas');
//                         JsBarcode(canvas, data, {
//                             format: symbology,
//                             width: 2 * size,
//                             height: 100 * size,
//                             displayValue: true
//                         });
//                         wrapper.appendChild(canvas);
//                     }

//                     if (descripcion) {
//                         const descElement = document.createElement('p');
//                         descElement.textContent = descripcion;
//                         wrapper.appendChild(descElement);
//                     }

//                     printContainer.appendChild(wrapper);
//                 }
//                 generateBarcodeForPrint();
//                 window.onload = function() {
//                     window.print();
//                     window.onafterprint = function() {
//                         window.close();
//                     };
//                 };
//             </script>
//         </body>
//         </html>
//     `);
//     printWindow.document.close();

//     // Mostrar notificación de impresión
//     Swal.fire({
//         icon: 'info',
//         title: 'Imprimiendo',
//         text: 'Imprimiendo código...',
//         confirmButtonText: 'Aceptar',
//         confirmButtonColor: '#55b251'
//     });
// }

