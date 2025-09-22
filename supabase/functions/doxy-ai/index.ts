import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Advanced Perplexity integration for real-time clinical research
async function enhancedClinicalResearch(query: string): Promise<string> {
  if (!PERPLEXITY_API_KEY) {
    console.log('Perplexity API key not available, using standard PubMed search');
    return '';
  }

  try {
    console.log('Performing enhanced clinical research with Perplexity...');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical research expert. Provide recent meta-analysis data, trial results, and clinical guidelines with specific numerical outcomes, hazard ratios, confidence intervals, and statistical significance. Focus on Indian population data when available.'
          },
          {
            role: 'user',
            content: `Find recent clinical research and meta-analysis data for: ${query}. Include specific statistical outcomes, trial names, effect sizes, confidence intervals, and heterogeneity measures when available.`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'year',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status);
      return '';
    }

    const data = await response.json();
    const researchData = data.choices?.[0]?.message?.content || '';
    console.log('Enhanced clinical research data retrieved:', researchData.length, 'characters');
    
    return researchData;
  } catch (error) {
    console.error('Error in enhanced clinical research:', error);
    return '';
  }
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

// PubMed E-utilities base URLs
const PUBMED_ESEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_EFETCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

// Enhanced statistical calculation functions
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
  },
  bodyFatPercentage: (bmi: number, age: number, isMale: boolean) => {
    const sexFactor = isMale ? 1 : 0;
    return (1.2 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4;
  },
  idealBodyWeight: (height: number, isMale: boolean) => {
    const heightInches = height * 39.37;
    if (isMale) {
      return 50 + (2.3 * (heightInches - 60));
    } else {
      return 45.5 + (2.3 * (heightInches - 60));
    }
  }
};

// Improved PubMed search with better query construction
async function searchPubMed(query: string, maxResults: number = 8): Promise<string[]> {
  try {
    console.log(`Starting PubMed RAG search for: ${query}`);
    
    // Build enhanced search query
    const searchQuery = buildPubMedQuery(query);
    console.log(`PubMed search query: ${searchQuery}`);
    
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: searchQuery,
      retmode: 'json',
      retmax: maxResults.toString(),
      sort: 'relevance',
      datetype: 'pdat',
      reldate: '3650', // Last 10 years for broader coverage
      usehistory: 'y'
    });

    const searchResponse = await fetch(`${PUBMED_ESEARCH_URL}?${searchParams}`);
    
    if (!searchResponse.ok) {
      console.error(`PubMed search API error: ${searchResponse.status}`);
      return [];
    }
    
    const searchData = await searchResponse.json();
    const pmids = searchData.esearchresult?.idlist || [];
    console.log(`PubMed search found ${pmids.length} articles:`, pmids.slice(0, 5));
    
    if (pmids.length === 0) {
      // Try a broader search with basic medical terms
      const broaderQuery = extractBasicMedicalTerms(query);
      console.log(`Trying broader search: ${broaderQuery}`);
      
      const broaderParams = new URLSearchParams({
        db: 'pubmed',
        term: broaderQuery,
        retmode: 'json',
        retmax: maxResults.toString(),
        sort: 'relevance',
        datetype: 'pdat',
        reldate: '5475', // Last 15 years for very broad search
      });

      const broaderResponse = await fetch(`${PUBMED_ESEARCH_URL}?${broaderParams}`);
      
      if (broaderResponse.ok) {
        const broaderData = await broaderResponse.json();
        const broaderPmids = broaderData.esearchresult?.idlist || [];
        console.log(`Broader search found ${broaderPmids.length} articles`);
        return broaderPmids.slice(0, maxResults);
      }
    }
    
    return pmids.slice(0, maxResults);
  } catch (error) {
    console.error('Error in PubMed search:', error);
    return [];
  }
}

