import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import Fenix from './Fenix';

export default class FenixWebview {
  private _context: vscode.ExtensionContext;
  public _webviewPanel: vscode.WebviewPanel | undefined;

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
    const webviewPath = path.join(this._context.extensionPath, 'views');

    if (!existsSync(webviewPath)) {
      vscode.window.showErrorMessage(`Fenix Webview could not be loaded :(`);
      return;
    }

    this._webviewPanel.webview.html = readFileSync(path.join(webviewPath, 'index.html'))
      .toString()
      .replace(/href=/g, 'href=vscode-resource:' + webviewPath)
      .replace(/src=/g, 'src=vscode-resource:' + webviewPath)
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
}