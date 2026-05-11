import type { Interaction } from 'discord.js';
import { buttonHandler } from './interactions/button';
import { commandHandler } from './interactions/command';
import { selectMenuHandler } from './interactions/selectmenu';
import { modalHandler } from './interactions/modal';
import { autoCompleteHandler } from './interactions/autocomplete';
import { FancyLogger } from '../../utils/logger';

export async function interactionCreate(interaction: Interaction) {
  try {
    if (interaction.isAutocomplete()) await autoCompleteHandler(interaction);

    if (interaction.isButton()) await buttonHandler(interaction);

    if (interaction.isChatInputCommand()) await commandHandler(interaction);

    if (interaction.isModalSubmit()) await modalHandler(interaction);

    if (interaction.isStringSelectMenu()) await selectMenuHandler(interaction);
  } catch (e: unknown) {
    FancyLogger.error(`Error while executing ${interaction.type} interaction.`);
    console.error(e);
  }
}
