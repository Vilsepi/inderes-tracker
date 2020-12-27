import axios, { AxiosInstance } from 'axios';
import { Analysis, Analyses } from './inderesTypes';

export class InderesClient {
  private readonly client: AxiosInstance;

  public constructor (baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000
    });
  }

  public getAnalyses = async () : Promise<Analysis[]> => {
    const response = (await this.client.get<Analyses>('/rest/inderes_numbers_recommendations.json')).data;
    return Object.values(response);
  }

}
