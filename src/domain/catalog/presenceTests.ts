import { BuiltinFunction } from './types';

// Проверки присутствия/отсутствия поля или подполя. В отличие от builtin-функций
// вызываются без "&": p(v200), a(v200).
export const PRESENCE_FUNCTIONS: BuiltinFunction[] = [
  {
    label: 'p',
    detail: 'Проверка присутствия поля/подполя',
    snippet: 'p(${1:поле})',
    documentation: 'Возвращает истину, если форматируемая запись содержит хотя бы один экземпляр ' +
      'указанного поля или подполя, иначе — ложь.'
  },
  {
    label: 'a',
    detail: 'Проверка отсутствия поля/подполя',
    snippet: 'a(${1:поле})',
    documentation: 'Возвращает истину, если форматируемая запись не содержит ни одного экземпляра ' +
      'указанного поля или подполя — логическое отрицание `p()`.'
  }
];

export function findPresenceTest(name: string): BuiltinFunction | undefined {
  const lower = name.toLowerCase();
  return PRESENCE_FUNCTIONS.find(func => func.label === lower);
}
