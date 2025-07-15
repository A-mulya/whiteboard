const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const server = http.createServer(app);

app.use(cors());

let elements = [];

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // send current elements to the newly connected client
  io.to(socket.id).emit('whiteboard-state', elements);

  // handle element update
  socket.on('element-update', (elementData) => {
    updateElementInElements(elementData);

    // broadcast updated element to everyone else
    socket.broadcast.emit('element-update', elementData);
  });

  // handle whiteboard clear
  socket.on('clear-whiteboard', () => {
    elements = [];
    socket.broadcast.emit('whiteboard-clear');
  });

  // handle cursor position
  socket.on('cursor-position', (cursorData) => {
    socket.broadcast.emit('cursor-position', {
      ...cursorData,
      userId: socket.id,
    });
  });

  // 🔷 NEW: handle disconnect
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const updateElementInElements = (elementData) => {
  const index = elements.findIndex(el => el.id === elementData.id);
  if (index !== -1) {
    elements[index] = elementData; // update existing
  } else {
    elements.push(elementData); // add new
  }
};
