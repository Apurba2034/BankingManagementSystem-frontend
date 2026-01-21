function showMessage(text, type = "success") {
  const box = document.getElementById("messageBox");
  box.className = `message ${type}`;
  box.innerText = text;
  box.style.display = "block";

  setTimeout(() => box.style.display = "none", 3000);
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      showMessage("Invalid credentials", "error");
      return;
    }

    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "dashboard.html";

  } catch {
    showMessage("Server error", "error");
  }
}
