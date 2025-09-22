
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      lastMessage: 'Perfect! Looking forward to reviewing it. Also, are you attending the Medical Innovation Summit next week?',
      timestamp: '2 min ago',
      unread: 1,
      online: true,
      avatar: 'SJ',
      specialization: 'Cardiology'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      lastMessage: 'The conference presentation was amazing! I learned so much from your research methodology.',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      avatar: 'MC',
      specialization: 'Neurology'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      lastMessage: 'Can we schedule a mentorship call this week? I have some questions about my current research project.',
      timestamp: '3 hours ago',
      unread: 2,
      online: true,
      avatar: 'ER',
      specialization: 'Emergency Medicine'
    },
    {
      id: 4,
      name: 'Dr. Priya Patel',
      lastMessage: 'Thank you for reviewing my case study! Your feedback was incredibly valuable.',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      avatar: 'PP',
      specialization: 'Pediatrics'
    },
    {
      id: 5,
      name: 'Dr. James Wilson',
      lastMessage: 'The research collaboration proposal looks great. When can we start working together?',
      timestamp: '2 days ago',
      unread: 0,
      online: true,
      avatar: 'JW',
      specialization: 'Orthopedics'
    },
    {
      id: 6,
      name: 'Dr. Lisa Thompson',
      lastMessage: 'I have some interesting findings from my latest study that I think you would find fascinating.',
      timestamp: '3 days ago',
      unread: 0,
      online: false,
      avatar: 'LT',
      specialization: 'Dermatology'
    },
    {
      id: 7,
      name: 'Dr. David Kim',
      lastMessage: 'The medical journal article you shared was excellent. Would love to discuss it further.',
      timestamp: '5 days ago',
      unread: 0,
      online: true,
      avatar: 'DK',
      specialization: 'Psychiatry'
    },
    {
      id: 8,
      name: 'Dr. Maria Garcia',
      lastMessage: 'Your presentation at the hospital was inspiring. Can you share the slides with me?',
      timestamp: '1 week ago',
      unread: 0,
      online: false,
      avatar: 'MG',
      specialization: 'Oncology'
    }
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversationId: number) => {
    console.log('Opening chat for conversation:', conversationId);
    navigate(`/chat/${conversationId}`);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/25">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto max-h-[calc(100vh-18rem)]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:bg-gray-100 dark:active:bg-gray-600"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={conversation.name} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold">
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate pr-2">
                        {conversation.name}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.timestamp}
                        </span>
                        {conversation.unread > 0 && (
                          <Badge variant="default" className="h-5 w-5 text-xs flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
                      {conversation.specialization}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
