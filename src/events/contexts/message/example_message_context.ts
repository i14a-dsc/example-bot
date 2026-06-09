import { ApplicationCommandType, MessageFlags } from 'discord.js';
import type { MessageContextCommand } from '../../../types/context';

export const messageExample: MessageContextCommand = {
  data: {
    type: ApplicationCommandType.Message,
    name: 'example_message_context',
  },
  async run(interaction) {
    const targetMessage = interaction.targetMessage;
    await interaction.reply({
      content: `Message context command triggered for message by ${targetMessage.author.username}:\n${targetMessage.content || '[no text]'}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
};
