function sendMessage() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !message) {
    alert("Fill all fields");
    return;
  }

  fetch("/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, message })
  })
  .then(res => res.text())
  .then(() => {
    alert("Message Sent 💜");
    loadMessages();
  })
  .catch(err => console.log(err));
}

function loadMessages() {
  fetch("/messages")
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("msgList");
    box.innerHTML = "";

    data.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("msg");
      div.innerHTML = `<b>${msg.name}</b>: ${msg.message}`;
      box.appendChild(div);
    });
  });
}

loadMessages();