import * as vscode from 'vscode';
import FenixConfig from '../core/FenixConfig';
import RepositoryTreeItem from '../providers/RepositoryTreeItem';
import Fenix from '../core/Fenix';

export default {
  'fenix.repo.delete': async (e: RepositoryTreeItem) => {
    const response = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Do you want to delete '${e.label}'?`,
    });

    if (response === 'Yes' && e.repoName) {
      await FenixConfig.get().removeRepo(e.repoName);
      Fenix.get().refreshWebView();
    }
  },
  'fenix.repo.add': async () => {
    const repoURL = await vscode.window.showInputBox({
      placeHolder: 'Enter the repository URL',
    });
    if (repoURL) {
      await FenixConfig.get().addRepo(repoURL);
      Fenix.get().refreshWebView();
    }
  },
};