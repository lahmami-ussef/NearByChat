import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useAuthStore from '../../store/authStore';
import useZoneStore from '../../store/zoneStore';
import useChatStore from '../../store/chatStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { currentZone } = useZoneStore();
  const { clearChat } = useChatStore();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter', style: 'destructive',
        onPress: () => { clearChat(); logout(); },
      },
    ]);
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.joined}>Membre depuis {formatDate(user?.createdAt)}</Text>

      {/* Current Zone */}
      {currentZone && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Zone actuelle</Text>
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: currentZone.color }]} />
            <Text style={styles.cardValue}>{currentZone.name}</Text>
          </View>
        </View>
      )}

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Stats</Text>
        <Text style={styles.cardValue}>Zones visitées : —</Text>
        <Text style={styles.cardValue}>Messages envoyés : —</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', padding: 24, paddingTop: 60, alignItems: 'center' },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  username: { color: '#fff', fontSize: 22, fontWeight: '700' },
  joined: { color: '#888', fontSize: 13, marginTop: 4, marginBottom: 24 },
  card: { width: '100%', backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 12, gap: 6 },
  cardLabel: { color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  cardValue: { color: '#fff', fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  logoutBtn: { marginTop: 24, backgroundColor: '#2A0000', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#0A84FF44' },
  logoutText: { color: '#0A84FF', fontWeight: '700', fontSize: 15 },
});
