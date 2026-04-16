import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
// Store pour gérer l'état de l'utilisateur
import useAuthStore from '../../store/authStore';
// Services API et Socket
import { loginUser, setAuthToken } from '../../services/api.service';
import socketService from '../../services/socket.service';

/**
 * LoginScreen : Écran de connexion de l'application.
 */
export default function LoginScreen({ navigation }) {
  // --- ÉTATS LOCAUX ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Pour afficher le spinner lors du chargement
  const [error, setError] = useState('');         // Pour afficher les messages d'erreur
  
  // Accès aux actions du store global
  const { setUser, setToken } = useAuthStore();

  /**
   * Gère la tentative de connexion
   */
  const handleLogin = async () => {
    // Vérification basique des champs
    if (!username || !password) { setError('Remplis tous les champs'); return; }
    
    setLoading(true); 
    setError('');
    
    try {
      // 1. Appel API au backend NestJS (POST /auth/login)
      const res = await loginUser({ username, password });
      
      // 2. Configuration du token JWT pour toutes les futures requêtes Axios
      setAuthToken(res.data.access_token);
      
      // 3. Sauvegarde du token et des infos user dans le store global (Zustand)
      setToken(res.data.access_token);
      setUser(res.data.user);
      
      // 4. Initialisation de la connexion Socket.io avec le nouveau token
      socketService.connect(res.data.access_token);
      
      setLoading(false);
    } catch (err) {
      // Gestion des erreurs (identifiants incorrects, serveur hors ligne, etc.)
      setError(err.response?.data?.message || 'Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        {/* En-tête avec Logo et Titre */}
        <Text style={styles.logo}>📍</Text>
        <Text style={styles.title}>NearbyChat</Text>
        <Text style={styles.subtitle}>Discute avec les gens près de toi</Text>
      </View>

      <View style={styles.form}>
        {/* Affichage des erreurs si elles existent */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        {/* Champs de saisie */}
        <TextInput
          style={styles.input} 
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#888" 
          value={username}
          onChangeText={setUsername} 
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input} 
          placeholder="Mot de passe"
          placeholderTextColor="#888" 
          value={password}
          onChangeText={setPassword} 
          secureTextEntry // Cache les caractères du mot de passe
        />

        {/* Bouton de connexion */}
        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleLogin} 
          disabled={loading} // Désactivé pendant le chargement
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        {/* Lien vers l'inscription */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>
            Pas de compte ? <Text style={styles.linkBold}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// styles : Design moderne et sombre (Dark Mode)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 6 },
  form: { gap: 12 },
  input: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2A2A2A' },
  btn: { backgroundColor: '#0A84FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#888', marginTop: 16 },
  linkBold: { color: '#0A84FF', fontWeight: '700' },
  error: { color: '#0A84FF', textAlign: 'center', fontSize: 13 },
});

