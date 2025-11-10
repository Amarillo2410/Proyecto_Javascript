import { read, write, initDB } from "./locastor.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ admin.js cargado correctamente");

  // Inicializa la base de datos (si no existe, la crea)
  initDB();

  // Capturamos los elementos del DOM
  const [idInput, emailInput] = document.querySelectorAll(".inputs .formulario"); // los dos inputs
  const loginBtn = document.getElementById("entrarBtn"); // el botón
  const gestionSection = document.querySelector("section.oculto"); // el panel oculto

  // Agregar evento al botón de login
  loginBtn.addEventListener("click", () => {
    const id = idInput.value.trim();
    const email = emailInput.value.trim();

    // Verificamos si ambos campos fueron llenados
    if (!id || !email) {
      alert("Por favor, complete ambos campos.");
      return;
    }

    // Leemos la base de datos
    const sistema = read();

    // Buscamos el administrativo que coincida con el id y el email
    const adminEncontrado = sistema.administrativos.find(
      (admin) => admin.id === id && admin.email === email
    );

    if (adminEncontrado) {
      alert("✅ Sesión iniciada correctamente.");
      console.log("Admin autenticado:", adminEncontrado);

      // Ocultamos los inputs de login
      document.querySelector(".inputs").style.display = "none";

      // Mostramos la sección de gestión
      gestionSection.classList.remove("oculto");

      // Guardamos quién inició sesión (opcional)
      sistema.login = adminEncontrado;
      write("sistemaCursos", sistema);
    } else {
      alert("❌ Error: usuario no encontrado.");
    }
  });
});