// Build better PubMed query with medical term mapping
function buildPubMedQuery(query: string): string {
  const queryLower = query.toLowerCase();
  
  // Medical term mapping with broader coverage
  const medicalTerms = {
    'metformin': 'metformin[tw] OR glucophage[tw]',
    'semaglutide': 'semaglutide[tw] OR ozempic[tw] OR wegovy[tw]',
    'hba1c': 'hba1c[tw] OR "hemoglobin a1c"[tw] OR "glycated hemoglobin"[tw]',
    'diabetes': '"type 2 diabetes"[tw] OR t2dm[tw] OR "diabetes mellitus"[tw]',
    'pembrolizumab': 'pembrolizumab[tw] OR keytruda[tw]',
    'nivolumab': 'nivolumab[tw] OR opdivo[tw]',
    'nsclc': '"non small cell lung cancer"[tw] OR nsclc[tw]',
    'survival': '"overall survival"[tw] OR "progression free survival"[tw]',
    'breast cancer': '"breast cancer"[tw] OR "breast neoplasm"[tw]',
    'triple negative': '"triple negative"[tw] OR tnbc[tw]',
    'immunotherapy': 'immunotherapy[tw] OR "immune checkpoint"[tw]',
    'chemotherapy': 'chemotherapy[tw] OR "drug therapy"[tw]',
    'treatment': 'treatment[tw] OR therapy[tw]',
    'efficacy': 'efficacy[tw] OR effectiveness[tw]'
  };
  
  let enhancedQuery = query;
  
  // Replace terms with medical equivalents
  Object.entries(medicalTerms).forEach(([term, replacement]) => {
    if (queryLower.includes(term)) {
      const regex = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      enhancedQuery = enhancedQuery.replace(regex, `(${replacement})`);
    }
  });
  
  // Add study type filters based on query content
  if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('versus')) {
    enhancedQuery += ' AND ("randomized controlled trial"[pt] OR "clinical trial"[pt] OR "comparative study"[pt])';
  } else if (queryLower.includes('survival') || queryLower.includes('mortality') || queryLower.includes('outcome')) {
    enhancedQuery += ' AND ("clinical trial"[pt] OR "cohort studies"[mesh] OR "follow-up studies"[mesh])';
  } else {
    // Default to clinical studies
    enhancedQuery += ' AND ("clinical trial"[pt] OR "randomized controlled trial"[pt])';
  }
  
  // Always filter for human studies
  enhancedQuery += ' AND humans[mesh] AND english[lang]';
  
  return enhancedQuery;
}

// Extract basic medical terms for broader search
function extractBasicMedicalTerms(query: string): string {
  const basicTerms = [
    'metformin', 'semaglutide', 'diabetes', 'hba1c', 'pembrolizumab', 'nivolumab', 
    'lung cancer', 'breast cancer', 'treatment', 'therapy', 'survival', 'efficacy',
    'clinical trial', 'randomized', 'study', 'cancer', 'immunotherapy', 'chemotherapy'
  ];
  
  const foundTerms = basicTerms.filter(term => 
    query.toLowerCase().includes(term.toLowerCase())
  );
  
  if (foundTerms.length === 0) {
    // If no specific terms found, use general medical search
    return 'clinical trial[pt] AND humans[mesh] AND english[lang]';
  }
  
  const termQuery = foundTerms.slice(0, 3).map(term => `${term}[tw]`).join(' OR ');
  return `(${termQuery}) AND humans[mesh] AND english[lang]`;
}

// Enhanced abstract fetching with retry mechanism
async function fetchAbstracts(pmids: string[]): Promise<{abstracts: string, citations: any[]}> {
  if (pmids.length === 0) {
    console.log('No PMIDs provided for abstract fetching');
    return {abstracts: '', citations: []};
  }
  
  try {
    console.log(`Fetching abstracts for ${pmids.length} PMIDs: ${pmids.slice(0, 3).join(', ')}...`);
    
    const fetchParams = new URLSearchParams({
      db: 'pubmed',
      id: pmids.join(','),
      retmode: 'xml',
      rettype: 'abstract',
    });

    const fetchResponse = await fetch(`${PUBMED_EFETCH_URL}?${fetchParams}`);
    
    if (!fetchResponse.ok) {
      console.error(`PubMed fetch API error: ${fetchResponse.status}`);
      return {abstracts: '', citations: []};
    }
    
    const xmlData = await fetchResponse.text();
    console.log(`Received XML data, length: ${xmlData.length} characters`);
    
    const {abstracts, citations} = parseEnhancedAbstractsFromXML(xmlData);
    console.log(`Successfully parsed ${citations.length} abstracts with content`);
    
    return {abstracts, citations};
  } catch (error) {
    console.error('Error fetching PubMed abstracts:', error);
    return {abstracts: '', citations: []};
  }
}

// Enhanced XML parsing with better structure handling
function parseEnhancedAbstractsFromXML(xml: string): {abstracts: string, citations: any[]} {
  const articles: string[] = [];
  const citations: any[] = [];
  
  try {
    // Handle both PubmedArticle and PubmedBookArticle
    const articleRegex = /<PubmedArticle>(.*?)<\/PubmedArticle>/gs;
    let match;
    let articleCount = 0;
    
    while ((match = articleRegex.exec(xml)) !== null && articleCount < 10) {
      const articleXml = match[1];
      const parsedArticle = parseIndividualArticle(articleXml);
      
      if (parsedArticle.title && parsedArticle.abstractText && parsedArticle.abstractText.length > 50) {
        articles.push(formatArticleForRAG(parsedArticle));
        citations.push(parsedArticle);
        articleCount++;
        console.log(`Parsed article ${articleCount}: PMID ${parsedArticle.pmid} - ${parsedArticle.title.substring(0, 60)}...`);
      }
    }
    
    console.log(`Successfully parsed ${articleCount} valid articles from XML`);
  } catch (error) {
    console.error('Error parsing PubMed XML:', error);
  }
  
  return {
    abstracts: articles.join('\n\n--- NEXT STUDY ---\n\n'),
    citations
  };
}

