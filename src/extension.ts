import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import Fenix from './Fenix';

export function activate(context: vscode.ExtensionContext) {

	const fenix = new Fenix(context);

	let disposable = vscode.commands.registerCommand('fenix.helloWorld', () => {
		fenix.show();
		fenix.test();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
