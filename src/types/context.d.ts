import type {
  ApplicationCommandType,
  ContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export interface ContextCommand<C extends ContextMenuCommandInteraction = ContextMenuCommandInteraction> {
  data: {
    type: ApplicationCommandType.User | ApplicationCommandType.Message;
    name: string;
  };
  /* eslint-disable no-unused-vars */
  run: (interaction: C) => Promise<void> | void;
}
/* eslint-enable no-unused-vars */

export type UserContextCommand = ContextCommand<UserContextMenuCommandInteraction>;
export type MessageContextCommand = ContextCommand<MessageContextMenuCommandInteraction>;
