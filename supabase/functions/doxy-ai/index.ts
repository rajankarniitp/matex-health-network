
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

// Enhanced PubMed search with better query construction
async function searchPubMed(query: string, maxResults: number = 10): Promise<string[]> {
  try {
    console.log(`Starting PubMed search for: ${query}`);
    
    // Build comprehensive search query
    const searchQuery = buildAdvancedPubMedQuery(query);
    console.log(`Constructed PubMed query: ${searchQuery}`);
    
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: searchQuery,
      retmode: 'json',
      retmax: maxResults.toString(),
      sort: 'relevance',
      datetype: 'pdat',
      reldate: '1825', // Last 5 years
      usehistory: 'y'
    });

    const searchResponse = await fetch(`${PUBMED_ESEARCH_URL}?${searchParams}`);
    const searchData = await searchResponse.json();
    
    const pmids = searchData.esearchresult?.idlist || [];
    console.log(`PubMed search returned ${pmids.length} PMIDs:`, pmids);
    
    if (pmids.length === 0) {
      // Try a broader search if initial query returns nothing
      const broaderQuery = buildBroaderQuery(query);
      console.log(`Trying broader query: ${broaderQuery}`);
      
      const broaderParams = new URLSearchParams({
        db: 'pubmed',
        term: broaderQuery,
        retmode: 'json',
        retmax: maxResults.toString(),
        sort: 'relevance',
        datetype: 'pdat',
        reldate: '2555', // Last 7 years for broader search
      });

      const broaderResponse = await fetch(`${PUBMED_ESEARCH_URL}?${broaderParams}`);
      const broaderData = await broaderResponse.json();
      const broaderPmids = broaderData.esearchresult?.idlist || [];
      
      console.log(`Broader search returned ${broaderPmids.length} PMIDs`);
      return broaderPmids.slice(0, maxResults);
    }
    
    return pmids.slice(0, maxResults);
  } catch (error) {
    console.error('Error in PubMed search:', error);
    return [];
  }
}

// Build advanced PubMed query with medical term enhancement
function buildAdvancedPubMedQuery(query: string): string {
  const queryLower = query.toLowerCase();
  
  // Enhanced medical term mapping
  const medicalTermMap = {
    'metformin': 'metformin[tw] OR glucophage[tw]',
    'semaglutide': 'semaglutide[tw] OR ozempic[tw] OR wegovy[tw] OR rybelsus[tw]',
    'hba1c': 'hba1c[tw] OR "hemoglobin a1c"[tw] OR "glycated hemoglobin"[tw] OR "hemoglobin a, glycosylated"[mesh]',
    'diabetes': '"diabetes mellitus, type 2"[mesh] OR "type 2 diabetes"[tw] OR t2dm[tw]',
    'pembrolizumab': 'pembrolizumab[tw] OR keytruda[tw] OR "mk-3475"[tw]',
    'nivolumab': 'nivolumab[tw] OR opdivo[tw] OR "bms-936558"[tw]',
    'nsclc': '"carcinoma, non-small-cell lung"[mesh] OR "non-small cell lung cancer"[tw] OR nsclc[tw]',
    'survival': '"survival rate"[mesh] OR "overall survival"[tw] OR "progression-free survival"[tw] OR mortality[tw]',
    'breast cancer': '"breast neoplasms"[mesh] OR "breast cancer"[tw]',
    'triple negative': '"triple negative breast neoplasms"[mesh] OR "triple negative"[tw] OR tnbc[tw]'
  };
  
  let enhancedQuery = query;
  
  // Replace terms with enhanced versions
  Object.entries(medicalTermMap).forEach(([term, replacement]) => {
    if (queryLower.includes(term)) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      enhancedQuery = enhancedQuery.replace(regex, `(${replacement})`);
    }
  });
  
  // Add study type filters for clinical research queries
  if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('versus')) {
    enhancedQuery += ' AND (randomized controlled trial[pt] OR clinical trial[pt] OR comparative study[pt] OR meta-analysis[pt])';
  } else if (queryLower.includes('survival') || queryLower.includes('rate') || queryLower.includes('outcome')) {
    enhancedQuery += ' AND (clinical trial[pt] OR cohort studies[mesh] OR meta-analysis[pt])';
  } else {
    enhancedQuery += ' AND (randomized controlled trial[pt] OR meta-analysis[pt] OR systematic review[pt])';
  }
  
  // Always add human studies filter
  enhancedQuery += ' AND humans[mesh]';
  
  return enhancedQuery;
}

