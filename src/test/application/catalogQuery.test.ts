import * as assert from 'assert';
import { listCategories, listFunctions, findPick, uncoveredCategories } from '../../application/catalogQuery';

describe('catalogQuery', () => {
  it('каждая категория непуста', () => {
    for (const category of listCategories()) {
      assert.ok(listFunctions(category.id).length > 0, `категория ${category.id} пуста`);
    }
  });

  it('findPick находит функцию по метке внутри категории', () => {
    const pick = findPick('builtins', 'val');
    assert.ok(pick);
    assert.strictEqual(pick!.detail, 'Числовое значение строки');
  });

  it('findPick возвращает undefined для неизвестной метки', () => {
    assert.strictEqual(findPick('builtins', 'нет такой'), undefined);
  });

  it('все категории данных UNIFOR покрыты русскими названиями', () => {
    assert.deepStrictEqual(uncoveredCategories(), []);
  });
});
