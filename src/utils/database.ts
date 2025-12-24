import fs from 'fs';

/**
 * Simple file-based key-value database using JSON for storage.
 */
export class DataBase {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private data: any;
  private path: string;

  constructor(path: string) {
    this.path = path;
    this.data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf-8')) : {};
  }

  get(key: string) {
    return this.data[key];
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  set(key: string, value: any) {
    this.data[key] = value;
  }

  delete(key: string) {
    delete this.data[key];
  }

  has(key: string) {
    return this.data[key] !== undefined;
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }

  reload() {
    this.data = fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path, 'utf-8')) : {};
  }
}
