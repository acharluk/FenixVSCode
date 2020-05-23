import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import EnvironmentVariable from './EnvironmentVariable';

export default class EnvironmentProvider implements vscode.TreeDataProvider<EnvironmentVariable> {
  private _onDidChangeTreeData: vscode.EventEmitter<EnvironmentVariable | undefined> = new vscode.EventEmitter<EnvironmentVariable | undefined>();
  readonly onDidChangeTreeData: vscode.Event<EnvironmentVariable | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: EnvironmentVariable): vscode.TreeItem {
    return element;
  }

  getChildren(element?: EnvironmentVariable): vscode.ProviderResult<EnvironmentVariable[]> {
    const env = FenixConfig.get().getEnv();
    const ret= [];
    for (let v in env) {
      ret.push(new EnvironmentVariable(v, env[v]));
    }

    return ret;
  }
}