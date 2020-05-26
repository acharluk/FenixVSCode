import * as vscode from 'vscode';
import RecommendedTreeItem from './RecommendedTreeITem';
import fetch from 'node-fetch';
import Template from '../interfaces/Template';
import Repository from '../interfaces/Repository';
import FenixConfig from '../configuration/FenixConfig';

export default class RecommendedProvider implements vscode.TreeDataProvider<RecommendedTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RecommendedTreeItem | undefined> = new vscode.EventEmitter<RecommendedTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<RecommendedTreeItem | undefined> = this._onDidChangeTreeData.event;
  private recommendedList: RecommendedTreeItem[] = [];

  constructor(private workspaceRoot: string) {
    this.loadRecommended();
  }

  async loadRecommended() {
    await fetch('https://raw.githubusercontent.com/FenixTemplates/FenixTemplates/master/recommended.json')
      .then((raw) => raw.json())
      .then((json: string[]) => {

        Promise.all(
          json.map(async (r) => {
            try {
              const raw2 = await fetch(r);
              const json = await raw2.json();
              this.recommendedList.push( new RecommendedTreeItem(json.repoName, json.author, r) );
            }
            catch (e) {
              vscode.window.showWarningMessage(`Could not load information for recommended repo: ${r}`);
            }
          })
        )
          .then(() => {
            this.refresh();
          });

      })
      .catch(e => {
        vscode.window.showWarningMessage(`Could not load recommended list`);
      });
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: RecommendedTreeItem): RecommendedTreeItem {
    return element;
  }

  getChildren(element?: RecommendedTreeItem): vscode.ProviderResult<RecommendedTreeItem[]> {
    return this.recommendedList;
  }
}