import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, Stethoscope, AlertCircle, BookOpen, Calculator } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useDoxyInteractionLogger } from '@/hooks/useDoxyInteractionLogger';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  citations?: any[];
  hasCalculation?: boolean;
  calculationType?: string;
  pubmedIntegrated?: boolean;
  articleCount?: number;
}

const DoxyAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { logInteraction } = useDoxyInteractionLogger();

  // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('doxyai_conversation');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load conversation:', error);
        // Set default welcome message if loading fails
        setMessages([{
          id: '1',
          content: 'Hello! I\'m DoxyAI, your medical AI assistant enhanced with real-time PubMed literature access. I can help healthcare professionals with evidence-based medical information, research insights, and clinical guidance. For research queries, I\'ll automatically search and analyze the latest biomedical literature from PubMed. How can I assist you today?',
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } else {
      // Set default welcome message
      setMessages([{
        id: '1',
        content: 'Hello! I\'m DoxyAI, your medical AI assistant enhanced with real-time PubMed literature access. I can help healthcare professionals with evidence-based medical information, research insights, and clinical guidance. For research queries, I\'ll automatically search and analyze the latest biomedical literature from PubMed. How can I assist you today?',
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('doxyai_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const clearConversation = () => {
    const welcomeMessage = {
      id: '1',
      content: 'Hello! I\'m DoxyAI, your medical AI assistant enhanced with real-time PubMed literature access. I can help healthcare professionals with evidence-based medical information, research insights, and clinical guidance. For research queries, I\'ll automatically search and analyze the latest biomedical literature from PubMed. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem('doxyai_conversation');
    toast({
      title: "Conversation cleared",
      description: "Your conversation history has been reset.",
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending enhanced message to DoxyAI:', currentInput);
      
      // Include conversation context for better responses
      const conversationContext = messages.slice(-6).map(msg => 
        `${msg.isUser ? 'User' : 'DoxyAI'}: ${msg.content}`
      ).join('\n');
      
      const contextualMessage = conversationContext 
        ? `Previous conversation:\n${conversationContext}\n\nCurrent question: ${currentInput}`
        : currentInput;

      const { data, error } = await supabase.functions.invoke('doxy-ai', {
        body: { message: contextualMessage }
      });

      console.log('Enhanced Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        const errorMessage = "Failed to get response from DoxyAI. Please check your connection and try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.response) {
        const errorMessage = "No response received from DoxyAI. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Enhanced toast notifications
      if (data.pubmedIntegrated) {
        toast({
          title: "Enhanced with PubMed Literature",
          description: `Response includes evidence from ${data.articleCount} recent research articles with citations.`,
        });
      }

      if (data.hasCalculation) {
        toast({
          title: "Medical Calculation Included",
          description: `${data.calculationType?.toUpperCase()} calculation performed and included in response.`,
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        citations: data.citations || [],
        hasCalculation: data.hasCalculation,
        calculationType: data.calculationType,
        pubmedIntegrated: data.pubmedIntegrated,
        articleCount: data.articleCount || 0
      };

      setMessages(prev => [...prev, aiMessage]);

      // Log interaction for history
      await logInteraction({
        query: currentInput,
        response: data.response,
        tags: [
          data.pubmedIntegrated ? 'research' : 'general',
          data.hasCalculation ? 'calculation' : 'consultation',
          ...(data.citations?.length > 0 ? ['evidence-based'] : [])
        ],
        citations: data.citations,
        calculation_type: data.calculationType,
        pubmed_integrated: data.pubmedIntegrated || false,
        article_count: data.articleCount || 0
      });

    } catch (error) {
      console.error('Error calling enhanced DoxyAI:', error);
      const errorMessage = "Something went wrong. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-full flex flex-col px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-blue-900 dark:text-blue-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">DoxyAI Enhanced</h1>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 font-normal">
                    RAG-Powered Medical AI • PubMed Literature • Statistical Engine
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {/* clearConversation */}}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                Clear Chat
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Chat Messages */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-3 sm:p-4 space-y-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 sm:space-x-3 ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {message.isUser ? (
                      <>
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="" alt="DoxyAI" />
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg text-sm leading-relaxed ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                      }`}>
                      <div 
                        className="whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content)
                        }}
                      />
                      
                      {/* Enhanced message badges */}
                      {!message.isUser && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.pubmedIntegrated && (
                            <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {message.articleCount} PubMed Articles
                            </Badge>
                          )}
                          {message.hasCalculation && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                              <Calculator className="h-3 w-3 mr-1" />
                              {message.calculationType?.toUpperCase()}
                            </Badge>
                          )}
                          {message.citations && message.citations.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {message.citations.length} Citations
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div
                      className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                        message.isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        DoxyAI is analyzing with RAG + PubMed integration...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Input Area */}
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask about clinical research, drug comparisons, survival rates, statistical calculations, or any medical topic. Enhanced with PubMed literature search and medical calculations..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 min-h-[60px] max-h-32 resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 h-[60px] flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                <strong>Enhanced DoxyAI</strong> with RAG pipeline, PubMed literature search, statistical calculations, and medical guidance for healthcare professionals.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoxyAI;
