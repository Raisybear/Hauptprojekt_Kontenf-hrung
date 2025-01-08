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
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Konten.");
  }
}

export function renderAccounts(accounts) {
  const accountList = document.getElementById("account-list");

  while (accountList.firstChild) {
    accountList.removeChild(accountList.firstChild);
  }

  if (accounts.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 2;
    cell.textContent = "Keine Konten gefunden.";
    row.appendChild(cell);
    accountList.appendChild(row);
    return;
  }

  accounts.forEach((account) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = account.name;

    const amountCell = document.createElement("td");
    amountCell.textContent = `${account.geldbetrag.toFixed(2)} €`;

    row.appendChild(nameCell);
    row.appendChild(amountCell);

    accountList.appendChild(row);
  });
}

export function renderAccountDropdown(accounts) {
  const depositDropdown = document.getElementById("deposit-account");
  const withdrawDropdown = document.getElementById("withdraw-account");

  while (depositDropdown.firstChild) {
    depositDropdown.removeChild(depositDropdown.firstChild);
  }
  if (withdrawDropdown) {
    while (withdrawDropdown.firstChild) {
      withdrawDropdown.removeChild(withdrawDropdown.firstChild);
    }
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Bitte Konto wählen";
  depositDropdown.appendChild(defaultOption);

  if (withdrawDropdown) {
    const withdrawDefaultOption = defaultOption.cloneNode(true);
    withdrawDropdown.appendChild(withdrawDefaultOption);
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
