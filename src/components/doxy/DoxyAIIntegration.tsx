
import { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DoxyAIIntegrationProps {
  context?: string;
  placeholder?: string;
  title?: string;
}

const DoxyAIIntegration = ({ 
  context = '', 
  placeholder = 'Ask DoxyAI for medical insights...',
  title = 'Ask DoxyAI'
}: DoxyAIIntegrationProps) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskDoxyAI = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const contextualQuery = context 
        ? `Context: ${context}\n\nQuestion: ${query}`
        : query;

      const { data, error } = await supabase.functions.invoke('doxy-ai', {
        body: { message: contextualQuery }
      });

      if (error) {
        throw error;
      }

      if (!data?.response) {
        throw new Error('No response received');
      }

      setResponse(data.response);
    } catch (error) {
      console.error('DoxyAI error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from DoxyAI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <Button 
          onClick={handleAskDoxyAI}
          disabled={!query.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Thinking...' : 'Ask DoxyAI'}
        </Button>
        
        {response && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">DoxyAI Response:</span>
            </div>
            <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoxyAIIntegration;
