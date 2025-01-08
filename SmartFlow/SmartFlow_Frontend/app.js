import { showSection } from "./utils.js";
import { fetchAccounts, handleCreateAccount } from "./account.js";
import { loginUser, registerUser, logout } from "./auth.js";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  populateSourceAndDestinationAccounts,
  fetchTransactions,
} from "./transaction.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
    fetchAccounts();
    fetchTransactions();
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

  const depositForm = document.getElementById("deposit-form");
  if (depositForm) {
    depositForm.addEventListener("submit", depositMoney);
  }

  const withdrawForm = document.getElementById("withdraw-form");
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", withdrawMoney);
  }

  const transferForm = document.getElementById("transfer-form");
  if (transferForm) {
    transferForm.addEventListener("submit", transferMoney);
    populateSourceAndDestinationAccounts();
  }

  const logoutButton = document.querySelector("nav button[onclick='logout()']");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

window.showSection = showSection;
window.fetchAccounts = fetchAccounts;
window.handleCreateAccount = handleCreateAccount;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logout = logout;
