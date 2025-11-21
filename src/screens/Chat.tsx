
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Send, Phone, Video, MoreVertical, ArrowLeft, Search, Paperclip } from "lucide-react";
const logo = "/placeholder.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const chats = [
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologia",
      lastMessage: "Seus exames estão prontos. Podemos conversar hoje às 15h?",
      time: "14:30",
      unread: 2,
      online: true,
      avatar: "/placeholder-doctor1.jpg"
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatologia",
      lastMessage: "Obrigado por compartilhar as fotos. Vou analisar e retorno em breve.",
      time: "12:45",
      unread: 0,
      online: false,
      avatar: "/placeholder-doctor2.jpg"
    },
    {
      id: 3,
      doctorName: "Dr. Ana Santos",
      specialty: "Clínica Geral",
      lastMessage: "Lembre-se de tomar o medicamento após as refeições.",
      time: "10:20",
      unread: 0,
      online: true,
      avatar: "/placeholder-doctor3.jpg"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "doctor",
      content: "Olá! Como você está se sentindo hoje?",
      time: "14:00",
      senderName: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      sender: "patient",
      content: "Olá, doutor! Estou me sentindo melhor, obrigado. A medicação está funcionando bem.",
      time: "14:05",
      senderName: "Você"
    },
    {
      id: 3,
      sender: "doctor",
      content: "Que bom! Seus exames de sangue chegaram. Os resultados estão dentro do esperado.",
      time: "14:10",
      senderName: "Dr. Sarah Johnson"
    },
    {
      id: 4,
      sender: "patient",
      content: "Excelente! Preciso continuar com a mesma dosagem?",
      time: "14:15",
      senderName: "Você"
    },
    {
      id: 5,
      sender: "doctor",
      content: "Sim, continue com a mesma dosagem por mais 2 semanas. Seus exames estão prontos. Podemos conversar hoje às 15h?",
      time: "14:30",
      senderName: "Dr. Sarah Johnson"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      // Here you would connect to your backend/database
      setNewMessage("");
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
              <span className="text-2xl font-bold text-gray-900">Seja Atendido</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversas</span>
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      selectedChat === chat.id ? 'border-l-primary bg-primary/5' : 'border-l-transparent'
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.avatar} alt={chat.doctorName} />
                          <AvatarFallback>
                            {chat.doctorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{chat.doctorName}</h3>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{chat.specialty}</p>
                        <p className="text-sm text-gray-700 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedChatData ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedChatData.avatar} alt={selectedChatData.doctorName} />
                          <AvatarFallback>
                            {selectedChatData.doctorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedChatData.online && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedChatData.doctorName}</h3>
                        <p className="text-sm text-gray-600">{selectedChatData.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'patient'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'patient' ? 'text-primary-foreground/70' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
