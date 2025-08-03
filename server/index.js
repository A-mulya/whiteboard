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
  console.log('Server is running on port ${PORT}');
});

const updateElementInElements = (elementData) => {
  const index = elements.findIndex(el => el.id === elementData.id);
  if (index !== -1) {
    elements[index] = elementData; // update existingconst express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());

// In-memory storage for whiteboard elements
let elements = [];

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send current whiteboard state to newly connected client
  io.to(socket.id).emit('whiteboard-state', elements);

  // Receive and broadcast element updates
  socket.on('element-update', (elementData) => {
    updateElementInElements(elementData);
    socket.broadcast.emit('element-update', elementData);
  });

  // Handle whiteboard clear event
  socket.on('clear-whiteboard', () => {
    elements = [];
    socket.broadcast.emit('whiteboard-clear');
  });

  // Broadcast cursor position to others
  socket.on('cursor-position', (cursorData) => {
    socket.broadcast.emit('cursor-position', {
      ...cursorData,
      userId: socket.id,
    });
  });

  // Notify others on disconnect
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

// Basic server route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helper: Update or add an element to the array
const updateElementInElements = (elementData) => {
  const index = elements.findIndex(el => el.id === elementData.id);
  if (index !== -1) {
    elements[index] = elementData; // Update existing element
  } else {
    elements.push(elementData); // Add new element
  }
};

  } else {
    elements.push(elementData); // add new
  }
};