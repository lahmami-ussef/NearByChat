// Importation du client Socket.io pour la communication en temps réel
import { io } from 'socket.io-client';

// URL du serveur WebSocket (le même que le backend NestJS)
const SOCKET_URL = 'http://192.168.1.3:3000'; 

// Variable pour stocker l'instance unique du socket
let socket = null;

// Objet service pour centraliser la logique de communication en temps réel
export const socketService = {
  
  // Établit une connexion avec le serveur en envoyant le jeton d'authentification
  connect(token) {
    socket = io(SOCKET_URL, {
      auth: { token }, // Envoie le token JWT pour que le Gateway NestJS puisse identifier l'utilisateur
      transports: ['websocket'], // Force l'utilisation du protocole WebSocket
      reconnection: true, // Active la reconnexion automatique
      reconnectionDelay: 1000, // Attend 1 seconde avant de réessayer en cas de déconnexion
      reconnectionAttempts: 5, // Limite à 5 tentatives de reconnexion
    });
    return socket;
  },

  // Ferme proprement la connexion WebSocket
  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null; // Réinitialise l'instance
    }
  },

  // Envoie un événement (message) au backend
  emit(event, data) {
    if (socket) socket.emit(event, data);
  },

  // Écoute un événement provenant du backend (ex: 'new_message')
  on(event, callback) {
    if (socket) socket.on(event, callback);
  },

  // Arrête d'écouter un événement spécifique
  off(event) {
    if (socket) socket.off(event);
  },

  // Retourne l'instance actuelle du socket
  getSocket() {
    return socket;
  },
};

// Exportation du service socket par défaut
export default socketService;

