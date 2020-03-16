import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { join } from 'path';

export default class FenixParser {
  private _data: any;
  private _page: string;

  constructor(extensionContext: vscode.ExtensionContext,viewName: string) {
    const viewPath = join(extensionContext.extensionPath, 'views', viewName);
    
    this._data = {};
    this._page = readFileSync(viewPath).toString();
  }

  push(key: string, value: any) {
    this._data[key] = value;
  }

  render() {
    let vars = this.nextVar();
		while (vars !== null) {
			if (vars.groups) {
				this._page = this._page.replace(vars[0], this._data[vars.groups.var_name]);
			}

			vars = this.nextVar();
    }

    let fors = this.nextFor();
    while (fors !== null) {
      if (fors.groups) {
        let { var_name, tag, format } = fors.groups;

        if (this._data[var_name]) {
          let result = '';
          for (let val of this._data[var_name]) {
            result += `<${tag}>${format.replace('$value', val)}</${tag}>`;
          }

          this._page = this._page.replace(fors[0], result);
        }
      }

      fors = this.nextFor();
    }
    
    return this._page;
  }

  private nextVar() {
    // Example: $var{hello}
    return this._page.match(/\$var{\s*(?<var_name>.+?)\s*}/);
  }

  private nextFor() {
    // Example: $for{names}{li}{Name: $value}
    return this._page.match(/\$for{\s*(?<var_name>.+?)\s*}{\s*(?<tag>.+?)\s*}{\s*(?<format>.+?)\s*}/);
  }
}