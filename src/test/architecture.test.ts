import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { projectRoot } from './support/paths';

const VSCODE_IMPORT = /from ['"]vscode['"]|require\(['"]vscode['"]\)/;

function listTsFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listTsFiles(full);
    }
    return entry.name.endsWith('.ts') ? [full] : [];
  });
}

describe('архитектурные границы', () => {
  it('domain и application не импортируют vscode', () => {
    const srcRoot = path.join(projectRoot, 'src');
    const files = [
      ...listTsFiles(path.join(srcRoot, 'domain')),
      ...listTsFiles(path.join(srcRoot, 'application'))
    ];
    assert.ok(files.length > 0, 'ожидались файлы в domain/ и application/');

    const offenders = files.filter(file => VSCODE_IMPORT.test(fs.readFileSync(file, 'utf8')));
    assert.deepStrictEqual(offenders, [], `эти файлы импортируют vscode: ${offenders.join(', ')}`);
  });

  it('скомпилированный каталог unifor загружается обычным Node без vscode', () => {
    const compiled = path.join(projectRoot, 'out', 'domain', 'catalog', 'unifor.js');
    assert.ok(fs.existsSync(compiled), `не найден ${compiled} — запустите npm run compile`);
    delete require.cache[require.resolve(compiled)];
    // Путь вычисляется в рантайме, поэтому нужен require, а не статический import.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    assert.doesNotThrow(() => require(compiled));
  });
});
