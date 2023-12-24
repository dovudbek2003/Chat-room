(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", (e) => {
        e.preventDefault()

        let username = app.querySelector(".join-screen #username").value
        if (username.length == 0) {
            return
        }
        socket.emit("newuser", username)
        uname = username
        app.querySelector(".join-screen").classList.remove("active")
        app.querySelector(".chat-screen").classList.add("active")

        app.querySelector(".chat-screen .logo").innerText = uname
    })


    app.querySelector(".chat-screen #send-message").addEventListener("click", (e) => {
        e.preventDefault()

        let message = app.querySelector(".chat-screen #message-input").value
        if (message.length == 0) {
            return;
        }

        renderMessage("my", {
            username: uname,
            text: message
        })

        socket.emit("chat", {
            username: uname,
            text: message
        })

        app.querySelector(".chat-screen #message-input").value = ""

    })

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", (e) => {
        e.preventDefault()

        socket.emit("exituser", uname)

        window.location.href = window.location.href
    })

    socket.on("update", (update) => {
        renderMessage("update", update)
    })

    socket.on("chat", (message) => {
        renderMessage("other", message)
    })

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages")

        if (type == "my") {
            let el = document.createElement("div")
            el.setAttribute("class", "message my-message")
            el.innerHTML = `
                    <div>
                        <div class="name">You</div>
                        <div class="text">${message.text}</div>
                    </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement("div")
            el.setAttribute("class", "message other-message")
            el.innerHTML = `
                    <div>
                        <div class="name">${message.username}</div>
                        <div class="text">${message.text}</div>
                    </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div")
            el.setAttribute("class", "message update")
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        // scrol chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})()

