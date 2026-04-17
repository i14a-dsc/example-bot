import { MessageFlags, type ModalSubmitInteraction } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

const modalRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MODAL_RATE_LIMIT_MAX = 3;

const MODAL_RATE_LIMIT_WINDOW = 10000;

export async function modalHandler(interaction: ModalSubmitInteraction) {
  const userId = interaction.user.id;
  const now = Date.now();
  const userLimit = modalRateLimitMap.get(userId);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= MODAL_RATE_LIMIT_MAX) {
        return interaction
          .reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: errorComponent('You are submitting modals too fast. Please slow down.'),
          })
          .catch(console.error);
      }
      userLimit.count++;
    } else {
      modalRateLimitMap.set(userId, { count: 1, resetTime: now + MODAL_RATE_LIMIT_WINDOW });
    }
  } else {
    modalRateLimitMap.set(userId, { count: 1, resetTime: now + MODAL_RATE_LIMIT_WINDOW });
  }

  const modal = client.modals.get(interaction.customId);
  if (!modal) {
    return client.config.development ? console.error('Modal not found: ', interaction.customId) : void 0;
  }

  try {
    await modal(interaction);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error while executing modal:', interaction.customId);
    console.error('Error details:', error);
    console.error('User:', interaction.user.tag, '(', interaction.user.id, ')');

    if (!interaction.replied && !interaction.deferred) {
      await interaction
        .reply({
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
          components: errorComponent(
            client.config.development
              ? `An error has occurred: ${errorMsg}`
              : 'An error has occurred in executing your request.',
          ),
        })
        .catch(err => console.error('Failed to send error reply:', err));
    } else if (interaction.deferred) {
      await interaction
        .editReply({
          components: errorComponent(
            client.config.development
              ? `An error has occurred: ${errorMsg}`
              : 'An error has occurred in executing your request.',
          ),
        })
        .catch(err => console.error('Failed to edit error reply:', err));
    }
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of modalRateLimitMap.entries()) {
    if (now > limit.resetTime + 60000) {
      modalRateLimitMap.delete(userId);
    }
  }
}, 60000);
