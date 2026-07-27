import * as vscode from 'vscode';
import { findProblems } from '../../domain/diagnostics/analyzer';
import { toDiagnostic } from './mappers';

const DEBOUNCE_MS = 300;

export function registerDiagnostics(context: vscode.ExtensionContext): void {
  const collection = vscode.languages.createDiagnosticCollection('irbis');
  context.subscriptions.push(collection);

  const timers = new Map<string, NodeJS.Timeout>();

  const refresh = (document: vscode.TextDocument) => {
    const diagnostics = findProblems(document.getText()).map(problem => toDiagnostic(problem, document));
    collection.set(document.uri, diagnostics);
  };

  const scheduleRefresh = (document: vscode.TextDocument) => {
    if (document.languageId !== 'irbis') {
      return;
    }

    const key = document.uri.toString();
    const existing = timers.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    timers.set(key, setTimeout(() => {
      timers.delete(key);
      refresh(document);
    }, DEBOUNCE_MS));
  };

  vscode.workspace.textDocuments.forEach(document => {
    if (document.languageId === 'irbis') {
      refresh(document);
    }
  });

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(document => {
      if (document.languageId === 'irbis') {
        refresh(document);
      }
    }),
    vscode.workspace.onDidChangeTextDocument(event => scheduleRefresh(event.document)),
    vscode.workspace.onDidCloseTextDocument(document => {
      const key = document.uri.toString();
      const timer = timers.get(key);
      if (timer) {
        clearTimeout(timer);
        timers.delete(key);
      }
      collection.delete(document.uri);
    }),
    { dispose: () => timers.forEach(timer => clearTimeout(timer)) }
  );
}
