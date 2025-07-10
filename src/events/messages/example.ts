import type { Message } from 'discord.js';

export function run(message: Message) {
  message.reply('Hello world!');
}
