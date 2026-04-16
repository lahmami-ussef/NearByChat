import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// Importation des stores pour accéder aux données et aux actions de déconnexion
import useAuthStore from '../../store/authStore';
import useZoneStore from '../../store/zoneStore';
import useChatStore from '../../store/chatStore';

/**
 * ProfileScreen : Affiche les informations de l'utilisateur et gère la déconnexion.
 */
export default function ProfileScreen() {
  // Récupération de l'utilisateur et de la fonction logout (Zustand)
  const { user, logout } = useAuthStore();
  // Récupération de la zone actuelle
  const { currentZone } = useZoneStore();
  // Récupération de la fonction pour vider le chat
  const { clearChat } = useChatStore();

  /**
   * Gère la déconnexion sécurisée de l'utilisateur
   */
  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter', 
        style: 'destructive',
        onPress: () => { 
          // 1. Vider les messages du store local
          clearChat(); 
          // 2. Supprimer les infos utilisateur et le token (ce qui redirige vers AuthNavigator)
          logout(); 
        },
      },
    ]);
  };

  // Calcul des initiales (ex: "youssef" -> "YO")
  const initials = user?.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <View style={styles.container}>
      {/* Photo de profil (Avatar généré avec initiales) */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.joined}>Membre depuis {formatDate(user?.createdAt)}</Text>

      {/* Carte affichant la zone où se trouve l'utilisateur */}
      {currentZone && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Zone actuelle</Text>
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: currentZone.color }]} />
            <Text style={styles.cardValue}>{currentZone.name}</Text>
          </View>
        </View>
      )}

      {/* Section Statistiques (Placeholders pour l'instant) */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Stats</Text>
        <Text style={styles.cardValue}>Zones visitées : —</Text>
        <Text style={styles.cardValue}>Messages envoyés : —</Text>
      </View>

      {/* Bouton de déconnexion stylisé */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Utilitaire pour formater la date de création du compte
 */
function formatDate(iso) {
  if (!iso) return '—';
  // Formate la date en français (ex: "avril 2026")
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

// styles : Design sombre et épuré
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

