import { MessageFlags } from 'discord.js';
import { getConfig } from '../config/config';
import fs from 'fs';

const config = getConfig();

export function checkPermission(
  permission: 'dev' | 'admin' | 'trusted' | 'blacklist',
  { id, username }: { id?: string; username?: string },
): boolean {
  if (!id && !username) {
    return false;
  }

  const checkArray = (arr: string[]): boolean => {
    if (id && id.trim() && arr.includes(id)) return true;
    if (username && username.trim() && arr.includes(username)) return true;
    return false;
  };

  switch (permission) {
    case 'dev':
      return checkArray(config.permissions.dev);
    case 'admin':
      return checkArray(config.permissions.admin);
    case 'trusted':
      return checkArray(config.permissions.trusted);
    case 'blacklist':
      return checkArray(config.permissions.blacklist);
    default:
      return false;
  }
}

export function isEphemeral(ephemeral: boolean | null | undefined = false): number {
  return ephemeral ? MessageFlags.Ephemeral : 0;
}

export async function checkLockfile(): Promise<boolean> {
  try {
    const lockPath = config.lockFileName ?? './.lock';
    await fs.promises.access(lockPath);
    return true;
  } catch {
    return false;
  }
}

export async function createLockfile(): Promise<void> {
  try {
    const lockPath = config.lockFileName ?? './.lock';
    await fs.promises.writeFile(lockPath, `${Date.now()}`);
  } catch (e) {
    console.error('Failed to create lockfile:', e);
    throw e;
  }
}

export async function deleteLockfile(): Promise<void> {
  try {
    const lockPath = config.lockFileName ?? './.lock';
    await fs.promises.unlink(lockPath);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Failed to delete lockfile:', e);
    }
  }
}

export function isExampleFile(fileName: string): boolean {
  return config.ignoreExample && fileName.includes('example');
}

/**
 * Check if a user has permission to execute a command based on the command's permission requirements
 * @param user - Discord user object with id and username
 * @param commandPermission - Permission requirements from the command definition
 * @returns true if user has permission, false otherwise
 */
export function checkCommandPermission(
  user: { id: string; username?: string },
  commandPermission?: {
    dev?: boolean;
    admin?: boolean;
    trusted?: boolean;
    blacklist?: boolean;
  },
): boolean {
  if (!commandPermission) {
    return true;
  }

  if (commandPermission.blacklist && checkPermission('blacklist', user)) {
    return false;
  }

  if (commandPermission.dev && !checkPermission('dev', user)) {
    return false;
  }

  if (commandPermission.admin && !checkPermission('admin', user)) {
    return false;
  }

  if (commandPermission.trusted && !checkPermission('trusted', user)) {
    return false;
  }

  return true;
}
