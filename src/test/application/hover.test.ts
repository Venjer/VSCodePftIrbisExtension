import * as assert from 'assert';
import { resolveHover } from '../../application/hover';

describe('resolveHover', () => {
  it('выбирает самое длинное совпадение кода UNIFOR: +7W побеждает +7', () => {
    const line = "&uf('+7W100#1'),";
    const hover = resolveHover(line, 5);
    assert.ok(hover);
    assert.match(hover!.code, /\+7W/);
    assert.strictEqual(hover!.title, 'Запись глобальной переменной');
  });

  it('нормализует &unifor( к короткой форме перед поиском', () => {
    const line = "&unifor('+7'),";
    const hover = resolveHover(line, 5);
    assert.ok(hover);
    assert.match(hover!.code, /\+7\.\.\./);
  });

  it('резолвит builtin-функцию', () => {
    const line = '&val(v200^a)';
    const hover = resolveHover(line, 2);
    assert.ok(hover);
    assert.strictEqual(hover!.title, 'Числовое значение строки');
  });

  it('резолвит поле и подполе', () => {
    const line = 'v200^a,';
    const hover = resolveHover(line, 2);
    assert.ok(hover);
    assert.match(hover!.title, /Поле 200/);
    assert.match(hover!.body, /Подполе \^a/);
  });

  it('возвращает undefined для неизвестного поля', () => {
    const line = 'v999,';
    assert.strictEqual(resolveHover(line, 2), undefined);
  });

  it('не даёт hover для слова, случайно содержащего keyword-подстроку', () => {
    assert.strictEqual(resolveHover('fifty', 2), undefined);
  });
});
