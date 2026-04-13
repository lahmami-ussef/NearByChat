import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

// Affiché automatiquement quand l'utilisateur change de zone
// Utilisation : dans AppNavigator, ecouter le changement de zone
// et afficher cet ecran pendant 2s avant de rejoindre le nouveau chat

export default function ZoneTransitionScreen({ newZone, onDone }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        onDone?.();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.label}>Nouvelle zone</Text>
        <View style={[styles.dot, { backgroundColor: newZone?.color || '#0A84FF' }]} />
        <Text style={styles.name}>{newZone?.name || 'Zone inconnue'}</Text>
        <Text style={styles.sub}>Connexion au chat local...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center' },
  card: { alignItems: 'center', gap: 12, padding: 32, backgroundColor: '#1A1A1A', borderRadius: 24, minWidth: 240 },
  icon: { fontSize: 40 },
  label: { color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  sub: { color: '#666', fontSize: 13 },
});