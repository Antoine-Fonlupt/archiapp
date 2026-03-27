// 3.1 - Un petit peu de programmation
function fact(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}

console.log("Factorielle de 6 :", fact(6));

function applique(f, tab) {
    let res = [];
    for (let i = 0; i < tab.length; i++) {
        res.push(f(tab[i]));
    }
    return res;
}

console.log("Applique fact sur [1,2,3,4,5,6] :", applique(fact, [1, 2, 3, 4, 5, 6]));
console.log("Applique anonyme (n+1) :", applique(function (n) { return n + 1; }, [1, 2, 3, 4, 5, 6]));

let serverBaseUrl = "https://archiapp-ofb2.onrender.com"; // Pour le lancement en local avec docker compose, changer en "http://localhost:5000";

// Affichage des messages
function update(messages) {
    const list = document.getElementById("message-list");
    list.innerHTML = "";

    messages.forEach(function(item) {
        const li = document.createElement("li");

        const author = item.author || "Anonyme";
        const text = item.text || "";
        const date = item.date || "";

        li.innerHTML = `
            <div class="msg-header">
                <strong>${author}</strong>
                <span class="date">${date}</span>
            </div>
            <div class="msg-content">${text}</div>
        `;
        list.appendChild(li);
    });
}

function loadMessages() {
    const inputUrl = document.getElementById("server-url");
    if (inputUrl && inputUrl.value.trim() !== "") {
        serverBaseUrl = inputUrl.value.trim();
    }

    fetch(serverBaseUrl + "/msg/getAll")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            update(data);
        })
        .catch(function(error) {
            console.error("Erreur lors du chargement des messages :", error);
            alert("Impossible de charger les messages. Vérifiez l'URL du micro-service.");
        });
}

function postMessage() {
    const pseudoInput = document.getElementById("pseudo-input");
    const msgInput = document.getElementById("message-input");
    const serverInput = document.getElementById("server-url");

    if (serverInput.value.trim() !== "") {
        serverBaseUrl = serverInput.value.trim();
    }

    const pseudo = pseudoInput.value.trim() || "Anonymous";
    const message = msgInput.value.trim();

    if (message === "") {
        return;
    }

    const url =
        serverBaseUrl +
        "/msg/post/" +
        encodeURIComponent(message) +
        "?author=" +
        encodeURIComponent(pseudo);

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.code === 1) {
                msgInput.value = "";
                loadMessages();
            } else {
                alert("Erreur lors de l'envoi du message.");
            }
        })
        .catch(function(error) {
            console.error("Erreur lors de l'envoi :", error);
            alert("Impossible d'envoyer le message.");
        });
}

// Initialisation
document.addEventListener("DOMContentLoaded", function() {
    const sendBtn = document.getElementById("send-button");
    const updateBtn = document.getElementById("update-button");
    const themeBtn = document.getElementById("toggle-theme");
    const serverInput = document.getElementById("server-url");

    serverInput.value = serverBaseUrl;

    sendBtn.addEventListener("click", function() {
        postMessage();
    });

    updateBtn.addEventListener("click", function() {
        loadMessages();
    });

    themeBtn.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
    });

    if (serverBaseUrl !== "") {
        loadMessages();
    }
});