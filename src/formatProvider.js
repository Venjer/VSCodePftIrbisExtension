"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatProvider = void 0;
const vscode = __importStar(require("vscode"));
class FormatProvider {
    // This method is called when the user triggers auto-formatting
    provideDocumentFormattingEdits(document, options, token) {
        const textEdits = [];
        const text = document.getText(); // Get the full text of the document
        // Define simple formatting rules (e.g., adding indentation, removing excess whitespace)
        // For example, we can add simple rules like:
        // - Remove extra spaces between keywords
        // - Format function calls with spaces around parameters
        const formattedText = this.formatText(text);
        // If the text has been modified, create a text edit to apply the changes
        if (text !== formattedText) {
            const fullTextRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
            textEdits.push(vscode.TextEdit.replace(fullTextRange, formattedText));
        }
        return textEdits;
    }
    // Example formatting function (you can expand this based on your language syntax)
    formatText(text) {
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
exports.FormatProvider = FormatProvider;
