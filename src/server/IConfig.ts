export interface IConfig {
    frontend: Staticless.Config.Frontend;

    gitlab: {
        url: string;
        apiToken: string;
        projectId: string;
        projectPath: string;
    };
}
