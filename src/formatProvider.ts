import * as vscode from 'vscode';

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    // This method is called when the user triggers auto-formatting
    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
        const textEdits: vscode.TextEdit[] = [];
        const text = document.getText(); // Get the full text of the document

        // Define simple formatting rules (e.g., adding indentation, removing excess whitespace)
        // For example, we can add simple rules like:
        // - Remove extra spaces between keywords
        // - Format function calls with spaces around parameters
        const formattedText = this.formatText(text);

        // If the text has been modified, create a text edit to apply the changes
        if (text !== formattedText) {
            const fullTextRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            textEdits.push(vscode.TextEdit.replace(fullTextRange, formattedText));
        }

        return textEdits;
    }

    // Example formatting function (you can expand this based on your language syntax)
    private formatText(text: string): string {
        // Simple example: Remove extra spaces around function calls
        let formatted = text;

    // Add new line after each 'then'
    formatted = formatted.replace(/then/g, 'then\n    ');
    formatted = formatted.replace(/fi/g, '\nfi\n');
    // Properly indent and break down 'fi' statements
    // formatted = formatted.replace(/fi/g, '\n    fi');

    // // Ensure 'if' is correctly spaced out and the code structure is well formatted
    // formatted = formatted.replace(/\s*if/g, 'if');

    // // Add newline before each 'fi' to ensure it's on its own line
    // formatted = formatted.replace(/\n\s*fi,\s*/g, '\n    fi,\n');

    // // Handle the 'fi/' case to make sure it's properly formatted
    //formatted = formatted.replace(/fi\/,/g, '\n    fi\n,');

    // // // Format the initial 'if' and 'then' lines to make sure they are separated as desired
    // // formatted = formatted.replace(/if\s+/g, 'if ');
    // // formatted = formatted.replace(/then\s+/g, '\nthen\n');

    // // // This handles adding a new line before the next 'if' starts
    // // formatted = formatted.replace(/fi\s*,/g, 'fi,');
    // // formatted = formatted.replace(/,\s*\(/g, ',\n(');

    return formatted;
    }
}