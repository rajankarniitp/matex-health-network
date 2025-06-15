
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Image, FileText, Loader2 } from 'lucide-react';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 'other',
      content: 'Hello! How are you doing today?',
      timestamp: '10:30 AM',
      sent: true,
      read: true
    },
    {
      id: 2,
      senderId: 'me',
      content: 'Hi! I\'m doing great, thanks for asking. How about you?',
      timestamp: '10:32 AM',
      sent: true,
      read: true
    },
    {
      id: 3,
      senderId: 'other',
      content: 'I\'m doing well too! I wanted to discuss the research project we talked about yesterday.',
      timestamp: '10:35 AM',
      sent: true,
      read: true
    }
  ]);

  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ',
      specialization: 'Cardiology',
      online: true,
      lastSeen: 'Active now'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      avatar: 'MC',
      specialization: 'Neurology',
      online: false,
      lastSeen: '2 hours ago'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      avatar: 'ER',
      specialization: 'Emergency Medicine',
      online: true,
      lastSeen: 'Active now'
    }
  ];

  const currentConversation = conversations.find(conv => conv.id === parseInt(id || '1'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() && !isSending) {
      setIsSending(true);
      const newMessage = {
        id: messages.length + 1,
        senderId: 'me',
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: false,
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate sending delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, sent: true }
              : msg
          )
        );
        setIsSending(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileAttachment = (type: string) => {
    console.log(`${type} attachment clicked`);
    // TODO: Implement file attachment logic
  };

  if (!currentConversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Conversation not found</p>
            <Button onClick={() => navigate('/messages')} variant="outline">
              Back to Messages
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] max-h-[800px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/messages')}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-white dark:ring-gray-700 shadow-sm">
                <AvatarImage src="" alt={currentConversation.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm lg:text-base font-semibold">
                  {currentConversation.avatar}
                </AvatarFallback>
              </Avatar>
              {currentConversation.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base lg:text-lg truncate">
                {currentConversation.name}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                  {currentConversation.specialization}
                </p>
                <span className="text-gray-400">•</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentConversation.lastSeen}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 lg:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Phone className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 lg:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Video className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 lg:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                  msg.senderId === 'me'
                    ? 'bg-blue-600 text-white border-blue-600 rounded-br-md'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-bl-md'
                }`}
              >
                <p className="text-sm lg:text-base leading-relaxed break-words">
                  {msg.content}
                </p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {msg.senderId === 'me' && (
                    <div className="flex items-center space-x-1">
                      {!msg.sent ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <div className="flex">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <div className={`w-1 h-1 rounded-full ml-1 ${msg.read ? 'bg-current' : 'bg-current opacity-50'}`}></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end space-x-3">
            {/* Attachment Options */}
            <div className="hidden sm:flex items-center space-x-1 flex-shrink-0">
              {[
                { icon: Paperclip, type: 'file', label: 'Attach file' },
                { icon: Image, type: 'image', label: 'Attach image' },
                { icon: FileText, type: 'document', label: 'Attach document' }
              ].map(({ icon: Icon, type, label }) => (
                <Button 
                  key={type}
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFileAttachment(type)}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={label}
                >
                  <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
              ))}
            </div>
            
            {/* Message Input Field */}
            <div className="flex-1 flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full min-h-[48px] px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isSending}
                />
              </div>
              
              {/* Send Button */}
              <Button 
                onClick={sendMessage}
                disabled={!message.trim() || isSending}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white p-3 flex-shrink-0 min-w-[48px] h-12 rounded-xl transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Mobile Attachment Button */}
            <div className="sm:hidden flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleFileAttachment('file')}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
