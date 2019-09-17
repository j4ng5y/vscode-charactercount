// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Charactercount" is now active!');

    // create a new word counter
    let charCounter = new CharCounter();
    let controller = new CharCounterController(charCounter);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(charCounter);
}

export class CharCounter {

    private _statusBarItem: StatusBarItem;

    public updateCharCount() {
        
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
        } 

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        let charCount = this._getCharCount(doc);

        // Update the status bar
        this._statusBarItem.text = charCount !== 1 ? `${charCount} Characters` : '1 Character';
        this._statusBarItem.show();
    }

    public _getCharCount(doc: TextDocument): number {
        let docContent = doc.getText();

        let charCount = 0;
        if (docContent != "") {
            charCount = docContent.length;
        }

        return charCount;
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

class CharCounterController {

    private _charCounter: CharCounter;
    private _disposable: Disposable;

    constructor(wordCounter: CharCounter) {
        this._charCounter = wordCounter;
        this._charCounter.updateCharCount();

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._charCounter.updateCharCount();
    }

    public dispose() {
        this._disposable.dispose();
    }
}
