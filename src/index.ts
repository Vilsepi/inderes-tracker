import { InderesClient } from './inderes/inderes';
import { Analysis } from './inderes/inderesTypes';
import { sendMessagesInBatches } from './telegram/batch';
import { renderMessage } from './telegram/render';
import { TelegramClient } from './telegram/telegram';

const MAX_AGE_OF_ANALYSIS_IN_DAYS = 4;

const lessThanDaysOld = (analysis: Analysis, days: number): boolean => {
  const now = new Date();
  const parts = analysis.date_of_recommendation.split('.');
  const analysisDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  const differenceInDays = Math.abs((now.getTime() - analysisDate.getTime()) / 1000 / 3600 / 24);
  if (differenceInDays < days) {
    return true;
  }
  return false;
}

export const mainApp = async (): Promise<void> => {
  const inderesClient: InderesClient = new InderesClient();
  const telegramClient: TelegramClient = new TelegramClient();

  console.log('Fetching analyses...');
  const analyses = await inderesClient.getAnalyses();
  const freshAnalyses = analyses.filter(analysis => lessThanDaysOld(analysis, MAX_AGE_OF_ANALYSIS_IN_DAYS));

  const messages: string[] = [];
  for (const analysis of freshAnalyses) {
    messages.push(renderMessage(analysis));
  }

  await sendMessagesInBatches(telegramClient, messages);
};

exports.handler = async (event: never) => {
  console.log(JSON.stringify(event));
  await mainApp();
    return {
      statusCode: 200,
      body: "OK"
    };
};
