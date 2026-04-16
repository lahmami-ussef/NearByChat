import React, { useEffect } from 'react';
// Importation du conteneur principal de navigation
import { NavigationContainer } from '@react-navigation/native';
// Importation des deux flots de navigation (Authentifié vs Non-authentifié)
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
// Importation du store pour vérifier si l'utilisateur est connecté (token)
import useAuthStore from '../store/authStore';
// Importation du service socket pour gérer la connexion temps réel
import socketService from '../services/socket.service';

/**
 * AppNavigator : C'est le composant racine de la navigation.
 * Il décide quel écran afficher en fonction de l'état de connexion.
 */
export default function AppNavigator() {
  // On récupère le jeton (token) depuis le store global
  const { token } = useAuthStore();

  // Effet pour gérer la connexion WebSocket automatiquement
  useEffect(() => {
    if (token) {
      // Si l'utilisateur est connecté, on ouvre le tunnel Socket.io
      socketService.connect(token);
    } else {
      // Si l'utilisateur est déconnecté, on ferme le tunnel
      socketService.disconnect();
    }
  }, [token]); // Se déclenche chaque fois que le token change

  return (
    <NavigationContainer>
      {/* 
          Logique de routage principale :
          - Si token présent -> On affiche le TabNavigator (l'application principale)
          - Si token absent  -> On affiche l'AuthNavigator (Login / Register)
      */}
      {token ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}