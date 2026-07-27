import * as vscode from 'vscode';
import { listCategories, listFunctions, findPick } from '../../application/catalogQuery';
import { toSnippetString } from './mappers';

export function registerShowUniforByCategory(): vscode.Disposable {
  return vscode.commands.registerCommand('irbis.showUniforByCategory', async () => {
    const categoryItems = listCategories().map(category => ({
      label: category.title,
      description: category.id
    }));

    const selected = await vscode.window.showQuickPick(categoryItems, {
      placeHolder: 'Выберите категорию функций'
    });

    if (!selected) {
      return;
    }

    const picks = listFunctions(selected.description);
    const selectedFunction = await vscode.window.showQuickPick(
      picks.map(pick => ({ label: pick.label, detail: pick.detail })),
      { placeHolder: 'Выберите функцию для вставки' }
    );

    if (!selectedFunction) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    const pick = findPick(selected.description, selectedFunction.label);
    if (editor && pick) {
      editor.insertSnippet(toSnippetString(pick.snippet));
    }
  });
}
