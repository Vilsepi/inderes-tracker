import axios, { AxiosInstance, AxiosResponse } from 'axios';

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

  public sendMessage = async (text: string): Promise<any> => {
    return (await this.client.post<AxiosResponse>(`/bot${this.authToken}/sendMessage`, {
      chat_id: this.chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })).data;
  }
}