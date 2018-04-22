export interface IConfig {
    frontend: Staticless.Config.IFrontend;

    server: {
        address: string;
        port: number;
    };

    sources: ISourceConfig[];

    cache: {
        /**
         * How long an item should be cached in minutes.
         * If set to 0, caching will be disabled.
         */
        time: number;
    };
}

export interface ISourceConfig {
    name: string;
    homeslug: string;
    url: string;
    apitoken: string;
    projectid: string;
}
