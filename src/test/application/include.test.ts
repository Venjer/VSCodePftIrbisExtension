import * as assert from 'assert';
import { includeTargetAt } from '../../application/include';

describe('includeTargetAt', () => {
  it('добавляет .pft, если имя без расширения', () => {
    assert.strictEqual(includeTargetAt('@brief', 2), 'brief.pft');
  });

  it('не трогает имя с явным расширением', () => {
    assert.strictEqual(includeTargetAt('@brief.fst', 2), 'brief.fst');
  });

  it('возвращает undefined вне @include', () => {
    assert.strictEqual(includeTargetAt('v200^a', 2), undefined);
  });
});
