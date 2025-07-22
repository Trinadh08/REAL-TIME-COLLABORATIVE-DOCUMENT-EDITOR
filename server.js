const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let documentContent = "";  // shared document text

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current document to new user
  socket.emit('load-document', documentContent);

  // Listen for edits
  socket.on('edit-document', (content) => {
    documentContent = content;
    socket.broadcast.emit('update-document', content);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
