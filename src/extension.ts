import * as vscode from 'vscode';
import Fenix from './Fenix';
import FenixParser from './FenixParser';
import FenixConfig from './configuration/FenixConfig';

export function activate(context: vscode.ExtensionContext) {

  FenixConfig.init();
  FenixParser.init(context.extensionPath);
  Fenix.init(context);

  let disposable = vscode.commands.registerCommand('fenix.newProject', () => {
    Fenix.get().show();
  });

  let showRepos = vscode.commands.registerCommand('fenix.showRepos', () => {
    Fenix.get().showRepos();
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(showRepos);
}

export function deactivate() { }
