
import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setElements, updateElement } from '../Whiteboard/whiteboardSlice';
import { updateCursorPosition, removeCursorPosition } from '../CursorOverlay/cursorSlice';

let socket;
let mySocketId;

export const connectWithSocketServer = () => {
  socket = io(process.env.REACT_APP_SOCKET_URL); // ✅ Use env variable

  socket.on('connect', () => {
    console.log('Connected to socket server');
    mySocketId = socket.id;
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

  socket.on('user-disconnected', (disconnectedUserId) => {
    store.dispatch(removeCursorPosition(disconnectedUserId));
  });
};

export const getMySocketId = () => mySocketId;

export const emitElementUpdate = (elementData) => {
  if (socket) {
    socket.emit('element-update', elementData);
  }
};

export const emitClearWhiteboard = () => {
  if (socket) {
    socket.emit('clear-whiteboard');
  }
};

export const emitCursorPosition = (cursorData) => {
  if (socket) {
    socket.emit('cursor-position', cursorData);
  }
};