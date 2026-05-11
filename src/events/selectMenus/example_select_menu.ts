import type { StringSelectMenuInteraction } from 'discord.js';

export function run(interaction: StringSelectMenuInteraction) {
  interaction.reply({ content: `You selected: ${interaction.values[0]}`, flags: 64 });
}
