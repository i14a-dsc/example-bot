import fs from 'fs';
import { getConfig } from '../config/config';

const placeholders: { name: string; value: string }[] = fs.existsSync('data/placeholders.json')
  ? JSON.parse(fs.readFileSync('data/placeholders.json', 'utf-8'))
  : [];

export const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  black: '\x1b[30m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  reset: '\x1b[0m',

  rainbow: '\x1b[38;5;196m',
  rainbow2: '\x1b[38;5;208m',
  rainbow3: '\x1b[38;5;226m',
  rainbow4: '\x1b[38;5;46m',
  rainbow5: '\x1b[38;5;51m',
  rainbow6: '\x1b[38;5;21m',
  rainbow7: '\x1b[38;5;129m',
  gradient1: '\x1b[38;5;204m',
  gradient2: '\x1b[38;5;213m',
  gradient3: '\x1b[38;5;219m',
  gradient4: '\x1b[38;5;225m',
  sparkle: '\x1b[38;5;87m',
  gold: '\x1b[38;5;220m',
  silver: '\x1b[38;5;248m',
  bronze: '\x1b[38;5;130m',
};

export class Placeholder {
  public declare result: string;
  declare noColor: boolean;

  constructor(public value: string | string[] = '', noColor: boolean = false) {
    if (Array.isArray(value)) {
      this.result = value.join('\n');
    } else this.result = value;
    this.noColor = noColor;
  }

  replace(args?: string[]) {
    if (args) {
      args.forEach((arg, index) => {
        this._replace(`%${index + 1}`, arg);
      });
    }

    this._replace('%version', getConfig().version);
    this._replace('%date', new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
    placeholders.forEach(placeholder => {
      this._replace(`%${placeholder.name}`, placeholder.value);
    });
    this._replace('%nl', '\n');
    this._replace('%prefix', getConfig().prefix);
    this._replace('%dev', getConfig().permissions.dev.join(', '));
    if (this.noColor) return this.result;

    this._replace('%red', colors.red);
    this._replace('%green', colors.green);
    this._replace('%yellow', colors.yellow);
    this._replace('%blue', colors.blue);
    this._replace('%magenta', colors.magenta);
    this._replace('%cyan', colors.cyan);
    this._replace('%white', colors.white);
    this._replace('%black', colors.black);
    this._replace('%gray', colors.gray);
    this._replace('%!red', colors.brightRed);
    this._replace('%!green', colors.brightGreen);
    this._replace('%!yellow', colors.brightYellow);
    this._replace('%!blue', colors.brightBlue);
    this._replace('%!magenta', colors.brightMagenta);
    this._replace('%!cyan', colors.brightCyan);
    this._replace('%!white', colors.brightWhite);
    this._replace('%r', colors.reset);

    this._replace('%rainbow', colors.rainbow);
    this._replace('%rainbow2', colors.rainbow2);
    this._replace('%rainbow3', colors.rainbow3);
    this._replace('%rainbow4', colors.rainbow4);
    this._replace('%rainbow5', colors.rainbow5);
    this._replace('%rainbow6', colors.rainbow6);
    this._replace('%rainbow7', colors.rainbow7);
    this._replace('%gradient1', colors.gradient1);
    this._replace('%gradient2', colors.gradient2);
    this._replace('%gradient3', colors.gradient3);
    this._replace('%gradient4', colors.gradient4);
    this._replace('%sparkle', colors.sparkle);
    this._replace('%gold', colors.gold);
    this._replace('%silver', colors.silver);
    this._replace('%bronze', colors.bronze);

    return this.result;
  }

  private _replace(string: string, result: string) {
    this.result = this.result.replaceAll(string, result);
  }
}

/**
 * Replace placeholders in a string or string array with provided arguments and config values.
 * @param {string | string[]} value - The string or array of strings containing placeholders.
 * @param {...string} args - Arguments to replace placeholders.
 * @returns {string} The string with placeholders replaced.
 */
export function replace(value: string | string[], ...args: Array<string>) {
  const placeholder = new Placeholder(value);
  return placeholder.replace(args);
}
