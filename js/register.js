function showMessage(text, type = "success") {
  const box = document.getElementById("messageBox");
  box.className = `message ${type}`;
  box.innerText = text;
  box.style.display = "block";

  setTimeout(() => box.style.display = "none", 3000);
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageBox = document.getElementById("registerMessage");

  messageBox.innerHTML = "";
  messageBox.className = "message";

  if (password !== confirmPassword) {
    messageBox.innerHTML = "❌ Passwords do not match";
    messageBox.classList.add("error");
    return;
  }

  try {
const response = await fetch("https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/user/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password })
});


    if (response.ok) {
      messageBox.innerHTML = "✅ Registration successful! Please login.";
      messageBox.classList.add("success");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      const errorText = await response.text();
      messageBox.innerHTML = "❌ " + errorText;
      messageBox.classList.add("error");
    }
  } catch (err) {
    messageBox.innerHTML = "❌ Server error";
    messageBox.classList.add("error");
  }
}
