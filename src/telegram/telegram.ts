import axios, { AxiosInstance } from 'axios';
import { TelegramResponse } from './telegramTypes';

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

  // Get messages that the bot has received. Used manually to discover chat IDs.
  public getUpdates = async (): Promise<void> => {
    const response = (await this.client.post<TelegramResponse>(`/bot${this.authToken}/getUpdates`, {})).data;
    console.log(JSON.stringify(response));
  }

  // Send a message with optional HTML formatting to chat ID set by env var.
  public sendMessage = async (text: string): Promise<TelegramResponse> => {
    return (await this.client.post<TelegramResponse>(`/bot${this.authToken}/sendMessage`, {
      chat_id: this.chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })).data;
  }
}
