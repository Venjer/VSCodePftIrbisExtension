import { Token, tokenize } from '../language/tokenizer';

export interface PftProblem {
  offset: number;
  length: number;
  message: string;
}

export function findProblems(text: string): PftProblem[] {
  const tokens = tokenize(text);
  const problems: PftProblem[] = [];

  for (const token of tokens) {
    if (token.unterminated) {
      problems.push({
        offset: token.offset,
        length: token.text.length,
        message: `Незакрытый литерал: нет парного символа ${token.text[0]}`
      });
    }
  }

  problems.push(...findUnbalancedParens(tokens));
  problems.push(...findUnbalancedConditionals(tokens));

  return problems.sort((a, b) => a.offset - b.offset);
}

function findUnbalancedParens(tokens: Token[]): PftProblem[] {
  const problems: PftProblem[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'lparen') {
      stack.push(token);
    } else if (token.type === 'rparen') {
      if (stack.length === 0) {
        problems.push({
          offset: token.offset,
          length: token.text.length,
          message: 'Лишняя закрывающая скобка без парной открывающей'
        });
      } else {
        stack.pop();
      }
    }
  }

  for (const token of stack) {
    problems.push({ offset: token.offset, length: token.text.length, message: 'Незакрытая скобка' });
  }

  return problems;
}

function findUnbalancedConditionals(tokens: Token[]): PftProblem[] {
  const problems: PftProblem[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    if (token.keyword === 'if') {
      stack.push(token);
    } else if (token.keyword === 'then' || token.keyword === 'else') {
      if (stack.length === 0) {
        problems.push({
          offset: token.offset,
          length: token.text.length,
          message: `"${token.text}" без соответствующего "if"`
        });
      }
    } else if (token.keyword === 'fi') {
      if (stack.length === 0) {
        problems.push({
          offset: token.offset,
          length: token.text.length,
          message: '"fi" без соответствующего "if"'
        });
      } else {
        stack.pop();
      }
    }
  }

  for (const token of stack) {
    problems.push({
      offset: token.offset,
      length: token.text.length,
      message: 'Конструкция "if" не закрыта: отсутствует "fi"'
    });
  }

  return problems;
}
