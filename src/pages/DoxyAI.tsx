import { useState, useEffect } from 'react';
import { Send, Brain, User, Loader2, Stethoscope, AlertCircle, BookOpen, Calculator, Zap, Database } from 'lucide-react';
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
  ragEnabled?: boolean;
  searchStrategy?: string;
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
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('doxyai_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const getWelcomeMessage = () => ({
    id: '1',
    content: `Welcome to DoxyAI — Your Research-Driven Medical Assistant! 🩺`,
    isUser: false,
    timestamp: new Date(),
    ragEnabled: true,
    searchStrategy: 'Enhanced RAG Pipeline'
  });

  const clearConversation = () => {
    const welcomeMessage = getWelcomeMessage();
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
      console.log('Sending enhanced RAG message to DoxyAI:', currentInput);
      
      // Include conversation context for better responses
      const conversationContext = messages.slice(-4).map(msg => 
        `${msg.isUser ? 'User' : 'DoxyAI'}: ${msg.content}`
      ).join('\n');
      
      const contextualMessage = conversationContext 
        ? `Previous context:\n${conversationContext}\n\nCurrent query: ${currentInput}`
        : currentInput;

      const { data, error } = await supabase.functions.invoke('doxy-ai', {
        body: { message: contextualMessage }
      });

      console.log('Enhanced RAG Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        const errorMessage = "Failed to get response from DoxyAI RAG pipeline. Please check your connection and try again.";
        setError(errorMessage);
        toast({
          title: "RAG Pipeline Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.response) {
        const errorMessage = "No response received from DoxyAI RAG. Please try again.";
        setError(errorMessage);
        toast({
          title: "RAG Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Enhanced toast notifications for RAG features
      if (data.pubmedIntegrated && data.articleCount > 0) {
        toast({
          title: "🔬 RAG Enhanced Response",
          description: `Analysis includes evidence from ${data.articleCount} recent PubMed articles with full citations.`,
        });
      } else if (data.ragEnabled && !data.pubmedIntegrated) {
        toast({
          title: "📚 General Medical Knowledge",
          description: "Response based on established medical guidelines (no recent articles found).",
        });
      }

      if (data.hasCalculation) {
        toast({
          title: "📊 Statistical Analysis",
          description: `${data.calculationType?.toUpperCase()} calculation performed and integrated into clinical assessment.`,
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
        articleCount: data.articleCount || 0,
        ragEnabled: data.ragEnabled,
        searchStrategy: data.searchStrategy
      };

      setMessages(prev => [...prev, aiMessage]);

      // Enhanced interaction logging
      await logInteraction({
        query: currentInput,
        response: data.response,
        tags: [
          data.pubmedIntegrated ? 'pubmed-rag' : 'general-medical',
          data.hasCalculation ? 'statistical-analysis' : 'clinical-consultation',
          data.ragEnabled ? 'rag-enhanced' : 'standard',
          ...(data.citations?.length > 0 ? ['evidence-based'] : [])
        ],
        citations: data.citations,
        calculation_type: data.calculationType,
        pubmed_integrated: data.pubmedIntegrated || false,
        article_count: data.articleCount || 0
      });

    } catch (error) {
      console.error('Error calling enhanced DoxyAI RAG:', error);
      const errorMessage = "Something went wrong with the RAG pipeline. Please try again.";
      setError(errorMessage);
      toast({
        title: "RAG Pipeline Error",
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
    return content
      .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-4 mb-2">$1</h3>')
      .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold text-blue-700 dark:text-blue-300 mt-4 mb-3">$1</h2>')
      .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-4 mb-3">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Clean DoxyAI Header */}
        <Card className="mb-4 card-clean">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-medical-purple rounded-xl">
                  <Brain className="h-6 w-6 text-white brain-icon" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">DoxyAI</h1>
                  <p className="text-sm text-muted-foreground font-normal">
                    Research-Driven Medical Assistant
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearConversation}
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

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col min-h-0 card-clean">
          <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {message.isUser ? (
                      <>
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="" alt="DoxyAI" />
                        <AvatarFallback className="bg-medical-purple text-white">
                          <Brain className="h-4 w-4 brain-icon" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg text-sm leading-relaxed ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}>
                      <div 
                        className="whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content)
                        }}
                      />
                      
                      {/* Message badges for features */}
                      {!message.isUser && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {message.ragEnabled && (
                            <Badge variant="secondary" className="text-xs">
                              <Database className="h-3 w-3 mr-1" />
                              RAG Enhanced
                            </Badge>
                          )}
                          {message.pubmedIntegrated && message.articleCount && message.articleCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {message.articleCount} Articles
                            </Badge>
                          )}
                          {message.hasCalculation && (
                            <Badge variant="secondary" className="text-xs">
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
                      className={`text-xs text-muted-foreground mt-1 ${
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
                    <AvatarFallback className="bg-medical-purple text-white">
                      <Brain className="h-4 w-4 brain-icon" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg rounded-bl-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        DoxyAI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="border-t pt-4">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask DoxyAI about medical research, treatments, or get clinical insights..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 min-h-[60px] max-h-32 resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-[60px] px-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground text-center">
                <strong>DoxyAI</strong> • PubMed Enhanced • Evidence-Based Medical Research Assistant
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoxyAI;
