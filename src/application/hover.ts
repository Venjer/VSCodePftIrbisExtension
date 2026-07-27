import { UNIFOR_FUNCTIONS } from '../domain/catalog/unifor';
import { findBuiltin } from '../domain/catalog/builtins';
import { findPresenceTest } from '../domain/catalog/presenceTests';
import { findKeywordHover } from '../domain/catalog/keywords';
import { findOperatorHover } from '../domain/catalog/operators';
import { findFieldPrefixHover } from '../domain/catalog/fieldPrefixes';
import { matchAt, wordRangeAt } from './textRange';
import { HoverInfo } from './types';

const UNIFOR_CALL_PATTERN = /&(unifor|uf)\s*\(\s*'[^']*'/i;
const BUILTIN_CALL_PATTERN = /&?[a-z]+\s*\(/i;
const PRESENCE_CALL_PATTERN = /\b[pa]\s*\(/i;
const KEYWORD_PATTERN = /\b(if|then|else|fi|and|or|not|break)\b/i;
const OPERATOR_PATTERN = /<>|<=|>=|[=<>:]/;
const FIELD_PREFIX_PATTERN = /\b([vdng])(\d{1,4})(\^\S)?(\*\d+)?(\.\d+)?/i;

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

function presenceHover(call: string): HoverInfo | undefined {
  const name = call.replace(/\s*\($/, '');
  const func = findPresenceTest(name);
  if (!func) {
    return undefined;
  }

  return {
    code: `${func.label}(...)`,
    title: func.detail,
    body: func.documentation
  };
}

function keywordHover(word: string): HoverInfo | undefined {
  const func = findKeywordHover(word);
  if (!func) {
    return undefined;
  }

  return {
    code: func.label,
    title: func.detail,
    body: func.documentation
  };
}

function operatorHover(symbol: string): HoverInfo | undefined {
  const func = findOperatorHover(symbol);
  if (!func) {
    return undefined;
  }

  return {
    code: func.label,
    title: func.detail,
    body: func.documentation
  };
}

function fieldPrefixHover(match: RegExpExecArray): HoverInfo | undefined {
  const [full, prefix, , sub, offset, length] = match;
  const func = findFieldPrefixHover(prefix);
  if (!func) {
    return undefined;
  }

  const parts = [func.documentation];
  if (sub) {
    parts.push(`\`${sub}\` — подполе ${sub.slice(1)}.`);
  }
  if (offset) {
    parts.push(`\`${offset}\` — смещение: пропустить первые ${offset.slice(1)} символов.`);
  }
  if (length) {
    parts.push(`\`${length}\` — длина: взять ${length.slice(1)} символов после смещения.`);
  }

  return {
    code: full,
    title: func.detail,
    body: parts.join('\n\n')
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

  const presenceMatch = wordRangeAt(lineText, character, PRESENCE_CALL_PATTERN);
  if (presenceMatch) {
    const hover = presenceHover(presenceMatch);
    if (hover) {
      return hover;
    }
  }

  const keywordMatch = wordRangeAt(lineText, character, KEYWORD_PATTERN);
  if (keywordMatch) {
    const hover = keywordHover(keywordMatch);
    if (hover) {
      return hover;
    }
  }

  const operatorMatch = wordRangeAt(lineText, character, OPERATOR_PATTERN);
  if (operatorMatch) {
    const hover = operatorHover(operatorMatch);
    if (hover) {
      return hover;
    }
  }

  const fieldPrefixMatch = matchAt(lineText, character, FIELD_PREFIX_PATTERN);
  if (fieldPrefixMatch) {
    return fieldPrefixHover(fieldPrefixMatch);
  }

  return undefined;
}
