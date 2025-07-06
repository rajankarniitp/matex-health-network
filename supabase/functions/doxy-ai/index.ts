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

// Advanced meta-analysis functions
const metaAnalysisFunctions = {
  // Calculate pooled effect size using fixed effects model
  fixedEffectMeta: (studies: Array<{effectSize: number, variance: number, n: number}>) => {
    const weights = studies.map(s => 1 / s.variance);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const pooledEffect = studies.reduce((sum, s, i) => sum + (s.effectSize * weights[i]), 0) / totalWeight;
    const pooledVariance = 1 / totalWeight;
    const pooledSE = Math.sqrt(pooledVariance);
    const ci95Lower = pooledEffect - (1.96 * pooledSE);
    const ci95Upper = pooledEffect + (1.96 * pooledSE);
    
    return {
      pooledEffect,
      pooledSE,
      ci95: [ci95Lower, ci95Upper],
      totalN: studies.reduce((sum, s) => sum + s.n, 0)
    };
  },

  // Calculate I² heterogeneity statistic
  calculateI2: (studies: Array<{effectSize: number, variance: number}>) => {
    if (studies.length < 2) return 0;
    
    const weights = studies.map(s => 1 / s.variance);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const pooledEffect = studies.reduce((sum, s, i) => sum + (s.effectSize * weights[i]), 0) / totalWeight;
    
    const Q = studies.reduce((sum, s, i) => {
      return sum + weights[i] * Math.pow(s.effectSize - pooledEffect, 2);
    }, 0);
    
    const df = studies.length - 1;
    const I2 = Math.max(0, ((Q - df) / Q) * 100);
    
    return { I2, Q, df, pValue: 1 - cumChiSq(Q, df) };
  },

  // Calculate Number Needed to Treat (NNT)
  calculateNNT: (controlRate: number, treatmentRate: number) => {
    const ARR = Math.abs(controlRate - treatmentRate);
    return ARR > 0 ? Math.round(1 / ARR) : Infinity;
  },

  // Calculate Relative Risk Reduction (RRR)
  calculateRRR: (controlRate: number, treatmentRate: number) => {
    return controlRate > 0 ? ((controlRate - treatmentRate) / controlRate) * 100 : 0;
  }
};

// Chi-square cumulative distribution approximation
function cumChiSq(x: number, df: number): number {
  if (x <= 0) return 0;
  if (df === 1) return 2 * (1 - Math.exp(-x/2) * Math.sqrt(x/(2*Math.PI)));
  
  // Simple approximation for p-value
  const criticalValues = [3.84, 5.99, 7.81, 9.49, 11.07, 12.59, 14.07, 15.51];
  if (df <= 8) return x > criticalValues[df-1] ? 0.95 : 0.05;
  return x > (df + Math.sqrt(2*df)) ? 0.95 : 0.05;
}

// GRADE evidence assessment function
function assessGRADE(studies: Array<{type: string, riskOfBias: string, consistency: boolean, directness: boolean}>) {
  let grade = 'High'; // Start with high for RCTs
  let reasons = [];
  
  // Check study types
  const hasRCTs = studies.some(s => s.type.toLowerCase().includes('randomized'));
  if (!hasRCTs) {
    grade = 'Low';
    reasons.push('Observational studies');
  }
  
  // Risk of bias assessment
  const highRisk = studies.filter(s => s.riskOfBias === 'high').length;
  if (highRisk > studies.length / 2) {
    grade = grade === 'High' ? 'Moderate' : 'Low';
    reasons.push('High risk of bias');
  }
  
  // Inconsistency
  const inconsistent = studies.filter(s => !s.consistency).length;
  if (inconsistent > studies.length / 2) {
    grade = grade === 'High' ? 'Moderate' : (grade === 'Moderate' ? 'Low' : 'Very Low');
    reasons.push('Inconsistent results');
  }
  
  // Indirectness
  const indirect = studies.filter(s => !s.directness).length;
  if (indirect > studies.length / 2) {
    grade = grade === 'High' ? 'Moderate' : (grade === 'Moderate' ? 'Low' : 'Very Low');
    reasons.push('Indirectness of evidence');
  }
  
  return { grade, reasons };
}

