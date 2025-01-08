import { extractUserIdFromToken } from "./utils.js";

export async function fetchAccounts() {
  const token = localStorage.getItem("authToken");

  try {
    const userId = extractUserIdFromToken(token);
    const response = await fetch(
      `https://localhost:7143/api/Konten/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const responseText = await response.text();
    const accounts = JSON.parse(responseText);

    renderAccounts(accounts);
    renderAccountDropdown(accounts);
    renderDashboardAccounts(accounts);
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Konten.");
  }
}

export function renderAccounts(accounts) {
  const accountList = document.getElementById("account-list");
  accountList.innerHTML = "";

  accounts.forEach((account) => {
    const row = document.createElement("li");
    row.textContent = `${account.name}: ${account.geldbetrag.toFixed(2)} €`;
    accountList.appendChild(row);
  });
}

export function renderAccountDropdown(accounts) {
  const depositDropdown = document.getElementById("deposit-account");
  const withdrawDropdown = document.getElementById("withdraw-account");

  depositDropdown.innerHTML = "<option value=''>Bitte Konto wählen</option>";
  if (withdrawDropdown) {
    withdrawDropdown.innerHTML = "<option value=''>Bitte Konto wählen</option>";
  }

  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = `${account.name} (${account.geldbetrag.toFixed(2)} €)`;

    depositDropdown.appendChild(option);

    if (withdrawDropdown) {
      const withdrawOption = option.cloneNode(true);
      withdrawDropdown.appendChild(withdrawOption);
    }
  });
}

export function renderDashboardAccounts(accounts) {
  const accountOverview = document.getElementById("account-overview");
  accountOverview.innerHTML = "";

  accounts.forEach((account) => {
    const div = document.createElement("div");
    div.className = "account";
    div.textContent = `${account.name}: ${account.geldbetrag.toFixed(2)} €`;
    accountOverview.appendChild(div);
  });
}

export async function handleCreateAccount(event) {
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
        token,
      }),
    });

    if (!response.ok) throw new Error("Konto konnte nicht erstellt werden.");
    alert("Konto erfolgreich erstellt.");
    document.getElementById("create-account-form").reset();
    fetchAccounts();
  } catch (error) {
    alert(error.message);
  }
}
