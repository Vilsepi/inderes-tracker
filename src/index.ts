import { InderesClient } from './inderes/inderes';
import { Recommendation } from './inderes/inderesTypes';

export const mainApp = async (): Promise<void> => {
  const baseURL = "https://www.inderes.fi/fi";
  const inderesClient: InderesClient = new InderesClient(baseURL);

  console.log('Fetching analyses...');
  const analyses = await inderesClient.getAnalyses();

  for (const c of analyses) {
    if (c.recommendation == Recommendation.Buy) {
      console.log(`${c.recommendation} ${c.risk_level} ${c.target_price.padStart(5)} ${c.currency} ${c.name.padEnd(25)} ${c.date_of_recommendation.padStart(10)}`);
    }
  }

};

mainApp();
