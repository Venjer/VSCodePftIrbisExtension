import { Token, tokenize } from '../language/tokenizer';

// Переставляет только отступы: содержимое строк, литералов и комментариев
// не изменяется. Глубину задают конструкции if/fi и группы в скобках.
export function formatText(text: string, indentUnit: string, eol?: string): string {
  const lineSeparator = eol ?? (text.includes('\r\n') ? '\r\n' : '\n');
  const tokens = tokenize(text);
  const lines = text.split('\n');
  const lineStarts = buildLineStarts(lines);

  const result: string[] = [];
  let depth = 0;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      result.push('');
      continue;
    }

    const lineTokens = tokensInLine(tokens, lineStarts[index], lineStarts[index] + line.length);
    const dedentsFirst = lineTokens.length > 0 && closesBlock(lineTokens[0]);
    const lineDepth = Math.max(0, dedentsFirst ? depth - 1 : depth);

    result.push(lineDepth > 0 ? indentUnit.repeat(lineDepth) + trimmed : trimmed);
    depth = Math.max(0, depth + netDepthChange(lineTokens));
  }

  return result.join(lineSeparator);
}

function buildLineStarts(lines: string[]): number[] {
  const starts: number[] = [];
  let offset = 0;
  for (const line of lines) {
    starts.push(offset);
    offset += line.length + 1;
  }
  return starts;
}

function tokensInLine(tokens: Token[], start: number, end: number): Token[] {
  return tokens.filter(token => token.offset >= start && token.offset < end);
}

function closesBlock(token: Token): boolean {
  return token.keyword === 'fi' || token.keyword === 'else' || token.type === 'rparen';
}

function netDepthChange(tokens: Token[]): number {
  let change = 0;
  for (const token of tokens) {
    if (token.keyword === 'if' || token.type === 'lparen') {
      change += 1;
    } else if (token.keyword === 'fi' || token.type === 'rparen') {
      change -= 1;
    }
  }
  return change;
}
