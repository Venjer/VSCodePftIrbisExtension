import * as vscode from 'vscode';
import { formatText } from '../../domain/formatting/formatter';

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): vscode.TextEdit[] {
    const text = document.getText();
    const indentUnit = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
    const formatted = formatText(text, indentUnit);

    if (text === formatted) {
      return [];
    }

    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
    return [vscode.TextEdit.replace(fullRange, formatted)];
  }
}
