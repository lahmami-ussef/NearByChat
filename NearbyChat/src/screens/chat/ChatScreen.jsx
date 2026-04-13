import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import MessageBubble from '../../components/chat/MessageBubble';
import MessageInput from '../../components/chat/MessageInput';
import TypingIndicator from '../../components/chat/TypingIndicator';
import UserCount from '../../components/common/UserCount';
import useChatStore from '../../store/chatStore';
import useZoneStore from '../../store/zoneStore';
import useAuthStore from '../../store/authStore';
import { MOCK_MESSAGES, MOCK_TYPING_USER } from '../../mock/mockData';

// MOCK MODE
// Quand backend pret, remplacer useEffect par :
//   setMessages((await getMessages(currentZone.id)).data)
//   socketService.on('newMessage', msg => addMessage(msg))
//   socketService.on('userTyping', ({username}) => setTypingUser(username))
//   socketService.on('userJoined', ({userCount}) => setUserCount(userCount))
import socketService from '../../services/socket.service';
import { getMessages } from '../../services/api.service';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const { messages, setMessages, addMessage, typingUser, setTypingUser } = useChatStore();
  const { currentZone, userCount, setUserCount } = useZoneStore();
  const { user } = useAuthStore();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      if (currentZone) {
        try {
          const res = await getMessages(currentZone.id);
          setMessages(res.data);
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (e) {
          console.error('Failed to load messages', e);
        }
      }
    };
    initChat();

    // Socket Events
    socketService.on('newMessage', (msg) => {
      addMessage({ ...msg, id: Date.now().toString(), isOwn: msg.username === user?.username });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    socketService.on('userTyping', ({ username }) => {
      setTypingUser(username);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
    });

    socketService.on('userJoined', ({ userCount, username }) => {
      setUserCount(userCount);
    });

    socketService.on('userLeft', ({ userCount, username }) => {
      setUserCount(userCount);
    });

    return () => {
      socketService.off('newMessage');
      socketService.off('userTyping');
      socketService.off('userJoined');
      socketService.off('userLeft');
    };
  }, [currentZone, user?.username]);

  const handleSend = () => {
    if (!input.trim() || !currentZone) return;
    
    // Add locally for instant UI
    const tempMsg = {
      id: Date.now().toString() + '_temp',
      username: user?.username || 'Moi',
      text: input.trim(),
      createdAt: new Date().toISOString(),
      isOwn: true,
    };
    addMessage(tempMsg);
    
    // Emit to backend
    socketService.emit('sendMessage', { text: input.trim() });
    
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };
  
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
      keyboardVerticalOffset={88}
    >
      {/* Header */}
      <View style={styles.header}>
        {currentZone && <View style={[styles.headerDot, { backgroundColor: currentZone.color }]} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{currentZone?.name || 'Zone'}</Text>
        </View>
        <UserCount count={userCount || currentZone?.userCount || 0} color={currentZone?.color} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {typingUser && <TypingIndicator username={typingUser} />}

      <MessageInput value={input} onChange={handleTyping} onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', padding: 16, paddingTop: 52,
    borderBottomWidth: 1, borderBottomColor: '#EEEEEE',
  },
  headerDot: { width: 12, height: 12, borderRadius: 6 },
  headerTitle: { color: '#000', fontWeight: '700', fontSize: 16 },
  list: { padding: 16, gap: 8 },
});