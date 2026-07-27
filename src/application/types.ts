export type CompletionKind = 'function' | 'variable';

export interface CompletionSuggestion {
  label: string;
  kind: CompletionKind;
  detail: string;
  documentation: string;
  snippet: string;
}

export interface HoverInfo {
  code: string;
  title: string;
  body: string;
  footer?: string;
}

export interface CategoryChoice {
  id: string;
  title: string;
}

export interface CatalogPick {
  label: string;
  detail: string;
  snippet: string;
}
