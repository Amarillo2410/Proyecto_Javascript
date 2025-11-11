export const DB_NAME = 'sistemaCursos';
export const SESSION_KEY = 'loginActual';

export function write(dbName = DB_NAME, data) {
  try {
    localStorage.setItem(dbName, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(' Error escribiendo en localStorage:', error);
    return false;
  }
}

export function read(dbName = DB_NAME) {
  try {
    const dataString = localStorage.getItem(dbName);
    return dataString ? JSON.parse(dataString) : null;
  } catch (error) {
    console.error(' Error leyendo localStorage:', error);
    return null;
  }
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
      cursos: []
    };

    write(dbName, sistema);
    console.log(' Base de datos creada en localStorage');
  } else {
    console.log(' Base de datos cargada');
  }

  return sistema;
}

export function getSistema(dbName = DB_NAME) {
  let sistema = read(dbName);
  
  if (!sistema) {
    console.warn(' Sistema no encontrado, inicializando...');
    sistema = initDB(dbName);
  }
  
  return sistema;
}

export function guardarSesion(usuario) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    return true;
  } catch (error) {
    console.error(' Error al guardar sesión:', error);
    return false;
  }
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    return true;
  } catch (error) {
    console.error(' Error al cerrar sesión:', error);
    return false;
  }
}

export function verificarSesion() {
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

export function getUsuarioActual() {
  try {
    const sesionString = sessionStorage.getItem(SESSION_KEY);
    return sesionString ? JSON.parse(sesionString) : null;
  } catch (error) {
    console.error(' Error al obtener sesión:', error);
    return null;
  }
}