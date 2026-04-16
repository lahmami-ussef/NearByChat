import React from 'react';
// Importation du constructeur de pile (Stack) pour la navigation linéaire
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importation des écrans liés à l'authentification
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Création de l'objet Stack pour définir les routes
const Stack = createNativeStackNavigator();

/**
 * AuthNavigator : Gère le flux des utilisateurs non-connectés.
 */
export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login" // L'écran par défaut est la connexion
      screenOptions={{ headerShown: false }} // Cache l'en-tête par défaut pour un look personnalisé
    >
      {/* Route pour la page de connexion */}
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Route pour la page de création de compte */}
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

