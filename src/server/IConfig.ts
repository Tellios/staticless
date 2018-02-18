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

    cache: {
        /**
         * How long an item should be cached in minutes.
         * If set to 0, caching will be disabled.
         */
        time: number;
    };
}
