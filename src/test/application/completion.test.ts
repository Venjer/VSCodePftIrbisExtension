import * as assert from 'assert';
import { completionContextFor, suggestCompletions } from '../../application/completion';

describe('completionContextFor', () => {
  it('распознаёт контекст вызова UNIFOR', () => {
    assert.strictEqual(completionContextFor("&uf("), 'unifor');
    assert.strictEqual(completionContextFor("&unifor("), 'unifor');
    assert.strictEqual(completionContextFor("if p(v200) then &uf("), 'unifor');
  });

  it('распознаёт контекст встроенной функции сразу после &', () => {
    assert.strictEqual(completionContextFor('&'), 'builtin');
  });

  it('иначе возвращает общий контекст', () => {
    assert.strictEqual(completionContextFor('v200'), 'all');
    assert.strictEqual(completionContextFor(''), 'all');
  });
});

describe('suggestCompletions', () => {
  it('в контексте unifor возвращает только функции UNIFOR', () => {
    const items = suggestCompletions("&uf(");
    assert.ok(items.length > 0);
    assert.ok(items.every(item => item.kind === 'function'));
  });

  it('в общем контексте включает и функции, и поля', () => {
    const items = suggestCompletions('');
    assert.ok(items.some(item => item.kind === 'variable'));
    assert.ok(items.some(item => item.kind === 'function'));
  });
});
