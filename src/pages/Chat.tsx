
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 'other',
      content: 'Hello! How are you doing?',
      timestamp: '10:30 AM',
      sent: true
    },
    {
      id: 2,
      senderId: 'me',
      content: 'Hi! I\'m doing great, thanks for asking. How about you?',
      timestamp: '10:32 AM',
      sent: true
    },
    {
      id: 3,
      senderId: 'other',
      content: 'I\'m doing well too! I wanted to discuss the research project we talked about.',
      timestamp: '10:35 AM',
      sent: true
    }
  ]);

  // Mock conversation data - in real app this would come from API
  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ',
      specialization: 'Cardiology',
      online: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      avatar: 'MC',
      specialization: 'Neurology',
      online: false
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      avatar: 'ER',
      specialization: 'Emergency Medicine',
      online: true
    }
  ];

  const currentConversation = conversations.find(conv => conv.id === parseInt(id || '1'));

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        senderId: 'me',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentConversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Conversation not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/messages')}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={currentConversation.name} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  {currentConversation.avatar}
                </AvatarFallback>
              </Avatar>
              {currentConversation.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {currentConversation.name}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {currentConversation.specialization}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.senderId === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!message.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
