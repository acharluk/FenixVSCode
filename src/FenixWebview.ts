import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import FenixParser from './FenixParser';

export default class FenixWebview {
    private _extensionContext: vscode.ExtensionContext;
    private _webview: vscode.WebviewPanel | undefined;
    private _parser: FenixParser;
    private _webviewStyle: string;

    constructor(extensionContext: vscode.ExtensionContext) {
        this._extensionContext = extensionContext;
        this._parser = new FenixParser(extensionContext);

        this._webviewStyle = fs.readFileSync(
            path.join(this._extensionContext.extensionPath, 'views', 'webviewStyle.css')
        ).toString();
    }

    show() {
        if (!this._webview) {
            this._webview = vscode.window.createWebviewPanel(
                'fenix',
                'Fenix: New project',
                vscode.ViewColumn.One,
                {
                    localResourceRoots: [vscode.Uri.file(path.join(this._extensionContext.extensionPath, 'views'))],
                    enableScripts: true
                }
            );

            this._parser.push('msg', 'Hello parsed!');
            this._parser.push('click', 'Click me :D');
            this._parser.push('languages', ['C++', 'Lua', 'Java']);

            this._webview.webview.html = this.getWebviewHTML();

            this.handleEvents();

            this._webview.onDidDispose(() => this._webview = undefined);
        } else {
            this._webview.reveal();
        }
    }


    private getWebviewHTML() { 
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <style>
                    ${this._webviewStyle}
                </style>
                <script>
                    const vscode = acquireVsCodeApi();
                </script>
            </head>
            <body>
                ${this._parser.render('navbar.fnx')}
                <main>
                    ${this._parser.render('main.fnx')}
                </main>
                ${this._parser.render('footer.fnx')}

                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
            </body>
        </html>`;
    }

    private handleEvents() {
        if (!this._webview) { return; }
        
        this._webview.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case 'test':
                        vscode.window.showInformationMessage(message.text);
                        break;
                }
            },
            undefined,
            this._extensionContext.subscriptions
        );
    }
}