import { type Message } from 'discord.js';
import { client } from '../..';
import { messageCommandHandler } from './interactions/messageCommands';

export async function messageCreate(message: Message) {
  if (message.author.bot || !message.inGuild()) {
    return;
  }

  try {
    if (message.content.startsWith(client.config.prefix) && message.channel.isSendable()) {
      return messageCommandHandler(message);
    }
  } catch (e: any) {
    console.error('Error in prefix command handler:', e);
    return;
  }
}
