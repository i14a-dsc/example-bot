import { ApplicationCommandType, MessageFlags } from 'discord.js';
import type { UserContextCommand } from '../../../types/context';

export const userExample: UserContextCommand = {
  data: {
    type: ApplicationCommandType.User,
    name: 'example_user_context',
  },
  async run(interaction) {
    const targetUser = interaction.targetUser;
    await interaction.reply({
      content: `User context command triggered for ${targetUser.username}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
};
