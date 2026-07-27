export type TokenType =
  | 'comment'
  | 'literal'
  | 'keyword'
  | 'lparen'
  | 'rparen'
  | 'other';

export interface Token {
  type: TokenType;
  text: string;
  offset: number;
  /** Для литералов: закрывающая кавычка не встретилась до конца строки. */
  unterminated?: boolean;
  /** Для ключевых слов: приведённое к нижнему регистру значение. */
  keyword?: string;
}

const KEYWORDS = new Set(['if', 'then', 'else', 'fi', 'and', 'or', 'not', 'break']);

// Парные ограничители литералов: обычный, условный и повторяющийся.
const LITERAL_OPENERS: { [key: string]: string } = {
  "'": "'",
  '"': '"',
  '|': '|'
};

function isWordChar(char: string): boolean {
  return /[A-Za-z]/.test(char);
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;

  while (position < text.length) {
    const char = text[position];

    // Комментарий "/*" действует до конца физической строки, закрывающего "*/" в PFT нет.
    if (char === '/' && text[position + 1] === '*') {
      const newline = text.indexOf('\n', position);
      const end = newline < 0 ? text.length : newline;
      tokens.push({ type: 'comment', text: text.slice(position, end), offset: position });
      position = end;
      continue;
    }

    const closer = LITERAL_OPENERS[char];
    if (closer) {
      // Литерал не может пересекать границу строки — это признак незакрытой кавычки.
      const newline = text.indexOf('\n', position + 1);
      const limit = newline < 0 ? text.length : newline;
      const closing = text.indexOf(closer, position + 1);
      if (closing < 0 || closing >= limit) {
        tokens.push({
          type: 'literal',
          text: text.slice(position, limit),
          offset: position,
          unterminated: true
        });
        position = limit;
      } else {
        // "|литерал|+" — повторяющийся литерал с завершающим разделителем.
        const end = char === '|' && text[closing + 1] === '+' ? closing + 2 : closing + 1;
        tokens.push({ type: 'literal', text: text.slice(position, end), offset: position });
        position = end;
      }
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'lparen', text: char, offset: position });
      position += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'rparen', text: char, offset: position });
      position += 1;
      continue;
    }

    if (isWordChar(char)) {
      let end = position;
      while (end < text.length && isWordChar(text[end])) {
        end += 1;
      }
      const word = text.slice(position, end);
      const lower = word.toLowerCase();
      if (KEYWORDS.has(lower)) {
        tokens.push({ type: 'keyword', text: word, offset: position, keyword: lower });
      } else {
        tokens.push({ type: 'other', text: word, offset: position });
      }
      position = end;
      continue;
    }

    tokens.push({ type: 'other', text: char, offset: position });
    position += 1;
  }

  return tokens;
}
