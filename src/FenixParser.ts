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
    const _lua_data = this._data;
    let sc_lua_out = '';

    function superRender(something: any, format?: string) {
      format = format || '%value%';
  
      if (typeof something === 'object') {
          if (Array.isArray(something)) {
              something.forEach(s => superRender(s, format));
          } else {
              let obj = something;
              const regexList = [];
              for (let key of Object.keys(obj)) {
                  regexList.push({
                      name: key,
                      reg: new RegExp(`%${key}%`, 'g')
                  });
              }
              
              let ret = format;
              regexList.forEach(r => {
                  ret = ret.replace(r.reg, something[r.name]);
              });
              
              sc_lua_out += ret;
          }
      } else {
          sc_lua_out = format.replace(/%value%/g, something);
      }
  }

    const fenixLib = new luajs.Table({
      render(var_name: string, format?: string) {
        superRender(_lua_data[var_name] || `Fenix error: Undefined variable '${var_name}'`, format);
      },
      env(var_name: string) {
        return _lua_data[var_name] || `Fenix error: Undefined variable '${var_name}'`;
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