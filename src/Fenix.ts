import * as vscode from 'vscode';

import FenixWebview from './FenixWebview';

export default class Fenix {
    private _extensionContext: vscode.ExtensionContext;
    private _webview: FenixWebview;


    constructor(extensionContext: vscode.ExtensionContext) {
        this._extensionContext = extensionContext;
        this._webview = new FenixWebview(extensionContext);
    }

    show() {
        this._webview.show();
    }
}