import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import Template from '../interfaces/Template';
import FenixParser from '../FenixParser';
import Repository from '../interfaces/Repository';

export default class RepoHandler {
  _repositories: Repository[];
  // _templateList: Template[];

  constructor() {
    this._repositories = [];
    // this._templateList = [];
  }

  get _templateList(): Template[] {
    const templateList: Template[] = [];
    this._repositories.forEach(r => {
      templateList.push(...r.templates);
    });
    return templateList;
  }

  async getTemplates(forceRefresh?: boolean): Promise<Template[]> {
    if (this._templateList.length === 0 || forceRefresh) {
      // this._templateList = await this.refreshTemplates();
      await this.refreshTemplates();
    }

    return this._templateList;
  }

  async refreshTemplates(): Promise<void> {
    const templates: Template[] = [];
    const repositories: Repository[] = [];
    this._repositories = [];

    await Promise.all(
      FenixConfig.get().getRepos().map(async (repo) => {
        try {
          let remote = await fetch(repo);
          let json = await remote.json();

          // Copy extra properties from repo data to template data
          json.templates.forEach((t: Template) => {
            t.author = json.author;
            t.repoName = json.repoName;
            t.repoUrl = json.repoUrl;
            t.hasForm = t.environment ? 'true' : 'false';
            t.parent = json.repoUrl;
          });

          // templates.push(...json.templates);
          repositories.push(json);
        } catch (e) {
          vscode.window.showErrorMessage(`[Fenix] Could not fetch repo: ${repo}`);
        }
      })
    );

    this._repositories = repositories;
    // return templates;
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
          data = FenixParser.get().renderRaw(data);

          fs.writeFileSync(path.join(rootPath, file.to), data);
        })
      );
    }

    // Generate blank files
    template.files.create?.forEach((fileName: string) => {
      fs.writeFileSync(path.join(rootPath, fileName), '');
    });

    // Open files
    template.files.open?.forEach(async (fileName: string) => {
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

      const runCommand = await FenixConfig.get().canExecuteCommands(commandToRun);
      if (!runCommand) { return; }

      const term = vscode.window.createTerminal('Fenix');
      term.sendText(commandToRun);
      term.show();

    }
  }
}