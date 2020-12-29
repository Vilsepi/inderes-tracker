import axios, { AxiosInstance } from 'axios';
import { Analysis, Analyses, CompanyReport, CompanyMapping } from './inderesTypes';

export class InderesClient {
  private readonly client: AxiosInstance;

  public constructor () {
    this.client = axios.create({
      baseURL: 'https://www.inderes.fi/fi',
      timeout: 10000
    });
  }

  // Returns a list of latest recommendations for each company
  public getAnalyses = async () : Promise<Analysis[]> => {
    const response = (await this.client.get<Analyses>('/rest/inderes_numbers_recommendations.json')).data;
    return Object.values(response);
  }

  // Returns a list of mappings which map together different IDs of each company
  public getCompanyMappings = async () : Promise<CompanyMapping[]> => {
    return (await this.client.get<CompanyMapping[]>('/api/company-mapping')).data;
  }

  // Returns the latest company report for a given company
  public getLatestCompanyReport = async (company_id: string) : Promise<CompanyReport> => {
    return (await this.client.get<CompanyReport>(`/api/latest-company-report/${company_id}`)).data;
  }

}
