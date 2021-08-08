const url = {
    users: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",
    status: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
    messages: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"
}
let username = "";
let user = "Todos";
let type = "message";

document.querySelector(".login-page").addEventListener("keyup", enterClickForLogin);
function enterClickForLogin(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".login-page button").click();
    }
}
document.querySelector(".input").addEventListener("keyup", enterClickForMessage);
function enterClickForMessage(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".footer ion-icon").click();
    }
}

function checkName() {
    username = document.querySelector(".login-page input").value;
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
    setInterval(loadUsers, 5000);
}
function unavailableUser(error) {
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
    document.querySelector(".scroll-devide").scrollIntoView({ block: "end" });
}
function sendMessages() {
    const message = {
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
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("vanish");
    document.querySelector(".gray-background").classList.toggle("vanish");
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
                <div class="username">Todos</div>
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
                <div class="username">Todos</div>
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
                    <div class="username">${users.data[i].name}</div>
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
                    <div class="username">${users.data[i].name}</div>
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
    footer.innerHTML = `Enviando para ${user} (público)`;
    if (document.querySelector(".private.selected")) {
        footer.innerHTML = `Enviando para ${user} (reservadamente)`;
    }
}
function relog(error) {
    window.location.reload()
}