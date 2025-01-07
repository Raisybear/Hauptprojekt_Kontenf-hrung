import { showSection } from "./utils.js";
import { fetchAccounts, handleCreateAccount } from "./account.js";
import { loginUser, registerUser, logout } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
    fetchAccounts();
  } else {
    showSection("login");
  }

  document.getElementById("login-form").addEventListener("submit", loginUser);
  document
    .getElementById("register-form")
    .addEventListener("submit", registerUser);
  document
    .getElementById("create-account-form")
    .addEventListener("submit", handleCreateAccount);
});

// Funktionen global verfügbar machen
window.showSection = showSection;
window.fetchAccounts = fetchAccounts;
window.handleCreateAccount = handleCreateAccount;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logout = logout; // HIER wird logout global verfügbar gemacht
