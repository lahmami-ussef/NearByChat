import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ZoneBadge({ zone, onPress }) {
  if (!zone) return null;
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: zone.color }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{zone.name}</Text>
        <Text style={styles.count}>{zone.userCount} personnes ici</Text>
      </View>
      {onPress && (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, gap: 12 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  info: { flex: 1 },
  name: { color: '#fff', fontWeight: '700', fontSize: 15 },
  count: { color: '#888', fontSize: 12, marginTop: 2 },
  btn: { backgroundColor: '#0A84FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});