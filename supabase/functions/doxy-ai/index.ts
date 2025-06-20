
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// PubMed E-utilities base URLs
const PUBMED_ESEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_EFETCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

// Function to search PubMed articles
async function searchPubMed(query: string, maxResults: number = 5): Promise<string[]> {
  try {
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: query,
      retmode: 'json',
      retmax: maxResults.toString(),
      sort: 'relevance',
      reldate: '1825', // Last 5 years (365 * 5)
    });

    const searchResponse = await fetch(`${PUBMED_ESEARCH_URL}?${searchParams}`);
    const searchData = await searchResponse.json();
    
    const pmids = searchData.esearchresult?.idlist || [];
    console.log(`Found ${pmids.length} PMIDs for query: ${query}`);
    
    return pmids;
  } catch (error) {
    console.error('Error searching PubMed:', error);
    return [];
  }
}

// Function to fetch abstracts from PMIDs
async function fetchAbstracts(pmids: string[]): Promise<string> {
  if (pmids.length === 0) return '';
  
  try {
    const fetchParams = new URLSearchParams({
      db: 'pubmed',
      id: pmids.join(','),
      retmode: 'xml',
      rettype: 'abstract',
    });

    const fetchResponse = await fetch(`${PUBMED_EFETCH_URL}?${fetchParams}`);
    const xmlData = await fetchResponse.text();
    
    // Parse XML to extract abstracts, titles, and authors
    const abstracts = parseAbstractsFromXML(xmlData);
    console.log(`Fetched ${abstracts.length} abstracts`);
    
    return abstracts;
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return '';
  }
}

// Simple XML parser for PubMed abstracts
function parseAbstractsFromXML(xml: string): string {
  const articles: string[] = [];
  
  // Simple regex-based parsing (could be improved with a proper XML parser)
  const articleRegex = /<PubmedArticle>(.*?)<\/PubmedArticle>/gs;
  const titleRegex = /<ArticleTitle>(.*?)<\/ArticleTitle>/s;
  const abstractRegex = /<AbstractText[^>]*>(.*?)<\/AbstractText>/gs;
  const authorRegex = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs;
  const pmidRegex = /<PMID[^>]*>(.*?)<\/PMID>/s;
  const journalRegex = /<Title>(.*?)<\/Title>/s;
  const pubDateRegex = /<PubDate>.*?<Year>(.*?)<\/Year>/s;

  let match;
  while ((match = articleRegex.exec(xml)) !== null) {
    const articleXml = match[1];
    
    const titleMatch = titleRegex.exec(articleXml);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : '';
    
    const pmidMatch = pmidRegex.exec(articleXml);
    const pmid = pmidMatch ? pmidMatch[1] : '';
    
    const journalMatch = journalRegex.exec(articleXml);
    const journal = journalMatch ? journalMatch[1] : '';
    
    const pubDateMatch = pubDateRegex.exec(articleXml);
    const year = pubDateMatch ? pubDateMatch[1] : '';
    
    // Extract abstract text
    let abstractText = '';
    let abstractMatch;
    while ((abstractMatch = abstractRegex.exec(articleXml)) !== null) {
      abstractText += abstractMatch[1].replace(/<[^>]*>/g, '') + ' ';
    }
    
    // Extract authors
    const authors: string[] = [];
    let authorMatch;
    while ((authorMatch = authorRegex.exec(articleXml)) !== null) {
      authors.push(`${authorMatch[2]} ${authorMatch[1]}`);
    }
    
    if (title && abstractText.trim()) {
      articles.push(`
PMID: ${pmid}
Title: ${title}
Journal: ${journal} (${year})
Authors: ${authors.slice(0, 3).join(', ')}${authors.length > 3 ? ' et al.' : ''}
Abstract: ${abstractText.trim()}
---`);
    }
  }
  
  return articles.join('\n\n');
}

// Function to extract keywords from clinical query
function extractKeywords(query: string): string {
  // Common medical terms and their PubMed-friendly versions
  const medicalTerms = {
    'pembrolizumab': 'pembrolizumab',
    'nivolumab': 'nivolumab',
    'NSCLC': 'non-small cell lung cancer',
    'EGFR': 'EGFR',
    'PD-L1': 'PD-L1',
    'survival rate': 'survival',
    'RCT': 'randomized controlled trial',
    'meta-analysis': 'meta-analysis',
    'immunotherapy': 'immunotherapy',
    'chemotherapy': 'chemotherapy',
    'oncology': 'oncology',
  };
  
  let pubmedQuery = query.toLowerCase();
  
  // Replace common terms with PubMed-friendly versions
  Object.entries(medicalTerms).forEach(([term, replacement]) => {
    const regex = new RegExp(term, 'gi');
    pubmedQuery = pubmedQuery.replace(regex, replacement);
  });
  
  // Add filters for study types and recency
  pubmedQuery += ' AND (randomized controlled trial[pt] OR meta-analysis[pt] OR systematic review[pt])';
  
  return pubmedQuery;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('DoxyAI function called');

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { message } = await req.json();
    console.log('Received message:', message);

    if (!message || !message.trim()) {
      console.error('No message provided');
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if this is a research-related query that would benefit from PubMed integration
    const researchKeywords = ['survival', 'efficacy', 'RCT', 'meta-analysis', 'trial', 'study', 'research', 'literature', 'evidence'];
    const isResearchQuery = researchKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    let pubmedAbstracts = '';
    
    if (isResearchQuery) {
      console.log('Research query detected, searching PubMed...');
      
      // Extract and format query for PubMed search
      const pubmedQuery = extractKeywords(message);
      console.log('PubMed search query:', pubmedQuery);
      
      // Search PubMed and fetch abstracts
      const pmids = await searchPubMed(pubmedQuery, 3);
      if (pmids.length > 0) {
        pubmedAbstracts = await fetchAbstracts(pmids);
        console.log('Successfully fetched PubMed abstracts');
      }
    }

    // Enhanced system prompt for research queries
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

${pubmedAbstracts ? `

RECENT LITERATURE FROM PUBMED:
${pubmedAbstracts}

Please incorporate insights from the above PubMed abstracts in your response. Focus on:
- Specific trial results and survival data
- Comparison of treatment efficacy
- Adverse event profiles
- Clinical recommendations based on the evidence
- Reference the PMID numbers when citing specific studies

` : ''}

Remember: You are assisting healthcare professionals, not providing direct patient care advice.`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nMedical Query: ${message.trim()}` }
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
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Making request to Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response from AI service' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Gemini API response received');

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I was unable to generate a response. Please try rephrasing your question.';

    console.log('Response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        pubmedIntegrated: !!pubmedAbstracts,
        articleCount: pubmedAbstracts ? (pubmedAbstracts.match(/PMID:/g) || []).length : 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in doxy-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
