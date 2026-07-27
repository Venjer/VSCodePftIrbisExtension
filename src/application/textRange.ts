// Чистая замена document.getWordRangeAtPosition(position, pattern): находит
// совпадение шаблона на строке, содержащее заданную позицию курсора.
export function matchAt(lineText: string, character: number, pattern: RegExp): RegExpExecArray | undefined {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
  const global = new RegExp(pattern.source, flags);

  let match: RegExpExecArray | null;
  while ((match = global.exec(lineText)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (character >= start && character <= end) {
      return match;
    }
    if (match[0].length === 0) {
      global.lastIndex += 1;
    }
  }

  return undefined;
}

export function wordRangeAt(lineText: string, character: number, pattern: RegExp): string | undefined {
  return matchAt(lineText, character, pattern)?.[0];
}
