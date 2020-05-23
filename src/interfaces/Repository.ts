import Template from './Template';

export default class Repository {
  $schema: string;
  repoUrl: string;
  repoName: string;
  author: string;
  version: number;
  templates: Template[];

  constructor() {
    this.$schema = '';
    this.repoUrl = '';
    this.repoName = '';
    this.author = '';
    this.version = 0;
    this.templates = [];
  }
}