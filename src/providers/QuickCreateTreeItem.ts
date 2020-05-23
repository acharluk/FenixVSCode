import * as vscode from 'vscode';
import Template from '../interfaces/Template';

export default class QuickCreateTreeItem extends vscode.TreeItem {
  constructor(
    public readonly template: Template
  ) {
    super(template.displayName, vscode.TreeItemCollapsibleState.None);
  }

  get description(): string {
    return this.template.repoName || this.template.id;
  }

  get command(): vscode.Command {
    return {
      command: 'fenix.template.run',
      title: 'Run this template',
    };
  }

  get contextValue(): string {
    return 'fenix-quick';
  }
}