export function getArgs() {
  const argv = process.argv;
  const entry = './src/index.ts';
  const scriptIndex = argv.findIndex(arg => arg.endsWith(entry));
  if (scriptIndex === -1) {
    return [];
  }
  return argv.slice(scriptIndex + 1);
}
