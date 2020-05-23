import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import RepoHandler from '../template/RepoHandler';
import Fenix from '../Fenix';
import fetch from 'node-fetch';
import Repository from '../interfaces/Repository';
import { join } from 'path';

export default class RepositoryProvider implements vscode.TreeDataProvider<RepositoryTreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: RepositoryTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RepositoryTreeItem): Promise<RepositoryTreeItem[]> {
    console.log('Element', element);
    if (element && element.type === 'repo') {
      const temps = (await Fenix.get().getRepoHandler().getTemplates()).filter(t => t.parent === element.repoName);
      const items = temps.map(r => new RepositoryTreeItem(r.displayName, 'template'));
      return items;
    } else if (element && element.type === 'template') {
      return [];
    } else {
      // const repos = FenixConfig.get().getRepos().map(r => new RepositoryTreeItem(r, 'repo', r));
      await Fenix.get().getRepoHandler().refreshTemplates();
      const repos = Fenix.get().getRepoHandler()._repositories.map(r => new RepositoryTreeItem(`${r.repoName}\t[${r.author}]`, 'repo', r.repoUrl));
      return repos;
    }
  }
}

class RepositoryTreeItem extends vscode.TreeItem {
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