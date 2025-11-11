import { read, write, initDB, DB_NAME } from "./locastor.js";

document.addEventListener("DOMContentLoaded", () => {
  initDB();

  const [idInput, emailInput] = document.querySelectorAll(".inputs .formulario");
  const loginBtn = document.getElementById("entrar");
  const gestionSection = document.querySelector("section.oculto");

  loginBtn.addEventListener("click", () => {
    const id = idInput.value.trim();
    const email = emailInput.value.trim();

    if (!id || !email) {
      alert("Por favor, complete ambos campos.");
      return;
    }

    const sistema = read();

    const adminEncontrado = sistema.administrativos.find(
      (admin) => admin.id === id && admin.email === email
    );

    if (adminEncontrado) {
      alert("✅ Sesión iniciada correctamente");
      console.log("Admin autenticado:", adminEncontrado);

      document.querySelector(".inputs").style.display = "none";
      gestionSection.classList.remove("oculto");

      sistema.login = adminEncontrado;
      write(DB_NAME, sistema);
    } else {
      alert("❌ Usuario no encontrado. Verifica tus credenciales.");
    }
  });
});