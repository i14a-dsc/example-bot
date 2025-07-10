import { promises as fs } from 'fs';
import path from 'path';
import type { GuildSettings } from '../types/guild';

const settingsDir = path.join(process.cwd(), 'data', 'guild_settings');

async function ensureDir() {
  try {
    await fs.mkdir(settingsDir, { recursive: true });
  } catch (e) {
    console.error('Could not create guild settings directory', e);
  }
}
ensureDir();

export async function getGuildSettings(guildId: string): Promise<GuildSettings> {
  const filePath = path.join(settingsDir, `${guildId}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as GuildSettings;
  } catch {
    return {};
  }
}

export async function setGuildSettings(guildId: string, settings: GuildSettings): Promise<void> {
  const filePath = path.join(settingsDir, `${guildId}.json`);
  const currentSettings = await getGuildSettings(guildId);
  const newSettings = { ...currentSettings, ...settings };
  await fs.writeFile(filePath, JSON.stringify(newSettings, null, 2), 'utf8');
}
