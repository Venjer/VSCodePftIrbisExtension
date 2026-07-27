import * as vscode from 'vscode';
import { suggestCompletions } from '../../application/completion';
import { toCompletionItem } from './mappers';

export function registerCompletionProvider(): vscode.Disposable {
  return vscode.languages.registerCompletionItemProvider(
    'irbis',
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        return suggestCompletions(linePrefix).map(toCompletionItem);
      }
    },
    '&',
    'v'
  );
}
