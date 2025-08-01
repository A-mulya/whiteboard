const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const roomStates = {};

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`🔗 Socket ${socket.id} joined room: ${roomId}`);

    if (!roomStates[roomId]) {
      roomStates[roomId] = [];
    }

    socket.emit('whiteboard-state', roomStates[roomId]);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 Socket ${socket.id} left room: ${roomId}`);
  });

  socket.on('element-update', ({ roomId, ...elementData }) => {
    if (!roomId) return;

    const roomElements = roomStates[roomId] || [];
    const index = roomElements.findIndex(el => el.id === elementData.id);

    if (index !== -1) {
      roomElements[index] = { ...roomElements[index], ...elementData };
    } else {
      roomElements.push(elementData);
    }

    roomStates[roomId] = roomElements;

    socket.to(roomId).emit('element-update', elementData);
  });

  socket.on('clear-whiteboard', (roomId) => {
    if (!roomId) return;
    roomStates[roomId] = [];
    io.to(roomId).emit('whiteboard-clear');
  });

  socket.on('cursor-position', ({ roomId, ...cursorData }) => {
    if (!roomId) return;
    socket.to(roomId).emit('cursor-position', {
      ...cursorData,
      userId: socket.id,
    });
  });

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('user-disconnected', socket.id);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
