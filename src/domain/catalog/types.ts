export const UNIFOR_CATEGORIES = [
  'strings',
  'words',
  'datetime',
  'globals',
  'database',
  'files',
  'utility'
] as const;

export type UniforCategory = typeof UNIFOR_CATEGORIES[number];

export interface CatalogEntry {
  label: string;
  detail: string;
  documentation: string;
  /** Шаблон вставки в синтаксисе сниппетов VS Code (`${1:...}`), обычная строка. */
  snippet: string;
}

export interface UniforFunction extends CatalogEntry {
  category: UniforCategory;
}

export type BuiltinFunction = CatalogEntry;

export interface HoverEntry {
  label: string;
  detail: string;
  documentation: string;
}
