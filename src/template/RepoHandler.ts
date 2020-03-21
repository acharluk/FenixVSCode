import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export default class RepoHandler {
    _config: FenixConfig;
    _templateList: any[]; //TODO: Template[]

    constructor(config: FenixConfig) {
        this._config = config;
        this._templateList = [];
    }

    async getTemplates() {
        this._templateList = [];
        await Promise.all(
            this._config.getRepos().map(async (repo) => {
                let remote = await fetch(repo);
                let json = await remote.json();

                // Copy extra properties from repo data to template data
                json.templates.forEach((t: any) => {
                    t.author = json.author;
                    t.repoName = json.repoName;
                    t.repoUrl = json.repoUrl;
                });
                this._templateList.push(...json.templates);
            })
        );

        return this._templateList;
    }

    getLangs() {
        const langs: any[] = [];

        this._templateList.forEach(t => {
            if (langs.includes(t.language)) {
                langs[langs.indexOf(t.language)].count++;
            } else {
                langs.push({
                    name: t.language,
                    count: 1
                });
            }
        });

        return langs;
    }

    getCategories() {
        const categories: any[] = [];

        for (let categoryList of this._templateList.map(t => t.categories)) {
            categoryList.forEach((category: string[]) => {
                let index = categories.map(c => c.name).indexOf(category);
                if (index !== -1) {
                    categories[index].count++;
                } else {
                    categories.push({
                        name: category,
                        count: 1
                    });
                }
            });
        }

        return categories;
    }

    async runTemplate(templateID: string, rootPath: string) {
        const template = this._templateList.find(t => t.id === templateID);
        if (!template) { return; }

        // Generate directories
        template.directories?.forEach((dir: string) => {
            const target = path.join(rootPath, dir);
            if (!fs.existsSync(target)) {
                fs.mkdirSync(target);
            }
        });

        // Download files
        if (template.files && template.files.download) {
            await Promise.all(
                template.files.download.map(async (file: { from: string, to: string }) => {
                    let remote = await fetch(template.repoUrl + file.from);
                    let data = await remote.text();

                    fs.writeFileSync(path.join(rootPath, file.to), data);
                })
            );
        }

        // Generate blank files
        template.files.create?.forEach((fileName: string) => {
            fs.writeFileSync(path.join(rootPath, fileName), '');
        });

        // Open files
        await template.files.open?.forEach(async (fileName: string) => {
            let doc = await vscode.workspace.openTextDocument(path.join(rootPath, fileName));
            vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Active, preserveFocus: false });
        });

        // Execute terminal commands
        if (template.command) {
            let commandToRun = '';

            if (typeof template.command === 'string') {
                commandToRun = template.command;
            } else {
                const currOS = os.type();
                switch (currOS) {
                    case 'Windows_NT':
                        commandToRun = template.command.windows;
                        break;
                    case 'linux':
                        commandToRun = template.command.linux;
                        break;
                    case 'darwin':
                        commandToRun = template.command.macos;
                        break;
                    default:
                        template.command[currOS]
                            ? commandToRun = template.command[currOS]
                            : vscode.window.showErrorMessage(`Command not set for OS: ${currOS}`);
                }
            }

            const runCommand = await this._config.canExecuteCommands(commandToRun);
            if (!runCommand) { return; }

            const term = vscode.window.createTerminal('Fenix');
            term.sendText(commandToRun);
            term.show();

        }
    }
}