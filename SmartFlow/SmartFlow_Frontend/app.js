import { showSection } from "./utils.js";
import { fetchAccounts, handleCreateAccount } from "./account.js";
import { loginUser, registerUser, logout } from "./auth.js";
import { depositMoney, withdrawMoney } from "./transaction.js";
import { fetchTransactions } from "./transaction.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
    fetchAccounts();
  } else {
    showSection("login");
  }

  // Event-Listener für Formulare und Buttons
  document.getElementById("login-form").addEventListener("submit", loginUser);
  document
    .getElementById("register-form")
    .addEventListener("submit", registerUser);
  document
    .getElementById("create-account-form")
    .addEventListener("submit", handleCreateAccount);

  // Event-Listener für Transaktionsformulare
  const depositForm = document.getElementById("deposit-form");
  if (depositForm) {
    depositForm.addEventListener("submit", depositMoney);
  }

  const withdrawForm = document.getElementById("withdraw-form");
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", withdrawMoney);
  }

  // Logout-Button
  const logoutButton = document.querySelector("nav button[onclick='logout()']");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
    fetchAccounts();
    fetchTransactions(); // Lade die Transaktionen beim Start
  } else {
    showSection("login");
  }

  document.getElementById("login-form").addEventListener("submit", loginUser);
  document
    .getElementById("register-form")
    .addEventListener("submit", registerUser);
  document
    .getElementById("transaction-form")
    .addEventListener("submit", handleTransaction);
  document
    .getElementById("create-account-form")
    .addEventListener("submit", handleCreateAccount);
});

// Funktionen global verfügbar machen (für onclick im HTML)
window.showSection = showSection;
window.fetchAccounts = fetchAccounts;
window.handleCreateAccount = handleCreateAccount;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logout = logout;
