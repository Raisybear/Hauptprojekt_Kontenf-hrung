document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
    fetchAccounts(); // Zeige Konten direkt beim Laden des Dashboards
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

function showSection(sectionId) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });
  document.getElementById(sectionId).classList.add("active");
  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "accounts") {
    fetchAccounts(); // Aktualisiere die Kontenübersicht, wenn die Seite "Konten" angezeigt wird
  }
}

async function loginUser(event) {
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
    fetchAccounts(); // Zeige Konten nach dem Login
  } catch (error) {
    alert(error.message);
  }
}

async function registerUser(event) {
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

async function fetchAccounts() {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://localhost:7143/api/Konten/user/1", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Konten konnten nicht geladen werden.");

    const accounts = await response.json();
    renderAccounts(accounts); // Zeige die Konten im Dashboard und in der Kontenübersicht
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Konten.");
  }
}

function renderAccounts(accounts) {
  const accountList = document.getElementById("account-list");
  accountList.innerHTML = ""; // Leere die Liste, bevor neue Konten eingefügt werden

  accounts.forEach((account) => {
    const row = document.createElement("li");
    row.textContent = `${account.name}: ${account.geldbetrag.toFixed(2)} €`;
    accountList.appendChild(row);
  });
}

async function handleCreateAccount(event) {
  event.preventDefault();

  const accountName = document.getElementById("account-name").value;
  const initialAmount = parseFloat(
    document.getElementById("initial-amount").value
  );

  if (!accountName || isNaN(initialAmount)) {
    alert("Bitte alle Felder korrekt ausfüllen.");
    return;
  }

  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch("https://localhost:7143/api/Konten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: accountName,
        geldbetrag: initialAmount,
        token: token,
      }),
    });

    if (!response.ok) throw new Error("Konto konnte nicht erstellt werden.");
    alert("Konto erfolgreich erstellt.");
    document.getElementById("create-account-form").reset();
    fetchAccounts(); // Aktualisiere die Kontenübersicht
  } catch (error) {
    alert(error.message);
  }
}

async function handleTransaction(event) {
  event.preventDefault();

  const type = document.getElementById("transaction-type").value;
  const sourceAccount = document.getElementById("source-account").value;
  const targetAccount = document.getElementById("target-account").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const comment = document.getElementById("comment").value;

  const token = localStorage.getItem("authToken");

  try {
    const endpoint = type === "transfer" ? "transfer" : type;
    const response = await fetch(
      `https://localhost:7143/api/Transaktionen/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quellkontoId: sourceAccount,
          zielkontoId: targetAccount,
          betrag: amount,
          nachricht: comment,
          benutzerId: "1",
        }),
      }
    );

    if (!response.ok) throw new Error("Transaktion fehlgeschlagen.");
    alert("Transaktion erfolgreich durchgeführt.");
    fetchTransactions(); // Aktualisiere die Transaktionsliste
  } catch (error) {
    alert(error.message);
  }
}

function logout() {
  localStorage.removeItem("authToken");
  document.getElementById("menu-bar").style.display = "none";
  showSection("login");
}
