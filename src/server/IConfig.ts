export interface IConfig {
    frontend: Staticless.Config.Frontend;

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
