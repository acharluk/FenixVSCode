import * as vscode from 'vscode';
import FenixTreeItem from './FenixTreeItem';
import FenixConfig from '../configuration/FenixConfig';

export default class EnvironmentProvider implements vscode.TreeDataProvider<FenixTreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: FenixTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FenixTreeItem): vscode.ProviderResult<FenixTreeItem[]> {
    const env = FenixConfig.get().getEnv();
    const ret= [];
    for (let v in env) {
      ret.push(new FenixTreeItem(`${v}: '${env[v]}'`, '', vscode.TreeItemCollapsibleState.None));
    }

    return ret;
  }
}