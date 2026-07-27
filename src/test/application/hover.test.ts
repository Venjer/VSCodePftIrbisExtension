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

  it('резолвит p() как проверку присутствия поля', () => {
    const line = 'if p(v200) then';
    const hover = resolveHover(line, 4);
    assert.ok(hover);
    assert.strictEqual(hover!.title, 'Проверка присутствия поля/подполя');
  });

  it('резолвит a() как проверку отсутствия поля', () => {
    const line = 'if a(v200) then';
    const hover = resolveHover(line, 4);
    assert.ok(hover);
    assert.strictEqual(hover!.title, 'Проверка отсутствия поля/подполя');
  });

  it('не путает "a" внутри builtin-функции с проверкой отсутствия', () => {
    const line = '&val(v200^a)';
    const hover = resolveHover(line, 2);
    assert.ok(hover);
    assert.strictEqual(hover!.title, 'Числовое значение строки');
  });

  it('резолвит builtin-функцию без &: f(rsum(v215^a),0,0)', () => {
    const line = 'f(rsum(v215^a),0,0)';
    const rsumHover = resolveHover(line, line.indexOf('rsum') + 1);
    assert.ok(rsumHover);
    assert.strictEqual(rsumHover!.title, 'Сумма чисел подформата');

    const fHover = resolveHover(line, 0);
    assert.ok(fHover);
    assert.strictEqual(fHover!.title, 'Форматирование числа');
  });

  it('code в hover для builtin-функции отражает фактическое написание', () => {
    const withAmp = resolveHover('&val(v200)', 1);
    assert.ok(withAmp);
    assert.strictEqual(withAmp!.code, '&val(...)');

    const bare = resolveHover('val(v200)', 0);
    assert.ok(bare);
    assert.strictEqual(bare!.code, 'val(...)');
  });

  it('не даёт hover для слова, случайно содержащего keyword-подстроку', () => {
    assert.strictEqual(resolveHover('fifty', 2), undefined);
  });

  it('резолвит break с предупреждением про группу/if', () => {
    const line = "(if p(v910^d) then break fi)";
    const hover = resolveHover(line, line.indexOf('break') + 1);
    assert.ok(hover);
    assert.strictEqual(hover!.title, 'Прервать выполнение');
    assert.match(hover!.body, /if/);
  });

  it('резолвит базовые ключевые слова if/then/else/fi/and/or/not', () => {
    const line = 'if p(v200) and p(v210) then v200 else v210 fi or not p(v220)';
    const cases: [string, string][] = [
      ['if', 'Условная конструкция'],
      ['then', 'Ветка условия'],
      ['else', 'Альтернативная ветка условия'],
      ['fi', 'Конец условной конструкции'],
      ['and', 'Логическое И'],
      ['or', 'Логическое ИЛИ'],
      ['not', 'Логическое отрицание']
    ];
    for (const [word, title] of cases) {
      const index = line.indexOf(word);
      const hover = resolveHover(line, index + 1);
      assert.ok(hover, `нет hover для ${word}`);
      assert.strictEqual(hover!.title, title, `неверный title для ${word}`);
    }
  });

  it('резолвит оператор "содержит" (:) и не путает с = рядом', () => {
    const line = "v200:'text', v210='x'";
    const contains = resolveHover(line, line.indexOf(':'));
    assert.ok(contains);
    assert.strictEqual(contains!.title, 'Содержит');

    const equals = resolveHover(line, line.indexOf('='));
    assert.ok(equals);
    assert.strictEqual(equals!.title, 'Равенство');
  });

  it('резолвит v200^a*3.5 с разбором подполя/смещения/длины', () => {
    const line = 'v200^a*3.5';
    const hover = resolveHover(line, 0);
    assert.ok(hover);
    assert.strictEqual(hover!.title, 'Значение поля');
    assert.match(hover!.body, /\^a/);
    assert.match(hover!.body, /\*3/);
    assert.match(hover!.body, /\.5/);
  });

  it('для v200 без ^/*/. не добавляет лишних абзацев', () => {
    const hover = resolveHover('v200', 0);
    assert.ok(hover);
    assert.strictEqual(hover!.body.includes('подполе'), false);
    assert.strictEqual(hover!.body.includes('смещение'), false);
    assert.strictEqual(hover!.body.includes('длина'), false);
  });

  it('резолвит d200/n200 с указанием на отсутствие вывода текста', () => {
    const dHover = resolveHover('d200', 0);
    assert.ok(dHover);
    assert.strictEqual(dHover!.title, 'Проверка присутствия поля/подполя');
    assert.match(dHover!.body, /не выводит текст/);

    const nHover = resolveHover('n200', 0);
    assert.ok(nHover);
    assert.strictEqual(nHover!.title, 'Проверка отсутствия поля/подполя');
    assert.match(nHover!.body, /текста не выводит/);
  });
});
