import { logout, DB_NAME } from './locastor.js';

document.addEventListener('DOMContentLoaded', () => {
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        logout(DB_NAME);
        alert(' Sesión cerrada correctamente');
        window.location.reload();
      }
    });
  }
});