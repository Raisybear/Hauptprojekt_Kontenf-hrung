import { extractUserIdFromToken } from "./utils.js";
import { populateSourceAndDestinationAccounts } from "./transaction.js";

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

  if (!accounts || accounts.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "Keine Konten gefunden.";
    row.appendChild(cell);
    accountList.appendChild(row);
    return;
  }

  accounts.forEach((account) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = account.name || "Unbekannt";

    const amountCell = document.createElement("td");
    amountCell.textContent = account.geldbetrag
      ? `${account.geldbetrag.toFixed(2)} CHF`
      : "0.00 CHF";

    const interestCell = document.createElement("td");
    interestCell.textContent =
      typeof account.zinssatz === "number"
        ? `${account.zinssatz.toFixed(2)} %`
        : "0.00 %";

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = () => deleteAccount(account.id);
    deleteCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(interestCell);
    row.appendChild(deleteCell);

    accountList.appendChild(row);
  });
}

async function deleteAccount(accountId) {
  const token = localStorage.getItem("authToken");

  if (!confirm("Möchten Sie dieses Konto wirklich löschen?")) {
    return;
  }

  try {
    const response = await fetch(
      `https://localhost:7143/api/Konten/${accountId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Konto konnte nicht gelöscht werden.");
    alert("Konto erfolgreich gelöscht.");
    fetchAccounts();
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Löschen des Kontos.");
  }
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
    option.textContent = `${account.name} (${account.geldbetrag.toFixed(
      2
    )} CHF)`;

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
  const interestRate = parseFloat(
    document.getElementById("interest-rate").value
  );

  if (!accountName || isNaN(initialAmount) || isNaN(interestRate)) {
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
        zinssatz: interestRate,
        token,
      }),
    });

    if (!response.ok) throw new Error("Konto konnte nicht erstellt werden.");
    alert("Konto erfolgreich erstellt.");
    document.getElementById("create-account-form").reset();
    fetchAccounts();
    populateSourceAndDestinationAccounts();
  } catch (error) {
    alert(error.message);
  }
}
