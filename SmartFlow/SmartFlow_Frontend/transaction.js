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
    fetchTransactions();
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

// diese Funktion ist mit ChatGPT erstellt worden.
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
    const accountMap = {};
    accounts.forEach((account) => {
      accountMap[account.id] = account.name;
    });

    const responseForeignAccounts = await fetch(
      "https://localhost:7143/api/Konten/all",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!responseForeignAccounts.ok)
      throw new Error("Fremdkonten konnten nicht geladen werden.");

    const foreignAccounts = await responseForeignAccounts.json();
    foreignAccounts.forEach((account) => {
      accountMap[account.id] = account.name;
    });

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
      accountTransactions.forEach((transaction) => {
        transaction.quellkontoName =
          transaction.quellkontoId === "Bar"
            ? "Bar"
            : accountMap[transaction.quellkontoId] || "Unbekannt";

        transaction.zielkontoName =
          transaction.zielkontoId === "Bar"
            ? "Bar"
            : accountMap[transaction.zielkontoId] || "Unbekannt";
      });

      transactions.push(...accountTransactions);
    }

    renderTransactions(transactions);
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Transaktionen.");
  }
}
//

export function renderTransactions(transactions) {
  const transactionListBody = document.getElementById("transaction-list-body");
  transactionListBody.innerHTML = "";

  if (transactions.length === 0) {
    const noTransactionsRow = document.createElement("tr");
    noTransactionsRow.innerHTML = `<td colspan="5">Keine Transaktionen gefunden.</td>`;
    transactionListBody.appendChild(noTransactionsRow);
    return;
  }

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(
      transaction.erstellungsdatum
    ).toLocaleDateString();

    const amountCell = document.createElement("td");
    if (transaction.nachricht.includes("Einzahlung")) {
      amountCell.textContent = `+ ${transaction.betrag.toFixed(2)} CHF`;
    } else if (transaction.nachricht.includes("Bezug Bargeld")) {
      amountCell.textContent = `- ${transaction.betrag.toFixed(2)} CHF`;
    } else {
      amountCell.textContent = `${transaction.betrag.toFixed(2)} CHF`;
    }
    const messageCell = document.createElement("td");
    messageCell.textContent = transaction.nachricht || "Keine Nachricht";

    const sourceAccountCell = document.createElement("td");
    sourceAccountCell.textContent = transaction.quellkontoName;

    const targetAccountCell = document.createElement("td");
    targetAccountCell.textContent = transaction.zielkontoName;

    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(messageCell);
    row.appendChild(sourceAccountCell);
    row.appendChild(targetAccountCell);

    transactionListBody.appendChild(row);
  });
}

export async function transferMoney(event) {
  event.preventDefault();

  const sourceAccountId = document.getElementById("source-account").value;
  const destinationAccountId = document.getElementById(
    "destination-account"
  ).value;
  const amount = parseFloat(document.getElementById("transfer-amount").value);
  const message = document.getElementById("transfer-message").value;
  const token = localStorage.getItem("authToken");

  if (
    !sourceAccountId ||
    !destinationAccountId ||
    isNaN(amount) ||
    amount <= 0
  ) {
    alert("Bitte alle Felder korrekt ausfüllen.");
    return;
  }

  try {
    const response = await fetch(
      "https://localhost:7143/api/Transaktionen/transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quellkontoId: sourceAccountId,
          zielkontoId: destinationAccountId,
          benutzerId: extractUserIdFromToken(token),
          betrag: amount,
          nachricht: message,
        }),
      }
    );

    if (!response.ok) throw new Error("Überweisung fehlgeschlagen.");
    alert("Überweisung erfolgreich durchgeführt.");
    document.getElementById("transfer-form").reset();
    fetchTransactions();
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

// diese Funktion ist mit ChatGPT erstellt worden.
export async function populateSourceAndDestinationAccounts() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("Kein Token gefunden. Benutzer nicht eingeloggt.");
    return;
  }

  const userId = extractUserIdFromToken(token);

  try {
    const sourceResponse = await fetch(
      `https://localhost:7143/api/Konten/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!sourceResponse.ok)
      throw new Error("Fehler beim Laden der Quellkonten.");
    const sourceAccounts = await sourceResponse.json();

    const sourceDropdown = document.getElementById("source-account");
    populateDropdown(sourceDropdown, sourceAccounts);

    const destinationResponse = await fetch(
      "https://localhost:7143/api/Konten/all",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!destinationResponse.ok)
      throw new Error("Fehler beim Laden der Zielkonten.");
    const destinationAccounts = await destinationResponse.json();

    const destinationDropdown = document.getElementById("destination-account");
    populateDropdown(destinationDropdown, destinationAccounts);
  } catch (error) {
    console.error(error.message);
    alert("Fehler beim Laden der Konten.");
  }
}
//

// diese Funktion ist mit ChatGPT erstellt worden.
function populateDropdown(dropdown, accounts) {
  dropdown.innerHTML = "<option value=''>Bitte Konto wählen</option>";

  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = `${account.name} (${account.geldbetrag.toFixed(2)} €)`;
    dropdown.appendChild(option);
  });
}
//
