import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import FenixParser from '../FenixParser';
import Fenix from '../Fenix';

export default class FenixWebview {
    protected _context: vscode.ExtensionContext;
    protected _webviewPanel: vscode.WebviewPanel | undefined;

    private _webviewStyle: string;
    private _webviewScript: string;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;

        this._webviewStyle = fs.readFileSync(
            path.join(this._context.extensionPath, 'views', 'webviewStyle.css')
        ).toString();
        this._webviewScript = fs.readFileSync(
            path.join(this._context.extensionPath, 'views', 'webviewScript.js')
        ).toString();
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
        this._webviewPanel = this._webviewPanel || this.createWebviewPanel();
        this._webviewPanel.webview.html = this.html();

        this._webviewPanel.webview.onDidReceiveMessage(
            (message) => {
                Fenix.get().handleWebviewEvent(message);
            },
            undefined,
            this._context.subscriptions
        );

        this._webviewPanel.onDidDispose(() => this._webviewPanel = undefined);
        this._webviewPanel.reveal();
    }

    protected html(): string {
        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                    <style>
                        ${this._webviewStyle}
                    </style>
                    <!-- Font Awesome JS -->
                    <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js" integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ" crossorigin="anonymous"></script>
                    <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js" integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY" crossorigin="anonymous"></script>
                    <script>
                        const vscode = acquireVsCodeApi();
                    </script>
                </head>
                <body>
                    <div class="wrapper">
                        ${FenixParser.get().render('navbar.fnx')}
                        ${FenixParser.get().render('main.fnx')}
                    </div>

                    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

                    <script type="text/javascript">
                        ${this._webviewScript}
                    </script>
                </body>
            </html>
        `;
    }
}