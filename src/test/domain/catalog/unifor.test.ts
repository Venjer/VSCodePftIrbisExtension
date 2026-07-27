import * as assert from 'assert';
import { UNIFOR_FUNCTIONS, getUniforCategories } from '../../../domain/catalog/unifor';
import { UNIFOR_CATEGORIES } from '../../../domain/catalog/types';

describe('UNIFOR_FUNCTIONS', () => {
  it('содержит ровно 78 записей', () => {
    // Растяжка намеренная: любое изменение количества функций должно быть
    // осознанным и подтверждаться правкой этого числа, а не проскакивать незамеченным.
    assert.strictEqual(UNIFOR_FUNCTIONS.length, 78);
  });

  it('метки уникальны', () => {
    const seen = new Map<string, number>();
    for (const func of UNIFOR_FUNCTIONS) {
      seen.set(func.label, (seen.get(func.label) ?? 0) + 1);
    }
    const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([label]) => label);
    assert.deepStrictEqual(duplicates, []);
  });

  it('каждая метка имеет форму uf(\'...', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      assert.match(func.label, /^uf\('.+/, `метка не в ожидаемой форме: ${func.label}`);
    }
  });

  it('detail и documentation непусты и без лишних пробелов по краям', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      assert.ok(func.detail.length > 0, `пустой detail у ${func.label}`);
      assert.ok(func.documentation.length > 0, `пустая documentation у ${func.label}`);
      assert.strictEqual(func.detail, func.detail.trim(), `detail с пробелами по краям у ${func.label}`);
      assert.strictEqual(func.documentation, func.documentation.trim(), `documentation с пробелами по краям у ${func.label}`);
    }
  });

  it('category принадлежит известному набору, и каждая категория непуста', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      assert.ok(
        (UNIFOR_CATEGORIES as readonly string[]).includes(func.category),
        `неизвестная категория ${func.category} у ${func.label}`
      );
    }
    for (const category of UNIFOR_CATEGORIES) {
      assert.ok(
        UNIFOR_FUNCTIONS.some(func => func.category === category),
        `категория без единой записи: ${category}`
      );
    }
  });

  it('getUniforCategories() совпадает с UNIFOR_CATEGORIES', () => {
    const actual = new Set(getUniforCategories());
    const expected = new Set(UNIFOR_CATEGORIES as readonly string[]);
    assert.deepStrictEqual(actual, expected);
  });

  it('snippet начинается с метки функции', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      assert.ok(func.snippet.startsWith(func.label), `snippet не начинается с метки у ${func.label}: ${func.snippet}`);
    }
  });

  it('snippet заканчивается закрытием вызова \')', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      assert.ok(func.snippet.endsWith("')"), `snippet не закрыт ')' у ${func.label}: ${func.snippet}`);
    }
  });

  it('плейсхолдеры сниппета синтаксически корректны', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      const s = func.snippet;

      // Каждое "${" должно немедленно продолжаться цифрой номера табстопа.
      for (const match of s.matchAll(/\$\{/g)) {
        assert.match(s[match.index! + 2] ?? '', /\d/, `"\${" без номера у ${func.label}: ${s}`);
      }

      // Фигурные скобки сбалансированы (в данных нет фигурных скобок вне плейсхолдеров).
      const open = (s.match(/\{/g) || []).length;
      const close = (s.match(/\}/g) || []).length;
      assert.strictEqual(open, close, `несбалансированные скобки у ${func.label}: ${s}`);
    }
  });

  it('номера плейсхолдеров образуют непрерывный ряд с 1 (учитывая вложенные)', () => {
    for (const func of UNIFOR_FUNCTIONS) {
      const indices = [...new Set(
        [...func.snippet.matchAll(/\$\{(\d+)/g)].map(match => Number(match[1]))
      )].sort((a, b) => a - b);

      const contiguous = indices.every((value, position) => value === position + 1);
      assert.ok(contiguous, `номера табстопов не образуют непрерывный ряд у ${func.label}: [${indices}]`);
    }
  });
});
