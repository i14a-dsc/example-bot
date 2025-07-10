import { ComponentType } from 'discord.js';
import type { Command } from '../../types/command';
import { separator, textDisplay } from '../../utils/components';

function getCommandData() {
  return {
    name: 'refresh',
    description: 'Refresh Command Cache on your Discord client.',
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
    options: [
      {
        name: 'random',
        description: Math.floor(Math.random() * 1000).toString(),
        type: 3,
        required: false,
        choices: [
          {
            name: 'random_cache',
            value: Math.floor(Math.random() * 1000).toString(),
          },
        ],
      },
    ],
  };
}

export const command: Command = {
  data: getCommandData(),
  run: async interaction => {
    await interaction.reply({
      components: [
        {
          type: ComponentType.Container,
          components: [
            textDisplay('# Cache is already refreshed.'),
            separator(),
            textDisplay('キャッシュはすでに最新です。'),
          ],
        },
      ],
      flags: [64, 32768],
    });
    await interaction.client.application.commands.cache.get(interaction.commandId)?.edit(getCommandData());
  },
};
