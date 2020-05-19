import * as vscode from 'vscode';
import Fenix from '../Fenix';
import FenixTreeItem from './FenixTreeItem';

export default class QuickCreateProvider implements vscode.TreeDataProvider<FenixTreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: FenixTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FenixTreeItem): Promise<FenixTreeItem[]> {
    const templates = await Fenix.get().getRepoHandler().getTemplates();
    const ret= [];
    for (let v of templates) {
      ret.push(new FenixTreeItem(`${v.displayName}`, `(${v.repoName})`, vscode.TreeItemCollapsibleState.None, v.id));
    }

    return ret;
  }
}