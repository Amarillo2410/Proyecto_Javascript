import { read, initDB, verificarSesion, getUsuarioActual, guardarSesion } from "./locastor.js";

document.addEventListener("DOMContentLoaded", () => {
  initDB();

  const loginSection = document.querySelector(".inputs");
  const gestionSection = document.querySelector("section.oculto");

 
  if (verificarSesion()) {
    const usuarioActual = getUsuarioActual();
    console.log(" Sesión activa:", usuarioActual);
    loginSection.style.display = "none";
    gestionSection.classList.remove("oculto");
  }

  
  const [idInput, emailInput] = document.querySelectorAll(".inputs .formulario");
  const loginBtn = document.getElementById("entrar");

  loginBtn.addEventListener("click", () => {
    const id = idInput.value.trim();
    const email = emailInput.value.trim();

    if (!id || !email) {
      alert(" Por favor, complete ambos campos.");
      return;
    }

    const sistema = read();

    const profeEncontrado = sistema.profesores.find(
      (profe) => profe.id === id && profe.email === email
    );

    if (profeEncontrado) {
      alert(" Sesión iniciada correctamente");
      console.log("Admin autenticado:", profeEncontrado);

      
      guardarSesion(profeEncontrado);

      
      loginSection.style.display = "none";
      gestionSection.classList.remove("oculto");
    } else {
      alert(" Usuario no encontrado. Verifica tus credenciales.");
    }
  });

  function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
 }

 window.showTab = showTab;

});