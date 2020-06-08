import FenixConfig from '../core/FenixConfig';
import Fenix from '../core/Fenix';
import RecommendedTreeItem from "../providers/RecommendedTreeItem";

export default {
  'fenix.recommended.add': async (e: RecommendedTreeItem) => {
    await FenixConfig.get().addRepo(e.url);
    Fenix.get().getViewContainer().recommendedProvider.refresh();
    Fenix.get().refreshWebView();
  },
};