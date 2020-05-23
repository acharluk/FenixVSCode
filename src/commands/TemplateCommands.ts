import * as vscode from 'vscode';

export default {
  'fenix.template.fav': (e: any) => { console.log(e); vscode.window.showInformationMessage('Fav/unfav -> ' + e.label); },
  'fenix.template.share': (e: any) => {
    console.log(e);
    vscode.env.openExternal(
      vscode.Uri.parse(`https://twitter.com/intent/tweet?text=Check out this Fenix template! ${e.label}&url=https://github.com/ACharLuk/Fenix`)
    );
  },
};