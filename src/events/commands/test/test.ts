import { ComponentType, InteractionContextType, MessageFlags } from 'discord.js';
import type { Command } from '../../../types/command';
import { textDisplay } from '../../../utils/components';
import { isEphemeral } from '../../../utils/utils';

export const command: Command = {
  data: {
    name: 'test',
    description: 'Test command to check if the bot is working',
    type: 1,
    integration_types: [0, 1],
    contexts: [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel],
  },
  async run(interaction) {
    await interaction.reply({
      flags: [isEphemeral(true), MessageFlags.IsComponentsV2],
      components: [
        {
          type: ComponentType.Container,
          components: [textDisplay('Command is working')],
        },
      ],
    });
  },
};
