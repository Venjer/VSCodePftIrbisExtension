export interface CompletionSuggestion {
  label: string;
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
