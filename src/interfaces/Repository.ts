import Template from "./Template";

export default interface Repository {
    $schema: string;
    repoUrl: string;
    repoName: string;
    author: string;
    version: number;
    templates: Template[];
}