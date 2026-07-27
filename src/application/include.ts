import { wordRangeAt } from './textRange';

const INCLUDE_PATTERN = /@[A-Za-z0-9_.!-]+/;

export function includeTargetAt(lineText: string, character: number): string | undefined {
  const match = wordRangeAt(lineText, character, INCLUDE_PATTERN);
  if (!match) {
    return undefined;
  }

  const name = match.slice(1);
  return name.includes('.') ? name : `${name}.pft`;
}
