import * as vscode from 'vscode';
import RepositoryTreeItem from '../providers/RepositoryTreeItem';
import FenixConfig from '../core/FenixConfig';
import QuickCreateTreeItem from '../providers/QuickCreateTreeItem';
import Fenix from '../core/Fenix';

export default {
  'fenix.template.run': (e: QuickCreateTreeItem) => {
    Fenix.get().handleWebviewEvent({
      command: 'create',
      id: e.template.id,
    });
  },
  'fenix.template.fav': (e: RepositoryTreeItem | QuickCreateTreeItem) => {
    if (e.id) {
      FenixConfig.get().togglePinned(e.id);
    } else if (e instanceof QuickCreateTreeItem && e.template) {
      FenixConfig.get().togglePinned(e.template.id);
    }
  },
  'fenix.template.share': (e: RepositoryTreeItem) => {
    vscode.env.openExternal(
      vscode.Uri.parse(`https://twitter.com/intent/tweet?text=Check out this Fenix template! ${e.label}&url=https://github.com/ACharLuk/Fenix`)
    );
  },
};