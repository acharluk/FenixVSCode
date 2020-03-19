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
    }
}