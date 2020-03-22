import * as vscode from 'vscode';

import FenixWebview from './FenixWebview';
import FenixConfig from './configuration/FenixConfig';
import RepoHandler from './template/RepoHandler';
import ReposWebview from './webviews/ReposWebview';

export default class Fenix {
    private _extensionContext: vscode.ExtensionContext;
    private _webview: FenixWebview;
    private _webviewRepos: ReposWebview;
    private _configuration: FenixConfig;
    private _repoHandler: RepoHandler;

    constructor(extensionContext: vscode.ExtensionContext) {
        this._extensionContext = extensionContext;
        this._webview = new FenixWebview(extensionContext, this.handleEvent.bind(this));
        this._webviewRepos = new ReposWebview(extensionContext, this.handleEvent.bind(this));
        this._configuration = new FenixConfig();
        this._repoHandler = new RepoHandler(this._configuration);
    }

    show() {
        this._repoHandler.getTemplates()
            .then(templates => {
                this._webview.show(templates, this._repoHandler.getLangs(), this._repoHandler.getCategories(), this._configuration.getEnv());
            });
    }

    showRepos() {
        this._webviewRepos.show(
            this._configuration.getRepos(),
            this._configuration.getEnv()
        );
    }

    handleEvent(event: { command: string, id: string }) {
        switch (event.command) {
            case 'create':
                const rootPath = vscode.workspace.workspaceFolders
                    ? vscode.workspace.workspaceFolders[0].uri.fsPath
                    : '';
                this._repoHandler.runTemplate(event.id, rootPath);
                break;
        }
    }
}