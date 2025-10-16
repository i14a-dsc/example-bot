/**
 * Entry point for the Discord bot application.
 * Initializes the client and handles process events.
 * @module index
 */
import { Client } from './utils/client';
import { getConfig } from './config/config';
import { FancyLogger } from './utils/logger';
import { checkLockfile, createLockfile } from './utils/utils';

FancyLogger.rainbow(['Starting up...\n', 'Powered by Discord.js V14'], `title:${getConfig().name}`);

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

process.on('SIGINT', async () => {
  await client.stop();
  return false;
});
