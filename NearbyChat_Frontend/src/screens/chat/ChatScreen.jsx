import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// Importation des composants UI personnalisés
import MessageBubble from '../../components/chat/MessageBubble';
import MessageInput from '../../components/chat/MessageInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import UserCount from '../../components/common/UserCount';
// Accès aux différents stores globaux
import useChatStore from '../../store/chatStore';
import useZoneStore from '../../store/zoneStore';
import useAuthStore from '../../store/authStore';
// Services de communication
import socketService from '../../services/socket.service';
import { getMessages } from '../../services/api.service';

/**
 * ChatScreen : Écran de messagerie en temps réel.
 * Permet d'envoyer et recevoir des messages au sein de la zone actuelle.
 */
export default function ChatScreen() {
  const [input, setInput] = useState(''); // Contenu du champ de saisie
  const flatListRef = useRef(null);      // Référence pour scroller automatiquement vers le bas
  
  // Données du chat (Zustand)
  const { messages, setMessages, addMessage, typingUser, setTypingUser } = useChatStore();
  // Données de la zone et de l'utilisateur
  const { currentZone, userCount, setUserCount } = useZoneStore();
  const { user } = useAuthStore();
  const typingTimeoutRef = useRef(null); // Timer pour effacer "en train d'écrire..."

  /**
   * Effet : Charge l'historique et configure les écouteurs de socket
   */
  useEffect(() => {
    const initChat = async () => {
      if (currentZone) {
        try {
          // 1. Charger les anciens messages depuis la DB (GET /messages/:zoneId)
          const res = await getMessages(currentZone.id);
          setMessages(res.data);
          // Scroll vers le dernier message
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (e) {
          console.error('Failed to load messages', e);
        }
      }
    };
    initChat();

    // 2. Écouter les nouveaux messages (Temps réel)
    socketService.on('newMessage', (msg) => {
      // On ajoute le message à la liste et on vérifie s'il vient de nous
      addMessage({ ...msg, id: Date.now().toString(), isOwn: msg.username === user?.username });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    // 3. Écouter quand quelqu'un écrit
    socketService.on('userTyping', ({ username }) => {
      setTypingUser(username);
      // Supprime l'indicateur après 3 secondes d'inactivité
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
    });

    // 4. Écouter les entrées/sorties pour mettre à jour le compteur
    socketService.on('userJoined', ({ userCount, username }) => {
      setUserCount(userCount);
    });

    socketService.on('userLeft', ({ userCount, username }) => {
      setUserCount(userCount);
    });

    // Nettoyage des écouteurs lors de la fermeture de la page
    return () => {
      socketService.off('newMessage');
      socketService.off('userTyping');
      socketService.off('userJoined');
      socketService.off('userLeft');
    };
  }, [currentZone, user?.username]);

  /**
   * Gère l'envoi d'un message
   */
  const handleSend = () => {
    if (!input.trim() || !currentZone) return;
    
    // Ajout local immédiat pour une sensation de rapidité (Optimistic UI)
    const tempMsg = {
      id: Date.now().toString() + '_temp',
      username: user?.username || 'Moi',
      text: input.trim(),
      createdAt: new Date().toISOString(),
      isOwn: true,
    };
    addMessage(tempMsg);
    
    // Envoi effectif au serveur via WebSocket
    socketService.emit('sendMessage', { text: input.trim() });
    
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };
  
  /**
   * Informe les autres que je suis en train d'écrire
   */
  const handleTyping = (text) => {
    setInput(text);
    if (text.length > 0) {
      socketService.emit('typing', {});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88} // Ajustement pour iOS
    >
      {/* En-tête du Chat */}
      <View style={styles.header}>
        {currentZone && <View style={[styles.headerDot, { backgroundColor: currentZone.color }]} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{currentZone?.name || 'Zone de Chat'}</Text>
        </View>
        <UserCount count={userCount || currentZone?.userCount || 0} color={currentZone?.color} />
      </View>

      {/* Liste des messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.list}
        // Scroll automatique quand le contenu change
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Indicateur de saisie (ex: "Youssef est en train d'écrire...") */}
      {typingUser && <TypingIndicator username={typingUser} />}

      {/* Barre de saisie en bas */}
      <MessageInput value={input} onChange={handleTyping} onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', padding: 16, paddingTop: 52, // Padding top pour éviter l'encoche
    borderBottomWidth: 1, borderBottomColor: '#EEEEEE',
  },
  headerDot: { width: 12, height: 12, borderRadius: 6 },
  headerTitle: { color: '#000', fontWeight: '700', fontSize: 16 },
  list: { padding: 16, gap: 8 },
});