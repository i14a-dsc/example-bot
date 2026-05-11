import type { Config, Versions } from '../types/config';
import { getArgs } from '../utils/args';

const versions: Versions = {
  major: 1,
  minor: 0,
  patch: 0,
  patchline: 'dev',
};

const _development: boolean = versions.patchline === 'dev' || getArgs().includes('--development');
const production: boolean = getArgs().includes('--production') || !_development;
const development: boolean = _development || !production;
const dev = process.env['developer'] ? process.env['developer'].split(',').filter(v => v.trim()) : [];
const version = `${versions.major}.${versions.minor}.${versions.patch}-${versions.patchline}`;

const config: Config = {
  name: 'change-here',
  prefix: development ? 'y.' : 'y!',
  version,
  versions,
  development,
  production,
  ignoreExample: true,
  permissions: {
    dev,
    admin: [],
    blacklist: [],
    trusted: [],
  },
};

export function getConfig() {
  config.token = development ? (process.env['DEV_TOKEN'] ?? process.env['TOKEN']) : process.env['TOKEN'];
  config.clientId = development ? (process.env['DEV_CLIENT_ID'] ?? process.env['CLIENT_ID']) : process.env['CLIENT_ID'];

  if (!config.token || config.token.trim() === '') {
    throw new Error('No token provided. Please set TOKEN in .env file.');
  }
  if (!config.clientId || config.clientId.trim() === '') {
    throw new Error('No application id provided. Please set CLIENT_ID in .env file.');
  }

  if (!dev || dev.length === 0 || (dev.length === 1 && dev[0] === '0')) {
    throw new Error('Please set at least one developer ID in .env for security. Do not use "0" as a placeholder.');
  }

  config.permissions.admin = process.env['administrator']
    ? [...process.env['administrator'].split(',').filter(v => v.trim() && v !== '0'), ...dev]
    : [...dev];
  config.permissions.trusted = process.env['trusted']
    ? process.env['trusted'].split(',').filter(v => v.trim() && v !== '0')
    : [];
  config.permissions.blacklist = process.env['blacklist']
    ? process.env['blacklist'].split(',').filter(v => v.trim() && v !== '0')
    : [];

  if (!config.permissions.dev.length) {
    throw new Error('No developers provided after filtering.');
  }

  return { ...config, toString: () => `${config.name} - ${version}` };
}
