import * as assert from 'assert';
import { FIELD_DEFINITIONS, findField, findSubfield } from '../../../domain/catalog/marcFields';

describe('FIELD_DEFINITIONS', () => {
  it('номера полей уникальны и трёхзначны', () => {
    const numbers = FIELD_DEFINITIONS.map(field => field.number);
    assert.deepStrictEqual(new Set(numbers).size, numbers.length);
    for (const number of numbers) {
      assert.match(number, /^\d{3}$/, `номер поля не трёхзначный: ${number}`);
    }
  });

  it('name и description непусты', () => {
    for (const field of FIELD_DEFINITIONS) {
      assert.ok(field.name.length > 0, `пустое name у поля ${field.number}`);
      assert.ok(field.description.length > 0, `пустое description у поля ${field.number}`);
    }
  });

  it('ключи подполей односимвольны', () => {
    for (const field of FIELD_DEFINITIONS) {
      for (const key of Object.keys(field.subfields ?? {})) {
        assert.strictEqual(key.length, 1, `ключ подполя не односимвольный у поля ${field.number}: ${key}`);
      }
    }
  });
});

describe('findField / findSubfield', () => {
  it('находит существующее поле и подполе', () => {
    const field = findField('200');
    assert.ok(field);
    assert.strictEqual(findSubfield('200', 'a'), 'Основное заглавие');
  });

  it('возвращает undefined для неизвестного поля', () => {
    assert.strictEqual(findField('999'), undefined);
    assert.strictEqual(findSubfield('999', 'a'), undefined);
  });
});
