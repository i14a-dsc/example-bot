import { ApplicationCommandType, MessageFlags } from 'discord.js';
import type { MessageContextCommand } from '../../../types/context';

export const attachmentExample: MessageContextCommand = {
  data: {
    type: ApplicationCommandType.Message,
    name: 'example_attachment_context',
  },
  async run(interaction) {
    const attachments = interaction.targetMessage.attachments;
    if (!attachments.size) {
      await interaction.reply({
        content: 'This message has no attachments.',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const attachmentList = attachments
      .map(attachment => `- [${attachment.name ?? attachment.id}](${attachment.url})`)
      .join('\n');
    await interaction.reply({
      content: `Attachments on this message:\n${attachmentList}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
};
