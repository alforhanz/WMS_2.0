/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  $('.dropdown-trigger').dropdown();
  var elems = document.querySelectorAll('.dropdown-trigger');
  getDataDash(); 
});
    /////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////
  ////////////////////////////////////
 ////// 	DATOS PEDIDOS /////////////
////////////////////////////////////

function getDataDash() {
  var usuarioSinComillas = localStorage.getItem('username');
  var usuario = usuarioSinComillas.replace(/"/g, "");
  const params = "?pUsuario=" + usuario;
 

  fetch(env.API_URL + "wmsgetdashinfo/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      if (result.msg === "SUCCESS") {        
        if (result.data.length > 0) {
          ArrayData = result.data[0];
          document.getElementById("pedidos_solicitados").innerText = parseFloat(ArrayData.PEDIDOS_SOLICITADOS).toFixed(2);
          document.getElementById("articulos_solicitados").innerText = parseFloat(ArrayData.CANT_ARTICULOS_SOLICITADOS).toFixed(2);
          document.getElementById("articulos_pendientes").innerText = parseFloat(ArrayData.CANT_ARTICULOS_PENDIENTES).toFixed(2);
          document.getElementById("articulos_prioridad").innerText = parseFloat(ArrayData.ARTICULOS_CON_PRIORIDAD).toFixed(2);   
          generarGraficas();     
        } else {
          document.getElementById("pedidos_solicitados").innerText = parseFloat(ArrayData.PEDIDOS_SOLICITADOS || 0).toFixed(2);
          document.getElementById("articulos_solicitados").innerText = parseFloat(ArrayData.CANT_ARTICULOS_SOLICITADOS || 0).toFixed(2);
          document.getElementById("articulos_pendientes").innerText = parseFloat(ArrayData.CANT_ARTICULOS_PENDIENTES || 0).toFixed(2);
          document.getElementById("articulos_prioridad").innerText = parseFloat(ArrayData.ARTICULOS_CON_PRIORIDAD || 0).toFixed(2);      
          generarGraficas();  
          
          // Verificar si el mensaje no ha sido mostrado anteriormente usando localStorage
          if (!localStorage.getItem('swalMessageShown')) {
            Swal.fire({
              icon: "info",
              title: "Información",            
              text: "La información mostrada en el tablero de datos es de carácter demostrativo, debido a que en estos momentos no tiene pedidos o no cuenta con datos para mostrar.",
              confirmButtonColor: "#28a745",
            });
            localStorage.setItem('swalMessageShown', true); // Marcar que el mensaje ha sido mostrado
          }
          
          document.getElementById("carga").innerHTML = "";
          return false;
        }
      }
    });
}
    //////////////////////////////////////
   ////// 	GRAFICAS PEDIDOS ////////////
  //////////////////////////////////////
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function generarGraficas() {
    var usuarioSinComillas = localStorage.getItem('username');
    var usuario = usuarioSinComillas.replace(/"/g, "");
    const params = "?pUsuario=" + usuario;
  
    fetch(env.API_URL + "wmsgetdashinfo/2" + params, myInit)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error);
        mostrarDatosSimulados(); // En caso de error, mostrar datos simulados
      })
      .then((result) => {
        if (result.msg === "SUCCESS") {
          if (result.data.length > 0) {
            mostrarGraficas(result.data); // Mostrar gráficas con datos reales
          } else {
            mostrarDatosSimulados(); // Mostrar datos simulados si no hay datos reales
          }
        } else {
          console.error("Error en la respuesta de la API:", result.msg);
          mostrarDatosSimulados(); // Mostrar datos simulados en caso de respuesta de error desde la API
        }
      });
  }
 /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////// 
  function mostrarGraficas(data) {
    const ArrayData = data;
  
    // Crear arrays para los datos de la gráfica
    const descriptions = ArrayData.map(item => item.DESCRIPCION);
    const cantArticulosSolicitados = ArrayData.map(item => parseFloat(item.CANT_ARTICULOS_SOLICITADOS));
    const cantArticulosPendientes = ArrayData.map(item => Math.abs(parseFloat(item.CANT_ARTICULOS_PENDIENTES))); // Tomar el valor absoluto para pendientes
  
    // Crear el HTML para la sección de gráficas
    const graficaHTML = `
      <!-- GRAFICAS -->
      <div class="row">
        <h5 class="menuTitulo">Estadísticas y Gráficos</h5>
        <div class="collection">
          <div class="dash-style" style="padding: 5%;">
            <div class="col-md-12 col-sm-12 bg-white">
              <div class="x_title">
                <h5>Distribución de Artículos Solicitados</h5>
                <div class="clearfix"></div>
              </div>
              <div class="col-md-12 col-sm-12">
                <canvas id="myPieChart" width="400" height="200"></canvas>
              </div>
            </div>
          </div>
          <div class="dash-style" style="padding: 5%; margin-top: 20px;">
            <div class="col-md-12 col-sm-12 bg-white">
              <div class="x_title">
                <h5>Artículos Solicitados y Pendientes según clase</h5>
                <div class="clearfix"></div>
              </div>
              <div class="col-md-12 col-sm-12">
                <canvas id="myChart" width="400" height="200"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // Insertar el HTML en el DOM
    document.getElementById('graficas').innerHTML = graficaHTML;
  
    // Renderizar la gráfica de barras
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: descriptions,
        datasets: [
          {
            label: 'Cant. Artículos Solicitados',
            data: cantArticulosSolicitados,
            backgroundColor: 'rgb(124, 201, 141)',
            borderColor: 'rgb(124, 201, 141)',
            borderWidth: 1
          },
          {
            label: 'Cant. Artículos Pendientes',
            data: cantArticulosPendientes,
            backgroundColor: 'rgb(128, 132, 135)',
            borderColor: 'rgb(128, 132, 135)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Renderizar la gráfica de anillo
    const pieCtx = document.getElementById('myPieChart').getContext('2d');
    const myPieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: descriptions,
        datasets: [{
          data: cantArticulosSolicitados,
          backgroundColor: descriptions.map((_, index) => `hsl(${index * 360 / descriptions.length}, 70%, 50%)`), // Generar colores variados
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }   
    ///////////////////////////////////////////
   //////        DASH Ordenes de Compras  ////
  ///////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function getDataDashOC() {
  var usuarioSinComillas = localStorage.getItem('username');
  var usuario = usuarioSinComillas.replace(/"/g, "");
  const params = "?pUsuario=" + usuario;

  fetch(env.API_URL + "wmsgetdashinfo/1" + params, myInit)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((result) => {
      if (result.msg === "SUCCESS") {      
        if (result.data.length > 0) {
          ArrayData = result.data[0];
          document.getElementById("pedidos_solicitados").innerText = parseFloat(ArrayData.PEDIDOS_SOLICITADOS).toFixed(2);
          document.getElementById("articulos_solicitados").innerText = parseFloat(ArrayData.CANT_ARTICULOS_SOLICITADOS).toFixed(2);
          document.getElementById("articulos_pendientes").innerText = parseFloat(ArrayData.CANT_ARTICULOS_PENDIENTES).toFixed(2);
          document.getElementById("articulos_prioridad").innerText = parseFloat(ArrayData.ARTICULOS_CON_PRIORIDAD).toFixed(2);        
         generarGraficasOC();
        } else {
          document.getElementById("pedidos_solicitados").innerText = parseFloat(ArrayData.PEDIDOS_SOLICITADOS || 0).toFixed(2);
          document.getElementById("articulos_solicitados").innerText = parseFloat(ArrayData.CANT_ARTICULOS_SOLICITADOS || 0).toFixed(2);
          document.getElementById("articulos_pendientes").innerText = parseFloat(ArrayData.CANT_ARTICULOS_PENDIENTES || 0).toFixed(2);
          document.getElementById("articulos_prioridad").innerText = parseFloat(ArrayData.ARTICULOS_CON_PRIORIDAD || 0).toFixed(2);      
          generarGraficasOC();
          // Verificar si el mensaje no ha sido mostrado anteriormente usando localStorage
          if (!localStorage.getItem('swalMessageShown')) {
            Swal.fire({
              icon: "info",
              title: "Información",            
              text: "La información mostrada en el tablero de datos es de carácter demostrativo, debido a que en estos momentos no tiene pedidos o no cuenta con datos para mostrar.",
              confirmButtonColor: "#28a745",
            });
           
            localStorage.setItem('swalMessageShown', true); // Marcar que el mensaje ha sido mostrado
          }
          
          document.getElementById("carga").innerHTML = "";
          return false;
        }         
      }
    });
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function generarGraficasOC() {
  var usuarioSinComillas = localStorage.getItem('username');
  var usuario = usuarioSinComillas.replace(/"/g, "");
  const params = "?pUsuario=" + usuario;

  fetch(env.API_URL + "wmsgetdashinfo/2" + params, myInit)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
      mostrarDatosSimuladosOC(); // En caso de error, mostrar datos simulados
    })
    .then((result) => {
      if (result.msg === "SUCCESS") {
        if (result.data.length > 0) {
          mostrarGraficasOC(result.data); // Mostrar gráficas con datos reales
        } else {
          mostrarDatosSimuladosOC(); // Mostrar datos simulados si no hay datos reales
        }
      } else {
        console.error("Error en la respuesta de la API:", result.msg);
        mostrarDatosSimuladosOC(); // Mostrar datos simulados en caso de respuesta de error desde la API
      }
    });
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function mostrarGraficasOC(data) {
  const ArrayData = data;

  // Crear arrays para los datos de la gráfica
  const descriptions = ArrayData.map(item => item.DESCRIPCION);
  const cantArticulosSolicitados = ArrayData.map(item => parseFloat(item.CANT_ARTICULOS_SOLICITADOS));
  const cantArticulosPendientes = ArrayData.map(item => Math.abs(parseFloat(item.CANT_ARTICULOS_PENDIENTES))); // Tomar el valor absoluto para pendientes

  // Crear el HTML para la sección de gráficas
  const graficaHTML = `
    <!-- GRAFICAS -->
    <div class="row">
      <h5 class="menuTitulo">Estadísticas y Gráficos De Ordenes de Compras</h5>
      <div class="collection">
        <div class="dash-style" style="padding: 5%;">
          <div class="col-md-12 col-sm-12 bg-white">
            <div class="x_title">
              <h5>Distribución de Artículos Solicitados en O/C</h5>
              <div class="clearfix"></div>
            </div>
            <div class="col-md-12 col-sm-12">
              <canvas id="myPieChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
        <div class="dash-style" style="padding: 5%; margin-top: 20px;">
          <div class="col-md-12 col-sm-12 bg-white">
            <div class="x_title">
              <h5>Artículos Solicitados y Pendientes de O/C según clase</h5>
              <div class="clearfix"></div>
            </div>
            <div class="col-md-12 col-sm-12">
              <canvas id="myChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insertar el HTML en el DOM
  document.getElementById('graficas').innerHTML = graficaHTML;

  // Renderizar la gráfica de barras
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: descriptions,
      datasets: [
        {
          label: 'Cant. Artículos Solicitados',
          data: cantArticulosSolicitados,
          backgroundColor: 'rgb(124, 201, 141)',
          borderColor: 'rgb(124, 201, 141)',
          borderWidth: 1
        },
        {
          label: 'Cant. Artículos Pendientes',
          data: cantArticulosPendientes,
          backgroundColor: 'rgb(128, 132, 135)',
          borderColor: 'rgb(128, 132, 135)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Renderizar la gráfica de anillo
  const pieCtx = document.getElementById('myPieChart').getContext('2d');
  const myPieChart = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: descriptions,
      datasets: [{
        data: cantArticulosSolicitados,
        backgroundColor: descriptions.map((_, index) => `hsl(${index * 360 / descriptions.length}, 70%, 50%)`), // Generar colores variados
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function mostrarDatosSimuladosOC() {
  // Simulación de datos
  // Crear el HTML para la sección de gráficas
  const result = {
    data: [
      { DESCRIPCION: "Clase A", CANT_ARTICULOS_SOLICITADOS: 20, CANT_ARTICULOS_PENDIENTES: 5 },
      { DESCRIPCION: "Clase B", CANT_ARTICULOS_SOLICITADOS: 15, CANT_ARTICULOS_PENDIENTES: 8 },
      { DESCRIPCION: "Clase C", CANT_ARTICULOS_SOLICITADOS: 30, CANT_ARTICULOS_PENDIENTES: 10 },
      { DESCRIPCION: "Clase D", CANT_ARTICULOS_SOLICITADOS: 10, CANT_ARTICULOS_PENDIENTES: 3 }
    ]
  };

  mostrarGraficasOC(result.data); // Llamar a la función mostrarGraficas con datos simulados
}
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
function mostrarDatosSimulados() {
  // Simulación de datos
  // Crear el HTML para la sección de gráficas
  const result = {
    data: [
      { DESCRIPCION: "Clase A", CANT_ARTICULOS_SOLICITADOS: 20, CANT_ARTICULOS_PENDIENTES: 5 },
      { DESCRIPCION: "Clase B", CANT_ARTICULOS_SOLICITADOS: 15, CANT_ARTICULOS_PENDIENTES: 8 },
      { DESCRIPCION: "Clase C", CANT_ARTICULOS_SOLICITADOS: 30, CANT_ARTICULOS_PENDIENTES: 10 },
      { DESCRIPCION: "Clase D", CANT_ARTICULOS_SOLICITADOS: 10, CANT_ARTICULOS_PENDIENTES: 3 }
    ]
  };

  mostrarGraficas(result.data); // Llamar a la función mostrarGraficas con datos simulados
}
