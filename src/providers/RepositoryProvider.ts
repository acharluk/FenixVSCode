import * as vscode from 'vscode';
import FenixTreeItem from './FenixTreeItem';
import FenixConfig from '../configuration/FenixConfig';

export default class RepositoryProvider implements vscode.TreeDataProvider<FenixTreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: FenixTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FenixTreeItem): vscode.ProviderResult<FenixTreeItem[]> {
    return FenixConfig.get().getRepos().map(r => new FenixTreeItem(r, 'version', vscode.TreeItemCollapsibleState.None));
  }
}