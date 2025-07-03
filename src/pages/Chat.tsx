
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Image, FileText } from 'lucide-react';

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

  const handleFileAttachment = () => {
    console.log('File attachment clicked');
  };

  const handleImageAttachment = () => {
    console.log('Image attachment clicked');
  };

  const handleDocumentAttachment = () => {
    console.log('Document attachment clicked');
  };

  if (!currentConversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">Conversation not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 min-h-[64px] sm:min-h-[72px] bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/messages')}
              className="lg:hidden p-1 sm:p-2 flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="relative flex-shrink-0">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="" alt={currentConversation.name} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs sm:text-sm">
                  {currentConversation.avatar}
                </AvatarFallback>
              </Avatar>
              {currentConversation.online && (
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                {currentConversation.name}
              </h3>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 truncate">
                {currentConversation.specialization}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Video className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                  msg.senderId === 'me'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed break-words">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input with Attachment Options */}
        <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end space-x-2">
            {/* Attachment Options - Hidden on very small screens */}
            <div className="hidden xs:flex items-center space-x-1 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleFileAttachment}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleImageAttachment}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <Image className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDocumentAttachment}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            
            {/* Message Input */}
            <div className="flex-1 flex items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[40px] sm:min-h-[44px] text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              
              {/* Send Button */}
              <Button 
                onClick={sendMessage}
                disabled={!message.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 p-2 sm:p-2.5 flex-shrink-0 min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Attachment Options for very small screens - show as menu */}
            <div className="xs:hidden flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleFileAttachment}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
