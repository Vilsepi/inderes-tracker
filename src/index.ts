import { InderesClient } from './inderes/inderes';
import { isFreshEnough } from './inderes/utils';
import { sendMessagesInBatches } from './telegram/batch';
import { renderMessage } from './telegram/render';
import { TelegramClient } from './telegram/telegram';

export const mainApp = async (dryrun: boolean): Promise<void> => {
  const inderesClient: InderesClient = new InderesClient();
  const telegramClient: TelegramClient = new TelegramClient();

  console.log('Fetching analyses...');
  const analyses = await inderesClient.getAnalyses();
  console.log(JSON.stringify(analyses));
  const now = new Date();
  const freshAnalyses = analyses.filter(analysis => isFreshEnough(analysis, now));

  const messages: string[] = [];
  for (const analysis of freshAnalyses) {
    messages.push(renderMessage(analysis));
  }
  await sendMessagesInBatches(telegramClient, messages, dryrun);
};

export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  console.log(JSON.stringify(event));
  const dryrunMessageSending = event.source == 'local-dryrun' ? true : false;
  await mainApp(dryrunMessageSending);
    return {
      statusCode: 200,
      body: "OK"
    };
};

if (require.main == module) {
  void handler({source: 'local-dryrun'});
}

export interface LambdaEvent {
  source: string
}

export interface LambdaResponse {
  statusCode: number,
  body: string
}
