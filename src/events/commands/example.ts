import { ComponentType, InteractionContextType, MessageFlags } from 'discord.js';
import type { Command } from '../../types/command';
import { actionRow, button, selectMenu, separator, textDisplay } from '../../utils/components';
import { isEphemeral } from '../../utils/utils';
import { client } from '../..';

export const command: Command = {
  data: {
    name: 'example',
    description: 'Example command',
    options: [
      {
        name: 'example',
        description: 'Test option',
        type: 3,
        autocomplete: true,
      },
      {
        name: 'no_ephemeral',
        description: 'Disable ephemeral',
        type: 5,
      },
    ],
    type: 1,
    integration_types: [0, 1],
    contexts: [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel],
  },
  async run(interaction) {
    const test = interaction.options.getString('test');
    const noEphemeral = !interaction.options.getBoolean('no_ephemeral');
    if (test) {
      return interaction.reply(`You selected ${test}`);
    }
    await interaction.reply({
      flags: [isEphemeral(noEphemeral), MessageFlags.IsComponentsV2],
      components: [
        {
          type: ComponentType.Container,
          components: [
            textDisplay('# Hello world!'),
            textDisplay(`-# ${client.user.username}`),
            separator(),
            actionRow(
              button('Example button', 'example_button', 1),
              button('Example modal', 'example_modal', 1),
              button('Delete message', 'delete-message', 4, { name: '🗑️' }),
            ),
            actionRow(
              selectMenu({
                custom_id: 'example_select_menu',
                options: [
                  { label: 'Test 1', value: '1' },
                  { label: 'Test 2', value: '2' },
                  { label: 'Test 3 (random value)', value: Math.floor(Math.random() * 96 + 4).toString() },
                  { label: `Test 4 (random name) ${Math.floor(Math.random() * 100).toString()}`, value: '3' },
                ],
                placeholder: 'Example select menu',
              }),
            ),
          ],
        },
      ],
    });
  },
};
