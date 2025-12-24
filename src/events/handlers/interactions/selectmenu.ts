import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

export async function selectMenuHandler(interaction: StringSelectMenuInteraction) {
  const selectMenu = client.selectMenus.get(interaction.customId);
  if (!selectMenu) {
    return client.config.development ? console.error('Select menu not found: ', interaction.customId) : void 0;
  }
  try {
    await selectMenu(interaction);
  } catch (error) {
    console.error('Error while executing: ', interaction.customId, '\n', error);
    if (!interaction.replied) {
      await interaction
        .reply({
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
          components: errorComponent('An error has occurred in executing your request.'),
        })
        .catch();
    }
  }
}
