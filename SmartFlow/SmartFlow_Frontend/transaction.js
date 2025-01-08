import { extractUserIdFromToken } from "./utils.js";

export async function depositMoney(event) {
  event.preventDefault();

  const accountId = document.getElementById("deposit-account").value;
  const amount = parseFloat(document.getElementById("deposit-amount").value);
  const token = localStorage.getItem("authToken");

  if (!accountId || isNaN(amount) || amount <= 0) {
    alert("Bitte gültige Kontodaten und Betrag eingeben.");
    return;
  }

  try {
    const response = await fetch(
      "https://localhost:7143/api/Transaktionen/deposit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kontoId: accountId,
          benutzerId: extractUserIdFromToken(token),
          betrag: amount,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Einzahlung fehlgeschlagen.");
    }

    alert("Einzahlung erfolgreich.");
    document.getElementById("deposit-form").reset();
  } catch (error) {
    console.error(error.message);
    alert("Ein Fehler ist aufgetreten.");
  }
}

export async function withdrawMoney(event) {
  event.preventDefault();

  const accountId = document.getElementById("withdraw-account").value;
  const amount = parseFloat(document.getElementById("withdraw-amount").value);

  if (!accountId || isNaN(amount) || amount <= 0) {
    alert("Bitte Konto ID und einen gültigen Betrag angeben.");
    return;
  }

  const token = localStorage.getItem("authToken");
  const userId = extractUserIdFromToken(token);

  try {
    const response = await fetch(
      "https://localhost:7143/api/Transaktionen/withdraw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kontoId: accountId,
          benutzerId: userId,
          betrag: amount,
        }),
      }
    );

    if (!response.ok) throw new Error("Abhebung fehlgeschlagen.");
    alert("Abhebung erfolgreich durchgeführt.");
    document.getElementById("withdraw-form").reset();
    fetchTransactions();
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

export async function fetchTransactions() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("Kein Token gefunden. Benutzer nicht eingeloggt.");
    return;
  }

  const userId = extractUserIdFromToken(token);

  try {
    const responseAccounts = await fetch(
      `https://localhost:7143/api/Konten/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!responseAccounts.ok)
      throw new Error("Konten konnten nicht geladen werden.");

    const accounts = await responseAccounts.json();
    const transactions = [];

    for (const account of accounts) {
      const responseTransactions = await fetch(
        `https://localhost:7143/api/Transaktionen/transactions/${account.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!responseTransactions.ok)
        throw new Error("Transaktionen konnten nicht geladen werden.");

      const accountTransactions = await responseTransactions.json();
      transactions.push(...accountTransactions);
    }

    renderTransactions(transactions);
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Transaktionen.");
  }
}

export async function fetchTransactionsByAccount(accountId) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `https://localhost:7143/api/Transaktionen/transactions/${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Fehler beim Laden der Transaktionen.");
    const transactions = await response.json();
    renderTransactions(transactions);
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Transaktionen.");
  }
}

export function renderTransactions(transactions) {
  const transactionListBody = document.getElementById("transaction-list-body");
  transactionListBody.innerHTML = "";

  if (transactions.length === 0) {
    const noTransactionsRow = document.createElement("tr");
    noTransactionsRow.innerHTML = `<td colspan="4">Keine Transaktionen gefunden.</td>`;
    transactionListBody.appendChild(noTransactionsRow);
    return;
  }

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(transaction.datum).toLocaleDateString();

    const amountCell = document.createElement("td");
    amountCell.textContent = `${transaction.betrag > 0 ? "+" : ""}${transaction.betrag.toFixed(2)} €`;

    const messageCell = document.createElement("td");
    messageCell.textContent = transaction.nachricht || "Keine Nachricht";

    const accountCell = document.createElement("td");
    accountCell.textContent = transaction.quellkontoId || transaction.zielkontoId;

    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(messageCell);
    row.appendChild(accountCell);

    transactionListBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const depositAccountDropdown = document.getElementById("deposit-account");

  if (depositAccountDropdown) {
    depositAccountDropdown.addEventListener("change", (event) => {
      const selectedAccountId = event.target.value;
      if (selectedAccountId) {
        fetchTransactionsByAccount(selectedAccountId);
      }
    });
  } else {
    console.error("Dropdown-Menü mit ID 'deposit-account' wurde nicht gefunden.");
  }
});
