import * as assert from 'assert';
import { BUILTIN_FUNCTIONS, findBuiltin } from '../../../domain/catalog/builtins';

describe('BUILTIN_FUNCTIONS', () => {
  it('содержит ровно 9 записей', () => {
    assert.strictEqual(BUILTIN_FUNCTIONS.length, 9);
  });

  it('метки уникальны и в нижнем регистре', () => {
    const labels = BUILTIN_FUNCTIONS.map(func => func.label);
    assert.deepStrictEqual(new Set(labels).size, labels.length);
    for (const label of labels) {
      assert.match(label, /^[a-z]+$/, `метка не в нижнем регистре: ${label}`);
    }
  });

  it('detail и documentation непусты', () => {
    for (const func of BUILTIN_FUNCTIONS) {
      assert.ok(func.detail.length > 0, `пустой detail у ${func.label}`);
      assert.ok(func.documentation.length > 0, `пустая documentation у ${func.label}`);
    }
  });

  it('snippet начинается с "метка("', () => {
    for (const func of BUILTIN_FUNCTIONS) {
      assert.ok(func.snippet.startsWith(`${func.label}(`), `snippet не начинается с ${func.label}(: ${func.snippet}`);
    }
  });
});

describe('findBuiltin', () => {
  it('регистронезависим', () => {
    assert.strictEqual(findBuiltin('VAL')?.label, 'val');
    assert.strictEqual(findBuiltin('Val')?.label, 'val');
  });

  it('возвращает undefined для неизвестного имени', () => {
    assert.strictEqual(findBuiltin('нет_такой_функции'), undefined);
  });
});
