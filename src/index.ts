import { InderesClient } from './inderes/inderes';
import { getAnalysisWithReportInfo, guessSlugFromName, isFreshEnough } from './inderes/utils';
import { sendMessagesInBatches } from './telegram/batch';
import { comparePotentials, renderMessage } from './telegram/render';
import { TelegramClient } from './telegram/telegram';
import { SortableMessage } from './telegram/telegramTypes';

export const mainApp = async (dryrun: boolean): Promise<void> => {
  const inderesClient: InderesClient = new InderesClient();
  const telegramClient: TelegramClient = new TelegramClient();

  console.log('Fetching analyses...');
  const analyses = await inderesClient.getAnalyses();
  const now = new Date();
  const freshAnalyses = analyses.filter(analysis => isFreshEnough(analysis, now));

  if (freshAnalyses.length) {
    const companyMappings = await inderesClient.getCompanyMappings();

    const messages: SortableMessage[] = [];
    for (const analysis of freshAnalyses) {
      let quote = null;
      try {
        quote = await inderesClient.getPriceFromWebpage(guessSlugFromName(analysis.name));
      } catch (error) {
        console.warn(`Failed to get latest price for stock ${analysis.name}`);
      }
      messages.push(renderMessage(await getAnalysisWithReportInfo(inderesClient, analysis, companyMappings), quote));
    }
    messages.sort(comparePotentials);
    await sendMessagesInBatches(telegramClient, messages, dryrun);
  }

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
