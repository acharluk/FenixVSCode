import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { join, format } from 'path';

import * as luajs from 'lua-in-js';

export default class FenixParser {
  private _extensionPath: string;
  private _data: any;
  private _functions: { [key: string]: Function };
  private _lua: any;
  private _lua_out: string;

  constructor(extensionContext: vscode.ExtensionContext) {
    this._extensionPath = extensionContext.extensionPath;
    this._data = {};
    this._functions = {};
    this._lua = luajs.createEnv();
    this._lua_out = '';

    // this.registerIntegratedFunctions();
  }

  private registerIntegratedFunctions() {
    // this.addFunction('var', (arg: string, data: { [key: string]: any; }) => {
    //   return data[arg];
    // });

    // this.addFunction('for', (arg: string, data: { [key: string]: any; }) => {
    //   let reg = arg.match(/(?<arr_name>.+?)\s*->\s*(?<format>.+)/m);
    //   if (!reg || !reg.groups || !reg.groups.arr_name || !reg.groups.format) {
    //     return 'undefined';
    //   }
    //   let result = '';

    //   for (let key in data[reg.groups.arr_name]) {
    //     let curr_format = reg.groups.format;

    //     // Access object properties inside arrays
    //     let var_name = curr_format.match(/\$value\.(?<var_name>[a-zA-Z]+)/)?.groups?.var_name;
    //     while (var_name) {
    //       let value = data[reg.groups.arr_name][key][var_name];
    //       curr_format = curr_format.replace(`$value.${var_name}`, value);

    //       var_name = curr_format.match(/\$value\.(?<var_name>[a-zA-Z]+)/)?.groups?.var_name;
    //     }

    //     result += curr_format
    //       .replace(/\$key/g, key)
    //       .replace(/\$value/g, data[reg.groups.arr_name][key]);
    //   }

    //   return result;
    // });

    this.addFunction('render', (text: string, func?: any) => {
      if (func) {
        let array = this._data[text];
        console.log('Found array: ', array);
        console.log('Function: ', func);
        array.forEach((elem: any) => {
          this._lua_out += func(elem);
        });
      } else {
        this._lua_out = text;
      }
    });

    this.addFunction('env', (var_name: string) => {
      return this._data[var_name] || `Fenix error: Undefined variable '${var_name}'`;
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
    // if (!keepNewLines) {
    //   inputStr = inputStr.replace(/\r?\n|\r/g, ' ');
    // }
    // let current = inputStr.match(/\$(?<func>.+?){\s*(?<arg>.+?)\s*}/);
    // while (current !== null && current.groups) {
    //   let { func, arg } = current.groups;
    //   if (!func || !this._functions[func]) {
    //     vscode.window.showErrorMessage(`Fenix: Function '${func}' is used but not defined`);
    //     break;
    //   }

    //   inputStr = inputStr.replace(current[0], this._functions[func](arg, this._data));

    //   current = inputStr.match(/\$(?<func>.+?){\s*(?<arg>.+?)\s*}/);
    // }
    // return inputStr;

    const _lua_data = this._data;
    let sc_lua_out = '';

    const fenixLib = new luajs.Table({
      render(text: string, func?: any) {
        if (func) {
          let array = _lua_data[text];

          console.log('Found array: ', array);
          console.log('Function: ', func);

          for (let elem of array) {
            sc_lua_out += func(elem);
          }
        } else {
          sc_lua_out = text;
        }
      },
      renderArray(arr_name: string, format: string) {
        let arr: any[] | undefined = _lua_data[arr_name];
        if (!arr) {
          sc_lua_out = `Undefined array '${arr_name}'`;
          return;
        }

        for (let i = 0; i < arr.length; i++) {
          let regexs = [];
          for (let k in arr[i]) {
            regexs.push({
              name: k,
              reg: new RegExp(`%${k}%`, 'g')
            });
          }

          let curr = format;
          regexs.forEach(r => {
            let rep = arr ? arr[i][r.name] : 'undefined';
            curr = curr.replace(r.reg, rep);
          });
          sc_lua_out += curr + '\n';
        }
      },
      env(var_name: string) {
        let ret = _lua_data[var_name];
        console.log('Env: ', var_name, ret);
        return ret || `Fenix error: Undefined variable '${var_name}'`;
      }
    });
    this._lua.loadLib('fnx', fenixLib);

    let openIndex = inputStr.indexOf('<$');

    while (openIndex > 0) {
      const closeIndex = inputStr.indexOf('$>');
      let parsing = inputStr.substring(openIndex, closeIndex + 2);

      sc_lua_out = '';
      this._lua.parse(parsing.substring(2, parsing.length - 2)).exec();
      inputStr = inputStr.replace(parsing, sc_lua_out);

      openIndex = inputStr.indexOf('<$');
    }

    return inputStr;
  }
}