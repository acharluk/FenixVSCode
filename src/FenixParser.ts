import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { join, format } from 'path';

export default class FenixParser {
  private _extensionPath: string;
  private _data: any;
  private _functions: { [key: string]: Function };

  constructor(extensionContext: vscode.ExtensionContext) {
    this._extensionPath = extensionContext.extensionPath;
    this._data = {};
    this._functions = {};

    this.registerIntegratedFunctions();
  }

  private registerIntegratedFunctions() {
    this.addFunction('var', (arg: string, data: { [key: string]: any; }) => {
      return data[arg];
    });

    this.addFunction('for', (arg: string, data: { [key: string]: any; }) => {
      let reg = arg.match(/(?<arr_name>.+?)\s*->\s*(?<format>.+)/m);
      if (!reg || !reg.groups || !reg.groups.arr_name || !reg.groups.format) {
        return 'undefined';
      }
      let result = '';

      for (let key in data[reg.groups.arr_name]) {
        let curr_format = reg.groups.format;

        // Access object properties inside arrays
        let var_name = curr_format.match(/\$value\.(?<var_name>[a-zA-Z]+)/)?.groups?.var_name;
        while (var_name) {
          let value = data[reg.groups.arr_name][key][var_name];
          curr_format = curr_format.replace(`$value.${var_name}`, value);

          var_name = curr_format.match(/\$value\.(?<var_name>[a-zA-Z]+)/)?.groups?.var_name;
        }

        result += curr_format
          .replace(/\$key/g, key)
          .replace(/\$value/g, data[reg.groups.arr_name][key]);
      }

      return result;
    });
  }

  push(key: string, value: any): void {
    this._data[key] = value;
  }

  clear(): void {
    this._data = {};
  }

  addFunction(name: string, func: Function): void {
    this._functions[name] = func;
  }

  render(viewName: string): string {
    const viewPath = join(this._extensionPath, 'views', viewName);
    let page = readFileSync(viewPath).toString();

    return this.renderRaw(page);
  }

  renderRaw(inputStr: string, keepNewLines?: boolean): string {
    if (!keepNewLines) {
      inputStr = inputStr.replace(/\r?\n|\r/g, ' ');
    }
    let current = inputStr.match(/\$(?<func>.+?){\s*(?<arg>.+?)\s*}/);
    while (current !== null && current.groups) {
      let { func, arg } = current.groups;
      if (!func || !this._functions[func]) {
        vscode.window.showErrorMessage(`Fenix: Function '${func}' is used but not defined`);
        break;
      }

      inputStr = inputStr.replace(current[0], this._functions[func](arg, this._data));

      current = inputStr.match(/\$(?<func>.+?){\s*(?<arg>.+?)\s*}/);
    }
    return inputStr;
  }
}