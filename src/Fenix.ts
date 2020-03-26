import * as vscode from 'vscode';

import FenixConfig from './configuration/FenixConfig';
import RepoHandler from './template/RepoHandler';
import FenixWebview from './webviews/FenixWebview';
import FenixParser from './FenixParser';
import Template from './interfaces/Template';

export default class Fenix {
    private _webview: FenixWebview;
    private _configuration: FenixConfig;
    private _repoHandler: RepoHandler;
    private _selectedTemplateID: string | undefined;

    private _parser: FenixParser;

    constructor(extensionContext: vscode.ExtensionContext) {
        this._webview = new FenixWebview(extensionContext, this.handleEvent.bind(this));
        this._configuration = new FenixConfig();
        this._repoHandler = new RepoHandler(this._configuration);

        this._parser = new FenixParser(extensionContext);
    }

    show(forceRefresh?: boolean) {
        this._repoHandler.getTemplates(forceRefresh)
            .then(templates => {
                const languages = this._repoHandler.getLangs();
                const categories = this._repoHandler.getCategories();
                const env = this._configuration.getEnv();

                this._parser.clear();
                this._parser.push('languages', languages);
                this._parser.push('languages_count', languages.length);
                this._parser.push('categories', categories);
                this._parser.push('categories_count', categories.length);
                this._parser.push('templates', templates);
                for (let k in env) {
                    this._parser.push(k, env[k]);
                }

                this._webview.show('main', this._parser);
            });
    }

    showRepos() {
        const env = this._configuration.getEnv();

        this._parser.clear();
        this._parser.push('repos', this._configuration.getRepos());
        for (let k in env) {
            this._parser.push(k, env[k]);
        }

        this._webview.show('repos', this._parser);
    }

    handleEvent(event: { command: string, id: string }) {
        const templates: any =  this._parser.gett('templates');
        // this._parser.clear();
        const env = this._configuration.getEnv();
        for (let k in env) {
            this._parser.push(k, env[k]);
        }

        switch (event.command) {
            case 'create':
                if (!event.id && this._selectedTemplateID) {
                    const rootPath = vscode.workspace.workspaceFolders
                        ? vscode.workspace.workspaceFolders[0].uri.fsPath
                        : '';
                    this._repoHandler.runTemplate(this._selectedTemplateID, rootPath, this._parser);
                } else {
                    this._selectedTemplateID = event.id;
                    let t = templates.find((t: Template) => t.id === this._selectedTemplateID);
                    if (t && t.vars) {
                        const tt = t.vars.map((v: any[]) => [...v]);
                        this._parser.push('vars', tt);
                    }
                    this._parser.push('createText', 'Create');
                    this._webview.show('form', this._parser);
                }
                break;
            case 'viewNew':
                this.show();
                break;
            case 'refreshNew':
                this.show(true);
                break;
            case 'viewRepos':
                this.showRepos();
                break;
            default:
                vscode.window.showErrorMessage(`Fenix error: Error handling event '${event.command}'`);
        }
    }
}