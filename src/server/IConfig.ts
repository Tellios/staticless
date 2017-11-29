export interface IConfig {
    frontend: Staticless.Config.IFrontend;

    server: {
        address: string;
        port: number;
    };

    gitlab: {
        url: string;
        apiToken: string;
        projectId: string;
    };
}
