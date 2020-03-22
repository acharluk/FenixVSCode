import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import Fenix from './Fenix';

export function activate(context: vscode.ExtensionContext) {

	const fenix = new Fenix(context);

	let disposable = vscode.commands.registerCommand('fenix.newProject', () => {
		fenix.show();
	});

	let showRepos = vscode.commands.registerCommand('fenix.showRepos', () => {
		fenix.showRepos();
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(showRepos);
}

export function deactivate() { }
