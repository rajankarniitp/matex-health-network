
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DoxyInteraction {
  id?: string;
  user_id?: string;
  query: string;
  response: string;
  timestamp: Date;
  tags: string[];
  citations?: any[];
  calculation_type?: string;
  pubmed_integrated: boolean;
  article_count: number;
}

export const useDoxyInteractionLogger = () => {
  const [interactions, setInteractions] = useState<DoxyInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const logInteraction = async (interaction: Omit<DoxyInteraction, 'id' | 'user_id' | 'timestamp'>) => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const newInteraction: DoxyInteraction = {
        ...interaction,
        user_id: user?.id,
        timestamp: new Date()
      };

      // Store in localStorage for immediate access
      const savedInteractions = JSON.parse(localStorage.getItem('doxy_interactions') || '[]');
      const updatedInteractions = [newInteraction, ...savedInteractions.slice(0, 49)]; // Keep last 50
      localStorage.setItem('doxy_interactions', JSON.stringify(updatedInteractions));
      
      setInteractions(updatedInteractions);

      // Optionally store in database if user is authenticated
      if (user) {
        // Note: This would require a database table - for now we're using localStorage
        console.log('Interaction logged for user:', user.id);
      }
      
    } catch (error) {
      console.error('Error logging interaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInteractions = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('doxy_interactions') || '[]');
      setInteractions(saved);
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const clearInteractions = () => {
    localStorage.removeItem('doxy_interactions');
    setInteractions([]);
  };

  useEffect(() => {
    loadInteractions();
  }, []);

  return {
    interactions,
    logInteraction,
    clearInteractions,
    isLoading
  };
};
