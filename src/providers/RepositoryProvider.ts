import * as vscode from 'vscode';
import RepositoryTreeItem from './RepositoryTreeItem';
import Fenix from '../Fenix';

export default class RepositoryProvider implements vscode.TreeDataProvider<RepositoryTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RepositoryTreeItem | undefined> = new vscode.EventEmitter<RepositoryTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<RepositoryTreeItem | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: RepositoryTreeItem): RepositoryTreeItem {
    return element;
  }

  async getChildren(element?: RepositoryTreeItem): Promise<RepositoryTreeItem[]> {
    if (element && element.type === 'repo') {
      const temps = (await Fenix.get().getRepoHandler().getTemplates()).filter(t => t.parent === element.repoName);
      const items = temps.map(r => new RepositoryTreeItem(r.displayName, 'template', undefined, r.id));
      return items;
    } else if (element && element.type === 'template') {
      return [];
    } else {
      await Fenix.get().getRepoHandler().refreshTemplates();
      const repos = Fenix.get().getRepoHandler()._repositories.map(r => new RepositoryTreeItem(`${r.repoName} [${r.author}]`, 'repo', r.repoUrl));
      return repos;
    }
  }
}