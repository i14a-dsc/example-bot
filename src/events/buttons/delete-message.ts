import type { ButtonInteraction } from 'discord.js';

export async function run(interaction: ButtonInteraction) {
  if (interaction.message.flags.has(64)) {
    return;
  }

  const isOriginalUser = interaction.message.interactionMetadata?.user.id === interaction.user.id;
  const hasManageMessages = interaction.memberPermissions?.has('ManageMessages') ?? false;

  if (!isOriginalUser && !hasManageMessages) {
    return interaction
      .reply({
        content: 'You do not have permission to delete this message.',
        flags: [64],
      })
      .catch(console.error);
  }

  await interaction.message.delete().catch(console.error);
}
