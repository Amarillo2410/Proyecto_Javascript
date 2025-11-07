class curso extends HTMLElement{
    constructor(){
    super();
    this.Name
    this.Teacher
    this.IMG;

    const cursos = this.attachShadow({mode:'open'});
    } 
    
    static get observedAttributes(){
        return['Name','Teacher','IMG']
    }

    attributeChangedCallback(attrName,oldVal,newVal){
        switch (attrName){ 
            case 'Name': 
                this.Name = newVal;
                break;
            case 'Teacher':
                this.Teacher = newVal;
                break;
            case 'IMG':
                this.IMG = newVal;
                break;
            }
        }

    cursos.innerHTML =`     
        <style>

        </style>


        `

}