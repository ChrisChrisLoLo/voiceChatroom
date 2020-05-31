const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ss = require("socket.io-stream");
const {spawn} = require("child_process");

const port = process.env.PORT || 3001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("newMessage", (msg) => {
    console.log("new message");
    const espeak  = spawn("espeak", [msg, "--stdout"]);
    const stream = ss.createStream();
    espeak.stdout.pipe(stream)
    ss(socket).emit('track-stream', stream);
    io.emit("newMessage", {msg:msg});
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));