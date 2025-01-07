import { showSection } from "./utils.js";

export async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://localhost:7143/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login fehlgeschlagen.");
    const token = await response.text();
    localStorage.setItem("authToken", token);
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
    fetchAccounts();
  } catch (error) {
    alert(error.message);
  }
}

export async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch("https://localhost:7143/api/Auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Registrierung fehlgeschlagen.");
    alert("Registrierung erfolgreich.");
    showSection("login");
  } catch (error) {
    alert(error.message);
  }
}

export function logout() {
  localStorage.removeItem("authToken");
  document.getElementById("menu-bar").style.display = "none";
  showSection("login");
}
