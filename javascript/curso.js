class curso extends HTMLElement{
    constructor(){
    super();
    this.name;
    this.teacher;
    this.imagen;

    const cursos = this.attachShadow({mode:'open'});

    cursos.innerHTML =`     
    <style>
        .card{
        background: #2f4f4f;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
        }
    </style>
    
    <div class="card">  
        <imagen src="${this.imagen} alt=imagen-curso class="curso">            
    </div>
    <div class="texto">  
        <p>${this.name}</p>
        <p>${this.teacher}</p>
    </div>

    `
    }
    
    static get observedAttributes(){
        return['name','teacher','imagen']
    }

    attributeChangedCallback(attrName,oldVal,newVal){
        switch (attrName){ 
            case 'name': 
                this.name = newVal;
                break;
            case 'teacher':
                this.teacher = newVal;
                break;
            case 'imagen':
                this.imagen = newVal;
                break;
            }
        }
    
}

customElements.define('tarjetas', curso);