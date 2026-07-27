import { UNIFOR_FUNCTIONS } from '../domain/catalog/unifor';
import { findBuiltin } from '../domain/catalog/builtins';
import { findField, findSubfield } from '../domain/catalog/marcFields';
import { wordRangeAt } from './textRange';
import { HoverInfo } from './types';

const UNIFOR_CALL_PATTERN = /&(unifor|uf)\s*\(\s*'[^']*'/i;
const BUILTIN_CALL_PATTERN = /&[a-z]+\s*\(/i;
const FIELD_REFERENCE_PATTERN = /[vdn]\d{1,4}(\^[a-zA-Z0-9])?/i;

function uniforHover(word: string): HoverInfo | undefined {
  // Метки библиотеки записаны в короткой форме uf(, поэтому длинную приводим к ней.
  const normalized = word.toLowerCase().replace(/&\s*unifor\s*\(/, '&uf(');
  // Самое длинное совпадение по коду: '+7W' должен выигрывать у '+7'.
  const candidates = UNIFOR_FUNCTIONS.filter(func => normalized.includes(func.label.toLowerCase()));
  if (candidates.length === 0) {
    return undefined;
  }
  const func = candidates.reduce((a, b) => (b.label.length > a.label.length ? b : a));

  return {
    code: `&${func.label}...')`,
    title: func.detail,
    body: func.documentation,
    footer: `Категория: ${func.category}`
  };
}

function builtinHover(call: string): HoverInfo | undefined {
  const name = call.replace(/^&/, '').replace(/\s*\($/, '');
  const func = findBuiltin(name);
  if (!func) {
    return undefined;
  }

  return {
    code: `&${func.label}(...)`,
    title: func.detail,
    body: func.documentation
  };
}

function fieldHover(word: string): HoverInfo | undefined {
  const match = /^[vdn](\d{1,4})(?:\^([a-zA-Z0-9]))?$/i.exec(word);
  if (!match) {
    return undefined;
  }

  const field = findField(match[1]);
  if (!field) {
    return undefined;
  }

  let body = field.description;
  if (match[2]) {
    const subfield = findSubfield(match[1], match[2]);
    body += `\n\n**Подполе ^${match[2]}**: ${subfield ?? 'описание отсутствует'}`;
  }

  return {
    code: word,
    title: `Поле ${field.number}. ${field.name}`,
    body
  };
}

export function resolveHover(lineText: string, character: number): HoverInfo | undefined {
  const uniforMatch = wordRangeAt(lineText, character, UNIFOR_CALL_PATTERN);
  if (uniforMatch) {
    const hover = uniforHover(uniforMatch);
    if (hover) {
      return hover;
    }
  }

  const builtinMatch = wordRangeAt(lineText, character, BUILTIN_CALL_PATTERN);
  if (builtinMatch) {
    const hover = builtinHover(builtinMatch);
    if (hover) {
      return hover;
    }
  }

  const fieldMatch = wordRangeAt(lineText, character, FIELD_REFERENCE_PATTERN);
  if (fieldMatch) {
    return fieldHover(fieldMatch);
  }

  return undefined;
}
