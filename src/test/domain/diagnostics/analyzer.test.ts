import * as assert from 'assert';
import { findProblems } from '../../../domain/diagnostics/analyzer';
import { readFixture } from '../../support/paths';

describe('findProblems', () => {
  it('не находит проблем в корректном формате', () => {
    assert.deepStrictEqual(findProblems("if p(v200) then v200^a, ': ' fi"), []);
  });

  it('находит незакрытый if', () => {
    const problems = findProblems('if p(v200) then v200^a');
    assert.strictEqual(problems.length, 1);
    assert.match(problems[0].message, /не закрыта/);
  });

  it('находит лишний fi', () => {
    const problems = findProblems('v200 fi');
    assert.strictEqual(problems.length, 1);
    assert.match(problems[0].message, /без соответствующего/);
  });

  it('находит незакрытую скобку', () => {
    const problems = findProblems('if p(v200 then v200 fi');
    assert.ok(problems.some(problem => problem.message === 'Незакрытая скобка'));
  });

  it('находит незакрытый литерал', () => {
    const problems = findProblems("v200, 'без пары\nv700");
    assert.ok(problems.some(problem => problem.message.startsWith('Незакрытый литерал')));
  });

  it('не считает проблемой ключевые слова внутри комментариев', () => {
    assert.deepStrictEqual(findProblems('/* fi ( без пары'), []);
  });

  it('example.pft не содержит проблем', () => {
    assert.deepStrictEqual(findProblems(readFixture('example.pft')), []);
  });
});
