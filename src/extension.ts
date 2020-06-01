import * as vscode from 'vscode';
import EnvironmentCommands from './commands/EnvironmentCommands';
import RecommendedCommands from './commands/RecommendedCommands';
import RepositoryCommands from './commands/RepositoryCommands';
import TemplateCommands from './commands/TemplateCommands';
import Fenix from './Fenix';

export function activate(context: vscode.ExtensionContext) {
  Fenix.init(context);

  const commands: {[command: string]: (e: any) => any} = {
    'fenix.open': () => Fenix.get().show(),
    ...RepositoryCommands,
    ...TemplateCommands,
    ...EnvironmentCommands,
    ...RecommendedCommands,
  };

  for (const command in commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, commands[command])
    );
  }
}

export function deactivate() { }
