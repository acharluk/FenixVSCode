import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';

export default class EnvironmentProvider implements vscode.TreeDataProvider<EnvironmentVariable> {
  private _onDidChangeTreeData: vscode.EventEmitter<EnvironmentVariable | undefined> = new vscode.EventEmitter<EnvironmentVariable | undefined>();
	readonly onDidChangeTreeData: vscode.Event<EnvironmentVariable | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: EnvironmentVariable): vscode.TreeItem {
    return element;
  }

  getChildren(element?: EnvironmentVariable): vscode.ProviderResult<EnvironmentVariable[]> {
    const env = FenixConfig.get().getEnv();
    const ret= [];
    for (let v in env) {
      ret.push(new EnvironmentVariable(v, env[v]));
    }

    return ret;
  }
}

class EnvironmentVariable extends vscode.TreeItem {
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