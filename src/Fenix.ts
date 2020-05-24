import * as vscode from 'vscode';
import FenixConfig from './configuration/FenixConfig';
import FenixParser from './FenixParser';
import FenixView from './FenixViewContainer';
import Template from './interfaces/Template';
import RepoHandler from './template/RepoHandler';
import FenixWebview from './webviews/FenixWebview';


export default class Fenix {
  private _webview: FenixWebview;
  private _repoHandler: RepoHandler;
  private _view: FenixView;
  private _extensionContext: vscode.ExtensionContext;

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

  getRepoHandler(): RepoHandler {
    return this._repoHandler;
  }

  getViewContainer(): FenixView {
    return this._view;
  }

  getExtensionContext(): vscode.ExtensionContext {
    return this._extensionContext;
  }

  private constructor(extensionContext: vscode.ExtensionContext) {
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

  async handleWebviewEvent(event: { command: string; id: string; vars?: any }) {
    const templates: Template[] = await this._repoHandler.getTemplates();
    FenixParser.get().pushEnv();

    switch (event.command) {
      case 'create': {
        const rootPath = vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders[0].uri.fsPath
          : '';

        if (!rootPath) {
          vscode.window.showErrorMessage('Please open a folder before creating a project!');
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
        vscode.window.showErrorMessage(`Fenix error: Error handling event '${event.command}'`);
    }
  }
}