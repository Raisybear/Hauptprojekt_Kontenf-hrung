import { extractUserIdFromToken } from "./utils.js";

export async function fetchTransactions() {
  const token = localStorage.getItem("authToken");

  try {
    const userId = extractUserIdFromToken(token);

    // 1. Konten des Benutzers abrufen
    const responseAccounts = await fetch(
      `https://localhost:7143/api/Konten/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!responseAccounts.ok)
      throw new Error("Konten konnten nicht geladen werden.");
    const accounts = await responseAccounts.json();

    // 2. Transaktionen für alle Konten abrufen
    const allTransactions = [];
    for (const account of accounts) {
      const responseTransactions = await fetch(
        `https://localhost:7143/api/Transaktionen/transactions/${account.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!responseTransactions.ok) {
        console.warn(
          `Transaktionen konnten für Konto ${account.id} nicht geladen werden.`
        );
        continue;
      }

      const transactions = await responseTransactions.json();
      allTransactions.push(...transactions);
    }

    // 3. Transaktionen rendern
    renderTransactions(allTransactions);
  } catch (error) {
    console.error("Fehler beim Abrufen der Transaktionen:", error.message);
    alert("Fehler beim Laden der Transaktionen.");
  }
}

export function renderTransactions(transactions) {
  const transactionList = document.getElementById("transaction-list-ul");
  transactionList.innerHTML = ""; // Alte Inhalte löschen

  if (transactions.length === 0) {
    const noTransactions = document.createElement("li");
    noTransactions.textContent = "Keine Transaktionen gefunden.";
    transactionList.appendChild(noTransactions);
    return;
  }

  transactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Konto: ${
      transaction.quellkontoId || transaction.zielkontoId
    } | Betrag: ${
      transaction.betrag > 0 ? "+" : ""
    }${transaction.betrag} € - Nachricht: ${
      transaction.nachricht
    } - Datum: ${new Date(transaction.erstellungsdatum).toLocaleString()}`;
    transactionList.appendChild(listItem);
  });
}
