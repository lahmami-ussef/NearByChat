import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { MOCK_USER } from '../../mock/mockData';

// MOCK MODE — remplace handleRegister par l'appel réel :
//   const res = await registerUser({ username, password });
import { registerUser, setAuthToken } from '../../services/api.service';
import socketService from '../../services/socket.service';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken } = useAuthStore();

  const handleRegister = async () => {
    if (!username || !password || !confirm) { setError('Remplis tous les champs'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    if (password.length < 6) { setError('Mot de passe trop court (6 min)'); return; }
    setLoading(true); setError('');
    try {
      const res = await registerUser({ username, password });
      setAuthToken(res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      socketService.connect(res.data.access_token);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>📍</Text>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoins ta zone locale</Text>
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
          <TextInput
            style={styles.input} placeholder="Confirmer le mot de passe"
            placeholderTextColor="#888" value={confirm}
            onChangeText={setConfirm} secureTextEntry
          />
          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Créer mon compte</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 6 },
  form: { gap: 12 },
  input: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2A2A2A' },
  btn: { backgroundColor: '#0A84FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#888', marginTop: 16 },
  linkBold: { color: '#0A84FF', fontWeight: '700' },
  error: { color: '#0A84FF', textAlign: 'center', fontSize: 13 },
});
