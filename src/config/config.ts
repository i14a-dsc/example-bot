import type { Permissions, Versions } from '../types/config';
import { getArgs } from '../utils/args';

/**
 * Version information for the bot.
 * @typedef {Object} Versions
 * @property {number} major - Major version
 * @property {number} minor - Minor version
 * @property {number} patch - Patch version
 * @property {string} version - Version label (e.g., 'dev')
 */
const versions: Versions = {
  major: 1,
  minor: 0,
  patch: 0,
  version: 'dev',
};

/**
 * Indicates if the bot is running in development mode.
 * @type {boolean}
 */
const _development: boolean = versions.version === 'dev' || getArgs().includes('--development');
/**
 * Indicates if the bot is running in production mode.
 * @type {boolean}
 */
const production: boolean = getArgs().includes('--production') || !_development;
/**
 * Indicates if the bot is running in development mode (alias).
 * @type {boolean}
 */
const development: boolean = _development || !production;

/**
 * Developer, admin, and blacklist user lists from environment variables.
 * @type {string[]}
 */
const dev = process.env['developer'] ? process.env['developer'].split(',') ?? [] : [];
const admin = process.env['admin'] ? process.env['admin'].split(',') ?? [] : [];
const blacklist = process.env['blacklist'] ? process.env['blacklist'].split(',') ?? [] : [];
/**
 * The full version string (e.g., '1.0.0-dev').
 * @type {string}
 */
const version = `${versions.major}.${versions.minor}.${versions.patch}-${versions.version}`;

/**
 * Main bot configuration object.
 * @type {object}
 * @property {string} name - Bot name
 * @property {string} prefix - Command prefix
 * @property {string} version - Version string
 * @property {Versions} versions - Version details
 * @property {boolean} development - Development mode
 * @property {boolean} production - Production mode
 * @property {Permissions} permissions - Permissions object
 * @property {string} token - Bot token
 * @property {string} clientId - Discord application client ID
 */
const config = {
  name: 'change-here',
  prefix: development ? 'y.' : 'y!',
  version,
  versions,
  development,
  production,
  permissions: {
    dev,
    admin: [...admin, ...dev],
    blacklist,
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
