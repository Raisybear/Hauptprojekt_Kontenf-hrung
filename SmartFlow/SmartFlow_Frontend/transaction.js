import { extractUserIdFromToken } from "./utils.js";

export async function depositMoney(event) {
  // Sicherstellen, dass 'event' korrekt übergeben wird
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
    fetchTransactions(); // Optional: Transaktionen nach der Abhebung aktualisieren
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
    // Erstelle eine Liste von Transaktionen basierend auf allen Konten des Benutzers
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
      transactions.push(...accountTransactions); // Alle Transaktionen in die Liste hinzufügen
    }

    renderTransactions(transactions);
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Transaktionen.");
  }
}

export function renderTransactions(transactions) {
  const transactionList = document.getElementById("transaction-list-ul");
  transactionList.innerHTML = ""; // Liste vor dem Hinzufügen leeren

  if (transactions.length === 0) {
    const noTransactions = document.createElement("li");
    noTransactions.textContent = "Keine Transaktionen gefunden.";
    transactionList.appendChild(noTransactions);
    return;
  }

  transactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${
      transaction.betrag > 0 ? "+" : ""
    }${transaction.betrag.toFixed(2)} € - ${
      transaction.nachricht || "Keine Nachricht"
    } (Konto: ${transaction.quellkontoId || transaction.zielkontoId})`;
    transactionList.appendChild(listItem);
  });
}
