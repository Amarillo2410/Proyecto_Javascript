// Importamos las funciones  para poder leer y escribir
import { read, write, DB_NAME } from './local.js';

// para poder acceder a los elementos
document.addEventListener('DOMContentLoaded', () => {

  // Obtenemos el botón para agreagar un nuevo administrativo
  const addAdminBtn = document.getElementById('addAdmin');

  if (addAdminBtn) {
    addAdminBtn.addEventListener('click', agregarAdministrativo);
  }

  function agregarAdministrativo() {
    // Obtenemos los valores de los inputs (usando querySelectorAll)
    const inputs = document.querySelectorAll('.gestion-administrativos input');
    const [idInput, nombreInput, apellidoInput, emailInput, telefonoInput, cargoInput] = inputs;

    // Leemos el contenido actual dentro del localStorage
    const sistema = read(DB_NAME);

    // miramos que todos los campos estén llenos
    if (!idInput.value || !nombreInput.value || !apellidoInput.value || 
        !emailInput.value || !telefonoInput.value || !cargoInput.value) {
      alert(' Por favor completa todos los campos.');
      return;
    }

    // Verificar si el ID ya existe
    const existe = sistema.administrativos.some(admin => admin.id === idInput.value);
    if (existe) {
      alert(' Ya existe un administrativo con ese ID.');
      return;
    }

    // Creamos el nuevo administrativo
    const nuevoAdmin = {
      id: idInput.value,
      nombres: nombreInput.value,
      apellidos: apellidoInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      cargo: cargoInput.value
    };

    // Agregamos el nuevo admin a la lista existente
    sistema.administrativos.push(nuevoAdmin);

    // Guardamos los cambios en localstorage
    write(DB_NAME, sistema);

    // Mensaje de éxito
    alert(' Nuevo administrativo agregado correctamente.');

    // volver los inputs vacios
    inputs.forEach(input => input.value = '');
  }
});
