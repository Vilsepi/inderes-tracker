import axios, { AxiosInstance } from 'axios';
import { PriceQuote } from './millistreamTypes';

const EXPECTED_MARKETPLACES = [
  35235, // Finland
  35182, // First North Finland
  35181  // First North GM Sweden
];

export class MillistreamClient {
  private readonly client: AxiosInstance;

  public constructor () {
    this.client = axios.create({
      baseURL: 'https://chart.millistream.com/html5/millistream/',
      timeout: 10000
    });
  }

  // Get primary quote by ISIN
  public getQuoteByISIN = async (isin: string) : Promise<PriceQuote> => {
    const queryParams = {
      q: `cmd=quote&fields=name,isin,symbol,tradecurrency,marketplace,time,date,lastprice,insref&isin=${isin}`
    };
    const quotes = (await this.client.get<PriceQuote[]>('dataservice.php', {params: queryParams})).data;
    if (!EXPECTED_MARKETPLACES.includes(quotes[0].marketplace)) {
      console.warn("Warning: Unexpected marketplace as first one: " + JSON.stringify(quotes));
    }
    return quotes[0];
  }

}
