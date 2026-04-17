import { MessageFlags, type Message } from 'discord.js';
import { client } from '../../..';
import { errorComponent } from '../../../utils/components';
import { checkPermission } from '../../../utils/utils';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 10000;

export async function messageCommandHandler(message: Message) {
  const [commandName, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/);

  if (!commandName || commandName.length > 32 || !/^[a-z0-9_-]+$/i.test(commandName)) {
    return;
  }

  if (checkPermission('blacklist', message.author)) {
    return;
  }

  const userId = message.author.id;
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= RATE_LIMIT_MAX) {
        return message.reply('You are being rate limited. Please slow down.').catch();
      }
      userLimit.count++;
    } else {
      rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }
  } else {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  const command = client.messageCommands.get(commandName);
  if (!command) {
    return;
  }

  try {
    await command(message, args);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error while executing message command:', commandName);
    console.error('Error details:', error);
    console.error('User:', message.author.tag, '(', message.author.id, ')');
    console.error('Guild:', message.guild?.name ?? 'Unknown', '(', message.guildId ?? 'N/A', ')');

    await message
      .reply({
        flags: MessageFlags.IsComponentsV2,
        components: errorComponent(
          client.config.development
            ? `An error has occurred: ${errorMsg}`
            : 'An error has occurred in executing your request',
        ),
      })
      .catch(err => console.error('Failed to send error reply:', err));
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of rateLimitMap.entries()) {
    if (now > limit.resetTime + 60000) {
      rateLimitMap.delete(userId);
    }
  }
}, 60000);
