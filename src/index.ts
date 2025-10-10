import { InderesClient } from './inderes/inderes';
import { isFreshEnough } from './inderes/utils';
// import { getAnalysisWithReportInfo, guessSlugFromName, isFreshEnough } from './inderes/utils';
//import { sendMessagesInBatches } from './telegram/batch';
//import { comparePotentials, renderMessage } from './telegram/render';
//import { TelegramClient } from './telegram/telegram';
//import { SortableMessage } from './telegram/telegramTypes';

export const mainApp = async (dryrun: boolean): Promise<void> => {
  const inderesClient: InderesClient = new InderesClient();
  // const telegramClient: TelegramClient = new TelegramClient();

  inderesClient.getCompanyDetails('469');
  console.log("END OF TEST");

  console.log(dryrun);
  console.log('Fetching analyses...');
  const analyses = await inderesClient.getLatestRecommendations();
  console.log(JSON.stringify(analyses));
  const now = new Date();
  console.log('Checking freshness');
  const freshAnalyses = analyses.filter(analysis => isFreshEnough(analysis, now));

  if (freshAnalyses.length) {
    console.log('Got fresh recommendations');
    // const companyMappings = await inderesClient.getCompanyMappings();


    // const messages: SortableMessage[] = [];
    // for (const analysis of freshAnalyses) {
    //   let quote = null;
    //   try {
    //     quote = await inderesClient.getPriceFromWebpage(guessSlugFromName(analysis.name));
    //   } catch (error) {
    //     console.warn(`Failed to get latest price for stock ${analysis.name}`);
    //   }
    //   messages.push(renderMessage(await getAnalysisWithReportInfo(inderesClient, analysis, companyMappings), quote));
    // }
    // messages.sort(comparePotentials);
    // await sendMessagesInBatches(telegramClient, messages, dryrun);
  }
  console.log('All done.');
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
