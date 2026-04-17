import { MessageFlags, type StringSelectMenuInteraction } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';

const selectMenuRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const SELECT_MENU_RATE_LIMIT_MAX = 10;
const SELECT_MENU_RATE_LIMIT_WINDOW = 5000;

export async function selectMenuHandler(interaction: StringSelectMenuInteraction) {
  const userId = interaction.user.id;
  const now = Date.now();
  const userLimit = selectMenuRateLimitMap.get(userId);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= SELECT_MENU_RATE_LIMIT_MAX) {
        return interaction
          .reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: errorComponent('You are using select menus too fast. Please slow down.'),
          })
          .catch(console.error);
      }
      userLimit.count++;
    } else {
      selectMenuRateLimitMap.set(userId, { count: 1, resetTime: now + SELECT_MENU_RATE_LIMIT_WINDOW });
    }
  } else {
    selectMenuRateLimitMap.set(userId, { count: 1, resetTime: now + SELECT_MENU_RATE_LIMIT_WINDOW });
  }

  const selectMenu = client.selectMenus.get(interaction.customId);
  if (!selectMenu) {
    return client.config.development ? console.error('Select menu not found: ', interaction.customId) : void 0;
  }

  try {
    await selectMenu(interaction);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error while executing select menu:', interaction.customId);
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
  for (const [userId, limit] of selectMenuRateLimitMap.entries()) {
    if (now > limit.resetTime + 60000) {
      selectMenuRateLimitMap.delete(userId);
    }
  }
}, 60000);
