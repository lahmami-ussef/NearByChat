import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MessageInput({ value, onChange, onSend }) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder="Message..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[styles.btn, !value.trim() && styles.btnDisabled]}
        onPress={onSend}
        disabled={!value.trim()}
      >
        <Text style={styles.icon}>send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  input: { flex: 1, backgroundColor: '#F2F2F7', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#000', fontSize: 15, maxHeight: 100 },
  btn: { backgroundColor: '#0A84FF', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E5EA' },
  icon: { color: '#fff', fontSize: 14, fontWeight: '700' },
});