import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, Stethoscope, AlertCircle, BookOpen, Calculator, Zap, Database } from 'lucide-react';
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
    content: `# Welcome to DoxyAI — Your Research-Driven Medical Assistant! 🩺

I'm **DoxyAI**, created by **Rajan Kumar Karn**, founder of **DocMateX** — India's first verified medical networking and research platform. Rajan is a student at **IIT Patna**.

## 🎯 **My Purpose**
My goal is to support the healthcare community — not replace doctors, but to assist them with knowledge, research, and tools — 24x7, in a verified and respectful space.

## 🔬 **Advanced Capabilities**
I'm powered by:
- **Live PubMed RAG Pipeline** with real-time literature retrieval
- **Enhanced Statistical Engine** for medical calculations  
- **Evidence-Based Responses** with direct PubMed citations

## 📚 **DocMateX Platform Features**
- Role-specific profiles for verified healthcare professionals
- AI assistance (that's me, DoxyAI!)
- Verified jobs and internships
- In-app messaging and mentorship discovery
- Case study and research uploads
- Personalized content feed

## 🚀 **Try These Enhanced Queries:**
- *"Compare HbA1c reduction of Metformin vs Semaglutide based on recent RCTs"*
- *"What's the 5-year survival rate for triple-negative breast cancer with immunotherapy?"*
- *"Pembrolizumab vs Nivolumab efficacy in stage IV NSCLC with PD-L1 ≥50%"*
- *"Who made you?"* or *"What is DocMateX?"*

**Ready to provide evidence-based medical insights with live literature retrieval!**

**Powered by DocMateX — for those who care, heal, and lead.**`,
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
      <div className="max-w-5xl mx-auto h-full flex flex-col px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with DocMateX branding */}
        <Card className="mb-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-blue-900 dark:text-blue-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    DoxyAI — Medical Research Assistant
                    <Database className="h-5 w-5 text-green-500" />
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 font-normal">
                    Created by Rajan Kumar Karn • DocMateX Platform • Live PubMed RAG • Statistical Engine • Evidence-Based Medicine
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearConversation}
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
                        <AvatarFallback className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-600 dark:text-green-300">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg text-sm leading-relaxed ${
                        message.isUser
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700'
                      }`}>
                      <div 
                        className="whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content)
                        }}
                      />
                      
                      {/* Enhanced message badges for RAG features */}
                      {!message.isUser && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {message.ragEnabled && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                              <Database className="h-3 w-3 mr-1" />
                              RAG Enhanced
                            </Badge>
                          )}
                          {message.pubmedIntegrated && message.articleCount && message.articleCount > 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {message.articleCount} PubMed Articles
                            </Badge>
                          )}
                          {message.hasCalculation && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                              <Calculator className="h-3 w-3 mr-1" />
                              {message.calculationType?.toUpperCase()}
                            </Badge>
                          )}
                          {message.citations && message.citations.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {message.citations.length} Citations
                            </Badge>
                          )}
                          {message.searchStrategy && (
                            <Badge variant="outline" className="text-xs">
                              {message.searchStrategy}
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
                    <AvatarFallback className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-600 dark:text-green-300">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg rounded-bl-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        DoxyAI processing your query • Searching PubMed • Analyzing literature...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Input Area with DocMateX branding */}
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask your query..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 min-h-[60px] max-h-32 resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 h-[60px] flex-shrink-0 shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                <strong>DoxyAI by Rajan Kumar Karn</strong> • DocMateX Platform • Live PubMed RAG • Statistical Analysis • Evidence-Based Medical Guidance
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoxyAI;
