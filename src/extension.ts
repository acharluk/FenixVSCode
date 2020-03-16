import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import FenixParser from './FenixParser';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('fenix.helloWorld', () => {
		const panel = vscode.window.createWebviewPanel(
			'fenix',
			'Fenix: New project',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		const parser = new FenixParser(context, 'main.fnx');
		parser.push('msg', 'Hello parsed!');
		parser.push('click', 'Click me :D');
		parser.push('names', ['Alex', 'Francisco']);

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
			</head>
			<body>
				${parser.render()}
			</body>
		</html>`;
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
