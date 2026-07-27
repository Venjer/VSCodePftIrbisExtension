import * as vscode from 'vscode';
import { resolveHover } from '../../application/hover';
import { toHover } from './mappers';

export function registerHoverProvider(): vscode.Disposable {
  return vscode.languages.registerHoverProvider(
    { language: 'irbis' },
    {
      provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const info = resolveHover(document.lineAt(position).text, position.character);
        return info ? toHover(info) : undefined;
      }
    }
  );
}
