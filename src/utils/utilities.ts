/* modules */
import { Client, Collection, Guild } from 'discord.js';
import fs from 'fs';

/* main */
async function getCommands(): Promise<{ commands: Collection<string, any>; files: string[] }> {
  const commands: Collection<string, any> = new Collection();
  const files = fs
    .readdirSync('./dist/events/commands')
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (let file of files) {
    const { Command: cmd } = await import(`../events/commands/${file}`);
    commands.set(cmd.data.name, cmd);
  }
  return { commands, files };
}

export class Utilities {
  constructor() {}

  public async getCommands(): Promise<{ commands: Collection<string, any>; files: string[] }> {
    const { commands, files } = await getCommands();

    return { commands, files };
  }

  public async uploadSlashCommand(client: Client) {
    const { commands } = await getCommands();

    await client.guilds.cache.forEach((guild: Guild) =>
      guild.commands.set(commands.map(cmd => cmd.data))
    );
    return commands;
  }
}
