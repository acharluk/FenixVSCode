import * as vscode from 'vscode';
import * as path from 'path';
import Fenix from '../Fenix';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

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
        // localResourceRoots: [
        //   vscode.Uri.file(path.join(this._context.extensionPath, 'views'))
        // ],
        enableScripts: true
      }
    );
  }

  show(): void {
    this._webviewPanel = this._webviewPanel || this.createWebviewPanel();

    // fetch(Fenix.FENIX_APP_URL)
    //   .then(data => data.text())
    //   .then(html => {
    //     this._webviewPanel = this._webviewPanel || this.createWebviewPanel();
    //     this._webviewPanel.webview.html = html;
    //   });

    this._webviewPanel.webview.html = readFileSync(path.join(this._context.extensionPath, 'views', 'index.html'))
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