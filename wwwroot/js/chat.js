const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .withAutomaticReconnect()
    .build();

let username = "";
let room = "";

function getRoomFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("room");
}

document.getElementById("joinBtn").addEventListener("click", async () => {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Kullanýcý adý gir");
        return;
    }

    room = getRoomFromUrl();
    if (!room) {
        room = Math.random().toString(36).substring(2, 8);
        history.replaceState({}, "", `?room=${room}`);
    }

    try {
        await connection.start();
        await connection.invoke("JoinRoom", room);

        document.getElementById("roomName").innerText = room;
        document.getElementById("loginArea").classList.add("d-none");
        document.getElementById("chatArea").classList.remove("d-none");
    }
    catch (err) {
        console.error(err);
        alert("SignalR baðlantýsý kurulamadý. Console'a bak.");
    }
});

document.getElementById("sendBtn").addEventListener("click", () => {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (!message) return;

    const messageId = crypto.randomUUID();

    connection.invoke("SendMessage", room, username, message, messageId);
    input.value = "";
});

connection.on("ReceiveMessage", (user, message, messageId) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.id = messageId;

    li.innerHTML = `
        <span><strong>${user}:</strong> ${message}</span>
        <button class="btn btn-sm btn-danger">Sil</button>
    `;

    li.querySelector("button").onclick = () => {
        connection.invoke("DeleteMessage", room, messageId);
    };

    document.getElementById("messages").appendChild(li);
});

connection.on("MessageDeleted", (messageId) => {
    const el = document.getElementById(messageId);
    if (el) el.remove();
});

