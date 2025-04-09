class MyFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
    
        <footer class="page-footer">
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <h5 class="white-text">Footer Content</h5>
                <p class="grey-text text-lighten-4">Sistema de inventario</p>
              </div>              
            </div>
          </div>
          <div class="footer-copyright">
            <div class="container">        
             © ${new Date().getFullYear()} Todos los derechos reservados   
            <a class="white-text text-lighten-4 right" href="#!"> BREMEN</a>
            </div>
          </div>
        </footer>
      `;
    }
  }
  
  // Registrar el componente personalizado
  customElements.define('my-footer', MyFooter);