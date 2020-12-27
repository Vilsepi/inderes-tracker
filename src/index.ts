import { InderesClient } from './inderes/inderes';
import { Analysis, Recommendation } from './inderes/inderesTypes';
import { TelegramClient } from './telegram/telegram';

const PAYLOAD_MAX_SIZE = 4000;

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

const renderRecommendation = (recommendation: Recommendation): string => {
  if (recommendation == Recommendation.Buy) {
    return "Osta";
  }
  else if (recommendation == Recommendation.Accumulate) {
    return "Lisää";
  }
  else if (recommendation == Recommendation.Reduce) {
    return "Vähennä";
  }
  else if (recommendation == Recommendation.Sell) {
    return "Myy";
  }
  else {
    return "???";
  }
}

export const mainApp = async (): Promise<void> => {
  const inderesClient: InderesClient = new InderesClient();
  const telegramClient: TelegramClient = new TelegramClient();

  console.log('Fetching analyses...');
  const analyses = await inderesClient.getAnalyses();
  const freshAnalyses = analyses.filter(analysis => lessThanDaysOld(analysis, 7));

  const messages: string[] = [];
  for (const c of freshAnalyses) {
    const message = `${renderRecommendation(c.recommendation)} ${c.name} => ${c.target_price} ${c.currency}\nRiski: ${c.risk_level}/4 (${c.date_of_recommendation})\n`;
    messages.push(message);
  }

  console.log('Sending message(s)');
  while (messages.length) {
    let payload = '';
    while (messages.length && (payload.length + messages[0].length) < PAYLOAD_MAX_SIZE) {
      payload += messages.shift() + '\n';
    }
    try {
      const response = await telegramClient.sendMessage(payload);
      console.log(JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  }
};

exports.handler = async (event: any) => {
  console.log(event);
  await mainApp();
    return {
      statusCode: 200,
      body: "OK"
    };
};
