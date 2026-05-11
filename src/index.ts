import { Client } from './utils/client';
import { getConfig } from './config/config';
import { FancyLogger } from './utils/logger';
import { checkLockfile, createLockfile } from './utils/utils';

const config = getConfig();

FancyLogger.rainbow(['Starting up...\n', 'Powered by Discord.js V14'], {
  title: config.name,
});

if (!process.argv.some(arg => arg.replace(/\\/g, '/').endsWith('src/index.ts'))) {
  FancyLogger.error(
    'This script must be run from the root directory of the project.\nPlease run it using "bun src/index.ts" or "bun run src/index.ts".\n::`' +
      process.argv.join(' ') +
      '`',
  );
  process.exit(1);
}

if (await checkLockfile()) {
  FancyLogger.error('Lockfile found. Please clean up previous instance or delete the lockfile.');
  process.exit(1);
} else {
  createLockfile();
}

const client = new Client();

await client.init();

export { client };

let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  await client.stop(0, 'SIGINT');
});

process.on('SIGTERM', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  await client.stop(0, 'SIGTERM');
});

process.on('uncaughtException', async e => {
  FancyLogger.error('uncaughtException');
  console.error(e);
  if (!isShuttingDown) {
    isShuttingDown = true;
    await client.stop(1, 'uncaughtException');
  }
});

process.on('unhandledRejection', async e => {
  FancyLogger.error('unhandledRejection: ');
  console.error(e);
});
