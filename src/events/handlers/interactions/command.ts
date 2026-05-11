import { MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';
import { checkCommandPermission } from '../../../utils/utils';

const commandRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const COMMAND_RATE_LIMIT_MAX = 5;
const COMMAND_RATE_LIMIT_WINDOW = 10000;

export async function commandHandler(interaction: ChatInputCommandInteraction) {
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return client.config.development ? console.error('Command not found: ', interaction.commandName) : void 0;
  }

  const userId = interaction.user.id;
  const now = Date.now();
  const userLimit = commandRateLimitMap.get(userId);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= COMMAND_RATE_LIMIT_MAX) {
        return interaction
          .reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: errorComponent('You are using commands too fast. Please slow down.'),
          })
          .catch(console.error);
      }
      userLimit.count++;
    } else {
      commandRateLimitMap.set(userId, { count: 1, resetTime: now + COMMAND_RATE_LIMIT_WINDOW });
    }
  } else {
    commandRateLimitMap.set(userId, { count: 1, resetTime: now + COMMAND_RATE_LIMIT_WINDOW });
  }

  if (!checkCommandPermission(interaction.user, command.permission)) {
    return await interaction
      .reply({
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: errorComponent('You do not have permission to use this command.'),
      })
      .catch(console.error);
  }

  try {
    await command.run(interaction);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error while executing command:', interaction.commandName);
    console.error('Error details:', error);
    console.error('User:', interaction.user.tag, '(', interaction.user.id, ')');
    console.error('Guild:', interaction.guild?.name ?? 'DM', '(', interaction.guildId ?? 'N/A', ')');

    const userMessage = client.config.development
      ? `An error has occurred: ${errorMsg}`
      : 'An error has occurred while executing your request';

    if (!interaction.replied && !interaction.deferred) {
      await interaction
        .reply({
          flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
          components: errorComponent(userMessage),
        })
        .catch(err => console.error('Failed to send error reply:', err));
    } else if (interaction.deferred) {
      await interaction
        .editReply({
          components: errorComponent(userMessage),
        })
        .catch(err => console.error('Failed to edit error reply:', err));
    }
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of commandRateLimitMap.entries()) {
    if (now > limit.resetTime + 60000) {
      commandRateLimitMap.delete(userId);
    }
  }
}, 60000);
