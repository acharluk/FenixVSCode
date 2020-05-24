import * as vscode from 'vscode';
import EnvironmentCommands from './commands/EnvironmentCommands';
import RepositoryCommands from './commands/RepositoryCommands';
import TemplateCommands from './commands/TemplateCommands';
import FenixConfig from './configuration/FenixConfig';
import Fenix from './Fenix';
import FenixParser from './FenixParser';

export function activate(context: vscode.ExtensionContext) {
  FenixConfig.init();
  FenixParser.init(context.extensionPath);
  Fenix.init(context);

  const commands: {[command: string]: (e: any) => any} = {
    'fenix.open': () => Fenix.get().show(),
    ...RepositoryCommands,
    ...TemplateCommands,
    ...EnvironmentCommands,
  };

  for (const command in commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, commands[command])
    );
  }
}

export function deactivate() { }
