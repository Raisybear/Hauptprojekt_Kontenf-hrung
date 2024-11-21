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
  newAccount.textContent = "Neues Konto: 0 €";
  accountList.appendChild(newAccount);
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
