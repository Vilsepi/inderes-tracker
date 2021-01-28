import { InderesClient } from "./inderes";
import { Analysis, CompanyMapping, EnrichedAnalysis } from "./inderesTypes";

const MAX_AGE_OF_ANALYSIS_IN_DAYS = 4; // 4 is needed to cover analysis from Friday to market day on Monday

// Returns true if given analysis is considered new enough to be noteworthy.
export const isFreshEnough = (analysis: Analysis, now: Date): boolean => {
  if (getDifferenceBetweenDates(analysis.date_of_recommendation, now) < MAX_AGE_OF_ANALYSIS_IN_DAYS) {
    return true;
  }
  return false;
}

// Returns difference of two dates: the date received from Inderes as dd.mm.yyyy, and given now date
export const getDifferenceBetweenDates = (date_of_recommendation: string, now: Date): number => {
  const dateParts = date_of_recommendation.split('.');
  const analysisDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
  const differenceInDays = Math.abs((now.getTime() - analysisDate.getTime()) / 1000 / 3600 / 24);
  return Math.round(differenceInDays);
}

// Returns given analysis with added info on latest company report
export const getAnalysisWithReportInfo = async (client: InderesClient, analysis: Analysis, companyMappings: CompanyMapping[]): Promise<EnrichedAnalysis> => {
  const mapping = companyMappings.find(c => c.isin === analysis.isin);
  if (mapping) {
    const companyReport = await client.getLatestCompanyReport(mapping.tid);
    const enrichedAnalysis: EnrichedAnalysis = {...analysis, ...companyReport};
    return enrichedAnalysis;
  }
  throw `Could not find ${analysis.name} from mapping`;
}

// Guess company page slug from the company name as it is not provided by the API
export const guessSlugFromName = (name: string): string => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/ - /g,'-')
    .replace(/ /g,'-')
    .replace(/å/g,'a')
    .replace(/ä/g,'a')
    .replace(/ö/g,'o')
    .replace(/[^\w-]+/g,'');
  return slug;
}

// Guess company page URL from the company name as it is not provided by the API
export const guessLinkFromName = (name: string): string => {
  const slug = guessSlugFromName(name);
  return `https://www.inderes.fi/fi/yhtiot/${slug}`;
}
