import * as vscode from 'vscode';
import FenixConfig from './FenixConfig';
import FenixParser from './FenixParser';
import FenixViewContainer from './FenixViewContainer';
import Template from '../interfaces/Template';
import RepoHandler from './RepoHandler';
import FenixWebview from './FenixWebview';


export default class Fenix {
  private _webview: FenixWebview;
  private _repoHandler: RepoHandler;
  private _view: FenixViewContainer;
  private _extensionContext: vscode.ExtensionContext;

  private static __instance: Fenix;
  static init(extensionContext: vscode.ExtensionContext): void {
    if (!this.__instance) {
      this.__instance = new Fenix(extensionContext);
    }
  }

  static get(): Fenix {
    return this.__instance;
  }

  getRepoHandler(): RepoHandler {
    return this._repoHandler;
  }

  getViewContainer(): FenixViewContainer {
    return this._view;
  }

  getExtensionContext(): vscode.ExtensionContext {
    return this._extensionContext;
  }

  private constructor(extensionContext: vscode.ExtensionContext) {
    FenixConfig.init();
    FenixParser.init();

    this._webview = new FenixWebview(extensionContext);
    this._repoHandler = new RepoHandler();
    this._view = new FenixViewContainer(extensionContext);
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

  async refreshWebView() {
    const templates: Template[] = await this._repoHandler.getTemplates(true);
    const repos = FenixConfig.get().getRepos();

    this._webview._webviewPanel?.webview.postMessage({
      command: 'load',
      templates: templates,
      repositories: repos,
    });
  }

  async handleWebviewEvent(event: { command: string; id: string; vars?: any }) {
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
          this._webview._webviewPanel?.dispose();
        }
        break;
      }
      case 'ready':
        this.refreshWebView();
        break;
      default:
        vscode.window.showErrorMessage(`Fenix error: Error handling event '${event.command}'`);
    }
  }
}