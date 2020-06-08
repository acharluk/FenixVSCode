import * as vscode from 'vscode';
import Template from '../interfaces/Template';

export default class RecommendedTreeItem extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    public readonly author: string,
    public readonly url: string
  ) {
    super(name, vscode.TreeItemCollapsibleState.None);
  }

  get description(): string {
    return this.author;
  }

  get contextValue(): string {
    return 'fenix-recommended';
  }
}