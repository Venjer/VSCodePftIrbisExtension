import { UNIFOR_FUNCTIONS, getUniforFunctionsByCategory, getUniforCategories } from '../domain/catalog/unifor';
import { BUILTIN_FUNCTIONS } from '../domain/catalog/builtins';
import { CategoryChoice, CatalogPick } from './types';

const CATEGORY_TITLES: { [id: string]: string } = {
  all: 'Все функции',
  builtins: 'Встроенные функции',
  strings: 'Работа со строками',
  words: 'Работа со словами',
  datetime: 'Дата и время',
  globals: 'Глобальные переменные',
  database: 'База данных',
  files: 'Файлы',
  utility: 'Служебные функции'
};

export function listCategories(): CategoryChoice[] {
  return Object.keys(CATEGORY_TITLES).map(id => ({ id, title: CATEGORY_TITLES[id] }));
}

export function listFunctions(categoryId: string): CatalogPick[] {
  const entries = categoryId === 'builtins'
    ? BUILTIN_FUNCTIONS
    : categoryId === 'all'
      ? UNIFOR_FUNCTIONS
      : getUniforFunctionsByCategory(categoryId);

  return entries.map(func => ({ label: func.label, detail: func.detail, snippet: func.snippet }));
}

export function findPick(categoryId: string, label: string): CatalogPick | undefined {
  return listFunctions(categoryId).find(pick => pick.label === label);
}

// Проверка на этапе загрузки модуля: каждая категория UNIFOR из данных
// должна иметь русское название в CATEGORY_TITLES, иначе она недостижима из QuickPick.
export function uncoveredCategories(): string[] {
  return getUniforCategories().filter(category => !(category in CATEGORY_TITLES));
}
