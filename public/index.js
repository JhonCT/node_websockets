const socket = io();

let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let user = JSON.parse(localStorage.getItem("user"));

function allData() {
    fetch("/user/all").then(res => res.json()).then(users => {
        users.forEach(user => {
            contacts.innerHTML += ` <li>
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="${user.photo}"
                        class="rounded-circle user_img">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span>${user.name}</span>
                    <p>${user.email}</p>
                </div>
            </div>
        </li>`;
        });
    });

    fetch("/message/all").then(res => res.json()).then(messages => {
        messages.forEach(message => {
            let myMessage = `<div class="d-flex justify-content-end mb-4">
    <div class="msg_cotainer_send">
        ${message.message}
        <span class="msg_time_send">${message.date}</span>
    </div>
    <div class="img_cont_msg">
        <img src="${message.photo}"  class="rounded-circle user_img_msg" />
    </div>
</div>`;
            let otherMessage = `<div class="d-flex justify-content-start mb-4">
    <div class="img_cont_msg">
        <img src="${message.photo}" class="rounded-circle user_img_msg">
    </div>
    <div class="msg_cotainer">
        ${message.message}
        <span class="msg_time">${message.date}</span>
    </div>
</div>`;

            actions.innerHTML = '';

            if (message.username == user.displayName) {
                output.innerHTML += myMessage;
            } else {
                output.innerHTML += otherMessage;
            }
        });
    });
}

btn.addEventListener('click', () => {
    let date = moment(Date.now()).format("DD MMM YYYY hh:mm a");
    socket.emit('chat:message', {
        message: message.value,
        username: user.displayName,
        photo: user.photoURL,
        date: date,
    });
})

message.addEventListener('keypress', () => {
    socket.emit('chat:typing', user.displayName);
})

socket.on('chat:message', (data) => {
    let myMessage = `<div class="d-flex justify-content-end mb-4">
    <div class="msg_cotainer_send">
        ${data.message}
        <span class="msg_time_send">${data.date}</span>
    </div>
    <div class="img_cont_msg">
        <img src="${data.photo}"  class="rounded-circle user_img_msg" />
    </div>
</div>`;
    let otherMessage = `<div class="d-flex justify-content-start mb-4">
    <div class="img_cont_msg">
        <img src="${data.photo}" class="rounded-circle user_img_msg">
    </div>
    <div class="msg_cotainer">
        ${data.message}
        <span class="msg_time">${data.date}</span>
    </div>
</div>`;

    actions.innerHTML = '';

    if (data.username == user.displayName) {
        output.innerHTML += myMessage;
    } else {
        output.innerHTML += otherMessage;
    }
});

socket.on('chat:typing', (data) => {
    actions.innerHTML = `<p><em>${data} is typing a message</em></p>`;
})

