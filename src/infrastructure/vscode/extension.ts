import * as vscode from 'vscode';
import { FormatProvider } from './formatProvider';
import { IrbisDefinitionProvider } from './definitionProvider';
import { registerDiagnostics } from './diagnosticsProvider';
import { registerCompletionProvider } from './completionProvider';
import { registerHoverProvider } from './hoverProvider';
import { registerShowUniforByCategory } from './commands';

export function activate(context: vscode.ExtensionContext) {
  registerDiagnostics(context);

  context.subscriptions.push(
    registerCompletionProvider(),
    registerHoverProvider(),
    vscode.languages.registerDocumentFormattingEditProvider('irbis', new FormatProvider()),
    vscode.languages.registerDefinitionProvider('irbis', new IrbisDefinitionProvider()),
    registerShowUniforByCategory()
  );
}

export function deactivate() { }
