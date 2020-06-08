import * as luajs from 'lua-in-js';
import FenixConfig from './FenixConfig';


export default class FenixParser {
  private _data: any;
  private _lua: any;

  private static __instance: FenixParser;
  static init(): void {
    if (!this.__instance) {
      this.__instance = new FenixParser();
    }
  }

  static get(): FenixParser {
    return this.__instance;
  }

  private constructor() {
    this._data = {};
    this._lua = luajs.createEnv();
  }

  pushEnv() {
    this.clear();
    const env = FenixConfig.get().getEnv();
    for (let k in env) {
      this.push(k, env[k]);
    }
  }

  push(key: string, value: any): void {
    this._data[key] = value;
  }

  get(key: string): any {
    return this._data[key];
  }

  clear(): void {
    this._data = {};
  }

  renderRaw(inputStr: string, environment: any): string {
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
              reg: new RegExp(`%${key}%`, 'g'),
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
        superRender(_lua_data[var_name] !== undefined ? _lua_data[var_name] : environment.find((e: any) => e.id === var_name).default || `<undefined_fenix_variable:${var_name}>`, format);
      },
      env(var_name: string) {
        return _lua_data[var_name] || `<undefined_fenix_variable:${var_name}>`;
      },
      date(format: string) {
        superRender(new Date().toLocaleDateString(format).toString());
      },
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