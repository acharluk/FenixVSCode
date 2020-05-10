export default interface Template {
    id: string;
    displayName: string;
    description: string;
    language: string;
    categories: string[];
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
}