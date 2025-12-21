import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  content: string;
  time: string;
}

interface ChatContact {
  id: string;
  name: string;
  specialty: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export default function Chat({ navigation }: any) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const contacts: ChatContact[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologia',
      lastMessage: 'Seus exames estão prontos.',
      time: '14:30',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologia',
      lastMessage: 'Obrigado por compartilhar.',
      time: '12:45',
      unread: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Dr. Ana Santos',
      specialty: 'Clínica Geral',
      lastMessage: 'Lembre-se de tomar o medicamento.',
      time: '10:20',
      unread: 0,
      online: true,
    },
  ];

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'doctor',
      content: 'Olá! Como você está se sentindo hoje?',
      time: '14:00',
    },
    {
      id: '2',
      sender: 'user',
      content: 'Olá, doutor! Estou me sentindo melhor, obrigado.',
      time: '14:05',
    },
    {
      id: '3',
      sender: 'doctor',
      content: 'Que bom! Seus exames de sangue chegaram. Os resultados estão dentro do esperado.',
      time: '14:10',
    },
    {
      id: '4',
      sender: 'user',
      content: 'Excelente! Preciso continuar com a mesma dosagem?',
      time: '14:15',
    },
    {
      id: '5',
      sender: 'doctor',
      content: 'Sim, continue com a mesma dosagem por mais 2 semanas.',
      time: '14:30',
    },
  ]);

  function handleSendMessage() {
    if (newMessage.trim()) {
      // Aqui você adicionaria a lógica para enviar mensagem
      setNewMessage('');
    }
  }

  if (selectedChat) {
    const contact = contacts.find((c) => c.id === selectedChat);

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{contact?.name}</Text>
            <Text style={styles.chatHeaderStatus}>
              {contact?.online ? '🟢 Online' : '⚫ Offline'}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.videoCall}>📹</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.doctorBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userMessageText : styles.doctorMessageText,
                ]}
              >
                {item.content}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === 'user' ? styles.userMessageTime : styles.doctorMessageTime,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Text>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.messageInput}
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversas</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Contact List */}
      <ScrollView style={styles.contactList}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => setSelectedChat(contact.id)}
          >
            <View style={styles.contactAvatar}>
              <Text style={styles.contactAvatarText}>
                {contact.name.charAt(0)}
              </Text>
              {contact.online && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.contactInfo}>
              <View style={styles.contactHeader}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactTime}>{contact.time}</Text>
              </View>
              <Text style={styles.contactSpecialty}>{contact.specialty}</Text>
              <Text style={styles.contactLastMessage} numberOfLines={1}>
                {contact.lastMessage}
              </Text>
            </View>
            {contact.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{contact.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactList: {
    flex: 1,
  },
  contactItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  contactAvatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactTime: {
    fontSize: 12,
    color: '#888',
  },
  contactSpecialty: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  contactLastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Chat View Styles
  chatHeader: {
    backgroundColor: '#007AFF',
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatHeaderStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  videoCall: {
    fontSize: 24,
  },
  messagesContainer: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  doctorBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  doctorMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  doctorMessageTime: {
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    padding: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
