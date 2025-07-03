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
async function searchPubMed(query: string, maxResults: number = 8): Promise<string[]> {
  try {
    console.log(`Starting enhanced PubMed search for: ${query}`);
    
    // Build comprehensive search query with better medical term mapping
    const searchQuery = buildEnhancedPubMedQuery(query);
    console.log(`Enhanced PubMed query: ${searchQuery}`);
    
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
    
    if (!searchResponse.ok) {
      console.error(`PubMed search API error: ${searchResponse.status}`);
      return [];
    }
    
    const searchData = await searchResponse.json();
    const pmids = searchData.esearchresult?.idlist || [];
    console.log(`Enhanced PubMed search returned ${pmids.length} PMIDs:`, pmids.slice(0, 5));
    
    if (pmids.length === 0) {
      // Try a simpler, broader search
      const broaderQuery = buildSimplifiedQuery(query);
      console.log(`Trying simplified query: ${broaderQuery}`);
      
      const broaderParams = new URLSearchParams({
        db: 'pubmed',
        term: broaderQuery,
        retmode: 'json',
        retmax: maxResults.toString(),
        sort: 'relevance',
        datetype: 'pdat',
        reldate: '3650', // Last 10 years for broader search
      });

      const broaderResponse = await fetch(`${PUBMED_ESEARCH_URL}?${broaderParams}`);
      
      if (broaderResponse.ok) {
        const broaderData = await broaderResponse.json();
        const broaderPmids = broaderData.esearchresult?.idlist || [];
        console.log(`Simplified search returned ${broaderPmids.length} PMIDs`);
        return broaderPmids.slice(0, maxResults);
      }
    }
    
    return pmids.slice(0, maxResults);
  } catch (error) {
    console.error('Error in enhanced PubMed search:', error);
    return [];
  }
}

// Build enhanced PubMed query with comprehensive medical term mapping
function buildEnhancedPubMedQuery(query: string): string {
  const queryLower = query.toLowerCase();
  
  // Comprehensive medical term mapping with MeSH terms
  const medicalTermMap = {
    'metformin': '(metformin[tw] OR metformin[mesh] OR glucophage[tw] OR dimethylbiguanide[tw])',
    'semaglutide': '(semaglutide[tw] OR ozempic[tw] OR wegovy[tw] OR rybelsus[tw] OR "glp-1 receptor agonist"[mesh])',
    'hba1c': '("hemoglobin a, glycosylated"[mesh] OR hba1c[tw] OR "hemoglobin a1c"[tw] OR "glycated hemoglobin"[tw] OR "glycosylated hemoglobin"[tw])',
    'diabetes': '("diabetes mellitus, type 2"[mesh] OR "type 2 diabetes"[tw] OR t2dm[tw] OR "diabetes mellitus"[mesh])',
    'pembrolizumab': '(pembrolizumab[tw] OR keytruda[tw] OR "mk-3475"[tw] OR "anti-pd-1"[mesh])',
    'nivolumab': '(nivolumab[tw] OR opdivo[tw] OR "bms-936558"[tw] OR "anti-pd-1"[mesh])',
    'nsclc': '("carcinoma, non-small-cell lung"[mesh] OR "non-small cell lung cancer"[tw] OR nsclc[tw] OR "lung neoplasms"[mesh])',
    'survival': '("survival rate"[mesh] OR "overall survival"[tw] OR "progression-free survival"[tw] OR mortality[mesh] OR "disease-free survival"[tw])',
    'breast cancer': '("breast neoplasms"[mesh] OR "breast cancer"[tw] OR "mammary carcinoma"[tw])',
    'triple negative': '("triple negative breast neoplasms"[mesh] OR "triple negative"[tw] OR tnbc[tw] OR "triple-negative breast cancer"[tw])',
    'immunotherapy': '("immunotherapy"[mesh] OR "cancer immunotherapy"[tw] OR "immune checkpoint inhibitor"[tw])',
    'chemotherapy': '("antineoplastic agents"[mesh] OR chemotherapy[tw] OR "drug therapy"[mesh])',
    'efficacy': '("treatment outcome"[mesh] OR efficacy[tw] OR effectiveness[tw] OR "therapeutic efficacy"[tw])',
    'safety': '("drug safety"[mesh] OR "adverse effects"[mesh] OR safety[tw] OR "side effects"[tw])'
  };
  
  let enhancedQuery = query;
  
  // Replace terms with enhanced MeSH and keyword versions
  Object.entries(medicalTermMap).forEach(([term, replacement]) => {
    if (queryLower.includes(term)) {
      const regex = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      enhancedQuery = enhancedQuery.replace(regex, replacement);
    }
  });
  
  // Add study type filters based on query intent
  if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('versus')) {
    enhancedQuery += ' AND ("randomized controlled trial"[pt] OR "controlled clinical trial"[pt] OR "comparative study"[pt] OR "meta-analysis"[pt] OR "systematic review"[pt])';
  } else if (queryLower.includes('survival') || queryLower.includes('rate') || queryLower.includes('outcome') || queryLower.includes('prognosis')) {
    enhancedQuery += ' AND ("clinical trial"[pt] OR "cohort studies"[mesh] OR "follow-up studies"[mesh] OR "prognosis"[mesh] OR "meta-analysis"[pt])';
  } else if (queryLower.includes('treatment') || queryLower.includes('therapy') || queryLower.includes('drug')) {
    enhancedQuery += ' AND ("randomized controlled trial"[pt] OR "clinical trial"[pt] OR "meta-analysis"[pt] OR "drug therapy"[mesh])';
  } else {
    // Default to high-quality evidence
    enhancedQuery += ' AND ("randomized controlled trial"[pt] OR "meta-analysis"[pt] OR "systematic review"[pt] OR "clinical trial"[pt])';
  }
  
  // Always filter for human studies and English language
  enhancedQuery += ' AND humans[mesh] AND english[lang]';
  
  return enhancedQuery;
}

