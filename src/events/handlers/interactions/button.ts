import { MessageFlags, type ButtonInteraction } from 'discord.js';
import { client } from '../../..';
import { mappings } from './buttonMappings';
import { errorComponent } from '../../../utils/components';

const buttonRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const BUTTON_RATE_LIMIT_MAX = 10;

const BUTTON_RATE_LIMIT_WINDOW = 5000;

export async function buttonHandler(interaction: ButtonInteraction) {
  const userId = interaction.user.id;
  const now = Date.now();
  const userLimit = buttonRateLimitMap.get(userId);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= BUTTON_RATE_LIMIT_MAX) {
        return interaction
          .reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: errorComponent('You are clicking too fast. Please slow down.'),
          })
          .catch();
      }
      userLimit.count++;
    } else {
      buttonRateLimitMap.set(userId, { count: 1, resetTime: now + BUTTON_RATE_LIMIT_WINDOW });
    }
  } else {
    buttonRateLimitMap.set(userId, { count: 1, resetTime: now + BUTTON_RATE_LIMIT_WINDOW });
  }

  let button = client.buttons.get(interaction.customId);
  const customId = interaction.customId;

  if (!button) {
    let action = mappings[customId];

    if (!action) {
      for (const key in mappings) {
        if (
          customId.length <= 100 &&
          ((key.endsWith('_') && customId.startsWith(key)) || (key.endsWith('-') && customId.startsWith(key)))
        ) {
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error while executing button:', customId);
    console.error('Error details:', error);
    console.error('User:', interaction.user.tag, '(', interaction.user.id, ')');

    if (!interaction.replied && !interaction.deferred) {
      await interaction
        .reply({
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
          components: errorComponent(
            client.config.development
              ? `An error has occurred: ${errorMsg}`
              : 'An error has occurred in executing your request',
          ),
        })
        .catch(err => console.error('Failed to send error reply:', err));
    } else if (interaction.deferred) {
      await interaction
        .editReply({
          components: errorComponent(
            client.config.development
              ? `An error has occurred: ${errorMsg}`
              : 'An error has occurred in executing your request',
          ),
        })
        .catch(err => console.error('Failed to edit error reply:', err));
    }
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of buttonRateLimitMap.entries()) {
    if (now > limit.resetTime + 60000) {
      buttonRateLimitMap.delete(userId);
    }
  }
}, 60000);
