import { InteractionContextType, MessageFlags } from 'discord.js';
import type { Command } from '../../types/command';
import { textDisplay } from '../../utils/components';
import { isEphemeral } from '../../utils/utils';

export const command: Command = {
  permission: {
    dev: true,
  },
  data: {
    name: 'permission-example',
    description: 'Example command for test developer permission',
    type: 1,
    integration_types: [0, 1],
    contexts: [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel],
  },
  async run(interaction) {
    await interaction.reply({
      flags: [isEphemeral(true), MessageFlags.IsComponentsV2],
      components: [
        {
          type: 1,
          components: [textDisplay('✅ You have developer permission!')],
        },
      ],
    });
  },
};
