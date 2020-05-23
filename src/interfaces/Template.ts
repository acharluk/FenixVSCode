export default class Template {
    id: string;
    displayName: string;
    description: string;
    language: string;
    category: string[];
    img?: string;
    directories: string[];
    files: {
        create: string[];
        download: { from: string, to: string }[];
        open: string[];
    };
    command?: string | {
        linux: string;
        windows: string;
        macos: string;
        [os_name: string]: string;
    };
    environment?: {
        id: string
        title: string;
        description: string;
        default?: string;
    }[];
    repoName?: string;
    repoUrl?: string;
    author?: string;
    hasForm?: string;
    parent?: string;

    constructor() {
        this.id = '';
        this.displayName = '';
        this.description = '';
        this.language = '';
        this.category = [];
        this.directories = [];
        this.files = {
            create: [],
            download: [],
            open: []
        };
    }
}