import axios, { AxiosInstance } from 'axios';
import { Analysis, Analyses, CompanyChartDetails, CompanyReport, CompanyMapping, InderesPriceQuote } from './inderesTypes';

export class InderesClient {
  private readonly client: AxiosInstance;
  private readonly chartClient: AxiosInstance;

  public constructor () {
    this.client = axios.create({
      baseURL: 'https://www.inderes.fi/fi',
      timeout: 10000
    });

    this.chartClient = axios.create({
      baseURL: 'https://europe-west1-inderes-widgets-prod.cloudfunctions.net',
      timeout: 10000,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://www.inderes.fi',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0'
      }
    });
  }

  // Returns a list of latest recommendations for each tracked company
  public getLatestRecommendations = async () : Promise<Analysis[]> => {
    const response = (await this.client.get<Analyses>('/rest/inderes_numbers_recommendations.json')).data;
    return Object.values(response);
  }

  // Returns a list of mappings which map together different IDs of each company
  public getCompanyMappings = async () : Promise<CompanyMapping[]> => {
    return (await this.client.get<CompanyMapping[]>('/api/company-mapping')).data;
  }

  public getCompanyDetails = async (company_insref: string) : Promise<CompanyChartDetails> => {
    const response = (await this.chartClient.get<CompanyChartDetails>(`/widgetProps/StockChart?getFullHistory=false&disableChartAnimations=true&chartHeight=275&insref=${company_insref}&hexcolor=#0078ff&showRecommendationHistory=true`)).data;
    console.log(JSON.stringify(response));
    return response;
  }

  // Returns the latest company report for a given company
  public getLatestCompanyReport = async (company_id: string) : Promise<CompanyReport> => {
    return (await this.client.get<CompanyReport>(`/api/latest-company-report/${company_id}`)).data;
  }

  // Return price data from website
  public getPriceFromWebpage = async (company_slug: string) : Promise<InderesPriceQuote> => {
    const html = (await this.client.get<string>(`/fi/yhtiot/${company_slug}`)).data;
    const regex = /"millistream_live":({[^}]*})/;
    const match = html.match(regex);
    if (match) {
      const price_data = JSON.parse(match[1]);
      return price_data;
    }
    console.error(html);
    throw "Could not find price from inderes web page";
  }

}
