import * as vscode from 'vscode';
import Fenix from './Fenix';
import FenixParser from './FenixParser';
import FenixConfig from './configuration/FenixConfig';
import EnvironmentProvider from './providers/EnvironmentProvider';
import EnvironmentCommands from './commands/EnvironmentCommands';
import TemplateCommands from './commands/TemplateCommands';
import RepositoryCommands from './commands/RepositoryCommands';

export function activate(context: vscode.ExtensionContext) {
  FenixConfig.init();
  FenixParser.init(context.extensionPath);
  Fenix.init(context);

  const commands: any = {
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
