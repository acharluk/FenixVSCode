import {
  ExtensionContext as vsExtensionContext,
  workspace as vsWorkspace,
  window as vsWindow,
  ExtensionContext,
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
  private _extensionContext: ExtensionContext;

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

  getViewContainer(): FenixView {
    return this._view;
  }

  getExtensionContext(): ExtensionContext {
    return this._extensionContext;
  }

  private constructor(extensionContext: vsExtensionContext) {
    this._webview = new FenixWebview(extensionContext);
    this._repoHandler = new RepoHandler();
    this._view = new FenixView(extensionContext);
    this._extensionContext = extensionContext;
  }

  show(forceRefresh?: boolean) {
    this._repoHandler.getTemplates(forceRefresh)
      .then(templates => {
        FenixParser.get().clear();
        FenixParser.get().push('templates', templates);
        FenixParser.get().pushEnv();

        this._webview.show();
      });
  }

  handleWebviewEvent(event: { command: string; id: string; vars?: any }) {
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
          this._webview.panel?.dispose();
        }
        break;
      }
      case 'ready':
        this._webview.panel?.webview.postMessage({
          command: 'load',
          templates: templates,
          repositories: FenixConfig.get().getRepos(),
        });
        break;
      default:
        vsWindow.showErrorMessage(`Fenix error: Error handling event '${event.command}'`);
    }
  }
}