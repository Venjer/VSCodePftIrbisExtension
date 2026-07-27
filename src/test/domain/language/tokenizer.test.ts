import * as assert from 'assert';
import { tokenize } from '../../../domain/language/tokenizer';

describe('tokenize', () => {
  it('трактует /* как комментарий до конца строки', () => {
    const tokens = tokenize('/* коммент fi\nv200');
    assert.strictEqual(tokens[0].type, 'comment');
    assert.strictEqual(tokens[0].text, '/* коммент fi');
    assert.ok(tokens.every(token => token.keyword !== 'fi'));
  });

  it('не принимает ключевые слова внутри литералов', () => {
    const tokens = tokenize("'if then fi'");
    assert.strictEqual(tokens.length, 1);
    assert.strictEqual(tokens[0].type, 'literal');
  });

  it('распознаёт повторяющийся литерал с завершающим разделителем', () => {
    const tokens = tokenize('|; |+v700');
    assert.strictEqual(tokens[0].text, '|; |+');
  });

  it('помечает незакрытый литерал', () => {
    const tokens = tokenize("'без пары\nv200");
    assert.strictEqual(tokens[0].unterminated, true);
  });

  it('не считает ключевым словом часть другого слова', () => {
    const tokens = tokenize('fifty');
    assert.strictEqual(tokens[0].type, 'other');
  });

  it('распознаёт ключевые слова независимо от регистра', () => {
    const tokens = tokenize('IF p(v200) THEN v200 FI');
    const keywords = tokens.filter(token => token.type === 'keyword').map(token => token.keyword);
    assert.deepStrictEqual(keywords, ['if', 'then', 'fi']);
  });
});
