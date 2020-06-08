import * as vscode from 'vscode';
import FenixCommands from './commands';
import Fenix from './core/Fenix';

export function activate(context: vscode.ExtensionContext) {
  Fenix.init(context);

  const commands: {[command: string]: (e: any) => any} = {
    'fenix.open': () => Fenix.get().show(),
    ...FenixCommands,
  };

  for (const command in commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, commands[command])
    );
  }
}

export function deactivate() { }
