import { TelegramClient } from "./telegram";

const PAYLOAD_MAX_SIZE = 4000;

export const sendMessagesInBatches = async (client: TelegramClient, messages: string[], dryrun: boolean): Promise<void> => {
  while (messages.length) {
    let payload = '';
    while (messages.length && (payload.length + messages[0].length) < PAYLOAD_MAX_SIZE) {
      payload += messages.shift() + '\n';
    }
    payload += 'Inderes.fi';
    try {
      if (!dryrun) {
        console.log('Sending message(s)');
        await client.sendMessage(payload);
      }
      else {
        console.log('Dryrun message: \n' + payload);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
