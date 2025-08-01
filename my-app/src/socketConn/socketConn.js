import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setElements, updateElement } from '../Whiteboard/whiteboardSlice';
import { updateCursorPosition, removeCursorPosition } from '../CursorOverlay/cursorSlice';

let socket = null;
let currentRoomId = null;

export const connectWithSocketServer = (roomId) => {
  if (!roomId) return console.error('Room ID is required');

  if (!socket || !socket.connected) {
    socket = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      socket.emit('join-room', roomId);
      currentRoomId = roomId;
    });

    socket.on('whiteboard-state', (elements) => {
      store.dispatch(setElements(elements));
    });

    socket.on('element-update', (elementData) => {
      store.dispatch(updateElement(elementData));
    });

    socket.on('whiteboard-clear', () => {
      store.dispatch(setElements([]));
    });

    socket.on('cursor-position', (cursorData) => {
      store.dispatch(updateCursorPosition(cursorData));
    });

    socket.on('user-disconnected', (userId) => {
      store.dispatch(removeCursorPosition(userId));
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from socket server');
    });
  } else if (currentRoomId !== roomId) {
    socket.emit('leave-room', currentRoomId);
    socket.emit('join-room', roomId);
    store.dispatch(setElements([]));
    currentRoomId = roomId;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentRoomId = null;
    console.log('🚫 Socket disconnected');
  }
};

export const getMySocketId = () => socket?.id;

export const emitElementUpdate = (elementData) => {
  if (socket && currentRoomId) {
    socket.emit('element-update', { roomId: currentRoomId, ...elementData });
  }
};

export const emitClearWhiteboard = () => {
  if (socket && currentRoomId) {
    socket.emit('clear-whiteboard', currentRoomId);
  }
};

export const emitCursorPosition = (cursorData) => {
  if (socket && currentRoomId) {
    socket.emit('cursor-position', { roomId: currentRoomId, ...cursorData });
  }
};
