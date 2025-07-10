import { exec, execSync } from 'child_process';
import type { Command } from '../../types/command';
import { client } from '../..';
import { ComponentType } from 'discord.js';
import { errorComponent, separator, textDisplay } from '../../utils/components';
import { checkPermission } from '../../utils/utils';

const emojis = {
  fail: '❌',
  succsess: '✅',
  info: 'ℹ️',
};

export const command: Command = {
  data: {
    name: 'update',
    description: 'Update the bot from git.',
    type: 1,
    contexts: [0, 1, 2],
    integration_types: [0, 1],
  },
  run: async interaction => {
    if (!checkPermission('admin', interaction.user)) {
      await interaction.reply({
        components: errorComponent('You do not have permission to use this command.'),
        flags: [64, 32768],
      });
      return;
    }
    const start = Date.now();
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
      await interaction.editReply({
        components: [
          {
            type: ComponentType.Container,
            components: [textDisplay('# Update'), separator(), textDisplay(`${emojis.info} Fetching updates...`)],
          },
        ],
      });
      execSync('rm -rf bun.lockb bun.lock', { stdio: 'inherit' });
      const child = await exec('git pull');
      const output = await new Promise<string>((resolve, reject) => {
        let data = '';
        child.stdout?.on('data', chunk => (data += chunk));
        child.stdout?.on('end', () => resolve(data));
        child.stdout?.on('error', reject);
      });

      console.log(output);

      if (output.includes('Already up to date.')) {
        await interaction.editReply({
          components: [
            {
              type: ComponentType.Container,
              components: [
                textDisplay('# Update'),
                separator(),
                textDisplay([
                  'Already up to date.',
                  `${emojis.fail} Update Aborted.`,
                  `-# Took ${(Date.now() - start) / 1000} seconds.`,
                ]),
              ],
            },
          ],
        });
        return;
      }
      if (output.includes('CONFLICT')) {
        await interaction.editReply({
          components: [
            {
              type: ComponentType.Container,
              components: [
                textDisplay('# Update'),
                separator(),
                textDisplay([
                  'Merge conflict occurred. Please resolve the conflict and commit the changes.',
                  `${emojis.fail} Update Aborted.`,
                  `-#Took ${(Date.now() - start) / 1000} seconds.`,
                ]),
              ],
            },
          ],
        });
        return;
      }
      if (output.includes('error')) {
        await interaction.editReply({
          components: [
            {
              type: ComponentType.Container,
              components: [
                textDisplay('# Update'),
                separator(),
                textDisplay([
                  'Update failed.',
                  `${emojis.fail} Unknown error occurred while fetching updates.`,
                  `-# Took ${(Date.now() - start) / 1000} seconds.`,
                ]),
              ],
            },
          ],
        });
        return;
      }
    } catch (e) {
      console.error(e);
      await interaction.editReply({
        components: [
          {
            type: ComponentType.Container,
            components: [
              textDisplay('# Update'),
              separator(),
              textDisplay([
                ' Update failed.',
                `${emojis.fail} Unknown error occurred while fetching updates.`,
                `-# Took ${(Date.now() - start) / 1000} seconds.`,
              ]),
            ],
          },
        ],
      });
      return;
    }
    await interaction.editReply({
      components: [
        {
          type: ComponentType.Container,
          components: [textDisplay('# Update'), separator(), textDisplay(`${emojis.info} Linting...`)],
        },
      ],
    });
    try {
      execSync('bun run lint', { stdio: 'inherit' });
    } catch (e) {
      console.error(e);
      await interaction.editReply({
        components: [
          {
            type: ComponentType.Container,
            components: [
              textDisplay('# Update'),
              separator(),
              textDisplay([
                'Update failed.',
                `${emojis.fail} Unknown error occurred while linting.\nCheck the console for more details.`,
                `-# Took ${(Date.now() - start) / 1000} seconds.`,
              ]),
            ],
          },
        ],
      });
      return;
    }
    interaction.editReply({
      components: [
        {
          type: ComponentType.Container,
          components: [
            textDisplay('# Update'),
            separator(),
            textDisplay([
              `${emojis.succsess} Update successfully!`,
              'Restarting...',
              `-# Took ${(Date.now() - start) / 1000} seconds`,
            ]),
          ],
        },
      ],
    });
    client.stop();
  },
};
