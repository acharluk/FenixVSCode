import * as vscode from 'vscode';
import EnvironmentProvider from './providers/EnvironmentProvider';
import RepositoryProvider from './providers/RepositoryProvider';
import QuickCreateProvider from './providers/QuickCreateProvider';

export default class FenixView {
  quickCreateProvider: QuickCreateProvider;
  repositoryProvider: RepositoryProvider;
  environmentProvider: EnvironmentProvider;

  quickCreateView: any;
  repositoryView: any;
  environmentView: any;
  
  constructor(context: vscode.ExtensionContext) {
    this.quickCreateProvider = new QuickCreateProvider(context.extensionPath);
    this.repositoryProvider = new RepositoryProvider(context.extensionPath);
    this.environmentProvider = new EnvironmentProvider(context.extensionPath);

    this.quickCreateView = vscode.window.createTreeView(
      'fenixQuickCreate',
      {
        treeDataProvider: this.quickCreateProvider
      }
    );

    this.repositoryView = vscode.window.createTreeView(
      'fenixRepositories',
      {
        treeDataProvider: this.repositoryProvider
      }
    );

    this.environmentView = vscode.window.createTreeView(
      'fenixEnvironment',
      {
        treeDataProvider: this.environmentProvider
      }
    );
  }
}