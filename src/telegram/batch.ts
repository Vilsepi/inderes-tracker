import { TelegramClient } from "./telegram";

const PAYLOAD_MAX_SIZE = 4000;

export const sendMessagesInBatches = async (client: TelegramClient, messages: string[]): Promise<void> => {
  console.log('Sending message(s)');
  while (messages.length) {
    let payload = '';
    while (messages.length && (payload.length + messages[0].length) < PAYLOAD_MAX_SIZE) {
      payload += messages.shift() + '\n';
    }
    try {
      const response = await client.sendMessage(payload);
      console.log(JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  }
}
