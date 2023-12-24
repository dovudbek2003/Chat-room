const express = require("express")
const { createServer } = require("http")
const { join } = require("path")
const ejs = require("ejs")
const { Server } = require("socket.io")


const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(join(__dirname, "../", "public")))
app.set("views", join(__dirname, "views"))
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index")
})


io.on('connection', (socket) => {
    socket.on("newuser", (username) => {
        socket.broadcast.emit("update", username + " joined the conversation")
    })

    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", username + " left the conversation")
    })

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message)
    })

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});

const PORT = 7777
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})