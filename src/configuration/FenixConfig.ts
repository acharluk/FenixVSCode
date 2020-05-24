import * as vscode from 'vscode';
import Fenix from '../Fenix';
import Template from '../interfaces/Template';

export default class FenixConfig {
  private _configRoot: string = 'fenix';
  public readonly _defaultRepo: string = 'https://raw.githubusercontent.com/FenixTemplates/Default/master/fenix.json';

  private static __instance: FenixConfig;
  static init(): FenixConfig {
    if (!this.__instance) {
      this.__instance = new FenixConfig();
    }
    return this.__instance;
  }

  static get(): FenixConfig {
    return this.__instance;
  }

  private constructor() {
    let currentRepos: string[] | undefined = vscode.workspace.getConfiguration(this._configRoot).get('repos');

    // Create config in settings.json if it's empty
    if (currentRepos && currentRepos.length === 0) {
      this.resetRepos();
    }
  }

  getRepos(): string[] {
    return vscode.workspace.getConfiguration(this._configRoot).get('repos') || [this._defaultRepo];
  }

  async addRepo(url: string) {
    const currentRepos = this.getRepos();
    if (!currentRepos.includes(url)) {
      currentRepos.push(url);
      await vscode.workspace.getConfiguration(this._configRoot)
        .update(
          'repos',
          currentRepos,
          vscode.ConfigurationTarget.Global
        );
    } else {
      vscode.window.showErrorMessage('Repo already added');
    }

    Fenix.get().getViewContainer().repositoryProvider.refresh();
  }

  removeRepo() {

  }

  resetRepos() {
    vscode.workspace.getConfiguration(this._configRoot)
      .update('repos', [this._defaultRepo], vscode.ConfigurationTarget.Global);
    vscode.workspace.getConfiguration(this._configRoot)
      .update('runCommands', 'ask', vscode.ConfigurationTarget.Global);
  }

  getEnv(): any {
    return vscode.workspace.getConfiguration(this._configRoot).get('env');
  }

  async addEnvVar(id: string, value: string): Promise<void> {
    if (vscode.workspace.getConfiguration(this._configRoot + '.env').has(id)) {
      await this.editVar(id, value);
    } else {
      await vscode.workspace.getConfiguration(this._configRoot)
        .update(
          'env',
          {
            ...vscode.workspace.getConfiguration(this._configRoot + '.env'),
            [id]: value,
          },
          vscode.ConfigurationTarget.Global
        );
    }

    Fenix.get().getViewContainer().environmentProvider.refresh();
  }

  async editVar(id: string, value: string) {
    const current: any = vscode.workspace.getConfiguration(this._configRoot).get('env');
    current[id] = value;
    await vscode.workspace.getConfiguration(this._configRoot)
      .update(
        'env',
        current,
        vscode.ConfigurationTarget.Global
      );

    Fenix.get().getViewContainer().environmentProvider.refresh();
  }

  async deleteVar(id: string) {
    const current: any = vscode.workspace.getConfiguration(this._configRoot).get('env');
    current[id] = undefined;
    await vscode.workspace.getConfiguration(this._configRoot)
      .update(
        'env',
        current,
        vscode.ConfigurationTarget.Global
      );

    Fenix.get().getViewContainer().environmentProvider.refresh();
  }

  async getPinned(): Promise<Template[]> {
    const templateIDs: string[] = (await vscode.workspace.getConfiguration(this._configRoot).get('pinned')) || [];
    const templates = await Fenix.get().getRepoHandler().getTemplates();
    const pinnedTemplates = templates.filter(t => templateIDs.includes(t.id));

    return pinnedTemplates;
  }

  async togglePinned(templateID: string): Promise<void> {
    const pinned: string[] | undefined = vscode.workspace.getConfiguration(this._configRoot).get('pinned');
    if (!pinned) {
      return;
    }

    if (pinned.indexOf(templateID) > -1) {
      const current: any = vscode.workspace.getConfiguration(this._configRoot).get('pinned');
      current.splice(current.indexOf(templateID), 1);
      await vscode.workspace.getConfiguration(this._configRoot)
        .update(
          'pinned',
          current,
          vscode.ConfigurationTarget.Global
        );
    } else {
      const current: any = vscode.workspace.getConfiguration(this._configRoot).get('pinned');
      current.push(templateID);
      await vscode.workspace.getConfiguration(this._configRoot)
        .update(
          'pinned',
          current,
          vscode.ConfigurationTarget.Global
        );
    }
    Fenix.get().getViewContainer().quickCreateProvider.refresh();
  }

  async canExecuteCommands(command: string) {
    let runCommands = vscode.workspace.getConfiguration(this._configRoot).get('runCommands', 'ask');
    if (runCommands === 'ask') {
      let opts: vscode.MessageItem[] = [
        { title: 'Yes' },
        { title: 'No' },
        { title: 'Always' },
        { title: 'Never' },
      ];
      let res = await vscode.window.showWarningMessage(`Allow Fenix to run template commands? (${command})`, {}, ...opts);

      if (!res || res.title === 'No') {
        return false;
      }

      if (res.title === 'Always') {
        vscode.workspace.getConfiguration(this._configRoot)
          .update('runCommands', true, vscode.ConfigurationTarget.Global);
      } else if (res.title === 'Never') {
        vscode.workspace.getConfiguration(this._configRoot)
          .update('runCommands', false, vscode.ConfigurationTarget.Global);
      }

      return res.title === 'Yes' || res.title === 'Always';
    } else {
      return runCommands;
    }
  }
}