import * as vscode from 'vscode';
import EnvironmentProvider from './providers/EnvironmentProvider';
import EnvironmentVariable from './providers/EnvironmentVariable';
import QuickCreateProvider from './providers/QuickCreateProvider';
import QuickCreateTreeItem from './providers/QuickCreateTreeItem';
import RepositoryProvider from './providers/RepositoryProvider';
import RepositoryTreeItem from './providers/RepositoryTreeItem';
import RecommendedProvider from './providers/RecommendedProvider';
import RecommendedTreeItem from './providers/RecommendedTreeITem';

export default class FenixView {
  quickCreateProvider: QuickCreateProvider;
  repositoryProvider: RepositoryProvider;
  environmentProvider: EnvironmentProvider;
  recommendedProvider: RecommendedProvider;

  quickCreateView: vscode.TreeView<QuickCreateTreeItem>;
  repositoryView: vscode.TreeView<RepositoryTreeItem>;
  environmentView: vscode.TreeView<EnvironmentVariable>;
  recommendedView: vscode.TreeView<RecommendedTreeItem>;

  constructor(context: vscode.ExtensionContext) {
    this.quickCreateProvider = new QuickCreateProvider(context.extensionPath);
    this.repositoryProvider = new RepositoryProvider(context.extensionPath);
    this.environmentProvider = new EnvironmentProvider(context.extensionPath);
    this.recommendedProvider = new RecommendedProvider(context.extensionPath);

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

    this.recommendedView = vscode.window.createTreeView(
      'fenixRecommended',
      {
        treeDataProvider: this.recommendedProvider,
      }
    );
  }
}