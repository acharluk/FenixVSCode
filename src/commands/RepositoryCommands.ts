import * as vscode from 'vscode';
import FenixConfig from '../configuration/FenixConfig';
import RepositoryTreeItem from '../providers/RepositoryTreeItem';

export default {
  'fenix.repo.delete': async (e: RepositoryTreeItem) => {
    const response = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: `Do you want to delete '${e.label}'?`,
    });

    if (response === 'Yes' && e.repoName) {
      FenixConfig.get().removeRepo(e.repoName);
    }
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