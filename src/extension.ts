import * as vscode from 'vscode';
import { FormatProvider } from './formatProvider'; // Import the FormatProvider class

// Example default library functions for our custom language
const defaultLibraryFunctions = [
  {
    label: 'uf(\'+95',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Вернуть длину исходной строки',
    insertText: new vscode.SnippetString('uf(\'+95\'${1:строка})'),
    documentation: "КОК"
  },
  {
    label: 'uf(\'+96',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Вернуть часть строки',
    insertText: new vscode.SnippetString('uf(\'+96${1:направление}*${2:смещение}.${3:кол-во символов}\')'),
    documentation: '\n A – направление: 0 – с начала строки; 1 – с конца;\nSSS – смещение;\nNNN – кол-во символов.'
  },
  {
    label: 'uf(\'+97',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Вернуть заданную строку в верхнем регистре'
  },
  {
    label: 'uf(\'+98',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Заменить в заданной строке один символ на другой (регистр учитывается)'
  },
  {
    label: 'uf(\'Q',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Вернуть заданную строку в нижнем регистре'
  },
  {
    label: 'uf(\'3',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Выдача данных, связанных с датой и временем'
  },
  {
    label: 'uf(\'+7',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Очистить (опустошить) все глобальные переменные'
  },
  {
    label: 'uf(\'+7R',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Чтение глобальной переменной'
  },
  {
    label: 'uf(\'+7W',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Запись глобальной переменной'
  },
  {
    label: 'uf(\'+7U',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Добавление повторений глобальной переменной'
  },
  {
    label: 'uf(\'+7T',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Сортировка повторений переменной'
  },
  {
    label: 'uf(\'A',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Выдать заданное повторение поля'
  },
  {
    label: 'uf(\'I',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Вернуть параметр из INI-файла'
  },
  {
    label: 'uf(\'+N',
    kind: vscode.CompletionItemKind.Function,
    detail: ' Выдать количество повторений поля, метка которого указана после идентификатора функции'
  },
];

// // Example default library constants
// const defaultLibraryConstants = [
//   'PI',
//   'E',
//   'TRUE',
//   'FALSE'
// ];

export function activate(context: vscode.ExtensionContext) {
  console.log('Your extension "irbis" is now active!');

  // Register the CompletionItemProvider for your language
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'irbis', // The language identifier for your language
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        // Check if we are typing a function call or variable name
        if (linePrefix.endsWith('print')) {
          return [new vscode.CompletionItem('print()', vscode.CompletionItemKind.Function)];
        }
        // Provide suggestions for built-in functions
        const functionSuggestions = defaultLibraryFunctions.map((func) => {
          var item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function)
          item.insertText = func.insertText;
          item.documentation = func.documentation;
          return item;
        });
        

        // Provide suggestions for built-in constants
        // const constantSuggestions = defaultLibraryConstants.map((constant) => {
        //   return new vscode.CompletionItem(constant, vscode.CompletionItemKind.Constant);
        // });

        // Combine the default library functions and constants
        return [...functionSuggestions];
      }
    },
    '.' // Trigger after typing a dot (you can modify this as needed)
  );
  let hoverProvider = vscode.languages.registerHoverProvider(
    { language: 'irbis' },
    {
      provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const functionCallRegex = /(uf\('.*?\')/; // Matches functions like &uf('123')
        const wordRange = document.getWordRangeAtPosition(position, functionCallRegex);

        if (!wordRange) {
          return undefined; // No word found at position
        }

        const word = document.getText(wordRange);

        // Try to match function calls like &uf('123')


        // Check if the word matches the function call pattern
        const match = functionCallRegex.exec(word);
        var coc;
        if (match) {
          defaultLibraryFunctions.forEach(element => {
            console.log(element.label, "--", word, '===', word === element.label)
            if (word.indexOf(element.label) !== -1)
              coc = element.detail;
          });
          return new vscode.Hover(new vscode.MarkdownString(coc));

        }
        return undefined;
      }
    }
  );
  const formatProvider = vscode.languages.registerDocumentFormattingEditProvider('irbis', new FormatProvider());
  context.subscriptions.push(formatProvider);
  context.subscriptions.push(hoverProvider);
  context.subscriptions.push(completionProvider);
}

export function deactivate() { }