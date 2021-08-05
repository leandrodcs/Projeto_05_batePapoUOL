const url = {
    users: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",
    status: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
    messages: "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages"
}
let username = "";
askName();
function askName() {
    const name = prompt("Qual é seu nome?");
    const nameObject = {name};
    username = nameObject.name;
    const promise = axios.post(url.users, nameObject);
    promise.then(availableUser);
    promise.catch(unavailableUser);
}
function availableUser(response) {
    console.log("Esse nome está disponível!")

}
function unavailableUser(error) {
    console.log("Já tem esse nome mané!")
    askName();
}
loadMessages();
function loadMessages() {
    const promise = axios.get(url.messages);
    promise.then(printMessages);
}
function printMessages(response) {
    const messages = response;
    console.log(messages.data);
    document.querySelector(".main").innerHTML = "";
    const main = document.querySelector(".main");
    for(i=0;i<messages.data.length;i++) {
        if(messages.data[i].type === "status") {
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
        if(messages.data[i].type === "message") {
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
        if(messages.data[i].type === "private_message") {
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
function sendMessages() {
    
    const message = {
        from: username,
        to: "Todos",
        text: document.querySelector(".input").value,
        type: "message",
    }
    const promise = axios.post(url.messages, message);
    promise.then(loadMessages);
}