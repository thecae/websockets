const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  // When a user joins a room
  socket.on('join room', ({ name, room }) => {
    console.log(`${name} joined room: ${room}`);
    socket.join(room);
    // Broadcast to the room that a new user has joined
    socket.to(room).emit('chat message', { name: 'System', msg: `${name} has joined the chat!` });
  });

  // When a user sends a chat message
  socket.on('chat message', ({ name, room, msg }) => {
    socket.to(room).emit('chat message', { name, msg });
  });

  // When a user is typing
  socket.on('typing', ({ name, room }) => {
    socket.to(room).emit('typing', `${name} is typing...`);
  });

  // When a client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Optionally, handle leaving the chat (not implemented here)
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
