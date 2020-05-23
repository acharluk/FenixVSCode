import * as vscode from 'vscode';
import Fenix from './Fenix';
import FenixParser from './FenixParser';
import FenixConfig from './configuration/FenixConfig';
import EnvironmentProvider from './providers/EnvironmentProvider';

export function activate(context: vscode.ExtensionContext) {

  FenixConfig.init();
  FenixParser.init(context.extensionPath);
  Fenix.init(context);

  const commands: any = {
    'fenix.open': () => Fenix.get().show(),
    'fenix.repo.delete': () => vscode.window.showInformationMessage('called delete repo!'),
    'fenix.template.fav': (e: any) => { console.log(e); vscode.window.showInformationMessage('Fav/unfav -> ' + e.label); },
    'fenix.template.share': (e: any) => {
      console.log(e);
      vscode.env.openExternal(
        vscode.Uri.parse(`https://twitter.com/intent/tweet?text=Check out this Fenix template! ${e.label}&url=https://github.com/ACharLuk/Fenix`)
      );
    },
    'fenix.env.new': async (e: any) => {
      const id = await vscode.window.showInputBox({ placeHolder: 'Enter variable id' });
      if (!id) { return; }

      const value = await vscode.window.showInputBox({ placeHolder: 'Enter variable value' });
      if (!value) { return; }

      await FenixConfig.get().addEnvVar(id, value);
    },
    'fenix.env.edit': async (e: any) => {
      const newValue = await vscode.window.showInputBox({
        value: e.varValue
      });
      if (newValue) {
        FenixConfig.get().editVar(e.varID, newValue);
      }
    },
    'fenix.env.delete': async (e: any) => {
      await FenixConfig.get().deleteVar(e.varID);
    }
  };

  for (const command in commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, commands[command])
    );
  }

  // let disposable = vscode.commands.registerCommand('fenix.open', () => {
  //   Fenix.get().show();
  // });


  // context.subscriptions.push(disposable);
}

export function deactivate() { }
