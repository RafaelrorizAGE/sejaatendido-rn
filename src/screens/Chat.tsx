import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../theme/colors';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  time: string;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'Dr. Carlos Silva', lastMessage: 'Até a próxima consulta!', time: '10:30', unread: 2 },
  { id: '2', name: 'Dra. Ana Souza', lastMessage: 'Os exames ficaram ótimos', time: 'Ontem', unread: 0 },
  { id: '3', name: 'Dr. Paulo Mendes', lastMessage: 'Enviei a receita', time: 'Seg', unread: 1 },
];

const DEMO_MESSAGES: Message[] = [
  { id: '1', text: 'Olá doutor, tudo bem?', sender: 'user', time: '10:00' },
  { id: '2', text: 'Olá! Tudo sim, como posso ajudar?', sender: 'other', time: '10:05' },
  { id: '3', text: 'Gostaria de tirar uma dúvida sobre o tratamento', sender: 'user', time: '10:10' },
  { id: '4', text: 'Claro, pode perguntar!', sender: 'other', time: '10:12' },
  { id: '5', text: 'Posso tomar o medicamento com alimento?', sender: 'user', time: '10:15' },
  { id: '6', text: 'Sim, é recomendável tomar após as refeições para evitar desconforto gástrico.', sender: 'other', time: '10:20' },
];

export default function Chat({ navigation }: any) {
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  function handleSend() {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  }

  if (!activeChat) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mensagens</Text>
          <View style={{ width: 60 }} />
        </View>

        <FlatList
          data={DEMO_CONTACTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contactList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => setActiveChat(item)}
            >
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitial}>
                  {item.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <View style={styles.contactTop}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactTime}>{item.time}</Text>
                </View>
                <View style={styles.contactBottom}>
                  <Text style={styles.contactLast} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveChat(null)}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeChat.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'user' ? styles.userBubble : styles.otherBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === 'user' ? styles.userMessageText : styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                item.sender === 'user' ? styles.userTimeText : styles.otherTimeText,
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.chatInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={Colors.textMuted}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>›</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 16,
    paddingTop: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  /* Contact list */
  contactList: {
    padding: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactInitial: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  contactInfo: {
    flex: 1,
  },
  contactTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contactTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  contactBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactLast: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  /* Messages */
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.card,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: Colors.textPrimary,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTimeText: {
    color: Colors.textMuted,
  },
  /* Input Bar */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 28,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    marginRight: 10,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
