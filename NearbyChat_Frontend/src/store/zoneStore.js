// Importation de Zustand pour la gestion d'état
import { create } from 'zustand';

/**
 * useZoneStore : Gère l'état global lié aux zones géographiques.
 * Permet de savoir dans quelle zone se trouve l'utilisateur et combien de personnes y sont.
 */
const useZoneStore = create((set) => ({
  // --- ÉTAT (STATE) ---
  currentZone: null,  // La zone actuelle de l'utilisateur (ex: Quartier A)
  previousZone: null, // Utile pour savoir si l'utilisateur vient de changer de zone
  allZones: [],       // Liste de toutes les zones disponibles sur la carte
  userCount: 0,       // Nombre d'utilisateurs connectés dans la zone actuelle

  // --- ACTIONS ---

  // Définit la zone actuelle et archive l'ancienne zone dans 'previousZone'
  setCurrentZone: (zone) =>
    set((state) => ({ previousZone: state.currentZone, currentZone: zone })),
  
  // Charge la liste de toutes les zones (souvent au démarrage de l'app)
  setAllZones: (zones) => set({ allZones: zones }),
  
  // Met à jour le compteur d'utilisateurs présents dans la zone
  setUserCount: (count) => set({ userCount: count }),
}));

// Exportation du hook par défaut
export default useZoneStore;

