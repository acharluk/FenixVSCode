import {
  ExtensionContext as vsExtensionContext,
  workspace as vsWorkspace,
  window as vsWindow
} from 'vscode';

import FenixConfig from './configuration/FenixConfig';
import RepoHandler from './template/RepoHandler';
import FenixWebview from './webviews/FenixWebview';
import FenixParser from './FenixParser';
import FenixView from './FenixViewContainer';

export default class Fenix {
  private _webview: FenixWebview;
  private _repoHandler: RepoHandler;
  private _view: FenixView;

  private static __instance: Fenix;
  static init(extensionContext: vsExtensionContext): Fenix {
    if (!this.__instance) {
      this.__instance = new Fenix(extensionContext);
    }
    return this.__instance;
  }

  static get(): Fenix {
    return this.__instance;
  }

  getRepoHandler(): RepoHandler {
    return this._repoHandler;
  }

  private constructor(extensionContext: vsExtensionContext) {
    this._webview = new FenixWebview(extensionContext);
    this._repoHandler = new RepoHandler();
    this._view = new FenixView(extensionContext);
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

        this._webview.show();
      });
  }

  handleWebviewEvent(event: { command: string, id: string, vars?: any }) {
    const templates: any = FenixParser.get().get('templates');
    FenixParser.get().pushEnv();

    switch (event.command) {
      case 'create': {
        const rootPath = vsWorkspace.workspaceFolders
          ? vsWorkspace.workspaceFolders[0].uri.fsPath
          : '';

        if (!rootPath) {
          vsWindow.showErrorMessage('Please open a folder before creating a project!');
        } else {
          if (event.vars) {
            for (let v in event.vars) {
              FenixParser.get().push(v, event.vars[v]);
            }
          }

          this._repoHandler.runTemplate(event.id, rootPath);
        }
        break;
      }
      case 'ready':
        this._webview.panel?.webview.postMessage({
          command: 'load',
          templates: templates,
          repositories: FenixConfig.get().getRepos()
        });
        break;
      default:
        vsWindow.showErrorMessage(`Fenix error: Error handling event '${event.command}'`);
    }
  }
}