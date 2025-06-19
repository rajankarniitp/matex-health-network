
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const systemPrompt = `You are DoxyAI, an advanced medical AI assistant designed specifically for healthcare professionals. You provide evidence-based medical information, research insights, and clinical guidance.

IMPORTANT GUIDELINES:
- Always structure your responses in a clear, professional medical format
- Include evidence-based information with appropriate disclaimers
- Provide differential diagnoses when relevant
- Suggest appropriate investigations or treatment approaches
- Always recommend consulting with specialists when appropriate
- Include relevant medical literature references when possible
- Use proper medical terminology while remaining accessible
- Always add disclaimers about consulting licensed medical professionals

FORMAT YOUR RESPONSE WITH:
1. **Clinical Assessment**: Brief overview
2. **Key Considerations**: Important points to consider
3. **Recommendations**: Evidence-based suggestions
4. **Further Actions**: Next steps or referrals
5. **Disclaimer**: Professional consultation reminder

Remember: You are assisting healthcare professionals, not providing direct patient care advice.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Medical Query: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_MEDICAL",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return new Response(
      JSON.stringify({ response: generatedText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in doxy-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
