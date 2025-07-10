import { MessageFlags, type Message } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

export async function messageCommandHandler(message: Message) {
  const [commandName, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/);
  if (!commandName) {
    return;
  }
  const command = client.messageCommands.get(commandName);
  if (!command) {
    return;
  }
  try {
    await command(message, args);
  } catch (error: any) {
    console.error(error);
    await message.reply({ flags: MessageFlags.IsComponentsV2, components: errorComponent(error.message) });
  }
}
