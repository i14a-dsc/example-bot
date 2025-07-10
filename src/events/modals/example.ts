import type { ModalSubmitInteraction } from 'discord.js';

export function run(interaction: ModalSubmitInteraction) {
  const example = interaction.fields.getTextInputValue('example_input');
  if (example) {
    return interaction.reply({ content: `You entered: ${example}`, flags: 64 });
  }
  interaction.reply({ content: 'You have submitted the form!', flags: 64 });
}
