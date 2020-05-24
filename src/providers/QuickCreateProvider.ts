import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import QuickCreateTreeItem from './QuickCreateTreeItem';

export default class QuickCreateProvider implements vscode.TreeDataProvider<QuickCreateTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<QuickCreateTreeItem | undefined> = new vscode.EventEmitter<QuickCreateTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<QuickCreateTreeItem | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: QuickCreateTreeItem): QuickCreateTreeItem {
    return element;
  }

  async getChildren(element?: QuickCreateTreeItem): Promise<QuickCreateTreeItem[]> {
    const templates = await FenixConfig.get().getPinned();
    const ret = [];
    for (let v of templates) {
      ret.push(new QuickCreateTreeItem(v));
    }

    return ret.sort((a, b) => a.template.displayName < b.template.displayName ? -1 : 1);
  }
}