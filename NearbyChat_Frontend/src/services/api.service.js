// Importation de la bibliothèque Axios pour effectuer des requêtes HTTP
import axios from 'axios';

// Définition de l'URL de base du backend (adresse IP locale et port de NestJS)
const BASE_URL = 'http://192.168.1.3:3000'; 

// Création d'une instance Axios avec la configuration de base
const api = axios.create({ baseURL: BASE_URL });

// Fonction pour attacher ou supprimer le jeton JWT des en-têtes de chaque requête
export const setAuthToken = (token) => {
  if (token) {
    // Si un token existe, on l'ajoute dans le header 'Authorization' (Bearer Token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Sinon, on supprime le header d'autorisation
    delete api.defaults.headers.common['Authorization'];
  }
};

// ─── AUTHENTIFICATION ─────────────────────────────────────────────
// Envoie les données d'inscription au backend (POST /auth/register)
export const registerUser = (data) => api.post('/auth/register', data);
// Envoie les identifiants pour se connecter (POST /auth/login)
export const loginUser = (data) => api.post('/auth/login', data);

// ─── ZONES GÉOGRAPHIQUES ─────────────────────────────────────────
// Récupère toutes les zones disponibles (GET /zone/all)
export const getAllZones = () => api.get('/zone/all');
// Identifie la zone actuelle en fonction des coordonnées (POST /zone/resolve)
export const resolveZone = (coords) => api.post('/zone/resolve', coords);

// ─── MESSAGES ────────────────────────────────────────────────────
// Récupère l'historique des messages d'une zone spécifique (GET /messages/:zoneId)
export const getMessages = (zoneId) => api.get(`/messages/${zoneId}`);

// ─── UTILISATEUR ──────────────────────────────────────────────────
// Récupère les informations du profil de l'utilisateur connecté (GET /user/me)
export const getMyProfile = () => api.get('/user/me');

// Exportation de l'instance API globale par défaut
export default api;

