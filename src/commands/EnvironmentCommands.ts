import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import EnvironmentVariable from '../providers/EnvironmentVariable';

export default {
  'fenix.env.new': async (e: EnvironmentVariable) => {
    const id = await vscode.window.showInputBox({ placeHolder: 'Enter variable id' });
    if (!id) { return; }

    const value = await vscode.window.showInputBox({ placeHolder: 'Enter variable value' });
    if (!value) { return; }

    await FenixConfig.get().addEnvVar(id, value);
  },
  'fenix.env.edit': async (e: EnvironmentVariable) => {
    const newValue = await vscode.window.showInputBox({
      value: e.varValue,
    });
    if (newValue) {
      FenixConfig.get().editVar(e.varID, newValue);
    }
  },
  'fenix.env.delete': async (e: EnvironmentVariable) => {
    await FenixConfig.get().deleteVar(e.varID);
  },
};