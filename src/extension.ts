import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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

		const nextVar = (text: string) => {
			return text.match(/\$var{\s*(?<var_name>.+?)\s*}/);
		};

		let page = fs.readFileSync(path.join(context.extensionPath, 'views', 'main.fnx')).toString();
		const data: any = {
			msg: 'Hello parsed!',
			click: 'Click me!'
		};

		let vars = nextVar(page);
		while (vars !== null) {
			if (vars.groups) {
				page = page.replace(vars[0], data[vars.groups.var_name]);
			}

			vars = nextVar(page);
		}

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
			</head>
			<body>
				${page}
			</body>
		</html>`;
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
