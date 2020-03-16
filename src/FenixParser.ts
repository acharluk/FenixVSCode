import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { join, format } from 'path';

export default class FenixParser {
  private _data: any;
  private _page: string;
  private _functions: { [key: string]: Function };

  constructor(extensionContext: vscode.ExtensionContext,viewName: string) {
    const viewPath = join(extensionContext.extensionPath, 'views', viewName);
    
    this._data = {};
    this._page = readFileSync(viewPath).toString();
    this._functions = {};

    this.registerIntegratedFunctions();
  }

  private registerIntegratedFunctions() {
    this.addFunction('var', (arg: string, data: { [key: string]: any; }) => {
      return data[arg];
    });

    this.addFunction('for', (arg: string, data: { [key: string]: any; }) => {
      let reg = arg.match(/(?<arr_name>.+?)\((?<format>.+?)\)/);
      if (!reg || !reg.groups || !reg.groups.arr_name || !reg.groups.format) {
        return 'undefined';
      }
      let result = '';

      for (let key in data[reg.groups.arr_name]) {
        result += reg.groups.format
                    .replace(/\$key/g, key)
                    .replace(/\$value/g, data[reg.groups.arr_name][key]);
      }
        
      return result;
    });
  }

  push(key: string, value: any) {
    this._data[key] = value;
  }

  addFunction(name: string, func: Function) {
    this._functions[name] = func;
  }

  render() {
    let current = this._page.match(/\$(?<func>.+?){\s*(?<arg>.+?)\s*}/);
    while (current !== null && current.groups) {
      let { func, arg } = current.groups;
      if (!func || !this._functions[func]) {
        vscode.window.showErrorMessage(`Fenix: Function '${func}' is used but not defined`);
        break;
      }

      this._page = this._page.replace(current[0], this._functions[func](arg, this._data));

      current = this._page.match(/\$(?<func>.+?){\s*(?<arg>.+?)\s*}/);
    }
    return this._page;
  }
}