import * as fs from 'fs';
import * as path from 'path';

function findProjectRoot(from: string): string {
  let dir = from;
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Не удалось найти package.json ни в одном из родительских каталогов');
    }
    dir = parent;
  }
  return dir;
}

export const projectRoot = findProjectRoot(__dirname);

export function fixture(name: string): string {
  return path.join(projectRoot, name);
}

export function readFixture(name: string): string {
  const bytes = fs.readFileSync(fixture(name));
  const encoding = name.endsWith('.pft') ? 'windows-1251' : 'utf-8';
  return new TextDecoder(encoding).decode(bytes);
}
