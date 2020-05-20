import * as vscode from 'vscode';
import Fenix from '../Fenix';

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

class FenixTreeItem extends vscode.TreeItem {
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
      command: 'fenix.open',
      title: 'something',
    };
  }

  get contextValue(): string {
    return 'fenix-quick';
  }
}