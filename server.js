const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  let currentUser = '';

  // User joins the chat
  socket.on('join', (username) => {
    currentUser = username;
    socket.broadcast.emit('user-joined', username);
  });

  // User sends a message
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
  });

  // User leaves the chat
  socket.on('disconnect', () => {
    if (currentUser) {
      io.emit('user-left', currentUser);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
