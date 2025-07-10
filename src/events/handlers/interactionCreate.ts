import type { Interaction } from 'discord.js';
import { buttonHandler } from './interactions/button';
import { commandHandler } from './interactions/command';
import { selectMenuHandler } from './interactions/selectmenu';
import { modalHandler } from './interactions/modal';
import { autoCompleteHandler } from './interactions/autocomplete';

export async function interactionCreate(interaction: Interaction) {
  if (interaction.isAutocomplete()) {
    autoCompleteHandler(interaction);
  }

  if (interaction.isButton()) {
    buttonHandler(interaction);
  }

  if (interaction.isChatInputCommand()) {
    commandHandler(interaction);
  }

  if (interaction.isModalSubmit()) {
    modalHandler(interaction);
  }

  if (interaction.isStringSelectMenu()) {
    selectMenuHandler(interaction);
  }
}