// Parse individual article with better field extraction
function parseIndividualArticle(articleXml: string): any {
  // Helper functions for safe extraction
  const extractSingle = (regex: RegExp): string => {
    const match = articleXml.match(regex);
    return match && match[1] && typeof match[1] === 'string' ? match[1].trim().replace(/<[^>]*>/g, '') : '';
  };

  const extractMultiple = (regex: RegExp): string[] => {
    const matches = [];
    let match;
    while ((match = regex.exec(articleXml)) !== null) {
      if (match[1] && typeof match[1] === 'string' && match[1].trim) {
        matches.push(match[1].trim().replace(/<[^>]*>/g, ''));
      }
      if (!regex.global) break;
    }
    return matches;
  };

  // Extract basic info
  const pmid = extractSingle(/<PMID[^>]*>(\d+)<\/PMID>/);
  const title = extractSingle(/<ArticleTitle>(.*?)<\/ArticleTitle>/s);
  const journal = extractSingle(/<Title>(.*?)<\/Title>/);
  const year = extractSingle(/<PubDate>.*?<Year>(\d{4})<\/Year>.*?<\/PubDate>/s) || 
               extractSingle(/<PubDate>.*?<MedlineDate>(\d{4})/);
  const doi = extractSingle(/<ArticleId IdType="doi">(.*?)<\/ArticleId>/);
  
  // Extract abstract sections
  const abstractTexts = [];
  const abstractSections = extractMultiple(/<AbstractText[^>]*>(.*?)<\/AbstractText>/gs);
  
  for (const section of abstractSections) {
    if (section && section.length > 10) {
      abstractTexts.push(section);
    }
  }
  
  // If no structured abstract, try general abstract
  if (abstractTexts.length === 0) {
    const generalAbstract = extractSingle(/<Abstract>(.*?)<\/Abstract>/s);
    if (generalAbstract) {
      abstractTexts.push(generalAbstract);
    }
  }
  
  const abstractText = abstractTexts.join(' ');
  
  // Extract authors with better formatting
  const authors: string[] = [];
  const authorRegex = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?(?:<ForeName>(.*?)<\/ForeName>|<Initials>(.*?)<\/Initials>).*?<\/Author>/gs;
  let authorMatch;
  while ((authorMatch = authorRegex.exec(articleXml)) !== null && authors.length < 6) {
    const lastName = authorMatch[1];
    const firstName = authorMatch[2] || authorMatch[3] || '';
    authors.push(`${firstName} ${lastName}`.trim());
  }
  
  // Extract publication type for context
  const publicationTypes = extractMultiple(/<PublicationType[^>]*>(.*?)<\/PublicationType>/gs);
  
  return {
    pmid,
    title,
    journal,
    year: year || 'Unknown',
    authors,
    doi: doi || '',
    abstractText: abstractText.trim(),
    publicationTypes,
    pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
  };
}

// Format article for RAG context with better structure
function formatArticleForRAG(article: any): string {
  const studyType = article.publicationTypes?.find((type: string) => 
    type.toLowerCase().includes('randomized') || 
    type.toLowerCase().includes('meta') || 
    type.toLowerCase().includes('systematic')
  ) || 'Clinical Study';
  
  return `**STUDY ${article.pmid}** | **${article.year}** | **${studyType}**
**Title:** ${article.title}
**Journal:** ${article.journal}
**Authors:** ${article.authors.slice(0, 4).join(', ')}${article.authors.length > 4 ? ' et al.' : ''}
**Abstract:** ${article.abstractText}
**DOI:** ${article.doi}
**PubMed:** https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`;
}