// Build simplified query for fallback searches
function buildSimplifiedQuery(query: string): string {
  const keywords = extractMedicalKeywords(query);
  const keywordQuery = keywords.slice(0, 4).map(kw => `${kw}[tw]`).join(' AND ');
  return `${keywordQuery} AND ("clinical trial"[pt] OR "meta-analysis"[pt]) AND humans[mesh] AND english[lang]`;
}

// Extract medical keywords from query
function extractMedicalKeywords(query: string): string[] {
  const commonMedicalTerms = [
    'metformin', 'semaglutide', 'hba1c', 'diabetes', 'pembrolizumab', 'nivolumab', 
    'nsclc', 'survival', 'breast cancer', 'triple negative', 'treatment', 'therapy',
    'efficacy', 'safety', 'trial', 'study', 'cancer', 'oncology', 'immunotherapy',
    'chemotherapy', 'radiation', 'surgery', 'prognosis', 'outcome', 'mortality',
    'randomized', 'controlled', 'clinical', 'meta-analysis', 'systematic', 'review',
    'comparison', 'versus', 'effectiveness', 'adverse', 'toxicity', 'response'
  ];
  
  return commonMedicalTerms.filter(term => 
    query.toLowerCase().includes(term.toLowerCase())
  );
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
  const extractText = (regex: RegExp, xml: string) => {
    const match = regex.exec(xml);
    return match ? match[1].replace(/<[^>]*>/g, '').trim() : '';
  };
  
  const extractMultiple = (regex: RegExp, xml: string) => {
    const matches = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
      matches.push(match[1].replace(/<[^>]*>/g, '').trim());
    }
    return matches;
  };
  
  const title = extractText(/<ArticleTitle>(.*?)<\/ArticleTitle>/s, articleXml);
  const pmid = extractText(/<PMID[^>]*>(.*?)<\/PMID>/s, articleXml);
  const journal = extractText(/<Title>(.*?)<\/Title>/s, articleXml);
  const year = extractText(/<PubDate>.*?<Year>(.*?)<\/Year>/s, articleXml) || 
               extractText(/<PubDate>.*?<MedlineDate>(\d{4})/s, articleXml);
  const doi = extractText(/<ArticleId IdType="doi">(.*?)<\/ArticleId>/s, articleXml);
  
  // Extract structured abstract with better handling
  let abstractText = '';
  const structuredAbstracts = extractMultiple(/<AbstractText[^>]*(?:Label="([^"]*)")?[^>]*>(.*?)<\/AbstractText>/gs, articleXml);
  
  if (structuredAbstracts.length > 0) {
    // For structured abstracts, join all sections
    const abstractRegex = /<AbstractText[^>]*(?:Label="([^"]*)")?[^>]*>(.*?)<\/AbstractText>/gs;
    let abstractMatch;
    while ((abstractMatch = abstractRegex.exec(articleXml)) !== null) {
      const label = abstractMatch[1] ? `${abstractMatch[1]}: ` : '';
      const content = abstractMatch[2].replace(/<[^>]*>/g, '').trim();
      if (content) {
        abstractText += label + content + ' ';
      }
    }
  } else {
    // Try to get simple abstract
    abstractText = extractText(/<Abstract>(.*?)<\/Abstract>/s, articleXml);
  }
  
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
  const publicationTypes = extractMultiple(/<PublicationType[^>]*>(.*?)<\/PublicationType>/gs, articleXml);
  
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
**DOI:** ${article.doi || 'Not available'}
**PubMed:** https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`;
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
    'guidelines', 'recommendations', 'protocol', 'intervention', 'statistics',
    'rate', 'incidence', 'prevalence', 'risk', 'benefit', 'analysis'
  ];
  
  const queryLower = query.toLowerCase();
  const keywordMatches = researchKeywords.filter(keyword => queryLower.includes(keyword));
  console.log(`Research query check: Found ${keywordMatches.length} keywords:`, keywordMatches.slice(0, 3));
  
  return keywordMatches.length > 0;
}

// Enhanced query type detection with better specificity
function detectQueryType(query: string): 'identity' | 'clinical' | 'general' {
  const queryLower = query.toLowerCase();
  
  // Identity questions - be more specific to avoid false positives
  const identityKeywords = [
    'who made you', 'who created you', 'who is your creator', 'who built you',
    'who are you', 'what are you', 'about you', 'your creator', 'your maker',
    'rajan kumar karn', 'about docmatex', 'what is docmatex', 'docmatex features',
    'what can you do', 'your capabilities', 'your purpose', 'tell me about yourself'
  ];
  
  // Check for exact identity matches first
  if (identityKeywords.some(keyword => queryLower.includes(keyword))) {
    return 'identity';
  }
  
  // Clinical/medical keywords - extensive list for better detection
  const clinicalKeywords = [
    // Drug names
    'pembrolizumab', 'nivolumab', 'metformin', 'semaglutide', 'keytruda', 'opdivo',
    'immunotherapy', 'chemotherapy', 'targeted therapy', 'biologics',
    
    // Medical conditions
    'nsclc', 'lung cancer', 'breast cancer', 'diabetes', 'hypertension', 'cancer',
    'carcinoma', 'tumor', 'malignancy', 'neoplasm', 'oncology', 'cardiology',
    'triple negative', 'pd-l1', 'her2', 'egfr', 'alk', 'ros1',
    
    // Medical terms
    'efficacy', 'survival', 'mortality', 'prognosis', 'treatment', 'therapy',
    'clinical trial', 'randomized', 'rct', 'meta-analysis', 'systematic review',
    'hba1c', 'biomarker', 'progression', 'response rate', 'adverse events',
    'toxicity', 'dosing', 'protocol', 'guidelines', 'contraindication',
    
    // Comparative terms
    'compare', 'comparison', 'versus', 'vs', 'better', 'superior', 'inferior',
    'first-line', 'second-line', 'combination', 'monotherapy',
    
    // Clinical metrics
    'overall survival', 'progression-free survival', 'hazard ratio', 'confidence interval',
    'p-value', 'statistical significance', 'median', 'endpoint', 'primary', 'secondary',
    
    // Medical specialties
    'oncologist', 'cardiologist', 'endocrinologist', 'pulmonologist', 'radiologist',
    'pathologist', 'surgeon', 'physician', 'doctor', 'clinician'
  ];
  
  if (clinicalKeywords.some(keyword => queryLower.includes(keyword))) {
    return 'clinical';
  }
  
  return 'general';
}

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('DoxyAI Enhanced RAG function called');

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

    // Detect query type
    const queryType = detectQueryType(message);
    console.log('Query type detected:', queryType);

    // Handle identity questions with specific responses
    if (queryType === 'identity') {
      let response = '';
      const queryLower = message.toLowerCase();
      
      if (queryLower.includes('who made') || queryLower.includes('who created') || queryLower.includes('creator') || queryLower.includes('who is your creator')) {
        response = "I was created by **Rajan Kumar Karn**, the founder of DocMateX — India's first verified medical networking and research platform. He is a student at **IIT Patna**.";
      } else if (queryLower.includes('what is docmatex') || queryLower.includes('about docmatex') || queryLower.includes('docmatex')) {
        response = `**DocMateX** is India's first verified medical networking and research platform — built exclusively for healthcare professionals.

