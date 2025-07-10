import { ComponentType, MessageFlags } from 'discord.js';
import { client } from '../..';
import type { Command } from '../../types/command';
import { errorComponent, textDisplay } from '../../utils/components';
import { checkPermission } from '../../utils/utils';

export const command: Command = {
  data: {
    name: 'restart',
    description: 'Restarts the bot.',
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    const { user } = interaction;
    await interaction.deferReply({
      flags: [64],
    });
    if (checkPermission('admin', user)) {
      await interaction.editReply({
        flags: [MessageFlags.IsComponentsV2],
        components: [{ type: ComponentType.Container, components: [textDisplay('ℹ️ Restarting...')] }],
      });
      await client.stop();
    } else {
      interaction.editReply({
        flags: [MessageFlags.IsComponentsV2],
        components: errorComponent("Sorry, you don't have permission to use this command."),
      });
    }
  },
};
