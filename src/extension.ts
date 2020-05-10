import * as vscode from 'vscode';
import Fenix from './Fenix';
import FenixParser from './FenixParser';
import FenixConfig from './configuration/FenixConfig';

export function activate(context: vscode.ExtensionContext) {

  FenixConfig.init();
  FenixParser.init(context.extensionPath);
  Fenix.init(context);

  let disposable = vscode.commands.registerCommand('fenix.open', () => {
    Fenix.get().show();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }
