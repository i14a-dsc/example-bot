import type { AutocompleteInteraction } from 'discord.js';

export function run(interaction: AutocompleteInteraction) {
  if (interaction.commandName === 'example') {
    const choices = [
      { name: 'Test 1', value: '1' },
      { name: 'Test 2', value: '2' },
      { name: `Test ${Math.floor(Math.random() * 100).toString()} (random name)`, value: '3' },
      { name: 'Test 4 (random value)', value: Math.floor(Math.random() * 96 + 4).toString() },
    ];
    return interaction.respond(choices);
  }
}
