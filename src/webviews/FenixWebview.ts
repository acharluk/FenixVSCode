import * as vscode from 'vscode';
import * as path from 'path';
import FenixParser from '../FenixParser';

export default abstract class FenixWebview {
    protected _webviewID: string;
    protected _webviewName: string;
    protected _context: vscode.ExtensionContext;
    protected _webviewPanel: vscode.WebviewPanel | undefined;

    constructor(webviewID: string, webviewName: string, context: vscode.ExtensionContext) {
        this._webviewID = webviewID;
        this._webviewName = webviewName;
        this._context = context;
    }

    createWebviewPanel(): vscode.WebviewPanel {
        return vscode.window.createWebviewPanel(
            'fenix',
            this._webviewName,
            vscode.ViewColumn.One,
            {
                localResourceRoots: [vscode.Uri.file(path.join(this._context.extensionPath, 'views'))],
                enableScripts: true
            }
        );
    }

    show(parser: FenixParser): void {
        this._webviewPanel = this._webviewPanel || this.createWebviewPanel();
        this._webviewPanel.webview.html = this.html(parser);

        this._webviewPanel.onDidDispose(() => this._webviewPanel = undefined);
        this._webviewPanel.reveal();
    }

    protected abstract html(parser: FenixParser): string;
    protected abstract style(): string;
}