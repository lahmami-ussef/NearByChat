import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.3:3000'; // ← change to your backend URL

let socket = null;

export const socketService = {
  connect(token) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  emit(event, data) {
    if (socket) socket.emit(event, data);
  },

  on(event, callback) {
    if (socket) socket.on(event, callback);
  },

  off(event) {
    if (socket) socket.off(event);
  },

  getSocket() {
    return socket;
  },
};

export default socketService;
