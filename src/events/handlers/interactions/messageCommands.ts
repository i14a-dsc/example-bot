import { MessageFlags, type Message } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

export async function messageCommandHandler(message: Message) {
  const [commandName, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/);
  if (!commandName) {
    return client.config.development ? console.error('Message command not found: ', commandName) : void 0;
  }
  const command = client.messageCommands.get(commandName);
  if (!command) {
    return;
  }
  try {
    await command(message, args);
  } catch (error) {
    console.error('Error while executing command: ', commandName, '\n', error);
    await message
      .reply({
        flags: MessageFlags.IsComponentsV2,
        components: errorComponent('An error has occurred in executing your request'),
      })
      .catch();
  }
}
