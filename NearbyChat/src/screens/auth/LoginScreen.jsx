import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { MOCK_USER } from '../../mock/mockData';

// ─── MOCK MODE ─────────────────────────────────────────────────────────────
// Quand le backend est prêt, remplace handleLogin par :
//   const res = await loginUser({ username, password });
//   setToken(res.data.token);  setUser(res.data.user);
import { loginUser, setAuthToken } from '../../services/api.service';
import socketService from '../../services/socket.service';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken } = useAuthStore();

  const handleLogin = async () => {
    if (!username || !password) { setError('Remplis tous les champs'); return; }
    setLoading(true); setError('');
    try {
      const res = await loginUser({ username, password });
      setAuthToken(res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      socketService.connect(res.data.access_token);
      setLoading(false);
    } catch (err) {
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
        <Text style={styles.logo}>📍</Text>
        <Text style={styles.title}>NearbyChat</Text>
        <Text style={styles.subtitle}>Discute avec les gens près de toi</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input} placeholder="Nom d'utilisateur"
          placeholderTextColor="#888" value={username}
          onChangeText={setUsername} autoCapitalize="none"
        />
        <TextInput
          style={styles.input} placeholder="Mot de passe"
          placeholderTextColor="#888" value={password}
          onChangeText={setPassword} secureTextEntry
        />
        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Se connecter</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Pas de compte ? <Text style={styles.linkBold}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
