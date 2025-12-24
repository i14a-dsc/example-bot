import type { ButtonInteraction } from 'discord.js';
import { client } from '../../..';
import { mappings } from './buttonMappings';

export async function buttonHandler(interaction: ButtonInteraction) {
  let button = client.buttons.get(interaction.customId);
  const customId = interaction.customId;

  if (!button) {
    let action = mappings[customId];

    if (!action) {
      for (const key in mappings) {
        if ((key.endsWith('_') && customId.startsWith(key)) || (key.endsWith('-') && customId.startsWith(key))) {
          action = mappings[key];
          break;
        }
      }
    }
    if (action) {
      button = client.buttons.get(action);
    }
  }

  if (!button) {
    return client.config.development ? console.error('Button not found: ', customId) : void 0;
  }

  try {
    await button(interaction);
  } catch (error) {
    console.error('Error while executing button: ', customId, '\n', error);
    if (!interaction.replied) {
      await interaction
        .reply({
          content: 'There was an error while executing ' + customId + '!',
          flags: 64,
        })
        .catch();
    }
  }
}
