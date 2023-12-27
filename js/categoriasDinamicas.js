let htm = "";

fetch(env.API_URL + "clasificacionesv", {
  method: "GET", // *GET, POST, PUT, DELETE, etc.
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})
  .then((response) => response.json())
  .then((result) => {
    if (result.msg === "SUCCESS") {
      if (result.categorias.length != 0) {
        let hasta = result.categorias.length;
        ArrayData = result.categorias;
        for (let i = 0; i < hasta; i++) {
          if (ArrayData[i]) {
            var descrip = ArrayData[i].DESCRIPCION.replace(/[0-9]/g, "");
            // console.log(descrip);
            if (descrip === "SERVICIOS DE INSTAL DE ACCESORIOS") {
              htm += `<a onclick="secciones('1040')" class="collection-item">SERV. INSTAL DE ACCESORIOS
              <i class="icon-chevron-right-circle right"></i></a>`;
            } else {
              htm += `<a onclick="secciones('${ArrayData[i].CLASIFICACION}')" class="collection-item">${descrip}
              <i class="icon-chevron-right-circle right"></i></a>`;
            }
          }
        }
        //INSERTAR CODIGO HTML A CONTENEDOR
        document.getElementById("menuCategorias").innerHTML = htm;
      } else {
        console.log("No hay registros");
      }
      document.getElementById("carga").innerHTML = "";
    } else {
      console.log("Error");
      document.getElementById("carga").innerHTML = "";
    }
  });
