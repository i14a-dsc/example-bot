import type { Config, Permissions, Versions } from '../types/config';
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
const config: Config = {
  name: 'change-here',
  prefix: development ? 'y.' : 'y!',
  version,
  versions,
  development,
  production,
};

export function getConfig() {
  config.token = development ? process.env['DEV_TOKEN'] ?? process.env['TOKEN'] : process.env['TOKEN'];
  config.clientId = development ? process.env['DEV_CLIENT_ID'] ?? process.env['CLIENT_ID'] : process.env['CLIENT_ID'];
  if (!config.token) {
    throw new Error('No token provided.');
  }
  if (!config.clientId) {
    throw new Error('No application id provided.');
  }
  config.permissions = {
    dev: process.env['developer'] ? process.env['developer'].split(',') ?? [] : [],
    admin: process.env['admin'] ? [...process.env['admin'].split(','), ...dev] : [...dev],
    blacklist: process.env['blacklist'] ? process.env['blacklist'].split(',') ?? [] : [],
  } as Permissions;
  if (!config.permissions.dev.length) {
    throw new Error('No devevelopers provided.');
  }
  return { ...config, toString: () => `${config.name} - ${version}` };
}
