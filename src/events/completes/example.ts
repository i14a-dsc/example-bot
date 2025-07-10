import type { AutocompleteInteraction } from 'discord.js';

export function run(interaction: AutocompleteInteraction) {
  if (interaction.commandName === 'example') {
    const choices = [
      { name: 'Test 1', value: '1' },
      { name: 'Test 2', value: '2' },
      { name: 'Test 3 (random value)', value: Math.floor(Math.random() * 100).toString() },
      { name: `Test 4 (random name) ${Math.floor(Math.random() * 100).toString()}`, value: '4' },
    ];
    return interaction.respond(choices);
  }
}
