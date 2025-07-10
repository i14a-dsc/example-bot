import { client } from '../..';
import { FancyLogger } from '../../utils/logger';

export function ready() {
  FancyLogger.botReady(client.user.username, {
    buttons: client.buttons.size,
    commands: client.commands.size,
    messageCommands: client.messageCommands.size,
    modals: client.modals.size,
    selectMenus: client.selectMenus.size,
  });
}
