/**
 * Get the bot configuration object.
 */
import { getConfig } from '../config/config';

const config = getConfig();

/**
 * Check if a user has a specific permission.
 * @param {'owner' | 'admin' | 'vip' | 'blacklist'} permission - The permission type to check
 * @param {{ id?: string; username?: string }} user - The user object with id or username
 * @returns {boolean} True if the user has the permission, false otherwise
 */
export function checkPermission(
  permission: 'owner' | 'admin' | 'vip' | 'blacklist',
  { id, username }: { id?: string; username?: string },
) {
  if (
    (permission === 'owner' &&
      (config.permissions.dev.includes(id ?? '') || config.permissions.dev.includes(username ?? ''))) ||
    (permission === 'admin' &&
      (config.permissions.admin.includes(id ?? '') || config.permissions.admin.includes(username ?? ''))) ||
    (permission === 'vip' &&
      (config.permissions.vip.includes(id ?? '') || config.permissions.vip.includes(username ?? ''))) ||
    (permission === 'blacklist' &&
      (config.permissions.blacklist.includes(id ?? '') || config.permissions.blacklist.includes(username ?? '')))
  ) {
    return true;
  }
  return false;
}