// Build broader query for fallback
function buildBroaderQuery(query: string): string {
  const keywords = extractMedicalKeywords(query);
  const broadQuery = keywords.slice(0, 3).map(kw => `${kw}[tw]`).join(' AND ');
  return `${broadQuery} AND (clinical trial[pt] OR meta-analysis[pt]) AND humans[mesh]`;
}

// Extract medical keywords from query
function extractMedicalKeywords(query: string): string[] {
  const medicalTerms = [
    'metformin', 'semaglutide', 'hba1c', 'diabetes', 'pembrolizumab', 'nivolumab', 
    'nsclc', 'survival', 'breast cancer', 'triple negative', 'treatment', 'therapy',
    'efficacy', 'safety', 'trial', 'study', 'cancer', 'oncology', 'immunotherapy',
    'chemotherapy', 'radiation', 'surgery', 'prognosis', 'outcome', 'mortality'
  ];
  
  return medicalTerms.filter(term => 
    query.toLowerCase().includes(term.toLowerCase())
  );
}

// Enhanced abstract fetching with better parsing
async function fetchAbstracts(pmids: string[]): Promise<{abstracts: string, citations: any[]}> {
  if (pmids.length === 0) return {abstracts: '', citations: []};
  
  try {
    console.log(`Fetching abstracts for PMIDs: ${pmids.join(', ')}`);
    
    const fetchParams = new URLSearchParams({
      db: 'pubmed',
      id: pmids.join(','),
      retmode: 'xml',
      rettype: 'abstract',
    });

    const fetchResponse = await fetch(`${PUBMED_EFETCH_URL}?${fetchParams}`);
    const xmlData = await fetchResponse.text();
    
    console.log(`Received XML data length: ${xmlData.length}`);
    
    const {abstracts, citations} = parseEnhancedAbstractsFromXML(xmlData);
    console.log(`Successfully parsed ${citations.length} abstracts`);
    
    return {abstracts, citations};
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return {abstracts: '', citations: []};
  }
}

// Enhanced XML parsing with better error handling and data extraction
function parseEnhancedAbstractsFromXML(xml: string): {abstracts: string, citations: any[]} {
  const articles: string[] = [];
  const citations: any[] = [];
  
  try {
    const articleRegex = /<PubmedArticle>(.*?)<\/PubmedArticle>/gs;
    let match;
    let articleCount = 0;
    
    while ((match = articleRegex.exec(xml)) !== null && articleCount < 10) {
      const articleXml = match[1];
      const parsedArticle = parseIndividualArticle(articleXml);
      
      if (parsedArticle.title && parsedArticle.abstractText.trim()) {
        articles.push(formatArticleForRAG(parsedArticle));
        citations.push(parsedArticle);
        articleCount++;
      }
    }
    
    console.log(`Parsed ${articleCount} valid articles from XML`);
  } catch (error) {
    console.error('Error parsing XML:', error);
  }
  
  return {
    abstracts: articles.join('\n\n---\n\n'),
    citations
  };
}

