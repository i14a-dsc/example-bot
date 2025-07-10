/**
 * Get the process arguments passed to the script (excluding Node.js/Bun and entry point).
 * Entry point is always src/index.ts.
 * @returns {string[]} The user arguments array.
 */
export function getArgs() {
  const argv = process.argv;
  const entry = './src/index.ts';
  const scriptIndex = argv.findIndex(arg => arg.endsWith(entry));
  if (scriptIndex === -1) {
    return [];
  }
  return argv.slice(scriptIndex + 1);
}
