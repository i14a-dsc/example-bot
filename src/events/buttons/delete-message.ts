import type { ButtonInteraction } from 'discord.js';

export function run(interaction: ButtonInteraction) {
  if (interaction.message.flags.has(64)) {
    return;
  }
  interaction.message.delete().catch(console.error);
}
