import * as vscode from 'vscode';
import FenixConfig from '../core/FenixConfig';
import EnvironmentTreeItem from './EnvironmentTreeItem';

export default class EnvironmentProvider implements vscode.TreeDataProvider<EnvironmentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<EnvironmentTreeItem | undefined> = new vscode.EventEmitter<EnvironmentTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<EnvironmentTreeItem | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: EnvironmentTreeItem): EnvironmentTreeItem {
    return element;
  }

  getChildren(element?: EnvironmentTreeItem): vscode.ProviderResult<EnvironmentTreeItem[]> {
    const env = FenixConfig.get().getEnv();
    const ret = [];
    for (let v in env) {
      ret.push(new EnvironmentTreeItem(v, env[v]));
    }

    return ret.sort((a, b) => a.varID < b.varID ? -1 : 1);
  }
}