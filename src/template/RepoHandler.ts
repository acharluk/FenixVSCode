import FenixConfig from '../configuration/FenixConfig';
import fetch from 'node-fetch';

export default class RepoHandler {
    _config: FenixConfig;
    _templateList: string[]; //TODO: Template[]

    constructor(config: FenixConfig) {
        this._config = config;
        this._templateList = [];
    }

    async getTemplates() {
        this._templateList = [];
        await Promise.all(
            this._config.getRepos().map(async (repo) => {
                let remote = await fetch(repo);
                let json = await remote.json();

                this._templateList.push(...json.templates);
            })
        );
        
        return this._templateList;
    }
}