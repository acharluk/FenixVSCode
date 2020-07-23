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

    /*
    this._webviewPanel.webview.html = readFileSync(path.join(webviewPath, 'index.html'))
      .toString()
      .replace(/href=/g, 'href=vscode-resource:' + webviewPath)
      .replace(/src=/g, 'src=vscode-resource:' + webviewPath)
      .replace(/\\/g, '/');
    */

    this._webviewPanel.webview.html = `
    <!DOCTYPE html>
      <html lang=en>
      
      <head>
          <meta charset=utf-8>
          <meta http-equiv=X-UA-Compatible content="IE=edge">
          <meta name=viewport content="width=device-width,initial-scale=1">
          <link rel=icon href=/favicon.ico>
          <title>Fenix</title>
          <link href=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'css', 'app.a4ee0d22.css')) )} rel=preload as=style>
          <link href=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'css', 'chunk-vendors.229f4893.css')) )} rel=preload as=style>
          <link href=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'js', 'app.72324140.js')) )} rel=preload as=script>
          <link href=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'js', 'chunk-vendors.ed76ceb4.js')) )} rel=preload as=script>
          <link href=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'css', 'chunk-vendors.229f4893.css')) )} rel=stylesheet>
          <link href=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'css', 'app.a4ee0d22.css')) )} rel=stylesheet>
      </head>
      
      <body><noscript><strong>We're sorry but fenix-app doesn't work properly without JavaScript enabled. Please enable it to
                  continue.</strong></noscript>
          <div id=app></div>
          <script src=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'js', 'chunk-vendors.ed76ceb4.js')) )}></script>
          <script src=${this._webviewPanel.webview.asWebviewUri( vscode.Uri.file(path.join(this._context.extensionPath, 'views', 'js', 'app.72324140.js')) )}></script>
      </body>
      
      </html>
    `;

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