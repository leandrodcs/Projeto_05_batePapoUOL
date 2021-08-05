

loadMessages();
function loadMessages() {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    promise.then(printMessages);
}
function printMessages(messages) {
    console.log(messages.data);
    for(i=0;i<messages.data.length;i++) {
        if(messages.data[i].type === "status") {
            document.querySelector(".main").innerHTML += `<div class="message movement"><p><span class="time">(${messages.data[i].time})
             </span><span class="name">${messages.data[i].from}</span> ${messages.data[i].text}</p></div>`;
        }
        if(messages.data[i].type === "message") {
            document.querySelector(".main").innerHTML += `<div class="message "><p><span class="time">(${messages.data[i].time}) </span>
            <span class="name">${messages.data[i].from}</span> para <span class="name">${messages.data[i].to}</span>: <span class="content">${messages.data[i].text}</span></p></div>`
        }
        if(messages.data[i].type === "private_message") {
            `<div class="message private"><p><span class="time">(${messages.data[i].time}) </span><span class="name">${messages.data[i].from}
            </span> reservadamente para <span class="name">${messages.data[i].to}</span>: <span class="content">${messages.data[i].text}</span></p></div>`
        }
    }
}