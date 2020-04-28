import * as vscode from 'vscode';

import FenixConfig from './configuration/FenixConfig';
import RepoHandler from './template/RepoHandler';
import FenixWebview from './webviews/FenixWebview';
import FenixParser from './FenixParser';
import Template from './interfaces/Template';

export default class Fenix {
    private _webview: FenixWebview;
    private _repoHandler: RepoHandler;
    private _selectedTemplateID: string | undefined;

    private static __instance: Fenix;
    static init(extensionContext: vscode.ExtensionContext): Fenix {
        if (!this.__instance) {
            this.__instance = new Fenix(extensionContext);
        }
        return this.__instance;
    }

    static get(): Fenix {
        return this.__instance;
    }

    private constructor(extensionContext: vscode.ExtensionContext) {
        this._webview = new FenixWebview(extensionContext);
        this._repoHandler = new RepoHandler();
    }

    show(forceRefresh?: boolean) {
        this._repoHandler.getTemplates(forceRefresh)
            .then(templates => {
                const languages = this._repoHandler.getLangs();
                const categories = this._repoHandler.getCategories();

                FenixParser.get().clear();
                FenixParser.get().push('languages', languages);
                FenixParser.get().push('languages_count', languages.length);
                FenixParser.get().push('categories', categories);
                FenixParser.get().push('categories_count', categories.length);
                FenixParser.get().push('templates', templates);
                FenixParser.get().push('repos', FenixConfig.get().getRepos());
                FenixParser.get().pushEnv();

                this._webview.show('main', FenixParser.get());
            });
    }

    showRepos() {
        FenixParser.get().clear();
        FenixParser.get().push('repos', FenixConfig.get().getRepos());
        FenixParser.get().pushEnv();

        this._webview.show('repos', FenixParser.get());
    }

    handleWebviewEvent(event: { command: string, id: string, vars?: any }) {
        const templates: any =  FenixParser.get().get('templates');
        FenixParser.get().pushEnv();
        console.log(event);

        switch (event.command) {
            case 'create': {
                const rootPath = vscode.workspace.workspaceFolders
                    ? vscode.workspace.workspaceFolders[0].uri.fsPath
                    : '';
                
                if (event.vars) {
                    for (let v in event.vars) {
                        FenixParser.get().push(v, event.vars[v]);
                    }
                }

                this._repoHandler.runTemplate(event.id, rootPath);
                break;
            }
            case 'ready':
                this._webview.panel?.webview.postMessage({
                    command: 'load',
                    templates: templates,
                    repositories: FenixConfig.get().getRepos()
                });
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