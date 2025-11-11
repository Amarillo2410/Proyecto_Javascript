// Local Storage - Sistema de Gestión LMS

export const DB_NAME = 'sistemaCursos';

/**logout
 * Escribe datos en localStorage
 */
export function write(dbName = DB_NAME, data) {
  try {
    localStorage.setItem(dbName, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(' Error escribiendo en localStorage:', error);
    return false;
  }
}

/**
 * Lee datos de localStorage
 */
export function read(dbName = DB_NAME) {
  try {
    const dataString = localStorage.getItem(dbName);
    return dataString ? JSON.parse(dataString) : null;
  } catch (error) {
    console.error(' Error leyendo localStorage:', error);
    return null;
  }
}

/**
 * Inicializa la base de datos con datos por defecto
 */
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
    console.log(' Base de datos creada en localStorage');
  } else {
    console.log(' Base de datos cargada');
  }

  return sistema;
}

/**
 * Obtiene el sistema de forma segura
 */
export function getSistema(dbName = DB_NAME) {
  let sistema = read(dbName);
  
  if (!sistema) {
    console.warn(' Sistema no encontrado, inicializando...');
    sistema = initDB(dbName);
  }
  
  return sistema;
}

/**
 * Cierra la sesión del usuario
 */
export function logout(dbName = DB_NAME) {
  try {
    const sistema = read(dbName);
    if (sistema) {
      sistema.login = null;
      write(dbName, sistema);
      return true;
    }
    return false;
  } catch (error) {
    console.error(' Error al cerrar sesión:', error);
    return false;
  }
}

/**
 * Verifica si hay una sesión activa
 */
export function verificarSesion(dbName = DB_NAME) {
  const sistema = read(dbName);
  return sistema && sistema.login !== null;
}

/**
 * Obtiene el usuario logueado
 */
export function getUsuarioActual(dbName = DB_NAME) {
  const sistema = read(dbName);
  return sistema ? sistema.login : null;
}