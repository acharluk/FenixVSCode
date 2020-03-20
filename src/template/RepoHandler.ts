import FenixConfig from '../configuration/FenixConfig';
import fetch from 'node-fetch';

export default class RepoHandler {
    _config: FenixConfig;
    _templateList: any[]; //TODO: Template[]

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

        console.log(this._templateList);
        return this._templateList;
    }

    getLangs() {
        const langs: any[] = [];

        this._templateList.forEach(t => {
            if (langs.includes(t.language)) {
                langs[langs.indexOf(t.language)].count++;
            } else {
                langs.push({
                    name: t.language,
                    count: 1
                });
            }
        });

        return langs;
    }

    getCategories() {
        const categories: any[] = [];

        for (let categoryList of this._templateList.map(t => t.categories)) {
            categoryList.forEach((category: string[]) => {
                if (categories.includes(categories)) {
                    categories[categories.indexOf(category)].count++;
                } else {
                    categories.push({
                        name: category,
                        count: 1
                    });
                }
            });
        }

        return categories;
    }
}