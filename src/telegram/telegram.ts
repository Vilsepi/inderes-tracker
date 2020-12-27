import axios, { AxiosInstance } from 'axios';

export class TelegramClient {
  private readonly client: AxiosInstance;
  private readonly authToken: string;
  private readonly chatId: string;

  public constructor () {
    this.authToken = process.env.TELEGRAM_BOT_AUTH_TOKEN as string;
    this.chatId = process.env.TELEGRAM_CHAT_ID as string;
    this.client = axios.create({
      baseURL: 'https://api.telegram.org',
      timeout: 10000
    });
  }

  private apiCall = async (methodName: string, requestBody: any): Promise<any> => {
    return (await this.client.post<any>(`/bot${this.authToken}/${methodName}`, requestBody)).data;
  }

  public sendMessage = async (text: string): Promise<any> => {
    return await this.apiCall('sendMessage', {
      chat_id: this.chatId,
      text: text
    });
  }
}
