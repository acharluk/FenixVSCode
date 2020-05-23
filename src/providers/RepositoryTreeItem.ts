import * as vscode from 'vscode';
import { join } from "path";

export default class RepositoryTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public type: string,
    public repoName?: string,
  ) {
    super(
      label,
      type === 'repo'
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None
    );
  }

  contextValue = `fenix-${this.type}`;

  iconPath = {
    dark: join(__filename, '..' , '..', 'assets','icons','/star-full.svg'),
    light: join(__filename, '..' , '..', 'assets','icons','/star-full.svg'),
  };
}