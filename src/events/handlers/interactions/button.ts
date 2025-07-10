import type { ButtonInteraction } from 'discord.js';
import { client } from '../../..';

export async function buttonHandler(interaction: ButtonInteraction) {
  let button = client.buttons.get(interaction.customId);

  if (!button) {
    const customId = interaction.customId;
    let action: string | undefined;

    if (customId.startsWith('example_')) {
      action = 'example_relarive';
    }

    if (action) {
      button = client.buttons.get(action);
    }
  }

  if (!button) {
    return client.config.development ? console.error('Button not found') : void 0;
  }

  try {
    await button(interaction);
  } catch (error) {
    console.error(error);
  }
}
