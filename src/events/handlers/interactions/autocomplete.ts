import type { AutocompleteInteraction } from 'discord.js';
import { client } from '../../..';

export async function autoCompleteHandler(interaction: AutocompleteInteraction) {
  const complete = client.completes.get(interaction.commandName);
  if (!complete) {
    return client.config.development ? console.error('Autocomplete not found:', interaction.commandName) : void 0;
  }
  try {
    await complete(interaction);
  } catch (error) {
    console.error('Error while executing complete: ', interaction.commandName, '\n', error);
    if (!interaction.responded) {
      await interaction.respond([
        { name: 'An error has occurred in executing your request. Please try again leter.', value: 1 },
      ]);
    }
  }
}
