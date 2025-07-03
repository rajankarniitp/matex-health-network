
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

// Statistical calculation functions
const statisticalCalculations = {
  bmi: (weight: number, height: number) => weight / (height * height),
  bsa: (weight: number, height: number) => Math.sqrt((weight * height) / 3600),
  creatinineClearance: (age: number, weight: number, creatinine: number, isFemale: boolean) => {
    const base = (140 - age) * weight / (72 * creatinine);
    return isFemale ? base * 0.85 : base;
  },
  chisquare: (observed: number[], expected: number[]) => {
    return observed.reduce((sum, obs, i) => {
      const exp = expected[i];
      return sum + Math.pow(obs - exp, 2) / exp;
    }, 0);
  }
};

// Enhanced PubMed search with better query construction
async function searchPubMed(query: string, maxResults: number = 5): Promise<string[]> {
  try {
    // Enhanced query construction for better results
    const enhancedQuery = constructEnhancedQuery(query);
    console.log(`Enhanced PubMed query: ${enhancedQuery}`);
    
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: enhancedQuery,
      retmode: 'json',
      retmax: maxResults.toString(),
      sort: 'relevance',
      reldate: '1825', // Last 5 years
      usehistory: 'y'
    });

    const searchResponse = await fetch(`${PUBMED_ESEARCH_URL}?${searchParams}`);
    const searchData = await searchResponse.json();
    
    const pmids = searchData.esearchresult?.idlist || [];
    console.log(`Found ${pmids.length} PMIDs for enhanced query`);
    
    return pmids;
  } catch (error) {
    console.error('Error searching PubMed:', error);
    return [];
  }
}

// Improved query construction for better PubMed results
function constructEnhancedQuery(query: string): string {
  const medicalTerms = {
    'pembrolizumab': 'pembrolizumab[tw] OR keytruda[tw]',
    'nivolumab': 'nivolumab[tw] OR opdivo[tw]',
    'NSCLC': '("non-small cell lung cancer"[tw] OR NSCLC[tw])',
    'EGFR': 'EGFR[tw] OR "epidermal growth factor receptor"[tw]',
    'PD-L1': '("PD-L1"[tw] OR "programmed death ligand 1"[tw])',
    'survival rate': '(survival[tw] OR mortality[tw] OR "overall survival"[tw])',
    'immunotherapy': 'immunotherapy[tw] OR "immune checkpoint"[tw]',
  };
  
  let enhancedQuery = query.toLowerCase();
  
  // Replace terms with enhanced versions
  Object.entries(medicalTerms).forEach(([term, replacement]) => {
    const regex = new RegExp(term, 'gi');
    if (enhancedQuery.includes(term.toLowerCase())) {
      enhancedQuery = enhancedQuery.replace(regex, replacement);
    }
  });
  
  // Add study type filters
  enhancedQuery += ' AND (randomized controlled trial[pt] OR clinical trial[pt] OR meta-analysis[pt] OR systematic review[pt])';
  
  // Add human studies filter
  enhancedQuery += ' AND humans[mh]';
  
  return enhancedQuery;
}

// Enhanced abstract fetching with better parsing
async function fetchAbstracts(pmids: string[]): Promise<{abstracts: string, citations: any[]}> {
  if (pmids.length === 0) return {abstracts: '', citations: []};
  
  try {
    const fetchParams = new URLSearchParams({
      db: 'pubmed',
      id: pmids.join(','),
      retmode: 'xml',
      rettype: 'abstract',
    });

    const fetchResponse = await fetch(`${PUBMED_EFETCH_URL}?${fetchParams}`);
    const xmlData = await fetchResponse.text();
    
    const {abstracts, citations} = parseEnhancedAbstractsFromXML(xmlData);
    console.log(`Successfully fetched ${citations.length} abstracts with citations`);
    
    return {abstracts, citations};
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return {abstracts: '', citations: []};
  }
}

