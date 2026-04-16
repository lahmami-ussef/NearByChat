// Importation de la fonction 'create' de Zustand pour la gestion d'état global
import { create } from 'zustand';

/**
 * useAuthStore : Gère l'état global de l'authentification.
 * Stocke les informations de l'utilisateur et le jeton JWT.
 */
const useAuthStore = create((set) => ({
  // --- ÉTAT (STATE) ---
  user: null,  // Contiendra les infos de l'utilisateur ({id, username, email})
  token: null, // Contiendra le JWT pour les requêtes API et socket

  // --- ACTIONS ---
  
  // Met à jour les informations de l'utilisateur
  setUser: (user) => set({ user }),
  
  // Enregistre le jeton d'accès
  setToken: (token) => set({ token }),
  
  // Réinitialise l'état lors de la déconnexion
  logout: () => set({ user: null, token: null }),
}));

// Exportation du hook par défaut
export default useAuthStore;

