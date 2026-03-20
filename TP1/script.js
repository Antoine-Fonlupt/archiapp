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
console.log("Applique anonyme (n+1) :", applique(function (n) { return (n + 1); }, [1, 2, 3, 4, 5, 6]));

// 3.2 & 3.3 - Dynamique et modèle complet
let msgs = [
    { "pseudo": "Système", "msg": "Bienvenue sur l'interface de messagerie !", "date": new Date().toLocaleString() },
    { "pseudo": "Alice", "msg": "Le nouveau design est bien plus sympa.", "date": new Date().toLocaleString() },
    { "pseudo": "Bob", "msg": "Je suis d'accord, c'est beaucoup plus moderne.", "date": new Date().toLocaleString() }
];

function update(data) {
    const list = document.getElementById('message-list');
    list.innerHTML = ''; // Efface la liste

    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="msg-header">
                <strong>${item.pseudo}</strong>
                <span class="date">${item.date}</span>
            </div>
            <div class="msg-content">${item.msg}</div>
        `;
        list.appendChild(li);
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    update(msgs);

    const sendBtn = document.getElementById('send-button');
    const updateBtn = document.getElementById('update-button');
    const themeBtn = document.getElementById('toggle-theme');

    sendBtn.addEventListener('click', () => {
        const pseudoInput = document.getElementById('pseudo-input');
        const msgInput = document.getElementById('message-input');
        
        if (msgInput.value.trim() !== "") {
            const newMsg = {
                "pseudo": pseudoInput.value || "Anonyme",
                "msg": msgInput.value,
                "date": new Date().toLocaleString()
            };
            msgs.push(newMsg);
            update(msgs);
            msgInput.value = '';
        }
    });

    updateBtn.addEventListener('click', () => {
        update(msgs);
    });

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});