import * as vscode from 'vscode';

export default class EnvironmentVariable extends vscode.TreeItem {
  constructor(
    private varID: string,
    private varValue: string
  ) {
    super(varID, vscode.TreeItemCollapsibleState.None);
  }

  get tooltip(): string {
    return `${this.varID}: ${this.varValue}`;
  }

  get description(): string {
    return this.varValue;
  }

  get command(): vscode.Command {
    return {
      command: 'fenix.env.edit',
      title: 'Edit this variable',
    };
  }

  get contextValue(): string {
    return 'fenix-env';
  }
}