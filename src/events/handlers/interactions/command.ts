import { MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

export async function commandHandler(interaction: ChatInputCommandInteraction) {
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return client.config.development ? console.error('Command not found: ', interaction.commandName) : void 0;
  }
  try {
    await command.run(interaction);
  } catch (error) {
    console.error('Error while executing command: ', interaction.commandName, '\n', error);
    if (!interaction.replied) {
      await interaction
        .reply({
          flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
          components: errorComponent(
            'An error has occurred in executing ' + interaction.commandName + ': ' + (error as Error).message,
          ),
        })
        .catch();
    }
  }
}
