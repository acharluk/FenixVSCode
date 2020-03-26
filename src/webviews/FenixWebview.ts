import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import FenixParser from '../FenixParser';

export default class FenixWebview {
    protected _context: vscode.ExtensionContext;
    protected _webviewPanel: vscode.WebviewPanel | undefined;
    private _eventHandler: Function;
    private _webviewStyle: string;

    private _views: { [viewID: string]: string };
    private _currentView: string;

    constructor(context: vscode.ExtensionContext, eventHandler: Function) {
        this._context = context;
        this._eventHandler = eventHandler;

        this._webviewStyle = fs.readFileSync(
            path.join(this._context.extensionPath, 'views', 'webviewStyle.css')
        ).toString();

        this._views = {
            main: 'main.fnx',
            repos: 'repos.fnx',
            form: 'form.fnx'
        };
        this._currentView = 'main';
    }

    createWebviewPanel(): vscode.WebviewPanel {
        return vscode.window.createWebviewPanel(
            'fenix',
            'Fenix',
            vscode.ViewColumn.One,
            {
                localResourceRoots: [vscode.Uri.file(path.join(this._context.extensionPath, 'views'))],
                enableScripts: true
            }
        );
    }

    show(view: string, parser: FenixParser): void {
        this._currentView = view;
        this._webviewPanel = this._webviewPanel || this.createWebviewPanel();
        this._webviewPanel.webview.html = this.html(parser);

        this._webviewPanel.webview.onDidReceiveMessage(
            (message) => {
                this._eventHandler(message);
            },
            undefined,
            this._context.subscriptions
        );

        this._webviewPanel.onDidDispose(() => this._webviewPanel = undefined);
        this._webviewPanel.reveal();
    }

    protected html(parser: FenixParser): string {
        return `<!DOCTYPE html>
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
                        ${parser.render(this._views[this._currentView])}
                    </main>

                    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
                </body>
            </html>
        `;
    }

    private style(): string {
        return this._webviewStyle;
    }
}