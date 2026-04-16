import React from 'react';
// Importation du constructeur de navigation par onglets (Tabs) en bas de l'écran
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
// Importation des écrans principaux de l'application
import MapScreen from '../screens/map/MapScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Création de l'objet Tab pour définir les onglets
const Tab = createBottomTabNavigator();

// Petite fonction utilitaire pour afficher un emoji comme icône d'onglet
const icon = (emoji) => () => <Text style={{ fontSize: 22 }}>{emoji}</Text>;

/**
 * TabNavigator : Gère l'interface principale après connexion.
 */
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // On gère l'en-tête nous-mêmes dans les écrans
        // Style de la barre d'onglets (Sombre pour un look moderne)
        tabBarStyle: { backgroundColor: '#1A1A1A', borderTopColor: '#2A2A2A' },
        tabBarActiveTintColor: '#0A84FF', // Couleur de l'onglet actif (Bleu)
        tabBarInactiveTintColor: '#666',   // Couleur de l'onglet inactif (Gris)
      }}
    >
      {/* Onglet Carte : Pour voir la position et les zones */}
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Carte', tabBarIcon: icon('🗺️') }} 
      />
      
      {/* Onglet Chat : Pour discuter dans la zone actuelle */}
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ title: 'Chat', tabBarIcon: icon('💬') }} 
      />
      
      {/* Onglet Profil : Pour gérer son compte et se déconnecter */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil', tabBarIcon: icon('👤') }} 
      />
    </Tab.Navigator>
  );
}

