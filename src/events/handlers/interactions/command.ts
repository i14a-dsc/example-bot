import type { ChatInputCommandInteraction } from 'discord.js';
import { client } from '../../..';

export async function commandHandler(interaction: ChatInputCommandInteraction) {
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return client.config.development ? console.error('Command not found') : void 0;
  }
  try {
    await command.run(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      flags: 64,
    });
  }
}
