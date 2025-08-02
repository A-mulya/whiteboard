const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authroute');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Mount Auth API
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running and API is ready');
});

// ================== SOCKET.IO SETUP ==================
const elements = {}; // roomId -> array of elements
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

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

function updateElementInElements(roomId, elementData) {
  const roomElements = elements[roomId];
  const index = roomElements.findIndex(el => el.id === elementData.id);
  if (index !== -1) {
    roomElements[index] = elementData;
  } else {
    roomElements.push(elementData);
  }
}

// Start server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
