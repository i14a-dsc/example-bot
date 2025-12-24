import { client } from '..';
import { getGuildSettings } from './guildSettings';
import type { Guild, EmbedBuilder } from 'discord.js';
import boxen from 'boxen';
import chalk from 'chalk';
import { replace } from './placeholder';
import { getConfig } from '../config/config';
import type { FancyLoggerOptions } from '../types/api';

export async function logEvent(guild: Guild, embed: EmbedBuilder): Promise<void> {
  const settings = await getGuildSettings(guild.id);
  if (!settings.logChannel) {
    return;
  }

  try {
    const logChannel = await client.channels.fetch(settings.logChannel);
    if (logChannel?.isSendable()) {
      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error(`Failed to send log to channel ${settings.logChannel} in guild ${guild.id}:`, error);
  }
}

export class FancyLogger {
  /**
   * Log with green color box.
   * @param message Message string or array
   * @param title The title of message
   * @example
   * FancyLogger.success('Success!');
   */
  static success(message: string | string[], options?: FancyLoggerOptions) {
    const { title } = options ?? {};
    const content = replace(message);
    const boxedMessage = boxen(chalk.green.bold(content), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.green.bold('✅ SUCCESS'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * Log with blue color box.
   *
   * @param message Message string or array
   * @param title The title of message
   * @example
   * FancyLogger.info('An info message');
   */
  static info(message: string | string[], options?: FancyLoggerOptions) {
    const { title } = options ?? {};
    const content = replace(message);
    const boxedMessage = boxen(chalk.blue.bold(content), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'blue',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.blue.bold('ℹ️  INFO'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * Log with yellow color box.
   *
   * @param message Message string or array
   * @param title The title of message
   * @example
   * FancyLogger.warning('Be careful!');
   */
  static warning(message: string | string[], options?: FancyLoggerOptions) {
    const { title } = options ?? {};
    const content = replace(message);
    const boxedMessage = boxen(chalk.yellow.bold(content), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.yellow.bold('⚠️  WARNING'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * Log with red color box.
   *
   * @param message Message string or array
   * @param title The title of message
   * @example
   * FancyLogger.error(['An error has occurred');
   */
  static error(message: string | string[], options?: FancyLoggerOptions) {
    const { title } = options ?? {};
    const content = replace(message);
    const boxedMessage = boxen(chalk.red.bold(content), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.red.bold('❌ ERROR'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * Log with rainbow colors
   * @param message Message string or array
   * @param title The title of message
   * @example
   * FancyLogger.rainbow('Rainbow');
   */
  static rainbow(message: string | string[], options?: FancyLoggerOptions) {
    const { title } = options ?? {};
    const content = replace(message);
    const rainbowColors = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.blue, chalk.magenta];
    let rainbowContent: string;
    if (rainbowColors.length === 0) {
      rainbowContent = content;
    } else {
      rainbowContent = content
        .split('')
        .map((char, index) => {
          const colorFn = rainbowColors[index % rainbowColors.length];
          return colorFn ? colorFn(char) : char;
        })
        .join('');
    }

    const boxedMessage = boxen(rainbowContent, {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'magenta',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.magenta.bold('🌈 RAINBOW'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * with a sparkle effect.
   *
   * @param message Message string or array
   * @param title The title of message
   * @example
   * FancyLogger.sparkle('Sparkle!');
   */
  static sparkle(message: string | string[], options?: FancyLoggerOptions) {
    const { title } = options ?? {};
    const content = replace(message);
    const sparkleContent = `✨ ${content} ✨`;
    const boxedMessage = boxen(chalk.cyan.bold(sparkleContent), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.cyan.bold('⭐ SPARKLE'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  static botReady(
    username: string,
    stats: {
      buttons: number;
      commands: number;
      messageCommands: number;
      modals: number;
      selectMenus: number;
    },
  ) {
    const content = [
      chalk.cyan.bold(`🤖 ${getConfig().name}`),
      '',
      chalk.white(`👤 Logged in as: ${chalk.blue.bold(username)}`),
      chalk.white(`📅 Date: ${chalk.blue.bold(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }))}`),
      chalk.white(`🔢 Version: ${chalk.blue.bold(getConfig().version)}`),
      '',
      chalk.yellow.bold('📊 Bot Statistics:'),
      chalk.white(`  🎯 Buttons: ${chalk.green.bold(stats.buttons)}`),
      chalk.white(`  ⚡ Commands: ${chalk.green.bold(stats.commands)}`),
      chalk.white(`  💬 Message Commands: ${chalk.green.bold(stats.messageCommands)}`),
      chalk.white(`  📝 Modals: ${chalk.green.bold(stats.modals)}`),
      chalk.white(`  📋 Select Menus: ${chalk.green.bold(stats.selectMenus)}`),
      '',
      chalk.green.bold('🚀 Successfuly started!'),
    ].join('\n');

    const boxedMessage = boxen(content, {
      padding: 2,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green',
      backgroundColor: '#1a1a1a',
      title: chalk.green.bold('🎉 BOT READY'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * The log is output as a loading message in a box.
   * @param message Message to be output
   * @param title Title to be output (optional)
   * @example
   * FancyLogger.loading('Loading...');
   * FancyLogger.loading('Please wait...', '🔥 LOADING');
   */
  static loading(message: string, title?: string) {
    const content = chalk.yellow.bold(`⏳ ${message}...`);
    const boxedMessage = boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.yellow.bold('🔄 LOADING'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }
}
