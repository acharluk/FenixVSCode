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

		const webviewStyle = fs.readFileSync(
			path.join(context.extensionPath, 'views', 'webviewStyle.css')
		).toString();

		const parser = new FenixParser(context);
		parser.push('msg', 'Hello parsed!');
		parser.push('click', 'Click me :D');
		parser.push('names', ['Alex', 'Francisco']);
		parser.push('languages', ['C++', 'Lua', 'Java']);

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
				<style>
					${webviewStyle}
				</style>
				<script>
					const vscode = acquireVsCodeApi();
				</script>
			</head>
			<body>
				${parser.render('navbar.fnx')}
				<main>
					${parser.render('main.fnx')}
				</main>
				${parser.render('footer.fnx')}

				<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
				<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
				<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
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
