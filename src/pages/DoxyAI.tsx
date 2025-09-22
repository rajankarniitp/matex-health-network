import { useState, useEffect, useRef } from 'react';
import { Send, Brain, User, Loader2, AlertCircle, BookOpen, Calculator, Database, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { logInteraction } = useDoxyInteractionLogger();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    if (messages.length > 1) { // Only save if there's more than the welcome message
      localStorage.setItem('doxyai_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const getWelcomeMessage = (): Message => ({
    id: '1',
    content: `Welcome to DoxyAI — Your Research-Driven Medical Assistant! 🩺\n\nHow can I help you today? You can ask me about medical research, treatments, or get clinical insights.`,
    isUser: false,
    timestamp: new Date(),
    ragEnabled: true,
    searchStrategy: 'Enhanced RAG Pipeline'
  });

  const clearConversation = () => {
    setMessages([getWelcomeMessage()]);
    localStorage.removeItem('doxyai_conversation');
    toast({
      title: "Conversation Cleared",
      description: "Your chat history has been reset.",
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
      const conversationContext = messages.slice(-4).map(msg => 
        `${msg.isUser ? 'User' : 'DoxyAI'}: ${msg.content}`
      ).join('\n');
      
      const contextualMessage = `Previous context:\n${conversationContext}\n\nCurrent query: ${currentInput}`;

      const { data, error: functionError } = await supabase.functions.invoke('doxy-ai', {
        body: { message: contextualMessage }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.response) {
        throw new Error("No response received from DoxyAI. Please try again.");
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

    } catch (e: any) {
      console.error('Error calling DoxyAI:', e);
      const errorMessage = e.message || "An unexpected error occurred. Please try again.";
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
    // Improved markdown-to-HTML conversion with better styling
    return content
      .replace(/### (.*?)(?:\n|$)/g, '<h3 class="text-lg font-semibold text-primary mt-4 mb-2">$1</h3>')
      .replace(/## (.*?)(?:\n|$)/g, '<h2 class="text-xl font-bold text-primary mt-4 mb-3">$1</h2>')
      .replace(/# (.*?)(?:\n|$)/g, '<h1 class="text-2xl font-extrabold text-primary mt-4 mb-3">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^\s*[-*] (.*$)/gim, '<li class="list-disc list-inside ml-4">$1</li>')
      .replace(/\n/g, '<br />');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-full flex flex-col p-4 gap-4">
        {/* Header */}
        <Card className="shadow-md bg-gradient-to-br from-primary to-blue-600 dark:from-primary dark:to-blue-800 text-primary-foreground">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-foreground/20 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">DoxyAI</h1>
                  <p className="text-sm text-primary-foreground/90 font-normal">
                    Research-Driven Medical Assistant
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearConversation}
                className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 text-primary-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col min-h-0 shadow-lg">
          <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-6 p-2 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex items-end gap-3", {
                    "flex-row-reverse": message.isUser,
                  })}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0 shadow-sm">
                    <AvatarImage src="" alt={message.isUser ? "User" : "DoxyAI"} />
                    <AvatarFallback 
                      className={cn({
                        "bg-primary text-primary-foreground": message.isUser,
                        "bg-doctor-accent text-doctor-accent-foreground": !message.isUser,
                      })}
                    >
                      {message.isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={cn("flex-1 max-w-[85%]", {"text-right": message.isUser})}>
                     <div 
                      className={cn("inline-block p-4 rounded-lg text-sm leading-relaxed shadow-md", {
                        "bg-primary text-primary-foreground rounded-br-none": message.isUser,
                        "bg-card border rounded-bl-none": !message.isUser,
                       })}
                     >
                      <div 
                        className="whitespace-pre-wrap break-words prose prose-sm dark:prose-invert prose-p:m-0 prose-headings:m-0"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                      
                      {!message.isUser && (
                         <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                           {message.ragEnabled && (
                             <Badge variant="outline" className="text-xs bg-doctor-success/10 border-doctor-success/50 text-doctor-success-foreground">
                               <Database className="h-3 w-3 mr-1.5" />
                               RAG Enhanced
                             </Badge>
                           )}
                           {message.pubmedIntegrated && message.articleCount && message.articleCount > 0 && (
                             <Badge variant="outline" className="text-xs bg-doctor-success/10 border-doctor-success/50 text-doctor-success-foreground">
                               <BookOpen className="h-3 w-3 mr-1.5" />
                               {message.articleCount} PubMed Articles
                             </Badge>
                           )}
                           {message.hasCalculation && (
                             <Badge variant="outline" className="text-xs bg-doctor-warning/10 border-doctor-warning/50 text-doctor-warning-foreground">
                               <Calculator className="h-3 w-3 mr-1.5" />
                               {message.calculationType?.toUpperCase()}
                             </Badge>
                           )}
                           {message.citations && message.citations.length > 0 && (
                             <Badge variant="outline" className="text-xs border-doctor-accent/50 text-doctor-accent">
                               {message.citations.length} Citations
                             </Badge>
                           )}
                         </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
               {isLoading && (
                 <div className="flex items-end gap-3">
                   <Avatar className="h-8 w-8 flex-shrink-0 shadow-sm">
                     <AvatarFallback className="bg-doctor-accent text-doctor-accent-foreground">
                       <Brain className="h-4 w-4" />
                     </AvatarFallback>
                   </Avatar>
                   <div className="bg-card border p-3 rounded-lg rounded-bl-none shadow-md">
                     <div className="flex items-center space-x-2">
                       <Loader2 className="h-4 w-4 animate-spin text-primary" />
                       <span className="text-sm text-muted-foreground italic">
                         DoxyAI is analyzing...
                       </span>
                     </div>
                   </div>
                 </div>
               )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t pt-4 mt-auto">
              <div className="flex items-center space-x-3">
                <Textarea
                  placeholder="Ask about medical research, treatments, or clinical insights..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 min-h-[52px] max-h-40 resize-none rounded-full px-6 py-3 shadow-inner bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                />
                 <Button
                   size="icon"
                   onClick={handleSendMessage}
                   disabled={!inputMessage.trim() || isLoading}
                   className="rounded-full w-12 h-12 flex-shrink-0 shadow-lg bg-primary hover:bg-primary/90"
                 >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
               <div className="mt-3 text-xs text-muted-foreground text-center">
                 <strong className="font-semibold text-primary">DoxyAI</strong> • 🔬 PubMed Enhanced • 📊 Evidence-Based Medical Research Assistant
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoxyAI;