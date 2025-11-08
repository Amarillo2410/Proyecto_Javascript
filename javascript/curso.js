class Curso extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.name = '';
    this.teacher = '';
    this.imagen = '';
    this.render();
  }

  static get observedAttributes() {
    return ['name', 'teacher', 'imagen'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this[attrName] = newVal;
    this.render();
  }

  render() {

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          background: #2f4f4f;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          width: 230px;
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .texto {
          text-align: center;
          color: #fff;
        }
        .name {
          font-size: 1.1em;
          font-weight: bold;
        }
        .teacher {
          font-size: 0.9em;
          color: #d0d0d0;
        }
      </style>

      <div class="card">
        <img src="${this.imagen || ''}" alt="imagen del curso">
        <div class="texto">
          <p class="name">${this.name || ''}</p>
          <p class="teacher">${this.teacher || ''}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('tarjetas-cursos', Curso);
