import { readFileSync } from 'fs';
import { join } from 'path';
import FenixConfig from './configuration/FenixConfig';

import * as luajs from 'lua-in-js';

export default class FenixParser {
  private _extensionPath: string;
  private _data: any;
  private _lua: any;

  private static __instance: FenixParser;
  static init(extensionContextPath: string): FenixParser {
    if (!this.__instance) {
      this.__instance = new FenixParser(extensionContextPath);
    }
    return this.__instance;
  }

  static get(): FenixParser {
    return this.__instance;
  }

  private constructor(extensionContextPath: string) {
    this._extensionPath = extensionContextPath;
    this._data = {};
    this._lua = luajs.createEnv();
  }

  pushEnv() {
    const env = FenixConfig.get().getEnv();
    for (let k in env) {
      this.push(k, env[k]);
    }
  }

  push(key: string, value: any): void {
    this._data[key] = value;
  }

  get(keyy: string) {
    return this._data[keyy];
  }

  clear(): void {
    this._data = {};
  }

  render(viewName: string): string {
    const viewPath = join(this._extensionPath, 'views', viewName);
    let page = readFileSync(viewPath).toString();

    return this.renderRaw(page);
  }

  renderRaw(inputStr: string): string {
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
        sc_lua_out += format.replace(/%value%/g, something);
      }
    }

    const fenixLib = new luajs.Table({
      render(var_name: string, format?: string) {
        superRender(_lua_data[var_name] !== undefined ? _lua_data[var_name] : `Fenix error: Undefined variable '${var_name}'`, format);
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