🩺 **What Does It Do?**
DocMateX is a secure ecosystem where:

👩‍⚕️ Verified doctors, medical students, researchers, nurses, pharmacists, radiologists, cardiologists, and even Ayurvedic & Homeopathy practitioners

Can connect, collaborate, and grow professionally.

🔍 **Key Features:**
✅ Verified user profiles
✅ Medical research uploads & publications
✅ Role-specific personalized feed
✅ Mentorship & job discovery tools
✅ Doxy AI – your 24x7 smart research assistant
✅ Secure in-app messaging
✅ Case study & CME content uploads
✅ Event & webinar listings
✅ Real-time support from the core team

💡 **What Makes It Unique?**
• Built by and for Indian healthcare professionals
• Founded by Rajan Kumar Karn, student of IIT Patna
• Includes integrated AI assistant (Doxy AI) with PubMed + Gemini + RAG support
• Respectfully empowers the medical community — not replaces it

🧠 **Vision:**
To create a trusted digital ecosystem that supports India's healthcare heroes with tools, mentorship, and verified knowledge.

🔗 **Tagline:**
"For those who care, heal, and lead." – Powered by DocMateX`;
      } else if (queryLower.includes('features of docmatex') || queryLower.includes('docmatex features')) {
        response = `**DocMateX Features:**

