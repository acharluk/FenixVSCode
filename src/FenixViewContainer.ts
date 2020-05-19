import * as vscode from 'vscode';
import EnvironmentProvider from './providers/EnvironmentProvider';
import RepositoryProvider from './providers/RepositoryProvider';
import QuickCreateProvider from './providers/QuickCreateProvider';

export default class FenixView {
  constructor(context: vscode.ExtensionContext) {
    const quickCreateView = vscode.window.createTreeView(
      'fenixQuickCreate',
      {
        treeDataProvider: new QuickCreateProvider(context.extensionPath)
      }
    );

    const repositoryView = vscode.window.createTreeView(
      'fenixRepositories',
      {
        treeDataProvider: new RepositoryProvider(context.extensionPath)
      }
    );

    const environmentView = vscode.window.createTreeView(
      'fenixEnvironment',
      {
        treeDataProvider: new EnvironmentProvider(context.extensionPath)
      }
    );
  }
}