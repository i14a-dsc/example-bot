import type { AutocompleteInteraction } from 'discord.js';
import { client } from '../../..';

const autocompleteRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const AUTOCOMPLETE_RATE_LIMIT_MAX = 20;
const AUTOCOMPLETE_RATE_LIMIT_WINDOW = 5000;

export async function autoCompleteHandler(interaction: AutocompleteInteraction) {
  const userId = interaction.user.id;
  const now = Date.now();
  const userLimit = autocompleteRateLimitMap.get(userId);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= AUTOCOMPLETE_RATE_LIMIT_MAX) {
        return interaction.respond([]).catch(console.error);
      }
      userLimit.count++;
    } else {
      autocompleteRateLimitMap.set(userId, { count: 1, resetTime: now + AUTOCOMPLETE_RATE_LIMIT_WINDOW });
    }
  } else {
    autocompleteRateLimitMap.set(userId, { count: 1, resetTime: now + AUTOCOMPLETE_RATE_LIMIT_WINDOW });
  }

  const complete = client.completes.get(interaction.commandName);
  if (!complete) {
    return client.config.development ? console.error('Autocomplete not found:', interaction.commandName) : void 0;
  }

  try {
    await complete(interaction);
  } catch (error) {
    console.error('Error while executing complete: ', interaction.commandName, '\n', error);
    if (!interaction.responded) {
      await interaction.respond([]).catch(console.error);
    }
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of autocompleteRateLimitMap.entries()) {
    if (now > limit.resetTime + 60000) {
      autocompleteRateLimitMap.delete(userId);
    }
  }
}, 60000);