🔍 **Core Features:**
✅ Verified user profiles for all healthcare professionals
✅ Medical research uploads & publications
✅ Role-specific personalized feed
✅ Mentorship & job discovery tools
✅ **Doxy AI** – your 24x7 smart research assistant
✅ Secure in-app messaging
✅ Case study & CME content uploads
✅ Event & webinar listings
✅ Real-time support from the core team

💡 **What Makes It Special:**
• Built exclusively for Indian healthcare professionals
• Founded by Rajan Kumar Karn, student of IIT Patna
• Integrated AI assistant with PubMed + Gemini + RAG support
• Verified networking for doctors, students, researchers, nurses, pharmacists, and more
• Respectfully empowers the medical community

🧠 **Vision:** To create a trusted digital ecosystem that supports India's healthcare heroes.`;
      } else if (queryLower.includes('what can you do') || queryLower.includes('capabilities') || queryLower.includes('purpose') || queryLower.includes('your purpose')) {
        response = `**I'm DoxyAI** — your 24x7 smart research assistant! 🩺

**My Capabilities:**
• **Medical Research Support** with live PubMed integration
• **Clinical Insights & Analysis** for healthcare professionals
• **Case Study Analysis** and evidence-based recommendations
• **Medical Calculations** and statistical analysis
• **Career Guidance** and mentorship suggestions
• **Evidence-Based Medical Recommendations** with direct citations

**What Makes Me Special:**
• **Live PubMed RAG Pipeline** with real-time literature retrieval
• **Enhanced Statistical Engine** for medical calculations
• **Evidence-Based Responses** with direct PubMed citations
• Available 24x7 to support healthcare professionals

**My Goal:** To support the healthcare community — not replace doctors, but to assist them with knowledge, research, and tools in a verified and respectful space.

**Built for DocMateX** — India's first verified medical networking platform.`;
      } else if (queryLower.includes('who are you') || queryLower.includes('what are you') || queryLower.includes('about you')) {
        response = "I'm **DoxyAI**, created by **Rajan Kumar Karn** for the DocMateX platform. I'm here to assist healthcare professionals with research, clinical questions, and medical guidance using live PubMed integration and statistical analysis.";
      } else {
        response = "I'm **DoxyAI**, created by **Rajan Kumar Karn** for the DocMateX platform. I'm here to assist healthcare professionals with research, clinical questions, and medical guidance using live PubMed integration and statistical analysis.";
      }
      
      response += "\n\n**Powered by DocMateX — for those who care, heal, and lead.**";
      
      return new Response(
        JSON.stringify({ 
          response: response,
          pubmedIntegrated: false,
          articleCount: 0,
          citations: [],
          hasCalculation: false,
          calculationType: null,
          ragEnabled: false,
          searchStrategy: 'Identity Response'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For clinical and general queries, proceed with RAG pipeline
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

    // Create a specialized system prompt for clinical queries
    const systemPrompt = `You are DoxyAI — a smart, respectful, and research-driven medical assistant integrated into DocMateX, created by Rajan Kumar Karn.

Your role is to provide evidence-based medical responses to healthcare professionals' queries. You must directly address the specific medical query asked.

**CRITICAL INSTRUCTION:** Always provide a direct, specific answer to the exact medical question asked. Do not provide generic responses.

**RESPONSE FORMAT REQUIREMENTS:**
Structure your response using this clinical template:

## 🔬 Clinical Assessment
Brief clinical overview directly addressing the specific query

## 📊 Key Research Findings
${pubmedAbstracts ? '- Evidence from recent literature (cite specific PMIDs)' : '- General medical knowledge and established guidelines'}
- Comparative data when available
- Statistical significance and effect sizes
- Key trial names and endpoints

## 💊 Clinical Recommendations  
- Evidence-based treatment approaches specific to the query
- Risk-benefit considerations
- Patient selection criteria
- Dosing recommendations when applicable

## 📈 Statistical Analysis
${calculationResult ? calculationResult : '- Relevant clinical metrics and calculations when applicable'}

## 🔗 References & Citations
${citations.length > 0 ? '- PubMed sources with PMIDs and links' : '- Clinical guidelines and standard references'}

## ⚠️ Clinical Disclaimer
This information is for healthcare professionals. Always consult current guidelines and consider individual patient factors.

**Always end with:** **"Powered by DocMateX — for those who care, heal, and lead."**

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

**IMPORTANT GUIDELINES:**
- Directly answer the specific medical question asked
- Stay empathetic, clear, evidence-based, and respectful
- Avoid political, legal, or sensitive non-medical commentary
- Format response with proper markdown for readability
- Use clinical terminology appropriately while remaining accessible
- When citing studies, always include PMID numbers
- Provide specific numerical outcomes and confidence intervals when available
- Focus on the exact clinical scenario or comparison requested`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\n**Specific Medical Query:** ${message.trim()}` }
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