// Enhanced XML parsing with citation extraction
function parseEnhancedAbstractsFromXML(xml: string): {abstracts: string, citations: any[]} {
  const articles: string[] = [];
  const citations: any[] = [];
  
  const articleRegex = /<PubmedArticle>(.*?)<\/PubmedArticle>/gs;
  const titleRegex = /<ArticleTitle>(.*?)<\/ArticleTitle>/s;
  const abstractRegex = /<AbstractText[^>]*>(.*?)<\/AbstractText>/gs;
  const authorRegex = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs;
  const pmidRegex = /<PMID[^>]*>(.*?)<\/PMID>/s;
  const journalRegex = /<Title>(.*?)<\/Title>/s;
  const pubDateRegex = /<PubDate>.*?<Year>(.*?)<\/Year>/s;
  const doiRegex = /<ArticleId IdType="doi">(.*?)<\/ArticleId>/s;

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
    
    const doiMatch = doiRegex.exec(articleXml);
    const doi = doiMatch ? doiMatch[1] : '';
    
    // Extract abstract text
    let abstractText = '';
    let abstractMatch;
    const abstractRegexCopy = /<AbstractText[^>]*>(.*?)<\/AbstractText>/gs;
    while ((abstractMatch = abstractRegexCopy.exec(articleXml)) !== null) {
      abstractText += abstractMatch[1].replace(/<[^>]*>/g, '') + ' ';
    }
    
    // Extract authors
    const authors: string[] = [];
    let authorMatch;
    const authorRegexCopy = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs;
    while ((authorMatch = authorRegexCopy.exec(articleXml)) !== null) {
      authors.push(`${authorMatch[2]} ${authorMatch[1]}`);
    }
    
    if (title && abstractText.trim()) {
      // Store article text
      articles.push(`
**PMID: ${pmid}**
**Title:** ${title}
**Journal:** ${journal} (${year})
**Authors:** ${authors.slice(0, 3).join(', ')}${authors.length > 3 ? ' et al.' : ''}
**Abstract:** ${abstractText.trim()}
---`);

      // Store citation metadata
      citations.push({
        pmid,
        title,
        journal,
        year,
        authors: authors.slice(0, 3),
        doi,
        pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
      });
    }
  }
  
  return {
    abstracts: articles.join('\n\n'),
    citations
  };
}

// Detect statistical queries
function detectStatisticalQuery(query: string): {isStatistical: boolean, calculationType?: string, parameters?: any} {
  const statKeywords = {
    'bmi': /bmi|body mass index|weight.*height/i,
    'bsa': /bsa|body surface area/i,
    'creatinine': /creatinine clearance|cockroft|gault/i,
    'chisquare': /chi.?square|chi.?squared/i
  };
  
  for (const [type, regex] of Object.entries(statKeywords)) {
    if (regex.test(query)) {
      return {
        isStatistical: true,
        calculationType: type,
        parameters: extractStatisticalParameters(query, type)
      };
    }
  }
  
  return {isStatistical: false};
}

// Extract parameters for statistical calculations
function extractStatisticalParameters(query: string, type: string): any {
  const numberRegex = /\d+\.?\d*/g;
  const numbers = query.match(numberRegex)?.map(n => parseFloat(n)) || [];
  
  switch (type) {
    case 'bmi':
      return numbers.length >= 2 ? {weight: numbers[0], height: numbers[1]} : null;
    case 'bsa':
      return numbers.length >= 2 ? {weight: numbers[0], height: numbers[1]} : null;
    case 'creatinine':
      const isFemale = /female|woman|she/i.test(query);
      return numbers.length >= 3 ? {age: numbers[0], weight: numbers[1], creatinine: numbers[2], isFemale} : null;
    default:
      return null;
  }
}

