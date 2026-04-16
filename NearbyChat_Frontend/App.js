// Importation de la fonction de démarrage d'Expo
import { registerRootComponent } from 'expo';
// Importation du composant de navigation principal (le point d'entrée logique)
import AppNavigator from './src/navigation/AppNavigator';

/**
 * App : La racine de l'application mobile.
 * Ce composant enveloppe toute la logique de navigation
 *  définie dans AppNavigator.
 */
function App() {
  return <AppNavigator />;
}

// Enregistrement du composant racine pour qu'Expo sache quoi lancer au démarrage
registerRootComponent(App);