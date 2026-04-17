import type { Command } from '../../types/command';
import { client } from '../..';
import { ApplicationCommandOptionType, ComponentType } from 'discord.js';
import { separator, textDisplay } from '../../utils/components';
import { simpleGit } from 'simple-git';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { FancyLogger } from '../../utils/logger';

const git = simpleGit();

const emojis = {
  fail: '❌',
  succsess: '✅',
  info: 'ℹ️',
};

export const command: Command = {
  permission: {
    admin: true,
  },
  data: {
    name: 'update',
    description: 'Update the bot from git.',
    type: 1,
    options: [
      {
        name: 'precleanup',
        description: 'Pre clean up bun lockfile before update',
        type: ApplicationCommandOptionType.Boolean,
      },
    ],
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    const start = Date.now();
    const getDuration = () => `-# Took ${(Date.now() - start) / 1000} seconds.`;

    const updateDisplay = async (lines: string[]) => {
      await interaction.editReply({
        components: [
          {
            type: ComponentType.Container,
            components: [textDisplay('# Update'), separator(), textDisplay(lines)],
          },
        ],
      });
    };

    await interaction.reply({
      flags: [64, 32768],
      components: [
        {
          type: ComponentType.Container,
          components: [textDisplay('# Update'), separator(), textDisplay(`${emojis.info} Update in progress...`)],
        },
      ],
    });

    try {
      const precleanup = interaction.options.getBoolean('precleanup') ?? false;
      if (precleanup) {
        await updateDisplay([`${emojis.info} Pre Cleaning up...`]);
        try {
          if (existsSync('bun.lockb')) await unlink('bun.lockb');
          if (existsSync('bun.lock')) await unlink('bun.lock');
        } catch (unlinkErr) {
          FancyLogger.error('Failed to delete lockfile');
          console.error(unlinkErr);
          await updateDisplay(['Failed to delete lockfile. Continuing anyway...', `${emojis.info} Pulling updates...`]);
        }
      }

      await updateDisplay([`${emojis.info} Checking git status...`]);
      const status = await git.status();

      if (!status.isClean()) {
        await updateDisplay([
          'Working directory is not clean.',
          'Please commit or stash your changes first.',
          `${emojis.fail} Update Aborted.`,
          getDuration(),
        ]);
        return;
      }

      await updateDisplay([`${emojis.info} Fetching updates...`]);
      await git.fetch();

      const currentBranch = status.current;
      if (!currentBranch) {
        await updateDisplay(['Could not determine current branch.', `${emojis.fail} Update Aborted.`, getDuration()]);
        return;
      }

      const log = await git.log([`HEAD..origin/${currentBranch}`]);
      if (log.total === 0) {
        await updateDisplay(['Already up to date.', `${emojis.succsess} No updates needed.`, getDuration()]);
        return;
      }

      await updateDisplay([`${emojis.info} Pulling ${log.total} update(s)...`]);
      const pullResult = await git.pull();

      if (pullResult.files.length === 0) {
        await updateDisplay(['Already up to date.', `${emojis.fail} Update Aborted.`, getDuration()]);
        return;
      }
    } catch (err) {
      const msg = (err as Error).message;
      let errorDetail = 'Unknown error occurred.';

      if (msg.includes('Merge conflict') || msg.includes('CONFLICT')) {
        errorDetail = 'Merge conflict occurred. Please resolve manually and restart the bot.';
      } else if (msg.includes('Authentication failed') || msg.includes('could not read Username')) {
        errorDetail = 'Authentication failed. Check your git credentials.';
      } else if (msg.includes('Could not resolve host')) {
        errorDetail = 'Could not resolve host. Check your network connection.';
      } else if (msg.includes('not a git repository')) {
        errorDetail = 'Not a git repository. Update command requires git.';
      } else if (msg.includes('Permission denied')) {
        errorDetail = 'Permission denied. Check file permissions.';
      } else {
        errorDetail = `Error: ${msg.substring(0, 100)}`;
      }

      await updateDisplay([errorDetail, `${emojis.fail} Update Aborted.`, getDuration()]);
      console.error('Git Error:', msg);
      return;
    }

    await updateDisplay([`${emojis.info} Finalizing...`]);

    await updateDisplay([`${emojis.succsess} Update successfully!`, 'Restarting...', getDuration()]);

    setTimeout(() => {
      client.stop();
    }, 1000);
  },
};
