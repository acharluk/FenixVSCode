import * as vscode from 'vscode';
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
    return 'fenix-env';
  }
}