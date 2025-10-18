/**
 * Get the bot configuration object.
 */
import { MessageFlags } from 'discord.js';
import { getConfig } from '../config/config';
import fs from 'fs';

const config = getConfig();

/**
 * Check if a user has a specific permission.
 * @param {'owner' | 'admin' | 'blacklist'} permission - The permission type to check
 * @param {{ id?: string; username?: string }} user - The user object with id or username
 * @returns {boolean} True if the user has the permission, false otherwise
 */
export function checkPermission(
  permission: 'owner' | 'admin' | 'blacklist',
  { id, username }: { id?: string; username?: string },
) {
  if (
    (permission === 'owner' &&
      (config.permissions.dev.includes(id ?? '') || config.permissions.dev.includes(username ?? ''))) ||
    (permission === 'admin' &&
      (config.permissions.admin.includes(id ?? '') || config.permissions.admin.includes(username ?? ''))) ||
    (permission === 'blacklist' &&
      (config.permissions.blacklist.includes(id ?? '') || config.permissions.blacklist.includes(username ?? '')))
  ) {
    return true;
  }
  return false;
}

export function isEphemeral(ephemeral: boolean | null | undefined = false): number {
  return ephemeral ? MessageFlags.Ephemeral : 0;
}

export async function checkLockfile(): Promise<boolean> {
  if (fs.existsSync('./.lock')) {
    return true;
  }
  return false;
}

export function createLockfile(): void {
  fs.writeFileSync('./.lock', '');
}

export function deleteLockfile(): void {
  fs.unlinkSync('./.lock');
}
