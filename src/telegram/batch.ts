import { TelegramClient } from "./telegram";
import { SortableMessage } from "./telegramTypes";

const PAYLOAD_MAX_SIZE = 4000;

// Send a list of messages to telegram as few Telegram messages as possible. Telegram has a limit of 4096 characters per message.
export const sendMessagesInBatches = async (client: TelegramClient, messages: SortableMessage[], dryrun: boolean): Promise<void> => {
  while (messages.length) {
    let payload = '';
    while (messages.length && (payload.length + messages[0].message.length) < PAYLOAD_MAX_SIZE) {
      payload += messages[0].message + '\n';
      messages.shift();
    }
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