// Check if query would benefit from PubMed integration
function shouldUsePubMed(query: string): boolean {
  const researchKeywords = [
    'survival', 'efficacy', 'RCT', 'randomized', 'clinical trial', 'meta-analysis', 
    'study', 'research', 'literature', 'evidence', 'comparison', 'versus', 'vs',
    'pembrolizumab', 'nivolumab', 'immunotherapy', 'chemotherapy', 'treatment',
    'NSCLC', 'cancer', 'oncology', 'prognosis', 'outcome'
  ];
  
  return researchKeywords.some(keyword => 
    query.toLowerCase().includes(keyword.toLowerCase())
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Enhanced DoxyAI function called');

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message } = await req.json();
    console.log('Received message:', message);

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for statistical queries first
    const statQuery = detectStatisticalQuery(message);
    let calculationResult = '';
    
    if (statQuery.isStatistical && statQuery.parameters) {
      try {
        const calc = statisticalCalculations[statQuery.calculationType as keyof typeof statisticalCalculations];
        if (calc && statQuery.parameters) {
          const result = calc(...Object.values(statQuery.parameters));
          calculationResult = `\n\n**CALCULATION RESULT:**\n${statQuery.calculationType.toUpperCase()}: ${result.toFixed(2)}\n`;
        }
      } catch (error) {
        console.error('Calculation error:', error);
      }
    }

    // Enhanced RAG: Check if query would benefit from PubMed
    let pubmedAbstracts = '';
    let citations: any[] = [];
    
    if (shouldUsePubMed(message)) {
      console.log('Research query detected, initiating enhanced PubMed search...');
      
      const pmids = await searchPubMed(message, 5);
      if (pmids.length > 0) {
        const {abstracts, citations: fetchedCitations} = await fetchAbstracts(pmids);
        pubmedAbstracts = abstracts;
        citations = fetchedCitations;
        console.log(`Retrieved ${citations.length} citations for RAG processing`);
      }
    }

    // Enhanced system prompt for RAG processing
    const systemPrompt = `You are DoxyAI, an advanced medical AI assistant with access to the latest biomedical literature. You provide evidence-based medical information, research insights, and clinical guidance.

IMPORTANT GUIDELINES:
- Always structure responses in a clear, professional medical format
- Provide evidence-based information with appropriate medical disclaimers
- Include differential diagnoses when relevant
- Suggest appropriate investigations or treatment approaches
- Always recommend consulting with specialists when appropriate
- Use proper medical terminology while remaining accessible
- Always add disclaimers about consulting licensed medical professionals

FORMAT YOUR RESPONSE WITH:
1. **Clinical Assessment**: Brief overview
2. **Key Findings**: Important points from literature (if available)
3. **Evidence Summary**: Research findings and comparisons
4. **Clinical Recommendations**: Evidence-based suggestions
5. **Further Actions**: Next steps or referrals
6. **References**: Cite PMIDs when available
7. **Disclaimer**: Professional consultation reminder

${pubmedAbstracts ? `
RECENT LITERATURE FROM PUBMED (RAG CONTEXT):
${pubmedAbstracts}

**CRITICAL:** Use the above PubMed literature as your primary evidence source. When citing findings:
- Reference specific PMIDs in your response
- Focus on comparative data (survival rates, hazard ratios, adverse events)
- Highlight trial names and key endpoints
- Provide specific numerical data when available
- Structure comparisons in a clear, clinical format

` : ''}

${calculationResult ? `
STATISTICAL CALCULATION:
${calculationResult}
Include this calculation result in your clinical assessment.
` : ''}

Remember: You are assisting healthcare professionals with evidence-based information.`;

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

    console.log('Making enhanced request to Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response from AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response. Please try rephrasing your question.';

    console.log('Enhanced response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        pubmedIntegrated: !!pubmedAbstracts,
        articleCount: citations.length,
        citations: citations,
        hasCalculation: !!calculationResult,
        calculationType: statQuery.calculationType || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhanced doxy-ai function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
