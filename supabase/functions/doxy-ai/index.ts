
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
  // Add more medical calculations
  bodyFatPercentage: (bmi: number, age: number, isMale: boolean) => {
    const sexFactor = isMale ? 1 : 0;
    return (1.2 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4;
  },
  idealBodyWeight: (height: number, isMale: boolean) => {
    const heightInches = height * 39.37; // convert meters to inches
    if (isMale) {
      return 50 + (2.3 * (heightInches - 60));
    } else {
      return 45.5 + (2.3 * (heightInches - 60));
    }
  }
};

// Improved PubMed search with broader query strategies
async function searchPubMed(query: string, maxResults: number = 8): Promise<string[]> {
  try {
    // Try multiple search strategies for better results
    const searchStrategies = [
      constructPrimaryQuery(query),
      constructBroaderQuery(query),
      constructFallbackQuery(query)
    ];
    
    for (const searchQuery of searchStrategies) {
      console.log(`Trying PubMed search with: ${searchQuery}`);
      
      const searchParams = new URLSearchParams({
        db: 'pubmed',
        term: searchQuery,
        retmode: 'json',
        retmax: maxResults.toString(),
        sort: 'relevance',
        reldate: '1825', // Last 5 years
        usehistory: 'y'
      });

      const searchResponse = await fetch(`${PUBMED_ESEARCH_URL}?${searchParams}`);
      const searchData = await searchResponse.json();
      
      const pmids = searchData.esearchresult?.idlist || [];
      console.log(`Found ${pmids.length} PMIDs with strategy: ${searchQuery}`);
      
      if (pmids.length > 0) {
        return pmids.slice(0, maxResults); // Return first successful strategy
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error searching PubMed:', error);
    return [];
  }
}

// Primary query construction with medical term mapping
function constructPrimaryQuery(query: string): string {
  const medicalTerms = {
    'pembrolizumab': 'pembrolizumab[tw] OR keytruda[tw]',
    'nivolumab': 'nivolumab[tw] OR opdivo[tw]',
    'NSCLC': '("non-small cell lung cancer"[tw] OR NSCLC[tw] OR "lung neoplasms"[mh])',
    'EGFR': '(EGFR[tw] OR "epidermal growth factor receptor"[tw])',
    'PD-L1': '("PD-L1"[tw] OR "programmed death ligand 1"[tw] OR "CD274"[tw])',
    'survival rate': '(survival[tw] OR mortality[tw] OR "overall survival"[tw] OR "progression free survival"[tw])',
    'immunotherapy': '(immunotherapy[tw] OR "immune checkpoint"[tw] OR "immune therapy"[tw])',
    'metformin': '(metformin[tw] OR "glucophage"[tw])',
    'semaglutide': '(semaglutide[tw] OR "ozempic"[tw] OR "wegovy"[tw])',
    'HbA1c': '("HbA1c"[tw] OR "hemoglobin A1c"[tw] OR "glycated hemoglobin"[tw])',
    'diabetes': '("diabetes mellitus"[mh] OR "type 2 diabetes"[tw] OR T2DM[tw])',
    'breast cancer': '("breast neoplasms"[mh] OR "breast cancer"[tw])',
    'triple negative': '("triple negative"[tw] OR TNBC[tw])'
  };
  
  let enhancedQuery = query.toLowerCase();
  
  // Replace terms with enhanced versions
  Object.entries(medicalTerms).forEach(([term, replacement]) => {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (enhancedQuery.includes(term.toLowerCase())) {
      enhancedQuery = enhancedQuery.replace(regex, replacement);
    }
  });
  
  // Add study type filters
  enhancedQuery += ' AND (randomized controlled trial[pt] OR clinical trial[pt] OR meta-analysis[pt] OR systematic review[pt])';
  enhancedQuery += ' AND humans[mh]';
  
  return enhancedQuery;
}

// Broader query for when primary fails
function constructBroaderQuery(query: string): string {
  const keywords = extractKeywords(query);
  const broadQuery = keywords.map(kw => `${kw}[tw]`).join(' OR ');
  return `(${broadQuery}) AND (clinical trial[pt] OR meta-analysis[pt]) AND humans[mh]`;
}

// Fallback query with minimal filters
function constructFallbackQuery(query: string): string {
  const keywords = extractKeywords(query);
  return keywords.slice(0, 3).map(kw => `${kw}[tw]`).join(' AND ') + ' AND humans[mh]';
}

// Extract key medical terms from query
function extractKeywords(query: string): string[] {
  const medicalKeywords = [
    'pembrolizumab', 'nivolumab', 'NSCLC', 'EGFR', 'PD-L1', 'survival', 'immunotherapy',
    'metformin', 'semaglutide', 'HbA1c', 'diabetes', 'breast cancer', 'triple negative',
    'treatment', 'therapy', 'efficacy', 'safety', 'trial', 'study', 'cancer', 'oncology'
  ];
  
  return medicalKeywords.filter(keyword => 
    query.toLowerCase().includes(keyword.toLowerCase())
  );
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
    console.log(`Successfully fetched ${citations.length} abstracts with enhanced parsing`);
    
    return {abstracts, citations};
  } catch (error) {
    console.error('Error fetching abstracts:', error);
    return {abstracts: '', citations: []};
  }
}

// Enhanced XML parsing with better error handling
function parseEnhancedAbstractsFromXML(xml: string): {abstracts: string, citations: any[]} {
  const articles: string[] = [];
  const citations: any[] = [];
  
  try {
    const articleRegex = /<PubmedArticle>(.*?)<\/PubmedArticle>/gs;
    const titleRegex = /<ArticleTitle>(.*?)<\/ArticleTitle>/s;
    const abstractRegex = /<AbstractText[^>]*>(.*?)<\/AbstractText>/gs;
    const authorRegex = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs;
    const pmidRegex = /<PMID[^>]*>(.*?)<\/PMID>/s;
    const journalRegex = /<Title>(.*?)<\/Title>/s;
    const pubDateRegex = /<PubDate>.*?<Year>(.*?)<\/Year>/s;
    const doiRegex = /<ArticleId IdType="doi">(.*?)<\/ArticleId>/s;

    let match;
    while ((match = articleRegex.exec(xml)) !== null && articles.length < 8) {
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
      
      // Extract abstract text with better handling
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
        // Store formatted article text
        articles.push(`
**PMID: ${pmid}** | **Year: ${year}**
**Title:** ${title}
**Journal:** ${journal}
**Authors:** ${authors.slice(0, 3).join(', ')}${authors.length > 3 ? ' et al.' : ''}
**Abstract:** ${abstractText.trim()}
**DOI:** ${doi}
**PubMed Link:** https://pubmed.ncbi.nlm.nih.gov/${pmid}/
---`);

        // Store citation metadata
        citations.push({
          pmid,
          title,
          journal,
          year,
          authors: authors.slice(0, 3),
          doi,
          pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
          abstractText: abstractText.trim()
        });
      }
    }
  } catch (error) {
    console.error('Error parsing XML:', error);
  }
  
  return {
    abstracts: articles.join('\n\n'),
    citations
  };
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
    'survival', 'efficacy', 'RCT', 'randomized', 'clinical trial', 'meta-analysis', 
    'study', 'research', 'literature', 'evidence', 'comparison', 'versus', 'vs',
    'pembrolizumab', 'nivolumab', 'immunotherapy', 'chemotherapy', 'treatment',
    'NSCLC', 'cancer', 'oncology', 'prognosis', 'outcome', 'metformin', 'semaglutide',
    'HbA1c', 'diabetes', 'breast cancer', 'triple negative', 'mortality', 'morbidity',
    'guidelines', 'recommendations', 'protocol', 'therapy', 'intervention'
  ];
  
  const queryLower = query.toLowerCase();
  return researchKeywords.some(keyword => queryLower.includes(keyword.toLowerCase()));
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
    
    if (shouldUsePubMed(message)) {
      console.log('Research query detected, initiating enhanced RAG with PubMed...');
      
      const pmids = await searchPubMed(message, 8);
      if (pmids.length > 0) {
        const {abstracts, citations: fetchedCitations} = await fetchAbstracts(pmids);
        pubmedAbstracts = abstracts;
        citations = fetchedCitations;
        console.log(`RAG: Retrieved ${citations.length} citations for enhanced processing`);
      } else {
        console.log('RAG: No PubMed articles found, proceeding with general medical knowledge');
      }
    }

    // Enhanced system prompt for clinical-grade RAG processing
    const systemPrompt = `You are DoxyAI, an advanced clinical AI assistant with access to real-time biomedical literature and statistical capabilities. You provide evidence-based medical information with the highest clinical standards.

RESPONSE FORMAT REQUIREMENTS:
Structure your response using this exact clinical template:

## 🔬 Clinical Assessment
Brief clinical overview and context

## 📊 Key Research Findings
${pubmedAbstracts ? '- Evidence from recent literature (cite PMIDs)' : '- General medical knowledge and guidelines'}
- Comparative data when available
- Statistical significance and effect sizes

## 💊 Clinical Recommendations  
- Evidence-based treatment approaches
- Risk-benefit considerations
- Patient selection criteria

## 📈 Statistical Analysis
${calculationResult ? calculationResult : '- Relevant clinical metrics and calculations'}

## 🔗 References & Citations
${citations.length > 0 ? '- PubMed sources with PMIDs' : '- Clinical guidelines and standard references'}

## ⚠️ Clinical Disclaimer
This information is for healthcare professionals. Always consult current guidelines and consider individual patient factors.

${pubmedAbstracts ? `
**LATEST RESEARCH CONTEXT (RAG):**
${pubmedAbstracts}

**CRITICAL RAG INSTRUCTIONS:**
- Use the above PubMed literature as your PRIMARY evidence source
- Reference specific PMIDs when citing findings (e.g., "PMID: 12345678 showed...")
- Focus on comparative data: survival rates, hazard ratios, response rates, adverse events
- Highlight trial names, endpoints, and statistical significance
- Provide specific numerical data from the studies
- Compare different treatments when multiple studies are available
- Use the exact data from the abstracts, don't approximate

` : ''}

${calculationResult ? `
**STATISTICAL CALCULATION PERFORMED:**
${calculationResult}
Integrate this calculation result into your clinical assessment.
` : ''}

IMPORTANT: Format your response with proper markdown (**, *, -, ##) for readability. Use clinical terminology appropriately while remaining accessible.`;

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
        searchStrategy: pubmedAbstracts ? 'PubMed RAG' : 'General Medical Knowledge'
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
