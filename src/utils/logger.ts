import { client } from '../';
import { getGuildSettings } from './guildSettings';
import type { Guild, EmbedBuilder } from 'discord.js';
import boxen from 'boxen';
import chalk from 'chalk';
import { replace } from './placeholder';
import { getConfig } from '../config/config';

export async function logEvent(guild: Guild, embed: EmbedBuilder) {
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
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.success('Success!');
   * FancyLogger.success('Success: {0}', 'Save data', 'title:🎊 Successfully!');
   */
  static success(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
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
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.info('An info message');
   * FancyLogger.info('Info: {0}', 'Version 1.0', 'title:My Info');
   */
  static info(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
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
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.warning('Be careful!');
   * FancyLogger.warning('Warning: {0}', 'Low battery', 'title:⚡ Caution');
   */
  static warning(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
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
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.error('An error has occurred');
   * FancyLogger.error('Failed: {0}', 'Connection', 'title:Fatal Error');
   */
  static error(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
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
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.rainbow('Rainbow');
   * FancyLogger.rainbow('Colorful: {0}', 'Text', 'title:🌈 Custom');
   */
  static rainbow(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
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
   * Log the message with a gradient box.
   *
   * @param message Message string or array
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.gradient('Gradient');
   * FancyLogger.gradient('Custom: {0}', 'Gradient', 'title:🎨 Custom');
   */
  static gradient(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
    const gradientColors = [
      chalk.hex('#FF6B6B'),
      chalk.hex('#4ECDC4'),
      chalk.hex('#45B7D1'),
      chalk.hex('#96CEB4'),
      chalk.hex('#FFEAA7'),
      chalk.hex('#DDA0DD'),
    ];
    let gradientContent: string;
    if (gradientColors.length === 0) {
      gradientContent = content;
    } else {
      gradientContent = content
        .split('')
        .map((char, index) => {
          const colorFn = gradientColors[index % gradientColors.length];
          return colorFn ? colorFn(char) : char;
        })
        .join('');
    }

    const boxedMessage = boxen(gradientContent, {
      padding: 1,
      margin: 1,
      borderStyle: 'bold',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a',
      title: title ?? chalk.cyan.bold('🎨 GRADIENT'),
      titleAlignment: 'center',
    });
    console.log(boxedMessage);
  }

  /**
   * with a sparkle effect.
   *
   * @param message Message string or array
   * @param args Placeholder replacement arguments, or the last argument if it starts with `title:`
   * @example
   * FancyLogger.sparkle('Sparkle!');
   * FancyLogger.sparkle('Placeholder: {0}', 'Event', 'title:⭐ Custom title');
   */
  static sparkle(message: string | string[], ...args: any[]) {
    let title: string | undefined;
    if (typeof args[args.length - 1] === 'string' && args[args.length - 1].startsWith('title:')) {
      title = args.pop().replace(/^title:/, '');
    }
    const content = replace(message, ...args);
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
