import type { StringSelectMenuInteraction } from 'discord.js';
import { client } from '../../..';

export async function selectMenuHandler(interaction: StringSelectMenuInteraction) {
  const selectMenu = client.selectMenus.get(interaction.customId);
  if (!selectMenu) {
    return client.config.development ? console.error('Select menu not found') : void 0;
  }
  try {
    await selectMenu(interaction);
  } catch (error) {
    console.error(error);
  }
}
