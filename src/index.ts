import { InderesClient } from './inderes/inderes';
import { isFreshEnough } from './inderes/utils';
import { sendMessagesInBatches } from './telegram/batch';
import { renderMessage } from './telegram/render';
import { TelegramClient } from './telegram/telegram';

export const mainApp = async (): Promise<void> => {
  const inderesClient: InderesClient = new InderesClient();
  const telegramClient: TelegramClient = new TelegramClient();

  console.log('Fetching analyses...');
  const analyses = await inderesClient.getAnalyses();
  const now = new Date();
  const freshAnalyses = analyses.filter(analysis => isFreshEnough(analysis, now));

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
