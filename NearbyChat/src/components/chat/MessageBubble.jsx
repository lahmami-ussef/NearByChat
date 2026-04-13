import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message }) {
  const { username, text, createdAt, isOwn } = message;
  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      {!isOwn && <Text style={styles.username}>{username}</Text>}
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.text, isOwn && styles.textOwn]}>{text}</Text>
        <Text style={[styles.time, isOwn && styles.timeOwn]}>{new Date(createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 3, maxWidth: '80%' },
  wrapperOwn: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  wrapperOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  username: { color: '#0A84FF', fontSize: 11, fontWeight: '700', marginBottom: 3, marginLeft: 4 },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleOwn: { backgroundColor: '#0A84FF', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#F2F2F7', borderBottomLeftRadius: 4 },
  text: { color: '#000', fontSize: 15, lineHeight: 20 },
  textOwn: { color: '#FFFFFF' },
  time: { color: 'rgba(0,0,0,0.45)', fontSize: 10, marginTop: 4, textAlign: 'right' },
  timeOwn: { color: 'rgba(255,255,255,0.7)' },
});