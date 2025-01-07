export async function handleTransaction(event) {
  event.preventDefault();

  const type = document.getElementById("transaction-type").value;
  const sourceAccount = document.getElementById("source-account").value;
  const targetAccount = document.getElementById("target-account").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const comment = document.getElementById("comment").value;

  const token = localStorage.getItem("authToken");

  try {
    const endpoint = type === "transfer" ? "transfer" : type;
    const response = await fetch(
      `https://localhost:7143/api/Transaktionen/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quellkontoId: sourceAccount,
          zielkontoId: targetAccount,
          betrag: amount,
          nachricht: comment,
          benutzerId: "1",
        }),
      }
    );

    if (!response.ok) throw new Error("Transaktion fehlgeschlagen.");
    alert("Transaktion erfolgreich durchgeführt.");
    fetchTransactions();
  } catch (error) {
    alert(error.message);
  }
}
