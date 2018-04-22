declare namespace Client {
    interface IConfigState {
        loaded: boolean;
        loading: boolean;
        config?: Staticless.Config.IFrontend;
        sources: Staticless.Config.ISource[];
        selectedSource?: Staticless.Config.ISource;
        error?: Error;
    }

    interface IConfigPayload {
        config: Staticless.Config.IFrontend;
        sources: Staticless.Config.ISource[];
    }
}
