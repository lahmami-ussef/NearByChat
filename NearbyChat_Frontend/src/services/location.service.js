// Importation du module de localisation d'Expo pour gérer le GPS
import * as Location from 'expo-location';

// Variable pour stocker l'identifiant du "watcher" (surveillance continue de la position)
let watcherId = null;

// Objet service regroupant toutes les fonctionnalités liées à la géolocalisation
export const locationService = {
  
  // Demande l'autorisation à l'utilisateur d'accéder à sa position en premier plan
  async requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    // Retourne vrai si l'utilisateur a accepté
    return status === 'granted';
  },

  // Récupère la position géographique actuelle (une seule fois)
  async getCurrentPosition() {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High, // Précision élevée requise pour une meilleure expérience
    });
    // Retourne uniquement les coordonnées nécessaires (latitude et longitude)
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  // Démarre la surveillance continue de la position de l'utilisateur
  async startWatching(onUpdate) {
    // Si une surveillance est déjà en cours, on ne fait rien
    watcherId = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced, // Précision équilibrée pour économiser la batterie
        timeInterval: 10000,   // Mise à jour toutes les 10 secondes
        distanceInterval: 20,  // Ou si l'utilisateur se déplace de plus de 20 mètres
      },
      (location) => {
        // Appelle la fonction de rappel (callback) avec les nouvelles coordonnées
        onUpdate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  },

  // Arrête la surveillance de la position pour libérer les ressources
  stopWatching() {
    if (watcherId) {
      watcherId.remove(); // Supprime l'abonnement aux mises à jour
      watcherId = null;   // Réinitialise l'ID
    }
  },
};

// Exportation du service de localisation par défaut
export default locationService;

