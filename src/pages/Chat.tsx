
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical, Image as ImageIcon, File } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
    },
    {
      id: 4,
      name: 'Dr. Priya Patel',
      avatar: 'PP',
      specialization: 'Pediatrics',
      online: false
    },
    {
      id: 5,
      name: 'Dr. James Wilson',
      avatar: 'JW',
      specialization: 'Orthopedics',
      online: true
    }
  ];

  const currentUser = conversations.find(c => c.id === parseInt(userId || '1'));

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
          sender: currentUser?.name || 'Dr. Sarah Johnson',
          content: 'Thanks for your message! I will get back to you soon.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          read: false
        };
        setMessages(prev => [...prev, responseMsg]);
      }, 2000);
    }
  };

  const handleBackToMessages = () => {
    navigate('/messages');
  };

  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">User not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/25">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={handleBackToMessages}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={currentUser.name} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{currentUser.name}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.specialization}</p>
                <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                <p className={`text-sm ${currentUser.online ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {currentUser.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.isMe
                    ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm shadow-sm dark:shadow-gray-900/25'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${message.isMe ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {message.timestamp}
                  </p>
                  {message.isMe && (
                    <div className="flex space-x-1">
                      <div className={`w-1 h-1 rounded-full ${message.read ? 'bg-blue-200 dark:bg-blue-300' : 'bg-blue-300 dark:bg-blue-400'}`}></div>
                      <div className={`w-1 h-1 rounded-full ${message.read ? 'bg-blue-200 dark:bg-blue-300' : 'bg-blue-300 dark:bg-blue-400'}`}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
          <div className="flex space-x-2 items-end">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <File className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
