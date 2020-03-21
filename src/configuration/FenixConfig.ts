import * as vscode from 'vscode';

export default class FenixConfig {
    private _configRoot: string = "fenix";
    private _defaultRepo: string = "https://raw.githubusercontent.com/acharluk/FenixDefaultTemplates/master/fenix.json";

    constructor() {
        let currentRepos: string[] | undefined = vscode.workspace.getConfiguration(this._configRoot).get('repos');

        // Create config in settings.json if it's empty
        if (currentRepos && currentRepos.length === 0) {
            this.resetRepos();
        }
    }

    getRepos(): string[] {
        return vscode.workspace.getConfiguration(this._configRoot).get('repos') || [];
    }

    addRepo() {

    }

    removeRepo() {

    }

    resetRepos() {
        vscode.workspace.getConfiguration(this._configRoot)
            .update('repos', [this._defaultRepo], vscode.ConfigurationTarget.Global);
        vscode.workspace.getConfiguration(this._configRoot)
            .update('runCommands', 'ask', vscode.ConfigurationTarget.Global);
    }

    async canExecuteCommands(command: string) {
        let runCommands = vscode.workspace.getConfiguration(this._configRoot).get('runCommands', 'ask');
        if (runCommands === 'ask') {
            let opts: vscode.MessageItem[] = [
                { title: 'Yes' },
                { title: 'No' },
                { title: 'Always' },
                { title: 'Never' }
            ];
            let res = await vscode.window.showWarningMessage(`Allow Fenix to run template commands? (${command})`, {}, ...opts);

            if (!res || res.title === 'No') {
                return false;
            }

            if (res.title === 'Always') {
                vscode.workspace.getConfiguration(this._configRoot)
                    .update('runCommands', true, vscode.ConfigurationTarget.Global);
            } else if (res.title === 'Never') {
                vscode.workspace.getConfiguration(this._configRoot)
                    .update('runCommands', false, vscode.ConfigurationTarget.Global);
            }

            return res.title === 'Yes' || res.title === 'Always';
        } else {
            return runCommands;
        }
    }
}