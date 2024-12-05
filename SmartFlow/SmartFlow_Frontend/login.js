document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("login-message");

    try {
      const response = await fetch("https://localhost:7143/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(
          "Login fehlgeschlagen. Bitte überprüfen Sie Benutzername und Passwort."
        );
      }

      const token = await response.text();
      localStorage.setItem("authToken", token);

      loginMessage.textContent = "Login erfolgreich!";
      loginMessage.style.color = "green";

      document.getElementById("menu-bar").style.display = "flex";
      showSection("dashboard");
    } catch (error) {
      loginMessage.textContent = error.message;
      loginMessage.style.color = "red";
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  if (token && !isTokenExpired()) {
    document.getElementById("menu-bar").style.display = "flex";
    showSection("dashboard");
  } else {
    localStorage.removeItem("authToken");
    document.getElementById("menu-bar").style.display = "none";
    showSection("login");
  }
});

async function fetchProtectedData(url) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Bitte zuerst einloggen.");
    showSection("login");
    return null;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    alert("Authentifizierung abgelaufen. Bitte erneut einloggen.");
    localStorage.removeItem("authToken");
    showSection("login");
    return null;
  }

  return response.json();
}

function isTokenExpired() {
  const token = localStorage.getItem("authToken");
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return Date.now() >= payload.exp * 1000;
}

let inactivityTimeout;

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    alert("Sie waren 1 Minute inaktiv. Die Seite wird neu geladen.");
    location.reload();
  }, 60000);
}

function trackUserActivity() {
  ["mousemove", "keypress", "click", "touchstart"].forEach((event) =>
    document.addEventListener(event, resetInactivityTimer)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  trackUserActivity();
  resetInactivityTimer();
});
