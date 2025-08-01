const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const server = http.createServer(app);
app.use(cors());

const elements = {}; // key: roomId, value: array of whiteboard elements

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    if (!elements[roomId]) elements[roomId] = [];
    io.to(socket.id).emit('whiteboard-state', elements[roomId]);
  });

  socket.on('element-update', (elementData) => {
    const roomId = socket.roomId || 'public-room';
    if (!elements[roomId]) elements[roomId] = [];
    updateElementInElements(roomId, elementData);
    socket.to(roomId).emit('element-update', elementData);
  });

  socket.on('clear-whiteboard', () => {
    const roomId = socket.roomId || 'public-room';
    elements[roomId] = [];
    socket.to(roomId).emit('whiteboard-clear');
  });

  socket.on('cursor-position', (cursorData) => {
    const roomId = socket.roomId || 'public-room';
    socket.to(roomId).emit('cursor-position', {
      ...cursorData,
      userId: socket.id,
    });
  });

  socket.on('disconnect', () => {
    const roomId = socket.roomId || 'public-room';
    socket.to(roomId).emit('user-disconnected', socket.id);
  });
});

const updateElementInElements = (roomId, elementData) => {
  const roomElements = elements[roomId];
  const index = roomElements.findIndex(el => el.id === elementData.id);
  if (index !== -1) {
    roomElements[index] = elementData;
  } else {
    roomElements.push(elementData);
  }
};

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
