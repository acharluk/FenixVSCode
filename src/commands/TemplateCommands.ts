import * as vscode from 'vscode';
import RepositoryTreeItem from '../providers/RepositoryTreeItem';
import FenixConfig from '../configuration/FenixConfig';
import QuickCreateTreeItem from '../providers/QuickCreateTreeItem';
import Fenix from '../Fenix';

export default {
  'fenix.template.run': (e: QuickCreateTreeItem) => {
    Fenix.get().handleWebviewEvent({
      command: 'create',
      id: e.template.id,
    });
  },
  'fenix.template.fav': (e: RepositoryTreeItem) => {
    if (e.id) {
      FenixConfig.get().togglePinned(e.id);
    }
  },
  'fenix.template.share': (e: RepositoryTreeItem) => {
    vscode.env.openExternal(
      vscode.Uri.parse(`https://twitter.com/intent/tweet?text=Check out this Fenix template! ${e.label}&url=https://github.com/ACharLuk/Fenix`)
    );
  },
};