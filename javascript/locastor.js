const DB_NAME = 'sistemaCursos'; 


export function write(dbName = DB_NAME, data) {
  localStorage.setItem(dbName, JSON.stringify(data));
}


export function read(dbName = DB_NAME) {
  const dataString = localStorage.getItem(dbName);
  return dataString ? JSON.parse(dataString) : null;
}


export function initDB(dbName = DB_NAME) {
  let sistema = read(dbName);

  if (!sistema) {
    sistema = {
      administrativos: [
        {
          id: '2410',
          email: 'amarillojefferson@gmail.com',
          nombres: 'Andres',
          apellidos: 'Amarillo',
          telefono: '3175653014',
          cargo: 'SuperAdmin',
        }
      ],
      profesores: [],
      cursos: [],
      login: null 
    };

    write(dbName, sistema);
    console.log(' Base de datos creada en localStorage:', dbName);
  } else {
    console.log(' Base existente cargada:', dbName, sistema);
  }

  return sistema;
}
