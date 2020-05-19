import * as vscode from 'vscode';
import Fenix from '../Fenix';

export default class FenixTreeItem extends vscode.TreeItem {
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
}