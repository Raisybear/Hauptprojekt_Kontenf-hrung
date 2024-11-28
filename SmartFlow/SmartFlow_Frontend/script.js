// Toggle between sections
function showSection(sectionId) {
  const sections = document.querySelectorAll("main > section");
  sections.forEach(section => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

// Add a new account
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
  const [name, balance] = currentText.split(":").map(item => item.trim().replace("€", ""));

  listItem.innerHTML = `
    <input type="text" class="edit-name" value="${name}" />
    <input type="number" class="edit-balance" value="${balance}" />
    <button class="save-btn">Speichern</button>
  `;

  listItem.querySelector(".save-btn").addEventListener("click", saveEdit);
}

function saveEdit(event) {
  const listItem = event.target.closest("li");
  const newName = listItem.querySelector(".edit-name").value;
  const newBalance = listItem.querySelector(".edit-balance").value;

  listItem.innerHTML = `
    ${newName}: ${newBalance} €
    <button class="edit-btn">Bearbeiten</button>
  `;

  listItem.querySelector(".edit-btn").addEventListener("click", enableEdit);
}

document.querySelectorAll("#account-list .edit-btn").forEach(button => {
  button.addEventListener("click", enableEdit);
});

function editAccount(event) {
  const account = event.target;
  const accountDetails = account.textContent.split(":");
  const NewName = prompt("Kontoname bearbeiten: ", accountDetails[0]) || accountDetails[0];
  account.textContent = `${newName}:`;
  account.addEventListener("click", editAccount);
  document.querySelectorAll("#account-list li").forEach(account => {
    account.addEventListener("click", editAccount);
  });
}

// Handle new transactions
document.getElementById("transaction-form").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const amount = document.getElementById("amount").value;
  const comment = document.getElementById("comment").value;

  const transactionList = document.querySelector("#transaction-list ul");
  const newTransaction = document.createElement("li");
  newTransaction.textContent = `${amount > 0 ? "+" : ""}${amount} € - ${comment}`;
  transactionList.appendChild(newTransaction);

  document.getElementById("transaction-form").reset();
});