// Parse individual article from XML
function parseIndividualArticle(articleXml: string): any {
  const extractText = (regex: RegExp, xml: string) => {
    const match = regex.exec(xml);
    return match ? match[1].replace(/<[^>]*>/g, '').trim() : '';
  };
  
  const title = extractText(/<ArticleTitle>(.*?)<\/ArticleTitle>/s, articleXml);
  const pmid = extractText(/<PMID[^>]*>(.*?)<\/PMID>/s, articleXml);
  const journal = extractText(/<Title>(.*?)<\/Title>/s, articleXml);
  const year = extractText(/<PubDate>.*?<Year>(.*?)<\/Year>/s, articleXml);
  const doi = extractText(/<ArticleId IdType="doi">(.*?)<\/ArticleId>/s, articleXml);
  
  // Extract abstract with better handling of structured abstracts
  let abstractText = '';
  const abstractRegex = /<AbstractText[^>]*>(.*?)<\/AbstractText>/gs;
  let abstractMatch;
  while ((abstractMatch = abstractRegex.exec(articleXml)) !== null) {
    abstractText += abstractMatch[1].replace(/<[^>]*>/g, '') + ' ';
  }
  
  // Extract authors
  const authors: string[] = [];
  const authorRegex = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs;
  let authorMatch;
  while ((authorMatch = authorRegex.exec(articleXml)) !== null && authors.length < 5) {
    authors.push(`${authorMatch[2]} ${authorMatch[1]}`);
  }
  
  return {
    pmid,
    title,
    journal,
    year,
    authors,
    doi,
    abstractText: abstractText.trim(),
    pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
  };
}

// Format article for RAG context
function formatArticleForRAG(article: any): string {
  return `**PMID: ${article.pmid}** | **Year: ${article.year}**
**Title:** ${article.title}
**Journal:** ${article.journal}
**Authors:** ${article.authors.slice(0, 3).join(', ')}${article.authors.length > 3 ? ' et al.' : ''}
**Abstract:** ${article.abstractText}
**DOI:** ${article.doi}
**PubMed Link:** ${article.pubmedUrl}`;
}

// Enhanced statistical query detection
function detectStatisticalQuery(query: string): {isStatistical: boolean, calculationType?: string, parameters?: any} {
  const statKeywords = {
    'bmi': /bmi|body mass index|weight.*height/i,
    'bsa': /bsa|body surface area/i,
    'creatinine': /creatinine clearance|cockroft|gault/i,
    'chisquare': /chi.?square|chi.?squared/i,
    'bodyFat': /body fat|fat percentage/i,
    'idealWeight': /ideal.*weight|IBW/i
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

// Enhanced parameter extraction
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
    case 'bodyFat':
      const isMale = /male|man|he/i.test(query) && !/female|woman|she/i.test(query);
      return numbers.length >= 2 ? {bmi: numbers[0], age: numbers[1], isMale} : null;
    case 'idealWeight':
      const isMaleWeight = /male|man|he/i.test(query) && !/female|woman|she/i.test(query);
      return numbers.length >= 1 ? {height: numbers[0], isMale: isMaleWeight} : null;
    default:
      return null;
  }
}

