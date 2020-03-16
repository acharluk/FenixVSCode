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
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'views'))],
				enableScripts: true
			}
		);

		const webviewStyle = vscode.Uri.file(
			path.join(context.extensionPath, 'views', 'webviewStyle.css')
		);

		const parser = new FenixParser(context, 'main.fnx');
		parser.push('msg', 'Hello parsed!');
		parser.push('click', 'Click me :D');
		parser.push('names', ['Alex', 'Francisco']);

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<link rel="stylesheet" href="${webviewStyle.with({scheme: 'vscode-resource'})}">
				<script>
					const vscode = acquireVsCodeApi();
				</script>
			</head>
			<body>
				${parser.render()}
			</body>
		</html>`;

		panel.webview.onDidReceiveMessage(
			(message) => {
				switch (message.command) {
					case 'test':
						vscode.window.showInformationMessage(message.text);
						break;
				}
			},
			undefined,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
