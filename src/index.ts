/**
 * Entry point for the Discord bot application.
 * Initializes the client and handles process events.
 * @module index
 */
import { Client } from './utils/client.ts';
import { FancyLogger } from './utils/logger.ts';

FancyLogger.rainbow('Starting up...\n\nPowered by Discord.js V14', 'title: 💻 Discord Bot');

if (!process.argv.some(arg => arg.replace(/\\/g, '/').endsWith('src/index.ts'))) {
  FancyLogger.error(
    'This script must be run from the root directory of the project.\nPlease run it using "bun src/index.ts" or "bun run src/index.ts".\n::`' +
      process.argv.join(' ') +
      '`',
  );
  process.exit(1);
}

/**
 * The main bot client instance.
 */
const client = new Client();

await client.init();

export { client };

process.on('SIGINT', async () => {
  await client.stop();
  return false;
});
