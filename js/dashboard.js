function showMessage(text, type = "success") {
  const box = document.getElementById("messageBox");
  box.className = `message ${type}`;
  box.innerText = text;
  box.style.display = "block";

  setTimeout(() => box.style.display = "none", 3000);
}

const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

document.getElementById("userInfo").innerHTML =
  `<h3>Welcome ${user.name}</h3>
   <p>ID: ${user.id}</p>
   <p>Email: ${user.email}</p>`;

let accountNumber = null;
let accountId = null;

async function loadAccount() {
  try {
    const response = await fetch(`https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/accounts/user/${user.id}`);
    if (!response.ok) throw new Error();

    const account = await response.json();
    accountNumber = account.accountNumber;
    accountId = account.id;

    document.getElementById("accountInfo").innerHTML =
      `<p>Account Number: ${account.accountNumber}</p>
       <p>Balance: ₹${account.balance}</p>`;

    document.getElementById("createAccountBtn").style.display = "none";
  } catch {
    document.getElementById("accountInfo").innerHTML = `<p>No account found</p>`;
    document.getElementById("createAccountBtn").style.display = "block";
  }
}

loadAccount();

async function createAccount() {
  const res = await fetch(`https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/accounts/create/${user.id}`, {
    method: "POST"
  });

  if (res.ok) {
    showMessage("Account created successfully!");
    loadAccount();
  }
}

async function deposit() {
  const input = document.getElementById("depositAmount");
  const amount = Number(input.value);

  if (!amount || amount <= 0) {
    showMessage("Enter valid amount", "error");
    return;
  }

  try {
    const res = await fetch("https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/accounts/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, amount })
    });

    if (!res.ok) throw new Error();

    showMessage("Money added successfully!");
    input.value = "";
    loadAccount();
  } catch {
    showMessage("Deposit failed", "error");
  }
}

let isTransferring = false;

async function transfer() {
  if (isTransferring) return;
  isTransferring = true;

  const toInput = document.getElementById("toAccount");
  const amountInput = document.getElementById("transferAmount");

  const toAccountNumber = Number(toInput.value);
  const amount = Number(amountInput.value);

  if (!toAccountNumber || !amount) {
    showMessage("Enter valid values", "error");
    clearTransferInputs();
    isTransferring = false;
    return;
  }

  try {
    const res = await fetch("https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/accounts/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountNumber: accountNumber,
        toAccountNumber,
        amount
      })
    });

    if (!res.ok) throw new Error();

    showMessage("Transfer successful!");
    clearTransferInputs();
    loadAccount();
  } catch {
    showMessage("Transfer failed", "error");
    clearTransferInputs(); // 👈 clears on error
  }

  isTransferring = false;
}

async function loadTransactions() {
  const response = await fetch(`https://bankingmanagementsystem-rest-api-backend-production.up.railway.app/api/transactions/account/${accountNumber}`);
  const data = await response.json();

  const list = document.getElementById("transactions");
  list.innerHTML = "";

data.forEach(tx => {
  const li = document.createElement("li");

  if (tx.type === "CREDIT") {
    li.textContent = `CREDIT ₹${tx.amount} | From: ${tx.fromAccount ?? "Bank"} → To: ${tx.toAccount} | ${tx.date} ${tx.time}`;
  } else {
    li.textContent = `DEBIT ₹${tx.amount} | From: ${tx.fromAccount} → To: ${tx.toAccount} | ${tx.date} ${tx.time}`;
  }

  list.appendChild(li);
});


function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
function clearTransferInputs() {
  document.getElementById("toAccount").value = "";
  document.getElementById("transferAmount").value = "";
}

