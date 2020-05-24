import * as vscode from 'vscode';
import EnvironmentProvider from './providers/EnvironmentProvider';
import EnvironmentVariable from './providers/EnvironmentVariable';
import QuickCreateProvider from './providers/QuickCreateProvider';
import QuickCreateTreeItem from './providers/QuickCreateTreeItem';
import RepositoryProvider from './providers/RepositoryProvider';
import RepositoryTreeItem from './providers/RepositoryTreeItem';

export default class FenixView {
  quickCreateProvider: QuickCreateProvider;
  repositoryProvider: RepositoryProvider;
  environmentProvider: EnvironmentProvider;

  quickCreateView: vscode.TreeView<QuickCreateTreeItem>;
  repositoryView: vscode.TreeView<RepositoryTreeItem>;
  environmentView: vscode.TreeView<EnvironmentVariable>;

  constructor(context: vscode.ExtensionContext) {
    this.quickCreateProvider = new QuickCreateProvider(context.extensionPath);
    this.repositoryProvider = new RepositoryProvider(context.extensionPath);
    this.environmentProvider = new EnvironmentProvider(context.extensionPath);

    this.quickCreateView = vscode.window.createTreeView(
      'fenixQuickCreate',
      {
        treeDataProvider: this.quickCreateProvider,
      }
    );

    this.repositoryView = vscode.window.createTreeView(
      'fenixRepositories',
      {
        treeDataProvider: this.repositoryProvider,
      }
    );

    this.environmentView = vscode.window.createTreeView(
      'fenixEnvironment',
      {
        treeDataProvider: this.environmentProvider,
      }
    );
  }
}