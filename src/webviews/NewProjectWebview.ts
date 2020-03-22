import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import FenixParser from '../FenixParser';
import FenixWebview from './FenixWebview';

export default class NewProjectWebview extends FenixWebview {
    private _webview: vscode.WebviewPanel | undefined;
    private _webviewStyle: string;

    constructor(context: vscode.ExtensionContext, eventHandler: Function) {
        super('new-project', 'Fenix: New Project', context, eventHandler);

        this._webviewStyle = fs.readFileSync(
            path.join(this._context.extensionPath, 'views', 'webviewStyle.css')
        ).toString();
    }

    protected html(parser: FenixParser) {
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <style>
                    ${this.style()}
                </style>
                <script>
                    const vscode = acquireVsCodeApi();
                </script>
            </head>
            <body>
                ${parser.render('navbar.fnx')}
                <main>
                    ${parser.render('main.fnx')}
                </main>
                ${parser.render('footer.fnx')}

                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
            </body>
        </html>`;
    }

    protected style() {
        return this._webviewStyle;
    }
}