import {
  Collection,
  Client as DiscordClient,
  REST,
  Routes,
  type AutocompleteInteraction,
  type ButtonInteraction,
  type ClientApplication,
  type ClientUser,
  type Message,
  type ModalSubmitInteraction,
  type AnySelectMenuInteraction,
  type ClientOptions,
} from 'discord.js';
import type { Command } from '../types/command';
import fg from 'fast-glob';

import { getConfig } from '../config/config';
import { FancyLogger } from './logger';
import { ready } from '../events/handlers/ready';
import { interactionCreate } from '../events/handlers/interactionCreate';
import { messageCreate } from '../events/handlers/messageCreate';

/**
 * The main Discord bot client, extending discord.js Client with additional properties and methods for commands, buttons, select menus, modals, and more.
 * Handles dynamic loading of handlers and provides utility methods for guild, user, and channel access.
 */
export class Client extends DiscordClient {
  /** The bot user. */
  declare user: ClientUser;
  /** The bot application. */
  declare application: ClientApplication;
  /** Collection of slash commands. */
  declare commands: Collection<string, Command>;
  /** Collection of button handlers. */
  /* eslint-disable-next-line no-unused-vars */
  declare buttons: Collection<string, (interaction: ButtonInteraction) => void | Promise<void>>;
  /** Collection of select menu handlers. */
  /* eslint-disable-next-line no-unused-vars */
  declare selectMenus: Collection<string, (interaction: AnySelectMenuInteraction) => void | Promise<void>>;
  /** Collection of modal handlers. */
  /* eslint-disable-next-line no-unused-vars */
  declare modals: Collection<string, (interaction: ModalSubmitInteraction) => void | Promise<void>>;
  /** Collection of autocomplete handlers. */
  /* eslint-disable-next-line no-unused-vars */
  declare completes: Collection<string, (interaction: AutocompleteInteraction) => void | Promise<void>>;
  /** Collection of message command handlers. */
  /* eslint-disable-next-line no-unused-vars */
  declare messageCommands: Collection<string, (message: Message, args: string[]) => void | Promise<void>>;

  /** Bot configuration object. */
  public config = getConfig();
  /** REST client for Discord API. */
  public rest: REST = new REST({ version: '10' }).setToken(this.config.token ?? '');

  /**
   * Create a new bot client.
   * @param options Client options (excluding intents, which are set by default)
   */
  constructor(options?: Omit<ClientOptions, 'intents'>) {
    if (typeof Bun !== 'object') {
      FancyLogger.error([
        'This bot currently only supports Bun.js as a runtime.',
        'Other javascript runtimes are not supported. May cause issues.',
      ]);
    }
    super({
      intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'DirectMessages'],
      ...options,
    });

    this.on('error', console.error);
  }

  /**
   * Initialize the bot, load all handlers, and log in to Discord.
   */
  async init() {
    FancyLogger.loading('Initializing Discord bot');

    this.on('messageCreate', messageCreate);
    this.on('interactionCreate', interactionCreate);
    this.on('ready', ready);
    this.commands = new Collection<string, Command>();

    FancyLogger.loading('Loading handlers');
    const commandFiles = await fg('src/events/commands/**/*.ts');
    for (const file of commandFiles) {
      try {
        const relativePath = file.replace('src/events/commands/', '../events/commands/');
        const command = (await import(relativePath)).command as Command;
        this.commands.set(command.data.name, command);
      } catch (e: any) {
        FancyLogger.error(`Error loading commands with glob: ${file}, ${e.message}`);
        continue;
      }
    }

    this.buttons = new Collection();
    const buttonFiles = await fg('src/events/buttons/**/*.ts');
    for (const file of buttonFiles) {
      try {
        const relativePath = file.replace('src/events/buttons/', '../events/buttons/');
        const button = await import(relativePath);
        const fileName = file.replace('src/events/buttons/', '').replace('.ts', '');
        this.buttons.set(fileName, button.run);
      } catch (e: any) {
        FancyLogger.error(`Error loading button: ${file}, ${e.message}`);
        continue;
      }
    }

    this.selectMenus = new Collection();
    const selectMenuFiles = await fg('src/events/selectMenus/**/*.ts');
    for (const file of selectMenuFiles) {
      try {
        const fileName = file.split('/').pop()!;
        const selectMenu = await import(`../events/selectMenus/${fileName}`);
        this.selectMenus.set(fileName.replace('.ts', ''), selectMenu.run);
      } catch (e: any) {
        FancyLogger.error(`Error loading select menu: ${file}, ${e.message}`);
        continue;
      }
    }

    this.modals = new Collection();
    const modalFiles = await fg('src/events/modals/**/*.ts');
    for (const file of modalFiles) {
      try {
        const fileName = file.split('/').pop()!;
        const modal = await import(`../events/modals/${fileName}`);
        this.modals.set(fileName.replace('.ts', ''), modal.run);
      } catch (e: any) {
        FancyLogger.error(`Error loading modal: ${file}, ${e.message}`);
        continue;
      }
    }

    this.completes = new Collection();
    const completeFiles = await fg('src/events/completes/**/*.ts');
    for (const file of completeFiles) {
      try {
        const fileName = file.split('/').pop()!;
        const complete = await import(`../events/completes/${fileName}`);
        this.completes.set(fileName.replace('.ts', ''), complete.run);
      } catch (e: any) {
        FancyLogger.error(`Error loading complete: ${file}, ${e.message}`);
        continue;
      }
    }

    this.messageCommands = new Collection();
    const messageCommandFiles = await fg('src/events/messages/**/*.ts');
    for (const file of messageCommandFiles) {
      try {
        const fileName = file.split('/').pop()!;
        const messageCommand = await import(`../events/messages/${fileName}`);
        this.messageCommands.set(fileName.replace('.ts', ''), messageCommand.run);
      } catch (e: any) {
        FancyLogger.error(`Error loading message command: ${file}, ${e.message}`);
        continue;
      }
    }

    FancyLogger.loading('Uploading slash commands to Discord');
    this._uploadCommands();

    FancyLogger.loading('Logging in to Discord');
    await this.login(this.config.token);
    return this;
  }

  /**
   * Upload slash commands to Discord.
   * @private
   */
  private async _uploadCommands() {
    await this.rest.put(Routes.applicationCommands(this.config.clientId ?? ''), {
      body: this.commands.map(command => command.data),
    });
  }

  /**
   * Stop the bot and exit the process.
   * @param exitCode The exit code to use (default 0)
   */
  public async stop(exitCode: number = 0) {
    await FancyLogger.gradient('Stopping...');
    await this.destroy();
    process.exit(exitCode);
  }

  /**
   * Get a channel by its ID.
   * @param id Channel ID
   */
  public getChannel(id: string) {
    return this.channels.cache.get(id);
  }

  /**
   * Get a user by their ID.
   * @param id User ID
   */
  public getUser(id: string) {
    return this.users.cache.get(id);
  }

  /**
   * Get a guild by its ID.
   * @param id Guild ID
   */
  public getGuild(id: string) {
    return this.guilds.cache.get(id);
  }

  /**
   * Get a member by user ID and guild ID.
   * @param userId User ID
   * @param guildId Guild ID
   */
  public getMember(userId: string, guildId: string) {
    return this.getGuild(guildId)?.members.cache.get(userId);
  }

  /**
   * Get a role by role ID and guild ID.
   * @param roleId Role ID
   * @param guildId Guild ID
   */
  public getRole(roleId: string, guildId: string) {
    return this.getGuild(guildId)?.roles.cache.get(roleId);
  }
}
