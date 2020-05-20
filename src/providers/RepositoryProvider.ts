import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';

export default class RepositoryProvider implements vscode.TreeDataProvider<RepositoryTreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: RepositoryTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RepositoryTreeItem): vscode.ProviderResult<RepositoryTreeItem[]> {
    return FenixConfig.get().getRepos().map(r => new RepositoryTreeItem(r, 'version', vscode.TreeItemCollapsibleState.None));
  }
}

class RepositoryTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    private templateID?: string
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return `${this.label}-${this.version}`;
  }

  get description(): string {
    return this.version;
  }

  get command(): vscode.Command {
    return {
      command: 'fenix.repo.delete',
      title: 'Delete this repo',
    };
  }

  get contextValue(): string {
    return 'fenix-new';
  }
}