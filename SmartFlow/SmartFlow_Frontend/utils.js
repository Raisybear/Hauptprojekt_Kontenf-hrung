export function extractUserIdFromToken(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.UserId || payload.userId || payload.id;
}

export function showSection(sectionId) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });
  document.getElementById(sectionId).classList.add("active");
  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "accounts") {
    fetchAccounts();
  }
}
