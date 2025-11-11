import { logout } from './locastor.js';

document.addEventListener('DOMContentLoaded', () => {
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      if (confirm('¿Estás seguro de cerrar sesión?')) {
        logout();
        alert('Sesión cerrada correctamente');
        window.location.reload();
      }
    });
  }
});