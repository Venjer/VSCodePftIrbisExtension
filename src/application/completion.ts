import { UNIFOR_FUNCTIONS } from '../domain/catalog/unifor';
import { BUILTIN_FUNCTIONS } from '../domain/catalog/builtins';
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
    detail: func.detail,
    documentation: func.documentation,
    snippet: func.snippet
  }));
}

function builtinSuggestions(): CompletionSuggestion[] {
  return BUILTIN_FUNCTIONS.map(func => ({
    label: func.label,
    detail: func.detail,
    documentation: func.documentation,
    snippet: func.snippet
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
  return [...uniforSuggestions(), ...builtinSuggestions()];
}
