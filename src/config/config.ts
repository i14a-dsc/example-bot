import type { Permissions, Versions } from '../types/config';
import { getArgs } from '../utils/args';

const versions: Versions = {
  major: 1,
  minor: 0,
  patch: 0,
  patchline: 'dev',
};

/**
 * Do not touch
 */
const _development: boolean = versions.patchline === 'dev' || getArgs().includes('--development');
const production: boolean = getArgs().includes('--production') || !_development;
const development: boolean = _development || !production;
const dev = process.env['developer'] ? process.env['developer'].split(',') ?? [] : [];
const version = `${versions.major}.${versions.minor}.${versions.patch}-${versions.patchline}`;

/**
 * Main config
 */
const config = {
  name: 'change-here',
  prefix: development ? 'y.' : 'y!',
  version,
  versions,
  development,
  production,
  permissions: {
    dev: process.env['developer'] ? process.env['developer'].split(',') ?? [] : [],
    admin: process.env['admin'] ? [...process.env['admin'].split(','), ...dev] : [...dev],
    blacklist: process.env['blacklist'] ? process.env['blacklist'].split(',') ?? [] : [],
  } as Permissions,
  token: development ? process.env['DEV_TOKEN'] ?? process.env['TOKEN'] : process.env['TOKEN'],
  clientId: development ? process.env['DEV_CLIENT_ID'] ?? process.env['CLIENT_ID'] : process.env['CLIENT_ID'],
};

/**
 * Get the bot configuration, validating required fields.
 * @throws {Error} If required config values are missing
 * @returns {object} The bot configuration object
 */
export function getConfig() {
  if (!config.token) {
    throw new Error('No token provided.');
  }
  if (!config.clientId) {
    throw new Error('No application id provided.');
  }
  if (!config.name) {
    throw new Error('No bot name provided.');
  }
  if (!config.permissions.dev.length) {
    throw new Error('No devevelopers provided.');
  }
  return { ...config, toString: () => `${config.name} - ${version}` };
}
