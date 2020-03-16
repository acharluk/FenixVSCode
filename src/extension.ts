import * as vscode from 'vscode';

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

		panel.webview.html = `<h1>Hello Fenix!</h1>`;
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
