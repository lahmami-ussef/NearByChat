// Importation de Zustand pour la gestion d'état
import { create } from 'zustand';

/**
 * useChatStore : Gère l'état global de la messagerie en temps réel.
 * Permet de stocker les messages reçus et l'état de la connexion socket.
 */
const useChatStore = create((set) => ({
  // --- ÉTAT (STATE) ---
  messages: [],      // Liste de tous les messages de la zone actuelle
  typingUser: null,  // Nom de l'utilisateur qui est en train d'écrire
  status: 'idle',    // État de la connexion : idle | connecting | connected | disconnected

  // --- ACTIONS ---

  // Remplace toute la liste de messages (pour le chargement initial)
  setMessages: (messages) => set({ messages }),

  // Ajoute un seul nouveau message à la fin de la liste existante
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  // Enregistre quel utilisateur est en train de taper (ou null si personne)
  setTypingUser: (username) => set({ typingUser: username }),

  // Met à jour le statut de la connexion WebSocket
  setStatus: (status) => set({ status }),

  // Vide le chat (par exemple en changeant de zone ou en se déconnectant)
  clearChat: () => set({ messages: [], typingUser: null }),
}));

// Exportation du hook par défaut
export default useChatStore;

