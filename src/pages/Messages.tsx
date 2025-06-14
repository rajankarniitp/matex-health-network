
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Image as ImageIcon, File } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Johnson',
      content: 'Hi! How are you doing with your research on cardiac surgery?',
      timestamp: '10:30 AM',
      isMe: false,
      read: true
    },
    {
      id: 2,
      sender: 'Me',
      content: 'Hello! I am doing well, thank you. The minimally invasive techniques are showing great promise.',
      timestamp: '10:32 AM',
      isMe: true,
      read: true
    },
    {
      id: 3,
      sender: 'Dr. Sarah Johnson',
      content: 'That sounds fascinating! I would love to collaborate on this research. Can you share your latest findings?',
      timestamp: '10:35 AM',
      isMe: false,
      read: true
    },
    {
      id: 4,
      sender: 'Me',
      content: 'Absolutely! I will send you the research paper draft later today. Your expertise would be invaluable.',
      timestamp: '10:36 AM',
      isMe: true,
      read: true
    },
    {
      id: 5,
      sender: 'Dr. Sarah Johnson',
      content: 'Perfect! Looking forward to reviewing it. Also, are you attending the Medical Innovation Summit next week?',
      timestamp: '10:40 AM',
      isMe: false,
      read: false
    }
  ]);

  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      lastMessage: 'Perfect! Looking forward to reviewing it...',
      timestamp: '2 min ago',
      unread: 1,
      online: true,
      avatar: 'SJ',
      specialization: 'Cardiology'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      lastMessage: 'The conference presentation was amazing!',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      avatar: 'MC',
      specialization: 'Neurology'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      lastMessage: 'Can we schedule a mentorship call?',
      timestamp: '3 hours ago',
      unread: 2,
      online: true,
      avatar: 'ER',
      specialization: 'Emergency Medicine'
    },
    {
      id: 4,
      name: 'Dr. Priya Patel',
      lastMessage: 'Thank you for the case study review!',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      avatar: 'PP',
      specialization: 'Pediatrics'
    },
    {
      id: 5,
      name: 'Dr. James Wilson',
      lastMessage: 'The research collaboration proposal looks great',
      timestamp: '2 days ago',
      unread: 0,
      online: true,
      avatar: 'JW',
      specialization: 'Orthopedics'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'Me',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        read: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered successfully.",
      });

      // Simulate response after 2 seconds
      setTimeout(() => {
        const responseMsg = {
          id: messages.length + 2,
          sender: conversations.find(c => c.id === selectedChat)?.name || 'Dr. Sarah Johnson',
          content: 'Thanks for your message! I will get back to you soon.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          read: false
        };
        setMessages(prev => [...prev, responseMsg]);
      }, 2000);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex bg-white rounded-lg shadow">
        {/* Conversations List */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-20rem)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedChat === conversation.id ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''
                }`}
                onClick={() => setSelectedChat(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={conversation.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate text-gray-900">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{conversation.specialization}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="ml-2 h-5 w-5 text-xs flex items-center justify-center bg-blue-600">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={selectedConversation?.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {selectedConversation?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation?.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">{selectedConversation?.specialization}</p>
                  <span className="text-xs">•</span>
                  <p className={`text-sm ${selectedConversation?.online ? 'text-green-600' : 'text-gray-400'}`}>
                    {selectedConversation?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.isMe
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 border rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${message.isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                    {message.isMe && (
                      <div className="flex space-x-1">
                        <div className={`w-1 h-1 rounded-full ${message.read ? 'bg-blue-200' : 'bg-blue-300'}`}></div>
                        <div className={`w-1 h-1 rounded-full ${message.read ? 'bg-blue-200' : 'bg-blue-300'}`}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2 items-end">
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  <File className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
