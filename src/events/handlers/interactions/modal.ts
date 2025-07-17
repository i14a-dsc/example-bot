import { MessageFlags, type ModalSubmitInteraction } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

export async function modalHandler(interaction: ModalSubmitInteraction) {
  const modal = client.modals.get(interaction.customId);
  if (!modal) {
    return client.config.development ? console.error('Modal not found') : void 0;
  }
  try {
    await modal(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        components: errorComponent('An error has occurred'),
      });
    }
  }
}