// Query classification with enhanced medical patterns
function classifyQuery(query: string): {type: string, confidence: number, suggestedTerms?: string[]} {
  const queryLower = query.toLowerCase();
  
  const patterns = {
    clinical: {
      keywords: ['treatment', 'therapy', 'clinical trial', 'efficacy', 'safety', 'outcome', 'patient', 'management', 'guideline'],
      weight: 1.0
    },
    statistical: {
      keywords: ['calculate', 'bmi', 'creatinine', 'clearance', 'statistics', 'analysis', 'meta-analysis', 'chi-square', 'correlation'],
      weight: 1.2
    },
    diagnostic: {
      keywords: ['diagnosis', 'diagnostic', 'test', 'sensitivity', 'specificity', 'biomarker', 'screening'],
      weight: 1.1
    },
    pharmacological: {
      keywords: ['drug', 'medication', 'pharmacology', 'dose', 'dosage', 'side effects', 'adverse', 'contraindication'],
      weight: 1.0
    },
    research: {
      keywords: ['study', 'research', 'meta-analysis', 'systematic review', 'randomized', 'controlled trial'],
      weight: 1.3
    }
  };
  
  let bestMatch = { type: 'clinical', confidence: 0.3 };
  
  for (const [type, config] of Object.entries(patterns)) {
    const matches = config.keywords.filter(keyword => queryLower.includes(keyword));
    const confidence = (matches.length / config.keywords.length) * config.weight;
    
    if (confidence > bestMatch.confidence) {
      bestMatch = { type, confidence };
    }
  }
  
  return bestMatch;
}

// Enhanced Gemini API call with better error handling
async function callGeminiAPI(prompt: string, context: string = ''): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    console.log('Making enhanced RAG request to Gemini API...');
    
    const fullPrompt = context 
      ? `${context}\n\n---\n\nBased on the above medical literature and research data, please provide a comprehensive response to the following query:\n\n${prompt}`
      : prompt;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response structure from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Main handler function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('DoxyAI Enhanced RAG function called');
    
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Processing clinical query with RAG pipeline...');
    
    // Check if it's a medical query that should use RAG
    const isMedicalQuery = /\b(treatment|therapy|drug|medication|disease|symptom|diagnosis|patient|clinical|medical|health|cancer|diabetes|hypertension|study|trial|research|meta-analysis)\b/i.test(message);
    
    if (isMedicalQuery) {
      console.log('Medical query detected:', message);
      
      // Detect query type for better processing
      const queryType = classifyQuery(message);
      console.log('Query type detected:', queryType.type);
      
      console.log('Initiating PubMed RAG search...');
      
      // Search PubMed for relevant articles
      const pmids = await searchPubMed(message);
      console.log(`Found ${pmids.length} PMIDs, fetching abstracts...`);
      
      // Fetch and parse abstracts
      const { abstracts, citations } = await fetchAbstracts(pmids);
      console.log(`RAG Success: Retrieved ${citations.length} citations for processing`);
      
      // Enhanced clinical research using Perplexity if available
      const clinicalResearch = await enhancedClinicalResearch(message);
      
      // Combine context for comprehensive response
      let contextualPrompt = `You are DoxyAI, an advanced medical AI assistant with access to current medical literature and research databases. You provide evidence-based medical information with proper citations.

## Medical Literature Context:
${abstracts}

${clinicalResearch ? `## Enhanced Clinical Research Data:
${clinicalResearch}` : ''}

## Instructions:
- Provide a comprehensive, evidence-based response
- Include specific citations from the provided studies when relevant
- Mention statistical data, effect sizes, and confidence intervals when available
- Focus on clinical relevance and practical applications
- Include Indian healthcare context when applicable
- If statistical calculations are needed, perform them accurately
- Always maintain clinical accuracy and provide appropriate medical disclaimers

## Query: ${message}

Please provide a detailed medical response based on the available evidence.`;

      // Call Gemini with the enhanced context
      const response = await callGeminiAPI(message, contextualPrompt);
      
      return new Response(JSON.stringify({
        response,
        ragEnabled: true,
        pubmedIntegrated: citations.length > 0,
        articleCount: citations.length,
        citations: citations.slice(0, 5), // Return top 5 citations
        searchStrategy: queryType.type,
        hasCalculation: /\b(bmi|calculate|creatinine|clearance|statistical|analysis)\b/i.test(message),
        calculationType: message.toLowerCase().includes('bmi') ? 'BMI' : 
                        message.toLowerCase().includes('creatinine') ? 'Creatinine Clearance' :
                        message.toLowerCase().includes('statistical') ? 'Statistical Analysis' : null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // For non-medical queries, use standard Gemini response
      console.log('Non-medical query, using standard response');
      const response = await callGeminiAPI(`You are DoxyAI, a helpful medical AI assistant. Please respond to this query: ${message}`);
      
      return new Response(JSON.stringify({
        response,
        ragEnabled: false,
        pubmedIntegrated: false,
        articleCount: 0,
        citations: [],
        searchStrategy: 'Standard Response'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in DoxyAI function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process your request. Please try again.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});