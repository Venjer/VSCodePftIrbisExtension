import { UNIFOR_FUNCTIONS } from '../domain/catalog/unifor';
import { BUILTIN_FUNCTIONS } from '../domain/catalog/builtins';
import { FIELD_DEFINITIONS } from '../domain/catalog/marcFields';
import { CompletionSuggestion } from './types';

export type CompletionContext = 'unifor' | 'builtin' | 'all';

export function completionContextFor(linePrefix: string): CompletionContext {
  if (/&(unifor|uf)\s*\($/i.test(linePrefix)) {
    return 'unifor';
  }
  if (linePrefix.endsWith('&')) {
    return 'builtin';
  }
  return 'all';
}

function uniforSuggestions(): CompletionSuggestion[] {
  return UNIFOR_FUNCTIONS.map(func => ({
    label: func.label,
    kind: 'function',
    detail: func.detail,
    documentation: func.documentation,
    snippet: func.snippet
  }));
}

function builtinSuggestions(): CompletionSuggestion[] {
  return BUILTIN_FUNCTIONS.map(func => ({
    label: func.label,
    kind: 'function',
    detail: func.detail,
    documentation: func.documentation,
    snippet: func.snippet
  }));
}

function fieldSuggestions(): CompletionSuggestion[] {
  return FIELD_DEFINITIONS.map(field => ({
    label: `v${field.number}`,
    kind: 'variable',
    detail: field.name,
    documentation: field.description,
    snippet: `v${field.number}\${1:^\${2:a}}`
  }));
}

export function suggestCompletions(linePrefix: string): CompletionSuggestion[] {
  const context = completionContextFor(linePrefix);

  if (context === 'unifor') {
    return uniforSuggestions();
  }
  if (context === 'builtin') {
    return builtinSuggestions();
  }
  return [...uniforSuggestions(), ...builtinSuggestions(), ...fieldSuggestions()];
}
