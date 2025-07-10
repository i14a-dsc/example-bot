import type { ModalSubmitInteraction } from 'discord.js';
import { client } from '../../..';

export async function modalHandler(interaction: ModalSubmitInteraction) {
  const modal = client.modals.get(interaction.customId);
  if (!modal) {return client.config.development ? console.error('Modal not found') : void 0;}
  try {
    await modal(interaction);
  } catch (error) {
    console.error(error);
  }
}
