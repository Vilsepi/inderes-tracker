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

export const getDifferenceBetweenDates = (date_of_recommendation: string, now: Date): number => {
  const dateParts = date_of_recommendation.split('.');
  const analysisDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
  const differenceInDays = Math.abs((now.getTime() - analysisDate.getTime()) / 1000 / 3600 / 24);
  return Math.round(differenceInDays);
}

export const getAnalysisWithReportInfo = async (client: InderesClient, analysis: Analysis, companyMappings: CompanyMapping[]): Promise<EnrichedAnalysis> => {
  const mapping = companyMappings.find(c => c.isin === analysis.isin);
  if (mapping) {
    const companyReport = await client.getLatestCompanyReport(mapping.tid);
    const enrichedAnalysis: EnrichedAnalysis = {...analysis, ...companyReport};
    return enrichedAnalysis;
  }
  throw `Could not find ${analysis.name} from mapping`;
}
