import * as vscode from 'vscode';

import FenixWebview from './FenixWebview';
import FenixConfig from './configuration/FenixConfig';
import RepoHandler from './template/RepoHandler';
import ReposWebview from './webviews/ReposWebview';
import FenixParser from './FenixParser';

export default class Fenix {
    private _extensionContext: vscode.ExtensionContext;
    private _webview: FenixWebview;
    private _webviewRepos: ReposWebview;
    private _configuration: FenixConfig;
    private _repoHandler: RepoHandler;

    private _parser: FenixParser;

    constructor(extensionContext: vscode.ExtensionContext) {
        this._extensionContext = extensionContext;
        this._webview = new FenixWebview(extensionContext, this.handleEvent.bind(this));
        this._webviewRepos = new ReposWebview(extensionContext, this.handleEvent.bind(this));
        this._configuration = new FenixConfig();
        this._repoHandler = new RepoHandler(this._configuration);

        this._parser = new FenixParser(extensionContext);
    }

    show() {
        this._repoHandler.getTemplates()
            .then(templates => {
                this._webview.show(templates, this._repoHandler.getLangs(), this._repoHandler.getCategories(), this._configuration.getEnv());
            });
    }

    showRepos() {
        this._parser.push('repos', this._configuration.getRepos());
        const env = this._configuration.getEnv();
        for (let k in env) {
            this._parser.push(`env.${k}`, env[k]);
        }

        this._webviewRepos.show(this._parser);
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