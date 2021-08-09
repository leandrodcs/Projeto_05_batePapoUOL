const url = {
    users: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",
    status: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
    messages: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"
}
let username = "";
let user = "Todos";
let type = "message";
let message = {};
let firstTime = true;
let oldLastMessage;
let newLastMessage;
document.querySelector(".login-page").addEventListener("keyup", enterClickForLogin);
document.querySelector(".input").addEventListener("keyup", enterClickForMessage);
function enterClickForLogin(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".login-page button").click();
    }
}
function enterClickForMessage(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".footer ion-icon").click();
    }
}
function checkName() {
    username = document.querySelector(".login-page input").value;
    document.querySelector(".login-page input").classList.add("vanish");
    document.querySelector(".login-page button").classList.add("vanish");
    document.querySelector(".loading").classList.remove("vanish");
    const promise = axios.post(url.users, { name: username });
    promise.then(availableUser);
    promise.catch(unavailableUser);
}
function availableUser(response) {
    console.log("Esse nome está disponível!");
    document.querySelector(".login-page").classList.add("vanish");
    loadMessages();
    loadUsers();
    setInterval(loadMessages, 3000);
    setInterval(userStatus, 5000);
    setInterval(loadUsers, 10000);
}
function unavailableUser(error) {
    document.querySelector(".login-page input").classList.remove("vanish");
    document.querySelector(".login-page button").classList.remove("vanish");
    document.querySelector(".loading").classList.add("vanish");
    document.querySelector(".login-page input").value = "";
    alert("Já tem alguém com esse nome, escolhe outro aí!")
}
function userStatus() {
    axios.post(url.status, { name: username });
}
function loadMessages() {
    const promise = axios.get(url.messages);
    promise.then(printMessages);
}
function printMessages(response) {
    const messages = response;
    document.querySelector(".main").innerHTML = "";
    const main = document.querySelector(".main");
    for (i = 0; i < messages.data.length; i++) {
        if (messages.data[i].type === "status") {
            main.innerHTML += `
                <div class="message movement">
                    <p>
                        <span class="time">(${messages.data[i].time})</span>
                        <span class="name">${messages.data[i].from}</span>
                        ${messages.data[i].text}
                    </p>
                </div>
            `;
        }
        if (messages.data[i].type === "message") {
            main.innerHTML += `
                <div class="message ">
                    <p>
                        <span class="time">(${messages.data[i].time}) </span>
                        <span class="name">${messages.data[i].from}</span>
                        para <span class="name">${messages.data[i].to}</span>
                        : <span class="content">${messages.data[i].text}</span>
                    </p>
                </div>
            `;
        }
        if (messages.data[i].type === "private_message") {
            if (username === messages.data[i].to || username === messages.data[i].from) {
                main.innerHTML += `
                <div class="message private">
                    <p>
                        <span class="time">(${messages.data[i].time}) </span>
                        <span class="name">${messages.data[i].from}</span>
                        reservadamente para <span class="name">${messages.data[i].to}</span>
                        : <span class="content">${messages.data[i].text}</span>
                    </p>
                </div>
            `;
            }
        }
    }
    scrollMessages()
}
function sendMessages() {
    message = {
        from: username,
        to: user,
        text: document.querySelector(".input").value,
        type: type
    }
    const promise = axios.post(url.messages, message);
    promise.then(loadMessages);
    promise.catch(relog);
    document.querySelector(".input").value = "";
}
function checkIfRecipientIsOnline() {
    if (document.querySelector(".input").value === "") {
        return;
    }
    const promise = axios.get(url.users);
    promise.then(checking);
}
function checking(response) {
    const users = response;
    for (i = 0; i < users.data.length; i++) {
        if (users.data[i].name === user || user === "Todos") {
            sendMessages()
            return;
        }
    }
    realocateUser();
}
function realocateUser() {
    document.querySelector(".input").value = "";
    user = "Todos";
    selectPrivacy(document.querySelector(".public"));
    selectWhoToTalk(document.querySelectorAll(".user")[0]);
    alert("Este usuário saiu, voltando a falar com Todos...")
}
function loadUsers() {
    const promise = axios.get(url.users);
    promise.then(printUsers);
}
function printUsers(response) {
    const users = response;
    const userList = document.querySelector(".users");
    userList.innerHTML = "";
    if (user === "Todos") {
        userList.innerHTML = `
        <div class="user selected" onclick="selectWhoToTalk(this)">
            <div class="left">
                <ion-icon name="person-circle"></ion-icon>
                &nbsp;
                <p class="username">Todos</p>
            </div>
            <img class= "check" src="assets/images/Vector.png">
        </div>
    `;
    }
    if (user !== "Todos") {
        userList.innerHTML = `
        <div class="user" onclick="selectWhoToTalk(this)">
            <div class="left">
                <ion-icon name="person-circle"></ion-icon>
                &nbsp;
                <p class="username">Todos</p>
            </div>
            <img class= "check" src="assets/images/Vector.png">
        </div>
    `;
    }
    for (i = 0; i < users.data.length; i++) {
        if (users.data[i].name === user) {
            userList.innerHTML += `
            <div class="user selected" onclick="selectWhoToTalk(this)">
                <div class="left">
                    <ion-icon name="person-circle"></ion-icon>
                    &nbsp;
                    <p class="username">${users.data[i].name}</p>
                </div>
                <img class= "check" src="assets/images/Vector.png">
            </div>
        `;
        }
        else {
            userList.innerHTML += `
            <div class="user" onclick="selectWhoToTalk(this)">
                <div class="left">
                    <ion-icon name="person-circle"></ion-icon>
                    &nbsp;
                    <p class="username">${users.data[i].name}</p>
                </div>
                <img class= "check" src="assets/images/Vector.png">
            </div>
        `;
        }
    }
}
function selectPrivacy(selected) {
    document.querySelector(".fixed .private").classList.remove("selected");
    document.querySelector(".public").classList.remove("selected");
    selected.classList.add("selected");
    printFooter(user);
    if (selected.classList.contains("private")) {
        type = "private_message";
    }
    else {
        type = "message";
    }
}
function selectWhoToTalk(selected) {
    const users = document.querySelectorAll(".user");
    for (i = 0; i < users.length; i++) {
        users[i].classList.remove("selected");
    }
    selected.classList.add("selected");
    user = selected.querySelector(".left .username").innerHTML;
    printFooter(user);
}
function printFooter(user) {
    const footer = document.querySelector(".who-is-listening");
    footer.innerHTML = `Enviando para&nbsp;<div>${user}</div>&nbsp;(público)`;
    if (document.querySelector(".private.selected")) {
        footer.innerHTML = `Enviando para&nbsp;<div>${user}</div>&nbsp;(reservadamente)`;
    }
}
function relog(error) {
    alert("Você foi desconectado, escolha seu nick novamente!");
    window.location.reload();
}
function scrollMessages() {
    const scroll = document.querySelectorAll(".time");
    newLastMessage = scroll[scroll.length - 1].innerHTML;
    if (oldLastMessage !== newLastMessage) {
        scroll[scroll.length - 1].scrollIntoView({});
        oldLastMessage = newLastMessage;
    }
}
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("sidebar-show");
    document.querySelector(".gray-background").classList.toggle("vanish");
}