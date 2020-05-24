import FenixConfig from '../configuration/FenixConfig';
import Fenix from '../Fenix';
import RecommendedTreeItem from "../providers/RecommendedTreeITem";

export default {
  'fenix.recommended.add': async (e: RecommendedTreeItem) => {
    await FenixConfig.get().addRepo(e.url);
    Fenix.get().getViewContainer().recommendedProvider.refresh();
  },
};