import type { AutocompleteInteraction } from 'discord.js';
import { client } from '../../..';

export async function autoCompleteHandler(interaction: AutocompleteInteraction) {
  const complete = client.completes.get(interaction.commandName);
  if (!complete) {
    return client.config.development ? console.error('Autocomplete not found') : void 0;
  }
  try {
    await complete(interaction);
  } catch (error) {
    console.error(error);
  }
}