// Indian market cost-effectiveness analysis
const healthEconomics = {
  // Indian generic drug prices (INR per month)
  drugPrices: {
    'metformin': { generic: 50, branded: 150, brand: 'Glycomet' },
    'semaglutide': { generic: 2800, branded: 4500, brand: 'Ozempic' },
    'empagliflozin': { generic: 800, branded: 2200, brand: 'Jardiance' },
    'teneligliptin': { generic: 180, branded: 350, brand: 'Teniva' },
    'saroglitazar': { generic: 220, branded: 450, brand: 'Lipaglyn' },
    'remogliflozin': { generic: 350, branded: 650, brand: 'Remo' },
    'glimepiride': { generic: 40, branded: 120, brand: 'Amaryl' },
    'pioglitazone': { generic: 80, branded: 200, brand: 'Pioz' }
  },

  // Calculate ICER (Incremental Cost-Effectiveness Ratio)
  calculateICER: (drug1: string, drug2: string, effectDiff: number, qualityYears: number = 1) => {
    const prices = healthEconomics.drugPrices;
    const cost1 = prices[drug1]?.generic || 0;
    const cost2 = prices[drug2]?.generic || 0;
    const costDiff = Math.abs(cost1 - cost2) * 12; // Annual cost difference
    
    if (effectDiff === 0) return { icer: 'Dominated', recommendation: 'Choose lower cost option' };
    
    const icer = costDiff / (effectDiff * qualityYears);
    const threshold = 150000; // WHO threshold for India (3x GDP per capita)
    
    return {
      icer: icer.toFixed(0),
      costEffective: icer < threshold,
      recommendation: icer < threshold ? 'Cost-effective' : 'Not cost-effective',
      annualCostDiff: costDiff
    };
  },

  // Suggest affordable alternatives
  getAffordableAlternatives: (condition: string, budget: number = 3000) => {
    const alternatives = {
      't2dm': [
        { drug: 'metformin', cost: 50, efficacy: 'Moderate HbA1c reduction (-0.9%)' },
        { drug: 'teneligliptin', cost: 180, efficacy: 'Good HbA1c reduction (-0.8%)' },
        { drug: 'glimepiride', cost: 40, efficacy: 'Good HbA1c reduction (-1.2%)' },
        { drug: 'pioglitazone', cost: 80, efficacy: 'Good HbA1c reduction (-0.9%)' }
      ],
      'dyslipidemia': [
        { drug: 'atorvastatin', cost: 60, efficacy: 'LDL reduction (-45%)' },
        { drug: 'saroglitazar', cost: 220, efficacy: 'TG reduction (-35%)' },
        { drug: 'fenofibrate', cost: 80, efficacy: 'TG reduction (-30%)' }
      ],
      'hypertension': [
        { drug: 'amlodipine', cost: 50, efficacy: 'BP reduction (-12/8 mmHg)' },
        { drug: 'telmisartan', cost: 120, efficacy: 'BP reduction (-10/6 mmHg)' },
        { drug: 'hydrochlorothiazide', cost: 30, efficacy: 'BP reduction (-8/5 mmHg)' }
      ]
    };

    const conditionDrugs = alternatives[condition] || [];
    return conditionDrugs.filter(alt => alt.cost <= budget);
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

// FIXED: More precise identity query detection
function detectQueryType(query: string): 'identity' | 'clinical' | 'general' {
  const queryLower = query.toLowerCase();
  
  // Very strict identity patterns - must be exact matches
  const exactIdentityPatterns = [
    /^who (made|created|built) you\??$/i,
    /^who is your (creator|maker)\??$/i,
    /^who are you\??$/i,
    /^what are you\??$/i,
    /^(tell me )?about you(rself)?\??$/i,
    /^what is docmatex\??$/i,
    /^about docmatex$/i,
    /^docmatex kya hai\??$/i,
    /^tumhe kisne banaya\??$/i,
    /^tum kaun ho\??$/i
  ];
  
  // Check for exact identity patterns first
  const hasExactIdentityMatch = exactIdentityPatterns.some(pattern => pattern.test(queryLower.trim()));
  
  if (hasExactIdentityMatch) {
    console.log('EXACT identity query detected:', query);
    return 'identity';
  }
  
  // If it contains medical terms, it's definitely clinical
  const medicalIndicators = [
    'metformin', 'semaglutide', 'hba1c', 'diabetes', 'compare', 'vs', 'versus',
    'treatment', 'therapy', 'drug', 'medication', 'clinical', 'trial', 'rct',
    'survival', 'efficacy', 'pembrolizumab', 'nivolumab', 'cancer', 'patient'
  ];
  
  const hasMedicalContent = medicalIndicators.some(term => queryLower.includes(term));
  
  if (hasMedicalContent) {
    console.log('Medical query detected:', query);
    return 'clinical';
  }
  
  console.log('General query detected:', query);
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
    console.log('Received query:', message);

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Detect query type with improved logic
    const queryType = detectQueryType(message);
    console.log('Query type detected:', queryType);

    // Handle identity questions with exact matching
    if (queryType === 'identity') {
      let response = '';
      const queryLower = message.toLowerCase().trim();
      
      if (queryLower.includes('who made') || queryLower.includes('who created') || queryLower.includes('creator') || queryLower.includes('tumhe kisne banaya')) {
        response = "I was created by **Rajan Kumar Karn**, the founder of DocMateX — India's first verified medical networking and research platform. He is a student at **IIT Patna**.";
      } else if (queryLower.includes('what is docmatex') || queryLower.includes('about docmatex') || queryLower.includes('docmatex') || queryLower.includes('docmatex kya hai')) {
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

    // For clinical queries, proceed with enhanced RAG pipeline
    console.log('Processing clinical query with RAG pipeline...');
    
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

    // Enhanced clinical research with Perplexity integration
    let enhancedResearch = '';
    if (PERPLEXITY_API_KEY && queryType === 'clinical') {
      enhancedResearch = await enhancedClinicalResearch(message);
      if (enhancedResearch) {
        console.log('Enhanced clinical research data retrieved');
      }
    }

    // Enhanced RAG: Always try PubMed for clinical queries
    let pubmedAbstracts = '';
    let citations: any[] = [];
    let ragStrategy = 'PubMed RAG Pipeline';
    
    console.log('Initiating PubMed RAG search...');
    
    const pmids = await searchPubMed(message, 10);
    if (pmids.length > 0) {
      console.log(`Found ${pmids.length} PMIDs, fetching abstracts...`);
      const {abstracts, citations: fetchedCitations} = await fetchAbstracts(pmids);
      pubmedAbstracts = abstracts;
      citations = fetchedCitations;
      console.log(`RAG Success: Retrieved ${citations.length} citations for processing`);
      ragStrategy = `PubMed RAG Pipeline - ${citations.length} Articles`;
    } else {
      console.log('RAG: No PubMed articles found, using general medical knowledge');
      ragStrategy = 'General Medical Knowledge (No PubMed Results)';
    }

    // Create enhanced system prompt for clinical queries
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

## 📈 Meta-Analysis Summary
Create an assumed variance meta-analysis table when multiple studies are available:
| Study | n | Effect Size | 95% CI | Weight | P-value |
|-------|---|-------------|--------|--------|---------|
| [Study 1] | [n] | [ES] | [CI] | [%] | [p] |
| Pooled | [total] | [pooled ES] | [pooled CI] | 100% | [p] |

## 🏆 GRADE Quality Assessment
Evaluate evidence quality using GRADE criteria:
- **High Quality**: Multiple RCTs, low risk of bias
- **Moderate Quality**: RCTs with some limitations
- **Low Quality**: Few RCTs or observational studies
- **Very Low Quality**: Limited evidence or high bias

## 💊 Clinical Recommendations  
- Evidence-based treatment approaches specific to the query
- Risk-benefit considerations
- Patient selection criteria
- Dosing recommendations when applicable

## 📈 Statistical Analysis
${calculationResult ? calculationResult : '- Relevant clinical metrics and calculations when applicable'}

## 💰 Health Economics (ICER Analysis)
When applicable, provide cost-effectiveness considerations:
- Incremental Cost-Effectiveness Ratio (ICER)
- Model assumptions and limitations
- Budget impact analysis
- Quality-Adjusted Life Years (QALYs) when available

${enhancedResearch ? `
## 🌐 Real-Time Clinical Research (Perplexity Enhanced)
${enhancedResearch}
` : ''}

## 🇮🇳 Indian Market Alternatives
Provide affordable generic alternatives for Indian healthcare:
- Generic drug options with similar efficacy
- Cost comparison with branded drugs
- Availability in Indian market
- Combination therapies when suitable
- Examples: Teneligliptin, Saroglitazar, Remogliflozin

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

    console.log(`Enhanced RAG response generated successfully with ${citations.length} citations`);

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        pubmedIntegrated: citations.length > 0,
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
