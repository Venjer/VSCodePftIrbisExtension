import { matchAt, wordRangeAt } from './textRange';

const INCLUDE_PATTERN = /@[A-Za-z0-9_.!-]+/;
// &uf('K<справочник>\<значение>') / &uf('K<справочник>!<значение>') — раскодировка через MNU.
const MNU_LOOKUP_PATTERN = /&(?:unifor|uf)\s*\(\s*'K([^'\\!]+)[\\!]'/i;
// &uf('6<имя_формата>') — выполнить другой format-файл, второй механизм инклюда помимо @name.
const NAMED_FORMAT_PATTERN = /&(?:unifor|uf)\s*\(\s*'6([^']+)'/i;

function withDefaultExtension(name: string, extension: string): string {
  return name.includes('.') ? name : `${name}${extension}`;
}

export function includeTargetAt(lineText: string, character: number): string | undefined {
  const includeMatch = wordRangeAt(lineText, character, INCLUDE_PATTERN);
  if (includeMatch) {
    return withDefaultExtension(includeMatch.slice(1), '.pft');
  }

  const mnuMatch = matchAt(lineText, character, MNU_LOOKUP_PATTERN);
  if (mnuMatch) {
    return withDefaultExtension(mnuMatch[1], '.mnu');
  }

  const formatMatch = matchAt(lineText, character, NAMED_FORMAT_PATTERN);
  if (formatMatch) {
    return withDefaultExtension(formatMatch[1], '.pft');
  }

  return undefined;
}
