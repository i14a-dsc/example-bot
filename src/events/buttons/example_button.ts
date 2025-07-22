import type { ButtonInteraction } from 'discord.js';

export function run(interaction: ButtonInteraction) {
  interaction.reply({ content: 'You clicked the example button!', flags: 64 });
}
