import * as vscode from 'vscode';
import { findProblems } from '../../domain/diagnostics/analyzer';
import { toDiagnostic } from './mappers';

export function registerDiagnostics(context: vscode.ExtensionContext): void {
  const collection = vscode.languages.createDiagnosticCollection('irbis');
  context.subscriptions.push(collection);

  const refresh = (document: vscode.TextDocument) => {
    if (document.languageId !== 'irbis') {
      return;
    }

    const diagnostics = findProblems(document.getText()).map(problem => toDiagnostic(problem, document));

    collection.set(document.uri, diagnostics);
  };

  vscode.workspace.textDocuments.forEach(refresh);

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(refresh),
    vscode.workspace.onDidChangeTextDocument(event => refresh(event.document)),
    vscode.workspace.onDidCloseTextDocument(document => collection.delete(document.uri))
  );
}
