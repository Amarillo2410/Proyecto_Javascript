class titulo extends HTMLElement {
    constructor() {
        super();
        const title = this.attachShadow({ mode: 'open' });
     
    title.innerHTML = `
      <style>
        section {
          background-color: #1e3a56;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 40px;
        }
        .titulo img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        nav {
          display: flex;
          gap: 20px;
        }
        nav a {
          color: white;
          text-decoration: none;
          font-weight: 500;
        }
      </style>

      <section>
        <div class="titulo">
          <img src="/assets/imagenes/ABC.png" alt="Logo">
        </div>
        <nav>
          <a href="index.html">Inicio</a>
          <a href="/pages/Cursos.html">Servicios</a>
          <a href="/pages/Aministrativos.html">Administrativos</a>
        </nav>
      </section>
     `; 
    } 
}
customElements.define('mi-titulo', titulo);