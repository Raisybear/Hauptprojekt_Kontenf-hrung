export function extractUserIdFromToken(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.UserId || payload.userId || payload.id;
}

export function showSection(sectionId) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });

  const section = document.getElementById(sectionId);
  section.classList.add("active");
  section.style.display = "block";

  // Lade Transaktionen, wenn die Sektion "transactions" angezeigt wird
  if (sectionId === "transactions") {
    import("./transaction.js").then(({ fetchTransactions }) => {
      fetchTransactions();
    });
  }
}
