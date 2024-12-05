function showSection(sectionId) {
  const sections = document.querySelectorAll("main > section");
  sections.forEach((section) => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  showSection("login");
});

function addAccount() {
  const accountList = document.getElementById("account-list");
  const newAccount = document.createElement("li");
  newAccount.innerHTML = `
    Neues Konto: 0 €
    <button class="edit-btn">Bearbeiten</button>
  `;

  newAccount.querySelector(".edit-btn").addEventListener("click", enableEdit);
  accountList.appendChild(newAccount);
}

function enableEdit(event) {
  const listItem = event.target.closest("li");
  const currentText = listItem.childNodes[0].nodeValue.trim();
  const [name, balance] = currentText
    .split(":")
    .map((item) => item.trim().replace("€", ""));

  while (listItem.firstChild) {
    listItem.removeChild(listItem.firstChild);
  }
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "edit-name";
  nameInput.value = name;

  const balanceInput = document.createElement("input");
  balanceInput.type = "number";
  balanceInput.className = "edit-balance";
  balanceInput.value = balance;

  // Speichern-Button erstellen
  const saveButton = document.createElement("button");
  saveButton.className = "save-btn";
  saveButton.textContent = "Speichern";

  // Eventlistener für Speichern
  saveButton.addEventListener("click", saveEdit);

  // Elemente hinzufügen
  listItem.appendChild(nameInput);
  listItem.appendChild(balanceInput);
  listItem.appendChild(saveButton);
}
  



function saveEdit(event) {
  const listItem = event.target.closest("li");
  const newName = listItem.querySelector(".edit-name").value;
  const newBalance = listItem.querySelector(".edit-balance").value;

  if (!newName || isNaN(newBalance)) {
    alert("Bitte gültige Werte eingeben!");
    return;
  }

  // Liste leeren
  while (listItem.firstChild) {
    listItem.removeChild(listItem.firstChild);
  }

  const textNode = document.createTextNode(`${newName}: ${newBalance} €`);

  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.textContent = "Bearbeiten";

  // Eventlistener für Bearbeiten
  editButton.addEventListener("click", enableEdit);

  // Elemente hinzufügen
  listItem.appendChild(textNode);
  listItem.appendChild(editButton);

  listItem.querySelector(".edit-btn").addEventListener("click", enableEdit);
}

document.querySelectorAll("#account-list .edit-btn").forEach((button) => {
  button.addEventListener("click", enableEdit);
});

function editAccount(event) {
  const account = event.target;
  const accountDetails = account.textContent.split(":");
  const newName =
    prompt("Kontoname bearbeiten: ", accountDetails[0]) || accountDetails[0];
  account.textContent = `${newName}:`;
  account.addEventListener("click", editAccount);
  document.querySelectorAll("#account-list li").forEach((account) => {
    account.addEventListener("click", editAccount);
  });
}

document
  .getElementById("transaction-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const comment = document.getElementById("comment").value;

    const transactionList = document.querySelector("#transaction-list ul");
    const newTransaction = document.createElement("li");
    newTransaction.textContent = `${
      amount > 0 ? "+" : ""
    }${amount} € - ${comment}`;
    transactionList.appendChild(newTransaction);

    document.getElementById("transaction-form").reset();
  });

async function fetchAccounts() {
  const response = await fetch("/api/accounts");
  const accounts = await response.json();
  renderAccounts(accounts);
}

function renderAccounts(accounts) {
  const accountList = document.getElementById("account-list");
  accountList.innerHTML = "";
  accounts.forEach((account) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      ${account.name}: ${account.balance} €
      <button class="edit-btn" data-id="${account.id}">Bearbeiten</button>
    `;
    listItem
      .querySelector(".edit-btn")
      .addEventListener("click", () => enableEdit(account));
    accountList.appendChild(listItem);
  });
}
