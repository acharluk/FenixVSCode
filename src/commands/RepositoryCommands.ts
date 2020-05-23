import * as vscode from 'vscode';
import RepositoryTreeItem from '../providers/RepositoryTreeItem';
import FenixConfig from '../configuration/FenixConfig';

export default {
  'fenix.repo.delete': (e: RepositoryTreeItem) => {
    const response = vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Do you want to delete '${e.label}'?`,
    });

    console.log(response);
  },
  'fenix.repo.add': async () => {
    const repoURL = await vscode.window.showInputBox({
      placeHolder: 'Enter the repository URL',
    });
    if (repoURL) {
      FenixConfig.get().addRepo(repoURL);
    }
  },
};