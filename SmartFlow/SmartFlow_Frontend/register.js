function showSection(sectionId) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

document
  .getElementById("register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const registerMessage = document.getElementById("register-message");

    try {
      const response = await fetch("https://localhost:7143/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(
          "Registrierung fehlgeschlagen. Benutzername könnte bereits vergeben sein."
        );
      }

      registerMessage.textContent =
        "Registrierung erfolgreich! Sie können sich jetzt einloggen.";
      registerMessage.style.color = "green";

      showSection("login");
    } catch (error) {
      registerMessage.textContent = error.message;
      registerMessage.style.color = "red";
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("to-register").addEventListener("click", () => {
    showSection("register");
  });

  document.getElementById("to-login").addEventListener("click", () => {
    showSection("login");
  });
});
