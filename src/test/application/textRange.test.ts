import * as assert from 'assert';
import { wordRangeAt } from '../../application/textRange';

describe('wordRangeAt', () => {
  const WORD = /[a-z]+/i;

  it('находит совпадение, содержащее позицию курсора', () => {
    assert.strictEqual(wordRangeAt('foo bar', 1, WORD), 'foo');
    assert.strictEqual(wordRangeAt('foo bar', 5, WORD), 'bar');
  });

  it('включает границы совпадения', () => {
    assert.strictEqual(wordRangeAt('foo bar', 0, WORD), 'foo');
    assert.strictEqual(wordRangeAt('foo bar', 3, WORD), 'foo');
  });

  it('возвращает undefined вне совпадений', () => {
    assert.strictEqual(wordRangeAt('foo bar', 3, WORD), 'foo');
    assert.strictEqual(wordRangeAt('   ', 1, WORD), undefined);
  });

  it('работает с шаблоном без глобального флага', () => {
    const pattern = /&(unifor|uf)\s*\(\s*'[^']*'/i;
    const line = "&uf('+7W100#1')";
    assert.strictEqual(wordRangeAt(line, 2, pattern), "&uf('+7W100#1'");
  });
});
