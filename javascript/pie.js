class pie extends HTMLElement {
    constructor() {
        super();
        const footer = this.attachShadow({ mode: 'open' });
    footer.innerHTML = `
    <style>
        footer {
            background-color: #222;
                color: #fff;
                text-align: center;
                padding: 25px 10px;
                font-family: Arial, sans-serif;
                font-size: 14px;
            }

            footer a {
                color: #fff;
                text-decoration: none;
                margin: 0 5px;
            }

            footer a:hover {
                text-decoration: underline;
            }

            .footer-content p {
                margin: 5px 0;
            }
        </style>


        <div class="footer">
            <p> 1998 - 2025 Relojería Tiempo Fino. Todos los derechos reservados.</p>
            <p>Creado por: Alejandro Montoya</p>
            <p>Síguenos en: 
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">Twitter</a>
            </p>
        </div>

    `;}
    }
    
customElements.define('pie-pagina', pie);