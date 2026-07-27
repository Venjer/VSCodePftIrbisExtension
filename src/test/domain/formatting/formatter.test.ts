import * as assert from 'assert';
import { formatText } from '../../../domain/formatting/formatter';

describe('formatText', () => {
  it('расставляет отступы по вложенности if/fi', () => {
    const source = 'if p(v200) then\nv200^a\nfi';
    assert.strictEqual(formatText(source, '  '), 'if p(v200) then\n  v200^a\nfi');
  });

  it('отступает вложенные группы в скобках', () => {
    const source = 'if p(v700) then\n(v700^a,\n\'; \')\nfi';
    assert.strictEqual(formatText(source, '  '), 'if p(v700) then\n  (v700^a,\n    \'; \')\nfi');
  });

  it('выравнивает else на уровень if', () => {
    const source = 'if p(v200) then\n\'да\'\nelse\n\'нет\'\nfi';
    assert.strictEqual(formatText(source, '  '), 'if p(v200) then\n  \'да\'\nelse\n  \'нет\'\nfi');
  });

  it('не меняет содержимое литералов и комментариев', () => {
    const source = "/* fi ( внутри комментария\n'fi ( внутри литерала'";
    assert.strictEqual(formatText(source, '  '), source);
  });

  it('сохраняет пустые строки', () => {
    assert.strictEqual(formatText('v200\n\nv700', '  '), 'v200\n\nv700');
  });

  it('без явного eol сохраняет CRLF исходного текста', () => {
    const source = 'if p(v200) then\r\nv200^a\r\nfi';
    assert.strictEqual(formatText(source, '  '), 'if p(v200) then\r\n  v200^a\r\nfi');
  });

  it('без явного eol сохраняет LF исходного текста', () => {
    const source = 'if p(v200) then\nv200^a\nfi';
    assert.strictEqual(formatText(source, '  '), 'if p(v200) then\n  v200^a\nfi');
  });

  it('явный eol переопределяет перевод строк LF-текста на CRLF', () => {
    const source = 'if p(v200) then\nv200^a\nfi';
    assert.strictEqual(formatText(source, '  ', '\r\n'), 'if p(v200) then\r\n  v200^a\r\nfi');
  });
});
