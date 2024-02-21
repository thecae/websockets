const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  // When a user sends a chat message
  socket.on('chat message', ({msg}) => {
    io.emit('chat message', {msg});
  });

  // When a client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.broadcast.emit('chat message', {msg: 'Someone just joined'});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
