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

  it('резолвит MNU-справочник в &uf(\'K...\\\')', () => {
    const line = "'Язык: ', &uf('Klang.mnu\\', v101)";
    assert.strictEqual(includeTargetAt(line, line.indexOf('lang')), 'lang.mnu');
  });

  it('добавляет .mnu, если имя справочника без расширения', () => {
    const line = "&uf('Kdict!', v1)";
    assert.strictEqual(includeTargetAt(line, line.indexOf('dict')), 'dict.mnu');
  });

  it('резолвит именованный формат в &uf(\'6...\')', () => {
    const line = "&uf('6brief')";
    assert.strictEqual(includeTargetAt(line, line.indexOf('brief')), 'brief.pft');
  });

  it('не трогает имя формата с явным расширением', () => {
    const line = "&uf('6report.pft')";
    assert.strictEqual(includeTargetAt(line, line.indexOf('report')), 'report.pft');
  });
});
