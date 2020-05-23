import * as vscode from 'vscode';
import * as path from 'path';
import Fenix from '../Fenix';
import { readFileSync, existsSync } from 'fs';

export default class FenixWebview {
  protected _context: vscode.ExtensionContext;
  protected _webviewPanel: vscode.WebviewPanel | undefined;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  createWebviewPanel(): vscode.WebviewPanel {
    return vscode.window.createWebviewPanel(
      'fenix',
      'Fenix',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
  }

  show(): void {
    this._webviewPanel = this._webviewPanel || this.createWebviewPanel();

    const webviewPath = path.join(this._context.extensionPath, 'views', 'index.html');

    if (!existsSync(webviewPath)) {
      vscode.window.showErrorMessage(`Fenix Webview could not be loaded :(`);
      return;
    }

    this._webviewPanel.webview.html = readFileSync(webviewPath)
      .toString()
      .replace(/href=/g, 'href=vscode-resource:' + __dirname + '/views')
      .replace(/src=/g, 'src=vscode-resource:' + __dirname + '/views')
      .replace(/\\/g, '/');

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

  get panel() {
    return this._webviewPanel;
  }
}