// Enhanced research query detection
function shouldUsePubMed(query: string): boolean {
  const researchKeywords = [
    'compare', 'comparison', 'versus', 'vs', 'survival', 'efficacy', 'effectiveness',
    'RCT', 'randomized', 'clinical trial', 'meta-analysis', 'study', 'research',
    'literature', 'evidence', 'treatment', 'therapy', 'drug', 'medication',
    'outcome', 'prognosis', 'mortality', 'morbidity', 'safety', 'adverse',
    'guidelines', 'recommendations', 'protocol', 'intervention', 'statistics'
  ];
  
  const queryLower = query.toLowerCase();
  return researchKeywords.some(keyword => queryLower.includes(keyword));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Enhanced DoxyAI RAG function called');

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message } = await req.json();
    console.log('Received enhanced query:', message);

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
          calculationResult = `\n\n**STATISTICAL CALCULATION:**\n${statQuery.calculationType.toUpperCase()}: ${result.toFixed(2)}${getCalculationUnit(statQuery.calculationType)}\n`;
        }
      } catch (error) {
        console.error('Calculation error:', error);
      }
    }

    // Enhanced RAG: Check if query would benefit from PubMed
    let pubmedAbstracts = '';
    let citations: any[] = [];
    let ragStrategy = 'General Medical Knowledge';
    
    if (shouldUsePubMed(message)) {
      console.log('Research query detected, initiating enhanced RAG with PubMed...');
      ragStrategy = 'PubMed RAG Pipeline';
      
      const pmids = await searchPubMed(message, 8);
      if (pmids.length > 0) {
        const {abstracts, citations: fetchedCitations} = await fetchAbstracts(pmids);
        pubmedAbstracts = abstracts;
        citations = fetchedCitations;
        console.log(`RAG: Retrieved ${citations.length} citations for enhanced processing`);
      } else {
        console.log('RAG: No PubMed articles found, proceeding with general medical knowledge');
        ragStrategy = 'General Medical Knowledge (No PubMed Results)';
      }
    }

    // Enhanced system prompt for clinical-grade RAG processing
    const systemPrompt = `You are DoxyAI, an advanced clinical AI assistant with access to real-time biomedical literature and statistical capabilities. You provide evidence-based medical information with the highest clinical standards.

RESPONSE FORMAT REQUIREMENTS:
Structure your response using this exact clinical template:

## 🔬 Clinical Assessment
Brief clinical overview and context of the query

## 📊 Key Research Findings
${pubmedAbstracts ? '- Evidence from recent literature (cite specific PMIDs)' : '- General medical knowledge and established guidelines'}
- Comparative data when available
- Statistical significance and effect sizes
- Key trial names and endpoints

## 💊 Clinical Recommendations  
- Evidence-based treatment approaches
- Risk-benefit considerations
- Patient selection criteria
- Dosing recommendations when applicable

## 📈 Statistical Analysis
${calculationResult ? calculationResult : '- Relevant clinical metrics and calculations when applicable'}

## 🔗 References & Citations
${citations.length > 0 ? '- PubMed sources with PMIDs and links' : '- Clinical guidelines and standard references'}

## ⚠️ Clinical Disclaimer
This information is for healthcare professionals. Always consult current guidelines and consider individual patient factors.

${pubmedAbstracts ? `
**LATEST RESEARCH CONTEXT (RAG):**
${pubmedAbstracts}

**CRITICAL RAG INSTRUCTIONS:**
- Use the above PubMed literature as your PRIMARY evidence source
- Reference specific PMIDs when citing findings (e.g., "According to PMID: 12345678...")
- Focus on comparative data: survival rates, hazard ratios, response rates, adverse events
- Highlight specific trial names, primary endpoints, and statistical significance
- Provide exact numerical data from the studies (don't approximate)
- Compare different treatments when multiple studies are available
- Always mention the journal and year when citing studies

` : ''}

${calculationResult ? `
**STATISTICAL CALCULATION PERFORMED:**
${calculationResult}
Integrate this calculation result into your clinical assessment.
` : ''}

IMPORTANT: 
- Format your response with proper markdown (**, *, -, ##) for readability
- Use clinical terminology appropriately while remaining accessible
- When citing studies, always include PMID numbers
- Provide specific numerical outcomes and confidence intervals when available`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\n**Patient/Clinical Query:** ${message.trim()}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 3000,
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

    console.log('Making enhanced RAG request to Gemini API...');
    
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

    console.log('Enhanced RAG response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        pubmedIntegrated: !!pubmedAbstracts,
        articleCount: citations.length,
        citations: citations,
        hasCalculation: !!calculationResult,
        calculationType: statQuery.calculationType || null,
        ragEnabled: true,
        searchStrategy: ragStrategy
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhanced DoxyAI RAG function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function for calculation units
function getCalculationUnit(calculationType: string): string {
  switch (calculationType) {
    case 'bmi': return ' kg/m²';
    case 'bsa': return ' m²';
    case 'creatinineClearance': return ' mL/min';
    case 'bodyFat': return '%';
    case 'idealWeight': return ' kg';
    default: return '';
  }
}
