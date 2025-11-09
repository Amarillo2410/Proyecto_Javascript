export function write( dbName, data ){
    const dataString = JSON.stringify(data);
    localStorage.setItem(dbName, dataString);
}

export function read(dbName){
    const dataObject = localStorage.getItem(dbName);
    const data = dataObject == null ? [] : JSON.parse(dataObject);
     return data;
}

export function initDB(dbName, defaultData = []){
    const name  = "sistemaCurso"
    let sistema = read(dbName);

     if (!sistema) {
    sistema = {
      administrativos: [
        { id: "2410", email: "amarillo@gmail.com" } 
      ],
      profesores: [],
      cursos: [],
      login: null
    };
    write(dbName, sistema);
    
  } else {
    console.log("📦 Base existente:", sistema);
  }

  return sistema;
}