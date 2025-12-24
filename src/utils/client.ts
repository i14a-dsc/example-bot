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
import { deleteLockfile } from './utils';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export class Client extends DiscordClient {
  declare user: ClientUser;
  declare application: ClientApplication;
  declare commands: Collection<string, Command>;
  /* eslint-disable no-unused-vars */
  declare buttons: Collection<string, (interaction: ButtonInteraction) => void | Promise<void>>;
  /* eslint-disable no-unused-vars */
  declare selectMenus: Collection<string, (interaction: AnySelectMenuInteraction) => void | Promise<void>>;
  /* eslint-disable no-unused-vars */
  declare modals: Collection<string, (interaction: ModalSubmitInteraction) => void | Promise<void>>;
  /* eslint-disable no-unused-vars */
  declare completes: Collection<string, (interaction: AutocompleteInteraction) => void | Promise<void>>;
  /* eslint-disable no-unused-vars */
  declare messageCommands: Collection<string, (message: Message, args: string[]) => void | Promise<void>>;

  public config = getConfig();
  public rest: REST = new REST({ version: '10' }).setToken(this.config.token ?? '');

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

  async init() {
    FancyLogger.loading('Initializing Discord bot');

    this.createDirectoryStructure();

    this.on('messageCreate', messageCreate);
    this.on('interactionCreate', interactionCreate);
    this.on('clientReady', ready);
    this.commands = new Collection<string, Command>();

    FancyLogger.loading('Loading handlers');
    const commandFiles = await fg('src/events/commands/**/*.ts');
    await Promise.allSettled(
      commandFiles.map(async file => {
        try {
          const relativePath = file.replace('src/events/commands/', '../events/commands/');
          const command = (await import(relativePath)).command as Command;
          this.commands.set(command.data.name, command);
        } catch (e) {
          FancyLogger.error(`Error loading commands: ${file}, ${(e as Error).message}`);
        }
      }),
    );

    this.buttons = new Collection();
    const buttonFiles = await fg('src/events/buttons/**/*.ts');
    await Promise.allSettled(
      buttonFiles.map(async file => {
        try {
          const relativePath = file.replace('src/events/buttons/', '../events/buttons/');
          const button = await import(relativePath);
          const fileName = file.replace('src/events/buttons/', '').replace('.ts', '');
          this.buttons.set(fileName, button.run);
        } catch (e) {
          FancyLogger.error(`Error loading button: ${file}, ${(e as Error).message}`);
        }
      }),
    );

    this.selectMenus = new Collection();
    const selectMenuFiles = await fg('src/events/selectMenus/**/*.ts');
    await Promise.allSettled(
      selectMenuFiles.map(async file => {
        try {
          const fileName = file.split('/').pop()!;
          const selectMenu = await import(`../events/selectMenus/${fileName}`);
          this.selectMenus.set(fileName.replace('.ts', ''), selectMenu.run);
        } catch (e) {
          FancyLogger.error(`Error loading select menu: ${file}, ${(e as Error).message}`);
        }
      }),
    );

    this.modals = new Collection();
    const modalFiles = await fg('src/events/modals/**/*.ts');
    await Promise.allSettled(
      modalFiles.map(async file => {
        try {
          const fileName = file.split('/').pop()!;
          const modal = await import(`../events/modals/${fileName}`);
          this.modals.set(fileName.replace('.ts', ''), modal.run);
        } catch (e) {
          FancyLogger.error(`Error loading modal: ${file}, ${(e as Error).message}`);
        }
      }),
    );

    this.completes = new Collection();
    const completeFiles = await fg('src/events/completes/**/*.ts');
    await Promise.allSettled(
      completeFiles.map(async file => {
        try {
          const fileName = file.split('/').pop()!;
          const complete = await import(`../events/completes/${fileName}`);
          this.completes.set(fileName.replace('.ts', ''), complete.run);
        } catch (e) {
          FancyLogger.error(`Error loading complete: ${file}, ${(e as Error).message}`);
        }
      }),
    );

    this.messageCommands = new Collection();
    const messageCommandFiles = await fg('src/events/messages/**/*.ts');
    await Promise.allSettled(
      messageCommandFiles.map(async file => {
        try {
          const fileName = file.split('/').pop()!;
          const messageCommand = await import(`../events/messages/${fileName}`);
          this.messageCommands.set(fileName.replace('.ts', ''), messageCommand.run);
        } catch (e) {
          FancyLogger.error(`Error loading message command: ${file}, ${(e as Error).message}`);
        }
      }),
    );

    if (this.commands.size > 0) {
      FancyLogger.loading(`Uploading ${this.commands.size} slash commands...`, '📤 Commands');
      this._uploadCommands();
    }

    FancyLogger.loading('Logging in to Discord', '🔑 Client');
    await this.login(this.config.token);
    return this;
  }

  private async _uploadCommands() {
    await this.rest.put(Routes.applicationCommands(this.config.clientId ?? ''), {
      body: this.commands.map(command => command.data),
    });
  }

  private async createDirectoryStructure() {
    const dirs = ['logs', 'data'];

    const tasks = dirs.map(async dir => {
      try {
        if (existsSync(dir)) {
          return { dir, created: false };
        }

        await mkdir(dir, { recursive: true });
        return { dir, created: true };
      } catch (e) {
        throw new Error(`Error creating directory ${dir}: ${(e as Error).message}`);
      }
    });

    const results = await Promise.allSettled(tasks);
    for (const res of results) {
      if (res.status === 'rejected') {
        FancyLogger.error(res.reason?.message ?? String(res.reason));
      }
    }
  }

  /**
   * Stop the bot and exit the process.
   * @param exitCode The exit code to use (default 0)
   */
  public async stop(exitCode: number = 0): Promise<never> {
    await FancyLogger.loading('Shutting down...', '❎ Stopping');
    await this.destroy();
    deleteLockfile();
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
