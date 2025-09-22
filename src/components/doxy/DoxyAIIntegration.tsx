import { useState } from 'react';
import { Bot, Send, Loader2, BookOpen, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DoxyAIIntegrationProps {
  context?: string;
  placeholder?: string;
  title?: string;
}

interface DoxyResponse {
  response: string;
  pubmedIntegrated?: boolean;
  articleCount?: number;
}

const DoxyAIIntegration = ({ 
  context = '', 
  placeholder = 'Ask DoxyAI for medical insights...',
  title = 'DoxyAI Assistant'
}: DoxyAIIntegrationProps) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pubmedUsed, setPubmedUsed] = useState(false);
  const [articleCount, setArticleCount] = useState(0);

  const handleAskDoxyAI = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');
    setPubmedUsed(false);
    setArticleCount(0);
    
    try {
      const contextualQuery = context 
        ? `Context: ${context}\n\nQuestion: ${query}`
        : query;

      const { data, error } = await supabase.functions.invoke('doxy-ai', {
        body: { message: contextualQuery }
      });

      if (error) throw error;
      if (!data?.response) throw new Error('No response received');

      const doxyData = data as DoxyResponse;
      setResponse(doxyData.response);
      setPubmedUsed(doxyData.pubmedIntegrated || false);
      setArticleCount(doxyData.articleCount || 0);

      if (doxyData.pubmedIntegrated) {
        toast({
          title: "🔬 Enhanced with PubMed",
          description: `Response includes insights from ${doxyData.articleCount} research articles.`,
        });
      }
    } catch (error) {
      console.error('DoxyAI error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response from DoxyAI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="pb-4 bg-primary/5 dark:bg-primary/10">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-primary">
          <Brain className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Textarea
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[100px] resize-vertical bg-background rounded-lg shadow-inner"
          disabled={isLoading}
        />
        <Button 
          onClick={handleAskDoxyAI}
          disabled={!query.trim() || isLoading}
          className="w-full font-semibold shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Analyzing...' : 'Ask DoxyAI'}
        </Button>
        
        {isLoading && !response && (
            <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                <p className='ml-2 text-muted-foreground'>DoxyAI is thinking...</p>
            </div>
        )}

        {response && (
          <div className="mt-4 p-4 bg-card border rounded-lg shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm text-primary">DoxyAI Response</span>
                </div>
              {pubmedUsed && (
                <Badge variant="outline" className="text-xs border-doctor-success/50 bg-doctor-success/10 text-doctor-success-foreground">
                  <BookOpen className="h-3 w-3 mr-1.5" />
                  {articleCount} PubMed articles
                </Badge>
              )}
            </div>
            <div className="text-sm whitespace-pre-wrap text-foreground/90 prose prose-sm dark:prose-invert max-w-full">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoxyAIIntegration;