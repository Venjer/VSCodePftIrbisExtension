import * as vscode from 'vscode';
import { CompletionSuggestion, HoverInfo } from '../../application/types';
import { PftProblem } from '../../domain/diagnostics/analyzer';

export function toCompletionItem(suggestion: CompletionSuggestion): vscode.CompletionItem {
  const kind = suggestion.kind === 'variable'
    ? vscode.CompletionItemKind.Variable
    : vscode.CompletionItemKind.Function;
  const item = new vscode.CompletionItem(suggestion.label, kind);
  item.detail = suggestion.detail;
  item.documentation = new vscode.MarkdownString(suggestion.documentation);
  item.insertText = toSnippetString(suggestion.snippet);
  return item;
}

export function toHover(info: HoverInfo): vscode.Hover {
  const markdown = new vscode.MarkdownString();
  markdown.appendCodeblock(info.code, 'irbis');
  markdown.appendMarkdown(`**${info.title}**\n\n${info.body}`);
  if (info.footer) {
    markdown.appendMarkdown(`\n\n*${info.footer}*`);
  }
  return new vscode.Hover(markdown);
}

export function toDiagnostic(problem: PftProblem, document: vscode.TextDocument): vscode.Diagnostic {
  return new vscode.Diagnostic(
    new vscode.Range(document.positionAt(problem.offset), document.positionAt(problem.offset + problem.length)),
    problem.message,
    vscode.DiagnosticSeverity.Warning
  );
}

export function toSnippetString(snippet: string): vscode.SnippetString {
  return new vscode.SnippetString(snippet);
}
