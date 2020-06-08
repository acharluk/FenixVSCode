import EnvironmentCommands from './EnvironmentCommands';
import RecommendedCommands from './RecommendedCommands';
import RepositoryCommands from './RepositoryCommands';
import TemplateCommands from './TemplateCommands';

export default {
  ...EnvironmentCommands,
  ...RecommendedCommands,
  ...RepositoryCommands,
  ...TemplateCommands,
};