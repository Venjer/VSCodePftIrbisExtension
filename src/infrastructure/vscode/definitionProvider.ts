import * as vscode from 'vscode';
import { includeTargetAt } from '../../application/include';

export class IrbisDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Definition | null> {
    const target = includeTargetAt(document.lineAt(position).text, position.character);
    if (!target) {
      return null;
    }

    const matches = await vscode.workspace.findFiles(`**/${target}`, '**/node_modules/**', 10);
    if (matches.length === 0) {
      return null;
    }

    return matches.map(uri => new vscode.Location(uri, new vscode.Position(0, 0)));
  }
}
